import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Cpu,
  Monitor,
  HardDrive,
  Zap,
  ShieldCheck,
  AlertTriangle,
  ShoppingBag,
  RotateCcw,
  Check,
  Flame,
  Layers,
  Sparkles,
  Gamepad2,
  Trash2,
  Share2,
  CheckCircle2,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../context/StoreContext';
import { formatPrice } from '../utils/formatters';
import sound from '../utils/soundFX';

// 8 PC Component Categories Database
const PC_PARTS = {
  cpu: {
    name: 'Protsessor (CPU)',
    icon: Cpu,
    items: [
      {
        id: 'cpu_14600k',
        name: 'Intel Core i5-14600K (14 yadro, 5.3 GHz)',
        socket: 'LGA1700',
        tdp: 125,
        gamingTier: 4,
        price: 3850000,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'cpu_14700k',
        name: 'Intel Core i7-14700K (20 yadro, 5.6 GHz)',
        socket: 'LGA1700',
        tdp: 253,
        gamingTier: 5,
        price: 5490000,
        image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'cpu_7600x',
        name: 'AMD Ryzen 5 7600X (6 yadro, 5.3 GHz)',
        socket: 'AM5',
        tdp: 105,
        gamingTier: 4,
        price: 2990000,
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'cpu_7800x3d',
        name: 'AMD Ryzen 7 7800X3D (8 yadro, 3D V-Cache)',
        socket: 'AM5',
        tdp: 120,
        gamingTier: 6,
        price: 5290000,
        badge: 'Top Gaming',
        image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  motherboard: {
    name: 'Ona plata (Motherboard)',
    icon: Layers,
    items: [
      {
        id: 'mb_b760',
        name: 'ASUS TUF Gaming B760-PLUS WiFi DDR5',
        socket: 'LGA1700',
        tdp: 50,
        price: 2350000,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'mb_z790',
        name: 'MSI MAG Z790 TOMAHAWK MAX WiFi DDR5',
        socket: 'LGA1700',
        tdp: 60,
        price: 3890000,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'mb_b650',
        name: 'ASUS ROG STRIX B650-A GAMING WiFi',
        socket: 'AM5',
        tdp: 50,
        price: 3100000,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'mb_x670',
        name: 'Gigabyte X670 AORUS ELITE AX AM5',
        socket: 'AM5',
        tdp: 60,
        price: 4200000,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  gpu: {
    name: 'Videokarta (GPU)',
    icon: Gamepad2,
    items: [
      {
        id: 'gpu_4060',
        name: 'Palit GeForce RTX 4060 Dual 8GB GDDR6',
        tdp: 115,
        gpuScore: 50,
        price: 4190000,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'gpu_4070s',
        name: 'Gigabyte GeForce RTX 4070 SUPER WINDFORCE 12GB',
        tdp: 220,
        gpuScore: 80,
        price: 8490000,
        badge: 'Ommabop',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'gpu_4080s',
        name: 'ASUS TUF Gaming GeForce RTX 4080 SUPER 16GB',
        tdp: 320,
        gpuScore: 110,
        price: 14800000,
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'gpu_4090',
        name: 'MSI GeForce RTX 4090 SUPRIM X 24GB GDDR6X',
        tdp: 450,
        gpuScore: 160,
        price: 24500000,
        badge: 'Ultra Flagman',
        image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  ram: {
    name: 'Tezkor Xotira (RAM)',
    icon: Zap,
    items: [
      {
        id: 'ram_16',
        name: 'Kingston FURY Beast DDR5 16GB (2x8GB) 5600MHz',
        tdp: 15,
        price: 890000,
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'ram_32',
        name: 'Corsair Vengeance RGB DDR5 32GB (2x16GB) 6000MHz',
        tdp: 20,
        price: 1750000,
        badge: 'Tavsiya',
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'ram_64',
        name: 'G.Skill Trident Z5 RGB 64GB (2x32GB) 6400MHz',
        tdp: 25,
        price: 3290000,
        image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  storage: {
    name: 'Doimiy Xotira (SSD NVMe)',
    icon: HardDrive,
    items: [
      {
        id: 'ssd_1tb_samsung',
        name: 'Samsung 990 PRO 1TB PCIe 4.0 (7450 MB/s)',
        tdp: 10,
        price: 1590000,
        badge: 'Eng tezkor',
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'ssd_2tb_kingston',
        name: 'Kingston KC3000 2TB PCIe 4.0 (7000 MB/s)',
        tdp: 10,
        price: 2350000,
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'ssd_1tb_crucial',
        name: 'Crucial P3 Plus 1TB PCIe 4.0 M.2',
        tdp: 8,
        price: 890000,
        image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  psu: {
    name: 'Blok Pitaniya (PSU)',
    icon: Zap,
    items: [
      {
        id: 'psu_650',
        name: 'DeepCool PK650D 650W 80 Plus Bronze',
        wattage: 650,
        price: 690000,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'psu_750',
        name: 'Corsair RM750e 750W 80 Plus Gold Modular',
        wattage: 750,
        price: 1450000,
        badge: 'Oltin standart',
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'psu_850',
        name: 'ASUS ROG Strix 850W 80 Plus Gold Modular',
        wattage: 850,
        price: 2190000,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'psu_1000',
        name: 'be quiet! Dark Power 13 1000W Titanium',
        wattage: 1000,
        price: 3590000,
        image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  pcCase: {
    name: 'Korpus (Case)',
    icon: Monitor,
    items: [
      {
        id: 'case_ch560',
        name: 'DeepCool CH560 DIGITAL ARGB Display Case',
        price: 1190000,
        image: 'https://images.unsplash.com/photo-1587202372574-644487b1c34f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'case_h9',
        name: 'NZXT H9 Flow Dual-Chamber Panoramik Korpus',
        price: 2390000,
        badge: 'Panoramik',
        image: 'https://images.unsplash.com/photo-1587202372574-644487b1c34f?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'case_o11',
        name: 'Lian Li O11 Dynamic EVO RGB Black',
        price: 2790000,
        image: 'https://images.unsplash.com/photo-1587202372574-644487b1c34f?auto=format&fit=crop&w=500&q=80'
      }
    ]
  },
  cooler: {
    name: 'Sovutish Tizimi (Cooler)',
    icon: Flame,
    items: [
      {
        id: 'cooler_ak620',
        name: 'DeepCool AK620 Digital Dual-Tower Kuler',
        tdpCapacity: 260,
        price: 890000,
        image: 'https://images.unsplash.com/photo-1587202372195-e669270dd204?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'cooler_kraken360',
        name: 'NZXT Kraken Elite 360 RGB Suyuqlikli Sovutgich',
        tdpCapacity: 350,
        price: 3190000,
        badge: 'LCD Ekranli',
        image: 'https://images.unsplash.com/photo-1587202372195-e669270dd204?auto=format&fit=crop&w=500&q=80'
      },
      {
        id: 'cooler_arctic360',
        name: 'Arctic Liquid Freezer III 360 A-RGB',
        tdpCapacity: 320,
        price: 1850000,
        image: 'https://images.unsplash.com/photo-1587202372195-e669270dd204?auto=format&fit=crop&w=500&q=80'
      }
    ]
  }
};

// Games database for FPS Simulator
const POPULAR_GAMES = [
  { id: 'cs2', name: 'Counter-Strike 2', baseFps: 280, diffFactor: 1.2 },
  { id: 'cyberpunk', name: 'Cyberpunk 2077 (Ray Tracing)', baseFps: 85, diffFactor: 0.65 },
  { id: 'gta5', name: 'GTA V / GTA Online', baseFps: 170, diffFactor: 1.0 },
  { id: 'warzone', name: 'Call of Duty: Warzone', baseFps: 135, diffFactor: 0.85 },
  { id: 'dota2', name: 'Dota 2 Ultra', baseFps: 260, diffFactor: 1.3 }
];

export default function PCBuilder() {
  const { addToCart } = useStore();
  const { t } = useLanguage();

  // Active category tab
  const [activeCategory, setActiveCategory] = useState('cpu');

  // Selected Parts
  const [selectedParts, setSelectedParts] = useState({
    cpu: PC_PARTS.cpu.items[0],
    motherboard: PC_PARTS.motherboard.items[0],
    gpu: PC_PARTS.gpu.items[1],
    ram: PC_PARTS.ram.items[1],
    storage: PC_PARTS.storage.items[0],
    psu: PC_PARTS.psu.items[1],
    pcCase: PC_PARTS.pcCase.items[0],
    cooler: PC_PARTS.cooler.items[0]
  });

  // FPS Resolution setting: 1080p, 1440p, 4k
  const [selectedRes, setSelectedRes] = useState('1440p');
  const [copiedLink, setCopiedLink] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Select component handler
  const handleSelectPart = (catKey, item) => {
    sound.playPowerUp();
    setSelectedParts((prev) => ({
      ...prev,
      [catKey]: item
    }));
    setAddedToCart(false);
  };

  const handleRemovePart = (catKey) => {
    sound.playPop();
    setSelectedParts((prev) => ({
      ...prev,
      [catKey]: null
    }));
    setAddedToCart(false);
  };

  // Calculations
  const totalPrice = useMemo(() => {
    return Object.values(selectedParts).reduce((sum, item) => sum + (item?.price || 0), 0);
  }, [selectedParts]);

  const totalWattage = useMemo(() => {
    let tdp = 60; // baseline for fans, rgb, board
    if (selectedParts.cpu) tdp += selectedParts.cpu.tdp || 65;
    if (selectedParts.gpu) tdp += selectedParts.gpu.tdp || 120;
    if (selectedParts.motherboard) tdp += selectedParts.motherboard.tdp || 50;
    if (selectedParts.ram) tdp += selectedParts.ram.tdp || 15;
    if (selectedParts.storage) tdp += selectedParts.storage.tdp || 10;
    return tdp;
  }, [selectedParts]);

  const psuWattage = selectedParts.psu?.wattage || 0;
  const isPowerSufficient = psuWattage ? psuWattage >= totalWattage + 100 : true;

  // Socket Compatibility Check
  const socketMismatch = useMemo(() => {
    if (selectedParts.cpu && selectedParts.motherboard) {
      return selectedParts.cpu.socket !== selectedParts.motherboard.socket;
    }
    return false;
  }, [selectedParts.cpu, selectedParts.motherboard]);

  // Dynamic FPS calculation
  const calculateGameFps = (game) => {
    const gpuScore = selectedParts.gpu?.gpuScore || 50;
    const cpuTier = selectedParts.cpu?.gamingTier || 4;
    const base = game.baseFps * (gpuScore / 80) * (cpuTier / 4);

    let resMultiplier = 1.0;
    if (selectedRes === '1080p') resMultiplier = 1.25;
    if (selectedRes === '1440p') resMultiplier = 1.0;
    if (selectedRes === '4k') resMultiplier = 0.58;

    return Math.round(base * resMultiplier);
  };

  const handleAddAllToCart = () => {
    if (socketMismatch) {
      alert(t('pcBuilder.socketAlert'));
      return;
    }

    sound.playSuccess();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const bundleName = `[CUSTOM PC BUILD] ${selectedParts.cpu?.name?.split('(')[0] || 'Gaming PC'} + ${selectedParts.gpu?.name?.split('(')[0] || 'RTX'}`;

    addToCart({
      id: Date.now(),
      name: bundleName,
      price: totalPrice,
      discountPrice: null,
      image: selectedParts.pcCase?.image || selectedParts.gpu?.image,
      category: 'pc_build',
      isCustomBuild: true,
      buildDetails: selectedParts
    }, 1);

    setAddedToCart(true);
  };

  const handleShare = () => {
    sound.playClick();
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide uppercase mb-3 border border-indigo-500/30">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>{t('pcBuilder.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
            {t('pcBuilder.title')} <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{t('pcBuilder.titleHighlight')}</span> {t('pcBuilder.titleEnd')}
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {t('pcBuilder.subtitle')}
          </p>
        </div>

        {/* Compatibility & Wattage Status Alerts */}
        <div className="mb-8 space-y-3">
          {socketMismatch && (
            <div className="p-4 rounded-2xl bg-rose-500/20 border-2 border-rose-500/60 text-rose-300 flex items-center gap-3 animate-fadeIn">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">{t('pcBuilder.socketMismatchTitle')}</p>
                <p className="text-xs text-rose-300/90">
                  {t('pcBuilder.socketMismatchDesc', { cpuSocket: selectedParts.cpu?.socket, mbSocket: selectedParts.motherboard?.socket })}
                </p>
              </div>
            </div>
          )}

          {!isPowerSufficient && (
            <div className="p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/60 text-amber-300 flex items-center gap-3 animate-fadeIn">
              <Zap className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold text-sm">{t('pcBuilder.psuWarningTitle')}</p>
                <p className="text-xs text-amber-300/90">
                  {t('pcBuilder.psuWarningDesc', { required: totalWattage, current: psuWattage, recommended: totalWattage + 100 })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Studio Layout: 3 Columns (Categories Tabs / Parts Selector / Build Summary & FPS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Category Selector (3 Cols) */}
          <div className="lg:col-span-3 space-y-2">
            <h3 className="text-xs font-bold uppercase text-slate-400 px-2 mb-2">
              {t('pcBuilder.partsSection')}
            </h3>
            {Object.entries(PC_PARTS).map(([catKey, cat]) => {
              const Icon = cat.icon;
              const isSelectedCat = activeCategory === catKey;
              const chosen = selectedParts[catKey];

              return (
                <button
                  key={catKey}
                  onClick={() => {
                    sound.playClick();
                    setActiveCategory(catKey);
                  }}
                  className={`w-full p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                    isSelectedCat
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-slate-800/80 border-slate-700/70 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isSelectedCat ? 'bg-white/20' : 'bg-slate-700'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate">{cat.name.split('(')[0]}</p>
                      <p className={`text-[11px] truncate ${isSelectedCat ? 'text-indigo-200' : 'text-slate-400'}`}>
                        {chosen ? chosen.name.split('(')[0] : t('pcBuilder.notSelected')}
                      </p>
                    </div>
                  </div>
                  {chosen && (
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelectedCat ? 'text-white' : 'text-emerald-400'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Col 2: Active Category Parts Grid (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-800/60 border border-slate-700/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-700">
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{PC_PARTS[activeCategory].name} {t('pcBuilder.selectPart')}</span>
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {PC_PARTS[activeCategory].items.length} {t('pcBuilder.variants')}
              </span>
            </div>

            <div className="space-y-3">
              {PC_PARTS[activeCategory].items.map((item) => {
                const isSelected = selectedParts[activeCategory]?.id === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectPart(activeCategory, item)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/50 shadow-md'
                        : 'bg-slate-800/90 border-slate-700/70 hover:border-slate-600 hover:bg-slate-800'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {item.badge && (
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.badge}
                          </span>
                        )}
                        {item.socket && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                            {item.socket}
                          </span>
                        )}
                        {item.wattage && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {item.wattage}W
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                        {item.name}
                      </h4>
                      <p className="text-xs font-black text-amber-400 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <button
                        className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {isSelected ? <Check className="w-4 h-4" /> : '+'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: Live Build Summary & FPS Simulator (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Real-time FPS Simulator Widget */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                  <Gamepad2 className="w-4 h-4" />
                  {t('pcBuilder.fpsTitle')}
                </span>

                {/* Resolution switch */}
                <div className="flex items-center p-0.5 rounded-lg bg-slate-900 border border-slate-700 text-[11px]">
                  {['1080p', '1440p', '4k'].map((res) => (
                    <button
                      key={res}
                      onClick={() => {
                        sound.playClick();
                        setSelectedRes(res);
                      }}
                      className={`px-2 py-0.5 rounded-md font-bold transition uppercase ${
                        selectedRes === res ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Game Bars */}
              <div className="space-y-3">
                {POPULAR_GAMES.map((game) => {
                  const fps = calculateGameFps(game);
                  const isUltra = fps >= 144;

                  return (
                    <div key={game.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-semibold">{game.name}</span>
                        <span className={`font-black ${isUltra ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {fps} FPS
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-700 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isUltra
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                              : 'bg-gradient-to-r from-amber-500 to-orange-400'
                          }`}
                          style={{ width: `${Math.min(100, (fps / 300) * 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Build Summary Card */}
            <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  {t('pcBuilder.totalValue')}
                </span>
                <span className="text-xs text-indigo-300 font-semibold">
                  ~{totalWattage}W {t('pcBuilder.power')}
                </span>
              </div>

              <div className="text-2xl sm:text-3xl font-black text-amber-400 mb-5">
                {formatPrice(totalPrice)}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={handleAddAllToCart}
                  disabled={socketMismatch}
                  className={`w-full py-4 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 ${
                    socketMismatch
                      ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                      : addedToCart
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-indigo-500/30'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{addedToCart ? t('pcBuilder.addedToCart') : t('pcBuilder.addAllToCart')}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/20 transition flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? t('pcBuilder.linkCopied') : t('pcBuilder.shareConfig')}</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400 mt-4 text-center">
                {t('pcBuilder.assemblyNote')}
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
