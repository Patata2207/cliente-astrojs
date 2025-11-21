import React from "react"

export default function LoginForm() {

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const username = formData.get("username");
        const password = formData.get("password");

        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        }).then((res) => res.json())
            .then((data: { access: string, refresh: string }) => {
                console.log("Response data:", data);
                return data
            });

        const { access, refresh }: { access: string, refresh: string } = response;
        sessionStorage.setItem("access_token", access);
        sessionStorage.setItem("refresh_token", refresh);
    }

    return (
        <form onSubmit={handleSubmit}>
            <input className="border rounded" type="text" name="username" id="username" />
            <input className="border rounded" type="password" name="password" id="password" />
            <button className="bg-red-500 text-white rounded px-4" type="submit">Login</button>
        </form>
    )
}