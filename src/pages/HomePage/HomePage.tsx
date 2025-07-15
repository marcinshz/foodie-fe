import homehero1 from "../../assets/img/homehero1.jpg";
import homehero2 from "../../assets/img/homehero2.jpg";
import homehero3 from "../../assets/img/homehero3.jpg";
import './HomePage.scss'
import FeatureCard from "./FeatureCard/FeatureCard.tsx";
function HomePage() {
    let name = "Claude";

    return (
        <div className="home-page container">
            <div className="home-page__hero">
                <div className="home-page__hero__images">
                    <div className="home-page__hero__images__item">
                        <img src={homehero1} alt="hero"/>
                    </div>
                    <div className="home-page__hero__images__item">
                        <img src={homehero2} alt="hero"/>
                    </div>
                    <div className="home-page__hero__images__item">
                        <img src={homehero3} alt="hero"/>
                    </div>
                </div>
                <div className="home-page__hero__content">
                    <h1 className="home-page__hero__content__header">Hungry?</h1>
                    <p className="home-page__hero__content__paragraph">Hey {name}! Welcome to your go-to for healthy, delicious meals tailored just for you. Our app simplifies eating well with personalized dish recommendations to suit your tastes and lifestyle. Enjoy balanced meals effortlessly and start your journey to healthier, happier eating today!</p>
                </div>
            </div>

            <div className="home-page__features">
                <h1 className="home-page__features__header">What do you need today?</h1>
                <div className="home-page__features__grid">
                    <FeatureCard header="Single dish" paragraph="Find the perfect recipe for any occasion! Explore a variety of dishes with clear instructions to suit your cravings." path="/home/single-dish" icon="restaurant"/>
                    <FeatureCard header="Meal plan" paragraph="Take the stress out of planning meals! Build weekly or monthly menus and get organized in no time." path="/home/meal-plan" icon="calendar_month"/>
                    <FeatureCard header="Random inspiration" paragraph="Stuck on what to cook? Let us surprise you! Discover a new recipe and spice up your culinary routine with exciting ideas." path="/home/inspiration" icon="lightbulb"/>
                </div>
            </div>
        </div>
    );
}

export default HomePage;