"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldCheck, CreditCard, CheckCircle, Smartphone } from 'lucide-react';

export default function CheckoutPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const priceMonthly = 9;
  const priceYearly = 79; // Oszczędność
  const currentPrice = billingCycle === 'yearly' ? priceYearly : priceMonthly;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 selection:bg-indigo-500 selection:text-white pb-20">
      
      {/* HEADER */}
      <header className="px-6 py-8 max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors font-semibold">
          <ArrowLeft size={20} /> Wróć
        </Link>
        <div className="flex items-center gap-2 text-indigo-600 font-bold">
          <Lock size={18} /> Bezpieczna płatność
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 grid md:grid-cols-12 gap-12 items-start">
        
        {/* LEWA STRONA: Podsumowanie zamówienia */}
        <div className="md:col-span-5 flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Memoria PRO</h1>
            <p className="text-gray-500">Zacznij 14-dniowy darmowy okres próbny. Anuluj w dowolnym momencie.</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            {/* Przełącznik cyklu rozliczeniowego */}
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Miesięcznie
              </button>
              <button 
                onClick={() => setBillingCycle('yearly')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${billingCycle === 'yearly' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Rocznie <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Zniżka -25%</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subskrypcja {billingCycle === 'yearly' ? 'Roczna' : 'Miesięczna'}</span>
                <span className="font-semibold">${currentPrice}.00</span>
              </div>
              <div className="flex justify-between items-center text-emerald-600 font-medium">
                <span>14 dni okresu próbnego</span>
                <span>-$0.00</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-end mb-6">
              <div>
                <p className="text-sm text-gray-500 font-medium">Do zapłaty dzisiaj</p>
                <p className="text-xs text-gray-400 mt-1">
                  Rozliczenie nastąpi za 14 dni.
                </p>
              </div>
              <div className="text-4xl font-black">$0.00</div>
            </div>

            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-indigo-500 shrink-0" /> Nielimitowane fiszki i talie</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-indigo-500 shrink-0" /> Interaktywne Osie Czasu</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-indigo-500 shrink-0" /> Generowanie fiszek przez AI</li>
            </ul>
          </div>
        </div>

        {/* PRAWA STRONA: Formularz płatności */}
        <div className="md:col-span-7">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-200 shadow-xl shadow-indigo-500/5">
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CreditCard className="text-gray-400" /> Metoda płatności
            </h2>

            {/* Alternatywne metody płatności (Wizualne) */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 hover:border-gray-900 hover:bg-gray-50 transition-all font-semibold">
                <Smartphone size={20} /> Apple Pay
              </button>
              <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all font-semibold text-blue-900">
                PayPal
              </button>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Albo karta płatnicza</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adres Email</label>
                <input 
                  type="email" 
                  placeholder="twoj@email.com" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Numer karty</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="0000 0000 0000 0000" 
                    className="w-full px-4 py-3 pl-12 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium font-mono"
                  />
                  <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ważność</label>
                  <input 
                    type="text" 
                    placeholder="MM / YY" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">CVC</label>
                  <input 
                    type="text" 
                    placeholder="123" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imię i nazwisko posiadacza</label>
                <input 
                  type="text" 
                  placeholder="Jan Kowalski" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all font-medium"
                />
              </div>

              <button className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
                Rozpocznij darmowy okres próbny
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-4">
                <ShieldCheck size={16} className="text-emerald-500" />
                Szyfrowanie 256-bit SSL. Płatność obsługiwana przez Stripe.
              </div>
            </form>
            
          </div>
        </div>
      </main>
    </div>
  );
}