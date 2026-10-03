import React, { useRef, useState } from 'react';
import {
  Printer,
  Download,
  Copy,
  Check,
  X,
  QrCode,
  ShieldCheck,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import sound from '../../utils/soundFX';
import { formatPrice, formatDate } from '../../utils/formatters';

export default function FiscalReceiptModal({ isOpen, onClose, order }) {
  const [isCopied, setIsCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    sound.playPop();
    window.print();
  };

  const handleCopy = () => {
    sound.playPop();
    const receiptText = `
MODERNO STORE — ELEKTRON FISKAL CHEK
Chek №: #${order.id}
Sana: ${formatDate(order.createdAt)}
Mijoz: ${order.customerName || 'Mijoz'}
Telefon: ${order.phone}
To'lov usuli: ${(order.paymentMethod || 'Karta').toUpperCase()}

TOVARLAR:
${order.items.map((it) => `- ${it.name} x ${it.quantity} = ${formatPrice(it.price * it.quantity)}`).join('\n')}

Oraliq summa: ${formatPrice(order.subtotal || order.totalAmount)}
Chegirma: ${formatPrice(order.discountAmount || 0)}
QQS (12%): ${formatPrice(Math.round((order.totalAmount || 0) * 0.12))}
JAMI TO'LOV: ${formatPrice(order.totalAmount)}

STIR: 309874521 | Fiskal belgi: F-UZ-9874521
Rahmat! Xaridingiz bilan tabriklaymiz!
    `.trim();

    navigator.clipboard.writeText(receiptText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const vatAmount = Math.round((order.totalAmount || 0) * 0.12);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-slate-800 dark:text-slate-100 relative overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              🧾
            </span>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">Elektron Fiskal Chek</h3>
              <p className="text-[11px] text-slate-400">Rasmiy soliq kvitansiyasi (Invoys)</p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* PRINTABLE RECEIPT CONTENT CONTAINER */}
        <div className="printable-receipt overflow-y-auto pr-1 space-y-4 font-mono text-xs bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-slate-900 dark:text-slate-100">
          
          {/* Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
            <h4 className="font-black text-sm tracking-wider uppercase">MODERNO STORE OOO</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              Toshkent sh., Amir Temur shoh ko'chasi 108
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              STIR / INN: 309874521 | Kassa: #01
            </p>
            <div className="pt-1">
              <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold text-[9px] uppercase tracking-widest">
                Fiskal Chek Tasdiqlangan
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-1 text-[11px] pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Chek raqami:</span>
              <span className="font-bold">#MOD-{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Sana va vaqt:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Mijoz:</span>
              <span className="font-bold">{order.customerName || 'Anonim'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Telefon:</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">To'lov turi:</span>
              <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">
                {order.paymentMethod || 'Karta'}
              </span>
            </div>
          </div>

          {/* Products List */}
          <div className="space-y-2 pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="font-bold text-[10px] uppercase text-slate-400 flex justify-between">
              <span>Mahsulot</span>
              <span>Summa</span>
            </div>

            {order.items.map((item, idx) => (
              <div key={idx} className="space-y-0.5">
                <div className="font-bold text-slate-800 dark:text-slate-200">
                  {item.name}
                </div>
                <div className="flex justify-between text-slate-500 text-[10px]">
                  <span>{item.quantity} x {formatPrice(item.price)}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs pt-1 pb-2 border-b border-dashed border-slate-300 dark:border-slate-700">
            <div className="flex justify-between text-slate-500">
              <span>Oraliq summa:</span>
              <span>{formatPrice(order.subtotal || order.totalAmount)}</span>
            </div>

            {(order.discountAmount > 0 || order.promoCode) && (
              <div className="flex justify-between text-rose-500">
                <span>Chegirma ({order.promoCode || 'Bonus'}):</span>
                <span>-{formatPrice(order.discountAmount || 0)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-500">
              <span>Yetkazib berish:</span>
              <span>{order.shippingFee === 0 ? "BEPUL (0 UZS)" : formatPrice(order.shippingFee)}</span>
            </div>

            <div className="flex justify-between text-slate-500 text-[10px]">
              <span>Shu jumladan QQS (12%):</span>
              <span>{formatPrice(vatAmount)}</span>
            </div>

            <div className="flex justify-between text-sm font-black pt-1 border-t border-slate-200 dark:border-slate-800">
              <span>JAMI TO'LANDI:</span>
              <span className="text-indigo-600 dark:text-indigo-400">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* QR Code and Fiscal Sign */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* SVG Fiscal QR Code representation */}
            <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-full h-full text-slate-900" fill="currentColor">
                <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h2v2h-2v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2zM5 5h2v2H5V5zm12 0h2v2h-2V5zM5 17h2v2H5v-2z" />
              </svg>
            </div>

            <div className="text-[10px] space-y-0.5 text-slate-500">
              <p><b>Fiskal belgi:</b> F-UZ-9874521</p>
              <p><b>Terminal:</b> MOD-POS-04</p>
              <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Soliq qo'mitasida ro'yxatdan o'tgan
              </p>
            </div>
          </div>

          <div className="text-center text-[10px] text-slate-400 pt-1">
            Xaridingiz uchun rahmat! Bizni tanlaganingizdan mamnunmiz!
          </div>
        </div>

        {/* Action Buttons (Hidden in Print) */}
        <div className="grid grid-cols-2 gap-3 pt-2 no-print">
          <button
            onClick={handlePrint}
            className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition transform active:scale-95"
          >
            <Printer className="w-4 h-4" /> Chop etish / PDF
          </button>

          <button
            onClick={handleCopy}
            className="py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? "Nusxalandi!" : "Nusxa olish"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
