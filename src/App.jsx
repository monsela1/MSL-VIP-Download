import React, { useState } from 'react';
import { 
  Download, Layers, Settings, Activity, 
  Search, CheckSquare, Square, FolderDown, Sparkles,
  Loader2, AlertCircle, Film
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // ទិន្នន័យមេ ទុកទទេ (ដក Demo ចេញ)
  const [mediaData, setMediaData] = useState(null);
  const [selectedEps, setSelectedEps] = useState(new Set());

  // មុខងារហៅទៅកាន់ API ដើម្បីទាញយក Metadata
  const handleInspectUrl = async (e) => {
    e?.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMessage('');
    setMediaData(null);
    setSelectedEps(new Set());

    try {
      // ផ្លាស់ប្តូរ endpoint នេះទៅកាន់ Backend API ពិតប្រាកដរបស់អ្នក
      const response = await fetch('/api/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() })
      });

      if (!response.ok) {
        throw new Error(`បរាជ័យក្នុងការទាញយកទិន្នន័យ (Status: ${response.status})`);
      }

      const data = await response.json();
      // data រំពឹងទុក: { title, poster, description, tags: [], episodes: [{ id, number, resolution }] }
      setMediaData(data);
    } catch (err) {
      setErrorMessage(err.message || 'មានបញ្ហាក្នុងការតភ្ជាប់ទៅកាន់ Server');
    } finally {
      setIsLoading(false);
    }
  };

  // មុខងារផ្ញើ Task ទៅកាន់ Queue
  const handleStartDownload = async () => {
    if (selectedEps.size === 0 || !mediaData) return;

    try {
      const payload = {
        mediaId: mediaData.id,
        episodes: Array.from(selectedEps)
      };

      const response = await fetch('/api/tasks/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert(`បានបញ្ជូន ${selectedEps.size} ភាគ ទៅកាន់ Download Queue ដោយជោគជ័យ!`);
        setSelectedEps(new Set());
      } else {
        alert('មិនអាចបង្កើត Task បានទេ សូមព្យាយាមម្តងទៀត');
      }
    } catch (err) {
      alert('កំហុសប្រព័ន្ធ: ' + err.message);
    }
  };

  const toggleSelect = (id) => {
    const next = new Set(selectedEps);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedEps(next);
  };

  const selectAll = () => {
    if (!mediaData?.episodes) return;
    const all = new Set(mediaData.episodes.map(ep => ep.id));
    setSelectedEps(all);
  };

  const deselectAll = () => {
    setSelectedEps(new Set());
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#090d16] text-slate-100 antialiased overflow-hidden font-sans">
      
      {/* Sidebar (Desktop) */}
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
            {[
              { id: 'tasks', label: 'ផ្ទាំងមេ', icon: Layers },
              { id: 'queue', label: 'ជួរទាញយក', icon: Download },
              { id: 'activity', label: 'ប្រវត្តិ', icon: Activity },
              { id: 'settings', label: 'កំណត់', icon: Settings },
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
          <span>Connected Client</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"></span>
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        
        {/* Header Link Search */}
        <header className="px-4 py-3 md:px-8 md:py-5 border-b border-slate-800/80 bg-[#0f172a]/50 backdrop-blur flex items-center gap-3 flex-shrink-0">
          <form onSubmit={handleInspectUrl} className="flex-1 relative flex items-center">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="បញ្ចូលតំណភ្ជាប់ URL រួចចុច Enter..."
              disabled={isLoading}
              className="w-full bg-[#131b2e] border border-slate-700/60 rounded-xl pl-3 pr-24 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner disabled:opacity-50"
            />
            <button 
              type="submit"
              disabled={isLoading || !url.trim()}
              className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white px-3 md:px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>កំពុងឆែក...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>ពិនិត្យ</span>
                </>
              )}
            </button>
          </form>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-4 md:p-6">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2.5 text-xs md:text-sm text-rose-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Empty State (ពេលមិនទាន់ Search អ្វីសោះ) */}
          {!isLoading && !mediaData && (
            <div className="h-full border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
                <Film className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-300 mb-1">មិនទាន់មានទិន្នន័យ</h3>
              <p className="text-xs max-w-xs text-slate-500 leading-relaxed">
                សូមបញ្ចូលតំណភ្ជាប់ URL ខាងលើដើម្បីចាប់ផ្តើមត្រួតពិនិត្យ និងបង្ហាញបញ្ជីភាគ
              </p>
            </div>
          )}

          {/* Active Data State */}
          {mediaData && (
            <div className="h-full flex flex-col md:flex-row gap-4 md:gap-6 overflow-hidden">
              
              {/* Media Metadata Card */}
              <section className="w-full md:w-80 flex-shrink-0 bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl p-4 flex flex-col">
                <div className="flex md:flex-col gap-3.5 items-start">
                  {mediaData.poster && (
                    <div className="w-24 sm:w-28 md:w-full aspect-[3/4] rounded-lg md:rounded-xl overflow-hidden border border-slate-700/50 shadow-md flex-shrink-0 bg-slate-950">
                      <img 
                        src={mediaData.poster} 
                        alt={mediaData.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h2 className="text-sm md:text-base font-bold text-white mb-1.5 truncate md:whitespace-normal">
                      {mediaData.title || "គ្មានចំណងជើង"}
                    </h2>

                    {mediaData.tags && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {mediaData.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="hidden md:block text-xs text-slate-400 leading-relaxed mb-4 line-clamp-4">
                      {mediaData.description || "គ្មានការពិពណ៌នា..."}
                    </p>
                  </div>
                </div>

                <button 
                  disabled={selectedEps.size === 0}
                  onClick={handleStartDownload}
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

              {/* Episodes List Grid */}
              <section className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl md:rounded-2xl flex flex-col overflow-hidden">
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
                    បានរើស: <span className="text-indigo-400 font-bold">{selectedEps.size}</span>/{mediaData.episodes?.length || 0}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 md:p-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {mediaData.episodes?.map((ep) => {
                    const isSelected = selectedEps.has(ep.id);
                    return (
                      <button
                        key={ep.id}
                        onClick={() => toggleSelect(ep.id)}
                        className={`py-2 px-1 md:py-2.5 rounded-lg text-center flex flex-col items-center justify-center transition-all border ${
                          isSelected
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-200 ring-1 ring-indigo-500/50'
                            : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] md:text-xs font-bold">EP {ep.number}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-indigo-300' : 'text-slate-500'}`}>
                          {ep.resolution || 'Auto'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

            </div>
          )}

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0f172a]/95 backdrop-blur border-t border-slate-800 flex items-center justify-around px-2 z-50">
        {[
          { id: 'tasks', label: 'ផ្ទាំងមេ', icon: Layers },
          { id: 'queue', label: 'ជួរទាញយក', icon: Download },
          { id: 'activity', label: 'ប្រវត្តិ', icon: Activity },
          { id: 'settings', label: 'កំណត់', icon: Settings },
        ].map((item) => {
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
