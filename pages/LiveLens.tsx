
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Camera, Zap, Mic, MicOff, RefreshCw, AlertCircle, X, ShieldAlert, ScanEye, Languages, CheckCircle2, Info, PlugZap, Upload, Image as ImageIcon } from 'lucide-react';
import { analyzeCropDisease } from '../services/gemini';
import { DiseaseAnalysis } from '../types';

// Audio Helpers
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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

const LiveLens: React.FC = () => {
  const [liveModeActive, setLiveModeActive] = useState(false); // New: Tracks if Gemini Live stream is active
  const [staticCamActive, setStaticCamActive] = useState(false); // New: Tracks if camera is active for a static photo
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [userTranscription, setUserTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false); // For camera/mic permissions
  const [language, setLanguage] = useState<'en' | 'ur' | 'hi'>('ur');
  
  // Detection State
  const [detectionResult, setDetectionResult] = useState<DiseaseAnalysis | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null); // To store captured static image

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null); // For gallery upload
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null); // Stores current MediaStream (live or static)
  const sessionRef = useRef<any>(null); // Stores Gemini Live session
  const frameIntervalRef = useRef<number | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef(0);

  // Helper to stop any active camera stream
  const stopVideoStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Helper to reset all states to initial values
  const resetStates = () => {
    stopVideoStream(); // Ensure video stream is stopped
    if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    if (sessionRef.current) sessionRef.current.close();
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    sessionRef.current = null;

    setLiveModeActive(false);
    setStaticCamActive(false);
    setLoading(false);
    setTranscription('');
    setUserTranscription('');
    setError(null);
    setPermissionDenied(false);
    setDetectionResult(null);
    setDetecting(false);
    setCapturedImage(null);
  };

  // Starts the full Gemini Live (streaming) experience
  const startLive = async () => {
    resetStates(); // Reset all states before starting
    setLoading(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Explicitly play the video stream
      }

      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setLiveModeActive(true); // Live mode is now active
            setLoading(false);
            setPermissionDenied(false); // Clear permission denied if successful

            // Increased frame capture rate for smoother interaction
            frameIntervalRef.current = window.setInterval(() => {
              if (!videoRef.current || !canvasRef.current) return;
              const ctx = canvasRef.current.getContext('2d');
              if (!ctx) return;
              canvasRef.current.width = videoRef.current.videoWidth; // Ensure canvas matches video resolution
              canvasRef.current.height = videoRef.current.videoHeight;
              ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
              canvasRef.current.toBlob(async (blob) => {
                if (blob) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64Data = (reader.result as string).split(',')[1];
                    sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64Data, mimeType: 'image/jpeg' } }));
                  };
                  reader.readAsDataURL(blob);
                }
              }, 'image/jpeg', 0.6);
            }, 250); // Capture frame every 250ms (4 FPS)

            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) int16[i] = inputData[i] * 32768;
              const pcmBlob = { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
              sessionPromise.then(s => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (msg: LiveServerMessage) => {
            const base64Audio = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            if (msg.serverContent?.outputTranscription) {
              setTranscription(prev => (prev + ' ' + msg.serverContent!.outputTranscription!.text).slice(-300));
            }
            if (msg.serverContent?.inputTranscription) {
              setUserTranscription(prev => (prev + ' ' + msg.serverContent!.inputTranscription!.text).slice(-150));
            }

            if (msg.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (err) => {
            console.error("Gemini Live API error:", err);
            setError("Live Scan connection failed. Check network or API Key. Falling back to photo mode.");
            stopLive(); // Stop everything
            startStaticCaptureMode(); // Attempt to start static camera
          },
          onclose: () => stopLive()
        },
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: `You are the 'FCK Scan' Agri-Expert for Farmer'sCorner Kashmir. 
          Respond primarily in ${language === 'ur' ? 'Urdu (اردو)' : language === 'hi' ? 'Hindi (हिंदी)' : 'English'}.
          If Urdu, speak in a gentle, guiding tone typical of a Kashmiri expert.
          You identify crops, pests, and diseases common to Jammu & Kashmir.`,
          outputAudioTranscription: {},
          inputAudioTranscription: {},
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error("getUserMedia or Live API setup error:", err);
      if (err.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setError("Camera/Mic access denied for Live Scan. Please enable permissions in your browser settings.");
      } else if (err.name === 'NotReadableError') {
        setError("Camera/Mic is busy or unavailable. Please close other applications using camera/mic and try again.");
      } else {
        setError("Failed to start Live Scan. Check camera/mic hardware or network. Falling back to photo mode.");
      }
      setLoading(false);
      startStaticCaptureMode(); // Attempt to start static camera as a fallback
    }
  };

  // Starts camera for a single static photo capture
  const startStaticCaptureMode = async () => {
    resetStates(); // Ensure previous states are cleared
    setLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false // No audio needed for static capture
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play(); // Explicitly play the video stream
      }
      setStaticCamActive(true);
      setLoading(false);
      setPermissionDenied(false); // Clear permission denied if static camera works
    } catch (err: any) {
      console.error("Static camera setup error:", err);
      if (err.name === 'NotAllowedError') {
        setPermissionDenied(true);
        setError("Camera access denied. Please enable permissions in your browser settings to take photos.");
      } else if (err.name === 'NotReadableError') {
        setError("Camera is busy or unavailable. Please close other applications using camera and try again.");
      } else {
        setError("Failed to access camera for photo. Check hardware.");
      }
      setLoading(false);
    }
  };

  // Handles capturing photo and sending for detection (used by both live and static)
  const handleCaptureAndDetect = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setDetecting(true);
    setDetectionResult(null);
    setError(null); // Clear previous errors for detection attempt
    
    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
      // Fix: Changed `canvas` to `canvasRef.current`
      canvasRef.current.width = videoRef.current.videoWidth;
      // Fix: Changed `canvas` to `canvasRef.current`
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const base64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
      setCapturedImage(base64); // Store the captured image
      
      // Stop the static camera stream immediately after capture
      if (staticCamActive) {
        stopVideoStream();
        setStaticCamActive(false);
      }

      try {
        const result = await analyzeCropDisease(base64.split(',')[1], language);
        setDetectionResult(result);
      } catch (e) {
        setError("AI Detection failed. Try a clearer photo or reset scan.");
      }
    }
    setDetecting(false);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setError(null);
      setDetectionResult(null);
      setCapturedImage(null); // Clear any previous captured image

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        analyzeCropDisease(base64.split(',')[1], language)
          .then(setDetectionResult)
          .catch(() => setError("AI Detection failed for uploaded image."))
          .finally(() => setLoading(false));
      };
      reader.readAsDataURL(file);
    }
  };


  const stopLive = () => {
    resetStates();
  };

  useEffect(() => {
    return () => resetStates();
  }, []);

  // Determine if main content is currently active (live stream OR static camera for photo)
  const isCameraViewActive = liveModeActive || staticCamActive;

  return (
    <div className="relative h-[calc(100vh-140px)] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-emerald-900/20 flex flex-col">
      {/* HUD Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
           <div className="bg-emerald-800 p-2 rounded-xl">
             <ScanEye className="w-6 h-6 text-white" />
           </div>
           <div>
             <h2 className="text-white font-bold text-lg leading-none">FCK Scan Pro</h2>
             <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">{liveModeActive ? 'Live Assisted' : 'Photo Assisted'}</span>
           </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-1 flex border border-white/10">
            {(['en', 'ur', 'hi'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${language === lang ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {lang}
              </button>
            ))}
          </div>
          {(liveModeActive || staticCamActive) && (
            <button onClick={stopLive} className="bg-rose-500/20 hover:bg-rose-500 text-white p-3 rounded-xl backdrop-blur-md transition-all">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Global Error Display */}
      {error && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 bg-rose-800 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 border-2 border-rose-500/50 backdrop-blur-sm">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-bold">{error}</p>
          <button onClick={() => setError(null)} className="p-1 -my-1 -mr-1 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Viewport */}
      <div className="relative flex-1 bg-slate-800">
        {!isCameraViewActive && !loading && !capturedImage && ( // Initial state or after live/static camera stops
          <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 space-y-6">
            <div className="w-24 h-24 bg-emerald-800/20 rounded-full flex items-center justify-center animate-pulse">
              <ScanEye className="w-12 h-12 text-emerald-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold text-white">{language === 'ur' ? 'ایف سی کے اسکین' : language === 'hi' ? 'FCK स्कैन' : 'FCK Scan Hub'}</h2>
              <p className="text-slate-400 max-w-sm mx-auto">{language === 'ur' ? 'کسی بھی فصل یا کھیت پر کیمرہ لگائیں۔ اردو میں رہنمائی حاصل کریں۔' : 'Point camera for instant agricultural analysis.'}</p>
            </div>
            {permissionDenied ? (
              <div className="bg-rose-500/20 text-rose-200 px-6 py-4 rounded-2xl border border-rose-500/30 flex flex-col items-center gap-3 shadow-xl max-w-sm mx-auto">
                <ShieldAlert className="w-6 h-6 shrink-0" />
                <p className="text-sm font-bold leading-relaxed mb-4">
                  Camera/Mic blocked. Please enable permissions in your browser settings (usually in site settings or privacy settings) to use the scanner.
                </p>
                <button 
                  onClick={startStaticCaptureMode} // Offer to retry static camera
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all"
                >
                  <Camera className="w-5 h-5" /> Retry Camera
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={startLive}
                  className="px-8 py-4 bg-emerald-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center gap-3"
                >
                  <Zap className="w-6 h-6 fill-current" /> Activate Live Scan
                </button>
                <button 
                  onClick={startStaticCaptureMode}
                  className="px-8 py-4 bg-blue-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-3"
                >
                  <Camera className="w-6 h-6" /> Take Photo
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-8 py-4 bg-slate-600 text-white rounded-[2rem] font-bold text-lg shadow-xl shadow-slate-500/20 hover:bg-slate-500 transition-all flex items-center gap-3"
                >
                  <Upload className="w-6 h-6" /> Upload Photo
                  <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*" />
                </button>
              </div>
            )}
          </div>
        )}
        
        {isCameraViewActive && (
           <video 
             ref={videoRef} 
             autoPlay 
             playsInline 
             muted 
             className={`h-full w-full object-cover transition-opacity duration-500 ${isCameraViewActive ? 'opacity-100' : 'opacity-0'}`}
           />
        )}

        {capturedImage && !detectionResult && !detecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-slate-900">
            <img src={capturedImage} alt="Captured for analysis" className="max-h-full max-w-full object-contain rounded-2xl shadow-xl border border-slate-700 mb-6" />
            <button 
                onClick={() => setCapturedImage(null)}
                className="px-6 py-3 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-500 transition-all flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Clear Photo
            </button>
          </div>
        )}

        <canvas ref={canvasRef} width="1280" height="720" className="hidden" />

        {/* Dynamic HUD Overlays for Live Mode */}
        {liveModeActive && (
          <>
            <div className="absolute inset-0 border-[40px] border-black/10 pointer-events-none flex items-center justify-center">
              <div className="w-72 h-72 border-2 border-emerald-400/30 rounded-[3rem] relative animate-pulse-slow">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                 <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                 <div className="absolute inset-x-0 h-[2px] bg-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-scanning-line" />
              </div>
            </div>

            {/* Bottom Controls for Live Mode */}
            <div className="absolute bottom-0 left-0 right-0 p-8 z-30 pointer-events-none">
              <div className="flex flex-col gap-4 items-center">
                 {/* Transcription Bubble */}
                 <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 w-full max-w-2xl shadow-2xl flex items-center gap-4">
                    <div className="p-3 bg-emerald-500 rounded-2xl shrink-0">
                      <Mic className="w-5 h-5 text-white animate-pulse" />
                    </div>
                    <p className="text-sm lg:text-base text-emerald-100 font-medium italic leading-relaxed line-clamp-2">
                      {transcription || (language === 'ur' ? 'کیمرہ فصل کی طرف رکھیں...' : 'Steady camera for analysis...')}
                    </p>
                 </div>

                 <div className="flex gap-4 w-full justify-center pointer-events-auto">
                    <button 
                      onClick={handleCaptureAndDetect}
                      disabled={detecting}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-emerald-900/40 transition-all active:scale-95 disabled:opacity-50"
                    >
                      {detecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                      {language === 'ur' ? 'تصویر اور تشخیص' : language === 'hi' ? 'फोटो اور پہچان' : 'Capture & Detect'}
                    </button>
                 </div>
              </div>
            </div>
          </>
        )}

        {/* Bottom Controls for Static Camera Mode */}
        {staticCamActive && (
          <div className="absolute bottom-0 left-0 right-0 p-8 z-30 pointer-events-auto flex justify-center">
            <button 
              onClick={handleCaptureAndDetect}
              disabled={detecting}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 shadow-xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
            >
              {detecting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              {language === 'ur' ? 'تصویر لیں اور تشخیص کریں' : language === 'hi' ? 'फोटो कैप्चر کریں اور پہچانیں' : 'Capture Photo & Detect'}
            </button>
          </div>
        )}
      </div>

      {/* Detection Results Overlay */}
      {detectionResult && (
        <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-lg p-8 flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-[3rem] overflow-hidden shadow-2xl flex flex-col max-h-full">
            <div className="bg-emerald-900 p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                <h3 className="text-xl font-bold uppercase tracking-wider">Detection Result</h3>
              </div>
              <button onClick={() => setDetectionResult(null)} className="p-2 bg-white/10 rounded-full hover:bg-white/20">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto no-scrollbar space-y-6">
              <div className="flex justify-between items-start">
                 <div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 tracking-widest">Identified Disease</span>
                    <h4 className="text-3xl font-bold text-slate-900 leading-tight">{detectionResult.diseaseName}</h4>
                 </div>
                 <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-100">
                   {detectionResult.severity} Severity
                 </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-sm text-slate-600 font-medium leading-relaxed">{detectionResult.description}</p>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold text-slate-900 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600" /> Treatment Plan
                </h5>
                <ul className="space-y-2">
                  {detectionResult.treatment.map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium bg-emerald-50/50 p-3 rounded-xl border border-emerald-50">
                      <span className="w-5 h-5 bg-emerald-600 text-white rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold">{i+1}</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4 pt-4">
                 <h5 className="font-bold text-slate-900 flex items-center gap-2">
                   <ShieldAlert className="w-4 h-4 text-amber-600" /> Preventive Steps
                 </h5>
                 <div className="grid grid-cols-1 gap-2">
                    {detectionResult.preventiveMeasures.map((pm, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 p-2.5 rounded-lg">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {pm}
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button 
                onClick={() => setDetectionResult(null)}
                className="flex-1 bg-emerald-800 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-emerald-700 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style>{`
        @keyframes scanning-line { 0% { top: 0; } 100% { top: 100%; } }
        .animate-scanning-line { animation: scanning-line 3s linear infinite; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  );
};

export default LiveLens;
