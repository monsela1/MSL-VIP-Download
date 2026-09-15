import React, { useState } from 'react';
import { 
  Download, Layers, Settings, Activity, 
  Search, CheckSquare, Square, FolderDown, Sparkles 
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

  const navItems = [
    { id: 'tasks', label: 'ផ្ទាំងមេ', icon: Layers },
    { id: 'queue', label: 'ជួរទាញយក', icon: Download },
    { id: 'activity', label: 'ប្រវត្តិ', icon: Activity },
    { id: 'settings', label: 'កំណត់', icon: Settings },
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#090d16] text-slate-100 antialiased overflow-hidden font-sans">
      
      {/* 1. Desktop Sidebar (លាក់លើ Mobile) */}
      <aside className="hidden md:flex w-64 bg-[#0f172a]/70 backdrop-blur border-r border-slate-800/80 flex-col justify-between p-4 flex-shrink-0">
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
            {navItems.map((item) => {
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

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        
        {/* Header / Input Link Bar */}
        <header className="px-4 py-3 md:px-8 md:py-5 border-b border-slate-800/80 bg-[#0f172a]/50 backdrop-blur flex items-center gap-3 flex-shrink-0">
          <div className="flex md:hidden items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 flex-shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="បញ្ចូលតំណភ្ជាប់ Link..."
              className="w-full bg-[#131b2e] border border-slate-700/60 rounded-xl pl-3 pr-20 md:pr-24 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
            />
            <button className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 md:px-4 rounded-lg text-xs font-semibold flex items-center gap-1 transition">
              <Search className="w-3 h-3" />
              <span>ពិនិត្យ</span>
            </button>
          </div>
        </header>

        {/* Scrollable Work Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden p-3 md:p-6 gap-4 md:gap-6">
          
          {/* Section: Metadata (Mobile: Horizontal Card | Desktop: Vertical Panel) */}
          <section className="w-full md:w-80 flex-shrink-0 bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-3.5 md:p-5 flex flex-col">
            
            {/* Mobile View: Poster នៅឆ្វេង អក្សរនៅស្តាំ */}
            <div className="flex md:flex-col gap-3.5 items-start">
              <div className="w-24 sm:w-28 md:w-full aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden border border-slate-700/50 shadow-md flex-shrink-0 relative">
                <img 
                  src={dramaData.poster} 
                  alt="Poster" 
                  className="w-full h-full object-cover" 
                />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-sm md:text-base font-bold text-white mb-1.5 truncate md:whitespace-normal">
                  {dramaData.title}
                </h2>

                <div className="flex flex-wrap gap-1 mb-2">
                  {dramaData.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      {tag}
                    </span>
                  ))}
                </div>

                <p className="hidden md:block text-xs text-slate-400 leading-relaxed mb-4">
                  {dramaData.description}
                </p>
              </div>
            </div>

            {/* Start Button */}
            <button 
              disabled={selectedEps.size === 0}
              className={`w-full mt-3 md:mt-auto py-2.5 md:py-3 rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-md transition ${
                selectedEps.size > 0 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <FolderDown className="w-4 h-4" />
              <span>ចាប់ផ្តើម ({selectedEps.size} ភាគ)</span>
            </button>
          </section>

          {/* Section: Episodes Grid */}
          <section className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl flex flex-col min-h-[350px] md:min-h-0 overflow-hidden">
            
            {/* Action Bar */}
            <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/70 flex-shrink-0">
              <div className="flex items-center gap-2">
                <button 
                  onClick={selectAll} 
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] md:text-xs text-slate-300 transition flex items-center gap-1 border border-slate-700"
                >
                  <CheckSquare className="w-3 h-3 text-cyan-400" />
                  <span>ទាំងអស់</span>
                </button>
                <button 
                  onClick={deselectAll} 
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] md:text-xs text-slate-300 transition flex items-center gap-1 border border-slate-700"
                >
                  <Square className="w-3 h-3 text-slate-400" />
                  <span>សម្អាត</span>
                </button>
              </div>
              <div className="text-[11px] md:text-xs font-medium text-slate-400">
                បានរើស: <span className="text-indigo-400 font-bold">{selectedEps.size}</span>/{totalEpisodes}
              </div>
            </div>

            {/* Responsive Grid: 4 ជួរលើ mobile, 6 ជួរលើ tablet, 8-10 ជួរលើ desktop */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map((ep) => {
                const isSelected = selectedEps.has(ep);
                return (
                  <button
                    key={ep}
                    onClick={() => toggleSelect(ep)}
                    className={`py-2 px-1 md:py-2.5 rounded-lg text-center flex flex-col items-center justify-center transition-all border ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-400 active:bg-slate-800'
                    }`}
                  >
                    <span className="text-[11px] md:text-xs font-bold">EP {ep.toString().padStart(2, '0')}</span>
                    <span className={`text-[9px] ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                      1080p
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

        </div>
      </main>

      {/* 3. Mobile Bottom Navigation Bar (បង្ហាញតែលើទូរស័ព្ទប៉ុណ្ណោះ) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0f172a]/95 backdrop-blur border-t border-slate-800 flex items-center justify-around px-2 z-50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

    </div>
  );
}
