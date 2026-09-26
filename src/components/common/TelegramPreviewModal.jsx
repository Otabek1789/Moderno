import React from 'react';
import { Send, CheckCircle, X, ExternalLink, Copy } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function TelegramPreviewModal() {
  const { telegramModal, closeTelegramModal } = useStore();

  if (!telegramModal.isOpen) return null;

  const copyToClipboard = () => {
    // Strip HTML tags for clean text copying
    const plainText = telegramModal.text.replace(/<[^>]+>/g, '');
    navigator.clipboard.writeText(plainText);
    alert("Xabar matni nusxalandi!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-500 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
                {telegramModal.title}
                {telegramModal.isReal ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center gap-1 font-medium">
                    <CheckCircle className="w-3 h-3" /> Real Telegram API
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-medium">
                    Simulyatsiya Rejimi
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Telegram Bot orqali jo'natilgan xabarnoma ko'rinishi
              </p>
            </div>
          </div>
          <button
            onClick={closeTelegramModal}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Telegram Chat Bubble Preview */}
        <div className="p-6">
          <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 font-mono text-xs sm:text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
            <div dangerouslySetInnerHTML={{ __html: telegramModal.text }} />
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            💡 Bot Token va Chat ID ni <b className="text-indigo-500 font-semibold">Admin Panel &gt; Telegram Sozlamalari</b> bo'limida o'zingizning botingizga ulashingiz mumkin.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <Copy className="w-3.5 h-3.5" /> Nusxa olish
          </button>
          <button
            onClick={closeTelegramModal}
            className="px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition shadow-lg shadow-indigo-600/30"
          >
            Tushunarli, yopish
          </button>
        </div>
      </div>
    </div>
  );
}
