"use client";

import { DatePickerWithRange } from "@/components/common/DateRangePicker";
import ImageDialog from "@/components/common/ImageDialog";
import RichTextEditor from "@/components/common/RichTextEditor";
import TimeRangePicker from "@/components/common/TimeRangePicker";
import { provinces } from "@/components/config/Provinces";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";

import { EventFormValues } from "@/lib/types";
import { alphabeticLength, fetchCategories } from "@/lib/utils";
import { EventPublishToggle } from "./publish-toggle";
import GenericMultipleSelector from "@/components/common/MultiSelectWithSearch";
import { useLocale } from "next-intl";

interface EventFormPageProps {
  form: UseFormReturn<EventFormValues>;
  onSubmit: (data: EventFormValues) => Promise<void>;
  isEditing: boolean;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onDelete?: () => Promise<void>;
}

export default function EventFormPage({
  form,
  onSubmit,
  onDelete,
  isEditing,
  isDialogOpen,
  setIsDialogOpen,
}: Readonly<EventFormPageProps>) {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
    setError,
    clearErrors,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contactChannels",
  });

  const isRemote = watch("locationType") === "online";

  useEffect(() => {
    setLogoPreview(form.getValues("picUrl"));
  }, [form]);

  const validateAndOpenDialog = async () => {
    // remove inappropiate form value
    if (isRemote) {
      setValue("province", "");
      setValue("country", "");
      setValue("latitude", "");
      setValue("longitude", "");
    }

    // display all form value
    console.log(form.getValues());

    // Trigger all field validations
    const isFormValid = await form.trigger();

    // Check if the form is valid and there are no custom errors
    if (isFormValid) {
      setIsDialogOpen(true);
    } else {
      // Show error toast and scroll to the first error
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
      });

      // Find and scroll to the first error
      const firstError = document.querySelector(".error-msg");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };

  const handleOnDelete = async () => {
    if (onDelete) {
      setIsRemoving(true);
      await onDelete();
      setIsRemoving(false);
    }
  };

  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 10MB) and type (JPEG/PNG)
      if (file.size > 10 * 1024 * 1024) {
        setError("picUrl", {
          type: "manual",
          message: "File size must be less than 10MB",
        });
        return;
      }

      // Validate file type
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        setError("picUrl", {
          type: "manual",
          message: "Only JPEG and PNG files are allowed",
        });
        return;
      }

      // Additional check for file extension
      const fileName = file.name.toLowerCase();
      if (
        !fileName.endsWith(".jpg") &&
        !fileName.endsWith(".jpeg") &&
        !fileName.endsWith(".png")
      ) {
        setError("picUrl", {
          type: "manual",
          message: "Only .jpg, .jpeg, and .png files are allowed",
        });
        return;
      }

      // If validation passes, clear previous errors
      clearErrors("picUrl");

      const reader = new FileReader();
      reader.onload = () => {
        const fileString = reader.result as string;
        setValue("picUrl", fileString); // Update the form's logo value
        setLogoPreview(fileString); // Set image preview
      };
      reader.readAsDataURL(file);
    } else {
      setError("picUrl", {
        type: "manual",
        message: "Please select a valid file",
      });
    }
  };

  const handleUploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e: Event) =>
      handlePosterChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    input.click();
  };

  return (
    <div className="flex gap-4 px-4 py-4 h-full overflow-y-auto">
      <div className="w-full border-r pr-4 h-fit">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium mb-2 border-l-4 pl-2 border-orange-500">
            {isEditing ? "Edit Event Information" : "Create New Event"}
          </h1>
          {/* publish toggle button */}
          {isEditing && (
            <div className="flex items-center gap-3 border border-gray-300 bg-white px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <EventPublishToggle form={form} />
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex justify-start items-start gap-5 mt-6 mx-auto">
              {logoPreview ? (
                <div
                  style={{ aspectRatio: "3/4" }}
                  className="rounded-sm overflow-hidden h-[400px] w-auto drop-shadow-md border group"
                >
                  <div className="absolute top-1 right-1 transform z-50 invisible group-hover:visible">
                    <button
                      onClick={handleUploadImage}
                      type="button"
                      className="text-sm text-white text-medium bg-black/40 hover:bg-black/80 px-4 py-[6px] rounded-md"
                    >
                      Change File
                    </button>
                  </div>

                  <div className="invisible group-hover:visible absolute top-1 left-1 transform z-50">
                    <ImageDialog imgUrl={logoPreview} />
                  </div>

                  <Image
                    style={{ aspectRatio: "3/4" }}
                    src={logoPreview}
                    alt="Logo"
                    className="object-cover"
                    width={500}
                    height={500}
                  />
                </div>
              ) : (
                <div
                  className="bg-white text-gray-400 flex flex-col text-center items-center 
                justify-center rounded-sm h-[400px] w-auto border p-4"
                  style={{ aspectRatio: "3/4" }}
                >
                  <CloudUpload className="w-12 h-12 mx-auto" />
                  <p className="text-sm mt-2">Upload Poster</p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {"Aspect ratio: 3:4"}
                  </p>
                  <p className="text-xs mt-1 text-muted-foreground">
                    {"Max 10 MB"}
                  </p>
                  <button
                    onClick={handleUploadImage}
                    type="button"
                    className="mt-2 text-sm text-white text-medium bg-black px-4 py-[6px] rounded-md"
                  >
                    Choose File
                  </button>
                  <input
                    {...register("picUrl", {
                      required: isEditing ? false : "Event poster is required",
                    })}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={handlePosterChange}
                  />
                  {errors.picUrl && (
                    <p className="text-center error-msg mt-2">
                      {errors.picUrl.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2 min-w-[350px] flex-1">
              <div className="mt-6 w-full">
                <div>
                  <Label htmlFor="name" className="text-lg">
                    Event Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    placeholder="Enter event name"
                    className="rounded-md border border-gray-300 shadow-sm sm:text-sm"
                    {...register("name", {
                      required: "Event name is required",
                      minLength: {
                        value: 3,
                        message:
                          "Event name must be at least 3 characters long",
                      },
                      maxLength: {
                        value: 100,
                        message: "Event name cannot exceed 100 characters",
                      },
                    })}
                  />
                  {errors.name && (
                    <p className="error-msg">{errors.name.message}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-start items-start flex-wrap gap-4 flex-1 w-full">
                  <DatePickerWithRange
                    form={form}
                    className="w-full flex-1 min-w-[350px]"
                    errMsg={"Start date is required"}
                  />
                  <TimeRangePicker
                    form={form}
                    className="w-full flex-1 min-w-[350px]"
                    errMsgStartTime={"Start time is required"}
                    errMsgEndTime={"End time is required"}
                  />
                </div>
              </div>
              <div className="mt-4">
                <Label htmlFor="priceType">Price Type</Label>
                <Controller
                  name="priceType"
                  control={control}
                  rules={{ required: "Price type is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose 'Free' or 'Paid'" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priceType && (
                  <p className="error-msg">{errors.priceType.message}</p>
                )}
              </div>
              <div className="mt-4">
                <Label>Categories</Label>
                <GenericMultipleSelector
                  maxSelected={5}
                  form={form}
                  errMessage={"At least one category is required"}
                  name="categories"
                  onSearch={(value) => fetchCategories(value, "event")}
                />
                {errors.categories && (
                  <p className="error-msg">{errors.categories.message}</p>
                )}
              </div>
              <div className="mt-4">
                <Label htmlFor="audience">Audience Level</Label>
                <Controller
                  name="audience"
                  control={control}
                  rules={{ required: "Audience level is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose 'General' or 'Professional'" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="professionals">
                          Professional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.priceType && (
                  <p className="error-msg">{errors.priceType.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="content">Description</Label>
            <Controller
              name="content"
              control={control}
              rules={{
                required: "Event description is required",
                validate: {
                  minLength: (value) => {
                    if (alphabeticLength(value) < 10) {
                      return "Description must be at least 10 characters long";
                    }
                  },
                  maxLength: (value) => {
                    if (alphabeticLength(value) > 5000) {
                      return "Description cannot exceed 5000 characters";
                    }
                  },
                },
              }}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            {errors.content && (
              <p className="error-msg">{errors.content.message}</p>
            )}
          </div>

          {/* Map geolocation */}
          <div className="flex flex-col gap-2 mt-2">
            <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
              Map & Location
            </h1>
            <div className="mt-1">
              <Label htmlFor="locationType">Event Type</Label>
              <Controller
                name="locationType"
                control={control}
                rules={{ required: "Event type is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose Online or Onsite" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="onsite">Onsite</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priceType && (
                <p className="error-msg">{errors.priceType.message}</p>
              )}
            </div>
            {watch("locationType") !== "" && (
              <div className="mb-2">
                <Label htmlFor="locationName">
                  {isRemote ? "Channel Name" : "Location Name"}
                </Label>
                <Input
                  type="text"
                  id="locationName"
                  className="block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                  placeholder={
                    isRemote
                      ? "e.g. Discord, MS Team, Zoom, etc."
                      : "Enter location name"
                  }
                  {...register("locationName", {
                    required: "Location name is required",
                  })}
                />
                {errors.locationName && (
                  <p className="error-msg">{errors.locationName.message}</p>
                )}
              </div>
            )}
            {/* hide province country lat long when event is remote or the location type is not filled */}
            {!isRemote && watch("locationType") !== "" && (
              <>
                <div className="flex gap-4">
                  <div className="flex-1">
                    {/* province */}
                    <Label htmlFor="province">Province</Label>
                    <Controller
                      name="province"
                      control={control}
                      rules={{ required: "Province is required" }}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger
                            className="placeholder:font-light placeholder:text-sm"
                            id="province"
                          >
                            <SelectValue
                              className="font-light placeholder:font-light [&:not(:placeholder-shown)]:font-normal"
                              placeholder="สถานที่"
                            />
                          </SelectTrigger>
                          <SelectContent className="h-[300px]">
                            {provinces.map((province) => (
                              <SelectItem
                                className="text-sm"
                                key={province.code}
                                value={province.code}
                              >
                                {locale === "th" ? province.th : province.en}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.province && (
                      <p className="error-msg mt-1">
                        {errors.province.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="country">Country</Label>
                    <Controller
                      name="country"
                      control={control}
                      rules={{ required: "Country is required" }}
                      defaultValue={watch("country")}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger id="country">
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="TH">Thailand</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.country && (
                      <p className="error-msg mt-1">{errors.country.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-2">
                  <span className="text-base font-medium">Map Coordinate</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (required for map display)"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <Label
                      htmlFor="latitude"
                      className="text-xs text-muted-foreground"
                    >
                      Latitude
                    </Label>
                    <Input
                      id="latitude"
                      {...register("latitude", {
                        required: "Latitude is required",
                      })}
                      placeholder="13.7563..."
                    />
                    {errors.latitude && (
                      <p className="error-msg mt-1">
                        {errors.latitude.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label
                      htmlFor="longitude"
                      className="text-xs text-muted-foreground"
                    >
                      Longitude
                    </Label>
                    <Input
                      id="longitude"
                      {...register("longitude", {
                        required: "Longitude is required",
                      })}
                      placeholder="100.3456..."
                    />
                    {errors.longitude && (
                      <p className="error-msg mt-1">
                        {errors.longitude.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
          {/* Reg link */}
          <div>
            <p className="text-base font-medium border-l-4 pl-2 border-orange-500">
              Registration Link
            </p>
            <div className="mt-2">
              <Input
                type="text"
                id="registerLink"
                placeholder="Link to registration form or page"
                className="block w-full rounded-md border border-gray-300 shadow-sm sm:text-sm"
                {...register("registerLink", {
                  required: "Registration link is required",
                  pattern: {
                    value:
                      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                    message: "Invalid URL format",
                  },
                })}
              />
              {errors.registerLink && (
                <p className="error-msg mt-1">{errors.registerLink.message}</p>
              )}
            </div>
          </div>

          {/* Contact Channels */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
                Contact Channels
              </h1>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={fields.length >= 4}
                onClick={() => append({ media: "", mediaLink: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Channel
              </Button>
            </div>
            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <Label htmlFor={`contactChannels.${index}.media`}>
                      Channel Name
                    </Label>
                    <Controller
                      name={`contactChannels.${index}.media`}
                      control={control}
                      rules={{
                        required: "Channel type is required",
                      }}
                      render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} value={value}>
                          <SelectTrigger id={`contactChannels.${index}.media`}>
                            <SelectValue placeholder="e.g. Facebook, Twitter, LinkedIn" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Facebook">Facebook</SelectItem>
                            <SelectItem value="Twitter">Twitter</SelectItem>
                            <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                            <SelectItem value="Instagram">Instagram</SelectItem>
                            <SelectItem value="Website">Website</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.contactChannels?.[index]?.media && (
                      <p className="error-msg mt-1">
                        {errors.contactChannels[index].media?.message}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={`contactChannels.${index}.mediaLink`}>
                      URL
                    </Label>
                    <Input
                      id={`contactChannels.${index}.mediaLink`}
                      placeholder="https://"
                      {...register(`contactChannels.${index}.mediaLink`, {
                        required: "Channel URL is required",
                        pattern: {
                          value:
                            /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
                          message:
                            "Invalid URL format (e.g. https://www.example.com)",
                        },
                      })}
                    />
                    {errors.contactChannels?.[index]?.mediaLink && (
                      <p className="error-msg mt-1">
                        {errors.contactChannels[index].mediaLink.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-between gap-4 mt-6">
            <div>
              {isEditing && (
                <Button
                  type="button"
                  onClick={() => setOpenDeleteDialog(true)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-500 rounded-md
                        border border-transparent hover:border-red-500 hover:bg-transparent bg-transparent shadow-none"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Event</span>
                </Button>
              )}
              <AlertDialog open={openDeleteDialog}>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-lg font-semibold">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      You will remove this event permanently.
                      <p className="mt-1 text-sm font-light italic text-muted-foreground">
                        (This action cannot be undone.)
                      </p>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel
                      className="w-full sm:w-auto"
                      disabled={isRemoving}
                      onClick={() => setOpenDeleteDialog(false)}
                    >
                      {"Cancel"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleOnDelete}
                      className="w-full bg-destructive hover:bg-destructive/90 sm:w-auto"
                      disabled={isRemoving}
                    >
                      {isRemoving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="flex justify-end gap-4 flex-1">
              {/* <Button variant="outline" className="w-full lg:max-w-[200px]">
                Save as Draft
              </Button> */}

              <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => !isSubmitting && setIsDialogOpen(open)}
              >
                <Button
                  type="button"
                  onClick={validateAndOpenDialog}
                  disabled={isSubmitting}
                  className="w-full max-w-[200px]"
                >
                  Submit
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Publication</DialogTitle>
                    <DialogDescription className="text-sm text-gray-700">
                      Are you sure you want to save and publish this event? This
                      action cannot be undone.
                    </DialogDescription>
                    <div className="border-t mt-6 pt-4">
                      <div className="mx-auto flex justify-between items-center border rounded-lg w-full max-w-xs py-3 px-6 bg-gray-50 shadow-sm hover:shadow-md transition duration-200">
                        <span className="flex flex-col justify-center  items-center gap-2 text-sm font-medium text-gray-700">
                          <span className="text-sm">Status:</span>
                          <span
                            className={`text-sm font-medium ${
                              form.watch("status") === "published"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {form.watch("status") === "published"
                              ? "Will Be Published"
                              : "Will Not Publish"}
                          </span>
                        </span>
                        <div className="flex items-center gap-3">
                          <EventPublishToggle form={form} />
                        </div>
                      </div>

                      <div className="text-xs font-light italic text-center mt-3 text-gray-500">
                        This will publish the event and make it visible to the
                        public.
                      </div>
                    </div>
                  </DialogHeader>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Loading
                        </>
                      ) : (
                        "Confirm"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
