import { Clock, CheckCircle2 } from "lucide-react";
import { Recipe } from "@/types/recipe";

interface CookTimelineProps {
  recipes: Recipe[];
}

export function CookTimeline({ recipes }: CookTimelineProps) {
  // We'll base the timeline on the longest process or a combination
  const marinade = recipes.find(r => r.recipeType === 'marinade');
  const brine = recipes.find(r => r.recipeType === 'brine');
  const rub = recipes.find(r => r.recipeType === 'dry_rub');
  const glaze = recipes.find(r => r.recipeType === 'glaze');
  const butter = recipes.find(r => r.recipeType === 'compound_butter');
  const sauce = recipes.find(r => r.recipeType === 'sauce');
  
  // Use the first recipe that has timing info for the main cook
  const mainRecipe = recipes[0];
  
  const timelineItems = [];

  if (brine) {
    timelineItems.push({
      time: brine.prepTime || "Sometime before",
      label: "Start Brining",
      description: `Submerge your protein in the ${brine.title.toLowerCase()} and refrigerate.`
    });
  }

  if (marinade) {
    timelineItems.push({
      time: marinade.prepTime || "2-4 hours before",
      label: "Start Marinade",
      description: `Coat your protein in the ${marinade.title.toLowerCase()} and let those flavors penetrate.`
    });
  }

  if (rub) {
    timelineItems.push({
      time: "30-60 min before",
      label: "Apply Dry Rub",
      description: `Pat dry and apply the ${rub.title.toLowerCase()} liberally for that perfect bark or crust.`
    });
  }

  timelineItems.push({
    time: "T-Minus 30 min",
    label: "Preheat & Prep",
    description: "Get your grill or smoker to the target temperature."
  });

  timelineItems.push({
    time: "T-0",
    label: "Start the Cook",
    description: `Place the protein on the heat. Estimated cook time: ${mainRecipe.cookTime || 'Varies'}.`
  });

  if (glaze) {
    timelineItems.push({
      time: "Last 10-15 min",
      label: "Apply Glaze",
      description: `Brush on the ${glaze.title.toLowerCase()} in layers for a tacky, caramelized finish.`
    });
  }

  if (mainRecipe.targetTempF) {
    timelineItems.push({
      time: "During Cook",
      label: "Monitor Temp",
      description: `Cook until internal temperature reaches ${mainRecipe.targetTempF}°F.`
    });
  }

  if (butter) {
    timelineItems.push({
      time: "Just Before Serving",
      label: "Top with Butter",
      description: `Add a slice of the ${butter.title.toLowerCase()} while the meat is hot.`
    });
  }

  if (mainRecipe.restingTime) {
    timelineItems.push({
      time: "After Cook",
      label: "The Rest",
      description: `Rest for ${mainRecipe.restingTime}. This is crucial for juiciness!`
    });
  }

  if (sauce) {
    timelineItems.push({
      time: "Serve",
      label: "Sauce it Up",
      description: `Serve with the ${sauce.title.toLowerCase()} on the side or drizzled over.`
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-bold">Your Game Plan</h3>
      </div>
      
      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-muted before:to-muted">
        {timelineItems.map((item, index) => (
          <div key={index} className="relative flex items-start group">
            <div className="absolute left-0 mt-1 flex items-center justify-center w-10 h-10 bg-background rounded-full border-2 border-primary text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="ml-14 pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded">
                  {item.time}
                </span>
                <h4 className="font-bold text-lg">{item.label}</h4>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
