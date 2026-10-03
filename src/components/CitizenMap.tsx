import React, { useState, useEffect, useRef } from 'react';
import { 
  Layers, 
  EyeOff, 
  MapPin, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Users, 
  Car, 
  Info, 
  Compass, 
  Plus, 
  Minus, 
  Search,
  ChevronRight,
  Sparkles,
  Bot,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Lock,
  Volume2
} from 'lucide-react';
import { Incident, IncidentCategory, NavigationTab } from '../types';

interface CitizenMapProps {
  incidents: Incident[];
  selectedIncidentId?: string | null;
  onSelectIncident: (incident: Incident) => void;
  onVoteIncident: (incidentId: string, type: 'CONFIRM' | 'DISPUTE') => void;
  onNavigateToHomeFeed: (incidentId?: string) => void;
  onNavigateToReport: () => void;
}

export const CitizenMap: React.FC<CitizenMapProps> = ({
  incidents,
  selectedIncidentId,
  onSelectIncident,
  onVoteIncident,
  onNavigateToHomeFeed,
  onNavigateToReport,
}) => {
  const [mapMode, setMapMode] = useState<'DISCRETE' | 'SATELLITE'>('DISCRETE');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [activePopupIncident, setActivePopupIncident] = useState<Incident | null>(
    incidents.find((i) => i.id === selectedIncidentId) || null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [searchQuery, setSearchQuery] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (selectedIncidentId) {
      const target = incidents.find((i) => i.id === selectedIncidentId);
      if (target) {
        setActivePopupIncident(target);
      }
    }
  }, [selectedIncidentId, incidents]);

  // Initialize or update Leaflet Map
  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === 'undefined') return;

      try {
        const L = (await import('leaflet')).default;
        // Import leaflet css
        if (!document.getElementById('leaflet-css-link')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css-link';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!mapContainerRef.current) return;

        if (!leafletMapRef.current) {
          const map = L.map(mapContainerRef.current, {
            center: [37.765, -122.419],
            zoom: 13,
            zoomControl: false,
            attributionControl: false,
          });

          leafletMapRef.current = map;
        }

        const map = leafletMapRef.current;

        // Clear existing tile layers
        map.eachLayer((layer: any) => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
          }
        });

        // Add Tile layer depending on Mode (Satellite vs Stealth Discrete)
        if (mapMode === 'SATELLITE') {
          // High-Res Satellite imagery
          L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
            {
              maxZoom: 18,
            }
          ).addTo(map);
        } else {
          // Discrete Stealth Dark Mode
          L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
            {
              maxZoom: 19,
              subdomains: 'abcd',
              className: 'discrete-stealth-tiles',
            }
          ).addTo(map);
        }

        // Clear old markers
        markersRef.current.forEach((m) => map.removeLayer(m));
        markersRef.current = [];

        // Render Incident Markers
        const filtered = incidents.filter((inc) => {
          if (categoryFilter === 'ALL') return true;
          return inc.category === categoryFilter;
        });

        filtered.forEach((inc) => {
          const isSelected = activePopupIncident?.id === inc.id;

          // Color coded based on category
          let color = '#ef4444'; // Red for ICE
          let pulseClass = 'pulse-red';
          if (inc.category === 'BOUNTY_HUNTER') {
            color = '#f59e0b'; // Amber
            pulseClass = 'pulse-amber';
          } else if (inc.category === 'CHECKPOINT') {
            color = '#f97316'; // Orange
          } else if (inc.category === 'SAFE_ZONE') {
            color = '#10b981'; // Emerald
          } else if (inc.category === 'UNLAWFUL_STOP') {
            color = '#a855f7'; // Purple
          }

          const customIcon = L.divIcon({
            className: 'custom-citizen-marker',
            html: `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; cursor: pointer;">
                <div style="position: absolute; width: 32px; height: 32px; border-radius: 9999px; background: ${color}33; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background: #09090b; border: 2.5px solid ${color}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}88; transform: ${isSelected ? 'scale(1.25)' : 'scale(1)'}; transition: all 0.2s;">
                  <div style="width: 8px; height: 8px; border-radius: 9999px; background: ${color};"></div>
                </div>
              </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });

          const marker = L.marker([inc.lat, inc.lng], { icon: customIcon }).addTo(map);

          marker.on('click', () => {
            setActivePopupIncident(inc);
            onSelectIncident(inc);
          });

          markersRef.current.push(marker);
        });
      } catch (err) {
        console.warn('Leaflet render fallback:', err);
      }
    }

    initLeaflet();
  }, [mapMode, incidents, categoryFilter, activePopupIncident]);

  const handleZoomIn = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.zoomOut();
    }
  };

  const handleRecenter = () => {
    if (leafletMapRef.current) {
      leafletMapRef.current.setView([37.765, -122.419], 13);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-125px)] pb-16 bg-zinc-950 overflow-hidden select-none">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 max-w-xl mx-auto">
        <div className="flex items-center gap-2 bg-zinc-950/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-800 shadow-xl">
          {/* Mode Switcher: Discrete vs Satellite */}
          <div className="flex items-center bg-zinc-900 rounded-xl p-1 border border-zinc-800">
            <button
              id="map-mode-discrete-btn"
              onClick={() => setMapMode('DISCRETE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapMode === 'DISCRETE'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Stealth discrete high-privacy layout"
            >
              <EyeOff className="w-3.5 h-3.5 text-zinc-300" />
              <span>Discrete</span>
            </button>

            <button
              id="map-mode-satellite-btn"
              onClick={() => setMapMode('SATELLITE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mapMode === 'SATELLITE'
                  ? 'bg-red-600 text-white shadow-sm shadow-red-950'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="High-resolution aerial satellite"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search intersection, quadrant..."
              className="w-full pl-8 pr-3 py-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl text-xs text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Drop Report Pin Quick Action */}
          <button
            id="map-drop-pin-btn"
            onClick={onNavigateToReport}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-950 transition-all shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Report</span>
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none px-1">
          <button
            onClick={() => setCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border ${
              categoryFilter === 'ALL'
                ? 'bg-zinc-800 text-white border-zinc-600'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800 hover:text-zinc-200'
            }`}
          >
            All Live Pings ({incidents.length})
          </button>

          <button
            onClick={() => setCategoryFilter('ICE_OPERATION')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
              categoryFilter === 'ICE_OPERATION'
                ? 'bg-red-950 text-red-300 border-red-500/60'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            ICE Stops
          </button>

          <button
            onClick={() => setCategoryFilter('BOUNTY_HUNTER')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
              categoryFilter === 'BOUNTY_HUNTER'
                ? 'bg-amber-950 text-amber-300 border-amber-500/60'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            Bounty Hunters
          </button>

          <button
            onClick={() => setCategoryFilter('SAFE_ZONE')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border flex items-center gap-1 ${
              categoryFilter === 'SAFE_ZONE'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/60'
                : 'bg-zinc-950/80 text-zinc-400 border-zinc-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Safe Zones
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        id="leaflet-radar-map"
        className="w-full h-full bg-zinc-950" 
      />

      {/* Floating Zoom & Recenter Controls */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-2">
        <button
          onClick={handleRecenter}
          className="p-2.5 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 shadow-xl backdrop-blur-md transition-all"
          title="Recenter Radar"
        >
          <Compass className="w-4 h-4 text-red-400" />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2.5 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 shadow-xl backdrop-blur-md transition-all"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2.5 rounded-xl bg-zinc-900/90 text-zinc-300 hover:text-white border border-zinc-700 shadow-xl backdrop-blur-md transition-all"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Incident Detail Pop-Up Window (Citizen Style) */}
      {activePopupIncident && (
        <div className="absolute bottom-20 left-3 right-3 md:left-auto md:right-4 md:w-96 z-30 animate-in slide-in-from-bottom-5">
          <div 
            id="incident-popup-card"
            className="bg-zinc-950/95 backdrop-blur-xl border-2 border-red-500/50 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
          >
            {/* Header with Category Badge & Close Button */}
            <div className="p-3.5 bg-gradient-to-r from-zinc-900 via-zinc-900 to-zinc-950 border-b border-zinc-800 flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    activePopupIncident.severity === 'URGENT'
                      ? 'bg-red-950 text-red-400 border border-red-700'
                      : 'bg-amber-950 text-amber-300 border border-amber-700'
                  }`}>
                    {activePopupIncident.severity} ALERT
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">{activePopupIncident.timeAgo}</span>
                </div>
                <h3 className="text-sm font-extrabold text-white mt-1 leading-snug">
                  {activePopupIncident.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePopupIncident(null)}
                className="text-zinc-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {/* Content Details */}
            <div className="p-3.5 space-y-3 text-xs max-h-60 overflow-y-auto">
              <div className="flex items-start gap-1.5 text-zinc-300 font-medium">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{activePopupIncident.locationName}</span>
              </div>

              <p className="text-zinc-300 leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/80">
                {activePopupIncident.description}
              </p>

              {/* Vehicle and Agent Notes */}
              {(activePopupIncident.vehiclesReported || activePopupIncident.agentsDescription) && (
                <div className="grid grid-cols-1 gap-1.5 p-2 bg-zinc-900/40 rounded-xl border border-zinc-800 text-[11px]">
                  {activePopupIncident.vehiclesReported && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Car className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="font-semibold text-zinc-400">Vehicles:</span>
                      <span className="truncate">{activePopupIncident.vehiclesReported}</span>
                    </div>
                  )}
                  {activePopupIncident.agentsDescription && (
                    <div className="flex items-center gap-1.5 text-zinc-300">
                      <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-semibold text-zinc-400">Agents:</span>
                      <span className="truncate">{activePopupIncident.agentsDescription}</span>
                    </div>
                  )}
                </div>
              )}

              {/* AI & Community Verification Stamp */}
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activePopupIncident.verificationStatus === 'VERIFIED_REAL' ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  ) : activePopupIncident.verificationStatus === 'AI_GENERATED_DETECTED' ? (
                    <Bot className="w-4 h-4 text-purple-400" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  )}
                  <div>
                    <div className="text-[11px] font-bold text-zinc-200">
                      {activePopupIncident.verificationStatus.replace(/_/g, ' ')}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      Trust Score: {activePopupIncident.verificationScore}%
                    </div>
                  </div>
                </div>

                {/* User Accuracy Voting System */}
                <div className="flex items-center gap-1">
                  <button
                    id="vote-confirm-incident-btn"
                    onClick={() => onVoteIncident(activePopupIncident.id, 'CONFIRM')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      activePopupIncident.userVoted === 'CONFIRM'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                    title="Confirm this incident is real"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{activePopupIncident.confirmations}</span>
                  </button>

                  <button
                    id="vote-dispute-incident-btn"
                    onClick={() => onVoteIncident(activePopupIncident.id, 'DISPUTE')}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${
                      activePopupIncident.userVoted === 'DISPUTE'
                        ? 'bg-red-950 text-red-300 border-red-500'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                    }`}
                    title="Dispute as inaccurate or false"
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>{activePopupIncident.disputes}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Link back to Button #1 (Home Location Feed) */}
            <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between gap-2">
              <button
                id="popup-goto-home-feed-btn"
                onClick={() => onNavigateToHomeFeed(activePopupIncident.id)}
                className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950 transition-all"
              >
                <span>View Full Story on Home Feed</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
