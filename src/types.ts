import {DishDifficulty} from "./enums.ts";

export type SingleDishRequirements = SingleDishTasteRequirements & SingleDishPracticalRequirements & SingleDishDietaryRequirements & SingleDishBlacklistRequirements

export type SingleDishTasteRequirements = {
    ingredients?: string[],
    cuisineType?:string,
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
    ingredientsBlacklist?: string[],
    allergens?: string[],
}