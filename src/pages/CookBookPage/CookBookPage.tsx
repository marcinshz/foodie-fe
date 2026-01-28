import './CookBookPage.scss';
import {Tab, Tabs} from "@mui/material";
import {useState} from "react";
import Recipes from "./Recipes/Recipes.tsx";
import MealPlans from "./MealPlans/MealPlans.tsx";
import ShoppingLists from "./ShoppingLists/ShoppingLists.tsx";

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <>{children}</>}
        </div>
    );
}

function CookBookPage() {
    const [value, setValue] = useState(0);

    const handleChange = (newValue: number) => {
        setValue(newValue);
    };

    return (
        <div className="cookbook-page container">
            <div className="cookbook-page__tabs">
                <Tabs value={value} onChange={(_, newValue: number) => handleChange(newValue)}
                      aria-label="basic tabs example">
                    <Tab label="Recipes"/>
                    <Tab label="Meal Plans"/>
                    <Tab label="Shopping Lists"/>
                </Tabs>
            </div>
            <CustomTabPanel value={value} index={0}>
                <Recipes/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <MealPlans/>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={2}>
                <ShoppingLists/>
            </CustomTabPanel>
        </div>
    );
}

export default CookBookPage;