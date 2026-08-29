import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import {
  ExternalLink,
  MapPin,
  Compass,
  Map,
  Mountain,
  Route,
  Satellite,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Flame,
  Layers
} from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { RiskLevel } from '../../services/types';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProjectMapItem {
  project_id: number;
  project_code: string;
  project_name: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  state_name?: string;
  sector_name?: string;
  ministry_name?: string;
  approved_cost?: number | string;
  risk_level?: RiskLevel | string;
  overall_risk?: number | string;
}

interface IndiaRiskMapProps {
  projects: ProjectMapItem[];
}

type BasemapKey = 'osm' | 'topo' | 'streets' | 'satellite';
type RiskFilterKey = 'ALL' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

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

// Custom High-Contrast SVG Beacon Icons for Leaflet
const createRiskIcon = (level?: string) => {
  const normLevel = (level || 'LOW').toUpperCase();

  let bgColor = '#10B981'; // Green (LOW)
  let ringColor = 'rgba(16, 185, 129, 0.4)';
  let label = 'L';
  let isPulse = false;

  if (normLevel === 'CRITICAL') {
    bgColor = '#EF4444'; // Red
    ringColor = 'rgba(239, 68, 68, 0.45)';
    label = 'CRIT';
    isPulse = true;
  } else if (normLevel === 'HIGH') {
    bgColor = '#F97316'; // Orange
    ringColor = 'rgba(249, 115, 22, 0.4)';
    label = 'HIGH';
  } else if (normLevel === 'MEDIUM') {
    bgColor = '#F59E0B'; // Amber / Yellow
    ringColor = 'rgba(245, 158, 11, 0.4)';
    label = 'MED';
  }

  const html = `
    <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
      ${
        isPulse
          ? `<div style="position: absolute; width: 34px; height: 34px; border-radius: 50%; background-color: ${ringColor}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>`
          : ''
      }
      <div style="position: relative; width: 24px; height: 24px; border-radius: 50%; background-color: ${bgColor}; border: 3px solid #FFFFFF; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="width: 7px; height: 7px; border-radius: 50%; background-color: #FFFFFF;"></div>
      </div>
    </div>
  `;

  return L.divIcon({
    className: 'custom-risk-pin',
    html: html,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
};

const MapViewReset: React.FC = () => {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([22.5937, 78.9629], 4.5)}
      title="Reset View to All India"
      className="absolute bottom-4 right-4 z-[400] bg-white hover:bg-slate-50 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 shadow-md transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
    >
      <Compass className="w-4 h-4 text-blue-600" />
      <span>Reset India View</span>
    </button>
  );
};

export const IndiaRiskMap: React.FC<IndiaRiskMapProps> = ({ projects }) => {
  const [selectedBasemap, setSelectedBasemap] = useState<BasemapKey>('osm');
  const [riskFilter, setRiskFilter] = useState<RiskFilterKey>('ALL');

  const currentBasemap = BASEMAPS[selectedBasemap] || BASEMAPS.osm;

  // Filter valid geographic coordinate points
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

  // Counts by Risk Tier
  const counts = useMemo(() => {
    const low = validProjects.filter((p) => String(p.risk_level).toUpperCase() === 'LOW').length;
    const med = validProjects.filter((p) => String(p.risk_level).toUpperCase() === 'MEDIUM').length;
    const high = validProjects.filter((p) => String(p.risk_level).toUpperCase() === 'HIGH').length;
    const crit = validProjects.filter((p) => String(p.risk_level).toUpperCase() === 'CRITICAL').length;
    return {
      all: validProjects.length,
      low,
      med,
      high,
      crit
    };
  }, [validProjects]);

  // Projects filtered by selected risk level
  const displayedProjects = useMemo(() => {
    if (riskFilter === 'ALL') return validProjects;
    return validProjects.filter((p) => String(p.risk_level).toUpperCase() === riskFilter);
  }, [validProjects, riskFilter]);

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">National Geospatial Intelligence Map</h3>
              <p className="text-xs text-slate-500">
                Live monitoring across {validProjects.length} infrastructure assets color-coded by AI Risk Tier
              </p>
            </div>
          </div>
        </div>

        {/* Basemap Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setSelectedBasemap('osm')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedBasemap === 'osm'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Standard OpenStreetMap"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Standard</span>
          </button>
          <button
            onClick={() => setSelectedBasemap('topo')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedBasemap === 'topo'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Topographic Terrain"
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Topo</span>
          </button>
          <button
            onClick={() => setSelectedBasemap('streets')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 hidden sm:inline-flex ${
              selectedBasemap === 'streets'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Highways & Roads"
          >
            <Route className="w-3.5 h-3.5" />
            <span>Highways</span>
          </button>
          <button
            onClick={() => setSelectedBasemap('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedBasemap === 'satellite'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Satellite Imagery"
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Risk Tier Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
        <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" /> Filter Map:
        </span>

        {/* All Filter */}
        <button
          onClick={() => setRiskFilter('ALL')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
            riskFilter === 'ALL'
              ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All ({counts.all})
        </button>

        {/* Low Risk Filter */}
        <button
          onClick={() => setRiskFilter('LOW')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            riskFilter === 'LOW'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white"></span>
          <span>Low Risk ({counts.low})</span>
        </button>

        {/* Medium Risk Filter */}
        <button
          onClick={() => setRiskFilter('MEDIUM')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            riskFilter === 'MEDIUM'
              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
              : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-white"></span>
          <span>Medium Risk ({counts.med})</span>
        </button>

        {/* High Risk Filter */}
        <button
          onClick={() => setRiskFilter('HIGH')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            riskFilter === 'HIGH'
              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
              : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-orange-500 border border-white"></span>
          <span>High Risk ({counts.high})</span>
        </button>

        {/* Critical Risk Filter */}
        <button
          onClick={() => setRiskFilter('CRITICAL')}
          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
            riskFilter === 'CRITICAL'
              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
              : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 border border-white animate-pulse"></span>
          <span>Critical Risk ({counts.crit})</span>
        </button>
      </div>

      {/* 3. Interactive Leaflet Map Container */}
      <div className="h-[430px] w-full rounded-2xl overflow-hidden border border-slate-200 relative z-0 shadow-inner">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={4.5}
          scrollWheelZoom={false}
          style={{ 
            height: '100%', 
            width: '100%', 
            backgroundColor: '#D1E5EE' 
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

          {/* Floating On-Map High-Contrast Legend */}
          <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-xs p-3 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-1.5 max-w-[210px] hidden sm:block">
            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
              Risk Level Legend
            </span>
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white shrink-0 shadow-xs" />
                <span>Low Risk (&lt;30)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className="w-3 h-3 rounded-full bg-amber-500 border border-white shrink-0 shadow-xs" />
                <span>Medium (30 - 60)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className="w-3 h-3 rounded-full bg-orange-500 border border-white shrink-0 shadow-xs" />
                <span>High (60 - 80)</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <span className="w-3 h-3 rounded-full bg-rose-500 border border-white shrink-0 shadow-xs animate-pulse" />
                <span>Critical (&gt;80)</span>
              </div>
            </div>
          </div>

          {/* Project Markers */}
          {displayedProjects.map((p) => {
            const lat = Number(p.latitude);
            const lng = Number(p.longitude);
            const icon = createRiskIcon(String(p.risk_level || 'LOW'));
            const cost = Number(p.approved_cost) || 0;

            return (
              <Marker
                key={p.project_id}
                position={[lat, lng]}
                icon={icon}
              >
                {/* Hover Quick Tooltip */}
                <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
                  <div className="font-sans text-xs">
                    <span className="font-mono font-bold text-blue-600">{p.project_code}</span>: {p.project_name}
                    <div className="font-bold text-slate-700 mt-0.5">
                      Risk: <span className="uppercase">{p.risk_level || 'LOW'}</span> ({Number(p.overall_risk || 0).toFixed(1)})
                    </div>
                  </div>
                </Tooltip>

                {/* Click Rich Popup */}
                <Popup className="custom-popup">
                  <div className="p-2 space-y-2.5 max-w-xs text-slate-900 font-sans">
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

                    <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">State:</span>
                        <span className="font-semibold text-slate-800 truncate block">{p.state_name || '—'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Cost:</span>
                        <span className="font-mono font-bold text-slate-900">{formatCurrency(cost, { compact: true })}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-slate-200">
                      <RiskBadge level={p.risk_level as RiskLevel} score={Number(p.overall_risk || 0)} size="sm" />
                      <Link
                        to={`/projects/${p.project_id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        Project 360° <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default IndiaRiskMap;
