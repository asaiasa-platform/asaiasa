"use client";

// import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { JobFormValues } from "@/lib/types";
import { useState } from "react";
import JobFormPage from "@/features/job-manage/components/JobFormPage";
import { toast } from "@/hooks/use-toast";
import { createJob } from "@/features/job-manage/api/action";
import { useRouter } from "@/i18n/routing";

export default function AddJobPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<JobFormValues>({
    defaultValues: {
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
      const result = await createJob(params.orgId, data);

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
          title: "Failed to create job",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

  return (
    <JobFormPage
      form={form}
      onSubmit={onSubmit}
      isEditing={false}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      //   onCancel={() => router.push("/job-management")}
      //   onDelete={() => handleDelete(params.id)}
    />
  );
}
