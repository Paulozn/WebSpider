"use client";

import { usePathname } from 'next/navigation';

export default function Header() {
    const pathname = usePathname();

    let title = "Overview";
    if (pathname === '/sites') title = "Sites Enfileirados";
    if (pathname === '/extractions') title = "Extrações";

    return (
        <header className="flex justify-between items-center py-6">
            <div>
                <h1 className="text-2xl font-bold font-heading">{title}</h1>
                <div className="flex items-center gap-2 mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
                    <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-[0.1em]">Engine Online</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xs">
                    AD
                </div>
            </div>
        </header>
    );
}
