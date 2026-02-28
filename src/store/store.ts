import { configureStore } from "@reduxjs/toolkit";
import surveyMasterReducer from "./surveyMasterSlice";
import settingsReducer from "./settingsSlice";
import surveyReducer from "./surveySlice";
import responseReducer from "./responseSlice";
import statsReducer from "./statsSlice";
import deviceReducer from "./deviceSlice";
import accountReducer from "./accountSlice";
import menuReducer from "./menuSlice";
import permissionsReducer from "./permissionsSlice";
import activityLogsReducer from "./activityLogsSlice";
import dashboardReducer from "./dashboardSlice";
import surveyTypeReducer from "./surveyTypeSlice";
import accountLevelReducer from "./accountLevelSlice";
import designationReducer from "./designationSlice";
import staffDetailReducer from "./staffDetailSlice";

export const store = configureStore({
  reducer: {
    surveyMaster: surveyMasterReducer,
    settings: settingsReducer,
    survey: surveyReducer,
    response: responseReducer,
    stats: statsReducer,
    device: deviceReducer,
    account: accountReducer,
    menu: menuReducer,
    permissions: permissionsReducer,
    activityLogs: activityLogsReducer,
    dashboard: dashboardReducer,
    surveyType: surveyTypeReducer,
    accountLevel: accountLevelReducer,
    designation: designationReducer,
    staffDetail: staffDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
