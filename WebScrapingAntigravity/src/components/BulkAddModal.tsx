"use client";

import { useState } from "react";
import { PlusCircle, X, Globe, Layers, Check } from "lucide-react";
import { bulkAddSites } from "@/app/actions/scrape";
import { motion, AnimatePresence } from "framer-motion";

export default function BulkAddModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [urlsText, setUrlsText] = useState("");
    const [instructions, setInstructions] = useState("extraia todos os produtos");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const urls = urlsText
            .split("\n")
            .map(url => url.trim())
            .filter(url => url.length > 5 && url.startsWith("http"));

        if (urls.length === 0) return;

        setIsSubmitting(true);
        try {
            await bulkAddSites(urls, instructions);
            setIsOpen(false);
            setUrlsText("");
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const urlCount = urlsText.split("\n").filter(line => line.trim().length > 5).length;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="h-12 px-6 glass rounded-2xl flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-white transition-all border border-white/5 hover:border-white/20"
            >
                <PlusCircle size={18} />
                <span>Importação em Massa</span>
            </button>

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
                            className="relative w-full max-w-2xl glass p-10 rounded-[32px] shadow-[0_0_100px_-20px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-secondary via-primary to-accent" />

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold font-heading">Importação em Massa</h3>
                                    <p className="text-muted text-sm mt-2">Adicione vários sites colando as URLs abaixo (uma por linha).</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-3 hover:bg-white/5 rounded-2xl text-muted hover:text-white transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="label">Lista de URLs</label>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                            {urlCount} sites detectados
                                        </span>
                                    </div>
                                    <textarea
                                        rows={8}
                                        placeholder="https://exemplo1.com&#10;https://exemplo2.com&#10;https://exemplo3.com"
                                        value={urlsText}
                                        onChange={(e) => setUrlsText(e.target.value)}
                                        className="font-mono text-xs leading-relaxed"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="label">Instruções Base (Opcional)</label>
                                    <input
                                        placeholder="Ex: extraia o título e o preço..."
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                    />
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || urlCount === 0}
                                        className="primary h-16 w-full text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Layers size={20} />
                                                <span>Importar Todos</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
