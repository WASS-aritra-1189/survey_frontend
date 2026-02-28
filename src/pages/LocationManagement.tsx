import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Edit, Trash2, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { surveyService } from "@/services/surveyService";
import { surveyMasterService } from "@/services/surveyMasterService";
import { BaseUrl } from "@/config/BaseUrl";
import axios from "axios";

export default function LocationManagement() {
  const { tokens } = useAuthStore();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyMasters, setSurveyMasters] = useState<any[]>([]);
  const [zones, setZones] = useState<any[]>([]);
  const [selectedSurvey, setSelectedSurvey] = useState<string>("");
  const [selectedMaster, setSelectedMaster] = useState<string>("");
  const [locations, setLocations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<string>("");

  useEffect(() => {
    loadSurveys();
    loadSurveyMasters();
    loadZones();
  }, []);

  const loadSurveys = async () => {
    if (!tokens?.accessToken) return;
    try {
      const response = await surveyService.getAll(tokens.accessToken, 100);
      const filteredSurveys = response.data.data.filter((s: any) => s.requiresLocationValidation === true);
      setSurveys(filteredSurveys);
    } catch (error) {
      toast.error("Failed to load surveys");
    }
  };

  const loadSurveyMasters = async () => {
    if (!tokens?.accessToken) return;
    try {
      const response = await surveyMasterService.getAll(100, 1, tokens.accessToken);
      setSurveyMasters(response.data.data);
    } catch (error) {
      toast.error("Failed to load survey masters");
    }
  };

  const loadZones = async () => {
    if (!tokens?.accessToken) return;
    try {
      const res = await axios.get(`${BaseUrl}/zones`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      setZones(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      toast.error("Failed to load zones");
      setZones([]);
    }
  };

  const loadLocationConstraint = async () => {
    if (!tokens?.accessToken || !selectedSurvey || !selectedMaster) return;
    setIsLoading(true);
    try {
      const response = await surveyService.getLocationConstraint(selectedSurvey, selectedMaster, tokens.accessToken);
      if (response.data) {
        setLocations([response.data]);
      } else {
        setLocations([]);
      }
    } catch (error) {
      setLocations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSurvey && selectedMaster) {
      loadLocationConstraint();
    }
  }, [selectedSurvey, selectedMaster]);

  const handleSave = async () => {
    if (!tokens?.accessToken || !selectedSurvey || !selectedMaster || !selectedZone) return;

    const constraint = { zoneId: selectedZone };

    try {
      if (editingLocation) {
        await surveyService.updateLocationConstraint(selectedSurvey, selectedMaster, constraint, tokens.accessToken);
        toast.success("Location constraint updated");
      } else {
        await surveyService.assignWithLocation(selectedSurvey, selectedMaster, constraint, tokens.accessToken);
        toast.success("Location constraint created");
      }
      setIsDialogOpen(false);
      setSelectedZone("");
      setEditingLocation(null);
      loadLocationConstraint();
    } catch (error) {
      toast.error("Failed to save location constraint");
    }
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setSelectedZone(location.zoneId || "");
    setIsDialogOpen(true);
  };

  const handleDelete = async (location: any) => {
    if (!tokens?.accessToken) return;
    try {
      await surveyService.removeLocationConstraint(location.surveyId, location.surveyMasterId, tokens.accessToken);
      toast.success("Location constraint removed");
      loadLocationConstraint();
    } catch (error) {
      toast.error("Failed to remove location constraint");
    }
  };

  const handleAddNew = () => {
    setEditingLocation(null);
    setSelectedZone("");
    setIsDialogOpen(true);
  };

  return (
    <AdminLayout title="Location Management" subtitle="Manage survey location constraints">
      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Location Constraints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <Label>Select Survey</Label>
              <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                <SelectTrigger>
                  <SelectValue placeholder="Select survey" />
                </SelectTrigger>
                <SelectContent>
                  {surveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Select Survey Master</Label>
              <Select value={selectedMaster} onValueChange={setSelectedMaster}>
                <SelectTrigger>
                  <SelectValue placeholder="Select survey master" />
                </SelectTrigger>
                <SelectContent>
                  {surveyMasters.map((master) => (
                    <SelectItem key={master.id} value={master.id}>
                      {master.loginId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedSurvey && selectedMaster && (
            <>
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location Constraint
                </Button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : locations.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Latitude</TableHead>
                      <TableHead>Longitude</TableHead>
                      <TableHead>Radius (meters)</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locations.map((location) => (
                      <TableRow key={location.id}>
                        <TableCell>{location.latitude}</TableCell>
                        <TableCell>{location.longitude}</TableCell>
                        <TableCell>{location.radiusInMeters}m</TableCell>
                        <TableCell>
                          <Badge variant={location.isActive ? "default" : "secondary"}>
                            {location.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEdit(location)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(location)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-12">
                  <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No location constraints found</p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLocation ? "Edit" : "Add"} Location Constraint
            </DialogTitle>
            <DialogDescription>
              Select a predefined zone for survey responses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Select Zone</Label>
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.radiusInMeters}m)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
