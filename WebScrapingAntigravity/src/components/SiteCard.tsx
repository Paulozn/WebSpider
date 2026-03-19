"use client";

import { useState } from "react";
import { runScraper } from "@/app/actions/scrape";
import { Play, PenTool, Database, Settings } from "lucide-react";
import ViewResultsModal from "./ViewResultsModal";
import EditSiteModal from "./EditSiteModal";

export default function SiteCard({ site, latestExtraction, onLog }: { site: any, latestExtraction: any, onLog?: (msg: string, type: 'info' | 'error') => void }) {
    const [isRunning, setIsRunning] = useState(false);

    const handleRun = async () => {
        setIsRunning(true);
        onLog?.(`Iniciando extração para o alvo: ${site.name}`, 'info');
        try {
            await runScraper(site.id);
            onLog?.(`Extração concluída com sucesso (${site.name}).`, 'info');
        } catch (e: any) {
            console.error(e);
            onLog?.(`Erro na engine Playwright/Gemini para ${site.name}: ${e.message || "Desconhecido"}`, 'error');
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="card flex flex-col justify-between hover:border-primary/30 group">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:bg-primary/20 transition-colors">
                    <PenTool size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-foreground truncate">{site.name}</h3>
                        <EditSiteModal site={site} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{site.url}</p>
                </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
                <button
                    onClick={handleRun}
                    disabled={isRunning || site.status === "RUNNING"}
                    className="w-full h-12 rounded-2xl primary flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary/20"
                >
                    {(isRunning || site.status === "RUNNING") ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Processando...</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} fill="currentColor" />
                            <span>Iniciar Extração AI</span>
                        </>
                    )}
                </button>

                <ViewResultsModal
                    siteName={site.name}
                    resultsJson={latestExtraction?.data || "[]"}
                    buttonStyle="default"
                />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${site.status === 'COMPLETED' ? 'text-green-400' :
                    site.status === 'RUNNING' ? 'text-blue-400' :
                        site.status === 'FAILED' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                    ● {site.status}
                </span>
            </div>
        </div>
    );
}
