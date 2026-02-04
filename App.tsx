
import React, { useState, useEffect } from 'react';
import { NetworkConnection, SecurityAnalysis } from './types';
import { generateMockConnection } from './utils/networkEngine';
import { analyzeDeviceInfo } from './services/geminiService';
import { getDeviceInfo } from './utils/deviceGatherer';
import { 
  Wifi, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  Terminal, 
  Cpu, 
  Settings,
  Globe,
  ArrowUpRight,
  ArrowDownLeft,
  Radar,
  Zap,
  Server,
  Radio,
  Loader2,
  XCircle
} from 'lucide-react';

const SignalInterceptedBox = () => (
  <div className="relative overflow-hidden bg-red-500/10 border-2 border-red-500/50 rounded-3xl p-6 mb-8 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.2)]">
    <div className="absolute -top-4 -right-4 bg-red-500 text-black px-6 py-1 rotate-12 font-black text-[10px] uppercase tracking-tighter">
      INTERCEPT_ACTIVE
    </div>
    
    <div className="flex items-start gap-4">
      <div className="bg-red-500 p-3 rounded-2xl text-black">
        <Radio size={24} className="animate-bounce" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle size={14} className="text-red-500" />
          <h3 className="text-red-500 font-black text-sm uppercase tracking-widest">Traffic Redirection Detected</h3>
        </div>
        <p className="text-xs text-red-200/70 leading-relaxed font-medium">
          <span className="text-red-500 font-bold">WARNING:</span> System telemetry and outbound packets are currently being mirrored to remote node <span className="mono bg-red-500/20 px-1 rounded text-red-400">192.168.1.104:443</span> for external audit.
        </p>
      </div>
    </div>

    <div className="absolute inset-0 pointer-events-none opacity-20">
      <div className="w-full h-[2px] bg-red-500 animate-[scan_2s_linear_infinite]"></div>
    </div>
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes scan {
        0% { transform: translateY(-50px); }
        100% { transform: translateY(150px); }
      }
    `}} />
  </div>
);

const InterceptBox = ({ count }: { count: number }) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#0a0a0c] to-[#121218] border border-cyan-500/30 rounded-3xl p-6 lg:p-8 mb-8 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
    <div className="absolute top-0 right-0 p-4">
      <div className="flex items-center gap-2">
         <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
         <span className="text-[10px] mono text-cyan-500 font-bold uppercase tracking-widest">Sentinel Engine</span>
      </div>
    </div>
    
    <div className="flex flex-col md:flex-row items-center gap-8">
      <div className="relative w-32 h-32 flex-shrink-0">
        <div className="absolute inset-0 border-2 border-cyan-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-cyan-500/10 rounded-full scale-75"></div>
        <div className="absolute top-1/2 left-1/2 w-[2px] h-16 bg-gradient-to-t from-cyan-500 to-transparent origin-bottom -translate-x-1/2 -translate-y-full animate-[spin_4s_linear_infinite]"></div>
        <Radar className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-cyan-400" size={32} />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl font-black italic text-white mb-2 tracking-tighter uppercase">Kernel Packet Hub</h2>
        <p className="text-sm text-gray-400 mb-6 max-w-md">
          Deep packet inspection routing through <span className="text-cyan-400 mono">localhost:8080</span>. Secure intercept tunnel active.
        </p>
        
        <div className="flex flex-wrap justify-center md:justify-start gap-4">
          <div className="bg-black/50 border border-white/5 rounded-2xl px-5 py-3 text-center min-w-[120px]">
            <div className="text-2xl font-black text-cyan-400 mono">{(count * 1.2).toFixed(1)}k</div>
            <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Data Filtered</div>
          </div>
          <div className="bg-black/50 border border-white/5 rounded-2xl px-5 py-3 text-center">
             <div className="flex items-center gap-2 justify-center">
                <ShieldCheck size={18} className="text-emerald-400" />
                <div className="text-2xl font-black text-emerald-400 mono">SECURE</div>
             </div>
             <div className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">Tunnel Integrity</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// FIX: Added React.FC typing to resolve the 'key' property assignment error
const ConnectionRow: React.FC<{ conn: NetworkConnection }> = ({ conn }) => (
  <div className="flex items-center gap-4 p-4 hover:bg-white/5 border-b border-gray-800/50 transition-colors group">
    <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-all">
      {conn.protocol === 'TCP' ? <Globe size={18} /> : <Terminal size={18} />}
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-bold text-sm text-gray-200 truncate uppercase tracking-tight">{conn.app}</span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${conn.status === 'ESTABLISHED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}`}>
          {conn.status}
        </span>
      </div>
      <div className="text-[10px] mono text-gray-500 truncate">{conn.packageName}</div>
    </div>

    <div className="flex flex-col items-end gap-1">
      <div className="flex items-center gap-1 text-[10px] text-emerald-400 mono font-bold">
        <ArrowDownLeft size={10} />
        {conn.bytesReceived > 1024 ? `${(conn.bytesReceived / 1024).toFixed(1)} KB` : `${conn.bytesReceived} B`}
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-600 mono">
        <ArrowUpRight size={10} />
        {conn.bytesSent > 1024 ? `${(conn.bytesSent / 1024).toFixed(1)} KB` : `${conn.bytesSent} B`}
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [connections, setConnections] = useState<NetworkConnection[]>([]);
  const [packetCount, setPacketCount] = useState(1240);
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SecurityAnalysis | null>(null);

  useEffect(() => {
    const initial = Array.from({ length: 15 }, () => generateMockConnection());
    setConnections(initial);

    const interval = setInterval(() => {
      if (!isMonitoring) return;
      setPacketCount(prev => prev + Math.floor(Math.random() * 5));
      setConnections(prev => {
        const next = [...prev];
        if (Math.random() > 0.6) {
          next.unshift(generateMockConnection());
          if (next.length > 30) next.pop();
        }
        const updateIdx = Math.floor(Math.random() * next.length);
        next[updateIdx] = {
          ...next[updateIdx],
          bytesReceived: next[updateIdx].bytesReceived + Math.floor(Math.random() * 800),
          bytesSent: next[updateIdx].bytesSent + Math.floor(Math.random() * 200)
        };
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const handleRunAudit = async () => {
    setIsAnalyzing(true);
    try {
      const info = await getDeviceInfo();
      const result = await analyzeDeviceInfo(info);
      setAnalysis(result);
    } catch (err) {
      console.error("Audit failed:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#050507]">
      <header className="sticky top-0 z-50 bg-[#050507]/90 backdrop-blur-xl border-b border-gray-800 safe-pt px-6 pb-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Activity className="text-black" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-white uppercase italic">Droid<span className="text-emerald-500">Net</span></h1>
              <p className="text-[9px] mono text-emerald-500/70 font-bold uppercase tracking-[0.2em]">Android Kernel Bridge</p>
            </div>
          </div>
          
          <button 
            onClick={() => setIsMonitoring(!isMonitoring)}
            className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all active:scale-95 ${isMonitoring ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}
          >
             <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
             <span className="text-[9px] mono font-black uppercase tracking-widest">{isMonitoring ? 'System_Live' : 'System_Halted'}</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <SignalInterceptedBox />
        <InterceptBox count={packetCount} />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Links', val: connections.length, icon: Wifi, color: 'emerald' },
            { label: 'Latency', val: '24ms', icon: Activity, color: 'cyan' },
            { label: 'Encryption', val: 'AES-256', icon: Lock, color: 'purple' },
            { label: 'Node Status', val: 'Primary', icon: Server, color: 'blue' }
          ].map((stat, i) => (
            <div key={i} className="bg-[#121218] border border-gray-800/50 rounded-2xl p-4 group hover:border-emerald-500/30 transition-all">
              <div className={`text-${stat.color}-400 mb-2 group-hover:scale-110 transition-transform`}>
                <stat.icon size={16} />
              </div>
              <div className="text-lg font-black text-white leading-tight">{stat.val}</div>
              <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Gemini Security Analysis Result Section */}
        {analysis && (
          <div className="bg-[#121218] border border-emerald-500/30 rounded-3xl p-6 mb-8 relative overflow-hidden group">
            <button 
              onClick={() => setAnalysis(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors"
            >
              <XCircle size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500/20 p-2 rounded-xl">
                <ShieldCheck className="text-emerald-500" size={20} />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white italic">AI Security Audit Results</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 flex flex-col items-center justify-center p-6 bg-black/40 rounded-2xl border border-white/5">
                <div className={`text-4xl font-black mb-1 ${analysis.riskScore > 70 ? 'text-red-500' : analysis.riskScore > 30 ? 'text-yellow-500' : 'text-emerald-500'}`}>
                  {analysis.riskScore}
                </div>
                <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Risk Index</div>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-300 mb-4 leading-relaxed italic border-l-2 border-emerald-500/50 pl-4">"{analysis.summary}"</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-2">Fingerprinting Points</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.vulnerabilities.map((v, idx) => (
                        <span key={idx} className="text-[9px] mono bg-white/5 px-2 py-1 rounded text-gray-400 border border-white/5 hover:border-emerald-500/20 hover:text-emerald-300 transition-colors">
                          {v}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] text-cyan-500 font-black uppercase tracking-widest mb-2">Recommendations</h4>
                    <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                      {analysis.recommendations.map((r, idx) => (
                        <li key={idx} className="leading-tight">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#0a0a0c] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
          <div className="bg-gray-900/50 px-6 py-5 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-300 flex items-center gap-3">
              <Terminal size={14} className="text-emerald-500" /> Active Sockets
            </h3>
            <div className="flex gap-2">
               <div className="px-2 py-1 bg-emerald-500/5 border border-emerald-500/20 rounded text-[8px] mono text-emerald-500 font-bold uppercase">Simulation Live</div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-800/20">
            {connections.length > 0 ? (
              // FIX: key prop works correctly now that ConnectionRow is typed as React.FC
              connections.map(conn => <ConnectionRow key={conn.id} conn={conn} />)
            ) : (
              <div className="py-24 text-center">
                <Radar className="mx-auto text-gray-800 animate-pulse mb-4" size={48} />
                <p className="text-xs text-gray-600 uppercase tracking-widest font-black">Syncing with hardware...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none z-[60]">
        <div className="max-w-4xl mx-auto flex justify-end items-end pointer-events-auto">
          <div className="flex gap-3">
             <button 
                onClick={handleRunAudit}
                disabled={isAnalyzing}
                className="p-5 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-3xl text-emerald-500 shadow-2xl hover:border-emerald-500/50 transition-all active:scale-95 disabled:opacity-50"
             >
               {isAnalyzing ? <Loader2 size={24} className="animate-spin" /> : <ShieldCheck size={24} />}
             </button>
             <button className="p-5 bg-cyan-500 hover:bg-cyan-400 text-black rounded-3xl shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all active:scale-90">
                <Settings size={24} />
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
