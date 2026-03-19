import { prisma } from "@/lib/prisma";
import SiteCard from "@/components/SiteCard";
import { LayoutDashboard, Plus, Search } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardTabs from "@/components/DashboardTabs";
import AddSiteModal from "@/components/AddSiteModal";
import BulkAddModal from "@/components/BulkAddModal";

export default async function Home() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      extractions: {
        orderBy: { createdAt: 'desc' },
        take: 1
      }
    }
  });

  const geminiConfig = await prisma.appConfig.findUnique({
    where: { key: "GEMINI_API_KEY" },
  });

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <main className="main-content">
        <div className="max-w-6xl mx-auto">
          <Header />

          {/* Search / Action Bar */}
          <div className="flex flex-col md:flex-row gap-4 my-8">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Pesquisar sites ou iniciar nova extração..."
                className="w-full bg-[#1e1e1f] border border-white/10 rounded-full py-4 pl-12 pr-4 text-white placeholder-muted-foreground focus:border-primary/50 text-base shadow-sm"
              />
            </div>
            <div className="shrink-0 flex items-center justify-center gap-3">
              <BulkAddModal />
              <AddSiteModal />
            </div>
          </div>

          <DashboardTabs sites={sites} initialApiKey={geminiConfig?.value || ""} />
        </div>
      </main>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
}
