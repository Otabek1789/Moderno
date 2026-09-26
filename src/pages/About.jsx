import React from 'react';
import {
  ShieldCheck,
  Truck,
  HeartHandshake,
  Award,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();

  const stats = [
    { value: t('about.stat1Title'), label: t('about.stat1Desc') },
    { value: t('about.stat2Title'), label: t('about.stat2Desc') },
    { value: t('about.stat3Title'), label: t('about.stat3Desc') },
    { value: t('about.stat4Title'), label: t('about.stat4Desc') }
  ];

  const team = [
    {
      name: "Akmal Shodiyev",
      role: "Bosh Direktor (CEO)",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Nodira Yusupova",
      role: "Bosh Texnolog (CTO)",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
    },
    {
      name: "Javohir To'rayev",
      role: "Mijozlar bilan aloqa bo'limi boshlig'i",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16 sm:space-y-24">
      
      {/* 1. Header & Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          <Sparkles className="w-3.5 h-3.5" /> MODERNO E-Commerce
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {t('about.title')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('about.subtitle')}
        </p>
      </div>

      {/* 2. Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center"
          >
            <p className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 mb-2">
              {s.value}
            </p>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* 3. Story Section with Image */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('about.ourStory')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('about.storyP1')}
          </p>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('about.storyP2')}
          </p>

          <div className="pt-2 space-y-3 text-sm text-slate-700 dark:text-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Faqat sertifikatlangan, 100% original tovarlar</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>O'zbekistonning barcha viloyatlariga kuryerlik yetkazish</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span>Rasmiy servis markazlarida 12 oylik bepul kafolat</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 relative aspect-video sm:aspect-[4/3]">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80"
              alt="Our Team"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 4. Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('about.guaranteesTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-5">
              <Award className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">
              Sifat Nazorati
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Barcha gadjetlar qat'iy tekshiruvdan o'tadi va barcha rasmiy soliq/bojxona talablariga javob beradi.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">
              Tezkor Yetkazish
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Toshkent bo'ylab ekspress rejimda bir necha soat ichida, viloyat markazlariga 1 kunda yetkazib beramiz.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-5">
              <HeartHandshake className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">
              Mijozga Hurmat
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Har qanday savol yoki muammoni zudlik bilan ijobiy hal qilishga intiluvchi professional xodimlar.
            </p>
          </div>
        </div>
      </div>

      {/* 5. Team Section */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('about.teamTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm text-center group"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 border-4 border-indigo-500/20 group-hover:scale-105 transition">
                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {member.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
