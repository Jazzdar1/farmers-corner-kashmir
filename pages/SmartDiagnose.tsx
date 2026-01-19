
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Zap, 
  X, 
  Image as ImageIcon, 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  Stethoscope, 
  Microscope, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle as WhatsAppIcon,
  Sparkles,
  Info,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity,
  AlertTriangle,
  Flame
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeCropDisease, generateUrduDiagnosisAudio, getDeepExpertView } from '../services/gemini';
import { DiseaseAnalysis } from '../types';

// Audio decoding utilities for raw PCM
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const SmartDiagnose: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'camera'>('camera');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [expertView, setExpertView] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [showExpertDetails, setShowExpertDetails] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [activeSeverityPreview, setActiveSeverityPreview] = useState<'Low' | 'Medium' | 'High'>('Low');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Camera access denied. Please allow permissions or use upload.");
      setMode('upload');
    }
  };

  useEffect(() => {
    if (mode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  useEffect(() => {
    if (analysis) {
      setActiveSeverityPreview(analysis.severity as any);
    }
  }, [analysis]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    setImage(base64);
    processAnalysis(base64);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        processAnalysis(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const processAnalysis = async (imgBase64: string) => {
    setLoading(true);
    setAnalysis(null);
    setExpertView(null);
    setError(null);
    setAudioBase64(null);
    setIsPlaying(false);
    
    try {
      const dataOnly = imgBase64.split(',')[1];
      
      const result = await analyzeCropDisease(dataOnly, 'ur');
      setAnalysis(result);
      
      const deepView = await getDeepExpertView(dataOnly, result.diseaseName);
      setExpertView(deepView);
      
      const voiceData = await generateUrduDiagnosisAudio(result);
      if (voiceData) {
        setAudioBase64(voiceData);
        await playUrduReport(voiceData);
      }
    } catch (err) {
      setError("Analysis failed. Please ensure the plant part is clearly visible and try again.");
    } finally {
      setLoading(false);
    }
  };

  const playUrduReport = async (base64: string) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(base64), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(false);
      setIsPlaying(true);
      source.start();
    } catch (e) {
      console.error("Audio playback error:", e);
      setIsPlaying(false);
    }
  };

  const submitToExpert = () => {
    if (!analysis) return;
    setShowToast(true);
    const expertPhone = "7006686584";
    const text = `*FCK SMART DIAGNOSE REPORT (SKUAST-K)*\n\n` +
      `*Detected:* ${analysis.diseaseName}\n` +
      `*Severity:* ${analysis.severity}\n` +
      `*Description:* ${analysis.description}\n\n` +
      `*SKUAST-K Recommendations:* \n${analysis.treatment.map(t => "• " + t).join("\n")}\n\n` +
      `Farmer is requesting your expert review. Attached photo in link below.`;
    window.open(`https://wa.me/91${expertPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const severityConfigs = {
    Low: { 
      color: 'emerald', 
      label: 'Early Stage', 
      desc: 'Mild symptoms detected. Easily treatable with preventive measures and light organic sprays.',
      icon: CheckCircle2,
      accentClass: 'bg-emerald-600',
      ringClass: 'ring-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-100',
      lightBg: 'bg-emerald-50'
    },
    Medium: { 
      color: 'amber', 
      label: 'Spreading', 
      desc: 'Pathogen is established. Requires immediate application of SKUAST-K recommended fungicides.',
      icon: AlertTriangle,
      accentClass: 'bg-amber-500',
      ringClass: 'ring-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-100',
      lightBg: 'bg-amber-50'
    },
    High: { 
      color: 'rose', 
      label: 'Critical', 
      desc: 'Severe damage detected. High risk of crop loss. Requires intensive treatment and expert consultation.',
      icon: Flame,
      accentClass: 'bg-rose-600',
      ringClass: 'ring-rose-50',
      textClass: 'text-rose-700',
      borderClass: 'border-rose-100',
      lightBg: 'bg-rose-50'
    }
  };

  const getProgressWidth = (sev: 'Low' | 'Medium' | 'High') => {
    if (sev === 'Low') return '0%';
    if (sev === 'Medium') return '50%';
    return '100%';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl ring-4 ring-emerald-100">
            <Microscope className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-heading font-bold text-slate-900">SmartDiagnose Pro</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-emerald-700 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">SKUAST-K Standards</span>
              <span className="text-blue-700 text-[10px] font-black uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                <Zap className="w-2 h-2 fill-current" /> Gemini AI Vision
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
          <button 
            onClick={() => setMode('camera')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'camera' ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <Camera className="w-4 h-4" /> Live Capture
          </button>
          <button 
            onClick={() => setMode('upload')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${mode === 'upload' ? 'bg-emerald-900 text-white shadow-lg' : 'text-slate-400'}`}
          >
            <Upload className="w-4 h-4" /> Gallery
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 space-y-6">
          <div className="relative bg-slate-950 rounded-[3rem] overflow-hidden shadow-2xl aspect-square flex items-center justify-center group ring-8 ring-white">
            {mode === 'camera' && !image && (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover opacity-80"
              />
            )}
            {mode === 'upload' && !image && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="text-center p-12 cursor-pointer hover:scale-105 transition-transform"
              >
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                  <ImageIcon className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-white font-bold text-xl">Upload Plant Photo</h3>
                <p className="text-slate-400 mt-2 text-sm font-medium">Click to browse your gallery</p>
              </div>
            )}
            {image && (
              <img src={image} alt="Captured Crop" className="w-full h-full object-cover animate-in fade-in duration-500" />
            )}

            {!loading && mode === 'camera' && !image && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-72 h-72 border-2 border-emerald-400/20 rounded-[4rem] relative">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-[2rem]" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-[2rem]" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-[2rem]" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-[2rem]" />
                  <div className="absolute inset-x-0 h-[2px] bg-emerald-400/50 shadow-[0_0_20px_rgba(52,211,153,0.5)] animate-scan-line top-1/2" />
                </div>
              </div>
            )}

            {loading && (
              <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 z-20">
                <div className="relative mb-8">
                  <div className="w-24 h-24 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                  <Microscope className="absolute inset-0 m-auto w-10 h-10 text-emerald-400 animate-pulse" />
                </div>
                <h4 className="text-white font-bold text-2xl tracking-tight">AI Diagnostic Lab</h4>
                <p className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px] mt-3 animate-pulse">Scanning with SKUAST-K Database...</p>
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {mode === 'camera' && !image ? (
              <button 
                onClick={capturePhoto}
                className="flex-1 bg-emerald-600 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-emerald-500 transition-all active:scale-95 text-lg"
              >
                <Camera className="w-6 h-6" /> Take Diagnostic Photo
              </button>
            ) : (
              <button 
                onClick={() => { setImage(null); setAnalysis(null); setError(null); setExpertView(null); setIsPlaying(false); }}
                className="flex-1 bg-slate-900 text-white py-5 rounded-[2rem] font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl text-lg"
              >
                <RefreshCw className="w-6 h-6" /> Start New Diagnosis
              </button>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
          <canvas ref={canvasRef} className="hidden" />
          
          <div className="bg-amber-50 p-6 rounded-[2.5rem] border border-amber-100 flex items-start gap-4">
            <Info className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-bold text-amber-900">Lab Tip</h5>
              <p className="text-xs text-amber-800 font-medium leading-relaxed">
                Hold the camera steady and ensure the leaf/part is well-lit. Zoom in slightly if possible to capture fungus spots or insect markings clearly.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          {error && (
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem] text-rose-800 space-y-4 shadow-sm animate-in zoom-in-95">
              <AlertCircle className="w-10 h-10 text-rose-500" />
              <h4 className="text-xl font-bold">Lab Error</h4>
              <p className="font-medium">{error}</p>
            </div>
          )}

          {!analysis && !loading && !error && (
            <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm text-center space-y-8 flex flex-col items-center justify-center min-h-[500px]">
              <div className="w-32 h-32 bg-emerald-50 rounded-[3rem] flex items-center justify-center text-emerald-600/30">
                <Stethoscope className="w-16 h-16" />
              </div>
              <div className="space-y-4 max-w-sm">
                <h4 className="text-2xl font-bold text-slate-900">Diagnostic Hub Ready</h4>
                <p className="text-slate-500 font-medium leading-relaxed">
                  Our advanced AI laboratory will analyze your crop using Sher-e-Kashmir University (SKUAST) parameters. Results will be announced in Urdu.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified Data
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                  <Volume2 className="w-4 h-4 text-blue-500" /> Voice Enabled
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500 pb-10">
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${
                        analysis.severity === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        <ShieldAlert className="w-3.5 h-3.5" /> {analysis.severity} Risk Detected
                      </span>
                      <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                        {Math.round(analysis.confidence * 100)}% Match
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <Link 
                        to={`/knowledge?search=${encodeURIComponent(analysis.diseaseName)}`}
                        className="group"
                      >
                        <h3 className="text-4xl font-bold text-slate-900 leading-tight tracking-tight group-hover:text-emerald-700 group-hover:underline transition-all">{analysis.diseaseName}</h3>
                      </Link>
                      <Link 
                        to={`/knowledge?search=${encodeURIComponent(analysis.diseaseName)}`}
                        className="p-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-emerald-100"
                      >
                        <BookOpen className="w-4 h-4" /> Hub
                      </Link>
                    </div>
                  </div>
                  <button 
                    onClick={() => audioBase64 && playUrduReport(audioBase64)}
                    className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all shadow-xl ${isPlaying ? 'bg-emerald-600 text-white animate-pulse ring-8 ring-emerald-50' : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100'}`}
                  >
                    {isPlaying ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
                  </button>
                </div>

                <div className="mb-10 bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-8 relative">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 flex items-center gap-2 text-lg">
                      <Activity className="w-6 h-6 text-emerald-600" /> Disease Severity Map
                    </h5>
                    <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 text-[9px] font-black uppercase text-slate-400 tracking-[0.2em] shadow-sm">
                      Interactive Analysis
                    </div>
                  </div>
                  
                  <div className="relative pt-6 pb-4 px-2">
                    {/* Background Track */}
                    <div className="absolute top-[48px] left-8 right-8 h-2.5 bg-slate-200 rounded-full shadow-inner" />
                    
                    {/* Active Progress Track */}
                    <div 
                      className={`absolute top-[48px] left-8 h-2.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(0,0,0,0.1)] ${severityConfigs[activeSeverityPreview].accentClass}`}
                      style={{ width: `calc(${getProgressWidth(activeSeverityPreview)} - 16px)` }}
                    />

                    <div className="relative flex justify-between">
                      {(['Low', 'Medium', 'High'] as const).map((sev) => {
                        const config = severityConfigs[sev];
                        const Icon = config.icon;
                        const isActive = activeSeverityPreview === sev;
                        
                        return (
                          <button
                            key={sev}
                            onClick={() => setActiveSeverityPreview(sev)}
                            className="group flex flex-col items-center gap-4 relative z-10 transition-transform duration-300 hover:scale-110 active:scale-95"
                          >
                            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all duration-500 shadow-xl border-2 ${
                              isActive 
                                ? `${config.accentClass} text-white border-white ring-8 ${config.ringClass}` 
                                : 'bg-white text-slate-300 border-slate-100'
                            }`}>
                              <Icon className={`w-7 h-7 transition-transform duration-500 ${isActive ? 'scale-110 rotate-0' : 'scale-90 opacity-60'}`} />
                            </div>
                            
                            <div className="flex flex-col items-center gap-1">
                              <span className={`text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                                isActive ? config.textClass : 'text-slate-400'
                              }`}>
                                {sev}
                              </span>
                              <div className={`w-1 h-1 rounded-full transition-all duration-500 ${isActive ? config.accentClass : 'bg-transparent'}`} />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    
                    <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-700">
                      <div className={`bg-white border-2 p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex flex-col gap-5 transition-all duration-500 ${severityConfigs[activeSeverityPreview].borderClass}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${severityConfigs[activeSeverityPreview].accentClass}`} />
                            <span className={`text-sm font-black uppercase tracking-widest ${severityConfigs[activeSeverityPreview].textClass}`}>
                              {severityConfigs[activeSeverityPreview].label}
                            </span>
                          </div>
                          <Link 
                            to={`/knowledge?search=${encodeURIComponent(analysis.diseaseName + ' ' + activeSeverityPreview)}`}
                            className={`p-2.5 ${severityConfigs[activeSeverityPreview].lightBg} ${severityConfigs[activeSeverityPreview].textClass} rounded-2xl hover:opacity-80 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border ${severityConfigs[activeSeverityPreview].borderClass}`}
                          >
                            Science Guide <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                        <p className="text-slate-600 text-sm font-medium leading-relaxed">
                          {severityConfigs[activeSeverityPreview].desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                    <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Observations</h5>
                    <p className="text-slate-700 font-medium leading-relaxed italic">
                      "{analysis.description}"
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <h5 className="font-bold text-slate-900 flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      </div>
                      SKUAST-K Treatment Protocol
                    </h5>
                    <div className="grid grid-cols-1 gap-3">
                      {analysis.treatment.map((t, i) => (
                        <div key={i} className="flex gap-4 p-5 bg-white border border-emerald-50 rounded-2xl shadow-sm items-start hover:border-emerald-200 transition-colors">
                          <div className="w-7 h-7 bg-emerald-700 text-white rounded-lg flex items-center justify-center shrink-0 font-black text-xs">
                            {i+1}
                          </div>
                          <p className="text-sm font-bold text-slate-700 leading-snug">{t}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {expertView && (
                  <div className="mt-8 border-t border-slate-100 pt-8">
                    <button 
                      onClick={() => setShowExpertDetails(!showExpertDetails)}
                      className="w-full flex items-center justify-between p-6 bg-emerald-900 rounded-3xl text-white shadow-xl hover:bg-emerald-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-emerald-400" />
                        <span className="font-bold text-lg">Deep Gemini Expert View</span>
                      </div>
                      {showExpertDetails ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                    </button>
                    
                    {showExpertDetails && (
                      <div className="mt-4 p-8 bg-slate-900 rounded-[2.5rem] text-slate-100 border border-white/10 animate-in slide-in-from-top-4 duration-300">
                        <div className="prose prose-invert max-w-none">
                          <div className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {expertView}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-emerald-50 p-10 rounded-[3.5rem] border-2 border-emerald-100 space-y-8 shadow-xl relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md shrink-0 ring-4 ring-emerald-100">
                    <HelpCircle className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Kya aap ko mazeed madad chahiye?</h4>
                    <p className="text-emerald-800/70 text-sm font-medium leading-relaxed">
                      If you have follow-up questions about this diagnosis or need help sourcing these SKUAST-recommended pesticides in your area.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link 
                    to={`/expert?q=Explain SKUAST-K treatment for ${analysis.diseaseName}`}
                    className="bg-white hover:bg-emerald-600 hover:text-white text-emerald-900 border-2 border-emerald-100 p-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all group font-bold"
                  >
                    <span>Detailed Chat with AI</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button 
                    onClick={submitToExpert}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-5 rounded-[2rem] flex items-center justify-center gap-3 transition-all shadow-lg font-bold"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>Submit to Lab Expert</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-emerald-900 text-white px-8 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border-2 border-emerald-500/30 backdrop-blur-xl">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-tight">Report Compiled Successfully</p>
              <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mt-0.5">Opening WhatsApp to contact Expert...</p>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes scan-line {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        .animate-scan-line {
          position: absolute;
          animation: scan-line 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default SmartDiagnose;
