import './MealPlans.scss';
import {useAppStore} from "../../../store.ts";
import {deleteMealPlan, getUserMealPlans} from "../../../DataService.ts";
import {useEffect, useState} from "react";
import {MealPlanResultType} from "../../../types.ts";
import {Link} from "react-router-dom";
import {IconButton} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

function MealPlanCard({mealPlan, fetchMealPlans}: {
    mealPlan: MealPlanResultType & { id: string },
    fetchMealPlans: () => void
}) {

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        await deleteMealPlan(mealPlan.id);
        fetchMealPlans();
    }

    // Calculate total daily calories (average)
    const avgDailyCalories = mealPlan.dailyTargets?.calories || 
        Math.round(mealPlan.plan.reduce((sum, day) => sum + day.totals.calories, 0) / mealPlan.days);

    return (
        <Link to={`/home/meal-plan/${mealPlan.id}`} className="meal-plan-card">
            <div className="meal-plan-card__header">
                <h3 className="meal-plan-card__title">{mealPlan.title}</h3>
                <div className="meal-plan-card__header-actions">
                    <span className="meal-plan-card__days-badge">
                        {mealPlan.days} {mealPlan.days === 1 ? 'Day' : 'Days'}
                    </span>
                    <IconButton 
                        aria-label="delete" 
                        color="error"
                        onClick={handleDelete}
                        className="meal-plan-card__delete"
                    >
                        <DeleteIcon/>
                    </IconButton>
                </div>
            </div>
            
            <p className="meal-plan-card__description">{mealPlan.description}</p>
            
            <div className="meal-plan-card__info">
                <div className="meal-plan-card__info-item">
                    <CalendarMonthIcon fontSize="small" />
                    <span>{mealPlan.days} days</span>
                </div>
                <div className="meal-plan-card__info-item">
                    <RestaurantMenuIcon fontSize="small" />
                    <span>{mealPlan.mealsPerDay} meals/day</span>
                </div>
                <div className="meal-plan-card__info-item">
                    <LocalFireDepartmentIcon fontSize="small" />
                    <span>~{avgDailyCalories} kcal/day</span>
                </div>
            </div>

            {mealPlan.dailyTargets && (
                <div className="meal-plan-card__targets">
                    <span className="meal-plan-card__targets__title">
                        Daily Targets
                    </span>
                    {mealPlan.dailyTargets.protein !== undefined && (
                        <div className="meal-plan-card__target">
                            <span className="label">Protein</span>
                            <span className="value">{mealPlan.dailyTargets.protein}g</span>
                        </div>
                    )}
                    {mealPlan.dailyTargets.fat !== undefined && (
                        <div className="meal-plan-card__target">
                            <span className="label">Fat</span>
                            <span className="value">{mealPlan.dailyTargets.fat}g</span>
                        </div>
                    )}
                    {mealPlan.dailyTargets.carbs !== undefined && (
                        <div className="meal-plan-card__target">
                            <span className="label">Carbs</span>
                            <span className="value">{mealPlan.dailyTargets.carbs}g</span>
                        </div>
                    )}
                </div>
            )}
        </Link>
    )
}

function MealPlans() {
    const {authData} = useAppStore((state) => state);
    const [mealPlans, setMealPlans] = useState<(MealPlanResultType & { id: string })[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMealPlans = async () => {
        if (!authData) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            setError(null);
            const mealPlansFetched = await getUserMealPlans(authData.user.id);
            if (Array.isArray(mealPlansFetched)) {
                setMealPlans(mealPlansFetched);
            } else {
                setMealPlans([]);
            }
        } catch (err) {
            console.error('Error fetching meal plans:', err);
            setError('Failed to load meal plans');
            setMealPlans([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchMealPlans();
    }, []);

    if (loading) {
        return (
            <div className="meal-plans-section">
                <div className="meal-plans-section__empty">
                    <p>Loading meal plans...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="meal-plans-section">
                <div className="meal-plans-section__empty">
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="meal-plans-section">
            <div className="meal-plans-section__header">
                <h2>Your Meal Plans</h2>
                <p>All your saved meal plans in one place</p>
            </div>
            {mealPlans.length === 0 ? (
                <div className="meal-plans-section__empty">
                    <CalendarMonthIcon sx={{ fontSize: 80, color: 'rgba(117, 123, 200, 0.3)' }} />
                    <h3>No meal plans saved yet</h3>
                    <p>Create a meal plan to see it here!</p>
                </div>
            ) : (
                <div className="meal-plans-section__grid">
                    {mealPlans.map((mealPlan) => (
                        <MealPlanCard mealPlan={mealPlan} key={mealPlan.id} fetchMealPlans={fetchMealPlans}/>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MealPlans;

