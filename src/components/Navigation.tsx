import React from 'react';
import { Newspaper, MessageSquare, MapPin, PlusCircle, AlertOctagon, Radio } from 'lucide-react';
import { NavigationTab } from '../types';

interface NavigationProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  unreadMessagesCount: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onTabChange,
  unreadMessagesCount,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/80 px-2 py-1.5 transition-all">
      <div className="max-w-md mx-auto flex items-center justify-between relative">
        {/* 1) Far Left: Home Community Feed */}
        <button
          id="nav-home-btn"
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            currentTab === 'home'
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Newspaper className={`w-5 h-5 transition-transform ${currentTab === 'home' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
          {currentTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></span>
          )}
        </button>

        {/* 2) Second: Messaging Hub */}
        <button
          id="nav-messages-btn"
          onClick={() => onTabChange('messages')}
          className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            currentTab === 'messages'
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <div className="relative">
            <MessageSquare className={`w-5 h-5 transition-transform ${currentTab === 'messages' ? 'scale-110' : ''}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-2 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Comms</span>
          {currentTab === 'messages' && (
            <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></span>
          )}
        </button>

        {/* 3) Third: Slightly Bigger Middle Button - Citizen Map & Live Safety Radar */}
        <div className="relative -top-3 flex flex-col items-center">
          <button
            id="nav-map-btn"
            onClick={() => onTabChange('map')}
            className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              currentTab === 'map'
                ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-amber-500 text-white ring-4 ring-red-500/30 scale-110 shadow-red-900/50'
                : 'bg-zinc-900 text-zinc-300 border-2 border-zinc-700 hover:border-red-500 hover:text-white'
            }`}
          >
            {/* Pulsing radar ring */}
            <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-75 pointer-events-none"></span>
            <MapPin className={`w-7 h-7 transition-transform duration-200 ${currentTab === 'map' ? 'scale-105' : 'group-hover:scale-110'}`} />
          </button>
          <span className={`text-[10px] font-bold mt-1 tracking-tight ${currentTab === 'map' ? 'text-red-400' : 'text-zinc-400'}`}>
            Live Radar
          </span>
        </div>

        {/* 4) Fourth: Report Intelligence Node */}
        <button
          id="nav-report-btn"
          onClick={() => onTabChange('report')}
          className={`flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            currentTab === 'report'
              ? 'text-red-500 font-bold'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <PlusCircle className={`w-5 h-5 transition-transform ${currentTab === 'report' ? 'scale-110' : ''}`} />
          <span className="text-[10px] mt-0.5 tracking-tight">Report</span>
          {currentTab === 'report' && (
            <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></span>
          )}
        </button>

        {/* 5) Fifth: Far Right Emergency SOS Button (Crucial Button) */}
        <button
          id="nav-emergency-btn"
          onClick={() => onTabChange('emergency')}
          className={`relative flex flex-col items-center justify-center w-14 py-1 rounded-xl transition-all ${
            currentTab === 'emergency'
              ? 'text-red-500 font-bold bg-red-950/40 rounded-xl border border-red-500/40'
              : 'text-red-400 hover:text-red-300'
          }`}
        >
          <div className="relative">
            <AlertOctagon className={`w-5 h-5 text-red-500 transition-transform ${currentTab === 'emergency' ? 'scale-125 animate-pulse' : ''}`} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-extrabold text-red-400">Emergency</span>
          {currentTab === 'emergency' && (
            <span className="w-1 h-1 rounded-full bg-red-500 mt-0.5"></span>
          )}
        </button>
      </div>
    </nav>
  );
};
