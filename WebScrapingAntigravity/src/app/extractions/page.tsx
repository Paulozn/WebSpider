import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { getAllExtractions } from "@/app/actions/extractions";
import ViewResultsModal from "@/components/ViewResultsModal";
import { Calendar, Database, ArrowRight } from "lucide-react";

export default async function ExtractionsPage() {
    const extractions = await getAllExtractions();

    return (
        <div className="dashboard-layout">
            <Sidebar />
            <main className="main-content">
                <div className="max-w-6xl mx-auto">
                    <Header />
                    <div className="mt-12">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h1 className="text-4xl font-bold font-heading mb-2">Histórico de Dados</h1>
                                <p className="text-muted font-medium">Gerencie e visualize todos os conjuntos de dados extraídos.</p>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary text-sm font-bold">
                                <Database size={16} />
                                <span>{extractions.length} Extrações</span>
                            </div>
                        </div>

                        {extractions.length === 0 ? (
                            <div className="card glass p-16 text-center">
                                <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                    <Database size={32} className="text-muted/30" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Nenhum dado encontrado</h3>
                                <p className="text-muted max-w-sm mx-auto mb-8">Role uma extração em seus sites monitorados para começar a coletar dados.</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {extractions.map((extraction: any) => {
                                    const data = JSON.parse(extraction.data || "[]");
                                    return (
                                        <div key={extraction.id} className="card glass p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-primary/20 transition-all">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary/10 transition-colors">
                                                    <Database size={24} className="text-primary" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">{extraction.site.name}</h3>
                                                    <div className="flex items-center gap-3 text-sm text-muted mt-1">
                                                        <span className="flex items-center gap-1.5 font-medium">
                                                            <Calendar size={14} />
                                                            {new Date(extraction.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        <span className="w-1 h-1 rounded-full bg-white/10" />
                                                        <span className="font-bold text-primary/80">{data.length} registros</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <ViewResultsModal
                                                    siteName={extraction.site.name}
                                                    resultsJson={extraction.data}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
