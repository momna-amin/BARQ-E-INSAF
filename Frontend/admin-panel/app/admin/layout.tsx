import { Sidebar } from '@/components/shell/Sidebar';
import { TopBar } from '@/components/shell/TopBar';
import { MobileSidebar } from '@/components/shell/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex items-center lg:hidden px-4 h-14 border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-30 gap-2">
          <MobileSidebar />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5C1A1A, #8b2121)' }}>
              <span className="text-white font-black text-[10px]">BI</span>
            </div>
            <span className="text-white font-bold text-sm">Barq-e-Insaf</span>
          </div>
        </div>
        <div className="hidden lg:block">
          <TopBar />
        </div>
        <main className="flex-1 overflow-y-auto p-5 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
