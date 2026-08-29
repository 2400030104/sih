import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { ExternalLink, MapPin, Compass, Map, Mountain, Route, Moon, Satellite } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { RiskLevel } from '../../services/types';

interface ProjectMapItem {
  project_id: number;
  project_code: string;
  project_name: string;
  latitude?: number;
  longitude?: number;
  state_name?: string;
  sector_name?: string;
  risk_level?: RiskLevel;
  overall_risk?: number;
}

interface IndiaRiskMapProps {
  projects: ProjectMapItem[];
}

type BasemapKey = 'osm' | 'topo' | 'streets' | 'satellite';

interface BasemapConfig {
  name: string;
  url: string;
  attribution: string;
  subdomains?: string[];
  maxZoom?: number;
}

const BASEMAPS: Record<BasemapKey, BasemapConfig> = {
  osm: {
    name: 'National Standard',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  },
  topo: {
    name: 'Topographic',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
    maxZoom: 18
  },
  streets: {
    name: 'Highways',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme',
    maxZoom: 18
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics',
    maxZoom: 18
  }
};

const MapViewReset: React.FC = () => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([22.5937, 78.9629], 4.5)}
      title="Reset View to All India"
      className="absolute bottom-4 right-4 z-[400] bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-btn border border-slate-200 shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
    >
      <Compass className="w-4 h-4 text-blue-600" />
      <span>Reset India View</span>
    </button>
  );
};

export const IndiaRiskMap: React.FC<IndiaRiskMapProps> = ({ projects }) => {
  const [selectedBasemap, setSelectedBasemap] = useState<BasemapKey>('osm');

  const currentBasemap = BASEMAPS[selectedBasemap] || BASEMAPS.osm;

  const validProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.latitude !== undefined &&
        p.latitude !== null &&
        p.longitude !== undefined &&
        p.longitude !== null &&
        !isNaN(Number(p.latitude)) &&
        !isNaN(Number(p.longitude)) &&
        Number(p.latitude) >= 6.0 &&
        Number(p.latitude) <= 38.0 &&
        Number(p.longitude) >= 68.0 &&
        Number(p.longitude) <= 98.0
    );
  }, [projects]);

  const getMarkerColor = (level?: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return '#DC2626';
      case 'HIGH':
        return '#EA580C';
      case 'MEDIUM':
        return '#D97706';
      case 'LOW':
      default:
        return '#059669';
    }
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">National Geospatial Risk Map</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {validProjects.length} Pin{validProjects.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Geographic distribution across India color-coded by Gradient Boosting risk severity
          </p>
        </div>

        {/* Basemap Switcher & Severity Legend */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Basemap Selection Tabs with Lucide Icons */}
          <div className="flex items-center bg-slate-50 p-1 rounded-btn border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedBasemap('osm')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBasemap === 'osm'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Standard OpenStreetMap"
            >
              <Map className="w-3.5 h-3.5" />
              <span>Standard</span>
            </button>
            <button
              onClick={() => setSelectedBasemap('topo')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBasemap === 'topo'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Topographic Terrain"
            >
              <Mountain className="w-3.5 h-3.5" />
              <span>Topo</span>
            </button>
            <button
              onClick={() => setSelectedBasemap('streets')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 hidden sm:inline-flex ${
                selectedBasemap === 'streets'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="National Highways & Roads"
            >
              <Route className="w-3.5 h-3.5" />
              <span>Highways</span>
            </button>
            <button
              onClick={() => setSelectedBasemap('satellite')}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedBasemap === 'satellite'
                  ? 'bg-blue-600 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Satellite Imagery"
            >
              <Satellite className="w-3.5 h-3.5" />
              <span>Satellite</span>
            </button>
          </div>

          {/* Severity Legend */}
          <div className="flex items-center gap-2.5 text-xs bg-slate-50 px-3 py-1.5 rounded-btn border border-slate-200">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Low
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Med
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High
            </span>
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span> Critical
            </span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-96 w-full rounded-card overflow-hidden border border-slate-200 relative z-0 shadow-inner">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.5}
          scrollWheelZoom={false}
          style={{ 
            height: '100%', 
            width: '100%', 
            backgroundColor: '#AAD3DF' 
          }}
        >
          <TileLayer
            key={selectedBasemap}
            attribution={currentBasemap.attribution}
            url={currentBasemap.url}
            subdomains={currentBasemap.subdomains || ['a', 'b', 'c']}
            maxZoom={currentBasemap.maxZoom || 19}
          />

          <MapViewReset />

          {validProjects.map((p) => {
            const lat = Number(p.latitude);
            const lng = Number(p.longitude);
            const color = getMarkerColor(p.risk_level);

            return (
              <CircleMarker
                key={p.project_id}
                center={[lat, lng]}
                radius={p.risk_level === 'CRITICAL' ? 11 : 9}
                pathOptions={{
                  fillColor: color,
                  fillOpacity: 0.95,
                  color: '#FFFFFF',
                  weight: 2.5
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-2 space-y-2.5 max-w-xs text-slate-900">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800">
                        #{String(p.project_id).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">
                        {p.project_code}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {p.project_name}
                    </h4>

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded border border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[10px]">State:</span>
                        <span className="font-semibold text-slate-800">{p.state_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Sector:</span>
                        <span className="font-semibold text-slate-800">{p.sector_name || '—'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <RiskBadge level={p.risk_level} score={p.overall_risk} size="sm" />
                      <Link
                        to={`/projects/${p.project_id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Project 360° <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
