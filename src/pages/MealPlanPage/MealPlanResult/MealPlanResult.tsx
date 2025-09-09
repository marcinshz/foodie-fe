import './MealPlanResult.scss'
import {MealPlanResultType} from "../../../types.ts";
import {PieChart} from '@mui/x-charts/PieChart';
import {useState} from "react";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/Favorite';
import {useAppStore} from "../../../store.ts";
import {Accordion, AccordionDetails, AccordionSummary} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type MealPlanResultProps = {
    result: MealPlanResultType;
}

function MealPlanResult({result}: MealPlanResultProps) {
    const [saved, setSaved] = useState(false);
    const [expandedDay, setExpandedDay] = useState<number | false>(false);
    const authData = useAppStore((state) => state.authData);

    async function handleSave() {
        if (authData) {
            // TODO: Implement save meal plan functionality
            setSaved(!saved);
        }
    }

    const handleDayChange = (dayNumber: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedDay(isExpanded ? dayNumber : false);
    };

    return (
        <div className="meal-plan-result">
            <div className="meal-plan-result__header">
                <h3>Your meal plan is ready!</h3>
                <h1>{result.title}</h1>
                <p className="meal-plan-result__header__description">{result.description}</p>
            </div>

            <div className="meal-plan-result__basic-info-bar">
                <div className="meal-plan-result__basic-info-bar__item">
                    <h4>Days</h4>
                    <h3>{result.days}</h3>
                </div>
                <div className="meal-plan-result__basic-info-bar__item">
                    <h4>Meals per day</h4>
                    <h3>{result.mealsPerDay}</h3>
                </div>
                <div className="meal-plan-result__basic-info-bar__item">
                    <h4>Servings</h4>
                    <h3>{result.servings}</h3>
                </div>
                <div className="meal-plan-result__basic-info-bar__item">
                    <h4>Save plan</h4>
                    <IconButton color="primary" size="large" sx={{marginTop: '4px'}} onClick={handleSave}>
                        {saved ? <FavoriteIcon/> : <FavoriteBorderIcon/>}
                    </IconButton>
                </div>
            </div>

            {result.dailyTargets && (
                <div className="meal-plan-result__targets-section">
                    <div className="meal-plan-result__targets-section__specification">
                        <h5>Daily Targets:</h5>
                        {result.dailyTargets.calories && <h6>Calories: {result.dailyTargets.calories} kcal</h6>}
                        {(result.dailyTargets.protein || result.dailyTargets.fat || result.dailyTargets.carbs) && (
                            <>
                                <h6>Macros [grams]:</h6>
                                <PieChart
                                    series={[
                                        {
                                            data: [
                                                {id: 0, value: result.dailyTargets.carbs || 0, label: 'Carbs'},
                                                {id: 1, value: result.dailyTargets.protein || 0, label: 'Protein'},
                                                {id: 2, value: result.dailyTargets.fat || 0, label: 'Fat'},
                                            ],
                                        },
                                    ]}
                                    width={120}
                                    height={120}
                                />
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="meal-plan-result__days">
                <h2>Your {result.days}-Day Meal Plan</h2>
                {result.plan.map((day) => (
                    <Accordion 
                        key={day.day} 
                        expanded={expandedDay === day.day} 
                        onChange={handleDayChange(day.day)}
                        className="meal-plan-result__day"
                    >
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            className="meal-plan-result__day__header"
                        >
                            <div className="meal-plan-result__day__header__content">
                                <div className="meal-plan-result__day__header__title">
                                    <h3>Day {day.day}</h3>
                                    <p>{day.estimatedTime} minutes total cooking time</p>
                                </div>
                                <div className="meal-plan-result__day__header__totals">
                                    <span>{day.totals.calories} kcal</span>
                                    <span>P: {day.totals.protein}g</span>
                                    <span>F: {day.totals.fat}g</span>
                                    <span>C: {day.totals.carbs}g</span>
                                </div>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails className="meal-plan-result__day__content">
                            <div className="meal-plan-result__day__meals">
                                {day.meals.map((meal, mealIndex) => (
                                    <div key={mealIndex} className="meal-plan-result__meal">
                                        <div className="meal-plan-result__meal__header">
                                            <h4>{meal.type}</h4>
                                            <div className="meal-plan-result__meal__info">
                                                <span>{meal.dish.estimatedTime} min</span>
                                                <span>{meal.dish.difficulty}</span>
                                                <span>{meal.dish.calories} kcal</span>
                                            </div>
                                        </div>
                                        <div className="meal-plan-result__meal__dish">
                                            <h5>{meal.dish.title}</h5>
                                            <p className="meal-plan-result__meal__dish__description">
                                                {meal.dish.description}
                                            </p>
                                            <div className="meal-plan-result__meal__dish__details">
                                                <div className="meal-plan-result__meal__dish__ingredients">
                                                    <h6>Ingredients:</h6>
                                                    <div className="ingredients-list">
                                                        {meal.dish.ingredients.map((ingredient, ingredientIndex) => (
                                                            <span key={ingredientIndex} className="ingredient-item">
                                                                {ingredient}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="meal-plan-result__meal__dish__instructions">
                                                    <h6>Instructions:</h6>
                                                    <ol>
                                                        {meal.dish.instructions.map((instruction, instructionIndex) => (
                                                            <li key={instructionIndex}>{instruction}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
        </div>
    );
}

export default MealPlanResult;
