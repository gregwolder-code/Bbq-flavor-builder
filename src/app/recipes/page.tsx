"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecipeCard } from "@/components/recipes/recipe-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter, Loader2 } from "lucide-react";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await fetch("/api/recipes");
        if (response.ok) {
          const data = await response.json();
          setRecipes(data);
        }
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.protein.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Recipe Book</h1>
          <p className="text-muted-foreground">Keep track of your favorite flavor combinations.</p>
        </div>
        <Button asChild className="w-full md:w-auto">
          <Link href="/builder">
            <Plus className="mr-2 h-4 w-4" /> Create New
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            className="pl-10" 
            placeholder="Search your recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" /> Filter
        </Button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Opening your recipe book...</p>
        </div>
      ) : (
        <>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="all">All Recipes</TabsTrigger>
              <TabsTrigger value="dry_rub">Dry Rubs</TabsTrigger>
              <TabsTrigger value="marinade">Marinades</TabsTrigger>
              <TabsTrigger value="brine">Brines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    type={recipe.recipeType}
                    title={recipe.title}
                    description={`${recipe.protein} • ${recipe.cookingMethod}`}
                    cookTime={recipe.cookTime}
                    temp={recipe.targetTempF}
                    ingredients={recipe.ingredients}
                    instructions={recipe.instructions}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="dry_rub" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.filter(r => r.recipeType === 'dry_rub').map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    type={recipe.recipeType}
                    title={recipe.title}
                    description={`${recipe.protein} • ${recipe.cookingMethod}`}
                    ingredients={recipe.ingredients}
                    instructions={recipe.instructions}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="marinade" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.filter(r => r.recipeType === 'marinade').map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    type={recipe.recipeType}
                    title={recipe.title}
                    description={`${recipe.protein} • ${recipe.cookingMethod}`}
                    ingredients={recipe.ingredients}
                    instructions={recipe.instructions}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="brine" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.filter(r => r.recipeType === 'brine').map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    type={recipe.recipeType}
                    title={recipe.title}
                    description={`${recipe.protein} • ${recipe.cookingMethod}`}
                    ingredients={recipe.ingredients}
                    instructions={recipe.instructions}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredRecipes.length === 0 && (
            <div className="text-center py-24 bg-card rounded-xl border-2 border-dashed">
              <h3 className="text-xl font-bold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-6">Start by generating your first BBQ flavor trio or try a different search.</p>
              <Button asChild>
                <Link href="/builder">Launch Flavor Builder</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
