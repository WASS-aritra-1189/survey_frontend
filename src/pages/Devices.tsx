import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Smartphone, Battery, MapPin, Loader2, Plus, Eye, Pencil, UserPlus, UserMinus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDevices, createDevice, fetchDeviceById, updateDevice, updateDeviceStatus, assignDevice, unassignDevice, deleteDevice } from "@/store/deviceSlice";
import { fetchSurveyMasters } from "@/store/surveyMasterSlice";

export default function Devices() {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { data: devices, total, isLoading, selectedDevice } = useAppSelector((state) => state.device);
  const { data: surveyMasters } = useAppSelector((state) => state.surveyMaster);

  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [editId, setEditId] = useState("");
  const [assignId, setAssignId] = useState("");
  const [selectedMasterId, setSelectedMasterId] = useState("");
  const [formData, setFormData] = useState({
    deviceName: "",
    deviceId: "",
    battery: 100,
    location: "",
  });

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchDevices(tokens.accessToken));
      dispatch(fetchSurveyMasters({ token: tokens.accessToken, page: 1, limit: 100 }));
    }
  }, [dispatch, tokens]);

  const activeDevices = devices.filter((d) => d.status === "ACTIVE").length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.accessToken) return;

    try {
      await dispatch(createDevice({ token: tokens.accessToken, data: formData })).unwrap();
      toast.success("Device created successfully");
      setOpen(false);
      setFormData({ deviceName: "", deviceId: "", battery: 100, location: "" });
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to create device");
    }
  };

  const handleViewDevice = (id: string) => {
    if (!tokens?.accessToken) return;
    dispatch(fetchDeviceById({ token: tokens.accessToken, id }));
    setDetailOpen(true);
  };

  const handleEditDevice = (device: any) => {
    setEditId(device.id);
    setFormData({
      deviceName: device.deviceName,
      deviceId: device.deviceId,
      battery: device.battery,
      location: device.location,
    });
    setEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.accessToken) return;

    try {
      await dispatch(updateDevice({ token: tokens.accessToken, id: editId, data: formData })).unwrap();
      toast.success("Device updated successfully");
      setEditOpen(false);
      setFormData({ deviceName: "", deviceId: "", battery: 100, location: "" });
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to update device");
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!tokens?.accessToken) return;

    try {
      await dispatch(updateDeviceStatus({ token: tokens.accessToken, id, status })).unwrap();
      toast.success("Device status updated successfully");
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to update device status");
    }
  };

  const handleAssignDevice = (id: string) => {
    setAssignId(id);
    setSelectedMasterId("");
    setAssignOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.accessToken || !selectedMasterId) return;

    try {
      await dispatch(assignDevice({ token: tokens.accessToken, id: assignId, surveyMasterId: selectedMasterId })).unwrap();
      toast.success("Device assigned successfully");
      setAssignOpen(false);
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to assign device");
    }
  };

  const handleUnassignDevice = async (id: string) => {
    if (!tokens?.accessToken) return;

    try {
      await dispatch(unassignDevice({ token: tokens.accessToken, id })).unwrap();
      toast.success("Device unassigned successfully");
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to unassign device");
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!tokens?.accessToken) return;

    try {
      await dispatch(deleteDevice({ token: tokens.accessToken, id })).unwrap();
      toast.success("Device deleted successfully");
      dispatch(fetchDevices(tokens.accessToken));
    } catch (error: any) {
      toast.error(error.message || "Failed to delete device");
    }
  };

  return (
    <AdminLayout title="Devices" subtitle="Manage and monitor all survey devices">
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {[
          { label: "Total Devices", value: total.toString(), icon: Smartphone },
          { label: "Active Devices", value: activeDevices.toString(), icon: Battery },
          { label: "Inactive Devices", value: (total - activeDevices).toString(), icon: MapPin },
        ].map((s) => (
          <Card key={s.label} variant="stat" className="p-4">
            <div className="flex items-center justify-between">
              <div className="rounded-lg bg-primary/10 p-2">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold mt-2">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Devices</CardTitle>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Device
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12">
              <Smartphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No devices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device Name</TableHead>
                  <TableHead>Device ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Battery</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.deviceName}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">{device.deviceId}</code>
                    </TableCell>
                    <TableCell>
                      <Select value={device.status} onValueChange={(val) => handleStatusChange(device.id, val)}>
                        <SelectTrigger className="w-[130px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                          <SelectItem value="DEACTIVE">DEACTIVE</SelectItem>
                          <SelectItem value="PENDING">PENDING</SelectItem>
                          <SelectItem value="DELETED">DELETED</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4" />
                        {device.battery}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {device.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      {device.surveyMaster ? (
                        <span className="text-sm">{device.surveyMaster.loginId}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewDevice(device.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditDevice(device)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      {device.surveyMaster && device.surveyMaster.loginId ? (
                        <Button variant="ghost" size="icon" onClick={() => handleUnassignDevice(device.id)}>
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="ghost" size="icon" onClick={() => handleAssignDevice(device.id)}>
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteDevice(device.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="deviceName">Device Name</Label>
                <Input
                  id="deviceName"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="deviceId">Device ID</Label>
                <Input
                  id="deviceId"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="battery">Battery (%)</Label>
                <Input
                  id="battery"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.battery}
                  onChange={(e) => setFormData({ ...formData, battery: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Device"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Device Details</DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div>
                <Label>Device Name</Label>
                <p className="text-sm font-medium mt-1">{selectedDevice.deviceName}</p>
              </div>
              <div>
                <Label>Device ID</Label>
                <p className="text-sm font-medium mt-1">{selectedDevice.deviceId}</p>
              </div>
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  <Badge variant={selectedDevice.status === "ACTIVE" ? "default" : "secondary"}>
                    {selectedDevice.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label>Battery</Label>
                <p className="text-sm font-medium mt-1">{selectedDevice.battery}%</p>
              </div>
              <div>
                <Label>Location</Label>
                <p className="text-sm font-medium mt-1">{selectedDevice.location}</p>
              </div>
              <div>
                <Label>Assigned To</Label>
                <p className="text-sm font-medium mt-1">
                  {selectedDevice.surveyMaster?.loginId || "Unassigned"}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-deviceName">Device Name</Label>
                <Input
                  id="edit-deviceName"
                  value={formData.deviceName}
                  onChange={(e) => setFormData({ ...formData, deviceName: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-deviceId">Device ID</Label>
                <Input
                  id="edit-deviceId"
                  value={formData.deviceId}
                  onChange={(e) => setFormData({ ...formData, deviceId: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-battery">Battery (%)</Label>
                <Input
                  id="edit-battery"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.battery}
                  onChange={(e) => setFormData({ ...formData, battery: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-location">Location</Label>
                <Input
                  id="edit-location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Device"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Device to Survey Master</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="surveyMaster">Select Survey Master</Label>
                <Select value={selectedMasterId} onValueChange={setSelectedMasterId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a survey master" />
                  </SelectTrigger>
                  <SelectContent>
                    {surveyMasters.map((master) => (
                      <SelectItem key={master.id} value={master.id}>
                        {master.name} - {master.loginId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setAssignOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !selectedMasterId}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Assign Device"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
