import React, { useState } from 'react';
import { Star, CheckCircle2, MessageSquare, Send, Sparkles, User, ThumbsUp } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '../../context/StoreContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDate } from '../../utils/formatters';

export default function ProductReviews({ productId, productName }) {
  const { getProductReviews, addReview } = useStore();
  const { t } = useLanguage();

  const reviews = getProductReviews(productId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Compute breakdown
  const total = reviews.length;
  const avgRating = total > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1)
    : '5.0';

  const starCounts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    count: reviews.filter((r) => r.rating === s).length,
    percent: total > 0 ? Math.round((reviews.filter((r) => r.rating === s).length / total) * 100) : 0
  }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    addReview({
      productId,
      userName: userName.trim() || 'Xaridor',
      rating,
      title,
      comment: comment.trim()
    });

    confetti({
      particleCount: 70,
      spread: 50,
      origin: { y: 0.7 }
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsFormOpen(false);
      setComment('');
      setTitle('');
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Summary & Write Review Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
        {/* Rating Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
          <div className="text-5xl font-black text-slate-900 dark:text-slate-100">
            {avgRating}
          </div>
          <div className="flex items-center gap-1 my-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-4 h-4 ${
                  s <= Math.round(Number(avgRating))
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-300 dark:text-slate-700'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {total} {t('product.reviewsCount')}
          </p>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="space-y-2 py-2 flex flex-col justify-center">
          {starCounts.map(({ star, count, percent }) => (
            <div key={star} className="flex items-center gap-2 text-xs">
              <span className="w-4 font-bold text-slate-600 dark:text-slate-400">{star}</span>
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-8 text-right font-medium text-slate-400 text-[11px]">{count}</span>
            </div>
          ))}
        </div>

        {/* Action button */}
        <div className="flex flex-col items-center justify-center p-4 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 text-center space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300">
            Ushbu tovardan foydalandingizmi? Fikringiz boshqa xaridorlar uchun juda muhim!
          </p>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('reviews.writeReview')}</span>
          </button>
        </div>
      </div>

      {/* Review Submission Form */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-xl space-y-4 animate-scaleUp"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sharh qoldirish</span>
            </h4>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Yopish
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center text-emerald-600 font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-6 h-6" />
              <span>{t('reviews.successReview')}</span>
            </div>
          ) : (
            <>
              {/* Star selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t('reviews.yourRating')}
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(s)}
                      className="p-1 hover:scale-125 transition-transform"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          s <= (hoverRating || rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                    {hoverRating || rating} / 5 yulduz
                  </span>
                </div>
              </div>

              {/* Author & title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {t('reviews.yourName')}
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Masalan: Sardor R."
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Sarlavha (ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Masalan: Ajoyib smartfon!"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Review text */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {t('reviews.reviewText')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Mahsulotning afzalliklari, kamchiliklari va taassurotlaringiz..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 dark:text-slate-100 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('reviews.submitReview')}</span>
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            {t('reviews.noReviews')}
          </div>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-2.5 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {r.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                        {r.userName}
                      </span>
                      {r.verified && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{t('reviews.verifiedBuyer')}</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">{formatDate(r.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= r.rating
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200 dark:text-slate-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {r.title && (
                <h5 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                  {r.title}
                </h5>
              )}

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
