import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Surveys from "./pages/Surveys";
import SurveyBuilder from "./pages/SurveyBuilder";
import SurveyWizard from "./pages/SurveyWizard";
import SurveyAssignment from "./pages/SurveyAssignment";
import SurveyStats from "./pages/SurveyStats";
import SurveyReports from "./pages/SurveyReports";
import Users from "./pages/Users";
import Devices from "./pages/Devices";
import GeoFencing from "./pages/GeoFencing";
import LocationManagement from "./pages/LocationManagement";
import ZoneManagement from "./pages/ZoneManagement";
import Reports from "./pages/Reports";
import Staff from "./pages/Staff";
import Help from "./pages/Help";
import ActivityLogs from "./pages/ActivityLogs";
import MasterData from "./pages/MasterData";
import Menus from "./pages/Menus";
import Permissions from "./pages/Permissions";
import ManagePermissions from "./pages/ManagePermissions";
import Settings from "./pages/Settings";
import Responses from "./pages/Responses";
import Crosstab from "./pages/Crosstab";
import PublicSurvey from "./pages/PublicSurvey";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
  <ThemeProvider defaultTheme="system" storageKey="surveyflow-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/survey/:id" element={<PublicSurvey />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/surveys" element={<Surveys />} />
            <Route path="/surveys/new" element={<SurveyWizard />} />
            <Route path="/surveys/builder" element={<SurveyBuilder />} />
            <Route path="/surveys/builder/:surveyId" element={<SurveyBuilder />} />
            <Route path="/surveys/assignment" element={<SurveyAssignment />} />
            <Route path="/surveys/stats" element={<SurveyStats />} />
            <Route path="/surveys/report/:surveyId" element={<SurveyReports />} />
            <Route path="/responses" element={<Responses />} />
            <Route path="/crosstab/:surveyId" element={<Crosstab />} />
            <Route path="/users" element={<Users />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/devices" element={<Devices />} />
            <Route path="/geofencing" element={<GeoFencing />} />
            <Route path="/location-management" element={<LocationManagement />} />
            <Route path="/zone-management" element={<ZoneManagement />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/logs" element={<ActivityLogs />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route path="/menus" element={<Menus />} />
            <Route path="/permissions" element={<Permissions />} />
            <Route path="/permissions/manage/:accountId" element={<ManagePermissions />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
  </Provider>
);

export default App;
