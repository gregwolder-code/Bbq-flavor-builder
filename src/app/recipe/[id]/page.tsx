"use client";

import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Printer, Share2, Star, Clock, Flame, Utensils, MessageSquare, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  
  const [recipe, setRecipe] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    async function fetchRecipe() {
      if (!id) return;
      try {
        const response = await fetch(`/api/recipes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRecipe(data);
          setRating(data.rating || 0);
          setNotes(data.notes || "");
        }
      } catch (error) {
        console.error("Error fetching recipe:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipe();
  }, [id]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, notes }),
      });
      if (response.ok) {
        // Success toast or feedback
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this recipe?")) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        router.push("/recipes");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-center py-20">
        <Header />
        <h1 className="text-2xl font-bold">Recipe not found</h1>
        <Button asChild className="mt-4 mx-auto w-fit">
          <Link href="/recipes">Back to My Recipes</Link>
        </Button>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/recipes" className="text-primary text-sm font-medium flex items-center mb-6 hover:underline">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to My Recipes
      </Link>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 capitalize">
                {recipe.recipeType.replace('_', ' ')}
              </Badge>
              <Badge variant="outline">{recipe.protein}</Badge>
            </div>
            <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {recipe.cookTime || "N/A"}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="h-4 w-4" /> {recipe.targetTempF ? `${recipe.targetTempF}°F` : "Varies"}
              </div>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-4 w-4 ${s <= rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                  ))}
                </div>
                <span>({rating || 0}/5)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="icon" title="Print">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" title="Delete" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button className="flex-1 md:flex-none" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" /> Ingredients
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.ingredients.map((ing: string, i: number) => (
                  <li key={i} className="flex items-center gap-2 bg-muted/30 p-3 rounded-lg border text-sm">
                    <div className="h-1.5 w-1.5 bg-primary rounded-full" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Flame className="h-5 w-5 text-primary" /> Instructions
              </h2>
              <div className="space-y-4">
                {recipe.instructions.map((step: string, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-none w-8 h-8 bg-primary/10 text-primary font-bold flex items-center justify-center rounded-lg">
                      {i + 1}
                    </div>
                    <p className="pt-1 text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="bg-card rounded-xl border p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" /> My Notes & Rating
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium">Your Rating:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button key={s} onClick={() => setRating(s)}>
                        <Star className={`h-6 w-6 ${s <= rating ? 'text-primary fill-primary' : 'text-muted'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full min-h-[120px] p-4 rounded-lg bg-muted/50 border focus:ring-2 focus:ring-primary outline-none text-sm"
                  placeholder="Add your own notes here..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </section>
          </div>

          <div className="space-y-6">
            {recipe.woodPairings && recipe.woodPairings.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🪵 Wood Pairings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recipe.woodPairings.map((wood: string) => (
                      <Badge key={wood} variant="secondary">{wood}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {recipe.sideRecommendations && recipe.sideRecommendations.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    🥗 Recommended Sides
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    {recipe.sideRecommendations.map((side: string) => (
                      <li key={side} className="flex items-center gap-2 text-muted-foreground">
                        <div className="h-1 w-1 bg-muted-foreground rounded-full" />
                        {side}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {recipe.cookingTips && recipe.cookingTips.length > 0 && (
              <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-primary">
                    <Star className="h-5 w-5 fill-primary" /> Pitmaster Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm italic text-muted-foreground">
                    {recipe.cookingTips.map((tip: string, i: number) => (
                      <li key={i}>"{tip}"</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
    </div>
  );
}
