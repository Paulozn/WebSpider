import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { prisma } from "@/lib/prisma";
import SiteCard from "@/components/SiteCard";
import { LayoutDashboard, Plus, Search } from "lucide-react";
import Link from "next/link";
import BulkAddModal from "@/components/BulkAddModal";

export default async function SitesPage() {
    const sites = await prisma.site.findMany({
        include: {
            extractions: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="max-w-6xl mx-auto">
                    <Header />
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h1 className="text-4xl font-bold font-heading mb-2">Sites Enfileirados</h1>
                                <p className="text-muted font-medium">Gerencie seus alvos de raspagem e monitore os status.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <BulkAddModal />
                                <div className="h-14 px-6 glass rounded-2xl flex items-center gap-4 border border-white/5">
                                    <Search size={20} className="text-muted" />
                                    <input
                                        type="text"
                                        placeholder="Buscar site..."
                                        className="bg-transparent border-none outline-none text-sm font-medium w-48 placeholder:text-muted/50"
                                    />
                                </div>
                            </div>
                        </div>

                        {sites.length === 0 ? (
                            <div className="card glass p-20 text-center flex flex-col items-center border-dashed">
                                <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center text-primary mb-8 animate-pulse">
                                    <LayoutDashboard size={40} />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">Sua fila está vazia</h3>
                                <p className="text-muted max-w-sm mx-auto mb-10 text-lg">Comece cadastrando um novo site no dashboard principal para visualizar aqui.</p>
                                <Link href="/" className="primary px-10 h-14 flex items-center gap-3 text-sm font-bold shadow-xl shadow-primary/20">
                                    <Plus size={20} />
                                    Cadastrar Novo Target
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {sites.map((site: any) => (
                                    <SiteCard
                                        key={site.id}
                                        site={site}
                                        latestExtraction={site.extractions[0]}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
