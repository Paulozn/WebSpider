"use client";

import { login, checkAdminExists } from "@/app/actions/auth";
import { motion } from "framer-motion";
import { Bug, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const check = async () => {
            const exists = await checkAdminExists();
            if (!exists) {
                router.push("/setup");
            }
        };
        check();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        try {
            await login(formData);
        } catch (err: any) {
            setError("Usuário ou senha inválidos.");
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

                    <h1 className="text-3xl font-bold font-heading mb-2 text-slate-900">Bem-vindo de volta! 👋</h1>
                    <p className="text-slate-500 mb-8">Por favor, faça login para acessar o painel de scraping.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Usuário</label>
                            <input name="username" placeholder="Digite seu usuário..." required />
                        </div>
                        <div>
                            <label className="label">Senha</label>
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
                            className="primary mt-4 py-3 text-[15px] shadow-lg shadow-indigo-600/20"
                        >
                            {loading ? "Entrando..." : "Acessar Sistema"}
                        </button>
                    </form>

                    <p className="text-xs text-slate-400 mt-10 text-center">
                        Copyright © 2026 Web Spider Inc.
                    </p>
                </div>
            </div>

            <div className="auth-graphic-side relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <h2 className="text-4xl font-bold font-heading mb-4 leading-tight">
                        Gerencie Suas Extrações de Forma Inteligente
                    </h2>
                    <p className="text-indigo-100 text-lg mb-8">
                        Faça login para gerenciar sites, visualizar dados em tempo real e monitorar a engine do Playwright + Gemini AI.
                    </p>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <ShieldCheck size={24} className="text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Ambiente Seguro</h4>
                            <p className="text-indigo-200 text-sm">Proteção avançada com JWT e senhas criptografadas.</p>
                        </div>
                    </div>
                </div>

                {/* Abstract shapes */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
            </div>
        </div>
    );
}
