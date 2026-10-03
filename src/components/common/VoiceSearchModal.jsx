import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  MicOff,
  X,
  Search,
  Sparkles,
  Volume2,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import sound from '../../utils/soundFX';

export default function VoiceSearchModal({ isOpen, onClose }) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSupported, setIsSupported] = useState(true);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isSupported) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen, isSupported]);

  const startListening = () => {
    setErrorMessage('');
    setTranscript('');

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setErrorMessage("Brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi (Google Chrome yoki Edge tavsiya etiladi).");
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;

      // Select speech language
      if (language === 'ru') {
        recognition.lang = 'ru-RU';
      } else if (language === 'en') {
        recognition.lang = 'en-US';
      } else {
        // Many browsers support uz-UZ, fallback handles gracefully
        recognition.lang = 'uz-UZ';
      }

      recognition.onstart = () => {
        setIsListening(true);
        sound.playPop();
      };

      recognition.onresult = (event) => {
        let currentTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        // If finalized
        if (event.results[0].isFinal) {
          sound.playSuccess();
          setTimeout(() => {
            handleSearchSubmit(currentTranscript);
          }, 800);
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMessage("Mikrofon ruxsati berilmadi. Iltimos brauzer sozlamalarida mikrofonga ruxsat bering.");
        } else if (event.error === 'no-speech') {
          setErrorMessage("Ovoz eshitilmadi. Iltimos qaytadan gapirib ko'ring.");
        } else {
          setErrorMessage(`Xatolik yuz berdi (${event.error}). Qaytadan urinib ko'ring.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error(err);
      setIsListening(false);
      setErrorMessage("Mikrofonni ishga tushirishda xatolik.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleSearchSubmit = (queryToUse) => {
    const query = (queryToUse || transcript).trim();
    if (query) {
      stopListening();
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query)}`);
    }
  };

  const quickSuggestions = [
    "iPhone 15 Pro Max",
    "MacBook Pro M3",
    "Sony WH-1000XM5",
    "Samsung Galaxy S24",
    "AirPods Pro"
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative text-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            stopListening();
            onClose();
          }}
          className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 absolute top-5 right-5 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Web Speech AI
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            Ovozli Qidiruv
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isListening ? "Mikrofonga gapiring, biz eshityapmiz..." : "Gapirish uchun mikrofonni bosing"}
          </p>
        </div>

        {/* Pulsating Microphone Orb */}
        <div className="py-4 flex justify-center">
          <div className="relative">
            {/* Animated Pulses */}
            {isListening && (
              <>
                <span className="absolute -inset-4 rounded-full bg-indigo-500/20 animate-ping opacity-75" />
                <span className="absolute -inset-8 rounded-full bg-indigo-500/10 animate-pulse" />
              </>
            )}

            <button
              onClick={isListening ? stopListening : startListening}
              className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center text-white shadow-2xl transition transform active:scale-95 ${
                isListening
                  ? 'bg-gradient-to-tr from-rose-500 to-indigo-600 shadow-rose-500/30'
                  : 'bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-indigo-600/30 hover:scale-105'
              }`}
            >
              {isListening ? (
                <Mic className="w-10 h-10 animate-bounce" />
              ) : (
                <MicOff className="w-10 h-10 opacity-80" />
              )}
            </button>
          </div>
        </div>

        {/* Transcribed text or listening indicator */}
        <div className="min-h-[60px] p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-center">
          {transcript ? (
            <p className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-300">
              "{transcript}"
            </p>
          ) : isListening ? (
            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>Ovoz kutilmoqda... ("iPhone 15", "Noutbuk")</span>
            </div>
          ) : errorMessage ? (
            <div className="flex items-center gap-2 text-rose-500 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-400">
              Mikrofon tugmasini bosing va tovar nomini ayting
            </p>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400">Tezkor namunalar:</p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {quickSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  handleSearchSubmit(item);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-600 dark:text-slate-300 transition"
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Manual search submit if transcribed */}
        {transcript && (
          <button
            onClick={() => handleSearchSubmit()}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <Search className="w-4 h-4" /> Topish: "{transcript}"
          </button>
        )}
      </div>
    </div>
  );
}
