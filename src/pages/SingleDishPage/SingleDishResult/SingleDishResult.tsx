import './SingleDishResult.scss'
import {SingleDishResultType} from "../../../types.ts";
import {PieChart} from '@mui/x-charts/PieChart';
import {useEffect, useState} from "react";
import {generateSingleDishImage, saveSingleDish} from "../../../DataService.ts";
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/Favorite';
import {useAppStore} from "../../../store.ts";

type SingleDishResultProps = {
    result: SingleDishResultType;
}

function SingleDishResult({result}: SingleDishResultProps) {
    const [image, setImage] = useState("");
    const [saved, setSaved] = useState(false);
    const authData = useAppStore((state) => state.authData);

    useEffect(() => {
        if (result || !image) {
/*            generateSingleDishImage(result).then((data) => {
                setImage(data.url);
            });*/
        }
    }, [result]);

    async function handleSave() {
        if (authData) {
            await saveSingleDish({...result, userId: authData.user.id});
            setSaved(!saved);
        }
    }

    return (
        <div className="single-dish-result">
            {image ? <img src={image} alt="dish" loading="lazy"/> :
                <Skeleton variant="rectangular" width={'100%'} height={600}/>}
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
                <div className="single-dish-result__data-bar__specification">
                    <h5>Calories: {result.calories} kcal</h5>
                    <h5>Macros [grams]:</h5>
                    <PieChart
                        series={[
                            {
                                data: [
                                    {id: 0, value: result.macros.carbs, label: 'Carbs'},
                                    {id: 1, value: result.macros.protein, label: 'Protein'},
                                    {id: 2, value: result.macros.fat, label: 'Fat'},
                                ],
                            },
                        ]}
                        width={100}
                        height={100}
                    />
                </div>
                <div className="single-dish-result__data-bar__description">
                    <p>{result.description}</p>
                </div>
            </div>
            <div className="single-dish-result__lists">
                <div className="single-dish-result__instruction">
                    {result.instructions.map((instruction: string, index: number) => <div
                        className="single-dish-result__instruction__item">
                        <h1 className="single-dish-result__instruction__item__number">{index + 1}</h1>
                        <p className="single-dish-result__instruction__item__text">{instruction}</p>
                    </div>)}
                </div>
                <div className="single-dish-result__ingredients">
                    <h2>Ingredients</h2>
                    <div className="single-dish-result__ingredients__list">
                        {result.ingredients.map((ingredient: string) => <p
                            className="single-dish-result__ingredients__item">{ingredient}</p>)}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default SingleDishResult;