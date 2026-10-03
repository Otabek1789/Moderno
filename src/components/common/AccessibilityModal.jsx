import React from 'react';
import {
  Eye,
  X,
  Type,
  SunMedium,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Check,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { useLanguage } from '../../context/LanguageContext';
import sound from '../../utils/soundFX';

export default function AccessibilityModal() {
  const {
    settings,
    updateSetting,
    resetSettings,
    speakText,
    stopSpeaking,
    isSpeaking,
    isA11yOpen,
    closeA11y
  } = useAccessibility();

  const { language } = useLanguage();

  if (!isA11yOpen) return null;

  const fontSizes = [
    { id: 'normal', label: "Standart (100%)", sub: "A" },
    { id: 'large', label: "Katta (+16%)", sub: "A+" },
    { id: 'xlarge', label: "Juda Katta (+32%)", sub: "A++" }
  ];

  const contrastModes = [
    { id: 'normal', label: "Odatiy", color: "bg-slate-200 dark:bg-slate-700" },
    { id: 'high-contrast', label: "Yuqori Kontrast", color: "bg-amber-400 text-black font-bold" },
    { id: 'monochrome', label: "Monoxrom (Oq-qora)", color: "bg-gradient-to-r from-gray-400 to-gray-800" },
    { id: 'night-blue', label: "Tungi himoya", color: "bg-blue-950 text-blue-200 border border-blue-400" }
  ];

  const handleTestSpeech = () => {
    sound.playPop();
    const testPhrases = {
      uz: "MODERNO do'konining maxsus imkoniyatlar rejimi faollashtirildi. Xush kelibsiz!",
      ru: "Режим специальных возможностей магазина MODERNO активирован. Добро пожаловать!",
      en: "MODERNO accessibility mode is active. Welcome to our accessible store!"
    };
    speakText(testPhrases[language] || testPhrases.uz, language);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg sm:text-xl flex items-center gap-2">
                <span>Maxsus Imkoniyatlar</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  A11y Inklyuziv
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zaif ko'ruvchilar va qulay o'qish uchun moslashtirish
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              closeA11y();
            }}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Shrift hajmi */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-500" />
            <span>Matn va Shrift O'lchami</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {fontSizes.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playPop();
                  updateSetting('fontSize', f.id);
                }}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                  settings.fontSize === f.id
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className="text-lg font-black">{f.sub}</span>
                <span className="text-xs">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Kontrast va Rang rejimi */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <SunMedium className="w-4 h-4 text-amber-500" />
            <span>Kontrast va Vizual Filtrlash</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {contrastModes.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  sound.playPop();
                  updateSetting('contrast', c.id);
                }}
                className={`p-3 rounded-2xl border text-left transition flex items-center gap-3 ${
                  settings.contrast === c.id
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-full shrink-0 ${c.color}`} />
                <span className="text-xs font-medium truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Text to Speech & Dyslexia toggles */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Qo'shimcha Qulayliklar</span>
          </label>

          <div className="space-y-2">
            {/* Havolalarni tagiga chizish */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="pr-4">
                <p className="text-xs sm:text-sm font-semibold">Havolalarni aniq belgilash</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Barcha tugma va linklarga tagchiziq qo'shadi</p>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  updateSetting('underlineLinks', !settings.underlineLinks);
                }}
                className={`w-12 h-6 rounded-full transition relative ${
                  settings.underlineLinks ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.underlineLinks ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* O'qishni osonlashtirish (Dyslexia font) */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <div className="pr-4">
                <p className="text-xs sm:text-sm font-semibold">Kengaytirilgan harflar oralig'i</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Matnni o'qish tezligi va tushunishni osonlashtiradi</p>
              </div>
              <button
                onClick={() => {
                  sound.playPop();
                  updateSetting('dyslexiaFont', !settings.dyslexiaFont);
                }}
                className={`w-12 h-6 rounded-full transition relative ${
                  settings.dyslexiaFont ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.dyslexiaFont ? 'left-6.5' : 'left-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Text to Speech Test */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50">
              <div className="pr-4">
                <p className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                  Ovozli nutq sinovi (Text-To-Speech)
                </p>
                <p className="text-[11px] text-indigo-600/70 dark:text-indigo-400">
                  Matnlarni nutqqa aylantirish tizimini tekshirish
                </p>
              </div>
              <button
                onClick={isSpeaking ? stopSpeaking : handleTestSpeech}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shadow-md shadow-indigo-600/20"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 animate-pulse" /> To'xtatish
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" /> Sinash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              sound.playClick();
              resetSettings();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Standart holatga qaytarish
          </button>

          <button
            onClick={() => {
              sound.playSuccess();
              closeA11y();
            }}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition transform active:scale-95"
          >
            Saqlash va Yopish
          </button>
        </div>
      </div>
    </div>
  );
}
