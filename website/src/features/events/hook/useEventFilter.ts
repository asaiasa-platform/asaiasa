import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";

interface EventFilters {
  dateRange: string;
  location: string;
  audience: string;
  price: string;
}

export default function useEventFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Create a memoized version of the current URL params
  const currentFilters = useMemo(() => {
    return {
      dateRange: searchParams.get("dateRange") ?? "",
      location: searchParams.get("location") ?? "",
      audience: searchParams.get("audience") ?? "",
      price: searchParams.get("price") ?? "",
    };
  }, [searchParams]);

  // Keep local state in sync with URL params
  const [filters, setFilters] = useState<EventFilters>(currentFilters);

  // Update local state when URL params change
  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const updateFilter = (
    key: keyof EventFilters,
    value: string | boolean | number
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams);

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      // Use router.push and wait for navigation to complete
      router.push(`/events/page/1?${params.toString()}`, { scroll: false });
      // Trigger a revalidation after navigation
      router.refresh();
    });
  };

  const clearFilters = () => {
    // Reset all filters to default values
    const defaultFilters: EventFilters = {
      dateRange: "",
      location: "",
      audience: "",
      price: "",
    };

    setFilters(defaultFilters);

    const params = new URLSearchParams(searchParams);

    Object.entries(defaultFilters).forEach(([key]) => {
      params.delete(key);
    });

    startTransition(() => {
      router.push(`/events/page/1?${params.toString()}`, { scroll: false });
      router.refresh();
    });
  };

  // Memoize the active filters count
  const activeFiltersCount = useMemo(() => {
    return Object.entries(filters).reduce((count, [key, value]) => {
      // Skip search parameter from count
      if (key === "search") return count;

      // Increment count if value is truthy
      if (value) {
        return count + 1;
      }
      return count;
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
