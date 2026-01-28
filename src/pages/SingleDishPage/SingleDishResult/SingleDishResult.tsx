import './SingleDishResult.scss'
import {SingleDishResultType} from "../../../types.ts";
import {saveSingleDish} from "../../../DataService.ts";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useAppStore} from "../../../store.ts";
import { useState } from 'react';

type SingleDishResultProps = {
    result: SingleDishResultType;
}

function SingleDishResult({result}: SingleDishResultProps) {
    const [saved, setSaved] = useState(false);
    const authData = useAppStore((state) => state.authData);

    async function handleSave() {
        if (authData) {
            await saveSingleDish({...result, userId: authData.user.id});
            setSaved(!saved);
        }
    }

    return (
        <div className="single-dish-result">
            <div className="single-dish-result__header">
                <h3>Let's cook</h3>
                <h1>{result.title}</h1>
            </div>
            <div className="single-dish-result__basic-info-bar">
                <div className="single-dish-result__basic-info-bar__item">
                    <h4>Cuisine</h4>
                    <h3>{result.cuisine}</h3>
                </div>
                <div className="single-dish-result__basic-info-bar__item">
                    <h4>Servings</h4>
                    <h3>{result.servings}</h3>
                </div>
                <div className="single-dish-result__basic-info-bar__item">
                    <h4>Prep time</h4>
                    <h3>{result.estimatedTime} minutes</h3>
                </div>
                <div className="single-dish-result__basic-info-bar__item">
                    <h4>Difficulty</h4>
                    <h3>{result.difficulty}</h3>
                </div>
                <div className="single-dish-result__basic-info-bar__item">
                    <h4>Save recipe</h4>
                    <IconButton color="primary" size="large" sx={{marginTop: '4px'}} onClick={handleSave}>
                        {saved ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                    </IconButton>
                </div>
            </div>
            <div className="single-dish-result__data-bar">
                <div className="single-dish-result__data-bar__description">
                    <p>{result.description}</p>
                </div>
                <div className="single-dish-result__data-bar__nutrition">
                    <h4>Nutrition Information</h4>
                    <p className="single-dish-result__data-bar__nutrition__note">
                        Per serving (recipe makes {result.servings} servings)
                    </p>
                    <div className="single-dish-result__data-bar__nutrition__grid">
                        <div className="single-dish-result__data-bar__nutrition__card">
                            <span className="label">Calories</span>
                            <span className="value">{result.calories} kcal</span>
                        </div>
                        <div className="single-dish-result__data-bar__nutrition__card">
                            <span className="label">Protein</span>
                            <span className="value">{result.macros.protein}g</span>
                        </div>
                        <div className="single-dish-result__data-bar__nutrition__card">
                            <span className="label">Fat</span>
                            <span className="value">{result.macros.fat}g</span>
                        </div>
                        <div className="single-dish-result__data-bar__nutrition__card">
                            <span className="label">Carbs</span>
                            <span className="value">{result.macros.carbs}g</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="single-dish-result__lists">
                <div className="single-dish-result__instruction">
                    {result.instructions.map((instruction: string, index: number) => <div
                        key={index}
                        className="single-dish-result__instruction__item">
                        <h1 className="single-dish-result__instruction__item__number">{index + 1}</h1>
                        <p className="single-dish-result__instruction__item__text">{instruction}</p>
                    </div>)}
                </div>
                <div className="single-dish-result__ingredients">
                    <h2>Ingredients</h2>
                    <div className="single-dish-result__ingredients__list">
                        {result.ingredients.map((ingredient: string, index: number) => <p
                            key={index}
                            className="single-dish-result__ingredients__item">{ingredient}</p>)}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SingleDishResult;