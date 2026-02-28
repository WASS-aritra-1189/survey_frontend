import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Smartphone,
  FileText,
  BarChart3,
  Edit,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DetailItem {
  label: string;
  value: string | number | React.ReactNode;
  icon?: React.ReactNode;
}

interface ViewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  status?: {
    label: string;
    variant: 'success' | 'warning' | 'danger' | 'neutral';
  };
  details: DetailItem[];
  onEdit?: () => void;
  children?: React.ReactNode;
}

export function ViewDetailsDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  status,
  details,
  onEdit,
  children,
}: ViewDetailsDialogProps) {
  const statusColors = {
    success: 'gradient-success',
    warning: 'bg-warning text-warning-foreground',
    danger: 'bg-destructive text-destructive-foreground',
    neutral: 'bg-muted text-muted-foreground',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            {status && (
              <Badge className={cn(statusColors[status.variant])}>
                {status.label}
              </Badge>
            )}
          </div>
        </DialogHeader>
        
        <Separator className="my-4" />
        
        <div className="space-y-4">
          {details.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              {item.icon && (
                <div className="text-muted-foreground mt-0.5">
                  {item.icon}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="font-medium">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        {children && (
          <>
            <Separator className="my-4" />
            {children}
          </>
        )}
        
        {onEdit && (
          <>
            <Separator className="my-4" />
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
              <Button onClick={onEdit}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Quick preview card for inline details
interface QuickPreviewProps {
  title: string;
  items: { label: string; value: string | number }[];
  className?: string;
}

export function QuickPreview({ title, items, className }: QuickPreviewProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-4", className)}>
      <h4 className="font-medium mb-3">{title}</h4>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, index) => (
          <div key={index}>
            <p className="text-xs text-muted-foreground">{item.label}</p>
            <p className="font-medium">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
