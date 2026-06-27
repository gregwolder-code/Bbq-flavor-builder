import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame, ArrowRight, Zap, Utensils, Trophy, Star } from "lucide-react";
export default function Home() {
  return (
    <>
      {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 md:py-32 border-b">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
                <Flame className="mr-2 h-4 w-4" />
                <span>Master the Grill with AI-Powered Recipes</span>
              </div>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl">
                Create Legendary <span className="text-primary">BBQ Flavors</span> in Seconds
              </h1>
              <p className="mb-10 text-lg text-muted-foreground sm:text-xl">
                No more guessing games. Choose your protein, cooking method, and flavor profile to get custom dry rubs, marinades, and brines perfectly paired for your cook.
              </p>
              <div className="flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-x-4 sm:space-y-0">
                <Link href="/builder">
                  <Button size="lg" className="h-12 px-8 text-base w-full sm:w-auto">
                    Start Building <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button size="lg" variant="outline" className="h-12 px-8 text-base w-full sm:w-auto">
                    Browse Flavors
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-primary py-12 text-primary-foreground">
          <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-1">10k+</div>
              <div className="text-sm opacity-80">Recipes Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">50+</div>
              <div className="text-sm opacity-80">Flavor Profiles</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">4.9/5</div>
              <div className="text-sm opacity-80">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-sm opacity-80">Juicier BBQ</div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 sm:text-4xl">Master the Art of BBQ Flavor</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our 3-step builder takes the guesswork out of seasoning, so you can focus on the fire.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 text-2xl font-bold font-mono">1</div>
              <h3 className="text-xl font-bold mb-3">Pick Your Protein</h3>
              <p className="text-muted-foreground">From brisket to veggies, tell us what's on the menu so we can balance the seasoning perfectly.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 text-2xl font-bold font-mono">2</div>
              <h3 className="text-xl font-bold mb-3">Choose Your Method</h3>
              <p className="text-muted-foreground">Are you smoking, grilling, or roasting? Temperature and time change how flavors interact with meat.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 text-2xl font-bold font-mono">3</div>
              <h3 className="text-xl font-bold mb-3">Select Flavor Profile</h3>
              <p className="text-muted-foreground">Sweet & Smoky? Carolina Tangy? Pick your vibe and we'll generate the perfect rub, marinade, and brine.</p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-muted/50 py-24 border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 sm:text-4xl text-primary">Beyond Just Recipes</h2>
                <p className="text-lg text-muted-foreground mb-8">We provide a complete flavor roadmap for every cook, ensuring you have the right wood, sides, and techniques.</p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-background p-2 rounded-lg border shadow-sm"><Flame className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold">Wood Pairings</h4>
                      <p className="text-sm text-muted-foreground">Automatically suggest the best wood chunks or pellets for your specific flavor profile.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-background p-2 rounded-lg border shadow-sm"><Trophy className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold">Competition Tips</h4>
                      <p className="text-sm text-muted-foreground">Get the "little secrets" that professional pitmasters use to get that perfect bark and bite.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 bg-background p-2 rounded-lg border shadow-sm"><Star className="h-5 w-5 text-primary" /></div>
                    <div>
                      <h4 className="font-bold">Pantry Mode</h4>
                      <p className="text-sm text-muted-foreground">Save your favorite recipes and generate shopping lists with one click.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative hidden lg:block">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl border-2 border-primary/10 flex items-center justify-center p-8 overflow-hidden">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background p-6 rounded-2xl border shadow-xl rotate-3 translate-y-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg mb-4" />
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted/60 rounded" />
                    </div>
                    <div className="bg-background p-6 rounded-2xl border shadow-xl -rotate-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg mb-4" />
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted/60 rounded" />
                    </div>
                    <div className="bg-background p-6 rounded-2xl border shadow-xl -rotate-6 -translate-y-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg mb-4" />
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted/60 rounded" />
                    </div>
                    <div className="bg-background p-6 rounded-2xl border shadow-xl rotate-6">
                      <div className="w-12 h-12 bg-green-100 rounded-lg mb-4" />
                      <div className="h-4 w-24 bg-muted rounded mb-2" />
                      <div className="h-3 w-16 bg-muted/60 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-primary rounded-3xl p-12 text-primary-foreground shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <h2 className="text-3xl font-bold mb-6 sm:text-4xl">Ready to Fire Up the Grill?</h2>
            <p className="text-lg opacity-90 mb-10">Start building your custom flavor profile now and elevate your next backyard BBQ.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/builder" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold w-full">
                  Get Started Free
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-10 text-lg font-bold bg-transparent text-white border-white hover:bg-white/10 w-full sm:w-auto">
                Sign In
              </Button>
            </div>
          </div>
        </section>
    </>
  );
}
