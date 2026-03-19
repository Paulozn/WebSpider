"use client";

import { useState } from "react";
import { updateAppConfig } from "@/app/actions/scrape";
import { Shield, Key, Info, Save } from "lucide-react";

export default function ConfigPanel({ initialApiKey }: { initialApiKey: string }) {
    const [apiKey, setApiKey] = useState(initialApiKey);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await updateAppConfig("GEMINI_API_KEY", apiKey);
        } catch (e) {
            alert("Erro ao salvar configuração.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="card glass p-8 relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-4 text-primary/20 group-hover:text-primary/40 transition-colors">
                <Shield size={40} />
            </div>

            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Key size={18} />
                </div>
                <h3 className="text-xl font-bold font-heading">Segurança</h3>
            </div>

            <div className="space-y-5">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-muted mb-2 ml-1">Gemini API Key</label>
                    <input
                        type="password"
                        placeholder="AlzaSy..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="font-mono text-sm tracking-wider"
                    />
                </div>

                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <Info size={16} className="text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted leading-relaxed">
                        Sua chave é armazenada de forma segura no banco de dados local.
                        Ela é necessária para que a IA analise a estrutura dos sites em tempo real.
                    </p>
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full primary py-3 flex items-center justify-center gap-2"
                >
                    <Save size={18} />
                    {isSaving ? "Salvando..." : "Salvar Chaves"}
                </button>
            </div>
        </div>
    );
}
