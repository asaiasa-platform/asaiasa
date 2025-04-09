"use client";

import { useParams, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";

interface PaginationProps {
  type: "events" | "jobs" | "orgs";
  totalPages: number;
}

export default function ListPagination({
  type,
  totalPages,
}: Readonly<PaginationProps>) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { page } = params;
  const [currentPage, setCurrentPage] = useState<number>(Number(page) || 1);
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (page) {
      setCurrentPage(Number(page));
    }
  }, [page]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Determine number of visible pages based on screen size
  const getVisiblePages = () => {
    if (windowWidth >= 1024) return 5; // lg and above
    if (windowWidth >= 768) return 3; // md
    if (windowWidth >= 640) return 2; // sm
    return 2; // xs
  };

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    const basePath = `/${type}/page/`;
    const newPath = `${basePath}${page}${
      newSearchParams.toString() ? `?${newSearchParams.toString()}` : ""
    }`;
    router.push(newPath);
  };

  const getPageRange = () => {
    const visiblePages = getVisiblePages();
    const halfVisible = Math.floor(visiblePages / 2);
    let start = Math.max(currentPage - halfVisible, 1);
    let end = Math.min(start + visiblePages - 1, totalPages);

    if (end === totalPages) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    if (start === 1) {
      end = Math.min(visiblePages, totalPages);
    }

    return { start, end };
  };

  const { start, end } = getPageRange();
  const pageNumbers = Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  );

  return (
    <Pagination>
      <PaginationContent className="flex flex-wrap gap-1">
        <PaginationItem>
          <PaginationPrevious
            className={`text-xs md:text-sm ${
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) handlePageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            tabIndex={currentPage === 1 ? -1 : 0}
          />
        </PaginationItem>

        {start > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(1);
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {start > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}

        {pageNumbers.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href="#"
              isActive={currentPage === pageNum}
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(pageNum);
              }}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {end < totalPages && (
          <>
            {end < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                className="text-xs md:text-sm"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(totalPages);
                }}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            className={`text-xs md:text-sm ${
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) handlePageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
            tabIndex={currentPage === totalPages ? -1 : 0}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
