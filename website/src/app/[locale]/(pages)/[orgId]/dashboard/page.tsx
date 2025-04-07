"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CalendarIcon, UserIcon, BriefcaseIcon } from "lucide-react";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
import { useAuth } from "@/context/AuthContext";
import { getMyOrgs } from "@/features/organization/api/action";
import { OrganizationCardProps } from "@/lib/types";

const data = [
  {
    name: "Jan",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Feb",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Mar",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Apr",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "May",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
  {
    name: "Jun",
    total: Math.floor(Math.random() * 5000) + 1000,
  },
];

export default function DashboardPage({
  params,
}: Readonly<{
  params: { orgId: string };
}>) {
  const [greeting, setGreeting] = useState("Good morning");
  const { userProfile } = useAuth();
  const [org, setOrg] = useState<OrganizationCardProps>();
  const orgId = params.orgId;

  // Update greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else if (hour >= 18) {
      setGreeting("Good evening");
    }
  }, []);

  useEffect(() => {
    const fetchOrgById = async () => {
      const orgArr: OrganizationCardProps[] = await getMyOrgs();
      console.log(orgArr);
      if (data) {
        const org = orgArr.find((org) => org.id.toString() === orgId);
        console.log(org);
        setOrg(org);
      }
    };
    fetchOrgById();
  }, [orgId]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 h-full overflow-y-scroll">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {greeting}, {userProfile?.firstName}
        </h2>
        <div className="flex items-center space-x-2">
          <Button>Download Report</Button>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employees
            </CardTitle>
            <UserIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{org?.numberOfMembers}</div>
            {/* <p className="text-xs text-muted-foreground">
              +10% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Open Positions
            </CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{org?.numberOfOpenJobs}</div>
            {/* <p className="text-xs text-muted-foreground">+2 new this week</p> */}
          </CardContent>
        </Card>
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lived Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{org?.numberOfEvents}</div>
            {/* <p className="text-xs text-muted-foreground">
              Next event in 3 days
            </p> */}
          </CardContent>
        </Card>
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Employee Satisfaction
            </CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last quarter
            </p>
          </CardContent>
        </Card> */}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Employee Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="flex justify-center items-center my-auto">
              Under Development
            </div>
            {/* <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer> */}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center items-center my-auto">
              Under Development
            </div>
            {/* <div className="space-y-8">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-row justify-between w-full ">
                  <div className="ml-4 space-y-1 ">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-sm text-muted-foreground">
                      Applied for Software Engineer position
                    </p>
                  </div>
                  <div className="ml-auto font-[4px] ">Just now</div>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div className="flex flex-row justify-between w-full">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Jane Smith
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created a new event: Team Building
                    </p>
                  </div>
                  <div className="ml-auto font-[4px]">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>RJ</AvatarFallback>
                </Avatar>
                <div className="flex flex-row justify-between w-full">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Robert Johnson
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Updated the employee handbook
                    </p>
                  </div>
                  <div className="ml-auto font-[4px]">Yesterday</div>
                </div>
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
