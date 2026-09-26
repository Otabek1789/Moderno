import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, Clock, Navigation, ExternalLink } from 'lucide-react';
import { storeBranches } from '../../data/storeBranches';
import { useLanguage } from '../../context/LanguageContext';

// Custom SVG Pin icon for reliable rendering without missing asset URLs
const customIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `
    <div style="
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      width: 36px;
      height: 36px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 12px;
        height: 12px;
        background: white;
        border-radius: 50%;
        transform: rotate(45deg);
      "></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Helper component to smoothly animate map center change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent({ selectedBranchId, onSelectBranch }) {
  const { language, t } = useLanguage();
  const [activeBranch, setActiveBranch] = useState(
    storeBranches.find((b) => b.id === selectedBranchId) || storeBranches[0]
  );

  useEffect(() => {
    if (selectedBranchId) {
      const found = storeBranches.find((b) => b.id === selectedBranchId);
      if (found) setActiveBranch(found);
    }
  }, [selectedBranchId]);

  const handleBranchClick = (branch) => {
    setActiveBranch(branch);
    if (onSelectBranch) onSelectBranch(branch.id);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl overflow-hidden">
      {/* Branches List on the Left */}
      <div className="lg:w-1/3 flex flex-col gap-3">
        <div className="mb-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            {t('contact.ourBranches')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('contact.selectBranch')}
          </p>
        </div>

        <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
          {storeBranches.map((branch) => {
            const isSelected = activeBranch.id === branch.id;
            const branchName = branch.name[language] || branch.name['uz'];
            const branchAddress = branch.address[language] || branch.address['uz'];

            return (
              <div
                key={branch.id}
                onClick={() => handleBranchClick(branch)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {branchName}
                  </h4>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {branch.city}
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2.5 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{branchAddress}</span>
                </p>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200/60 dark:border-slate-700/60 pt-2">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-indigo-500" />
                    {branch.phone}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Clock className="w-3 h-3 text-amber-500" />
                    {branch.hours}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Map on the Right */}
      <div className="lg:w-2/3 h-[420px] lg:h-[480px] rounded-2xl overflow-hidden relative shadow-inner border border-slate-200 dark:border-slate-800">
        <MapContainer
          center={[activeBranch.lat, activeBranch.lng]}
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <ChangeView center={[activeBranch.lat, activeBranch.lng]} zoom={15} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {storeBranches.map((branch) => {
            const bName = branch.name[language] || branch.name['uz'];
            const bAddr = branch.address[language] || branch.address['uz'];
            return (
              <Marker
                key={branch.id}
                position={[branch.lat, branch.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleBranchClick(branch)
                }}
              >
                <Popup>
                  <div className="p-1 max-w-[220px]">
                    <img
                      src={branch.image}
                      alt={bName}
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                    <h5 className="font-bold text-xs text-slate-900 mb-1">{bName}</h5>
                    <p className="text-[11px] text-slate-600 mb-2 leading-tight">{bAddr}</p>
                    <a
                      href={`https://maps.google.com/?q=${branch.lat},${branch.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <Navigation className="w-3 h-3" /> {t('contact.getDirections')}
                    </a>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Quick Action Overlay */}
        <div className="absolute bottom-4 right-4 z-20">
          <a
            href={`https://maps.google.com/?q=${activeBranch.lat},${activeBranch.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 backdrop-blur-md transition-all active:scale-95"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Google Xaritalarda ochish</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
