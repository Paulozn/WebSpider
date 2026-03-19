"use client";

import { useState } from "react";
import SiteCard from "./SiteCard";
import ConfigPanel from "./ConfigPanel";

export default function DashboardTabs({ sites, initialApiKey }: { sites: any[], initialApiKey: string }) {
    const [activeTab, setActiveTab] = useState("overview");
    const [logs, setLogs] = useState<{ time: string, message: string, type: 'info' | 'error' }[]>([
        { time: new Date().toLocaleTimeString(), message: "Engine inicializada. Aguardando comandos.", type: "info" }
    ]);

    const addLog = (message: string, type: 'info' | 'error' = 'info') => {
        setLogs(prev => [{ time: new Date().toLocaleTimeString(), message, type }, ...prev]);
    }

    return (
        <div className="mt-8">
            <div className="flex gap-2 border-b border-white/10 mb-8 pb-px">
                <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 relative top-[1px] ${activeTab === "overview" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                >
                    Monitoramento
                </button>
                <button
                    onClick={() => setActiveTab("logs")}
                    className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 relative top-[1px] flex items-center gap-2 ${activeTab === "logs" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                >
                    Logs do Sistema
                    {logs.filter(l => l.type === 'error').length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab("settings")}
                    className={`px-4 py-2 font-semibold text-sm transition-colors border-b-2 relative top-[1px] ${activeTab === "settings" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-white"}`}
                >
                    Configurações
                </button>
            </div>

            {activeTab === "overview" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="text-sm font-semibold text-muted font-heading uppercase tracking-wider mb-6">Jump back in</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sites.map((site: any) => (
                            <SiteCard
                                key={site.id}
                                site={site}
                                latestExtraction={site.extractions[0]}
                                onLog={addLog}
                            />
                        ))}
                        {sites.length === 0 && (
                            <div className="col-span-full py-20 text-center rounded-2xl border border-dashed border-white/20">
                                <p className="text-muted-foreground text-sm">Nenhum alvo de extração configurado ainda.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {activeTab === "logs" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="card glass p-0 overflow-hidden">
                        <div className="bg-black/40 px-6 py-4 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold flex items-center gap-2 text-sm text-white">
                                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></span>
                                Live Execution Logs
                            </h3>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setLogs([])} className="text-xs font-bold text-muted hover:text-white transition-colors">Limpar</button>
                                <span className="text-xs text-muted-foreground font-mono">{logs.length} eventos</span>
                            </div>
                        </div>
                        <div className="p-6 space-y-3 max-h-[500px] overflow-y-auto font-mono text-sm custom-scrollbar">
                            {logs.map((log, i) => (
                                <div key={i} className={`p-4 rounded-xl border ${log.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-200' : 'bg-blue-500/5 border-blue-500/10 text-blue-200'}`}>
                                    <span className="opacity-50 mr-4 text-xs">[{log.time}]</span>
                                    <span>{log.message}</span>
                                </div>
                            ))}
                            {logs.length === 0 && (
                                <div className="text-center py-10 opacity-50">Nenhum log registrado na sessão.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "settings" && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                        <h2 className="text-sm font-semibold text-muted font-heading uppercase tracking-wider mb-4">Security & API Limits</h2>
                        <ConfigPanel initialApiKey={initialApiKey} />
                    </div>
                </div>
            )}
        </div>
    );
}
