import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface FlavorProfile {
  id: string;
  name: string;
  slug: string;
}

interface FlavorSelectorProps {
  flavors: FlavorProfile[];
  selectedId?: string;
  onSelect: (id: string) => void;
}

export function FlavorSelector({ flavors, selectedId, onSelect }: FlavorSelectorProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {flavors.map((flavor) => (
        <Badge
          key={flavor.id}
          variant={selectedId === flavor.id ? "default" : "outline"}
          className={cn(
            "px-4 py-2 text-sm cursor-pointer transition-all hover:scale-105 active:scale-95",
            selectedId === flavor.id 
              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
              : "hover:border-primary/50 hover:bg-primary/5"
          )}
          onClick={() => onSelect(flavor.id)}
        >
          {flavor.name}
        </Badge>
      ))}
    </div>
  );
}
