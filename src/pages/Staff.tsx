import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchStaffDetails, updateStaffDetail } from "@/store/staffDetailSlice";
import { fetchAccounts, changeStatus, updateAccount } from "@/store/accountSlice";
import { fetchSettings } from "@/store/settingsSlice";
import { fetchAccountLevels } from "@/store/accountLevelSlice";
import { fetchDesignations } from "@/store/designationSlice";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Search, 
  Shield,
  Users,
  Settings,
  Edit,
  Trash2,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useAuthStore } from "@/store/authStore";
import { staffService } from "@/services/staffService";

interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  initials: string;
  modules: string[];
  lastLogin: string;
  status: "active" | "inactive";
  joinDate: string;
  actionsCount: number;
  department: string;
}

export default function Staff() {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { accounts, total, loading } = useSelector((state: RootState) => state.account);
  const { staffDetails } = useSelector((state: RootState) => state.staffDetail);
  const { data: settings = [] } = useSelector((state: RootState) => state.settings);
  const { levels } = useSelector((state: RootState) => state.accountLevel);
  const { designations } = useSelector((state: RootState) => state.designation);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(25);
  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [editStaffOpen, setEditStaffOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [staffForm, setStaffForm] = useState({
    loginId: "",
    password: "",
    roleIds: "STAFF",
    settingId: "",
    accountLevelId: ""
  });
  const [editForm, setEditForm] = useState({
    loginId: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    designationId: ""
  });
  
  useEffect(() => {
    if (!tokens?.accessToken) return;
    
    dispatch(fetchAccounts({ token: tokens.accessToken, page, limit, search: searchQuery }));
    dispatch(fetchStaffDetails({ token: tokens.accessToken, page, limit, search: searchQuery }));
    dispatch(fetchSettings(tokens.accessToken));
    dispatch(fetchAccountLevels(tokens.accessToken));
    dispatch(fetchDesignations(tokens.accessToken));
  }, [tokens?.accessToken, page, searchQuery]);
  
  const staffData = accounts.map((account: any) => {
    const staffDetail = staffDetails.find((s: any) => s.accountId === account.id);
    return {
      id: account.id,
      staffDetailId: staffDetail?.id,
      name: staffDetail ? `${staffDetail.firstName} ${staffDetail.lastName}` : account.loginId,
      email: staffDetail?.email || account.loginId,
      phone: staffDetail?.phone || "N/A",
      role: account.roles || "N/A",
      initials: staffDetail ? `${staffDetail.firstName[0]}${staffDetail.lastName[0]}`.toUpperCase() : account.loginId.substring(0, 2).toUpperCase(),
      status: account.status?.toLowerCase() === "active" ? "active" : "inactive" as "active" | "inactive",
      joinDate: new Date(account.createdAt).toLocaleDateString(),
      designation: staffDetail?.designation?.name || "N/A",
      designationId: staffDetail?.designationId,
    };
  });

  const filteredStaff = staffData.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: staffData.length,
    active: staffData.filter(s => s.status === "active").length,
    inactive: staffData.filter(s => s.status === "inactive").length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "gradient-success";
      case "inactive": return "bg-muted text-muted-foreground";
      default: return "";
    }
  };

  const handleEditStaff = (member: any) => {
    const staffDetail = staffDetails.find((s: any) => s.accountId === member.id);
    const account = accounts.find((a: any) => a.id === member.id);
    if (staffDetail && account) {
      setSelectedStaff({ ...staffDetail, accountId: account.id });
      setEditForm({
        loginId: account.loginId,
        firstName: staffDetail.firstName,
        lastName: staffDetail.lastName,
        email: staffDetail.email,
        phone: staffDetail.phone,
        designationId: staffDetail.designationId
      });
      setEditStaffOpen(true);
    } else {
      toast.error("Staff details not found. Please try again.");
      console.log("Staff details:", staffDetails);
      console.log("Looking for accountId:", member.id);
    }
  };

  const handleUpdateStaff = async () => {
    if (!tokens?.accessToken || !selectedStaff) return;

    try {
      await dispatch(updateAccount({ token: tokens.accessToken, id: selectedStaff.accountId, data: { loginId: editForm.loginId } })).unwrap();
      await dispatch(updateStaffDetail({ token: tokens.accessToken, id: selectedStaff.id, data: {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        email: editForm.email,
        phone: editForm.phone,
        designationId: editForm.designationId
      } })).unwrap();
      toast.success("Staff updated successfully!");
      setEditStaffOpen(false);
      dispatch(fetchAccounts({ token: tokens.accessToken, page, limit, search: searchQuery }));
      dispatch(fetchStaffDetails({ token: tokens.accessToken, page, limit, search: searchQuery }));
    } catch (error: any) {
      toast.error(error.message || "Failed to update staff");
    }
  };

  const handleStatusChange = async (accountId: string, status: string) => {
    if (!tokens?.accessToken) return;

    try {
      await dispatch(changeStatus({ token: tokens.accessToken, id: accountId, status })).unwrap();
      toast.success(`Status changed to ${status}`);
      dispatch(fetchAccounts({ token: tokens.accessToken, page, limit, search: searchQuery }));
    } catch (error) {
      toast.error("Failed to change status");
    }
  };

  const handleAddStaff = async () => {
    if (!tokens?.accessToken) return;
    
    if (!staffForm.loginId || !staffForm.password) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      await staffService.register(tokens.accessToken, staffForm);
      toast.success("Staff registered successfully!");
      setAddStaffOpen(false);
      setStaffForm({
        loginId: "",
        password: "",
        roleIds: "STAFF",
        settingId: "",
        accountLevelId: ""
      });
      dispatch(fetchAccounts({ token: tokens.accessToken, page, limit, search: searchQuery }));
      dispatch(fetchStaffDetails({ token: tokens.accessToken, page, limit, search: searchQuery }));
    } catch (error: any) {
      toast.error(error.message || "Failed to register staff");
    }
  };

  return (
    <AdminLayout title="Staff Management" subtitle="Manage admin users, roles, and access rights">
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Staff</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3">
              <CheckCircle className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-warning/10 p-3">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Inactive</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Staff Members</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={() => setAddStaffOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{member.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{member.joinDate}</span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {member.staffDetailId && (
                              <DropdownMenuItem onClick={() => handleEditStaff(member)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => handleStatusChange(member.id, member.status === 'active' ? 'DEACTIVE' : 'ACTIVE')}>
                              {member.status === 'active' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredStaff.length} of {total} staff members
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <Button variant="outline" size="sm" disabled={filteredStaff.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={addStaffOpen} onOpenChange={setAddStaffOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Staff</DialogTitle>
            <DialogDescription>Register a new staff member</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label>Login ID *</Label>
              <Input value={staffForm.loginId} onChange={(e) => setStaffForm({ ...staffForm, loginId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Password *</Label>
              <Input type="password" value={staffForm.password} onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Account Level *</Label>
              <Select value={staffForm.accountLevelId} onValueChange={(val) => setStaffForm({ ...staffForm, accountLevelId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>{level.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Setting *</Label>
              <Select value={staffForm.settingId} onValueChange={(val) => setStaffForm({ ...staffForm, settingId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select setting" />
                </SelectTrigger>
                <SelectContent>
                  {settings.map((setting: any) => (
                    <SelectItem key={setting.id} value={setting.id}>{setting.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStaffOpen(false)}>Cancel</Button>
            <Button onClick={handleAddStaff}>Add Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editStaffOpen} onOpenChange={setEditStaffOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Staff Details</DialogTitle>
            <DialogDescription>Update staff member information</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label>Login ID *</Label>
              <Input value={editForm.loginId} onChange={(e) => setEditForm({ ...editForm, loginId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>First Name *</Label>
              <Input value={editForm.firstName} onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Last Name *</Label>
              <Input value={editForm.lastName} onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Phone *</Label>
              <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
            </div>
            <div className="space-y-2 col-span-2">
              <Label>Designation *</Label>
              <Select value={editForm.designationId} onValueChange={(val) => setEditForm({ ...editForm, designationId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select designation" />
                </SelectTrigger>
                <SelectContent>
                  {designations.map((designation) => (
                    <SelectItem key={designation.id} value={designation.id}>{designation.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStaffOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateStaff}>Update Staff</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
