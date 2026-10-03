import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('moderno_a11y');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      fontSize: 'normal', // 'normal' | 'large' | 'xlarge'
      contrast: 'normal', // 'normal' | 'high-contrast' | 'monochrome' | 'night-blue'
      underlineLinks: false,
      dyslexiaFont: false,
      speechEnabled: false,
      speechRate: 1.0 // 0.8 | 1.0 | 1.2
    };
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);

  // Apply visual classes to root element
  useEffect(() => {
    try {
      localStorage.setItem('moderno_a11y', JSON.stringify(settings));
    } catch (e) {}

    const root = document.documentElement;

    // Font size
    root.classList.remove('a11y-font-large', 'a11y-font-xlarge');
    if (settings.fontSize === 'large') root.classList.add('a11y-font-large');
    if (settings.fontSize === 'xlarge') root.classList.add('a11y-font-xlarge');

    // Contrast
    root.classList.remove('a11y-high-contrast', 'a11y-monochrome', 'a11y-night-blue');
    if (settings.contrast === 'high-contrast') root.classList.add('a11y-high-contrast');
    if (settings.contrast === 'monochrome') root.classList.add('a11y-monochrome');
    if (settings.contrast === 'night-blue') root.classList.add('a11y-night-blue');

    // Underline links
    if (settings.underlineLinks) {
      root.classList.add('a11y-underline-links');
    } else {
      root.classList.remove('a11y-underline-links');
    }

    // Dyslexia friendly font
    if (settings.dyslexiaFont) {
      root.classList.add('a11y-dyslexia');
    } else {
      root.classList.remove('a11y-dyslexia');
    }
  }, [settings]);

  // Text-To-Speech helper using Web Speech API
  const speakText = useCallback((text, langCode = 'uz') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert("Kechirasiz, brauzeringiz matnni ovozli o'qishni qo'llab-quvvatlamaydi.");
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently playing audio

    if (!text || text.trim() === '') return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate || 1.0;
    utterance.pitch = 1.0;

    // Set voice language
    if (langCode === 'ru') {
      utterance.lang = 'ru-RU';
    } else if (langCode === 'en') {
      utterance.lang = 'en-US';
    } else {
      utterance.lang = 'uz-UZ';
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [settings.speechRate]);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    stopSpeaking();
    setSettings({
      fontSize: 'normal',
      contrast: 'normal',
      underlineLinks: false,
      dyslexiaFont: false,
      speechEnabled: false,
      speechRate: 1.0
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        speakText,
        stopSpeaking,
        isSpeaking,
        isA11yOpen,
        openA11y: () => setIsA11yOpen(true),
        closeA11y: () => setIsA11yOpen(false),
        toggleA11y: () => setIsA11yOpen((prev) => !prev)
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
