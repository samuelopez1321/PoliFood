import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { IoMailOutline, IoLockClosedOutline, IoPersonOutline, IoArrowForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types";
import { apiRegister } from "../services/services";

interface SignUpPageProps {
  onLogin: (user: User) => void;
}

export default function SignUpPage({ onLogin }: SignUpPageProps) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPass.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }
    if (password !== confirmPass) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 12) {
      setError("La contraseña debe tener al menos 12 caracteres");
      return;
    }
    setIsSubmitting(true);
    const result = await apiRegister(name.trim(), email.trim(), password);
    setIsSubmitting(false);
    if (result.success && result.data) {
      onLogin(result.data);
      navigate("/", { replace: true });
    } else {
      setError(result.error ?? "Error al registrarse");
    }
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-10">
      <section className="bg-white w-full max-w-md border border-neutral-100 shadow-xl shadow-neutral-200/40 rounded-[2.5rem] p-8 md:p-10">
        <div className="flex items-center gap-3 mb-2 text-primary">
          <FiUserPlus className="text-2xl" />
          <h1 className="text-2xl font-black text-neutral-900 tracking-tighter">Crear Cuenta</h1>
        </div>
        <p className="text-neutral-500 text-sm font-medium mb-8">
          Crea una cuenta para hacer pedidos.
        </p>
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">Nombre Completo</span>
            <div className="relative">
              <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="text" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">Email</span>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">Contraseña (mín. 12 caracteres)</span>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="password" placeholder="Mínimo 12 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">Confirmar Contraseña</span>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="password" placeholder="Repite tu contraseña" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} />
            </div>
          </div>
          {error && (
            <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-lg">
              <p className="text-accent-dark text-xs font-bold">{error}</p>
            </div>
          )}
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mt-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
            {isSubmitting
              ? <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><span>Registrarse</span><IoArrowForward className="group-hover:translate-x-1 transition-transform" /></>}
          </button>
          <p className="text-center text-sm text-neutral-500 font-medium">
            ¿Ya tienes cuenta?{" "}
            <Link className="text-primary font-bold hover:underline" to="/login">Inicia sesión</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
