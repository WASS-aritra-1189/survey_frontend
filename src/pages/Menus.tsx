import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchMenus, createMenu, updateMenu, updateMenuStatus, deleteMenu } from "@/store/menuSlice";
import { useAuthStore } from "@/store/authStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function Menus() {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { menus, total, loading } = useSelector((state: RootState) => state.menu);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", title: "", description: "" });

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchMenus({ token: tokens.accessToken, page, limit }));
    }
  }, [dispatch, tokens?.accessToken, page, limit]);

  const handleCreate = async () => {
    if (!formData.name || !formData.title) {
      toast.error("Name and title are required");
      return;
    }
    if (tokens?.accessToken) {
      try {
        await dispatch(createMenu({ token: tokens.accessToken, data: formData })).unwrap();
        toast.success("Menu created successfully!");
        setIsDialogOpen(false);
        setFormData({ name: "", title: "", description: "" });
      } catch (error) {
        toast.error("Failed to create menu");
      }
    }
  };

  const handleEdit = (menu: any) => {
    setEditData({ id: menu.id, name: menu.name, title: menu.title, description: menu.description });
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editData?.name || !editData?.title) {
      toast.error("Name and title are required");
      return;
    }
    if (tokens?.accessToken && editData) {
      try {
        const { id, ...data } = editData;
        await dispatch(updateMenu({ token: tokens.accessToken, id, data })).unwrap();
        toast.success("Menu updated successfully!");
        setIsEditOpen(false);
        setEditData(null);
        dispatch(fetchMenus({ token: tokens.accessToken, page, limit }));
      } catch (error) {
        toast.error("Failed to update menu");
      }
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!tokens?.accessToken) return;

    try {
      await dispatch(updateMenuStatus({ token: tokens.accessToken, id, status })).unwrap();
      toast.success(`Status changed to ${status}`);
    } catch (error) {
      toast.error("Failed to change status");
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !tokens?.accessToken) return;

    try {
      await dispatch(deleteMenu({ token: tokens.accessToken, id: deleteId })).unwrap();
      toast.success("Menu deleted successfully!");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete menu");
    }
  };

  return (
    <AdminLayout title="Menus" subtitle="Manage system menus and navigation">
      <Card variant="elevated">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Menu Management
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={limit.toString()} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4" />
                    Add Menu
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Menu</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name *</Label>
                      <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="devices" />
                    </div>
                    <div className="space-y-2">
                      <Label>Title *</Label>
                      <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Devices" />
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Input value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Main dashboard menu item" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreate} disabled={loading}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menus.map((menu: any) => (
                    <TableRow key={menu.id} className="group">
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.title}</TableCell>
                      <TableCell className="text-muted-foreground">{menu.description}</TableCell>
                      <TableCell>
                        <Badge className={menu.status === "ACTIVE" ? "gradient-success" : ""}>
                          {menu.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(menu)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange(menu.id, menu.status === 'ACTIVE' ? 'DEACTIVE' : 'ACTIVE')}>
                              {menu.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteId(menu.id)}>
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
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {menus.length} of {total} menus
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                  <span className="text-sm">Page {page}</span>
                  <Button variant="outline" size="sm" disabled={menus.length < limit} onClick={() => setPage(p => p + 1)}>Next</Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input value={editData.title} onChange={(e) => setEditData({...editData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={editData.description} onChange={(e) => setEditData({...editData, description: e.target.value})} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={loading}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Menu</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this menu? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
