import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CookingMethod {
  id: string;
  name: string;
  icon: string;
}

interface MethodSelectorProps {
  methods: CookingMethod[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function MethodSelector({ methods, selectedId, onSelect }: MethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {methods.map((method) => (
        <Card 
          key={method.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-105 active:scale-95 border-2",
            selectedId === method.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-transparent hover:border-primary/50"
          )}
          onClick={() => onSelect(method.id)}
        >
          <CardContent className="flex flex-col items-center justify-center p-4 text-center">
            <span className="text-3xl mb-2" role="img" aria-label={method.name}>
              {method.icon}
            </span>
            <h3 className={cn(
              "font-semibold text-base",
              selectedId === method.id ? "text-primary" : "text-foreground"
            )}>
              {method.name}
            </h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
