"use client";

import { useState } from "react";
import { Eye, X, Download, Copy, Check, FileJson } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewResultsModal({ siteName, resultsJson, buttonStyle }: { siteName: string, resultsJson: string, buttonStyle?: "default" | "icon" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const [viewMode, setViewMode] = useState<'json' | 'grid'>('grid');

    const results = JSON.parse(resultsJson || "[]");

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(results, null, 2));
        setCopied(false);
        setTimeout(() => setCopied(true), 100);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `${siteName.toLowerCase().replace(/\s+/g, '-')}-results.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <>
            {buttonStyle === "icon" ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-10 h-10 flex items-center justify-center shrink-0 rounded-full border border-white/10 hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                    disabled={!resultsJson || resultsJson === "[]"}
                    title="Ver Resultados"
                >
                    <Eye size={16} className="text-muted-foreground group-hover:text-foreground" />
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="group flex-1 h-14 flex items-center justify-center gap-3 px-6 rounded-2xl border border-white/5 hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={!resultsJson || resultsJson === "[]"}
                >
                    <Eye size={18} className="group-hover:text-primary transition-colors" />
                    <span className="text-sm font-bold text-muted group-hover:text-foreground transition-colors">Ver Dados</span>
                </button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="relative w-full max-w-5xl h-[85vh] glass p-10 rounded-[40px] shadow-2xl border border-white/10 flex flex-col overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-secondary" />

                            <div className="flex justify-between items-center mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                        <FileJson size={28} />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold font-heading">Dataset: {siteName}</h3>
                                        <p className="text-sm text-muted font-medium">Extração finalizada com sucesso via Gemini.</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5">
                                    <button
                                        onClick={() => setViewMode('json')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'json' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-white'}`}
                                    >
                                        JSON RAW
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-muted hover:text-white'}`}
                                    >
                                        VISUALIZAR GRADE
                                    </button>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={copyToClipboard}
                                        className="h-12 px-5 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center gap-2 text-sm font-bold transition-all"
                                    >
                                        {copied ? (
                                            <>
                                                <Check size={18} className="text-green-500" />
                                                <span>Copiado</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy size={18} />
                                                <span>Copiar</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={downloadJson}
                                        className="h-12 px-5 primary flex items-center gap-2 text-sm font-bold shadow-lg shadow-primary/20"
                                    >
                                        <Download size={18} />
                                        <span>Download</span>
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-2xl ml-2 text-muted hover:text-white"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-auto rounded-3xl bg-black/30 p-8 border border-white/5 relative group">
                                {viewMode === 'json' ? (
                                    <pre className="text-blue-200 font-mono text-sm leading-relaxed selection:bg-primary/20">
                                        {JSON.stringify(results, null, 2)}
                                    </pre>
                                ) : (
                                    <div className="grid gap-4">
                                        {results.map((item: any, i: number) => (
                                            <div key={i} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all">
                                                <div className="flex items-center gap-2 mb-4">
                                                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                                                        {i + 1}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-muted uppercase tracking-widest">REGISTRO</span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {Object.entries(item).map(([key, value]) => (
                                                        <div key={key}>
                                                            <div className="text-[10px] font-bold text-primary/50 uppercase tracking-wider mb-1">{key}</div>
                                                            <div className="text-sm font-medium text-foreground/90 break-words line-clamp-3" title={String(value)}>
                                                                {String(value)}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 flex justify-between items-center px-2">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Registros</span>
                                        <span className="text-lg font-bold font-heading">{results.length}</span>
                                    </div>
                                    <div className="w-px h-8 bg-white/5" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Extensão</span>
                                        <span className="text-lg font-bold font-heading text-primary">.JSON</span>
                                    </div>
                                </div>
                                <p className="text-xs text-muted font-medium max-w-[300px] text-right">
                                    Pronto para ser integrado em suas planilhas ou sistemas de análise.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
