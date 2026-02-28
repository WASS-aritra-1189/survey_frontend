import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  Eye,
  Users as UsersIcon,
  UserCheck,
  UserX,
  Award,
  UserPlus,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSurveyMasters, createSurveyMaster, fetchSurveyMasterById, updateSurveyMasterStatus, deleteSurveyMaster, updateSurveyMaster, resetSurveyMasterPassword } from "@/store/surveyMasterSlice";
import { toast } from "sonner";

export default function Users() {
  const dispatch = useAppDispatch();
  const tokens = useAuthStore((state) => state.tokens);
  const { data: surveyMasters, total, isLoading, selectedMaster } = useAppSelector((state) => state.surveyMaster);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [formData, setFormData] = useState({
    loginId: "",
    password: "",
    surveyLimit: 100,
    settingId: "",
  });

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveyMasters({ limit, page, token: tokens.accessToken }));
    }
  }, [dispatch, limit, page, tokens]);

  const handleCreate = async () => {
    if (!formData.loginId || !formData.password) {
      toast.error("Login ID and password are required");
      return;
    }
    if (tokens?.accessToken) {
      try {
        await dispatch(createSurveyMaster({ data: formData, token: tokens.accessToken })).unwrap();
        toast.success("Survey master created successfully!");
        setIsDialogOpen(false);
        setFormData({ loginId: "", password: "", surveyLimit: 100, settingId: "" });
      } catch (error) {
        toast.error("Failed to create survey master");
      }
    }
  };

  const handleViewDetails = (id: string) => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveyMasterById({ id, token: tokens.accessToken }));
      setIsDetailOpen(true);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (tokens?.accessToken) {
      try {
        await dispatch(updateSurveyMasterStatus({ id, status, token: tokens.accessToken })).unwrap();
        toast.success("Status updated successfully!");
      } catch (error) {
        toast.error("Failed to update status");
      }
    }
  };

  const handleDelete = async () => {
    if (deleteId && tokens?.accessToken) {
      try {
        await dispatch(deleteSurveyMaster({ id: deleteId, token: tokens.accessToken })).unwrap();
        toast.success("Survey master deleted successfully!");
        setDeleteId(null);
      } catch (error) {
        toast.error("Failed to delete survey master");
      }
    }
  };

  const handleEdit = (master: any) => {
    setEditData({ id: master.id, loginId: master.loginId, surveyLimit: master.surveyLimit, settingId: master.settingId, password: "" });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (editData && tokens?.accessToken) {
      try {
        const { id, password, ...data } = editData;
        const updateData = password ? { ...data, password } : data;
        await dispatch(updateSurveyMaster({ id, data: updateData, token: tokens.accessToken })).unwrap();
        toast.success("Survey master updated successfully!");
        setIsEditOpen(false);
        setEditData(null);
      } catch (error) {
        toast.error("Failed to update survey master");
      }
    }
  };

  const handleResetPassword = async () => {
    if (!tokens?.accessToken || !selectedMasterId) return;
    
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await dispatch(resetSurveyMasterPassword({ id: selectedMasterId, data: passwordForm, token: tokens.accessToken })).unwrap();
      toast.success("Password reset successfully!");
      setIsResetPasswordOpen(false);
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setSelectedMasterId(null);
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  const filteredMasters = surveyMasters.filter((master) => {
    const matchesSearch = master.loginId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || master.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: total,
    active: surveyMasters.filter(u => u.status === "ACTIVE").length,
    inactive: surveyMasters.filter(u => u.status === "PENDING").length,
    avgResponses: surveyMasters.length > 0 ? Math.round(surveyMasters.reduce((acc, u) => acc + u.totalResponsesGiven, 0) / surveyMasters.length) : 0,
  };

  return (
    <AdminLayout title="Users" subtitle="Manage survey users and assignments">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <UsersIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-success/10 p-3">
              <UserCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.active}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-warning/10 p-3">
              <UserX className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.inactive}</p>
              <p className="text-sm text-muted-foreground">Pending Users</p>
            </div>
          </div>
        </Card>
        <Card variant="stat" className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent/10 p-3">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.avgResponses}</p>
              <p className="text-sm text-muted-foreground">Avg Responses</p>
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>All Users</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-48"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={limit.toString()} onValueChange={(v) => setLimit(Number(v))}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Survey Master</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Login ID *</Label>
                      <Input value={formData.loginId} onChange={(e) => setFormData({...formData, loginId: e.target.value})} placeholder="master@admin" />
                    </div>
                    <div className="space-y-2">
                      <Label>Password *</Label>
                      <Input type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="Enter password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Survey Limit</Label>
                      <Input type="number" value={formData.surveyLimit} onChange={(e) => setFormData({...formData, surveyLimit: Number(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                      <Label>Setting ID</Label>
                      <Input value={formData.settingId} onChange={(e) => setFormData({...formData, settingId: e.target.value})} placeholder="550e8400-e29b-41d4-a716-446655440000" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={isLoading}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            </div>
          ) : surveyMasters.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Surveys</TableHead>
                <TableHead>Responses</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMasters.map((master) => (
                <TableRow key={master.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="gradient-primary text-primary-foreground text-sm">
                          {master.loginId.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium">{master.loginId}</span>
                        <p className="text-xs text-muted-foreground">ID: {master.id.substring(0, 8)}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">-</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">Survey Master</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={master.status === "ACTIVE" ? "gradient-success" : ""}
                      variant={master.status === "ACTIVE" ? "default" : "secondary"}
                    >
                      {master.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{master.totalSurveysAssigned} / {master.surveyLimit}</TableCell>
                  <TableCell>{master.totalResponsesGiven}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={(master.totalSurveysAssigned / master.surveyLimit) * 100} className="h-2 w-16" />
                      <span className="text-sm font-medium">
                        {Math.round((master.totalSurveysAssigned / master.surveyLimit) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(master.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(master)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedMasterId(master.id); setIsResetPasswordOpen(true); }}>
                          <Lock className="h-4 w-4 mr-2" />
                          Reset Password
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleStatusChange(master.id, master.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}>
                          <Edit className="h-4 w-4 mr-2" />
                          {master.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(master.id)}>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
          
          {!isLoading && filteredMasters.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Showing {filteredMasters.length} of {total} users (Page {page})
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={filteredMasters.length < limit} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Survey Master Details</DialogTitle>
          </DialogHeader>
          {selectedMaster && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Login ID</Label>
                <Input value={selectedMaster.loginId} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Badge className={selectedMaster.status === "ACTIVE" ? "gradient-success" : ""}>
                  {selectedMaster.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <Label>Survey Limit</Label>
                <Input value={selectedMaster.surveyLimit} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Total Surveys Assigned</Label>
                <Input value={selectedMaster.totalSurveysAssigned || 0} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Total Responses Given</Label>
                <Input value={selectedMaster.totalResponsesGiven || 0} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Account ID</Label>
                <Input value={selectedMaster.accountId} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Setting ID</Label>
                <Input value={selectedMaster.settingId} readOnly />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Survey Master</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this survey master? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Survey Master</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Login ID</Label>
                <Input value={editData.loginId} onChange={(e) => setEditData({...editData, loginId: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Password (leave empty to keep current)</Label>
                <Input type="password" value={editData.password} onChange={(e) => setEditData({...editData, password: e.target.value})} placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label>Survey Limit</Label>
                <Input type="number" value={editData.surveyLimit} onChange={(e) => setEditData({...editData, surveyLimit: Number(e.target.value)})} />
              </div>
              <div className="space-y-2">
                <Label>Setting ID</Label>
                <Input value={editData.settingId} onChange={(e) => setEditData({...editData, settingId: e.target.value})} />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={isLoading}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Old Password</Label>
              <Input
                type="password"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} disabled={isLoading}>Reset Password</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
