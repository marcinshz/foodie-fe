import './Recipes.scss';
import {useAppStore} from "../../../store.ts";
import {deleteRecipe, getUserRecipes} from "../../../DataService.ts";
import {useEffect, useState} from "react";
import {SingleDishResultType} from "../../../types.ts";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function RecipeCard({recipe, fetchRecipes}: {
    recipe: SingleDishResultType & { id: string },
    fetchRecipes: () => void
}) {

    const handleDelete = async () => {
        await deleteRecipe(recipe.id);
        fetchRecipes();
    }

    return (
        <div className="recipe-card">
            <Link to={`/home/single-dish/${recipe.id}`}>
                <h3>{recipe.title}</h3>
                <div className="recipe-card__buttons">
                    <Button variant="outlined">Add to plan</Button>
                    <IconButton aria-label="delete" onClick={handleDelete}>
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </Link>
        </div>
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
            <h3>Hey! Here are your saved recipes</h3>
            <ul className="recipes-section__list">
                {recipes.map((recipe) => (
                    <RecipeCard recipe={recipe} key={recipe.id} fetchRecipes={fetchRecipes}/>
                ))}
            </ul>
        </div>
    );
}

export default Recipes;