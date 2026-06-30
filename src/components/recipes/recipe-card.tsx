import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Printer, Share2 } from "lucide-react";

interface RecipeCardProps {
  type: 'dry_rub' | 'marinade' | 'brine' | 'glaze' | 'compound_butter' | 'sauce';
  title: string;
  description: string;
  prepTime?: string;
  cookTime?: string;
  restingTime?: string;
  temp?: number;
  ingredients: string[];
  instructions: string[];
}

export function RecipeCard({ type, title, description, prepTime, cookTime, restingTime, temp, ingredients, instructions }: RecipeCardProps) {
  const typeColors = {
    dry_rub: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100",
    marinade: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100",
    brine: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-100",
    glaze: "bg-amber-100 text-orange-900 border-amber-200 dark:bg-orange-950 dark:text-orange-200",
    compound_butter: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100",
    sauce: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-100",
  };

  const typeLabels = {
    dry_rub: "Dry Rub",
    marinade: "Marinade",
    brine: "Brine",
    glaze: "Glaze",
    compound_butter: "Compound Butter",
    sauce: "Sauce",
  };

  return (
    <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors bg-card">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={cn("capitalize font-semibold", typeColors[type])}>
            {typeLabels[type]}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm">
          {prepTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4 text-primary/70" />
              <span className="font-medium mr-1 text-foreground/80">Prep:</span> {prepTime}
            </div>
          )}
          {cookTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4 text-primary/70" />
              <span className="font-medium mr-1 text-foreground/80">Cook:</span> {cookTime}
            </div>
          )}
          {restingTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1.5 h-4 w-4 text-primary/70" />
              <span className="font-medium mr-1 text-foreground/80">Rest:</span> {restingTime}
            </div>
          )}
          {temp && (
            <div className="flex items-center text-muted-foreground">
              <Flame className="mr-1.5 h-4 w-4 text-primary/70" />
              <span className="font-medium mr-1 text-foreground/80">Goal:</span> {temp}°F
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-primary mb-2">Key Ingredients</h4>
            <ul className="grid grid-cols-1 gap-1">
              {ingredients.slice(0, 4).map((item, i) => (
                <li key={i} className="text-sm flex items-start">
                  <span className="text-primary mr-2 font-bold">•</span>
                  {item}
                </li>
              ))}
              {ingredients.length > 4 && (
                <li className="text-sm text-muted-foreground italic">+{ingredients.length - 4} more...</li>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-4 border-t">
        <Button className="w-full font-semibold">
          View Full Recipe
        </Button>
      </CardFooter>
    </Card>
  );
}
