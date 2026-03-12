import { useState } from "react";
import { FiLogIn } from "react-icons/fi";
import { IoMailOutline, IoLockClosedOutline, IoArrowForward } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import type { User } from "../types";
import { USERS } from "../data/users";

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email y contraseña son obligatorios");
      return;
    }

    setIsSubmitting(true);

    const user = USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (user) {
      onLogin(user);
      navigate("/", { replace: true });
    } else {
      setError("Email o contraseña incorrectos");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-6 py-10">
      <section className="bg-white w-full max-w-md border border-neutral-100 shadow-xl shadow-neutral-200/40 rounded-[2.5rem] p-8 md:p-10">
        <div className="flex items-center gap-3 mb-2 text-primary">
          <FiLogIn className="text-2xl" />
          <h1 className="text-2xl font-black text-neutral-900 tracking-tighter">
            Iniciar sesión
          </h1>
        </div>

        <p className="text-neutral-500 text-sm font-medium mb-8">
          Ingresa con tu cuenta para hacer pedidos o gestionar tu tienda.
        </p>

        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">
              Email
            </span>
            <div className="relative">
              <IoMailOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black text-neutral-400 uppercase ml-1">
              Contraseña
            </span>
            <div className="relative">
              <IoLockClosedOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-lg" />
              <input
                className="w-full pl-12 pr-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>
          {error && (
            <div className="bg-accent/10 border-l-4 border-accent p-3 rounded-lg">
              <p className="text-accent-dark text-xs font-bold">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white font-black py-4 rounded-2xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Entrar
                <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="text-center text-sm text-neutral-500 font-medium">
            ¿No tienes cuenta?{" "}
            <Link className="text-primary font-bold hover:underline" to="/signup">
              Regístrate
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
};
