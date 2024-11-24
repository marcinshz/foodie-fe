import {DishDifficulty, MealType, RequirementsFormInputTypes, RequirementTypes} from "../../../enums.ts";

export function getRequirementsFormState(type: RequirementTypes) {
    switch (type) {
        case RequirementTypes.SingleDish:
            return SingleDishRequirementsState
    }
}


const SingleDishRequirementsTasteStepInputs = [
    {
        label: "Ingredients",
        key: "ingredients",
        description: "What ingredients do you want to use?",
        type: RequirementsFormInputTypes.List
    },
    {
        label:"Cuisine",
        key: "cuisine",
        description: "What cuisine are you interested in?",
        type: RequirementsFormInputTypes.List
    }
]

const SingleDishRequirementsPracticalStepInputs = [
    {
        label: "Time",
        key: "time",
        description: "How much time do you have?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label:"Difficulty",
        key: "difficulty",
        description: "How difficult do you want to be?",
        type: RequirementsFormInputTypes.Select
    },
    {
        label:"Servings",
        key: "servings",
        description: "How many servings do you want?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label:"Meal Type",
        key: "mealType",
        description: "What meal type do you need? (eg. lunch, dinner, etc.)",
        type: RequirementsFormInputTypes.Select
    }
]

const SingleDishRequirementsDietaryStepInputs = [
    {
        label: "Diet Type",
        key: "dietType",
        description: "Do you follow any specific diet type?",
        type: RequirementsFormInputTypes.Text
    },
    {
        label:"Calories",
        key: "calories",
        description: "How many calories do you want?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label:"High Protein",
        key: "highProtein",
        description: "Do you want it to be rich in protein?",
        type: RequirementsFormInputTypes.Boolean
    },
    {
        label: "Low Fat",
        key: "lowFat",
        description: "Do you want it to be low fat?",
        type: RequirementsFormInputTypes.Boolean
    },
    {
        label:"Low Carbs",
        key: "lowCarbs",
        description: "Do you want it to be low carbs?",
        type: RequirementsFormInputTypes.Boolean
    }
]

const SingleDishRequirementsBlacklistStepInputs = [
    {
        label: "Ingredients",
        key: "blacklistedIngredients",
        description: "What ingredients do you want to avoid?",
        type: RequirementsFormInputTypes.List
    },
    {
        label:"Allergens",
        key: "allergens",
        description: "What allergens do you want to avoid?",
        type: RequirementsFormInputTypes.List
    }
]

export const SingleDishRequirementsStepsInputs = [
    SingleDishRequirementsTasteStepInputs,
    SingleDishRequirementsPracticalStepInputs,
    SingleDishRequirementsDietaryStepInputs,
    SingleDishRequirementsBlacklistStepInputs
]

export const SingleDishRequirementsState = {
    ingredients: new Array<string>(),
    cuisine: new Array<string>(),
    time: null,
    difficulty: DishDifficulty.Casual,
    servings: 1,
    mealType: MealType.Any,
    dietType: "",
    calories: null,
    highProtein: false,
    lowFat: false,
    lowCarbs: false,
    blacklistedIngredients: new Array<string>(),
    allergens: new Array<string>()
}