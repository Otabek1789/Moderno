import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import {
  Truck,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  X,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import sound from '../../utils/soundFX';
import { formatPrice } from '../../utils/formatters';

// Custom Map Marker Icons using Leaflet divIcon
const createCourierIcon = () =>
  L.divIcon({
    className: 'custom-courier-marker',
    html: `
      <div style="
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #4f46e5, #ec4899);
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10px 20px rgba(79, 70, 229, 0.4);
        position: relative;
      ">
        <span style="font-size: 20px;">🛵</span>
        <span style="
          position: absolute;
          top: -4px;
          right: -4px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 50%;
        "></span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22]
  });

const createStoreIcon = () =>
  L.divIcon({
    className: 'custom-store-marker',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: #0f172a;
        color: #ffffff;
        border: 3px solid #6366f1;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <span style="font-size: 16px;">🏬</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

const createCustomerIcon = () =>
  L.divIcon({
    className: 'custom-customer-marker',
    html: `
      <div style="
        width: 38px;
        height: 38px;
        background: #ef4444;
        color: #ffffff;
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
      ">
        <span style="font-size: 16px;">📍</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

// Simulated GPS path in Tashkent
const ROUTE_COORDINATES = [
  [41.311158, 69.279737], // Warehouse (Amir Temur)
  [41.305500, 69.272000],
  [41.298000, 69.263000],
  [41.291000, 69.251000],
  [41.285500, 69.238000],
  [41.281000, 69.221000],
  [41.278500, 69.208500]  // Customer Address
];

export default function LiveCourierMapModal({ isOpen, onClose, order }) {
  const [currentCoordIndex, setCurrentCoordIndex] = useState(1);
  const [courierPosition, setCourierPosition] = useState(ROUTE_COORDINATES[1]);
  const [remainingMinutes, setRemainingMinutes] = useState(14);
  const [speed, setSpeed] = useState(36);

  useEffect(() => {
    if (!isOpen) return;

    // Simulate animated vehicle movement along coordinates
    const interval = setInterval(() => {
      setCurrentCoordIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % ROUTE_COORDINATES.length;
        setCourierPosition(ROUTE_COORDINATES[nextIndex]);
        setSpeed(32 + Math.floor(Math.random() * 12));
        setRemainingMinutes((min) => Math.max(2, min - 1));
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const startCoord = ROUTE_COORDINATES[0];
  const endCoord = ROUTE_COORDINATES[ROUTE_COORDINATES.length - 1];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 relative flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Truck className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  Jonli Kuryer Xaritasi #{order.id}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                  ● Real vaqtda
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manzil: {order.address || "Toshkent shahri"}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map View */}
        <div className="w-full h-72 sm:h-96 relative">
          <MapContainer
            center={courierPosition}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Warehouse Marker */}
            <Marker position={startCoord} icon={createStoreIcon()}>
              <Popup>
                <div className="text-xs font-sans">
                  <b>MODERNO Markaziy Ombori</b>
                  <p>Amir Temur shoh ko'chasi 108</p>
                </div>
              </Popup>
            </Marker>

            {/* Customer Marker */}
            <Marker position={endCoord} icon={createCustomerIcon()}>
              <Popup>
                <div className="text-xs font-sans">
                  <b>Yetkazish manzili</b>
                  <p>{order.customerName}</p>
                </div>
              </Popup>
            </Marker>

            {/* Moving Courier Marker */}
            <Marker position={courierPosition} icon={createCourierIcon()}>
              <Popup>
                <div className="text-xs font-sans">
                  <b>Rustam Karimov (Kuryer)</b>
                  <p>Tezlik: {speed} km/soat</p>
                </div>
              </Popup>
            </Marker>

            {/* Route Line */}
            <Polyline
              positions={ROUTE_COORDINATES}
              color="#6366f1"
              weight={5}
              opacity={0.7}
              dashArray="8, 8"
            />
          </MapContainer>

          {/* Floating ETA Badge on Map */}
          <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Yetib kelish vaqti</p>
              <p className="text-sm font-extrabold text-amber-300">
                ~ {remainingMinutes} daqiqa qoldi
              </p>
            </div>
          </div>
        </div>

        {/* Courier Driver Details Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-lg shadow-md">
              RK
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base">
                Rustam Karimov
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Transport: <b>Chevrolet Labo (01 A 777 AA)</b> • Tezkor kuryer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:+998909998877"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
            >
              <Phone className="w-3.5 h-3.5" /> Qo'ng'iroq qilish
            </a>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
            >
              Yopish
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
