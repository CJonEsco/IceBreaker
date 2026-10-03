import React, { useState } from 'react';
import { Shield, Lock, Video, AlertOctagon, CheckCircle, FileText, Check } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  isOpen,
  onAccept,
  onClose,
  canDismiss = false,
}) => {
  const [agreedRecording, setAgreedRecording] = useState(true);
  const [agreedEmergency, setAgreedEmergency] = useState(true);
  const [agreedCommunity, setAgreedCommunity] = useState(true);

  if (!isOpen) return null;

  const canProceed = agreedRecording && agreedEmergency && agreedCommunity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
      <div 
        id="terms-onboarding-modal"
        className="w-full max-w-lg bg-zinc-950 border-2 border-red-500/60 rounded-3xl p-6 shadow-2xl space-y-5 text-zinc-100 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-950">
            <Shield className="w-6 h-6 fill-white" />
          </div>
          <h2 className="text-lg font-black text-white tracking-wide">
            WELCOME TO ICE BREAKER
          </h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            Community Defense, Rapid Emergency SOS & Dual-Angle Evidence Preservation Network
          </p>
        </div>

        {/* Core Terms Cards */}
        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Video className="w-4 h-4 text-red-400" />
              <span>1. Dual-Angle Evidence Recording Protocol</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              When emergency help is triggered, Ice Breaker records video/audio with real-time cryptographic timestamping and GPS metadata to protect against unlawful detainment, power abuse by private bounty hunters, kidnappings, or civil rights violations.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>2. Emergency SOS 911 Dispatch & Rights Scripts</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              The 30-second verification buffer allows you to trigger rapid 911 connection, broadcast GPS coordinates to trusted emergency contacts, and access live teleprompter scripts rooted in the 4th and 5th Amendments.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1.5">
            <div className="flex items-center gap-2 text-white font-bold">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>3. Zero-Knowledge Encryption & Anti-Surveillance</span>
            </div>
            <p className="text-zinc-400 leading-relaxed">
              Private 1-to-1 conversations remain strictly confidential. The Apple-style hardware indicator informs you in real time if any background process queries your vocal microphone (yellow) or screen (red).
            </p>
          </div>
        </div>

        {/* Checkbox agreements */}
        <div className="space-y-2.5 pt-1 text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedRecording}
              onChange={(e) => setAgreedRecording(e.target.checked)}
              className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-red-500"
            />
            <span className="text-zinc-300">
              I consent to emergency camera and microphone evidence recording during SOS activations.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedEmergency}
              onChange={(e) => setAgreedEmergency(e.target.checked)}
              className="mt-0.5 rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-red-500"
            />
            <span className="text-zinc-300">
              I agree to use the emergency dispatch and community alert features responsibly.
            </span>
          </label>
        </div>

        {/* Acceptance Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {canDismiss && onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          )}

          <button
            id="accept-terms-btn"
            onClick={onAccept}
            disabled={!canProceed}
            className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-40 text-white font-extrabold text-xs tracking-wide shadow-xl shadow-red-950 transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Accept Terms & Enter Ice Breaker</span>
          </button>
        </div>
      </div>
    </div>
  );
};
