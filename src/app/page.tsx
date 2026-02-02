'use client';

import React, { useState } from 'react';
import Head from 'next/head';
import { Search, Filter, ShoppingCart, Star, Clock, Zap, Loader2 } from 'lucide-react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Head>
        <title>SmartPrix | Comparateur de prix intelligent en Afrique</title>
      </Head>

      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
            <span className="text-2xl font-bold tracking-tight text-indigo-900">SmartPrix</span>
          </div>
          
          <nav className="hidden md:flex space-x-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">Accueil</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Simulation Projet</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Aide</a>
          </nav>

          <div className="flex items-center gap-4">
            <button className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition-all">
              💎 Premium
            </button>
            <button className="relative p-2 text-slate-600 hover:text-indigo-600">
              <ShoppingCart size={24} />
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white font-bold">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Comparez tous les prix du marché en <span className="text-indigo-600">un seul clic</span>
            </h1>
            <p className="text-lg text-slate-600 mb-10">
              Économisez du temps et de l'argent. Ne vous déplacez plus, simulez vos dépenses pour vos projets d'achat en Afrique en fonction de la qualité et des délais.
            </p>
            
            {/* Main Search Bar */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search size={24} />
              </div>
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Que recherchez-vous ? (ex: Ciment, Riz, Téléphone...)" 
                className="block w-full pl-12 pr-4 py-5 bg-white border-2 border-slate-200 rounded-2xl text-lg focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-xl shadow-slate-200/50"
              />
              <button 
                onClick={handleSearch}
                disabled={loading}
                className="absolute right-3 top-2.5 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Comparer'}
              </button>
            </div>
          </div>
        </div>
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-100/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Main App Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:w-64 space-y-8 shrink-0">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Filter size={16} /> Filtres Avancés
              </h3>
              
              <div className="space-y-6">
                {/* Delivery Filter */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Délai de livraison</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> Moins de 24h
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-indigo-600">
                      <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500" /> 1-3 jours
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Intervalle de prix (XOF)</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" className="w-full text-xs p-2 border rounded bg-slate-50" />
                    <input type="number" placeholder="Max" className="w-full text-xs p-2 border rounded bg-slate-50" />
                  </div>
                </div>

                {/* Quality / Rating */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <label className="text-sm font-bold text-slate-700 mb-3 block">Qualité minimale</label>
                  <div className="flex gap-1 text-amber-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} />
                    <Star size={16} />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-800">
                {results.length > 0 ? `${results.length} articles trouvés` : 'Résultats de la comparaison'}
              </h2>
              <select className="text-sm bg-transparent border-none font-medium text-slate-600 focus:ring-0">
                <option>Trier par : Moins cher</option>
                <option>Trier par : Plus rapide</option>
                <option>Trier par : Meilleure note</option>
              </select>
            </div>

            {results.length === 0 && !loading ? (
              <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-20 text-center">
                <p className="text-slate-400">Tapez un produit pour lancer la comparaison...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((item, i) => (
                  <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-indigo-200 transition-all group">
                    <div className="aspect-square bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-indigo-600 shadow-sm flex items-center gap-1">
                        <Zap size={10} fill="currentColor" /> {item.source}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">{item.name}</h3>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div className="text-lg font-black text-slate-900">{item.price.toLocaleString()} XOF</div>
                      <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock size={12} /> Direct
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© 2026 SmartPrix - L'achat intelligent en Afrique</p>
        </div>
      </footer>
    </div>
  );
}
