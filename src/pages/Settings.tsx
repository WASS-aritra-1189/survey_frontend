import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSettings, updateSettings } from "@/store/settingsSlice";
import { toast } from "sonner";

export default function Settings() {
  const dispatch = useAppDispatch();
  const tokens = useAuthStore((state) => state.tokens);
  const { data: settings, isLoading } = useAppSelector((state) => state.settings);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSettings(tokens.accessToken));
    }
  }, [dispatch, tokens]);

  useEffect(() => {
    if (settings && Array.isArray(settings) && settings.length > 0) {
      const activeSetting = settings.find(s => s.status === "ACTIVE");
      if (activeSetting) {
        setFormData(activeSetting);
      }
    }
  }, [settings]);

  const handleSave = async () => {
    if (tokens?.accessToken && formData?.id) {
      try {
        const { id, createdAt, updatedAt, createdBy, updatedBy, deletedAt, ...cleanData } = formData;
        await dispatch(updateSettings({ id, data: cleanData, token: tokens.accessToken })).unwrap();
        toast.success("Settings updated successfully!");
      } catch (error) {
        toast.error("Failed to update settings");
      }
    }
  };

  return (
    <AdminLayout title="Settings" subtitle="Configure system preferences">
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      ) : formData ? (
        <>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5 text-primary" />
                General Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Welcome Message</Label>
                <Input value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={formData.currency} onChange={(e) => setFormData({...formData, currency: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Account Level</Label>
                <Input type="number" value={formData.accountLevel} onChange={(e) => setFormData({...formData, accountLevel: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Partner Commission Type</Label>
                <Input value={formData.partnerCommissionType} onChange={(e) => setFormData({...formData, partnerCommissionType: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>User Domain</Label>
                <Input value={formData.userDomain} onChange={(e) => setFormData({...formData, userDomain: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Admin Domain</Label>
                <Input value={formData.adminDomain} onChange={(e) => setFormData({...formData, adminDomain: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Mobile Domain</Label>
                <Input value={formData.mobileDomain} onChange={(e) => setFormData({...formData, mobileDomain: e.target.value})} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Maintenance Mode</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">User Maintenance Mode</p>
                <Switch checked={formData.userMaintenanceMode} onCheckedChange={(v) => setFormData({...formData, userMaintenanceMode: v})} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Admin Maintenance Mode</p>
                <Switch checked={formData.adminMaintenanceMode} onCheckedChange={(v) => setFormData({...formData, adminMaintenanceMode: v})} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <p className="font-medium">Mobile Maintenance Mode</p>
                <Switch checked={formData.mobileMaintenanceMode} onCheckedChange={(v) => setFormData({...formData, mobileMaintenanceMode: v})} />
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Login Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">Multi Device Login</p>
                <Switch checked={formData.multiDeviceLogin} onCheckedChange={(v) => setFormData({...formData, multiDeviceLogin: v})} />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
        </>
      ) : (
        <p className="text-muted-foreground text-center py-12">No settings found</p>
      )}
    </AdminLayout>
  );
}
