"use client";

import { inviteCallback } from "@/features/team-manage/api/action";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function InviteCallback() {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Verifying your invitation...");
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyInvitation = async () => {
      try {
        const token = searchParams.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Invalid invitation link. No token provided.");
          return;
        }

        const result = await inviteCallback(token ?? "");

        if (!result.success) {
          throw new Error(result.error);
        }

        setStatus("success");
        setMessage(
          "Invitation accepted successfully! You can close this window."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          "Failed to verify invitation. Please try again or contact support."
        );
      }
    };

    verifyInvitation();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-10">
        <div className="text-center">
          {/* Status Icon */}
          {status === "loading" && (
            <div className="w-16 h-16 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin mx-auto mb-4" />
          )}
          {status === "success" && (
            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
          {status === "error" && (
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}

          {/* Message */}
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {status === "loading"
              ? "Verifying Invitation"
              : status === "success"
              ? "Welcome!"
              : "Verification Failed"}
          </h2>
          <p className="text-gray-600">{message}</p>

          {/* Action Buttons */}
          {/* {status === "error" && (
            <div className="mt-6">
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )} */}
          {status === "success" && (
            <div className="mt-6">
              <a
                href="/my-organizations"
                className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
              >
                View My Organizations
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
