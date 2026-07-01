"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { CookTimeline } from "@/components/recipes/cook-timeline";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Printer, Share2, Loader2, Flame } from "lucide-react";
import Link from "next/link";
import { GenerationResult, Recipe } from "@/types/recipe";
import { toast } from "sonner";

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proteinSlug = searchParams.get("protein");
  const methodSlug = searchParams.get("method");
  const flavorSlug = searchParams.get("flavor");
  const timeSlug = searchParams.get("time") || "standard";

  const [data, setData] = useState<GenerationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    async function generateRecipes() {
      if (!proteinSlug || !methodSlug || !flavorSlug) {
        setError("Missing selection parameters");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            proteinSlug,
            methodSlug,
            flavorSlug,
            timeSlug,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate recipes");
        }

        const result = await response.json();
        setData(result);
      } catch (err: any) {
        console.error("Generation error:", err);
        setError(err.message || "An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    generateRecipes();
  }, [proteinSlug, methodSlug, flavorSlug]);

  const handleSaveAll = async () => {
    if (!data || !data.recipes) return;
    
    setIsSaving(true);
    const recipesToSave = Object.values(data.recipes);
    let successCount = 0;

    for (const recipe of recipesToSave as any[]) {
      try {
        const response = await fetch("/api/recipes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipeTemplateId: recipe.id,
            protein: data.protein.name,
            cookingMethod: data.method.name,
            flavorProfile: data.flavor.name,
            recipeType: recipe.recipeType,
            title: recipe.title,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            cookTime: recipe.cookTime,
            targetTempF: recipe.targetTempF,
            woodPairings: recipe.woodPairings,
            sauceRecommendations: recipe.sauceRecommendations,
            sideRecommendations: recipe.sideRecommendations,
            cookingTips: recipe.cookingTips,
          }),
        });

        if (response.ok) {
          successCount++;
        } else if (response.status === 401) {
          // Redirect to auth if not logged in
          window.location.href = `/auth?callbackUrl=${encodeURIComponent(window.location.href)}`;
          return;
        }
      } catch (err) {
        console.error("Error saving recipe:", err);
      }
    }

    setSavedCount(successCount);
    setIsSaving(false);
    if (successCount > 0) {
      toast.success(`Successfully saved ${successCount} recipes to your book!`);
    }
  };

  const handleShareAll = async () => {
    const shareData = {
      title: 'BBQ Flavor Builder - Custom Trio',
      text: 'Check out these custom BBQ recipes!',
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-12">
        <div className="relative mb-8">
          <div className="h-24 w-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-10 w-10 text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Stoking the fire...</h2>
        <p className="text-muted-foreground animate-pulse">Our pitmasters are crafting your custom flavor trio.</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center container mx-auto px-4 py-12 text-center">
        <div className="bg-destructive/10 p-6 rounded-full mb-6">
          <ArrowLeft className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-8">{error || "Could not generate recipes at this time."}</p>
        <Button asChild>
          <Link href="/builder">Return to Builder</Link>
        </Button>
      </div>
    );
  }

  const { protein, method, flavor, recipes } = data;
  const recipeArray = Object.values(recipes) as Recipe[];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div className="text-center md:text-left">
          <Link href="/builder" className="text-primary text-sm font-medium flex items-center mb-2 hover:underline">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Builder
          </Link>
          <h1 className="text-3xl font-bold">Your Custom Flavor Trio</h1>
          <p className="text-muted-foreground capitalize">
            Generated for: <span className="font-semibold text-foreground">{protein.name} • {method.name} • {flavor.name} • {timeSlug.replace('-', ' ')} time</span>
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="sm" onClick={handleShareAll}>
            <Share2 className="mr-2 h-4 w-4" /> Share All
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Print All
          </Button>
          <Button size="sm" onClick={handleSaveAll} disabled={isSaving || savedCount > 0}>
            {isSaving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {savedCount > 0 ? `Saved ${savedCount} Recipes` : "Save All to My Book"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {recipeArray.map((recipe: Recipe, index: number) => (
          <div key={recipe.id} className="animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ animationDelay: `${index * 150}ms` }}>
            <RecipeCard 
              type={recipe.recipeType}
              title={recipe.title}
              description={recipe.title} // Fallback since description isn't in template yet
              prepTime={recipe.prepTime}
              cookTime={recipe.cookTime}
              restingTime={recipe.restingTime}
              temp={recipe.targetTempF}
              ingredients={recipe.ingredients}
              instructions={recipe.instructions}
            />
          </div>
        ))}
        {recipeArray.length === 0 && (
          <div className="col-span-3 py-20 text-center bg-card border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No matching recipe templates found for this combination.</p>
          </div>
        )}
      </div>

      <div className="mt-16 bg-card rounded-xl p-8 border-2">
        <CookTimeline recipes={recipeArray} />
      </div>

      <div className="mt-12 bg-card rounded-xl p-8 border-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-primary mb-3 flex items-center">
              <span className="bg-primary/10 p-2 rounded-lg mr-3">🪵</span> Wood Pairings
            </h3>
            <ul className="space-y-2 text-sm">
              {recipeArray[0]?.woodPairings?.map((wood: string) => (
                <li key={wood} className="flex justify-between"><span>{wood}</span></li>
              )) || (
                <>
                  <li className="flex justify-between"><span>Post Oak</span> <span className="text-muted-foreground italic">Texas Classic</span></li>
                  <li className="flex justify-between"><span>Hickory</span> <span className="text-muted-foreground italic">Bold & Traditional</span></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-primary mb-3 flex items-center">
              <span className="bg-primary/10 p-2 rounded-lg mr-3">🥗</span> Side Recommendations
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              {recipeArray[0]?.sideRecommendations?.map((side: string) => (
                <li key={side}>{side}</li>
              )) || (
                <>
                  <li>Jalapeño Cheddar Cornbread</li>
                  <li>Vinegar-Based Mustard Slaw</li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-primary mb-3 flex items-center">
              <span className="bg-primary/10 p-2 rounded-lg mr-3">🔥</span> Pitmaster Pro Tips
            </h3>
            <ul className="space-y-2 text-sm list-disc list-inside text-muted-foreground">
              {recipeArray[0]?.cookingTips?.map((tip: string) => (
                <li key={tip}>{tip}</li>
              )) || (
                <>
                  <li>Maintain a clean blue smoke; white smoke is bitter.</li>
                  <li>Rest for at least 2 hours in a cooler before slicing.</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
