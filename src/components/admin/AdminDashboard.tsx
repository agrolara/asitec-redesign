import React, { useState } from 'react';
import { 
  Package, 
  Award, 
  BookOpen, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';
import type { AdminUser } from '../../services/api';
import { logout } from '../../services/api';
import { AdminProducts } from './AdminProducts';
import { AdminCertifications } from './AdminCertifications';
import { AdminRecipes } from './AdminRecipes';
import { AdminSettings } from './AdminSettings';

interface AdminDashboardProps {
  user: AdminUser;
  onLogout: () => void;
  onGoToSite: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout, onGoToSite }) => {
  const [activeSection, setActiveSection] = useState<'products' | 'certifications' | 'recipes' | 'settings'>('products');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const navItems = [
    {
      id: 'products' as const,
      name: 'Catálogo de Productos',
      description: 'Pastelería, Panadería, Molinos',
      icon: Package,
      badge: '45+ Fórmulas'
    },
    {
      id: 'certifications' as const,
      name: 'Acreditaciones & Certificaciones',
      description: 'Resoluciones SAG, Inocuidad, BPM',
      icon: Award,
      badge: 'Oficial'
    },
    {
      id: 'recipes' as const,
      name: 'Recetario y Masterclass',
      description: 'Videos técnicos y formulación',
      icon: BookOpen,
      badge: 'Multimedia'
    },
    {
      id: 'settings' as const,
      name: 'Configuración General',
      description: 'Teléfonos, Banco de Chile, Ataelqui',
      icon: Settings,
      badge: 'Empresa'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Barra de Navegación Superior */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-asitec-blue to-blue-900 flex items-center justify-center text-white font-bold shadow-md tracking-wider text-sm">
              AST
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">ASITEC S.A.</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Panel de Control
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Gestor Autoadministrable cPanel & MySQL</p>
            </div>
          </div>

          {/* Menú de Acciones Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onGoToSite}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Ver Sitio Web Público</span>
            </button>

            <div className="h-6 w-px bg-slate-200" />

            {/* Usuario Actual */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user.username.slice(0, 2)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {user.full_name || user.username}
                </p>
                <p className="text-[10px] text-slate-500 capitalize">{user.role || 'Administrador'}</p>
              </div>
            </div>

            {/* Salir */}
            <button
              onClick={handleLogout}
              title="Cerrar Sesión"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Móvil */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menú Móvil Desplegable */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="text-xs font-semibold text-slate-700">{user.full_name || user.username}</span>
              <button
                onClick={handleLogout}
                className="text-xs text-rose-600 font-semibold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Salir
              </button>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGoToSite();
              }}
              className="w-full text-left py-2 text-xs font-medium text-slate-600 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Ver Sitio Público
            </button>
          </div>
        )}
      </header>

      {/* Contenido Principal con Sidebar y Área de Trabajo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 flex flex-col md:flex-row gap-8">
        {/* Sidebar de Navegación Lateral */}
        <aside className="w-full md:w-64 shrink-0 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3 shadow-sm">
            <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Módulos del Sistema
            </p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-asitec-blue text-white shadow-md shadow-blue-900/10 font-medium'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-semibold">{item.name}</p>
                        <p className={`text-[10px] ${active ? 'text-blue-100' : 'text-slate-400'} line-clamp-1`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tarjeta Informativa de Estado MySQL */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-4 rounded-2xl border border-slate-800 shadow-sm text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Base de Datos MySQL</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Todos los cambios realizados en este panel se reflejan instantáneamente en las tablas de MySQL en cPanel.
            </p>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Host: cPanel Apache</span>
              <span className="text-emerald-400">● Conectado</span>
            </div>
          </div>
        </aside>

        {/* Área de Trabajo según Pestaña Activa */}
        <main className="flex-1 min-w-0">
          {activeSection === 'products' && <AdminProducts />}
          {activeSection === 'certifications' && <AdminCertifications />}
          {activeSection === 'recipes' && <AdminRecipes />}
          {activeSection === 'settings' && <AdminSettings />}
        </main>
      </div>

      {/* Footer del Panel */}
      <footer className="bg-white border-t border-slate-200/80 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} ASITEC S.A. Todos los derechos reservados. Plataforma Autoadministrable.</p>
          <div className="flex items-center gap-4">
            <button onClick={onGoToSite} className="hover:text-slate-700 transition-colors">
              Ir al Sitio Público
            </button>
            <span>•</span>
            <span className="font-mono text-[11px]">v2.5.0 Full cPanel Edition</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
