import {SingleDishRequirements, SingleDishResultType, MealPlanRequirements, MealPlanResultType} from "./types.ts";

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

export async function saveSingleDish(dishData: SingleDishResultType & { userId: string }) {
    return fetch(`${URL}/recipe`, {
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

export async function getUserRecipes(userId: string): Promise<(SingleDishResultType & { id: string })[]> {
    return fetch(`${URL}/recipe/by-user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function getRecipeById(recipeId: string): Promise<SingleDishResultType & { id: string }> {
    return fetch(`${URL}/recipe/${recipeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function deleteRecipe(recipeId: string) {
    return fetch(`${URL}/recipe/${recipeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function generateMealPlan(requirementsInput: MealPlanRequirements): Promise<MealPlanResultType> {
    const res = await fetch(`${URL}/openai/meal-plan-default`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requirementsInput),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Meal plan generation failed');
    }

    return data;
}

export async function saveMealPlan(mealPlanData: MealPlanResultType & { userId: string }) {
    return fetch(`${URL}/meal-plan`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(mealPlanData),
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function getUserMealPlans(userId: string): Promise<(MealPlanResultType & { id: string })[]> {
    return fetch(`${URL}/meal-plan/by-user/${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function getMealPlanById(mealPlanId: string): Promise<MealPlanResultType & { id: string }> {
    return fetch(`${URL}/meal-plan/${mealPlanId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}

export async function deleteMealPlan(mealPlanId: string) {
    return fetch(`${URL}/meal-plan/${mealPlanId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    }).then(res => {
        return res.json()
    }).then((data) => {
        return data
    });
}
