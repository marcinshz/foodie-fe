import {SingleDishRequirements, SingleDishResultType} from "./types.ts";

const URL = "http://localhost:3000";

//AUTH ENDPOINTS
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

//SINGLE DISH ENDPOINTS
export async function generateSingleDishDefault(requirementsInput: SingleDishRequirements) {
    const res = await fetch(`${URL}/openai/single-dish-default`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requirementsInput),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Dish generation failed');
    }

    return data;
}

export async function generateSingleDishImage(dishData: SingleDishResultType) {
    return fetch(`${URL}/openai/single-dish-image`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dishData),
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}