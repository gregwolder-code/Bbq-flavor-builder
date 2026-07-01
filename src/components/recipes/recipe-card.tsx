"use client";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Flame, Printer, Share2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareData = {
      title: `BBQ Recipe: ${title}`,
      text: description,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } catch (err) {
        console.error("Error copying to clipboard:", err);
        toast.error("Failed to copy link");
      }
    }
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  return (
    <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-colors bg-card">
      <CardHeader>
        <div className="flex justify-between items-start mb-2">
          <Badge variant="outline" className={cn("capitalize font-semibold", typeColors[type])}>
            {typeLabels[type]}
          </Badge>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handlePrint}>
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
        <Dialog>
          <DialogTrigger
            render={
              <Button className="w-full font-semibold">
                View Full Recipe
              </Button>
            }
          />
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className={cn("capitalize font-semibold", typeColors[type])}>
                  {typeLabels[type]}
                </Badge>
              </div>
              <DialogTitle className="text-3xl font-bold text-foreground">{title}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-8 py-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                {prepTime && (
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Prep Time</span>
                    <div className="flex items-center font-semibold">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {prepTime}
                    </div>
                  </div>
                )}
                {cookTime && (
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Cook Time</span>
                    <div className="flex items-center font-semibold">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {cookTime}
                    </div>
                  </div>
                )}
                {restingTime && (
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Rest Time</span>
                    <div className="flex items-center font-semibold">
                      <Clock className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {restingTime}
                    </div>
                  </div>
                )}
                {temp && (
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Target Temp</span>
                    <div className="flex items-center font-semibold">
                      <Flame className="mr-1.5 h-3.5 w-3.5 text-primary" />
                      {temp}°F
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-2">
                  <h4 className="font-bold text-primary uppercase tracking-wider text-sm mb-4 flex items-center">
                    <span className="w-8 h-px bg-primary/30 mr-2"></span>
                    Ingredients
                  </h4>
                  <ul className="space-y-2.5">
                    {ingredients.map((item, i) => (
                      <li key={i} className="text-sm flex items-start group">
                        <span className="text-primary mr-2.5 font-bold mt-0.5">•</span>
                        <span className="group-hover:text-foreground transition-colors">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-3">
                  <h4 className="font-bold text-primary uppercase tracking-wider text-sm mb-4 flex items-center">
                    <span className="w-8 h-px bg-primary/30 mr-2"></span>
                    Instructions
                  </h4>
                  <ol className="space-y-5">
                    {instructions.map((step, i) => (
                      <li key={i} className="text-sm flex items-start group">
                        <span className="bg-primary text-primary-foreground font-bold h-6 w-6 rounded-lg flex items-center justify-center text-[10px] mr-3 shrink-0 shadow-sm">
                          {i + 1}
                        </span>
                        <span className="group-hover:text-foreground transition-colors leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
