"use client";

import { Home, Settings, Database, Code, LogOut, Zap, LayoutDashboard, Cpu, Shield, Bug } from "lucide-react";
import { logout } from "@/app/actions/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-64 h-screen border-r border-white/5 bg-[#131314] flex flex-col hidden lg:flex fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                        <Bug size={18} className="text-white" fill="white" />
                    </div>
                    <span className="font-bold text-lg tracking-tight font-heading">Web Spider</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1">
                <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === "/" ? "bg-white/5 text-primary" : "text-muted hover:bg-white/5 hover:text-white"}`}>
                    <Home size={18} />
                    Overview
                </Link>
                <Link href="/sites" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/sites") ? "bg-white/5 text-primary" : "text-muted hover:bg-white/5 hover:text-white"}`}>
                    <LayoutDashboard size={18} />
                    Sites Enfileirados
                </Link>
                <Link href="/extractions" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/extractions") ? "bg-white/5 text-primary" : "text-muted hover:bg-white/5 hover:text-white"}`}>
                    <Database size={18} />
                    Extrações (JSON)
                </Link>
                <Link href="/ai-logs" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname.startsWith("/ai-logs") ? "bg-white/5 text-primary" : "text-muted hover:bg-white/5 hover:text-white"}`}>
                    <Cpu size={18} />
                    Gemini AI Logs
                </Link>

                <div className="pt-4 px-3">
                    <a 
                        href="https://proxy-seller.com/pt/?partner=L1OGFIPJSKJTOX" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-all group"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <Shield size={14} className="text-secondary" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-secondary/80">Recomendado</span>
                        </div>
                        <p className="text-xs font-semibold text-white group-hover:text-primary transition-colors">
                            Proxy com desconto 🔥
                        </p>
                        <p className="text-[10px] text-muted mt-1 leading-tight">
                            Alta performance para suas extrações.
                        </p>
                    </a>
                </div>
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => logout()}
                    className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-muted hover:bg-white/5 hover:text-white transition-colors text-sm font-medium"
                >
                    <LogOut size={18} />
                    Finalizar Sessão
                </button>
            </div>
        </aside>
    );
}
