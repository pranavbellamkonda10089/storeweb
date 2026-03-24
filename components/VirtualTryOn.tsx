
import React, { useEffect, useRef, useState } from 'react';
import { Camera, X, RotateCcw, Scan, ShieldCheck, BoxSelect, Maximize2, UserCheck, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface Props {
  productImage: string;
  category: string;
  onClose: () => void;
}

// Global declarations to handle various MediaPipe CDN exports
declare global {
  interface Window {
    vision?: any;
    FaceLandmarker?: any;
    FilesetResolver?: any;
  }
}

const VirtualTryOn: React.FC<Props> = ({ productImage, category, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(true);
  const [faceTransform, setFaceTransform] = useState({
    x: 0,
    y: 0,
    rotation: 0,
    scale: 0,
    visible: false
  });
  const [manualScale, setManualScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);

  const isEyewear = category.toLowerCase().includes('eyewear') || 
                    category.toLowerCase().includes('glasses') || 
                    category.toLowerCase().includes('goggles');

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  const startCamera = async () => {
    setError(null);
    setIsReady(false);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setIsReady(true);
        };
      }
    } catch (err) {
      console.error("Camera Error:", err);
      setError("Camera access is blocked. Please allow camera permissions in your browser settings.");
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  useEffect(() => {
    let faceLandmarker: any;
    let animationFrameId: number;
    let lastVideoTime = -1;

    const setupTracking = async () => {
      // Helper to detect whichever global MediaPipe used
      const getMediaPipeLibrary = () => {
        if (window.vision) return window.vision;
        if (window.FaceLandmarker && window.FilesetResolver) {
          return { 
            FaceLandmarker: window.FaceLandmarker, 
            FilesetResolver: window.FilesetResolver 
          };
        }
        return null;
      };

      // Poll for library availability
      let lib = getMediaPipeLibrary();
      let retries = 0;
      while (!lib && retries < 40) {
        await new Promise(r => setTimeout(r, 250));
        lib = getMediaPipeLibrary();
        retries++;
      }

      if (!lib) {
        setError("Face tracking library (MediaPipe) could not be loaded. This is often due to a browser security setting or CDN disruption.");
        return;
      }

      try {
        const { FilesetResolver, FaceLandmarker } = lib;

        // Use version-specific WASM path for consistency
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        
        faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU"
          },
          outputFaceBlendshapes: false,
          runningMode: "VIDEO",
          numFaces: 1
        });

        setIsLoadingModel(false);
        predict();
      } catch (e) {
        console.error("ML Initialization Error:", e);
        setError("Failed to start the AI Vision engine. This device might lack the required GPU/WebGL hardware acceleration.");
      }
    };

    const predict = () => {
      if (!videoRef.current || !faceLandmarker) return;

      const startTimeMs = performance.now();
      if (lastVideoTime !== videoRef.current.currentTime) {
        lastVideoTime = videoRef.current.currentTime;
        try {
          const results = faceLandmarker.detectForVideo(videoRef.current, startTimeMs);

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0];
            
            // Bridge of nose (nasion)
            const bridge = landmarks[168];
            // Eyes for rotation
            const leftEye = landmarks[33];
            const rightEye = landmarks[263];
            // Temples for width scaling
            const leftTemple = landmarks[127];
            const rightTemple = landmarks[356];

            const dy = rightEye.y - leftEye.y;
            const dx = rightEye.x - leftEye.x;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const dist = Math.sqrt(
              Math.pow(rightTemple.x - leftTemple.x, 2) + 
              Math.pow(rightTemple.y - leftTemple.y, 2)
            );

            setFaceTransform({
              x: bridge.x,
              y: bridge.y,
              rotation: angle,
              scale: dist,
              visible: true
            });
          } else {
            setFaceTransform(prev => ({ ...prev, visible: false }));
          }
        } catch (e) {
          // Silent catch for frame drop
        }
      }
      animationFrameId = requestAnimationFrame(predict);
    };

    if (isReady) setupTracking();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (faceLandmarker) faceLandmarker.close();
    };
  }, [isReady]);

  const getProductStyle = (): React.CSSProperties => {
    if (!faceTransform.visible || !videoRef.current) {
      return { opacity: 0, transition: 'opacity 0.2s' };
    }

    const left = (1 - faceTransform.x) * 100;
    const top = faceTransform.y * 100;
    const baseWidth = 140; 
    const calculatedWidth = faceTransform.scale * baseWidth * manualScale;

    return {
      position: 'absolute',
      left: `${left}%`,
      top: `${top}%`,
      width: `${calculatedWidth}%`,
      transform: `translate(-50%, -50%) rotate(${faceTransform.rotation}deg)`,
      pointerEvents: 'none',
      zIndex: 50,
      filter: 'drop-shadow(0 15px 30px rgba(0,0,0,0.5))',
      opacity: 1,
      mixBlendMode: isEyewear ? 'multiply' : 'normal'
    };
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center animate-in fade-in duration-300">
      
      {/* Viewport Container */}
      <div className="relative w-full h-full max-w-6xl md:h-[85vh] bg-slate-900 md:rounded-[40px] overflow-hidden shadow-[0_0_120px_rgba(14,165,233,0.3)] border-0 md:border-8 border-slate-800">
        
        {/* Real-time Video Stream */}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="w-full h-full object-cover scale-x-[-1]"
        />

        {/* AI Tracked AR Layer */}
        {isReady && !isLoadingModel && productImage && (
          <img 
            src={productImage} 
            style={getProductStyle()}
            alt="AR Preview"
            className="transition-[width,transform] duration-[40ms] ease-linear"
          />
        )}

        {/* Loader/Calibration UX */}
        {(isLoadingModel || !faceTransform.visible) && !error && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white z-50 text-center px-10">
             {isLoadingModel ? (
               <>
                 <Loader2 className="w-16 h-16 text-sky-500 animate-spin mb-6" />
                 <h3 className="text-2xl font-black uppercase tracking-widest">Syncing AI Core</h3>
                 <p className="text-sky-300/60 mt-2 font-medium">Downloading Neural Mesh Data...</p>
               </>
             ) : (
               <>
                 <Scan className="w-20 h-20 text-sky-400 mb-6 animate-pulse" />
                 <h3 className="text-2xl font-black uppercase tracking-widest">Awaiting Face Lock</h3>
                 <p className="text-slate-400 mt-2 max-w-xs">Align your face to the center of the mirror for automatic tracking.</p>
               </>
             )}
          </div>
        )}

        {/* Interactive Header */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-[60] bg-gradient-to-b from-black/80 to-transparent">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                 <Camera className="text-white" size={24} />
              </div>
              <div>
                 <h2 className="text-white font-black text-lg tracking-tight uppercase leading-none mb-1">Mirror AI Pro</h2>
                 <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${faceTransform.visible ? 'bg-green-500 shadow-[0_0_12px_#22c55e]' : 'bg-rose-500 animate-pulse'}`} />
                    <span className="text-sky-300 text-[10px] font-black tracking-widest uppercase">
                      {faceTransform.visible ? 'Bio-Mesh Locked' : 'Searching Engine'}
                    </span>
                 </div>
              </div>
           </div>
           
           <button 
             onClick={handleClose}
             className="w-12 h-12 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-xl transition-all border border-white/10 flex items-center justify-center"
           >
             <X size={24} />
           </button>
        </div>

        {/* Calibration Footer */}
        <div className="absolute bottom-0 inset-x-0 p-8 flex flex-col md:flex-row items-center justify-between gap-6 z-[60] bg-gradient-to-t from-black/95 to-transparent">
           <div className="flex flex-col gap-2 bg-black/60 backdrop-blur-3xl p-5 rounded-[2.5rem] border border-white/10 w-full md:w-auto shadow-2xl">
              <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 px-1">
                 <span>Manual Fit Scale</span>
                 <span className="text-sky-400">{(manualScale * 100).toFixed(0)}%</span>
              </div>
              <input 
                 type="range" min="0.5" max="1.8" step="0.01" value={manualScale} 
                 onChange={(e) => setManualScale(parseFloat(e.target.value))}
                 className="w-full md:w-64 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-sky-500" 
              />
           </div>

           <div className="flex items-center gap-3">
              <button 
                onClick={() => setManualScale(1.0)}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
              >
                <RotateCcw size={14} /> Recalibrate
              </button>
              <div className="px-8 py-4 bg-sky-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_30px_rgba(14,165,233,0.3)] flex items-center gap-2">
                <UserCheck size={14} /> Neural Tracking Active
              </div>
           </div>
        </div>

        {/* Error HUD */}
        {error && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center text-white z-[80] p-12 text-center animate-in fade-in duration-500">
            <div className="w-24 h-24 bg-rose-500/20 rounded-full flex items-center justify-center mb-8">
              <AlertCircle className="w-12 h-12 text-rose-500" />
            </div>
            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 max-w-lg">{error}</h3>
            <p className="text-slate-400 mb-10 max-w-md">Try reloading the application or checking your browser's hardware acceleration settings.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 hover:bg-gray-200 transition-all hover:scale-105"
              >
                <RefreshCw size={20} /> Reload App
              </button>
              <button 
                onClick={handleClose} 
                className="bg-slate-800 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-700 transition-all border border-white/10"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Trust & Privacy Badges */}
      <div className="mt-8 flex items-center gap-12 opacity-30">
         <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-[0.3em] uppercase">
            <ShieldCheck size={18} className="text-green-500" /> Private On-Device Vision
         </div>
         <div className="w-2 h-2 bg-white rounded-full" />
         <div className="flex items-center gap-3 text-white text-[10px] font-black tracking-[0.3em] uppercase">
            <Maximize2 size={18} className="text-sky-500" /> GPU Mesh Synthesis
         </div>
      </div>

      <style>{`
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          background: #ffffff;
          border: 6px solid #0ea5e9;
          cursor: pointer;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(14,165,233,0.6);
        }
      `}</style>
    </div>
  );
};

export default VirtualTryOn;
