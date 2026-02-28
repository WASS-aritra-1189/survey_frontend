import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { UserPlus, Loader2, Users, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSurveys, bulkAssignSurvey } from "@/store/surveySlice";
import { BaseUrl } from "@/config/BaseUrl";

interface SurveyMaster {
  id: string;
  loginId: string;
  name?: string;
  email?: string;
  status: string;
}

export default function SurveyAssignment() {
  const dispatch = useAppDispatch();
  const { tokens } = useAuthStore();
  const { data: surveys } = useAppSelector((state) => state.survey);
  
  const [selectedSurveyId, setSelectedSurveyId] = useState("");
  const [surveyMasters, setSurveyMasters] = useState<SurveyMaster[]>([]);
  const [assignees, setAssignees] = useState<SurveyMaster[]>([]);
  const [selectedMasters, setSelectedMasters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAssignees, setIsLoadingAssignees] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  useEffect(() => {
    if (tokens?.accessToken) {
      dispatch(fetchSurveys({ token: tokens.accessToken, limit: 100 }));
      fetchSurveyMasters();
    }
  }, [dispatch, tokens]);

  const fetchSurveyMasters = async () => {
    if (!tokens?.accessToken) return;
    setIsLoading(true);
    try {
      const response = await fetch(`${BaseUrl}/survey-masters?limit=30&page=1&status=ACTIVE`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      const result = await response.json();
      if (result.success) {
        setSurveyMasters(result.data.data || []);
      }
    } catch (error) {
      toast.error("Failed to load survey masters");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAssignees = async (surveyId: string) => {
    if (!tokens?.accessToken || !surveyId) return;
    setIsLoadingAssignees(true);
    try {
      const response = await fetch(`${BaseUrl}/surveys/${surveyId}/assignees`, {
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      const result = await response.json();
      if (result.success) {
        setAssignees(result.data || []);
      }
    } catch (error) {
      toast.error("Failed to load assignees");
    } finally {
      setIsLoadingAssignees(false);
    }
  };

  const handleAssign = async () => {
    if (!tokens?.accessToken || !selectedSurveyId || selectedMasters.length === 0) {
      toast.error("Please select a survey and at least one survey master");
      return;
    }

    const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);
    if (selectedSurvey?.status !== "ACTIVE") {
      toast.error("Only active surveys can be assigned");
      return;
    }

    const inactiveMasters = surveyMasters.filter(m => 
      selectedMasters.includes(m.id) && m.status !== "ACTIVE"
    );
    if (inactiveMasters.length > 0) {
      toast.error("All selected survey masters must be active");
      return;
    }

    setIsAssigning(true);
    try {
      await dispatch(bulkAssignSurvey({
        id: selectedSurveyId,
        surveyMasterIds: selectedMasters,
        token: tokens.accessToken,
      })).unwrap();
      toast.success("Survey assigned successfully!");
      setSelectedMasters([]);
      fetchAssignees(selectedSurveyId);
    } catch (error) {
      toast.error("Failed to assign survey");
    } finally {
      setIsAssigning(false);
    }
  };

  const handleUnassign = async (surveyMasterId: string) => {
    if (!tokens?.accessToken || !selectedSurveyId) return;
    setUnassigningId(surveyMasterId);
    try {
      const response = await fetch(`${BaseUrl}/surveys/${selectedSurveyId}/unassign/${surveyMasterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${tokens.accessToken}` },
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Survey unassigned successfully!");
        fetchAssignees(selectedSurveyId);
      } else {
        toast.error(result.message || "Failed to unassign survey");
      }
    } catch (error) {
      toast.error("Failed to unassign survey");
    } finally {
      setUnassigningId(null);
    }
  };

  const toggleMaster = (masterId: string) => {
    setSelectedMasters(prev =>
      prev.includes(masterId) ? prev.filter(id => id !== masterId) : [...prev, masterId]
    );
  };

  const activeSurveys = surveys.filter(s => s.status === "ACTIVE");

  return (
    <AdminLayout title="Survey Assignment" subtitle="Assign surveys to survey masters">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Assign Survey
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Survey *</Label>
              <Select value={selectedSurveyId} onValueChange={(val) => { setSelectedSurveyId(val); fetchAssignees(val); setAssignees([]); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a survey" />
                </SelectTrigger>
                <SelectContent>
                  {activeSurveys.map((survey) => (
                    <SelectItem key={survey.id} value={survey.id}>
                      {survey.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Select Survey Masters * (Active only)</Label>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : surveyMasters.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No active survey masters found</p>
              ) : (
                <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                  {surveyMasters.map((master) => (
                    <div key={master.id} className="flex items-center gap-3 p-3 hover:bg-accent/50">
                      <Checkbox
                        checked={selectedMasters.includes(master.id)}
                        onCheckedChange={() => toggleMaster(master.id)}
                        disabled={master.status !== "ACTIVE"}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{master.loginId}</p>
                        <p className="text-xs text-muted-foreground">{master.name || master.email || 'N/A'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button 
              onClick={handleAssign} 
              disabled={isAssigning || !selectedSurveyId || selectedMasters.length === 0}
              className="w-full"
            >
              {isAssigning ? "Assigning..." : `Assign to ${selectedMasters.length} Survey Master${selectedMasters.length !== 1 ? 's' : ''}`}
            </Button>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Current Assignees
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedSurveyId ? (
              <p className="text-sm text-muted-foreground py-8 text-center">Select a survey to view assignees</p>
            ) : isLoadingAssignees ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : assignees.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No assignees found</p>
            ) : (
              <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
                {assignees.map((assignee) => (
                  <div key={assignee.id} className="flex items-center gap-3 p-3 hover:bg-accent/50">
                    <div className="flex-1">
                      <p className="font-medium">{assignee.loginId}</p>
                      <p className="text-xs text-muted-foreground">{assignee.name || assignee.email || 'N/A'}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleUnassign(assignee.id)}
                      disabled={unassigningId === assignee.id}
                      className="text-destructive hover:text-destructive"
                    >
                      {unassigningId === assignee.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
