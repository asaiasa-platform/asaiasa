"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategoryStatsProps {
  CategoryData: {
    amount: number;
    category: { value: number; label: string };
  }[];
}

export function CategoryStats({ CategoryData }: Readonly<CategoryStatsProps>) {
  // Array of colors for categories
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-indigo-500",
    "bg-orange-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];

  // Calculate total amount for percentage
  const totalAmount = CategoryData.reduce(
    (sum, category) => sum + category.amount,
    0
  );

  return (
    <div className="space-y-6">
      {CategoryData.map((x, index) => {
        // Use modulo to cycle through colors if there are more categories than colors
        const colorClass = colors[index % colors.length];

        return (
          <div key={x.category.label} className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium capitalize">{x.category.label}</span>
              <span className="text-muted-foreground">{x.amount} ครั้ง</span>
            </div>
            <div className="flex items-center gap-2">
              <Progress
                value={(x.amount / totalAmount) * 100}
                className="h-2"
                indicatorClassName={colorClass}
              />
              <span className="text-xs text-muted-foreground w-12 text-right">
                {Math.round((x.amount / totalAmount) * 100)}%
              </span>
            </div>
          </div>
        );
      })}

      <div className="pt-4">
        <Card className="p-4">
          <div className="grid grid-cols-2 gap-4">
            {CategoryData.map((x, index) => {
              // Use the same color mapping for consistency
              const colorClass = colors[index % colors.length];

              return (
                <div
                  key={`legend-${x.category.label}`}
                  className="flex items-center gap-2"
                >
                  <div className={`h-3 w-3 rounded-full ${colorClass}`} />
                  <span className="text-sm capitalize">{x.category.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
