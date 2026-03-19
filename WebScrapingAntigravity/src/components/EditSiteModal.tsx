"use client";

import { useState } from "react";
import { Edit2, X, Globe, Settings2, Shield, Trash2 } from "lucide-react";
import { updateSite, deleteSite } from "@/app/actions/scrape";
import { motion, AnimatePresence } from "framer-motion";

interface EditSiteModalProps {
    site: any;
}

export default function EditSiteModal({ site }: EditSiteModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState(site.name);
    const [url, setUrl] = useState(site.url);
    const [instructions, setInstructions] = useState(site.instructions || "");
    const [proxyHost, setProxyHost] = useState(site.proxyHost || "");
    const [proxyPort, setProxyPort] = useState(site.proxyPort || "");
    const [proxyUser, setProxyUser] = useState(site.proxyUser || "");
    const [proxyPass, setProxyPass] = useState(site.proxyPass || "");
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateSite(site.id, {
            name,
            url,
            instructions,
            proxyHost: proxyHost || undefined,
            proxyPort: proxyPort || undefined,
            proxyUser: proxyUser || undefined,
            proxyPass: proxyPass || undefined,
        });
        setIsOpen(false);
    };

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir este site? Todos os logs e extrações também serão removidos.")) {
            setIsDeleting(true);
            try {
                await deleteSite(site.id);
                setIsOpen(false);
            } catch (error) {
                console.error(error);
                setIsDeleting(false);
            }
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="p-3 hover:bg-white/5 rounded-2xl text-muted hover:text-white transition-all border border-white/5"
                title="Editar Configurações"
            >
                <Edit2 size={18} />
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
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h3 className="text-3xl font-bold font-heading">Editar Alvo</h3>
                                    <p className="text-muted text-sm mt-2">Atualize as configurações de {site.name}.</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                        className="p-3 hover:bg-red-500/10 rounded-2xl text-red-400 hover:text-red-300 transition-all border border-red-500/10"
                                        title="Excluir Site"
                                    >
                                        <Trash2 size={24} />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-3 hover:bg-white/5 rounded-2xl text-muted hover:text-white transition-all"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8" autoComplete="off">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-2 text-primary">
                                        <Globe size={18} />
                                        <h4 className="text-sm font-bold uppercase tracking-widest">Geral</h4>
                                    </div>
                                    <div>
                                        <label className="label">Identificação</label>
                                        <input
                                            placeholder="Ex: E-commerce Alpha"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">URL de Destino</label>
                                        <input
                                            placeholder="https://..."
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Instruções IA</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Defina o que a IA deve buscar..."
                                            value={instructions}
                                            onChange={(e) => setInstructions(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-col mb-2">
                                        <div className="flex items-center gap-3 text-secondary">
                                            <Shield size={18} />
                                            <h4 className="text-sm font-bold uppercase tracking-widest">Proxy & Segurança</h4>
                                        </div>
                                        <a 
                                            href="https://proxy-seller.com/pt/?partner=L1OGFIPJSKJTOX" 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="inline-block mt-3 px-4 py-2 rounded-xl border border-secondary/30 bg-secondary/10 text-[10px] uppercase tracking-wider font-bold text-secondary hover:bg-secondary/20 transition-all text-center w-full"
                                        >
                                            🔥 Proxy com desconto (Recomendado)
                                        </a>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2">
                                            <label className="label">Host</label>
                                            <input
                                                placeholder="0.0.0.0"
                                                value={proxyHost}
                                                onChange={(e) => setProxyHost(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Porta</label>
                                            <input
                                                placeholder="8080"
                                                value={proxyPort}
                                                onChange={(e) => setProxyPort(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="label">Usuário Proxy</label>
                                            <input
                                                placeholder="opcional"
                                                value={proxyUser}
                                                onChange={(e) => setProxyUser(e.target.value)}
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">Senha Proxy</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={proxyPass}
                                                onChange={(e) => setProxyPass(e.target.value)}
                                                autoComplete="new-password"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button type="submit" className="primary h-16 text-lg flex items-center justify-center gap-3">
                                            <Settings2 size={20} />
                                            <span>Salvar Alterações</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
