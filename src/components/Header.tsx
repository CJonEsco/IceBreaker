import React from 'react';
import { Shield, Bell, Search, Radio, Compass, AlertOctagon } from 'lucide-react';
import { PrivacyIndicator } from './PrivacyIndicator';
import { PrivacyTrackingState, NavigationTab } from '../types';

interface HeaderProps {
  currentTab: NavigationTab;
  privacyState: PrivacyTrackingState;
  onOpenPrivacyModal: () => void;
  unreadAlertsCount: number;
  onOpenAlertsModal?: () => void;
  onNavigateToTab: (tab: NavigationTab) => void;
  activeFilter?: string;
  onSelectFilter?: (filter: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  privacyState,
  onOpenPrivacyModal,
  unreadAlertsCount,
  onNavigateToTab,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'home':
        return 'COMMUNITY FEED';
      case 'messages':
        return 'ENCRYPTED COMMS';
      case 'map':
        return 'LIVE SAFETY RADAR';
      case 'report':
        return 'INTEL & REPORT NODE';
      case 'emergency':
        return 'EMERGENCY SOS';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/80 px-4 py-2.5 transition-colors">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
        {/* Brand and Logo */}
        <div className="flex items-center gap-2.5">
          <div 
            onClick={() => onNavigateToTab('map')}
            className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-md shadow-red-950 cursor-pointer"
          >
            <Shield className="w-4 h-4 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-wider text-white">ICE BREAKER</span>
              <span className="text-[9px] uppercase px-1.5 py-0.5 rounded-full bg-red-950 text-red-400 font-mono font-bold border border-red-800/50">
                CITIZEN v3
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono tracking-tight flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{getTabTitle()}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Apple-style Privacy Sentinel */}
        <div className="flex items-center gap-2">
          {/* Quick SOS Trigger if not on emergency tab */}
          {currentTab !== 'emergency' && (
            <button
              id="header-quick-sos-btn"
              onClick={() => onNavigateToTab('emergency')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-600/30 transition-all"
            >
              <AlertOctagon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">SOS</span>
            </button>
          )}

          {/* Privacy Tracking Dot Indicator */}
          <PrivacyIndicator
            privacyState={privacyState}
            onOpenPrivacyModal={onOpenPrivacyModal}
          />
        </div>
      </div>
    </header>
  );
};
