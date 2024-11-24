import './SingleDishPage.scss'
import {useState} from 'react'
import RequirementsForm from "../../components/RequirementsForm/RequirementsForm.tsx";
import {RequirementTypes} from "../../enums.ts";

enum SingleDishPageSteps {
    Requirements = 0,
    Result = 1,
    Summary = 2
}

function SingleDishPage() {
    const [step, setStep] = useState<SingleDishPageSteps>(SingleDishPageSteps.Requirements);
    const [requirements, setRequirements] = useState();

    return (
        <div className="single-dish-page container">
            {step === 0 && <RequirementsForm type={RequirementTypes.SingleDish}/>}
        </div>
    );
}

export default SingleDishPage;