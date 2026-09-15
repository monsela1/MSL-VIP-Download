import React, { useState } from 'react';
import { 
  Download, Layers, Settings, Activity, 
  Search, CheckSquare, Square, FolderDown, Moon, Sparkles 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [url, setUrl] = useState('');
  const totalEpisodes = 80;
  const [selectedEps, setSelectedEps] = useState(new Set([1, 2, 3]));

  const dramaData = {
    title: "សង្គ្រាមអាណាចក្រនាគរាជ (Dragon Realm Chronicles)",
    episodesCount: 80,
    tags: ["បុរាណ", "Action", "Fantasy", "HD 1080p"],
    description: "ដំណើររឿងនៃការតស៊ូដណ្តើមអំណាច និងការស្វែងរកសច្ចធម៌ក្នុងពិភពក្បាច់គុនអាថ៌កំបាំង...",
    poster: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80"
  };

  const toggleSelect = (ep) => {
    const next = new Set(selectedEps);
    if (next.has(ep)) next.delete(ep);
    else next.add(ep);
    setSelectedEps(next);
  };

  const selectAll = () => {
    const all = new Set(Array.from({ length: totalEpisodes }, (_, i) => i + 1));
    setSelectedEps(all);
  };

  const deselectAll = () => {
    setSelectedEps(new Set());
  };

  return (
    <div className="flex h-screen bg-[#090d16] text-slate-100 antialiased overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a]/70 backdrop-blur border-r border-slate-800/80 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 mb-6">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                CineFetch Studio
              </h1>
              <span className="text-[10px] text-cyan-400 font-medium tracking-wider uppercase">Workspace</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'tasks', label: 'ផ្ទាំងមេ (Fetch)', icon: Layers },
              { id: 'queue', label: 'ជួរទាញយក (Queue)', icon: Download },
              { id: 'activity', label: 'ប្រវត្តិ (Activity)', icon: Activity },
              { id: 'settings', label: 'ការកំណត់ (Settings)', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' 
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Engine v2.4.0</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="px-8 py-5 border-b border-slate-800/80 bg-[#0f172a]/30 backdrop-blur flex items-center justify-between gap-4">
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="បញ្ចូលតំណភ្ជាប់ URL (Link ភាគរឿង)..."
              className="w-full bg-[#131b2e] border border-slate-700/60 rounded-xl pl-4 pr-24 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition">
              <Search className="w-3.5 h-3.5" />
              <span>ពិនិត្យ</span>
            </button>
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition">
            <Moon className="w-5 h-5" />
          </button>
        </header>

        <div className="flex-1 flex overflow-hidden p-6 gap-6">
          {/* Left: Metadata */}
          <section className="w-80 flex flex-col bg-slate-900/40 border border-slate-800 rounded-2xl p-5 overflow-y-auto">
            <div className="w-full aspect-[3/4] rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl relative group mb-4">
              <img 
                src={dramaData.poster} 
                alt="Drama Poster" 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70"></div>
            </div>

            <h2 className="text-base font-bold text-white mb-2 leading-snug">
              {dramaData.title}
            </h2>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {dramaData.tags.map((tag) => (
                <span key={tag} className="text-[11px] bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {tag}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {dramaData.description}
            </p>

            <button 
              disabled={selectedEps.size === 0}
              className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition ${
                selectedEps.size > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FolderDown className="w-4 h-4" />
              <span>ចាប់ផ្តើមទាញយក ({selectedEps.size})</span>
            </button>
          </section>

          {/* Right: Episodes Grid */}
          <section className="flex-1 bg-slate-900/40 border border-slate-800 rounded-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
              <div className="flex items-center gap-2">
                <button 
                  onClick={selectAll} 
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-300 transition flex items-center gap-1.5 border border-slate-700"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  ជ្រើសរើសទាំងអស់
                </button>
                <button 
                  onClick={deselectAll} 
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-medium text-slate-300 transition flex items-center gap-1.5 border border-slate-700"
                >
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  សម្អាត
                </button>
              </div>
              <div className="text-xs font-medium text-slate-400">
                បានជ្រើសរើស: <span className="text-indigo-400 font-bold">{selectedEps.size}</span> / {totalEpisodes}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5">
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => {
                const isSelected = selectedEps.has(ep);
                return (
                  <button
                    key={ep}
                    onClick={() => toggleSelect(ep)}
                    className={`py-3 px-2 rounded-xl text-center flex flex-col items-center justify-center transition-all border ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500/80 text-indigo-300 ring-2 ring-indigo-500/20 shadow-md'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold tracking-tight">EP {ep.toString().padStart(2, '0')}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}>
                      1080p
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
