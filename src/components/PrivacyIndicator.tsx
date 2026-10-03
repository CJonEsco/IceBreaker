import React from 'react';
import { ShieldCheck, ShieldAlert, Radio, Mic, Eye } from 'lucide-react';
import { PrivacyTrackingState } from '../types';

interface PrivacyIndicatorProps {
  privacyState: PrivacyTrackingState;
  onOpenPrivacyModal: () => void;
}

export const PrivacyIndicator: React.FC<PrivacyIndicatorProps> = ({
  privacyState,
  onOpenPrivacyModal,
}) => {
  const { isVocalTrackingActive, isScreenTrackingActive } = privacyState;
  const isAnyTracking = isVocalTrackingActive || isScreenTrackingActive;

  return (
    <div className="flex items-center gap-2">
      {/* Privacy Indicator Button */}
      <button
        id="privacy-shield-btn"
        onClick={onOpenPrivacyModal}
        className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-mono font-medium transition-all ${
          isScreenTrackingActive
            ? 'bg-red-950/80 text-red-300 border border-red-500/50 shadow-sm shadow-red-500/30'
            : isVocalTrackingActive
            ? 'bg-amber-950/80 text-amber-300 border border-amber-500/50 shadow-sm shadow-amber-500/30'
            : 'bg-zinc-900/90 text-zinc-400 border border-zinc-800 hover:text-zinc-200 hover:border-zinc-700'
        }`}
        title="Privacy & Anti-Surveillance Indicator"
      >
        {/* Apple-style Dot Indicator */}
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          {isScreenTrackingActive ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 shadow-md shadow-red-500"></span>
            </>
          ) : isVocalTrackingActive ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400 shadow-md shadow-amber-400"></span>
            </>
          ) : (
            /* When good to go and nothing is being accessed, the dot disappears completely */
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50"></span>
          )}
        </div>

        {/* Status text label */}
        <span className="text-[11px] font-semibold tracking-wider uppercase">
          {isScreenTrackingActive ? (
            <span className="flex items-center gap-1 text-red-400">
              <Eye className="w-3 h-3 animate-pulse" /> Screen Access
            </span>
          ) : isVocalTrackingActive ? (
            <span className="flex items-center gap-1 text-amber-300">
              <Mic className="w-3 h-3 animate-pulse" /> Mic Active
            </span>
          ) : (
            <span className="flex items-center gap-1 text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure
            </span>
          )}
        </span>
      </button>
    </div>
  );
};
