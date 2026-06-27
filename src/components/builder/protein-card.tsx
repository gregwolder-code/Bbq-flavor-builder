import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProteinCardProps {
  name: string;
  icon: string;
  selected?: boolean;
  onClick?: () => void;
}

export function ProteinCard({ name, icon, selected, onClick }: ProteinCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:scale-105 active:scale-95 border-2",
        selected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-transparent hover:border-primary/50"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center p-6 text-center">
        <span className="text-4xl mb-4" role="img" aria-label={name}>
          {icon}
        </span>
        <h3 className={cn(
          "font-bold text-lg",
          selected ? "text-primary" : "text-foreground"
        )}>
          {name}
        </h3>
      </CardContent>
    </Card>
  );
}
