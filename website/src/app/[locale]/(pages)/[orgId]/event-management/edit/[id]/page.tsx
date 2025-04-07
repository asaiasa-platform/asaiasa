"use client";

import Spinner from "@/components/ui/spinner";
import {
  deleteEvent,
  getOrgEventById,
  updateEvent,
} from "@/features/event-manage/api/action";
import EventFormPage from "@/features/event-manage/components/EventFormPage";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import type { EventFormValues } from "@/lib/types";
import { base64ToFile } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditEventPage({
  params,
}: Readonly<{ params: { orgId: string; id: string } }>) {
  const orgId = params.orgId;
  const eventId = params.id;
  const router = useRouter();
  const [initialValues, setInitialValues] = useState<EventFormValues | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<EventFormValues>({
    defaultValues: initialValues || {
      picUrl: "",
      name: "",
      content: "",
      locationName: "",
      locationType: "",
      audience: "",
      province: "",
      country: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      latitude: "",
      longitude: "",
      priceType: "",
      registerLink: "",
      status: "",
      categories: [],
      contactChannels: [{ media: "", mediaLink: "" }],
    },
  });

  // Fetch event data from the server
  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const result = await getOrgEventById(orgId, eventId);
        const event = result.data;
        console.log(event);

        // Transform the data if necessary
        const formattedEvent: EventFormValues = {
          ...event,
          startDate: event.startDate
            ? new Date(event.startDate).toISOString().split("T")[0]
            : "",
          endDate: event.endDate
            ? new Date(event.endDate).toISOString().split("T")[0]
            : "",
          // Add any other necessary transformations here
        };

        setInitialValues(formattedEvent);
        form.reset(formattedEvent);
      } catch (error) {
        console.error("Failed to fetch event:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event data. Please try again.",
        });
        router.push(`/${orgId}/event-management`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [orgId, eventId, form, router]);

  const onDelete = async () => {
    try {
      const result = await deleteEvent(orgId, eventId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsDialogOpen(false);
      toast({ title: "Success", description: result.message });
      router.push(`/${orgId}/event-management`);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to delete event",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

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

    const formData = new FormData();
    const { picUrl, ...otherData } = data;

    // if picUrl is updated then add it to image field in FormData
    if (picUrl.startsWith("data:image")) {
      // Convert base64 image to file for upload
      const uniqueFilename = `event_${Date.now()}.png`;
      const imgFile = base64ToFile(picUrl, uniqueFilename);
      if (imgFile instanceof File) {
        formData.append("image", imgFile);
      }
    }

    // Construct JSON event data
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
      const result = await updateEvent(params.orgId, eventId, formData);
      if (!result.success) {
        throw new Error(result.error);
      }

      setIsDialogOpen(false);
      toast({ title: "Success", description: result.message });
      router.push(`/${params.orgId}/event-management`);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to update event",
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
    <EventFormPage
      form={form}
      onSubmit={onSubmit}
      isEditing={true}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      onDelete={onDelete}
    />
  );
}
