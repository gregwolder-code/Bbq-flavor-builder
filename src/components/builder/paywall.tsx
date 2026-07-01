"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Zap, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PaywallProps {
  onUnlock: () => void;
}

export function Paywall({ onUnlock }: PaywallProps) {
  const router = useRouter();
  const stripeLink = "https://buy.stripe.com/cNidRb8a95Lg4kx7Og8Ra00";

  const handleAlreadyPurchased = () => {
    onUnlock();
    toast.success("Unlocked! You now have unlimited access.");
    router.replace("/builder");
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
      <Card className="w-full max-w-md border-primary/20 shadow-xl overflow-hidden">
        <div className="bg-primary/10 py-6 flex justify-center">
          <div className="bg-primary p-3 rounded-full">
            <Lock className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">You've used your 3 free recipes!</CardTitle>
          <CardDescription className="text-base mt-2 text-foreground">
            Unlock unlimited recipe generations, full recipe details, and save your recipe book.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Unlimited custom BBQ recipes</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Full instructions & "Game Plans"</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>Save recipes to your personal book</span>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg text-center mt-6">
            <div className="text-3xl font-bold text-primary">$7.99</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">One-time payment • Lifetime access</div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-3">
          <Button asChild className="w-full h-12 text-lg font-bold" size="lg">
            <a href={stripeLink} target="_blank" rel="noopener noreferrer">
              Unlock Now <Zap className="ml-2 h-5 w-5 fill-current" />
            </a>
          </Button>
          
          <Button variant="ghost" onClick={handleAlreadyPurchased} className="w-full text-muted-foreground">
            I've already purchased
          </Button>
        </CardFooter>
      </Card>
      
      <p className="mt-6 text-sm text-muted-foreground text-center max-w-xs italic">
        Support independent BBQ developers! 🍖
      </p>
    </div>
  );
}
