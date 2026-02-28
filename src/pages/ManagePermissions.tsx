import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAccountPermissions, updateAccountPermissions } from "@/store/permissionsSlice";
import { useAuthStore } from "@/store/authStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { menuService } from "@/services/menuService";

interface Menu {
  id: string;
  name: string;
  title: string;
}

const PERMISSIONS = [
  { id: "550e8400-e29b-41d4-a716-446655440010", name: "CREATE" },
  { id: "550e8400-e29b-41d4-a716-446655440011", name: "READ" },
  { id: "550e8400-e29b-41d4-a716-446655440012", name: "UPDATE" },
  { id: "550e8400-e29b-41d4-a716-446655440013", name: "DELETE" },
];

export default function ManagePermissions() {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { accountPermissions, loading } = useSelector((state: RootState) => state.permissions);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (tokens?.accessToken && accountId) {
      loadMenus();
      loadPermissions();
    }
  }, [tokens, accountId]);

  useEffect(() => {
    if (accountPermissions.length > 0) {
      const matrix: Record<string, Record<string, boolean>> = {};
      accountPermissions.forEach((perm: any) => {
        if (!matrix[perm.menuId]) matrix[perm.menuId] = {};
        matrix[perm.menuId][perm.permissionId] = perm.status;
      });
      setPermissionMatrix(matrix);
    } else {
      setPermissionMatrix({});
    }
  }, [accountPermissions]);

  const loadMenus = async () => {
    try {
      const result = await menuService.getAll(tokens!.accessToken, { page: 1, limit: 100 });
      const menuData = Array.isArray(result.data?.data) ? result.data.data : (Array.isArray(result.data) ? result.data : []);
      setMenus(menuData);
    } catch (error) {
      toast.error("Failed to load menus");
    }
  };

  const loadPermissions = async () => {
    try {
      await dispatch(fetchAccountPermissions({ token: tokens!.accessToken, accountId: accountId! })).unwrap();
    } catch (error) {
      toast.error("Failed to load permissions");
    }
  };

  const handleSelectAll = () => {
    const allSelected: Record<string, Record<string, boolean>> = {};
    menus.forEach(menu => {
      allSelected[menu.id] = {};
      PERMISSIONS.forEach(perm => {
        allSelected[menu.id][perm.id] = true;
      });
    });
    setPermissionMatrix(allSelected);
    toast.success("All permissions selected");
  };

  const handleCheckboxChange = (menuId: string, permissionId: string, checked: boolean) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [menuId]: {
        ...prev[menuId],
        [permissionId]: checked,
      },
    }));
  };

  const handleSavePermissions = async () => {
    if (!accountId) return;

    const permissionsArray: any[] = [];
    Object.keys(permissionMatrix).forEach(menuId => {
      Object.keys(permissionMatrix[menuId]).forEach(permissionId => {
        permissionsArray.push({
          accountId,
          menuId,
          permissionId,
          status: permissionMatrix[menuId][permissionId],
        });
      });
    });

    try {
      await dispatch(updateAccountPermissions({ token: tokens!.accessToken, permissions: permissionsArray })).unwrap();
      toast.success("Permissions updated successfully!");
      navigate("/permissions");
    } catch (error) {
      toast.error("Failed to update permissions");
    }
  };

  return (
    <AdminLayout title="Manage Permissions" subtitle="Configure account permissions">
      <div className="space-y-6">
        <Button variant="outline" onClick={() => navigate("/permissions")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Accounts
        </Button>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Permissions Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            {menus.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">Loading menus...</p>
            ) : (
              <>
                <div className="mb-4">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select All
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Menu</th>
                        {PERMISSIONS.map((perm) => (
                          <th key={perm.id} className="text-center p-3 font-semibold">{perm.name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {menus.map((menu) => (
                        <tr key={menu.id} className="border-b hover:bg-accent">
                          <td className="p-3 font-medium">{menu.title}</td>
                          {PERMISSIONS.map((perm) => (
                            <td key={perm.id} className="text-center p-3">
                              <Checkbox
                                checked={permissionMatrix[menu.id]?.[perm.id] || false}
                                onCheckedChange={(checked) => handleCheckboxChange(menu.id, perm.id, !!checked)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button onClick={handleSavePermissions} disabled={loading}>
                    Save Permissions
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/permissions")}>
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
