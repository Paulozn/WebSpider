import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getLogs, clearLogs } from "@/app/actions/logs";
import { Cpu, Terminal, Trash2, Calendar, Layout } from "lucide-react";

export default async function AILogsPage() {
    const logs = await getLogs();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="max-w-6xl mx-auto">
                    <Header />
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-bold font-heading mb-2 text-foreground">Gemini AI Engine</h1>
                                <p className="text-muted font-medium">Logs detalhados de todas as interações e decisões da IA.</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-2 text-sm font-bold text-muted">
                                    <Terminal size={16} />
                                    <span>{logs.length} Eventos</span>
                                </div>
                            </div>
                        </div>

                        {logs.length === 0 ? (
                            <div className="card glass p-16 text-center border-dashed">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Cpu size={32} className="text-muted/20" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Aguardando Execução</h3>
                                <p className="text-muted max-w-sm mx-auto mb-8">Inicie uma raspagem para ver os registros de como a IA descobre e processa os dados.</p>
                            </div>
                        ) : (
                            <div className="bg-slate-950/40 rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
                                <div className="bg-white/5 p-6 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3 text-sm font-bold opacity-60">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        LIVE CONSOLE ENGINE
                                    </div>
                                </div>
                                <div className="p-8 font-mono text-sm space-y-4 max-h-[600px] overflow-auto custom-scrollbar">
                                    {logs.map((log: any) => (
                                        <div key={log.id} className="flex gap-4 group">
                                            <span className="text-white/20 shrink-0 select-none font-bold">
                                                [{new Date(log.createdAt).toLocaleTimeString('pt-BR', { hour12: false })}]
                                            </span>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${log.type === 'ERROR' ? 'bg-red-500/10 text-red-400' :
                                                            log.type === 'GEMINI' ? 'bg-primary/10 text-primary' :
                                                                'bg-blue-500/10 text-blue-400'
                                                        }`}>
                                                        {log.type}
                                                    </span>
                                                    {log.site && (
                                                        <span className="text-[10px] font-bold text-white/30 uppercase cursor-pointer hover:text-primary transition-colors">
                                                            @{log.site.name}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={`leading-relaxed ${log.type === 'ERROR' ? 'text-red-300' :
                                                        log.type === 'GEMINI' ? 'text-primary/90' :
                                                            'text-blue-100/80'
                                                    }`}>
                                                    {log.message}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="pt-4 text-white/10 font-bold flex items-center gap-2 select-none italic">
                                        <ArrowRight size={14} />
                                        <span>Ready for next instruction...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function ArrowRight({ size }: { size: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
        </svg>
    )
}
