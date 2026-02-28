import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BaseUrl } from '@/config/BaseUrl';
import { Loader2, BarChart3, Table as TableIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

export default function Crosstab() {
  const { surveyId } = useParams();
  const { tokens } = useAuthStore();
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState('');
  const [crosstabData, setCrosstabData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  useEffect(() => {
    if (!tokens?.accessToken) return;
    fetch(`${BaseUrl}/surveys/${surveyId}/questions`, {
      headers: { Authorization: `Bearer ${tokens.accessToken}` }
    })
      .then(res => res.json())
      .then(data => setQuestions(data.data.data || []))
      .catch(() => toast.error('Failed to load questions'));
  }, [surveyId, tokens]);

  const handleGenerate = async () => {
    if (!selectedQuestion) {
      toast.error('Please select a question');
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(
        `${BaseUrl}/survey-responses/crosstab?surveyId=${surveyId}&questionId=${selectedQuestion}`,
        { headers: { Authorization: `Bearer ${tokens?.accessToken}` } }
      );
      const data = await res.json();
      if (data.success) {
        setCrosstabData(data.data);
        if (data.data.tabs?.length > 0) {
          setActiveTab(data.data.tabs[0].questionId);
        }
      } else {
        toast.error(data.data?.errors?.[0] || 'Failed to generate crosstab');
      }
    } catch (error) {
      toast.error('Failed to generate crosstab');
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C'];

  const getChartData = (tabData: any) => {
    if (!tabData) return [];
    
    return Object.entries(tabData.crosstab).map(([row, cols]: [string, any]) => ({
      name: row,
      ...cols,
      total: tabData.rowTotals[row]
    }));
  };

  const getPieData = (tabData: any) => {
    if (!tabData) return [];
    
    return Object.entries(tabData.rowTotals).map(([name, value]: [string, any], index) => ({
      name,
      value,
      fill: COLORS[index % COLORS.length]
    }));
  };

  const renderTabContent = (tabData: any) => (
    <Tabs defaultValue="table" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="table" className="flex items-center gap-2">
          <TableIcon className="h-4 w-4" />
          Table
        </TabsTrigger>
        <TabsTrigger value="bar" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Bar Chart
        </TabsTrigger>
        <TabsTrigger value="pie" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Pie Chart
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="table" className="mt-4">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{crosstabData?.selectedQuestionText || 'Selected Question'}</TableHead>
                {Object.keys(tabData.columnTotals).map(col => (
                  <TableHead key={col}>{col}</TableHead>
                ))}
                <TableHead className="font-bold">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(tabData.crosstab).map(([row, cols]: [string, any]) => (
                <TableRow key={row}>
                  <TableCell className="font-medium">{row}</TableCell>
                  {Object.keys(tabData.columnTotals).map(col => (
                    <TableCell key={col}>{cols[col] || 0}</TableCell>
                  ))}
                  <TableCell className="font-bold">{tabData.rowTotals[row]}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell className="font-bold">Total</TableCell>
                {Object.entries(tabData.columnTotals).map(([col, total]: [string, any]) => (
                  <TableCell key={col} className="font-bold">{total}</TableCell>
                ))}
                <TableCell className="font-bold">{tabData.grandTotal}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </TabsContent>
      
      <TabsContent value="bar" className="mt-4">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData(tabData)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(tabData.columnTotals).map((col, index) => (
                <Bar key={col} dataKey={col} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      
      <TabsContent value="pie" className="mt-4">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={getPieData(tabData)}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {getPieData(tabData).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
    </Tabs>
  );

  return (
    <AdminLayout title="Crosstab Analysis" subtitle="Cross-tabulation analysis for survey questions">
      <Card>
        <CardHeader>
          <CardTitle>Select Question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Select Question for Analysis</Label>
            <Select value={selectedQuestion} onValueChange={setSelectedQuestion}>
              <SelectTrigger>
                <SelectValue placeholder="Select question" />
              </SelectTrigger>
              <SelectContent>
                {questions.map(q => (
                  <SelectItem key={q.id} value={q.id}>{q.questionText}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Generate Crosstab
          </Button>
        </CardContent>
      </Card>

      {crosstabData && crosstabData.tabs?.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Results - {crosstabData.selectedQuestionText}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full flex-wrap h-auto">
                {crosstabData.tabs.map((tab: any) => (
                  <TabsTrigger key={tab.questionId} value={tab.questionId} className="flex-1 min-w-[150px]">
                    {tab.questionText}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {crosstabData.tabs.map((tab: any) => (
                <TabsContent key={tab.questionId} value={tab.questionId} className="mt-4">
                  {renderTabContent(tab)}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {crosstabData && crosstabData.tabs?.length === 0 && (
        <Card className="mt-6">
          <CardContent className="py-8 text-center text-muted-foreground">
            No other questions available for crosstab analysis
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
