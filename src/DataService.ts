const URL = "http://localhost:3000";

export async function login(email: string, password: string) {
    const res = await fetch(`${URL}/auth/sign-in`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: email, password}),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Login failed');
    }

    return data;
}

export async function register(email: string, password: string) {
    const res = await fetch(`${URL}/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({username: email, password}),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
    }

    return data;
}