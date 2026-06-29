import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface TimeOption {
  id: string;
  name: string;
  description: string;
}

interface TimeSelectorProps {
  options: TimeOption[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function TimeSelector({ options, selectedId, onSelect }: TimeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => (
        <Card 
          key={option.id}
          className={cn(
            "cursor-pointer transition-all hover:scale-[1.02] active:scale-95 border-2",
            selectedId === option.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-transparent hover:border-primary/50"
          )}
          onClick={() => onSelect(option.id)}
        >
          <CardContent className="flex items-center p-6 gap-4">
            <div className={cn(
              "p-3 rounded-full",
              selectedId === option.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <h3 className={cn(
                "font-bold text-lg",
                selectedId === option.id ? "text-primary" : "text-foreground"
              )}>
                {option.name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
