import './Recipes.scss';
import {useAppStore} from "../../../store.ts";
import {deleteRecipe, getUserRecipes} from "../../../DataService.ts";
import {useEffect, useState} from "react";
import {SingleDishResultType} from "../../../types.ts";
import {Link} from "react-router-dom";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

function RecipeCard({recipe, fetchRecipes}: {
    recipe: SingleDishResultType & { id: string },
    fetchRecipes: () => void
}) {

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteRecipe(recipe.id);
        fetchRecipes();
    }

    return (
        <Link to={`/home/single-dish/${recipe.id}`} className="recipe-card">
            <div className="recipe-card__header">
                <div className="recipe-card__header-content">
                    <h3 className="recipe-card__title">{recipe.title}</h3>
                    <span className="recipe-card__cuisine">{recipe.cuisine}</span>
                </div>
                <IconButton 
                    aria-label="delete" 
                    color="error"
                    onClick={handleDelete}
                    className="recipe-card__delete"
                >
                    <DeleteIcon/>
                </IconButton>
            </div>
            
            <p className="recipe-card__description">{recipe.description}</p>
            
            <div className="recipe-card__info">
                <div className="recipe-card__info-item">
                    <AccessTimeIcon fontSize="small" />
                    <span>{recipe.estimatedTime} min</span>
                </div>
                <div className="recipe-card__info-item">
                    <RestaurantIcon fontSize="small" />
                    <span>{recipe.servings} servings</span>
                </div>
                <div className="recipe-card__info-item">
                    <LocalFireDepartmentIcon fontSize="small" />
                    <span>{recipe.calories} kcal</span>
                </div>
            </div>

            <div className="recipe-card__macros">
                <span className="recipe-card__macros__title">
                    Per Serving (recipe makes {recipe.servings} servings)
                </span>
                <div className="recipe-card__macro">
                    <span className="label">Protein</span>
                    <span className="value">{recipe.macros.protein}g</span>
                </div>
                <div className="recipe-card__macro">
                    <span className="label">Fat</span>
                    <span className="value">{recipe.macros.fat}g</span>
                </div>
                <div className="recipe-card__macro">
                    <span className="label">Carbs</span>
                    <span className="value">{recipe.macros.carbs}g</span>
                </div>
            </div>
        </Link>
    )
}

function Recipes() {
    const {authData} = useAppStore((state) => state);
    const [recipes, setRecipes] = useState<(SingleDishResultType & { id: string })[]>([])

    const fetchRecipes = async () => {
        if (authData) {
            const recipesFetched = await getUserRecipes(authData.user.id);
            if (recipesFetched) setRecipes(recipesFetched)
        }
    }

    useEffect(() => {
        fetchRecipes();
    }, []);

    return (
        <div className="recipes-section">
            <div className="recipes-section__header">
                <h2>Your Cookbook</h2>
                <p>Here are all your saved recipes</p>
            </div>
            {recipes.length === 0 ? (
                <div className="recipes-section__empty">
                    <RestaurantIcon sx={{ fontSize: 80, color: 'rgba(117, 123, 200, 0.3)' }} />
                    <h3>No recipes saved yet</h3>
                    <p>Start creating or saving recipes to see them here!</p>
                </div>
            ) : (
                <div className="recipes-section__grid">
                    {recipes.map((recipe) => (
                        <RecipeCard recipe={recipe} key={recipe.id} fetchRecipes={fetchRecipes}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recipes;