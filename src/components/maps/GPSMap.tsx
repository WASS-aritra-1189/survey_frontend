import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Layers,
  Circle,
  Smartphone,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  type: 'device' | 'geofence' | 'user';
  status?: 'online' | 'offline';
  info?: string;
}

interface GeoFenceCircle {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  name: string;
  status: 'active' | 'inactive';
}

interface GPSMapProps {
  markers?: MapMarker[];
  geoFences?: GeoFenceCircle[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMarkerClick?: (marker: MapMarker) => void;
  onGeoFenceClick?: (geoFence: GeoFenceCircle) => void;
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
}

// Mock real-time position updates
const useRealTimePositions = (markers: MapMarker[]) => {
  const [positions, setPositions] = useState(markers);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prev => prev.map(marker => ({
        ...marker,
        lat: marker.lat + (Math.random() - 0.5) * 0.001,
        lng: marker.lng + (Math.random() - 0.5) * 0.001,
      })));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  return positions;
};

export function GPSMap({
  markers = [],
  geoFences = [],
  center = { lat: 39.8283, lng: -98.5795 },
  zoom = 4,
  onMarkerClick,
  onGeoFenceClick,
  className,
  showControls = true,
  interactive = true,
}: GPSMapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [viewCenter, setViewCenter] = useState(center);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  
  const liveMarkers = useRealTimePositions(markers);

  // Convert lat/lng to x/y position on the map container
  const getPosition = (lat: number, lng: number) => {
    // Simple mercator projection for demo
    const mapWidth = 100;
    const mapHeight = 100;
    
    const x = ((lng - viewCenter.lng) / (360 / Math.pow(2, currentZoom)) + 0.5) * mapWidth;
    const y = ((viewCenter.lat - lat) / (180 / Math.pow(2, currentZoom)) + 0.5) * mapHeight;
    
    return { x: Math.max(5, Math.min(95, 50 + x * 10)), y: Math.max(5, Math.min(95, 50 + y * 10)) };
  };

  const handleZoomIn = () => setCurrentZoom(prev => Math.min(prev + 1, 15));
  const handleZoomOut = () => setCurrentZoom(prev => Math.max(prev - 1, 1));
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleMarkerClick = (marker: MapMarker) => {
    setSelectedMarker(marker.id);
    onMarkerClick?.(marker);
  };

  return (
    <div className={cn("relative w-full h-full min-h-[400px] rounded-xl overflow-hidden", className)}>
      {/* Map Background - Styled grid representing a map */}
      <div 
        ref={mapRef}
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px),
            radial-gradient(circle at 30% 40%, rgba(56, 189, 248, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 70% 60%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)
          `,
          backgroundSize: `${20 + currentZoom * 2}px ${20 + currentZoom * 2}px, ${20 + currentZoom * 2}px ${20 + currentZoom * 2}px, 100% 100%, 100% 100%`,
        }}
      >
        {/* Geo-fence circles */}
        {geoFences.map((fence) => {
          const pos = getPosition(fence.lat, fence.lng);
          const radiusScale = fence.radius / 100 * (currentZoom / 5);
          return (
            <div
              key={fence.id}
              className={cn(
                "absolute rounded-full border-2 transition-all cursor-pointer",
                fence.status === 'active' 
                  ? "border-primary/60 bg-primary/10" 
                  : "border-muted-foreground/40 bg-muted/10"
              )}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${Math.max(60, radiusScale * 100)}px`,
                height: `${Math.max(60, radiusScale * 100)}px`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => onGeoFenceClick?.(fence)}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-primary/80 text-center px-2 truncate max-w-full">
                  {fence.name}
                </span>
              </div>
            </div>
          );
        })}

        {/* Device markers */}
        {liveMarkers.map((marker) => {
          const pos = getPosition(marker.lat, marker.lng);
          return (
            <div
              key={marker.id}
              className={cn(
                "absolute z-10 transition-all duration-300 cursor-pointer group",
                selectedMarker === marker.id && "z-20"
              )}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => handleMarkerClick(marker)}
            >
              {/* Pulse animation for online devices */}
              {marker.status === 'online' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute h-8 w-8 rounded-full bg-success/30 animate-ping" />
                </div>
              )}
              
              {/* Marker icon */}
              <div
                className={cn(
                  "relative flex items-center justify-center h-10 w-10 rounded-full shadow-lg transition-transform hover:scale-110",
                  marker.type === 'device' && marker.status === 'online' && "gradient-success",
                  marker.type === 'device' && marker.status === 'offline' && "bg-muted",
                  marker.type === 'geofence' && "gradient-primary",
                  marker.type === 'user' && "gradient-accent"
                )}
              >
                {marker.type === 'device' && <Smartphone className="h-5 w-5 text-white" />}
                {marker.type === 'geofence' && <Circle className="h-5 w-5 text-white" />}
                {marker.type === 'user' && <MapPin className="h-5 w-5 text-white" />}
              </div>
              
              {/* Info tooltip */}
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-2 rounded-lg bg-card shadow-lg border border-border",
                "opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-30"
              )}>
                <p className="font-medium text-sm">{marker.label}</p>
                {marker.info && <p className="text-xs text-muted-foreground">{marker.info}</p>}
                {marker.status && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "mt-1 text-xs",
                      marker.status === 'online' && "gradient-success text-white"
                    )}
                  >
                    {marker.status}
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shadow-md bg-white/90 backdrop-blur-sm"
            onClick={handleZoomIn}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shadow-md bg-white/90 backdrop-blur-sm"
            onClick={handleZoomOut}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shadow-md bg-white/90 backdrop-blur-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-9 w-9 shadow-md bg-white/90 backdrop-blur-sm"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 flex gap-3 px-4 py-2 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full gradient-success" />
          <span className="text-xs">Online</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-muted" />
          <span className="text-xs">Offline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full border-2 border-primary bg-primary/20" />
          <span className="text-xs">Geo-fence</span>
        </div>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/90 backdrop-blur-sm shadow-md">
        <span className="text-xs font-medium">Zoom: {currentZoom}x</span>
      </div>
    </div>
  );
}
