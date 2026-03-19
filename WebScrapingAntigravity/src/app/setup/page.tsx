"use client";

import { adminSetup } from "@/app/actions/auth";
import { Bug, ShieldCheck, UserPlus } from "lucide-react";
import { useState } from "react";

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        try {
            await adminSetup(formData);
        } catch (err: any) {
            setError(err.message || "Erro ao configurar admin");
            setLoading(false);
        }
    };

    return (
        <div className="auth-split">
            <div className="auth-form-side">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-10 text-indigo-600">
                        <Bug fill="currentColor" size={28} />
                        <span className="font-bold text-2xl font-heading">Web Spider</span>
                    </div>

                    <h1 className="text-3xl font-bold font-heading mb-2 text-slate-900">Configuração Inicial</h1>
                    <p className="text-slate-500 mb-8">Defina seu usuário master para acessar o painel pela primeira vez.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Usuário Master</label>
                            <input name="username" placeholder="Crie um nome de usuário" required />
                        </div>
                        <div>
                            <label className="label">Senha de Acesso</label>
                            <input name="password" type="password" placeholder="••••••••" required />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="primary mt-4 py-3 text-[15px] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
                        >
                            {loading ? "Criando Conta..." : (
                                <>
                                    <UserPlus size={18} />
                                    <span>Criar Administrador</span>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 mt-10 text-center">
                        Setup Wizard - Web Spider Engine
                    </p>
                </div>
            </div>

            <div className="auth-graphic-side relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold font-heading mb-4 leading-tight">
                        Seu Ambiente de Extração Inteligente
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8">
                        Configure seu acesso para gerenciar as rotinas de scraping baseadas em inteligência artificial.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Único Acesso</h4>
                            <p className="text-indigo-200 text-sm">Este usuário terá controle total sobre as engine de scraping.</p>
                        </div>
                    </div>
                </div>

                {/* Abstract shapes */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
