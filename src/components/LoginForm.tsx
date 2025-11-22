import React from "react";

export default function LoginForm() {
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        try {
            const res = await fetch("http://127.0.0.1:8000/api/token/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                console.error("Login failed:", err);
                alert("Credenciales incorrectas");
                return;
            }

            const data: { access?: string; refresh?: string } = await res.json();
            console.log("Response data:", data);

            const access = data?.access;
            const refresh = data?.refresh;

            if (access && refresh) {
                sessionStorage.setItem("access_token", access);
                sessionStorage.setItem("refresh_token", refresh);
                window.location.href = "/visitas";
            } else {
                console.error("Respuesta inválida del servidor:", data);
                alert("Respuesta del servidor inválida");
            }
        } catch (error) {
            console.error("Error al conectar con el servidor:", error);
            alert("Error de red al iniciar sesión");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input 
                className="border rounded px-2 py-1" 
                type="text" 
                name="username" 
                id="username" 
                placeholder="Usuario"
                required
            />
            <input 
                className="border rounded px-2 py-1" 
                type="password" 
                name="password" 
                id="password" 
                placeholder="Contraseña"
                required
            />
            <button className="bg-red-500 text-white rounded px-4 py-1" type="submit">
                Login
            </button>
        </form>
    );
}