import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", responses: 400, surveys: 24 },
  { name: "Feb", responses: 300, surveys: 18 },
  { name: "Mar", responses: 520, surveys: 32 },
  { name: "Apr", responses: 478, surveys: 28 },
  { name: "May", responses: 690, surveys: 41 },
  { name: "Jun", responses: 830, surveys: 52 },
  { name: "Jul", responses: 950, surveys: 58 },
];

export function SurveyChart() {
  return (
    <Card variant="elevated" className="col-span-2">
      <CardHeader>
        <CardTitle>Survey Responses Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSurveys" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(172, 66%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
              <XAxis
                dataKey="name"
                stroke="hsl(215, 16%, 47%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(215, 16%, 47%)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(214, 32%, 91%)",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px hsl(222, 47%, 11%, 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="responses"
                stroke="hsl(199, 89%, 48%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorResponses)"
              />
              <Area
                type="monotone"
                dataKey="surveys"
                stroke="hsl(172, 66%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSurveys)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
