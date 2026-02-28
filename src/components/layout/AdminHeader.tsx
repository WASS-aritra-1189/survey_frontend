import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Settings, LogOut, HelpCircle, Mail, Calendar, Clock, ChevronRight, Check, X, AlertTriangle, Info, Shield, Activity, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useWebSocket } from "@/hooks/useWebSocket";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

const notifications = [
  {
    id: 1,
    type: "new",
    title: "New survey response",
    message: "Customer Satisfaction Survey received 15 new responses",
    time: "2 minutes ago",
    read: false,
    link: "/responses"
  },
  {
    id: 2,
    type: "alert",
    title: "Device offline",
    message: "Device #D-2451 has been offline for 2 hours",
    time: "1 hour ago",
    read: false,
    link: "/devices"
  },
  {
    id: 3,
    type: "success",
    title: "Survey completed",
    message: "Employee Engagement Survey reached 100% completion",
    time: "3 hours ago",
    read: false,
    link: "/surveys"
  },
  {
    id: 4,
    type: "warning",
    title: "Geo-fence breach",
    message: "User John Doe exited assigned zone in Downtown Area",
    time: "5 hours ago",
    read: true,
    link: "/geofencing"
  },
  {
    id: 5,
    type: "info",
    title: "System update",
    message: "New features available in Survey Builder",
    time: "1 day ago",
    read: true,
    link: "/surveys/builder"
  },
];

const searchSuggestions = [
  { type: "survey", name: "Customer Satisfaction Survey", link: "/surveys" },
  { type: "user", name: "John Doe", link: "/users" },
  { type: "device", name: "Field Device 1", link: "/devices" },
  { type: "report", name: "Monthly Analytics", link: "/reports" },
];

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isConnected, reconnect } = useWebSocket();
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@survey.com",
    phone: "+1 234 567 890",
    role: "Super Admin",
    department: "Administration",
    joinDate: "Jan 2024"
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  const filteredSuggestions = searchQuery 
    ? searchSuggestions.filter(s => 
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const markAsRead = (id: number) => {
    setNotificationList(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    setNotificationList(prev => prev.filter(n => n.id !== id));
    toast.success("Notification removed");
  };

  const handleNotificationClick = (notification: typeof notifications[0]) => {
    markAsRead(notification.id);
    navigate(notification.link);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "new": return <Mail className="h-4 w-4 text-primary" />;
      case "alert": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "success": return <Check className="h-4 w-4 text-success" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info": return <Info className="h-4 w-4 text-accent" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const handleProfileUpdate = () => {
    toast.success("Profile updated successfully!");
    setIsProfileOpen(false);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* WebSocket Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={reconnect}
              className={isConnected ? "text-success" : "text-destructive"}
            >
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {isConnected ? "Real-time sync connected" : "Click to reconnect"}
          </TooltipContent>
        </Tooltip>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Global Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search surveys, users, devices..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="w-80 pl-9"
          />
          
          {/* Search Suggestions Dropdown */}
          {showSearch && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-50">
              {filteredSuggestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    navigate(item.link);
                    setSearchQuery("");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted text-left transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <Badge variant="secondary" className="text-xs capitalize">
                    {item.type}
                  </Badge>
                  <span className="text-sm">{item.name}</span>
                  <ChevronRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <div className="flex items-center justify-between">
                <SheetTitle>Notifications</SheetTitle>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    <Check className="h-4 w-4 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
              <SheetDescription>
                You have {unreadCount} unread notifications
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-140px)] mt-4">
              <div className="space-y-2">
                {notificationList.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      notification.read 
                        ? 'bg-muted/30 border-border' 
                        : 'bg-primary/5 border-primary/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-muted p-2">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div 
                        className="flex-1 min-w-0"
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm truncate">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="h-2 w-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src="" />
                <AvatarFallback className="gradient-primary text-primary-foreground text-sm font-bold">
                  {profileData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{profileData.name}</p>
                <p className="text-xs text-muted-foreground">{profileData.role}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 py-2">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="gradient-primary text-primary-foreground font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{profileData.name}</p>
                  <p className="text-xs text-muted-foreground">{profileData.email}</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <User className="mr-2 h-4 w-4" />
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/logs')}>
              <Activity className="mr-2 h-4 w-4" />
              Activity Log
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/help')}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Help & Support
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => navigate('/login')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Admin Profile</DialogTitle>
            <DialogDescription>
              View and manage your profile information
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="profile" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-2xl font-bold">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{profileData.name}</h3>
                  <p className="text-sm text-muted-foreground">{profileData.role}</p>
                  <Badge className="mt-2 gradient-success">Active</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input 
                    value={profileData.name} 
                    onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input 
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Input 
                    value={profileData.department}
                    onChange={(e) => setProfileData({...profileData, department: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Member since {profileData.joinDate}</span>
              </div>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-4">
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Badge className="gradient-success">Enabled</Badge>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">2 devices currently logged in</p>
                  </div>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4 mt-4">
              <div className="space-y-3">
                {[
                  { action: "Logged in", time: "Just now", device: "Chrome on Windows" },
                  { action: "Updated survey settings", time: "2 hours ago", device: "Chrome on Windows" },
                  { action: "Created new user", time: "1 day ago", device: "Safari on Mac" },
                  { action: "Exported reports", time: "2 days ago", device: "Chrome on Windows" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.action}</p>
                      <p className="text-xs text-muted-foreground">{item.device}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProfileOpen(false)}>Cancel</Button>
            <Button onClick={handleProfileUpdate} className="gradient-primary">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
