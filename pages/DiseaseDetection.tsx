
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  Info, 
  Zap, 
  X, 
  Image as ImageIcon, 
  Scan, 
  Activity, 
  ShieldAlert, 
  ExternalLink,
  Share2,
  MessageCircle,
  User,
  MapPin,
  Send,
  BookOpen,
  MessageCircle as WhatsAppIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { analyzeCropDisease } from '../services/gemini';
import { DiseaseAnalysis } from '../types';

const DiseaseDetection: React.FC = () => {
  const [mode, setMode] = useState<'upload' | 'live'>('live');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<DiseaseAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isContinuous, setIsContinuous] = useState(false);
  
  // WhatsApp Sharing State
  const [showShareForm, setShowShareForm] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    location: '',
    orchardType: 'Apple'
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const continuousIntervalRef = useRef<number | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (continuousIntervalRef.current) {
      clearInterval(continuousIntervalRef.current);
      continuousIntervalRef.current = null;
    }
  };

  useEffect(() => {
    if (mode === 'live') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode]);

  useEffect(() => {
    if (isContinuous && mode === 'live') {
      continuousIntervalRef.current = window.setInterval(() => {
        if (!loading) captureFrame();
      }, 7000);
    } else if (continuousIntervalRef.current) {
      clearInterval(continuousIntervalRef.current);
    }
    return () => {
      if (continuousIntervalRef.current) clearInterval(continuousIntervalRef.current);
    };
  }, [isContinuous, mode, loading]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setMode('upload');
    }
  };

  const captureFrame = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL('image/jpeg', 0.7);
    if (!isContinuous) setImage(base64);
    await processImage(base64);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        setAnalysis(null);
        setError(null);
        processImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imgToProcess?: string) => {
    const finalImage = imgToProcess || image;
    if (!finalImage) return;
    
    setLoading(true);
    try {
      const base64Data = finalImage.split(',')[1];
      const result = await analyzeCropDisease(base64Data);
      setAnalysis(result);
      setError(null);
    } catch (err) {
      if (!isContinuous) setError('Analysis failed. Try a clearer photo.');
    } finally {
      setLoading(false);
    }
  };

  const handleShareToWhatsApp = () => {
    if (!analysis) return;

    const expertPhone = "7006686584";
    const message = `*🌱 FARMER'S CORNER KASHMIR - AGRI REPORT*\n\n` +
      `*👤 Farmer Name:* ${userData.name || 'Not Provided'}\n` +
      `*📍 Location:* ${userData.location || 'Not Provided'}\n` +
      `*🌳 Orchard Type:* ${userData.orchardType}\n` +
      `----------------------------------\n` +
      `*🔍 AI DETECTION RESULT*\n` +
      `*Disease:* ${analysis.diseaseName}\n` +
      `*Severity:* ${analysis.severity}\n` +
      `*AI Confidence:* ${(analysis.confidence * 100).toFixed(0)}%\n\n` +
      `*📝 AI Advice Summary:*\n` +
      `${analysis.treatment[0]}\n\n` +
      `*Expert: TOWSEEF AHMAD, please review this report.*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${expertPhone}?text=${encodedMessage}`, '_blank');
    setShowShareForm(false);
  };

  const reset = () => {
    setImage(null);
    setAnalysis(null);
    setError(null);
    setIsContinuous(false);
    setShowShareForm(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-10 animate-in fade-in duration-500 pb-10">
      <header className="text-center space-y-2">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold text-slate-900">Disease Detection Pro</h2>
        <p className="text-slate-500 font-medium">Identify 100+ pests and diseases common to the Kashmir valley.</p>
        
        <div className="flex items-center justify-center gap-2 pt-4">
          <button 
            onClick={() => { setMode('live'); reset(); }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${mode === 'live' ? 'bg-emerald-800 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
            <Zap className="w-4 h-4" /> Live Camera
          </button>
          <button 
            onClick={() => { setMode('upload'); reset(); }}
            className={`px-5 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${mode === 'upload' ? 'bg-emerald-800 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-100'}`}
          >
            <ImageIcon className="w-4 h-4" /> File Upload
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Visual Input Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-emerald-900/10 aspect-video md:aspect-square lg:aspect-video flex items-center justify-center">
            {mode === 'live' ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
            ) : (
              image ? (
                <img src={image} alt="Crop" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-10">
                  <div className="w-20 h-20 bg-emerald-800/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                    <Upload className="w-8 h-8 text-emerald-400" />
                  </div>
                  <p className="text-white font-bold text-lg">Upload Plant Photo</p>
                  <p className="text-slate-400 text-sm mt-1">Tap the button below to select from gallery</p>
                </div>
              )
            )}
            
            {/* Viewfinder HUD */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-[20px] border-black/10 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-emerald-400/40 rounded-[3rem] relative">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
                  {loading && <div className="absolute inset-0 bg-emerald-400/10 animate-pulse rounded-[3rem]" />}
                  {isContinuous && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                    <Activity className="w-3 h-3 animate-ping" /> Auto-Scanning
                  </div>}
                </div>
              </div>
            </div>

            {loading && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl">
                <RefreshCw className="w-5 h-5 text-emerald-400 animate-spin" />
                <span className="text-white text-sm font-bold uppercase tracking-widest">Analyzing...</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {mode === 'live' ? (
              <>
                <button
                  onClick={captureFrame}
                  disabled={loading}
                  className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  <Camera className="w-6 h-6" /> Take Live Photo & Scan
                </button>
                <button
                  onClick={() => setIsContinuous(!isContinuous)}
                  className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 border-2 transition-all ${
                    isContinuous 
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400 shadow-inner' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-700'
                  }`}
                >
                  <Scan className={`w-6 h-6 ${isContinuous ? 'animate-pulse' : ''}`} /> 
                  {isContinuous ? 'Stop Auto-Scan' : 'Enable Auto-Scan'}
                </button>
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all"
              >
                <Upload className="w-6 h-6" /> Select from Gallery
              </button>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-700 p-5 rounded-3xl flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-5 space-y-6">
          {!analysis && !loading ? (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-emerald-600/30">
                <Scan className="w-10 h-10" />
              </div>
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-slate-800">Agri-Detection Ready</h4>
                <p className="text-sm text-slate-500 leading-relaxed px-4">
                  Capture a photo of your leaf or crop. Our AI detects issues in Apple, Saffron, and more.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['Apples', 'Saffron', 'Walnuts', 'Cherries', 'Pears'].map(crop => (
                    <span key={crop} className="text-[10px] font-bold text-slate-400 border border-slate-100 px-3 py-1 rounded-full uppercase tracking-wider bg-slate-50">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-6 animate-in slide-in-from-right-10 duration-500">
              <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-emerald-50 relative overflow-hidden">
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex-1">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      analysis.severity === 'High' ? 'bg-rose-100 text-rose-700' :
                      analysis.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                      {analysis.severity} Risk Detected
                    </span>
                    <div className="flex items-center gap-3 mt-2">
                      <Link 
                        to={`/knowledge?search=${encodeURIComponent(analysis.diseaseName)}`}
                        className="group"
                      >
                        <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 group-hover:text-emerald-700 group-hover:underline transition-all">{analysis.diseaseName}</h3>
                      </Link>
                      <Link 
                        to={`/knowledge?search=${encodeURIComponent(analysis.diseaseName)}`}
                        className="p-2 bg-emerald-50 text-emerald-700 rounded-xl hover:bg-emerald-100 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest border border-emerald-100"
                      >
                        <BookOpen className="w-3.5 h-3.5" /> Hub
                      </Link>
                    </div>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl border border-emerald-100 text-center ml-4">
                    <span className="text-xl font-black">{(analysis.confidence * 100).toFixed(0)}%</span>
                    <span className="text-[9px] font-bold uppercase block">AI Match</span>
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium relative z-10 mb-6">{analysis.description}</p>
                
                <button 
                  onClick={() => setShowShareForm(true)}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all shadow-lg active:scale-95"
                >
                  <Share2 className="w-5 h-5" /> Share Report with Expert
                </button>
              </div>

              {/* Treatment Plan */}
              <div className="bg-emerald-800 p-8 rounded-[2.5rem] text-white shadow-2xl space-y-5">
                <h4 className="text-xl font-bold flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-xl"><RefreshCw className="w-5 h-5" /></div>
                  Recommended Treatment
                </h4>
                <div className="space-y-3">
                  {analysis.treatment.map((t, i) => (
                    <div key={i} className="flex gap-4 bg-white/10 p-4 rounded-2xl border border-white/5 items-start">
                      <div className="w-6 h-6 bg-emerald-400 text-emerald-950 rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
                        {i + 1}
                      </div>
                      <span className="text-sm lg:text-base font-medium text-emerald-50 leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Share Report Modal Form */}
      {showShareForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowShareForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="bg-emerald-900 p-8 text-white flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-emerald-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs font-black uppercase tracking-widest">Expert Consultation</span>
                </div>
                <h3 className="text-2xl font-bold">Share with Towseef Ahmad</h3>
              </div>
              <button onClick={() => setShowShareForm(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Farmer Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="e.g. Ahmad Shah"
                      value={userData.name}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Location / Village</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    <input 
                      type="text" 
                      placeholder="e.g. Sopore, Baramulla"
                      value={userData.location}
                      onChange={(e) => setUserData({...userData, location: e.target.value})}
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Orchard Type</label>
                  <select 
                    value={userData.orchardType}
                    onChange={(e) => setUserData({...userData, orchardType: e.target.value})}
                    className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all font-medium"
                  >
                    <option>Apple</option>
                    <option>Saffron</option>
                    <option>Walnut</option>
                    <option>Cherry</option>
                    <option>Vegetable</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                <p className="text-[10px] text-emerald-800 font-bold mb-2 uppercase">Report Preview:</p>
                <div className="text-xs text-emerald-700 leading-relaxed font-medium">
                  {analysis?.diseaseName} identified with {analysis ? (analysis.confidence * 100).toFixed(0) : 0}% confidence. Severity is {analysis?.severity}.
                </div>
              </div>

              <button 
                onClick={handleShareToWhatsApp}
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-emerald-500 transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                <WhatsAppIcon className="w-5 h-5" /> Send to Expert WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
