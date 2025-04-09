import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useEffect, useMemo, useState, useTransition } from "react";

interface JobFilters {
  esgJobCategory: string;
  // search: string;
  location: string;
  remote: boolean;
  minSalary: number;
  maxSalary: number;
  workType: string;
  careerStage: string;
}

export function useJobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Create a memoized version of the current URL params
  const currentFilters = useMemo(
    () => ({
      esgJobCategory: searchParams.get("esgJobCategory") ?? "",
      // search: searchParams.get("search") ?? "",
      location: searchParams.get("location") ?? "",
      remote: searchParams.get("remote") === "true",
      minSalary: searchParams.get("minSalary")
        ? Number(searchParams.get("minSalary"))
        : 0,
      maxSalary: searchParams.get("maxSalary")
        ? Number(searchParams.get("maxSalary"))
        : 0,
      workType: searchParams.get("workType") ?? "",
      careerStage: searchParams.get("careerStage") ?? "",
    }),
    [searchParams]
  );

  // Keep local state in sync with URL params
  const [filters, setFilters] = useState<JobFilters>(currentFilters);

  // Update local state when URL params change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const updateFilter = (
    key: keyof JobFilters,
    value: string | boolean | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Handle each filter
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        if (typeof value === "boolean") {
          params.set(key, "true");
        } else {
          params.set(key, value.toString());
        }
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`/jobs/page/1?${params.toString()}`, { scroll: false });
      router.refresh();
    });
  };

  const clearFilters = () => {
    // Reset all filters to default values
    const defaultFilters: JobFilters = {
      esgJobCategory: "",
      // search: "",
      location: "",
      remote: false,
      minSalary: 0,
      maxSalary: 0,
      workType: "",
      careerStage: "",
    };

    setFilters(defaultFilters);

    const params = new URLSearchParams(searchParams);

    Object.entries(defaultFilters).forEach(([key]) => {
      params.delete(key);
    });

    startTransition(() => {
      router.push(`/jobs/page/1?${params.toString()}`, { scroll: false });
      router.refresh();
    });
  };

  // Memoize the active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      // Skip search parameter from count
      if (key === "search") return count;

      // Handle different types of values
      if (typeof value === "boolean") {
        return value ? count + 1 : count;
      }
      if (typeof value === "number") {
        return value > 0 ? count + 1 : count;
      }
      return value ? count + 1 : count;
    }, 0);
  }, [filters]);

  return {
    filters,
    updateFilter,
    applyFilters,
    clearFilters,
    getActiveFiltersCount: () => activeFiltersCount,
    isPending,
  };
}
