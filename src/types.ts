import {DishDifficulty} from "./enums.ts";

export type SingleDishRequirements = SingleDishTasteRequirements & SingleDishPracticalRequirements & SingleDishDietaryRequirements & SingleDishBlacklistRequirements

export type SingleDishTasteRequirements = {
    ingredients?: string[],
    cuisine?:string[],
}

export type SingleDishPracticalRequirements = {
    time?: number,
    difficulty?:DishDifficulty,
    servings?:number,
    mealType?:string,
}

export type SingleDishDietaryRequirements = {
    dietType?:string,
    calories?:number,
    highProtein?:boolean,
    lowFat?:boolean,
    lowCarbs?:boolean,
}

export type SingleDishBlacklistRequirements = {
    blacklistedIngredients?: string[],
    allergens?: string[],
}

export type SingleDishResultType = {
    title: string;
    description: string;
    ingredients: Array<string>;
    instructions: Array<string>;
    estimatedTime: number;
    servings: number;
    totalWeight: number;
    weightPerServing: number;
    caloriesPer100g: number;
    macrosPer100g: {
        protein: number;
        fat: number;
        carbs: number;
    },
    difficulty: string;
}
