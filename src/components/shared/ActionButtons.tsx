import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  MoreHorizontal, Eye, Edit, Trash2, Copy, UserPlus, 
  FileText, Download, Share2, Archive, RotateCcw, Send,
  CheckCircle, XCircle, Pause, Play
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
  entityType: "user" | "survey" | "device" | "staff" | "response";
  entityId: string;
  entityName: string;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onAssign?: () => void;
  onExport?: () => void;
  onShare?: () => void;
  onArchive?: () => void;
  onRestore?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onSendReminder?: () => void;
  status?: string;
  className?: string;
  variant?: "dropdown" | "inline";
}

export function ActionButtons({
  entityType,
  entityId,
  entityName,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onAssign,
  onExport,
  onShare,
  onArchive,
  onRestore,
  onActivate,
  onDeactivate,
  onPause,
  onResume,
  onSendReminder,
  status,
  className,
  variant = "dropdown",
}: ActionButtonsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setDeleteDialogOpen(false);
    toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} deleted successfully`);
  };

  const handleDuplicate = () => {
    if (onDuplicate) {
      onDuplicate();
    }
    toast.success(`${entityType.charAt(0).toUpperCase() + entityType.slice(1)} duplicated successfully`);
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
    toast.success(`Exporting ${entityName}...`);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    }
    toast.success("Share link copied to clipboard");
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive();
    }
    toast.success(`${entityName} archived successfully`);
  };

  const handleActivate = () => {
    if (onActivate) {
      onActivate();
    }
    toast.success(`${entityName} activated successfully`);
  };

  const handleDeactivate = () => {
    if (onDeactivate) {
      onDeactivate();
    }
    toast.success(`${entityName} deactivated successfully`);
  };

  const handleSendReminder = () => {
    if (onSendReminder) {
      onSendReminder();
    }
    toast.success(`Reminder sent for ${entityName}`);
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {onView && (
          <Button variant="ghost" size="icon" onClick={onView} className="h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button variant="ghost" size="icon" onClick={onEdit} className="h-8 w-8">
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onAssign && (
          <Button variant="ghost" size="icon" onClick={() => setAssignDialogOpen(true)} className="h-8 w-8">
            <UserPlus className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button variant="ghost" size="icon" onClick={() => setDeleteDialogOpen(true)} className="h-8 w-8 text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{entityName}"? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className={cn("h-8 w-8", className)}>
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onView && (
            <DropdownMenuItem onClick={onView}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
          )}
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          {onDuplicate && (
            <DropdownMenuItem onClick={handleDuplicate}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
          )}
          
          {(onView || onEdit || onDuplicate) && (onAssign || onExport || onShare) && (
            <DropdownMenuSeparator />
          )}
          
          {onAssign && (
            <DropdownMenuItem onClick={() => setAssignDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Assign
            </DropdownMenuItem>
          )}
          {onExport && (
            <DropdownMenuItem onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </DropdownMenuItem>
          )}
          {onShare && (
            <DropdownMenuItem onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </DropdownMenuItem>
          )}
          {onSendReminder && (
            <DropdownMenuItem onClick={handleSendReminder}>
              <Send className="mr-2 h-4 w-4" />
              Send Reminder
            </DropdownMenuItem>
          )}
          
          {(onActivate || onDeactivate || onPause || onResume) && (
            <>
              <DropdownMenuSeparator />
              {status === "inactive" && onActivate && (
                <DropdownMenuItem onClick={handleActivate}>
                  <CheckCircle className="mr-2 h-4 w-4 text-success" />
                  Activate
                </DropdownMenuItem>
              )}
              {status === "active" && onDeactivate && (
                <DropdownMenuItem onClick={handleDeactivate}>
                  <XCircle className="mr-2 h-4 w-4 text-warning" />
                  Deactivate
                </DropdownMenuItem>
              )}
              {status === "active" && onPause && (
                <DropdownMenuItem onClick={onPause}>
                  <Pause className="mr-2 h-4 w-4" />
                  Pause
                </DropdownMenuItem>
              )}
              {status === "paused" && onResume && (
                <DropdownMenuItem onClick={onResume}>
                  <Play className="mr-2 h-4 w-4" />
                  Resume
                </DropdownMenuItem>
              )}
            </>
          )}
          
          {(onArchive || onRestore) && (
            <>
              <DropdownMenuSeparator />
              {onArchive && (
                <DropdownMenuItem onClick={handleArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </DropdownMenuItem>
              )}
              {onRestore && (
                <DropdownMenuItem onClick={onRestore}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Restore
                </DropdownMenuItem>
              )}
            </>
          )}
          
          {onDelete && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{entityName}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign {entityType.charAt(0).toUpperCase() + entityType.slice(1)}</DialogTitle>
            <DialogDescription>
              Assign "{entityName}" to users or teams.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Assignment functionality will be implemented based on your requirements.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (onAssign) onAssign();
              setAssignDialogOpen(false);
              toast.success("Assignment updated successfully");
            }}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
