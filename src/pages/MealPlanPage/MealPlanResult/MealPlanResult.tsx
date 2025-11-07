import './MealPlanResult.scss'
import {MealPlanResultType, SingleDishResultType} from "../../../types.ts";
import {useState, useRef} from "react";
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useAppStore} from "../../../store.ts";
import {Modal, Box, Button, CircularProgress, Skeleton} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {saveMealPlan, replaceDish, updateMealPlan} from "../../../DataService.ts";

type MealPlanResultProps = {
    result: MealPlanResultType & { id?: string };
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

type ReplacementPreview = {
    oldDish: SingleDishResultType;
    newDish: SingleDishResultType | null; // null when loading
    mealType: string;
    dayNumber: number;
    mealIndex: number;
    loading: boolean;
} | null;

function MealPlanResult({result: initialResult}: MealPlanResultProps) {
    const [result, setResult] = useState(initialResult);
    const [saved, setSaved] = useState(!!initialResult.id); // If result has ID, it's already saved
    const [hoveredDay, setHoveredDay] = useState<HoveredDay>(null);
    const [selectedDish, setSelectedDish] = useState<SelectedDish>(null);
    const [replacementPreview, setReplacementPreview] = useState<ReplacementPreview>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const hoverTimeoutRef = useRef<number | null>(null);
    const authData = useAppStore((state) => state.authData);

    async function handleSave() {
        if (authData && !result.id) {
            await saveMealPlan({...result, userId: authData.user.id});
            setSaved(true);
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

    const handleReplaceDish = async (dayNumber: number, mealIndex: number) => {
        const dayData = getDayData(dayNumber);
        if (!dayData) return;

        const meal = dayData.meals[mealIndex];
        if (!meal) return;

        // Immediately show modal with loading state
        setReplacementPreview({
            oldDish: meal.dish,
            newDish: null, // null indicates loading
            mealType: meal.type,
            dayNumber: dayNumber,
            mealIndex: mealIndex,
            loading: true
        });

        try {
            // Call API to get replacement dish
            const newDish = await replaceDish({
                mealType: meal.type,
                targetCalories: meal.dish.calories,
                targetProtein: meal.dish.macros.protein,
                targetFat: meal.dish.macros.fat,
                targetCarbs: meal.dish.macros.carbs,
                servings: result.servings,
                currentDishTitle: meal.dish.title,
                // Include any meal plan preferences if available
                difficulty: result.plan[0]?.meals[0]?.dish?.difficulty,
            });

            // Update modal with new dish
            setReplacementPreview(prev => prev ? {
                ...prev,
                newDish: newDish,
                loading: false
            } : null);

        } catch (error) {
            console.error('Failed to replace dish:', error);
            alert('Failed to replace dish. Please try again.');
            setReplacementPreview(null); // Close modal on error
        }
    };

    const handleAcceptReplacement = async () => {
        if (!replacementPreview || !replacementPreview.newDish) return;

        const { newDish, dayNumber, mealIndex } = replacementPreview;

        // Update the meal plan with the new dish
        const updatedResult = {
            ...result,
            plan: result.plan.map(day => {
                if (day.day !== dayNumber) return day;

                const newMeals = day.meals.map((m, idx) => {
                    if (idx !== mealIndex) return m;
                    return {
                        ...m,
                        dish: newDish
                    };
                });

                // Recalculate day totals
                const newTotals = newMeals.reduce((acc, m) => ({
                    calories: acc.calories + m.dish.calories,
                    protein: acc.protein + m.dish.macros.protein,
                    fat: acc.fat + m.dish.macros.fat,
                    carbs: acc.carbs + m.dish.macros.carbs,
                }), { calories: 0, protein: 0, fat: 0, carbs: 0 });

                // Recalculate estimated time
                const newEstimatedTime = newMeals.reduce((acc, m) => acc + m.dish.estimatedTime, 0);

                return {
                    ...day,
                    meals: newMeals,
                    totals: newTotals,
                    estimatedTime: newEstimatedTime,
                };
            })
        };

        // Update local state
        setResult(updatedResult);

        // If meal plan is saved (has ID), update in database
        if (result.id) {
            try {
                await updateMealPlan(result.id, updatedResult);
            } catch (error) {
                console.error('Failed to update meal plan in database:', error);
                alert('Dish replaced locally, but failed to save to database. Please try saving again.');
            }
        }

        // Close modal
        setReplacementPreview(null);
    };

    const handleCancelReplacement = () => {
        setReplacementPreview(null);
    };

    const handleTryAgain = async () => {
        if (!replacementPreview) return;

        const { oldDish, mealType } = replacementPreview;

        // Set loading state
        setReplacementPreview(prev => prev ? {
            ...prev,
            newDish: null,
            loading: true
        } : null);

        try {
            // Call API to get replacement dish
            const newDish = await replaceDish({
                mealType: mealType,
                targetCalories: oldDish.calories,
                targetProtein: oldDish.macros.protein,
                targetFat: oldDish.macros.fat,
                targetCarbs: oldDish.macros.carbs,
                servings: result.servings,
                currentDishTitle: oldDish.title,
                difficulty: result.plan[0]?.meals[0]?.dish?.difficulty,
            });

            // Update modal with new dish
            setReplacementPreview(prev => prev ? {
                ...prev,
                newDish: newDish,
                loading: false
            } : null);

        } catch (error) {
            console.error('Failed to replace dish:', error);
            alert('Failed to replace dish. Please try again.');
            setReplacementPreview(null); // Close modal on error
        }
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
                    <h4>{saved ? 'Saved' : 'Save plan'}</h4>
                    <IconButton 
                        color="primary" 
                        size="large" 
                        sx={{marginTop: '4px'}} 
                        onClick={handleSave}
                        disabled={saved}
                    >
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
                                            <div key={index} className="meal-plan-result__popup__dish-wrapper">
                                                <div
                                                    className="meal-plan-result__popup__dish"
                                                    onClick={() => handleDishClick(meal.dish, meal.type, dayData.day)}
                                                >
                                                    <RestaurantIcon fontSize="small" />
                                                    <div className="meal-plan-result__popup__dish__info">
                                                        <span className="meal-type">{meal.type}</span>
                                                        <span className="dish-title">{meal.dish.title}</span>
                                                    </div>
                                                </div>
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleReplaceDish(dayData.day, index);
                                                    }}
                                                    sx={{ 
                                                        color: '#757bc8',
                                                        '&:hover': { backgroundColor: 'rgba(117, 123, 200, 0.1)' }
                                                    }}
                                                    title="Replace this dish"
                                                >
                                                    <SwapHorizIcon fontSize="small" />
                                                </IconButton>
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
                                <div className="meal-plan-result__modal__header__actions">
                                    <Button
                                        variant="outlined"
                                        startIcon={<SwapHorizIcon />}
                                        onClick={() => {
                                            const dayData = getDayData(selectedDish.dayNumber);
                                            if (dayData) {
                                                const mealIndex = dayData.meals.findIndex(
                                                    m => m.dish.title === selectedDish.dish.title
                                                );
                                                if (mealIndex !== -1) {
                                                    handleReplaceDish(selectedDish.dayNumber, mealIndex);
                                                }
                                            }
                                        }}
                                        sx={{
                                            color: '#757bc8',
                                            borderColor: '#757bc8',
                                            '&:hover': {
                                                borderColor: '#6a70b8',
                                                backgroundColor: 'rgba(117, 123, 200, 0.05)'
                                            }
                                        }}
                                    >
                                        Replace Dish
                                    </Button>
                                    <IconButton
                                        onClick={handleCloseModal}
                                        className="meal-plan-result__modal__close"
                                        sx={{ color: 'rgba(0, 0, 0, 0.6)' }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </div>
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
                                <p className="meal-plan-result__modal__macros__note">
                                    Per serving (recipe makes {selectedDish.dish.servings} servings)
                                </p>
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

            {/* Replacement Preview Modal */}
            <Modal
                open={!!replacementPreview}
                onClose={handleCancelReplacement}
                aria-labelledby="replacement-modal-title"
            >
                <Box className="meal-plan-result__replacement-modal">
                    {replacementPreview && (
                        <>
                            <div className="meal-plan-result__replacement-modal__header">
                                <h2>Replace Dish</h2>
                                <p>Day {replacementPreview.dayNumber} • {replacementPreview.mealType}</p>
                                <IconButton
                                    onClick={handleCancelReplacement}
                                    sx={{ 
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '1rem',
                                        color: 'rgba(0, 0, 0, 0.6)' 
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </div>

                            <div className="meal-plan-result__replacement-modal__content">
                                {/* Old Dish */}
                                <div className="meal-plan-result__replacement-modal__dish">
                                    <div className="meal-plan-result__replacement-modal__dish__label">
                                        Current Dish
                                    </div>
                                    <h3>{replacementPreview.oldDish.title}</h3>
                                    <p className="cuisine">{replacementPreview.oldDish.cuisine} Cuisine</p>
                                    <p className="description">{replacementPreview.oldDish.description}</p>

                                    <div className="info-bar">
                                        <div className="info-item">
                                            <span className="label">Time</span>
                                            <span className="value">{replacementPreview.oldDish.estimatedTime} min</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Difficulty</span>
                                            <span className="value">{replacementPreview.oldDish.difficulty}</span>
                                        </div>
                                        <div className="info-item">
                                            <span className="label">Servings</span>
                                            <span className="value">{replacementPreview.oldDish.servings}</span>
                                        </div>
                                    </div>

                                    <div className="macros">
                                        <div className="macro">
                                            <span className="label">Calories</span>
                                            <span className="value">{replacementPreview.oldDish.calories} kcal</span>
                                        </div>
                                        <div className="macro">
                                            <span className="label">Protein</span>
                                            <span className="value">{replacementPreview.oldDish.macros.protein}g</span>
                                        </div>
                                        <div className="macro">
                                            <span className="label">Fat</span>
                                            <span className="value">{replacementPreview.oldDish.macros.fat}g</span>
                                        </div>
                                        <div className="macro">
                                            <span className="label">Carbs</span>
                                            <span className="value">{replacementPreview.oldDish.macros.carbs}g</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Replace Icon */}
                                <div className="meal-plan-result__replacement-modal__icon">
                                    <SwapHorizIcon sx={{ fontSize: '3rem', color: '#757bc8' }} />
                                </div>

                                {/* New Dish */}
                                <div className="meal-plan-result__replacement-modal__dish meal-plan-result__replacement-modal__dish--new">
                                    <div className="meal-plan-result__replacement-modal__dish__label meal-plan-result__replacement-modal__dish__label--new">
                                        New Suggestion
                                    </div>
                                    
                                    {replacementPreview.loading || !replacementPreview.newDish ? (
                                        // Loading state
                                        <div className="meal-plan-result__replacement-modal__dish__loading">
                                            <CircularProgress 
                                                size={60} 
                                                sx={{ 
                                                    color: '#757bc8',
                                                    margin: '2rem auto',
                                                    display: 'block'
                                                }} 
                                            />
                                            <p style={{ 
                                                textAlign: 'center', 
                                                color: '#757bc8',
                                                fontSize: '1.125rem',
                                                fontWeight: 600,
                                                margin: '1rem 0'
                                            }}>
                                                Generating a delicious alternative...
                                            </p>
                                            <Skeleton variant="text" height={40} />
                                            <Skeleton variant="text" height={30} width="60%" />
                                            <Skeleton variant="rectangular" height={80} sx={{ marginTop: '1rem', borderRadius: '0.75rem' }} />
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                                                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '0.5rem' }} />
                                                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '0.5rem' }} />
                                                <Skeleton variant="rectangular" height={60} sx={{ borderRadius: '0.5rem' }} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginTop: '1rem' }}>
                                                <Skeleton variant="rectangular" height={70} sx={{ borderRadius: '0.5rem' }} />
                                                <Skeleton variant="rectangular" height={70} sx={{ borderRadius: '0.5rem' }} />
                                                <Skeleton variant="rectangular" height={70} sx={{ borderRadius: '0.5rem' }} />
                                                <Skeleton variant="rectangular" height={70} sx={{ borderRadius: '0.5rem' }} />
                                            </div>
                                        </div>
                                    ) : (
                                        // Loaded dish content
                                        <>
                                            <h3>{replacementPreview.newDish.title}</h3>
                                            <p className="cuisine">{replacementPreview.newDish.cuisine} Cuisine</p>
                                            <p className="description">{replacementPreview.newDish.description}</p>

                                            <div className="info-bar">
                                                <div className="info-item">
                                                    <span className="label">Time</span>
                                                    <span className="value">{replacementPreview.newDish.estimatedTime} min</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">Difficulty</span>
                                                    <span className="value">{replacementPreview.newDish.difficulty}</span>
                                                </div>
                                                <div className="info-item">
                                                    <span className="label">Servings</span>
                                                    <span className="value">{replacementPreview.newDish.servings}</span>
                                                </div>
                                            </div>

                                            <div className="macros">
                                                <div className="macro">
                                                    <span className="label">Calories</span>
                                                    <span className="value">{replacementPreview.newDish.calories} kcal</span>
                                                </div>
                                                <div className="macro">
                                                    <span className="label">Protein</span>
                                                    <span className="value">{replacementPreview.newDish.macros.protein}g</span>
                                                </div>
                                                <div className="macro">
                                                    <span className="label">Fat</span>
                                                    <span className="value">{replacementPreview.newDish.macros.fat}g</span>
                                                </div>
                                                <div className="macro">
                                                    <span className="label">Carbs</span>
                                                    <span className="value">{replacementPreview.newDish.macros.carbs}g</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="meal-plan-result__replacement-modal__actions">
                                <Button
                                    variant="outlined"
                                    onClick={handleCancelReplacement}
                                    size="large"
                                    disabled={replacementPreview.loading}
                                    sx={{ 
                                        minWidth: '140px',
                                        color: 'rgba(0, 0, 0, 0.7)',
                                        borderColor: 'rgba(0, 0, 0, 0.3)',
                                        '&:hover': {
                                            borderColor: 'rgba(0, 0, 0, 0.5)',
                                            backgroundColor: 'rgba(0, 0, 0, 0.05)'
                                        }
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={replacementPreview.loading ? <CircularProgress size={18} sx={{ color: '#757bc8' }} /> : <SwapHorizIcon />}
                                    onClick={handleTryAgain}
                                    size="large"
                                    disabled={replacementPreview.loading}
                                    sx={{ 
                                        minWidth: '140px',
                                        color: '#757bc8',
                                        borderColor: '#757bc8',
                                        '&:hover': {
                                            borderColor: '#6a70b8',
                                            backgroundColor: 'rgba(117, 123, 200, 0.05)'
                                        }
                                    }}
                                >
                                    Try Again
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleAcceptReplacement}
                                    size="large"
                                    disabled={replacementPreview.loading || !replacementPreview.newDish}
                                    sx={{ 
                                        minWidth: '140px',
                                        background: 'linear-gradient(90deg, #757bc8 0%, #9fa3d4 100%)',
                                        '&:hover': {
                                            background: 'linear-gradient(90deg, #6a70b8 0%, #8e92c4 100%)',
                                        }
                                    }}
                                >
                                    Accept
                                </Button>
                            </div>
                        </>
                    )}
                </Box>
            </Modal>
        </div>
    );
}

export default MealPlanResult;
