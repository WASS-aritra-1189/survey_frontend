import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  MapPin, 
  Circle,
  Edit,
  Trash2,
  Eye,
  AlertTriangle,
  Smartphone,
  Navigation,
  ZoomIn,
  ZoomOut,
  Layers,
  RefreshCw,
  Target,
  Signal,
  Activity,
  Clock,
  ChevronRight,
  Settings,
  Bell,
  Map,
  Crosshair,
  Radio
} from "lucide-react";
import { toast } from "sonner";
import { geoFences, devices } from "@/data/dummyData";
import { cn } from "@/lib/utils";
import { GPSMap } from "@/components/maps/GPSMap";

// Map markers from devices
const deviceMarkers = devices.map(device => ({
  id: device.id,
  lat: device.coordinates.lat,
  lng: device.coordinates.lng,
  label: device.name,
  type: 'device' as const,
  status: device.status === 'online' ? 'online' as const : 'offline' as const,
  info: `${device.assignedUser} • ${device.location}`,
}));

// GeoFence circles for map
const geoFenceCircles = geoFences.map(fence => ({
  id: fence.id,
  lat: fence.center.lat,
  lng: fence.center.lng,
  radius: fence.radius,
  name: fence.name,
  status: fence.status,
}));

// Recent alerts
const recentAlerts = [
  { id: 1, type: "exit", device: "D-7892", zone: "Downtown Survey Area", time: "5 min ago", user: "John Doe" },
  { id: 2, type: "enter", device: "D-7895", zone: "Mall Region A", time: "12 min ago", user: "Emily Davis" },
  { id: 3, type: "exit", device: "D-7897", zone: "University Campus", time: "25 min ago", user: "Amanda Foster" },
  { id: 4, type: "low_battery", device: "D-7893", zone: "N/A", time: "1 hour ago", user: "Sarah Wilson" },
];

export default function GeoFencing() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<typeof geoFences[0] | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [mapZoom, setMapZoom] = useState(4);
  const [isTracking, setIsTracking] = useState(true);
  const [newZone, setNewZone] = useState({
    name: "",
    lat: "",
    lng: "",
    radius: 500,
    alertOnExit: true,
    alertOnEntry: true,
    color: "#0EA5E9",
  });

  const handleCreate = () => {
    if (!newZone.name || !newZone.lat || !newZone.lng) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("Geo-fence zone created successfully!");
    setIsDialogOpen(false);
    setNewZone({
      name: "",
      lat: "",
      lng: "",
      radius: 500,
      alertOnExit: true,
      alertOnEntry: true,
      color: "#0EA5E9",
    });
  };

  const handleViewZone = (zone: typeof geoFences[0]) => {
    setSelectedZone(zone);
    setIsViewDialogOpen(true);
  };

  const handleDeleteZone = (zoneId: string) => {
    toast.success("Geo-fence zone deleted");
  };

  const handleRefreshTracking = () => {
    toast.success("Device locations refreshed");
  };

  // Stats
  const stats = {
    totalZones: geoFences.length,
    activeZones: geoFences.filter(z => z.status === 'active').length,
    devicesTracked: devices.filter(d => d.status === 'online').length,
    todayAlerts: 12,
  };

  return (
    <AdminLayout title="Geo-Fencing & GPS Tracking" subtitle="Real-time device tracking and location boundaries">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalZones}</p>
              <p className="text-sm text-muted-foreground">Total Zones</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3">
              <Circle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.activeZones}</p>
              <p className="text-sm text-muted-foreground">Active Zones</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent p-3">
              <Smartphone className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.devicesTracked}</p>
              <p className="text-sm text-muted-foreground">Devices Online</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-warning/10 p-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.todayAlerts}</p>
              <p className="text-sm text-muted-foreground">Today's Alerts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interactive Map */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5" />
                Live GPS Tracking Map
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 mr-4">
                  <Switch
                    checked={isTracking}
                    onCheckedChange={setIsTracking}
                  />
                  <Label className="text-sm">Live Tracking</Label>
                </div>
                <Button variant="outline" size="icon" onClick={handleRefreshTracking}>
                  <RefreshCw className={cn("h-4 w-4", isTracking && "animate-spin")} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-xl overflow-hidden border">
              <GPSMap 
                markers={deviceMarkers}
                geoFences={geoFenceCircles}
                zoom={mapZoom}
                showControls={true}
                interactive={true}
                onMarkerClick={(marker) => {
                  toast.info(`Device: ${marker.label}`, {
                    description: marker.info,
                  });
                }}
                onGeoFenceClick={(fence) => {
                  const fullFence = geoFences.find(f => f.id === fence.id);
                  if (fullFence) handleViewZone(fullFence);
                }}
              />
            </div>

            {/* Map Legend & Controls */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm">Online ({devices.filter(d => d.status === 'online').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-muted" />
                  <span className="text-sm">Offline ({devices.filter(d => d.status === 'offline').length})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
                  <span className="text-sm">Geo-fence Zone</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Crosshair className="h-4 w-4 mr-1" />
                  Center Map
                </Button>
                <Button variant="outline" size="sm">
                  <Layers className="h-4 w-4 mr-1" />
                  Layers
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Recent Alerts
                </CardTitle>
                <Badge variant="secondary">{recentAlerts.length} new</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div 
                    key={alert.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className={cn(
                      "rounded-full p-1.5",
                      alert.type === 'exit' && "bg-warning/10 text-warning",
                      alert.type === 'enter' && "bg-success/10 text-success",
                      alert.type === 'low_battery' && "bg-destructive/10 text-destructive"
                    )}>
                      {alert.type === 'exit' && <AlertTriangle className="h-3 w-3" />}
                      {alert.type === 'enter' && <Navigation className="h-3 w-3" />}
                      {alert.type === 'low_battery' && <Activity className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">
                        {alert.type === 'exit' && "Zone Exit"}
                        {alert.type === 'enter' && "Zone Entry"}
                        {alert.type === 'low_battery' && "Low Battery"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {alert.user} • {alert.zone}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-3">
                View All Alerts
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Active Devices */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  Active Devices
                </CardTitle>
                <Badge className="bg-success/10 text-success">{devices.filter(d => d.status === 'online').length} online</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {devices.filter(d => d.status === 'online').slice(0, 5).map((device) => (
                  <div 
                    key={device.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center">
                        <Smartphone className="h-4 w-4 text-success" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-success border-2 border-background" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{device.assignedUser}</p>
                      <p className="text-xs text-muted-foreground">{device.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-medium">{device.battery}%</p>
                      <p className="text-xs text-muted-foreground">{device.lastSeen}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Geo-Fence Zones List */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Geo-Fence Zones Management
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Zone
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Geo-Fence Zone</DialogTitle>
                  <DialogDescription>
                    Define a new survey boundary zone with GPS coordinates
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="zone-name">Zone Name *</Label>
                    <Input 
                      id="zone-name" 
                      placeholder="Enter zone name" 
                      value={newZone.name}
                      onChange={(e) => setNewZone(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lat">Latitude *</Label>
                      <Input 
                        id="lat" 
                        placeholder="e.g., 40.7128" 
                        value={newZone.lat}
                        onChange={(e) => setNewZone(prev => ({ ...prev, lat: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lng">Longitude *</Label>
                      <Input 
                        id="lng" 
                        placeholder="e.g., -74.0060"
                        value={newZone.lng}
                        onChange={(e) => setNewZone(prev => ({ ...prev, lng: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Radius: {newZone.radius}m</Label>
                    <Slider
                      value={[newZone.radius]}
                      onValueChange={(value) => setNewZone(prev => ({ ...prev, radius: value[0] }))}
                      max={2000}
                      min={50}
                      step={50}
                      className="py-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>50m</span>
                      <span>2000m</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Zone Color</Label>
                    <div className="flex gap-2">
                      {["#0EA5E9", "#14B8A6", "#F59E0B", "#8B5CF6", "#EC4899", "#EF4444"].map(color => (
                        <button
                          key={color}
                          className={cn(
                            "h-8 w-8 rounded-full transition-all",
                            newZone.color === color && "ring-2 ring-offset-2 ring-primary"
                          )}
                          style={{ backgroundColor: color }}
                          onClick={() => setNewZone(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alert on Zone Exit</Label>
                        <p className="text-xs text-muted-foreground">
                          Notify when device leaves zone
                        </p>
                      </div>
                      <Switch 
                        checked={newZone.alertOnExit}
                        onCheckedChange={(checked) => setNewZone(prev => ({ ...prev, alertOnExit: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alert on Zone Entry</Label>
                        <p className="text-xs text-muted-foreground">
                          Notify when device enters zone
                        </p>
                      </div>
                      <Switch 
                        checked={newZone.alertOnEntry}
                        onCheckedChange={(checked) => setNewZone(prev => ({ ...prev, alertOnEntry: checked }))}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreate}>Create Zone</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Zone Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Radius</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Devices</TableHead>
                  <TableHead>Surveys</TableHead>
                  <TableHead>Alerts</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {geoFences.map((fence) => (
                  <TableRow key={fence.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewZone(fence)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: fence.color }}
                        />
                        <span className="font-medium">{fence.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {fence.center.lat.toFixed(4)}°, {fence.center.lng.toFixed(4)}°
                    </TableCell>
                    <TableCell>{fence.radius}m</TableCell>
                    <TableCell>
                      <Badge
                        className={fence.status === "active" ? "bg-success/10 text-success" : ""}
                        variant={fence.status === "active" ? "default" : "secondary"}
                      >
                        {fence.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{fence.activeDevices}</TableCell>
                    <TableCell>{fence.assignedSurveys}</TableCell>
                    <TableCell>
                      <span className={fence.alerts > 0 ? "text-warning font-medium" : ""}>
                        {fence.alerts}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); handleViewZone(fence); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteZone(fence.id); }}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Zone Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div 
                className="h-4 w-4 rounded-full" 
                style={{ backgroundColor: selectedZone?.color }}
              />
              {selectedZone?.name}
            </DialogTitle>
            <DialogDescription>
              Geo-fence zone details and configuration
            </DialogDescription>
          </DialogHeader>
          
          {selectedZone && (
            <div className="space-y-6 py-4">
              {/* Zone Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{selectedZone.activeDevices}</p>
                  <p className="text-xs text-muted-foreground">Devices</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{selectedZone.assignedSurveys}</p>
                  <p className="text-xs text-muted-foreground">Surveys</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{selectedZone.alerts}</p>
                  <p className="text-xs text-muted-foreground">Alerts</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-bold">{selectedZone.radius}m</p>
                  <p className="text-xs text-muted-foreground">Radius</p>
                </div>
              </div>

              {/* Location Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Coordinates</Label>
                  <div className="p-3 rounded-lg bg-muted/30 font-mono text-sm">
                    {selectedZone.center.lat.toFixed(6)}°, {selectedZone.center.lng.toFixed(6)}°
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Created</Label>
                  <div className="p-3 rounded-lg bg-muted/30 text-sm">
                    {selectedZone.createdAt}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <div className="p-3 rounded-lg bg-muted/30 text-sm">
                  {selectedZone.description}
                </div>
              </div>

              {/* Status Toggle */}
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Zone Status</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedZone.status === 'active' ? 'Zone is currently active and tracking devices' : 'Zone is inactive'}
                  </p>
                </div>
                <Switch checked={selectedZone.status === 'active'} />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button variant="outline" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Zone
                </Button>
                <Button variant="outline" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  View Devices
                </Button>
                <Button variant="destructive" className="flex-1">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
