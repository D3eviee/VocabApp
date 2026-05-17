"use client";
import React from 'react';
import Link from 'next/link';
import { Brain, Clock, Flame, ChevronRight, CheckCircle, Sparkles, Layers, Target } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Brain className="text-white" size={20} />
            </div>
            <span className="text-xl font-black tracking-tight text-gray-900">Memoria<span className="text-indigo-600">.</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#timeline" className="hover:text-gray-900 transition-colors">Timeline Mode</a>
            <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link href="/auth" className="px-5 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold tracking-wide uppercase mb-8">
            <Sparkles size={16} /> New: Interactive Timelines
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            Remember everything. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-purple-500">
              Effortlessly.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            The only learning app that combines the power of Spaced Repetition algorithms with visual timelines. Learn languages, history, and medicine 3x faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white text-lg font-bold rounded-2xl hover:bg-indigo-700 transition-all hover:shadow-[0_0_40px_8px_rgba(79,70,229,0.3)] hover:-translate-y-1 flex items-center justify-center gap-2">
              Start learning <ChevronRight size={20} />
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 text-lg font-bold rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-center">
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* TIMELINE SHOWCASE */}
      <section id="timeline" className="py-24 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-black text-gray-900 mb-6">Learn processes, not just facts.</h2>
              <p className="text-lg text-gray-500 mb-8 leading-relaxed">
                Flashcards are great for vocabulary, but how do you remember a sequence of historical events or metabolic pathways? We created <strong>Timeline Mode</strong> with <em>Progressive Disclosure</em>. Guess events based on dates and connect the dots in your head.
              </p>
              <ul className="space-y-4 mb-8">
                {['Automatic chronological sorting', 'Step-by-step knowledge reveal (Active Recall)', 'Cinematic transitions & depth effect'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <CheckCircle size={14} className="text-emerald-600" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Timeline UI Mockup */}
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl -z-10 rounded-full" />
              <div className="bg-[#F5F5F7] rounded-[2.5rem] p-6 border-8 border-gray-900 shadow-2xl relative overflow-hidden aspect-[4/3] flex items-center justify-center">
                <div className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-lg transform -rotate-2 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                  <div className="mb-4"><span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-black tracking-widest">1969</span></div>
                  <h3 className="text-2xl font-black mb-4">Apollo 11 Moon Landing</h3>
                  <div className="w-10 h-1 bg-indigo-500 rounded-full mb-4"></div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">Tap to reveal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Everything your brain needs</h2>
            <p className="text-xl text-gray-500">Replace five different apps with one that actually works.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="text-indigo-500" size={32} />}
              title="SM-2 Algorithm"
              desc="The system learns how you learn. It reminds you of the material exactly when you are about to forget it."
            />
            <FeatureCard 
              icon={<Flame className="text-orange-500" size={32} />}
              title="Gamification & Habits"
              desc="Build your streak, track daily goals, and watch your retention rate grow every single day."
            />
            <FeatureCard 
              icon={<Layers className="text-emerald-500" size={32} />}
              title="Flexible Builder"
              desc="Create standard flashcards, word variations, or entire interactive timelines. Perfect for any kind of knowledge."
            />
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="py-24 px-6 bg-gray-900 text-white rounded-[3rem] mx-4 md:mx-10 mb-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-6">Invest in your growth.</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">Simple, transparent pricing. No hidden fees.</p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            
            {/* FREE PLAN */}
            <div className="bg-gray-800 p-10 rounded-3xl border border-gray-700">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-gray-400 mb-6">Perfect for testing the waters.</p>
              <div className="text-5xl font-black mb-8">$0 <span className="text-lg text-gray-500 font-medium">/ month</span></div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-500" /> Up to 3 Flashcard Decks</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-500" /> 1 Timeline</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-gray-500" /> Basic SRS Algorithm</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                Create free account
              </button>
            </div>

            {/* PRO PLAN */}
            <div className="bg-gradient-to-b from-indigo-600 to-indigo-900 p-10 rounded-3xl border border-indigo-500 relative transform md:-translate-y-4 shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <span className="bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Memoria PRO</h3>
              <p className="text-indigo-200 mb-6">Unlock the full potential of your brain.</p>
              <div className="text-5xl font-black mb-8 text-white">$9 <span className="text-lg text-indigo-300 font-medium">/ month</span></div>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-indigo-300" /> Unlimited Decks & Flashcards</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-indigo-300" /> Unlimited Timelines</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-indigo-300" /> Advanced Stats & Streaks</li>
                <li className="flex items-center gap-3"><CheckCircle size={20} className="text-indigo-300" /> Priority Support</li>
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-white text-indigo-900 hover:bg-gray-50 transition-colors hover:shadow-lg">
                Start 14-day free trial
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 text-center text-gray-400 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Brain size={20} className="text-gray-300" />
          <span className="text-lg font-black tracking-tight text-gray-300">Memoria.</span>
        </div>
        <p>© 2026 Memoria App. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all hover:-translate-y-1 group">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}