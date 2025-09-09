import {DishDifficulty, MealType, RequirementsFormInputTypes, RequirementTypes} from "../../../enums.ts";
import {MealPlanRequirements, SingleDishRequirements} from "../../../types.ts";

export function getRequirementsFormState(type: RequirementTypes) {
    switch (type) {
        case RequirementTypes.SingleDish:
            return SingleDishRequirementsState
        case RequirementTypes.MealPlan:
            return MealPlanRequirementsState
    }
}


// Single Dish
const SingleDishRequirementsTasteStepInputs = [
    {
        label: "Ingredients",
        key: "ingredients",
        description: "What ingredients do you want to use?",
        type: RequirementsFormInputTypes.List
    },
    {
        label: "Cuisine",
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
        label: "Difficulty",
        key: "difficulty",
        description: "How difficult do you want to be?",
        type: RequirementsFormInputTypes.Select
    },
    {
        label: "Servings",
        key: "servings",
        description: "How many servings do you want?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "Meal Type",
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
        label: "Calories",
        key: "calories",
        description: "How many calories do you want?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "High Protein",
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
        label: "Low Carbs",
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
        label: "Allergens",
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

export const SingleDishRequirementsState: SingleDishRequirements = {
    ingredients: new Array<string>(),
    cuisine: new Array<string>(),
    time: undefined,
    difficulty: DishDifficulty.Casual,
    servings: 1,
    mealType: MealType.Any,
    dietType: "",
    calories: undefined,
    highProtein: false,
    lowFat: false,
    lowCarbs: false,
    blacklistedIngredients: new Array<string>(),
    allergens: new Array<string>()
}

//Meal Plan
const MealPlanGeneralStepInputs = [
    {
        label: "Days",
        key: "days",
        description: "For how many days do you want the meal plan?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "Meals per Day",
        key: "mealsPerDay",
        description: "How many meals per day?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "Meal Types",
        key: "mealTypes",
        description: "Which meal types do you want to include?",
        type: RequirementsFormInputTypes.List
    }
]

const MealPlanTasteStepInputs = [
    {
        label: "Preferred Ingredients",
        key: "ingredients",
        description: "What ingredients do you want to use?",
        type: RequirementsFormInputTypes.List
    },
    {
        label: "Cuisine",
        key: "cuisine",
        description: "What cuisines are you interested in?",
        type: RequirementsFormInputTypes.List
    }
]

const MealPlanPracticalStepInputs = [
    {
        label: "Total Cooking Time per Day",
        key: "timePerDay",
        description: "How much total cooking time do you want per day?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "Difficulty",
        key: "difficulty",
        description: "How difficult do you want meals to be overall?",
        type: RequirementsFormInputTypes.Select
    },
    {
        label: "Servings",
        key: "servings",
        description: "For how many people should the meals be prepared?",
        type: RequirementsFormInputTypes.Number
    }
]

const MealPlanDietaryStepInputs = [
    {
        label: "Diet Type",
        key: "dietType",
        description: "Do you follow any specific diet type?",
        type: RequirementsFormInputTypes.Text
    },
    {
        label: "Calories per Day",
        key: "caloriesPerDay",
        description: "How many calories should the whole day provide?",
        type: RequirementsFormInputTypes.Number
    },
    {
        label: "High Protein",
        key: "highProtein",
        description: "Should meals be rich in protein?",
        type: RequirementsFormInputTypes.Boolean
    },
    {
        label: "Low Fat",
        key: "lowFat",
        description: "Should meals be low fat?",
        type: RequirementsFormInputTypes.Boolean
    },
    {
        label: "Low Carbs",
        key: "lowCarbs",
        description: "Should meals be low carbs?",
        type: RequirementsFormInputTypes.Boolean
    }
]

const MealPlanBlacklistStepInputs = [
    {
        label: "Ingredients",
        key: "blacklistedIngredients",
        description: "What ingredients do you want to avoid?",
        type: RequirementsFormInputTypes.List
    },
    {
        label: "Allergens",
        key: "allergens",
        description: "What allergens do you want to avoid?",
        type: RequirementsFormInputTypes.List
    }
]

export const MealPlanRequirementsStepsInputs = [
    MealPlanGeneralStepInputs,
    MealPlanTasteStepInputs,
    MealPlanPracticalStepInputs,
    MealPlanDietaryStepInputs,
    MealPlanBlacklistStepInputs
]

export const MealPlanRequirementsState: MealPlanRequirements = {
    days: 7,
    mealsPerDay: 3,
    mealTypes: [MealType.Breakfast, MealType.Lunch, MealType.Dinner],
    ingredients: new Array<string>(),
    cuisine: new Array<string>(),
    timePerDay: undefined,
    difficulty: DishDifficulty.Casual,
    servings: 1,
    dietType: "",
    caloriesPerDay: undefined,
    highProtein: false,
    lowFat: false,
    lowCarbs: false,
    blacklistedIngredients: new Array<string>(),
    allergens: new Array<string>()
}