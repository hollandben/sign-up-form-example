import React, { useState } from "react";
import { SignUpFormData } from "../entities/SignUpFormData";
import { PartialFormDataChange, Step } from "../entities/Step";

// TODO: Need to create the correct type for this
type StepperData = any;

const getDefaultFormValues = (steps: Step<any, any>[]): StepperData =>
  steps
    .filter((s) => s.defaultValues !== undefined)
    .reduce(
      (vals, s) => (s.key ? { ...vals, [s.key]: s.defaultValues } : vals),
      {}
    );

interface ConditionalStepperProps {
  steps: Step<any, any>[];
}

// TODO: This is currently covered by the E2E signup tests but could use some more granular testing
const ConditionalStepper: React.FC<ConditionalStepperProps> = ({ steps }) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [data, setData] = useState<StepperData>(getDefaultFormValues(steps));
  const activeStep = steps[activeStepIndex];
  const { key, Component } = activeStep;

  const nextStep = () => {
    if (activeStepIndex < steps.length - 1) {
      setActiveStepIndex(activeStepIndex + 1);
    }
  };

  const updateFormData = (changes: PartialFormDataChange<SignUpFormData>) => {
    if (!key) {
      console.error(
        "Trying to update stepperData without specifying a key for the current step"
      );
      return;
    }

    const newData = {
      ...data,
      [key]: {
        ...data[key],
        ...changes,
      },
    };

    setData(newData);
  };

  return (
    <div>
      <div>
        <ul>
          {steps.map((step) => (
            <li key={step.title}>{step.title}</li>
          ))}
        </ul>

        <div>
          <Component
            stepperData={data}
            onChange={updateFormData}
            onSubmit={nextStep}
          />
        </div>
      </div>
    </div>
  );
};

export default ConditionalStepper;
