import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchActivityLogs } from "@/store/activityLogsSlice";
import { useAuthStore } from "@/store/authStore";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Activity, ChevronLeft, ChevronRight, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const getActionColor = (action: string) => {
  switch (action.toUpperCase()) {
    case "CREATE":
      return "bg-primary/10 text-primary";
    case "UPDATE":
      return "bg-warning/10 text-warning";
    case "DELETE":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function ActivityLogs() {
  const dispatch = useDispatch<AppDispatch>();
  const { tokens } = useAuthStore();
  const { logs, total, page, limit, loading } = useSelector((state: RootState) => state.activityLogs);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchActivityLogs({ token: tokens.accessToken, page: currentPage, limit: 10 }));
    }
  }, [tokens, currentPage]);

  const totalPages = Math.ceil(total / limit);

  // Stats
  const stats = useMemo(() => {
    const actionCounts = logs.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});
    return {
      totalActions: total,
      uniqueUsers: new Set(logs.map((log: any) => log.accountId)).size,
      criticalAlerts: logs.filter((log: any) => log.action === 'DELETE').length,
    };
  }, [logs, total]);

  // Action distribution for pie chart
  const actionDistribution = useMemo(() => {
    const counts = logs.reduce((acc: any, log: any) => {
      acc[log.action] = (acc[log.action] || 0) + 1;
      return acc;
    }, {});
    const colors: any = {
      CREATE: "hsl(199, 89%, 48%)",
      UPDATE: "hsl(38, 92%, 50%)",
      DELETE: "hsl(0, 84%, 60%)",
      READ: "hsl(172, 66%, 50%)",
    };
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || "hsl(262, 83%, 58%)",
    }));
  }, [logs]);

  // Activity trend (last 7 days)
  const activityTrendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: format(date, "MMM dd"),
        actions: 0,
      };
    });
    logs.forEach((log: any) => {
      const logDate = format(new Date(log.createdAt), "MMM dd");
      const dayData = last7Days.find(d => d.date === logDate);
      if (dayData) dayData.actions++;
    });
    return last7Days;
  }, [logs]);

  return (
    <AdminLayout title="Activity Logs" subtitle="System activity monitoring and audit trail">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalActions}</p>
              <p className="text-sm text-muted-foreground">Total Actions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-destructive/10 p-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.criticalAlerts}</p>
              <p className="text-sm text-muted-foreground">Delete Actions</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-accent p-3">
              <Users className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.uniqueUsers}</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card className="md:col-span-2 p-6">
          <h3 className="font-semibold mb-4">Activity Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={activityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
              <Area type="monotone" dataKey="actions" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Action Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={actionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
              >
                {actionDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {actionDistribution.map((item: any) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Log ({total} entries)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <>
              <div className="rounded-xl border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Action</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <Badge className={getActionColor(log.action)}>{log.action}</Badge>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-sm">{log.description}</p>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{log.account?.loginId || 'System'}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{log.module}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{format(new Date(log.createdAt), "MMM dd, yyyy")}</p>
                            <p className="text-xs text-muted-foreground">{format(new Date(log.createdAt), "HH:mm:ss")}</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, total)} of {total} entries
                </p>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="w-8 h-8 p-0"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
