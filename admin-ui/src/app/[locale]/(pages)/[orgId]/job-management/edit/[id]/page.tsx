"use client";

import { useForm } from "react-hook-form";
import { JobFormValues } from "@/lib/types";
import { useEffect, useState } from "react";
import JobFormPage from "@/features/job-manage/components/JobFormPage";
import { toast } from "@/hooks/use-toast";
import {
  deleteJob,
  getOrgJobById,
  updateJob,
} from "@/features/job-manage/api/action";
import Spinner from "@/components/ui/spinner";
import { useRouter } from "@/i18n/routing";

export default function EditJobPage({
  params,
}: Readonly<{ params: { orgId: string; id: string } }>) {
  const orgId = params.orgId;
  const jobId = params.id;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<JobFormValues | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<JobFormValues>({
    defaultValues: initialValues || {
      title: "",
      scope: "",
      prerequisite: [],
      workplace: "",
      workType: "",
      registerLink: "",
      careerStage: "",
      period: "",
      description: "",
      qualifications: "",
      quantity: undefined,
      salary: undefined,
      province: "",
      country: "",
      status: "draft",
      categories: [],
    },
  });

  // Fetch job data from the server
  useEffect(() => {
    const fetchJob = async () => {
      setIsLoading(true);
      try {
        const result = await getOrgJobById(orgId, jobId);
        const job: JobFormValues = result.data;
        console.log(job);

        setInitialValues(job);
        form.reset(job);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load job data. Please try again.",
        });
        router.push(`/${orgId}/job-management`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJob();
  }, [orgId, jobId, form, router]);

  const onDelete = async () => {
    try {
      const result = await deleteJob(orgId, jobId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsDialogOpen(false);
      toast({ title: "Success", description: result.message });
      router.push(`/${orgId}/job-management`);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to delete job",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

  const onSubmit = async (data: JobFormValues) => {
    if (!form.formState.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
      });
      return;
    }

    try {
      const result = await updateJob(orgId, jobId, data);

      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: result.message,
      });
      router.push(`/${params.orgId}/job-management`);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to update job",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-1 justify-center items-center mt-[200px] w-full">
        <Spinner />
        <span className="text-center">Loading...</span>
      </div>
    );
  }

  return (
    <JobFormPage
      form={form}
      onSubmit={onSubmit}
      isEditing={true}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      onDelete={onDelete}
    />
  );
}
