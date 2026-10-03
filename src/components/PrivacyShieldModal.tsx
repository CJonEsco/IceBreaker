import React from 'react';
import { ShieldCheck, ShieldAlert, Mic, Eye, Lock, RefreshCw, X, Radio, AlertTriangle, Cpu } from 'lucide-react';
import { PrivacyTrackingState } from '../types';

interface PrivacyShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  privacyState: PrivacyTrackingState;
  setPrivacyState: React.Dispatch<React.SetStateAction<PrivacyTrackingState>>;
}

export const PrivacyShieldModal: React.FC<PrivacyShieldModalProps> = ({
  isOpen,
  onClose,
  privacyState,
  setPrivacyState,
}) => {
  if (!isOpen) return null;

  const { isVocalTrackingActive, isScreenTrackingActive } = privacyState;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div 
        id="privacy-shield-modal"
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-zinc-800 border border-zinc-700 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">Privacy & Anti-Tracking Shield</h2>
              <p className="text-xs text-zinc-400">Apple-Style Hardware Sentinel & Encryption Monitor</p>
            </div>
          </div>
          <button
            id="close-privacy-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Active Sensor Status Card */}
          <div className={`p-4 rounded-xl border transition-all ${
            isScreenTrackingActive 
              ? 'bg-red-950/40 border-red-500/60' 
              : isVocalTrackingActive 
              ? 'bg-amber-950/40 border-amber-500/60' 
              : 'bg-emerald-950/20 border-emerald-500/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-5 h-5">
                {isScreenTrackingActive ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                  </>
                ) : isVocalTrackingActive ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400"></span>
                  </>
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-white">
                  {isScreenTrackingActive
                    ? '🔴 Screen / Display Surveillance Active'
                    : isVocalTrackingActive
                    ? '🟡 Vocal / Audio Tracking Active'
                    : '🟢 All Clear - Zero Hardware Access Detected'}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5">
                  {isScreenTrackingActive
                    ? 'A remote screen mirror, window capture, or camera monitor is querying the frame.'
                    : isVocalTrackingActive
                    ? 'The microphone sensor is capturing acoustic data or listening.'
                    : 'No third-party app, background telemetry, or audio buffer is accessing your device.'}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Dot Guide */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-zinc-400" />
              How the Status Dot Works
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-0.5 shrink-0 shadow-sm shadow-amber-400"></span>
                <div>
                  <span className="font-semibold text-amber-300">Yellow Dot:</span> When you are being tracked vocally or the microphone is receiving acoustic input.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 mt-0.5 shrink-0 shadow-sm shadow-red-500"></span>
                <div>
                  <span className="font-semibold text-red-400">Red Dot:</span> When the user screen is being seen, screen-mirrored, or video capture is engaged.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 mt-0.5 shrink-0"></span>
                <div>
                  <span className="font-semibold text-zinc-300">No Dot (Disappears):</span> When you are good to go and nothing is being accessed. Completely stealth.
                </div>
              </div>
            </div>
          </div>

          {/* Test & Simulation Controls */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                Live Hardware Sentinel Simulator
              </h3>
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">Interactive</span>
            </div>
            <p className="text-xs text-zinc-400">
              Toggle these indicators to test your visual alerts in real-time:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                id="toggle-vocal-tracking-btn"
                onClick={() =>
                  setPrivacyState((prev) => ({
                    ...prev,
                    isVocalTrackingActive: !prev.isVocalTrackingActive,
                  }))
                }
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  isVocalTrackingActive
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Mic className="w-4 h-4" />
                {isVocalTrackingActive ? 'Stop Vocal Sim' : 'Simulate Mic Access (Yellow)'}
              </button>

              <button
                id="toggle-screen-tracking-btn"
                onClick={() =>
                  setPrivacyState((prev) => ({
                    ...prev,
                    isScreenTrackingActive: !prev.isScreenTrackingActive,
                  }))
                }
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg text-xs font-medium border transition-all ${
                  isScreenTrackingActive
                    ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-sm'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Eye className="w-4 h-4" />
                {isScreenTrackingActive ? 'Stop Screen Sim' : 'Simulate Screen Access (Red)'}
              </button>
            </div>

            <button
              id="clear-tracking-btn"
              onClick={() =>
                setPrivacyState((prev) => ({
                  ...prev,
                  isVocalTrackingActive: false,
                  isScreenTrackingActive: false,
                }))
              }
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition-colors"
            >
              Reset to Safe (Dot Disappears)
            </button>
          </div>

          {/* Encryption & Security Guarantee */}
          <div className="p-3.5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1.5 text-zinc-300 font-medium">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                End-to-End P2P Encryption
              </span>
              <span className="font-mono text-[10px] text-emerald-400">AES-256-GCM</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              1-on-1 chats, evidence recordings, and GPS emergency pings are encrypted with device-unique private keys. No unencrypted metadata is ever stored or shared.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-zinc-900/60 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
