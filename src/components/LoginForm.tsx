import React, { useState } from "react";

// Base URL obtenida de variable pública para despliegue. En local usa fallback.
const API_BASE = import.meta.env.PUBLIC_BACKEND_URL || 'https://evaluacion-1-kn4q.onrender.com';

export default function LoginForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const res = await fetch(`${API_BASE}/api/token/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                setError("Credenciales incorrectas");
                return;
            }

            const data: { access?: string; refresh?: string } = await res.json();
            const access = data?.access;
            const refresh = data?.refresh;

            if (access && refresh) {
                sessionStorage.setItem("access_token", access);
                sessionStorage.setItem("refresh_token", refresh);
                window.location.href = "/visitas";
            } else {
                setError("Respuesta inválida del servidor");
            }
        } catch (error) {
            // Mensaje específico si es CORS/network
            const mensaje = (error instanceof TypeError) ? 'Error de red/CORS. Verifica dominio backend y CORS.' : 'Error de red. Intenta nuevamente.';
            console.error("Error al conectar con el servidor:", error);
            setError(mensaje);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-sm mx-auto mt-10">
            <div className="card-glass rounded-xl p-8 shadow-lg border border-white/20 bg-white/5 backdrop-blur-md relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_30%_30%,white,transparent)] bg-gradient-to-br from-indigo-500/30 via-fuchsia-500/20 to-transparent" />
                <h1 className="text-2xl font-bold mb-6 tracking-tight">Iniciar sesión</h1>
                <form onSubmit={handleSubmit} className="space-y-4 relative">
                    <div>
                        <label htmlFor="username" className="text-sm font-medium block mb-1">Usuario</label>
                        <input
                            className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:border-indigo-400 outline-none focus:ring-2 focus:ring-indigo-400/30 transition"
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="text-sm font-medium block mb-1">Contraseña</label>
                        <input
                            className="w-full rounded-lg px-4 py-2 bg-white/10 border border-white/20 focus:border-indigo-400 outline-none focus:ring-2 focus:ring-indigo-400/30 transition"
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            required
                        />
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 rounded-lg px-4 py-2 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-medium shadow hover:shadow-lg hover:brightness-110 active:scale-[.98] transition disabled:opacity-50"
                    >
                        {loading ? 'Entrando…' : 'Acceder'}
                    </button>
                </form>
                <div className="mt-6 text-xs text-center text-white/60">
                    © {new Date().getFullYear()} Panel Visitas
                </div>
            </div>
        </div>
    );
}