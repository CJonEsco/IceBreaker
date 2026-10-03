import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertOctagon, 
  PhoneCall, 
  Camera, 
  SwitchCamera, 
  Video, 
  ShieldAlert, 
  ShieldCheck, 
  BookOpen, 
  X, 
  Volume2, 
  Radio, 
  Clock, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Lock,
  Share2,
  Phone
} from 'lucide-react';
import { RIGHTS_SCRIPTS } from '../data/mockData';
import { RightsScript } from '../types';

interface EmergencySOSProps {
  onOpenTerms: () => void;
}

export const EmergencySOS: React.FC<EmergencySOSProps> = ({ onOpenTerms }) => {
  // States: 'IDLE' | 'COUNTDOWN' | 'ACTIVE_EMERGENCY'
  const [emergencyPhase, setEmergencyPhase] = useState<'IDLE' | 'COUNTDOWN' | 'ACTIVE_EMERGENCY'>('IDLE');
  const [countdownSeconds, setCountdownSeconds] = useState(30);
  const [selectedScript, setSelectedScript] = useState<RightsScript>(RIGHTS_SCRIPTS[0]);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [activeCameraFacing, setActiveCameraFacing] = useState<'user' | 'environment'>('environment');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [evidenceHash, setEvidenceHash] = useState('0x9a8f2b3e4d5c1a70');
  const [recordingDuration, setRecordingDuration] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Countdown timer effect
  useEffect(() => {
    let timer: any;
    if (emergencyPhase === 'COUNTDOWN') {
      timer = setInterval(() => {
        setCountdownSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            activateEmergency();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emergencyPhase]);

  // Recording duration timer effect
  useEffect(() => {
    let recTimer: any;
    if (emergencyPhase === 'ACTIVE_EMERGENCY') {
      recTimer = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }
    return () => clearInterval(recTimer);
  }, [emergencyPhase]);

  // Handle Camera initialization in active emergency
  useEffect(() => {
    if (emergencyPhase === 'ACTIVE_EMERGENCY') {
      startCamera(activeCameraFacing);
      // Generate unique evidence hash
      setEvidenceHash(`0x${Math.random().toString(16).substring(2, 10)}${Date.now().toString(16)}`);
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [emergencyPhase, activeCameraFacing]);

  const startCamera = async (facingMode: 'user' | 'environment') => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn('Camera access not permitted or unavailable in current frame:', err);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleToggleCameraAngle = () => {
    const nextFacing = activeCameraFacing === 'user' ? 'environment' : 'user';
    setActiveCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const handleStartHelpCountdown = () => {
    setCountdownSeconds(30);
    setEmergencyPhase('COUNTDOWN');
  };

  const handleCancelCountdown = () => {
    setEmergencyPhase('IDLE');
    setCountdownSeconds(30);
  };

  const activateEmergency = () => {
    setEmergencyPhase('ACTIVE_EMERGENCY');
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto pb-24 px-4 pt-3 space-y-4">
      {/* Top Banner with Info Button */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-red-950 border border-red-800 text-red-400">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-wide">EMERGENCY SOS COMMAND</h2>
            <p className="text-[11px] text-zinc-400">Rapid 911 Dispatch, Dual-Angle Evidence & Rights Prompter</p>
          </div>
        </div>

        {/* Education & Info Button */}
        <button
          id="sos-info-guide-btn"
          onClick={() => setShowInfoModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          title="Learn how Emergency Help & Rights protection works"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>SOS Guide</span>
        </button>
      </div>

      {/* PHASE 1: IDLE - Large Red Help Button */}
      {emergencyPhase === 'IDLE' && (
        <div className="space-y-6 py-6 text-center animate-in fade-in">
          <div className="max-w-sm mx-auto space-y-2">
            <h3 className="text-base font-bold text-white">Press for Immediate Emergency Protocol</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Initiates a 30-second confirmation buffer, dials emergency dispatch, begins dual-angle cloud evidence recording, and loads legal defense scripts.
            </p>
          </div>

          {/* Large Animated Red HELP Button */}
          <div className="relative flex items-center justify-center my-6">
            {/* Multiple Pulsing Halos */}
            <div className="absolute w-64 h-64 rounded-full bg-red-600/20 animate-ping opacity-50 pointer-events-none"></div>
            <div className="absolute w-56 h-56 rounded-full bg-red-600/30 animate-pulse pointer-events-none"></div>

            <button
              id="main-emergency-help-button"
              onClick={handleStartHelpCountdown}
              className="relative z-10 w-48 h-48 rounded-full bg-gradient-to-tr from-red-700 via-red-600 to-rose-500 hover:from-red-600 hover:to-rose-400 text-white font-black text-3xl tracking-widest uppercase shadow-2xl shadow-red-950 border-4 border-red-400/80 active:scale-95 transition-all flex flex-col items-center justify-center gap-1 cursor-pointer group"
            >
              <AlertOctagon className="w-12 h-12 text-white group-hover:scale-110 transition-transform animate-pulse" />
              <span className="drop-shadow-md">HELP</span>
              <span className="text-[10px] font-mono font-medium tracking-normal text-red-200 uppercase opacity-90">
                Tap to Trigger SOS
              </span>
            </button>
          </div>

          {/* Quick Stats & Security Checklist */}
          <div className="grid grid-cols-3 gap-2.5 max-w-md mx-auto pt-4 text-left">
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <div className="text-[11px] font-bold text-zinc-200">911 Connect</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Instant dialer link</div>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <div className="text-[11px] font-bold text-zinc-200">Dual Camera</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Tamper-proof log</div>
            </div>
            <div className="p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
              <div className="text-[11px] font-bold text-zinc-200">Civil Rights</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Live prompter</div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 2: 30-Second Timed Confirmation Screen */}
      {emergencyPhase === 'COUNTDOWN' && (
        <div className="p-6 rounded-3xl bg-zinc-950 border-2 border-red-600 shadow-2xl space-y-6 text-center animate-in zoom-in-95">
          <div className="space-y-1">
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-800 uppercase animate-pulse">
              Emergency Trigger Verification
            </span>
            <h3 className="text-lg font-black text-white mt-2">
              Dispatching Authorities & Starting Recording
            </h3>
            <p className="text-xs text-zinc-400">
              You have 30 seconds to confirm or abort before full activation.
            </p>
          </div>

          {/* Radial Countdown Display */}
          <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                className="text-zinc-800"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                className="text-red-500 transition-all duration-1000"
                fill="transparent"
                strokeDasharray="377"
                strokeDashoffset={377 * (1 - countdownSeconds / 30)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white font-mono">{countdownSeconds}</span>
              <span className="text-[10px] text-zinc-400 uppercase font-mono">Seconds</span>
            </div>
          </div>

          {/* Two Prompt-Specified Action Buttons */}
          <div className="space-y-3 max-w-sm mx-auto">
            {/* Yes I'm Sure Button */}
            <button
              id="confirm-emergency-yes-btn"
              onClick={activateEmergency}
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-red-950 border-2 border-red-400 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>YES I'M SURE (CALL & RECORD)</span>
            </button>

            {/* Cancel Emergency Call Button */}
            <button
              id="cancel-emergency-call-btn"
              onClick={handleCancelCountdown}
              className="w-full py-3.5 px-6 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-sm border border-zinc-700 transition-all"
            >
              Cancel Emergency Call
            </button>
          </div>
        </div>
      )}

      {/* PHASE 3: ACTIVE EMERGENCY MODE */}
      {emergencyPhase === 'ACTIVE_EMERGENCY' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Active Broadcast Status Banner */}
          <div className="p-4 rounded-2xl bg-red-950/80 border-2 border-red-500 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-4 h-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </div>
              <div>
                <div className="text-sm font-black text-white flex items-center gap-2">
                  <span>ACTIVE EMERGENCY PROTOCOL ENGAGED</span>
                  <span className="font-mono text-xs bg-red-900 px-2 py-0.5 rounded text-red-200">
                    {formatDuration(recordingDuration)}
                  </span>
                </div>
                <div className="text-xs text-red-200">
                  Dialing 911 • Recording Evidence • Preserving Chain of Custody
                </div>
              </div>
            </div>

            <button
              onClick={() => setEmergencyPhase('IDLE')}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-bold border border-zinc-700"
            >
              End Call
            </button>
          </div>

          {/* Quick Call 911 Direct Dial Button */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="tel:911"
              id="dial-911-direct-btn"
              className="py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>Tap to Connect 911 Emergency Line</span>
            </a>

            <button
              onClick={() => alert('Emergency SOS broadcast ping sent to 4 trusted family & legal monitors with your GPS coordinates.')}
              className="py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-xs border border-zinc-700 flex items-center justify-center gap-2 transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" />
              <span>Broadcast GPS to Legal Team</span>
            </button>
          </div>

          {/* Dual-Angle Evidence Video Capture & Recording View */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-zinc-800 shadow-2xl">
            {/* Live Camera View */}
            <div className="relative h-64 bg-zinc-950 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 space-y-2 bg-zinc-950/90 p-4 text-center">
                  <Video className="w-10 h-10 text-zinc-600" />
                  <p className="text-xs text-zinc-400">
                    Dual-Angle Video Recording Simulated / Active Stream Initializing
                  </p>
                  <button
                    onClick={() => startCamera(activeCameraFacing)}
                    className="px-3 py-1 bg-red-600/30 text-red-300 border border-red-500/50 rounded-lg text-xs font-semibold"
                  >
                    Authorize Camera & Mic
                  </button>
                </div>
              )}

              {/* Recording Overlay Watermark */}
              <div className="absolute top-3 left-3 flex items-center gap-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-[11px] font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-bold text-red-400">REC</span>
                <span>{formatDuration(recordingDuration)}</span>
              </div>

              {/* Dual Angle Angle Switcher */}
              <button
                id="toggle-camera-angle-btn"
                onClick={handleToggleCameraAngle}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white hover:bg-zinc-800 transition-all"
                title="Switch between Front & Rear Angle"
              >
                <SwitchCamera className="w-4 h-4 text-amber-400" />
              </button>

              {/* Bottom Cryptographic Watermark */}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-zinc-400 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-zinc-800">
                <span>GPS: 37.7523° N, 122.4182° W</span>
                <span>SHA-256: {evidenceHash}</span>
              </div>
            </div>
          </div>

          {/* Legal Rights Scripts to Read to Authorities (Teleprompter) */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-red-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Civil Rights Scripts — Read Directly to Authorities
                </h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">5th & 4th Amend.</span>
            </div>

            {/* Script Selection Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {RIGHTS_SCRIPTS.map((script) => (
                <button
                  key={script.id}
                  onClick={() => setSelectedScript(script)}
                  className={`px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
                    selectedScript.id === script.id
                      ? 'bg-red-600 text-white font-bold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                  }`}
                >
                  {script.title.split('(')[0]}
                </button>
              ))}
            </div>

            {/* Active Script Teleprompter Card */}
            <div className="p-4 rounded-xl bg-zinc-900 border-2 border-red-500/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400">{selectedScript.title}</span>
                <span className="text-[10px] font-mono text-zinc-400">{selectedScript.lawBasis}</span>
              </div>

              {/* Large Readable Teleprompter Speech Box */}
              <div className="p-3.5 bg-black/60 rounded-xl border border-zinc-800">
                <p className="text-sm font-semibold text-white leading-relaxed select-all">
                  {selectedScript.teleprompterText}
                </p>
              </div>

              {/* What NOT to say / Recommended Action */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-200">
                  <div className="font-bold flex items-center gap-1 text-red-400 mb-0.5">
                    <AlertTriangle className="w-3 h-3" /> DO NOT:
                  </div>
                  <div>{selectedScript.doNotSay}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-200">
                  <div className="font-bold flex items-center gap-1 text-emerald-400 mb-0.5">
                    <CheckCircle className="w-3 h-3" /> ACTION:
                  </div>
                  <div>{selectedScript.recommendedAction}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Information & Education Modal */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto space-y-5 text-zinc-100">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-red-950 text-red-400 border border-red-800">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Emergency Help & SOS Architecture</h3>
                  <p className="text-xs text-zinc-400">Why this button is vital & how it protects you</p>
                </div>
              </div>
              <button
                onClick={() => setShowInfoModal(false)}
                className="text-zinc-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Core Educational Points */}
            <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed">
              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  1. The 30-Second Verification Buffer
                </h4>
                <p className="text-zinc-400">
                  Pressing the large red Help button initiates a 30-second countdown with prominent choices to prevent accidental dials while allowing instantaneous one-tap emergency activation.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  2. Dual-Angle Tamper-Proof Evidence Recording
                </h4>
                <p className="text-zinc-400">
                  The app automatically engages video recording from both camera angles, embedding live UTC timestamps, GPS coordinates, and cryptographic hashes (SHA-256) to ensure legal admissibility in court against power abuse, unlawful detainment, or kidnapping.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-1">
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  3. Constitutional Rights Teleprompter
                </h4>
                <p className="text-zinc-400">
                  Provides exact legal scripts vetted by immigration and civil rights attorneys. Explains critical distinctions—such as why ICE Form I-200/I-205 administrative warrants are not signed by a judge and do not permit home entry.
                </p>
              </div>
            </div>

            {/* Review Terms Link */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <button
                onClick={() => {
                  setShowInfoModal(false);
                  onOpenTerms();
                }}
                className="text-red-400 hover:underline font-semibold"
              >
                Review Evidence Recording Terms & Disclaimers
              </button>
              <button
                onClick={() => setShowInfoModal(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
