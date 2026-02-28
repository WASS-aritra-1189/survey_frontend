import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/store/store";
import { fetchAccounts } from "@/store/accountSlice";
import { useAuthStore } from "@/store/authStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Settings, Search } from "lucide-react";

export default function Permissions() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { accounts } = useSelector((state: RootState) => state.account);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchAccounts({ token: tokens.accessToken, page: 1, limit: 100 }));
    }
  }, [tokens]);

  const filteredAccounts = accounts.filter((account: any) => {
    const matchesSearch = 
      (account.firstName || account.loginId || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (account.lastName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (account.email || account.loginId || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || account.roles === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleManagePermissions = (accountId: string) => {
    navigate(`/permissions/manage/${accountId}`);
  };

  return (
    <AdminLayout title="Permissions" subtitle="Manage account permissions and access control">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5" />
              Accounts
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search accounts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="ROOT">ROOT</SelectItem>
                  <SelectItem value="ROOT_STAFF">ROOT STAFF</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="STAFF">STAFF</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredAccounts.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No accounts found</p>
            ) : (
              filteredAccounts.map((account: any) => (
                <div key={account.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                  <div>
                    <p className="font-medium">{account.firstName || account.loginId} {account.lastName || ''}</p>
                    <p className="text-sm text-muted-foreground">{account.email || account.loginId}</p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleManagePermissions(account.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
