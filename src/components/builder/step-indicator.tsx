import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  { id: 1, name: "Protein" },
  { id: 2, name: "Method" },
  { id: 3, name: "Flavor" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-center space-x-8 md:space-x-20">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative">
            {step.id < currentStep ? (
              <div className="group flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="absolute -bottom-6 text-xs font-medium text-primary whitespace-nowrap">
                  {step.name}
                </span>
              </div>
            ) : step.id === currentStep ? (
              <div className="flex flex-col items-center" aria-current="step">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background">
                  <span className="text-primary font-bold">{step.id}</span>
                </span>
                <span className="absolute -bottom-6 text-xs font-medium text-primary whitespace-nowrap">
                  {step.name}
                </span>
              </div>
            ) : (
              <div className="group flex flex-col items-center">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-muted-foreground/30 bg-background">
                  <span className="text-muted-foreground font-bold">{step.id}</span>
                </span>
                <span className="absolute -bottom-6 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {step.name}
                </span>
              </div>
            )}
            
            {stepIdx !== steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-full top-5 h-[2px] w-8 -translate-y-1/2 md:w-20",
                  step.id < currentStep ? "bg-primary" : "bg-muted-foreground/30"
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
