'use client';

import { useAuth } from '../../providers/AuthProvider';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Lazy load components for better performance
const Navbar = dynamic(() => import('../../components/dashboard/Navbar'));
const Sidebar = dynamic(() => import('../../components/dashboard/Sidebar'));
const Footer = dynamic(() => import('../../components/dashboard/Footer'));

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Memoized handlers to prevent re-renders
  const toggleSidebar = useCallback(() => setIsSidebarOpen((prev) => !prev), []);
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
        <div className="text-lg font-medium">Loading...</div>
      </div>
    );
  }

  if (!user) return null;
  return (
    <div className="flex flex-col min-h-screen relative">
      <Navbar toggleSidebar={toggleSidebar} />

      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        <main
          className="flex-1 mt-16 transition-all duration-300 ml-0 lg:ml-72"
          aria-label="Dashboard content"
        >
          {children}
        </main>
      </div>

      <Footer />
    </div>
  );
}