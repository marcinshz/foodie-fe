import {DishDifficulty, MealType} from "./enums.ts";


//Single Dish
export type SingleDishRequirements =
    SingleDishTasteRequirements
    & SingleDishPracticalRequirements
    & SingleDishDietaryRequirements
    & SingleDishBlacklistRequirements

export type SingleDishTasteRequirements = {
    ingredients?: string[],
    cuisine?: string[],
}

export type SingleDishPracticalRequirements = {
    time?: number,
    difficulty?: DishDifficulty,
    servings?: number,
    mealType?: string,
}

export type SingleDishDietaryRequirements = {
    dietType?: string,
    calories?: number,
    highProtein?: boolean,
    lowFat?: boolean,
    lowCarbs?: boolean,
}

export type SingleDishBlacklistRequirements = {
    blacklistedIngredients?: string[],
    allergens?: string[],
}

export type SingleDishResultType = {
    title: string;
    cuisine: string;
    description: string;
    ingredients: Array<string>;
    instructions: Array<string>;
    estimatedTime: number;
    servings: number;
    calories: number;
    macros: {
        protein: number;
        fat: number;
        carbs: number;
    },
    difficulty: string;
}

//Meal Plan
export type MealPlanRequirements =
    MealPlanStructureRequirements &
    MealPlanTasteRequirements &
    MealPlanPracticalRequirements &
    MealPlanDietaryRequirements &
    MealPlanBlacklistRequirements

export type MealPlanStructureRequirements = {
    days?: number,
    mealsPerDay?: number,
    mealTypes?: string[],
}

export type MealPlanTasteRequirements = {
    ingredients?: string[],
    cuisine?: string[],
}

export type MealPlanPracticalRequirements = {
    timePerDay?: number,
    difficulty?: DishDifficulty,
    servings?: number,
}

export type MealPlanDietaryRequirements = {
    dietType?: string,
    caloriesPerDay?: number,
    highProtein?: boolean,
    lowFat?: boolean,
    lowCarbs?: boolean,
}

export type MealPlanBlacklistRequirements = {
    blacklistedIngredients?: string[],
    allergens?: string[],
}

export type MealPlanResultType = {
    title: string;
    description: string;
    days: number;
    mealsPerDay: number;
    servings: number;
    dailyTargets?: {
        calories?: number;
        protein?: number;
        fat?: number;
        carbs?: number;
    };
    plan: Array<{
        day: number;
        estimatedTime: number;
        totals: {
            calories: number;
            protein: number;
            fat: number;
            carbs: number;
        };
        meals: Array<{
            type: MealType;
            dish: SingleDishResultType;
        }>;
    }>;
}