import { useState, useEffect } from 'react';
import type { User, Store } from '../types';
import { UserRole } from '../types';
import { apiGetEstudianteById, apiGetVendorById, apiGetAdminById, apiGetStoreById } from '../services/services';
import { IoPersonOutline, IoMailOutline, IoStorefrontOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';

interface ProfilePageProps {
  currentUser: User;
}

interface ProfileData {
  id: string;
  nombre: string;
  email: string;
  userRole: string;
  storeId?: string;
}

const roleLabel: Record<string, string> = {
  ESTUDIANTE: 'Estudiante',
  VENDOR: 'Vendedor',
  ADMIN: 'Administrador',
};

const roleBadgeClass: Record<string, string> = {
  ESTUDIANTE: 'bg-blue-100 text-blue-700',
  VENDOR: 'bg-primary/10 text-primary',
  ADMIN: 'bg-purple-100 text-purple-700',
};

export const ProfilePage = ({ currentUser }: ProfilePageProps) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      let res;
      if (currentUser.role === UserRole.Student) {
        res = await apiGetEstudianteById(currentUser.id);
      } else if (currentUser.role === UserRole.Vendor) {
        res = await apiGetVendorById(currentUser.id);
      } else {
        res = await apiGetAdminById(currentUser.id);
      }

      if (res.success && res.data) {
        setProfile(res.data as ProfileData);
        if (currentUser.role === UserRole.Vendor && (res.data as ProfileData).storeId) {
          const storeRes = await apiGetStoreById((res.data as ProfileData).storeId!);
          if (storeRes.success && storeRes.data) setStore(storeRes.data);
        }
      } else {
        setError(res.error ?? 'Error al cargar el perfil');
      }
      setLoading(false);
    };

    fetchProfile();
  }, [currentUser.id, currentUser.role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-neutral-100">
        <p className="text-neutral-400 text-lg font-medium">{error ?? 'No se pudo cargar el perfil.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="bg-white rounded-3xl shadow-sm p-10 border border-neutral-100 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-primary flex items-center justify-center text-white text-4xl font-black flex-shrink-0 shadow-lg shadow-primary/20">
            {profile.nombre.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-neutral-900">{profile.nombre}</h1>
            <span className={`inline-block mt-2 text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${roleBadgeClass[profile.userRole] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {roleLabel[profile.userRole] ?? profile.userRole}
            </span>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full -mr-20 -mt-20"></div>
      </header>

      <section className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-bold text-neutral-800">Información de la cuenta</h2>
        </div>
        <div className="divide-y divide-neutral-100">
          <div className="flex items-center gap-4 px-6 py-5">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
              <IoPersonOutline className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Nombre</p>
              <p className="text-base font-bold text-neutral-800 mt-0.5">{profile.nombre}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
              <IoMailOutline className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Correo electrónico</p>
              <p className="text-base font-bold text-neutral-800 mt-0.5">{profile.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5">
            <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
              <IoShieldCheckmarkOutline className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Rol</p>
              <p className="text-base font-bold text-neutral-800 mt-0.5">{roleLabel[profile.userRole] ?? profile.userRole}</p>
            </div>
          </div>

          {store && (
            <div className="flex items-center gap-4 px-6 py-5">
              <div className="h-10 w-10 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                {store.logoUrl ? (
                  <img src={store.logoUrl} alt={store.nombre} className="h-10 w-10 rounded-2xl object-cover" />
                ) : (
                  <IoStorefrontOutline className="text-lg" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Tienda asignada</p>
                <p className="text-base font-bold text-neutral-800 mt-0.5">{store.nombre}</p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {store.available === 1 ? 'Abierta' : 'Cerrada'}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
