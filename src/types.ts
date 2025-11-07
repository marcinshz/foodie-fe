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
    estimatedTime: number; // cooking time in minutes
    servings: number; // number of portions the recipe makes
    calories: number; // kcal per single serving
    macros: {
        protein: number; // protein grams per single serving
        fat: number; // fat grams per single serving
        carbs: number; // carbs grams per single serving
    };
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
    servings: number; // number of people this meal plan serves
    dailyTargets?: {
        calories?: number; // target total calories per day
        protein?: number; // target total protein grams per day
        fat?: number; // target total fat grams per day
        carbs?: number; // target total carbs grams per day
    };
    plan: Array<{
        day: number;
        estimatedTime: number; // total cooking time for the day in minutes
        totals: {
            calories: number; // sum of all meal calories for the day
            protein: number; // sum of all meal protein for the day
            fat: number; // sum of all meal fat for the day
            carbs: number; // sum of all meal carbs for the day
        };
        meals: Array<{
            type: MealType;
            dish: SingleDishResultType; // each dish contains per-serving values
        }>;
    }>;
}