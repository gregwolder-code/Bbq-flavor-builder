"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "@/components/builder/step-indicator";
import { ProteinCard } from "@/components/builder/protein-card";
import { MethodSelector } from "@/components/builder/method-selector";
import { FlavorSelector } from "@/components/builder/flavor-selector";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

interface SubProtein {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  proteins: SubProtein[];
}

interface CookingMethod {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

interface FlavorProfile {
  id: string;
  name: string;
  slug: string;
}

export default function BuilderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [methods, setMethods] = useState<CookingMethod[]>([]);
  const [flavors, setFlavors] = useState<FlavorProfile[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [proteinsRes, methodsRes, flavorsRes] = await Promise.all([
          fetch("/api/proteins/grouped"),
          fetch("/api/methods"),
          fetch("/api/flavors"),
        ]);

        const [proteinsData, methodsData, flavorsData] = await Promise.all([
          proteinsRes.json(),
          methodsRes.json(),
          flavorsRes.json(),
        ]);

        setCategories(proteinsData);
        setMethods(methodsData);
        setFlavors(flavorsData);
      } catch (error) {
        console.error("Error fetching builder data:", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    fetchData();
  }, []);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => {
    if (step === 1 && selectedCategory) {
      setSelectedCategory(null);
      setSelectedProtein(null);
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  };

  const handleGenerate = async () => {
    if (!selectedProtein || !selectedMethod || !selectedFlavor) return;
    
    setIsGenerating(true);
    router.push(`/results?protein=${selectedProtein}&method=${selectedMethod}&flavor=${selectedFlavor}`);
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading selection options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Build Your Flavor Profile</h1>
        <p className="text-muted-foreground">Follow the steps below to generate your custom BBQ recipes.</p>
      </div>

      <div className="mb-16">
        <StepIndicator currentStep={step} />
      </div>

      <div className="min-h-[400px]">
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!selectedCategory ? (
              <>
                <h2 className="text-2xl font-semibold text-center">Step 1: Pick Your Protein Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {categories.map((c) => (
                    <ProteinCard
                      key={c.id}
                      name={c.name}
                      icon={c.icon || "🍖"}
                      selected={selectedCategory !== null && (selectedCategory as Category).slug === c.slug}
                      onClick={() => {
                        setSelectedCategory(c);
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-center">Which {selectedCategory.name}?</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {selectedCategory.proteins.map((p) => (
                    <ProteinCard
                      key={p.id}
                      name={p.name}
                      icon={p.icon || "🥩"}
                      selected={selectedProtein === p.slug}
                      onClick={() => {
                        setSelectedProtein(p.slug);
                        setTimeout(nextStep, 300);
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={() => setSelectedCategory(null)} 
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-center">Step 2: How Are You Cooking?</h2>
            <MethodSelector
              methods={methods.map(m => ({ id: m.slug, name: m.name, icon: m.icon || "🔥" }))}
              selectedId={selectedMethod || undefined}
              onSelect={(slug) => {
                setSelectedMethod(slug);
                setTimeout(nextStep, 300);
              }}
            />
            <div className="flex justify-center pt-8">
              <button 
                onClick={prevStep} 
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Protein
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold text-center">Step 3: Pick Your Flavor</h2>
            <FlavorSelector
              flavors={flavors.map(f => ({ id: f.slug, name: f.name, slug: f.slug }))}
              selectedId={selectedFlavor || undefined}
              onSelect={setSelectedFlavor}
            />
            <div className="flex flex-col items-center gap-6 pt-12">
              <Button 
                size="lg" 
                className="h-14 px-12 text-lg font-bold w-full sm:w-auto"
                disabled={!selectedFlavor || isGenerating}
                onClick={handleGenerate}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Preparing Your Pit...
                  </>
                ) : (
                  <>
                    Generate My Recipes <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <button 
                onClick={prevStep} 
                className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors" 
                disabled={isGenerating}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
