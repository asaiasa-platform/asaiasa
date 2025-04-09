"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoryStats } from "@/features/statistic/components/category-stats";
import { Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getUserStatistic } from "@/features/statistic/api/action";
import { UserStat } from "@/lib/types";

export default function UserStatisticsPage() {
  const [userStat, setUserStat] = useState<UserStat | null>(null);

  const { userProfile } = useAuth();

  useEffect(() => {
    const fetchUserStat = async () => {
      const result = await getUserStatistic();
      console.log(result);
      if (result) {
        setUserStat(result);
      }
    };
    fetchUserStat();
  }, []);

  if (!userProfile) return null;

  const { firstName, lastName, email, picUrl } = userProfile;

  return (
    <div className="container mx-auto py-8 px-4 mt-[65px] max-w-[1170px]">
      <div className="grid gap-8 md:grid-cols-3">
        {/* User Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src={picUrl} alt={firstName} />
              <AvatarFallback className="capitalize">
                {firstName.charAt(0) + lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{firstName + " " + lastName}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Users className="h-5 w-5 text-muted-foreground mb-2" />
                  <span className="text-2xl font-bold">
                    {userStat && userStat.totalEvents >= 0
                      ? userStat.totalEvents
                      : 0}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    อีเว้นท์ที่เข้าร่วม
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Section */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>ประเภทอีเว้นท์</CardTitle>
              <CardDescription>
                ประเภทอีเว้นท์ต่างๆ ที่เคยเข้าร่วม
              </CardDescription>
            </CardHeader>
            <CardContent>
              {userStat && userStat.CategoryData?.length > 0 ? (
                <CategoryStats CategoryData={userStat.CategoryData} />
              ) : (
                <div className="flex justify-center items-center text-muted-foreground">
                  <p>ไม่พบข้อมูลของคุณ</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
