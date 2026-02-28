import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, MapPin, Power } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { BaseUrl } from "@/config/BaseUrl";
import axios from "axios";

interface Zone {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusInMeters: number;
  isActive: boolean;
  assignmentCount: number;
}

export default function ZoneManagement() {
  const { tokens } = useAuthStore();
  const [zones, setZones] = useState<Zone[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [form, setForm] = useState({ name: "", latitude: 0, longitude: 0, radiusInMeters: 100 });

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
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

  const handleSubmit = async () => {
    if (!tokens?.accessToken) return;
    try {
      if (editingZone) {
        await axios.patch(`${BaseUrl}/zones/${editingZone.id}`, form, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        toast.success("Zone updated");
      } else {
        await axios.post(`${BaseUrl}/zones`, form, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` },
        });
        toast.success("Zone created");
      }
      setIsDialogOpen(false);
      setEditingZone(null);
      setForm({ name: "", latitude: 0, longitude: 0, radiusInMeters: 100 });
      fetchZones();
    } catch (error) {
      toast.error("Failed to save zone");
    }
  };

  const handleDelete = async (id: string) => {
    if (!tokens?.accessToken) return;
    try {
      await axios.delete(`${BaseUrl}/zones/${id}`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      toast.success("Zone deleted");
      fetchZones();
    } catch (error) {
      toast.error("Failed to delete zone");
    }
  };

  const handleStatusToggle = async (id: string, isActive: boolean) => {
    if (!tokens?.accessToken) return;
    try {
      await axios.patch(`${BaseUrl}/zones/${id}/status`, { isActive }, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      toast.success("Status updated");
      fetchZones();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <AdminLayout title="Zone Management" subtitle="Manage location zones">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Zones</CardTitle>
            <Button onClick={() => { setEditingZone(null); setForm({ name: "", latitude: 0, longitude: 0, radiusInMeters: 100 }); setIsDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-2" /> Add Zone
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
                <TableHead>Radius (m)</TableHead>
                <TableHead>Assignments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {zones.map((zone) => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.name}</TableCell>
                  <TableCell>{zone.latitude}</TableCell>
                  <TableCell>{zone.longitude}</TableCell>
                  <TableCell>{zone.radiusInMeters}</TableCell>
                  <TableCell>{zone.assignmentCount || 0}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${zone.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {zone.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" onClick={() => handleStatusToggle(zone.id, !zone.isActive)}>
                        <Power className={`h-4 w-4 ${zone.isActive ? 'text-green-600' : 'text-gray-400'}`} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => { setEditingZone(zone); setForm({ name: zone.name, latitude: zone.latitude, longitude: zone.longitude, radiusInMeters: zone.radiusInMeters }); setIsDialogOpen(true); }}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(zone.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingZone ? "Edit Zone" : "Add Zone"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label>Latitude</Label>
              <Input type="number" step="0.000001" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label>Longitude</Label>
              <Input type="number" step="0.000001" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: parseFloat(e.target.value) })} />
            </div>
            <div>
              <Label>Radius (meters)</Label>
              <Input type="number" value={form.radiusInMeters} onChange={(e) => setForm({ ...form, radiusInMeters: parseInt(e.target.value) })} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
