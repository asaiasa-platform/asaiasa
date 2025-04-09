"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

import Spinner from "@/components/ui/spinner";
import {
  ListCategories,
  CreatePreferences,
  GetUserPreference,
  UpdatePreference,
} from "@/features/preferences/api/action";
import { CategoryProps } from "@/lib/types";
import toast from "react-hot-toast";
import { Link } from "@/i18n/routing";
import { getCategoryIcon, getCategoryName } from "@/lib/utils";

export default function PreferencesPage() {
  const [selectedCategories, setSelectedCategories] = useState<CategoryProps[]>(
    []
  );
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const excludeVal = [10, 1, 2, 14, 15];
        const [categoriesData, preference] = await Promise.all([
          ListCategories(),
          GetUserPreference(),
        ]);

        if (!categoriesData) {
          throw new Error("Failed to get categories");
        }

        console.log("All Categories:", categoriesData);
        console.log("User preference:", preference);

        const filteredCategories = categoriesData.filter(
          (category: CategoryProps) => !excludeVal.includes(category.value)
        );

        if (preference) {
          // Match selected categories with existing list
          const selected = filteredCategories.filter((category) =>
            preference.some(
              (pref: CategoryProps) => pref.value === category.value
            )
          );
          setSelectedCategories(selected);
          setIsEdit(true);
        }

        setCategories(filteredCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleCategory = (category: CategoryProps) => {
    // if (selectedCategories.length >= 4) {
    //   toast.error("คุณสามารถเลือกไม่เกิน 4 หมวดหมู่");
    // }
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((id) => id !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let result;
    if (isEdit) {
      // if user already has preference
      result = await UpdatePreference(selectedCategories);
    } else {
      // if user doesn't have preference
      result = await CreatePreferences(selectedCategories);
    }

    if (result.success) {
      toast.success("บันทึกสําเร็จ");
    } else {
      toast.error("บันทึกไม่สําเร็จ กรุณาลองใหม่อีกครั้ง");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="w-[100vw] h-[100vh] overflow-y-auto bg-white px-10">
      <div className="container max-w-5xl py-2 mx-auto">
        <Link href="/home" className="p-1">
          <div className="flex gap-2">
            <ArrowLeft height={30} width={30} />
            <p className="self-center hidden sm:block">กลับสู่หน้าหลัก</p>
          </div>
        </Link>
        <div className="space-y-6 text-center mb-10">
          <h1 className="text-3xl font-bold">เลือกหมวดหมู่ที่สนใจ</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            กรุณาเลือกหมวดหมู่ที่คุณสนใจ
            เพื่อการแสดงผลกิจกรรมและงานที่ตรงตามความสนใจของคุณ
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-1 justify-center items-center w-full pt-16 pb-20">
            <Spinner />
            <span className="text-center">Loading...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              const Icon = getCategoryIcon(category.label);

              return (
                <Card
                  key={category.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected
                      ? "border-orange-normal bg-white/5 ring-1 ring-orange-normal"
                      : "hover:border-primary/50"
                  }`}
                  onClick={() => {
                    !isSubmitting && toggleCategory(category);
                  }}
                >
                  <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                    <Icon
                      className={`h-8 w-8 mb-2 ${
                        isSelected
                          ? "text-orange-dark"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span
                      className={`font-medium text-sm ${
                        isSelected ? "text-orange-dark" : ""
                      }`}
                    >
                      {getCategoryName(category.label)}
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={selectedCategories.length === 0 || isSubmitting}
            className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                รอสักครู่
              </>
            ) : (
              "ยืนยัน"
            )}
          </Button>
        </div>

        {/* <div className="mt-4 text-center">
        <Button variant="link" onClick={() => router.push("/dashboard")}>
          Skip for now
        </Button>
      </div> */}
      </div>
    </div>
  );
}
