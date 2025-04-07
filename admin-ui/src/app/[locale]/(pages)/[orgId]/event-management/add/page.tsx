"use client";

import { createEvent } from "@/features/event-manage/api/action";
import EventFormPage from "@/features/event-manage/components/EventFormPage";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { EventFormValues } from "@/lib/types";
import { base64ToFile } from "@/lib/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddEventPage({
  params,
}: Readonly<{ params: { orgId: string } }>) {
  const router = useRouter();
  const form = useForm<EventFormValues>({
    defaultValues: {
      picUrl: "",
      name: "",
      content: "",
      locationName: "",
      locationType: "",
      audience: "",
      province: "",
      country: "TH",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      latitude: "",
      longitude: "",
      priceType: "",
      registerLink: "",
      status: "draft",
      categories: [],
      contactChannels: [{ media: "", mediaLink: "" }],
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = async (data: EventFormValues) => {
    if (!data.picUrl) {
      form.setError("picUrl", {
        type: "manual",
        message: "Please upload an image",
      });
      return;
    }

    if (!form.formState.isValid) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
      });
      return;
    }

    // Create FormData object
    const formData = new FormData();

    // Exclude `logo` from `data`
    const { picUrl, ...otherData } = data;
    console.log(data);

    // create image file from base64 string
    const uniqueFilename = `event_${Date.now()}.png`;
    const imgFile = base64ToFile(picUrl, uniqueFilename);

    // Append image to FormData
    if (imgFile instanceof File) {
      formData.append("image", imgFile);
    }

    // construct json from other data fields exclude image
    const jsonData = JSON.stringify({
      ...otherData,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
    });
    formData.append("event", jsonData);

    // display all form value
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const result = await createEvent(params.orgId, formData);

      if (!result.success) {
        throw new Error(result.error);
      }
      toast({
        title: "Success",
        description: result.message,
      });

      router.push(`/${params.orgId}/event-management`);
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to create event",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

  return (
    <EventFormPage
      form={form}
      onSubmit={onSubmit}
      isEditing={false}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
    />
  );
}
