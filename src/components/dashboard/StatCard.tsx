import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  gradient?: "primary" | "accent" | "success" | "warning";
  onClick?: () => void;
}

const gradientStyles = {
  primary: "from-primary/10 to-primary/5",
  accent: "from-accent/10 to-accent/5",
  success: "from-success/10 to-success/5",
  warning: "from-warning/10 to-warning/5",
};

const iconStyles = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  gradient = "primary",
  onClick,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card 
      variant="stat" 
      className={cn("p-6", onClick && "cursor-pointer hover:shadow-lg transition-shadow")}
      onClick={onClick}
    >
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", gradientStyles[gradient])} />
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
          </div>
          <div className={cn("rounded-xl p-3", iconStyles[gradient])}>
            {icon}
          </div>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1 text-sm font-medium",
                isPositive && "text-success",
                isNegative && "text-destructive",
                !isPositive && !isNegative && "text-muted-foreground"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : isNegative ? (
                <TrendingDown className="h-4 w-4" />
              ) : null}
              {Math.abs(change)}%
            </span>
            <span className="text-sm text-muted-foreground">
              {changeLabel || "from last month"}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
