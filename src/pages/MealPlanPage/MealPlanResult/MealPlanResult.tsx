import './MealPlanResult.scss'
import {MealPlanResultType, SingleDishResultType} from "../../../types.ts";
import {useState, useRef} from "react";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/Favorite';
import {useAppStore} from "../../../store.ts";
import {Modal, Box} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';

type MealPlanResultProps = {
    result: MealPlanResultType;
}

type HoveredDay = {
    day: number;
    position: { x: number; y: number };
} | null;

type SelectedDish = {
    dish: SingleDishResultType;
    mealType: string;
    dayNumber: number;
} | null;

function MealPlanResult({result}: MealPlanResultProps) {
    const [saved, setSaved] = useState(false);
    const [hoveredDay, setHoveredDay] = useState<HoveredDay>(null);
    const [selectedDish, setSelectedDish] = useState<SelectedDish>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const authData = useAppStore((state) => state.authData);

    async function handleSave() {
        if (authData) {
            // TODO: Implement save meal plan functionality
            setSaved(!saved);
        }
    }

    const handleDayHover = (dayNumber: number, event: React.MouseEvent<HTMLDivElement>) => {
        // Clear any pending timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        setHoveredDay({
            day: dayNumber,
            position: {
                x: rect.left + rect.width / 2,
                y: rect.top
            }
        });
    };

    const handleDayLeave = () => {
        // Add a small delay before hiding to allow mouse to reach popup
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredDay(null);
        }, 100);
    };

    const handlePopupEnter = () => {
        // Clear the timeout when mouse enters popup
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
    };

    const handlePopupLeave = () => {
        // Hide popup when mouse leaves it
        setHoveredDay(null);
    };

    const handleDishClick = (dish: SingleDishResultType, mealType: string, dayNumber: number) => {
        setSelectedDish({ dish, mealType, dayNumber });
    };

    const handleCloseModal = () => {
        setSelectedDish(null);
    };

    const getDayData = (dayNumber: number) => {
        return result.plan.find(day => day.day === dayNumber);
    };

    // Calculate grid columns based on number of days
    const gridColumns = result.days <= 7 ? result.days : 7;

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
                    <h4>Daily Targets</h4>
                    <div className="meal-plan-result__targets-section__grid">
                        {result.dailyTargets.calories && (
                            <div className="meal-plan-result__targets-section__card">
                                <span className="label">Calories</span>
                                <span className="value">{result.dailyTargets.calories} kcal</span>
                            </div>
                        )}
                        {result.dailyTargets.protein !== undefined && (
                            <div className="meal-plan-result__targets-section__card">
                                <span className="label">Protein</span>
                                <span className="value">{result.dailyTargets.protein}g</span>
                            </div>
                        )}
                        {result.dailyTargets.fat !== undefined && (
                            <div className="meal-plan-result__targets-section__card">
                                <span className="label">Fat</span>
                                <span className="value">{result.dailyTargets.fat}g</span>
                            </div>
                        )}
                        {result.dailyTargets.carbs !== undefined && (
                            <div className="meal-plan-result__targets-section__card">
                                <span className="label">Carbs</span>
                                <span className="value">{result.dailyTargets.carbs}g</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="meal-plan-result__calendar">
                <h2>Your {result.days}-Day Meal Plan</h2>
                <p className="meal-plan-result__calendar__instruction">
                    Hover over a day to see details, click on a dish to view the full recipe
                </p>
                <div 
                    className="meal-plan-result__calendar__grid"
                    style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}
                >
                    {result.plan.map((day) => (
                        <div
                            key={day.day}
                            className="meal-plan-result__calendar__day"
                            onMouseEnter={(e) => handleDayHover(day.day, e)}
                            onMouseLeave={handleDayLeave}
                        >
                            <div className="meal-plan-result__calendar__day__number">
                                Day {day.day}
                            </div>
                            <div className="meal-plan-result__calendar__day__preview">
                                <div className="meal-plan-result__calendar__day__calories">
                                    {day.totals.calories} kcal
                                </div>
                                <div className="meal-plan-result__calendar__day__meals-count">
                                    {day.meals.length} meals
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hover Popup */}
                {hoveredDay && (
                    <div
                        ref={popupRef}
                        className="meal-plan-result__popup"
                        style={{
                            left: `${hoveredDay.position.x}px`,
                            top: `${hoveredDay.position.y}px`,
                        }}
                        onMouseEnter={handlePopupEnter}
                        onMouseLeave={handlePopupLeave}
                    >
                        {(() => {
                            const dayData = getDayData(hoveredDay.day);
                            if (!dayData) return null;
                            
                            return (
                                <>
                                    <div className="meal-plan-result__popup__header">
                                        <h4>Day {dayData.day}</h4>
                                        <span className="meal-plan-result__popup__time">
                                            {dayData.estimatedTime} min total
                                        </span>
                                    </div>
                                    <div className="meal-plan-result__popup__macros">
                                        <div className="meal-plan-result__popup__macro">
                                            <span className="label">Calories</span>
                                            <span className="value">{dayData.totals.calories} kcal</span>
                                        </div>
                                        <div className="meal-plan-result__popup__macro">
                                            <span className="label">Protein</span>
                                            <span className="value">{dayData.totals.protein}g</span>
                                        </div>
                                        <div className="meal-plan-result__popup__macro">
                                            <span className="label">Fat</span>
                                            <span className="value">{dayData.totals.fat}g</span>
                                        </div>
                                        <div className="meal-plan-result__popup__macro">
                                            <span className="label">Carbs</span>
                                            <span className="value">{dayData.totals.carbs}g</span>
                                        </div>
                                    </div>
                                    <div className="meal-plan-result__popup__dishes">
                                        <h5>Meals:</h5>
                                        {dayData.meals.map((meal, index) => (
                                            <div
                                                key={index}
                                                className="meal-plan-result__popup__dish"
                                                onClick={() => handleDishClick(meal.dish, meal.type, dayData.day)}
                                            >
                                                <RestaurantIcon fontSize="small" />
                                                <div className="meal-plan-result__popup__dish__info">
                                                    <span className="meal-type">{meal.type}</span>
                                                    <span className="dish-title">{meal.dish.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}
            </div>

            {/* Dish Detail Modal */}
            <Modal
                open={!!selectedDish}
                onClose={handleCloseModal}
                aria-labelledby="dish-modal-title"
            >
                <Box className="meal-plan-result__modal">
                    {selectedDish && (
                        <>
                            <div className="meal-plan-result__modal__header">
                                <div className="meal-plan-result__modal__header__info">
                                    <span className="meal-plan-result__modal__day-label">
                                        Day {selectedDish.dayNumber} • {selectedDish.mealType}
                                    </span>
                                    <h2>{selectedDish.dish.title}</h2>
                                    <p className="meal-plan-result__modal__cuisine">
                                        {selectedDish.dish.cuisine} Cuisine
                                    </p>
                                </div>
                                <IconButton
                                    onClick={handleCloseModal}
                                    className="meal-plan-result__modal__close"
                                    sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <p className="meal-plan-result__modal__description">
                                {selectedDish.dish.description}
                            </p>

                            <div className="meal-plan-result__modal__info-bar">
                                <div className="meal-plan-result__modal__info-item">
                                    <span className="label">Time</span>
                                    <span className="value">{selectedDish.dish.estimatedTime} min</span>
                                </div>
                                <div className="meal-plan-result__modal__info-item">
                                    <span className="label">Difficulty</span>
                                    <span className="value">{selectedDish.dish.difficulty}</span>
                                </div>
                                <div className="meal-plan-result__modal__info-item">
                                    <span className="label">Servings</span>
                                    <span className="value">{selectedDish.dish.servings}</span>
                                </div>
                                <div className="meal-plan-result__modal__info-item">
                                    <span className="label">Calories</span>
                                    <span className="value">{selectedDish.dish.calories} kcal</span>
                                </div>
                            </div>

                            <div className="meal-plan-result__modal__macros">
                                <h4>Macronutrients</h4>
                                <div className="meal-plan-result__modal__macros__grid">
                                    <div className="meal-plan-result__modal__macro">
                                        <span className="label">Protein</span>
                                        <span className="value">{selectedDish.dish.macros.protein}g</span>
                                    </div>
                                    <div className="meal-plan-result__modal__macro">
                                        <span className="label">Fat</span>
                                        <span className="value">{selectedDish.dish.macros.fat}g</span>
                                    </div>
                                    <div className="meal-plan-result__modal__macro">
                                        <span className="label">Carbs</span>
                                        <span className="value">{selectedDish.dish.macros.carbs}g</span>
                                    </div>
                                </div>
                            </div>

                            <div className="meal-plan-result__modal__content">
                                <div className="meal-plan-result__modal__ingredients">
                                    <h4>Ingredients</h4>
                                    <div className="ingredients-list">
                                        {selectedDish.dish.ingredients.map((ingredient, index) => (
                                            <span key={index} className="ingredient-item">
                                                {ingredient}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="meal-plan-result__modal__instructions">
                                    <h4>Instructions</h4>
                                    <ol>
                                        {selectedDish.dish.instructions.map((instruction, index) => (
                                            <li key={index}>{instruction}</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default MealPlanResult;
