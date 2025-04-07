"use client";

import React, { useEffect, useState } from "react";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { JobFormValues } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { LinkIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { JobPublishToggle } from "./publish-toggle";
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
import { toast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { provinces } from "@/components/config/Provinces";
import { useLocale } from "next-intl";
import GenericMultipleSelector from "@/components/common/MultiSelectWithSearch";
import { fetchCategories } from "@/lib/utils";

interface JobPageProps {
  form: UseFormReturn<JobFormValues>;
  onSubmit: (data: JobFormValues) => Promise<void>;
  isEditing: boolean;
  //   onCancel: () => void;
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
  onDelete?: () => Promise<void>;
}

export default function JobFormPage({
  form,
  onSubmit,
  isEditing,
  onDelete,
  isDialogOpen,
  setIsDialogOpen,
}: Readonly<JobPageProps>) {
  const locale = useLocale();
  const [isRemoving, setIsRemoving] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prerequisite",
  });

  // form input state
  const isRemote = watch("workplace") === "remote";

  const isVolunteer = watch("workType") === "volunteer";
  useEffect(() => {
    if (isVolunteer) {
      // remove form value
      setValue("salary", 0);
    }
  }, [isVolunteer, setValue]);

  const validateAndOpenDialog = async () => {
    // remove inappropiate form value
    if (isRemote) {
      setValue("province", "");
      setValue("country", "");
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

  return (
    <div className="flex gap-4 px-4 py-4 h-full overflow-y-auto">
      <div className="w-full border-r pr-4 h-fit">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium mb-2 border-l-4 pl-2 border-orange-500">
            {isEditing ? "Edit Job Information" : "Create New Job"}
          </h1>
          {/* publish toggle button */}
          {isEditing && (
            <div className="flex items-center gap-3 border border-gray-300 bg-white px-5 py-2 rounded-lg shadow-sm hover:shadow-md transition duration-200">
              <JobPublishToggle form={form} />
            </div>
          )}
        </div>
        <form
          className="space-y-8"
          onSubmit={handleSubmit(onSubmit, (errors) =>
            console.log("errors", errors)
          )}
        >
          <div className="flex flex-col gap-2 mt-4">
            <Label
              htmlFor="title"
              className="text-base font-medium border-l-4 pl-2 border-orange-500"
            >
              Job Title
            </Label>
            <div>
              <Input
                {...register("title", { required: "Job title is required" })}
                id="title"
                className="input-outline"
                placeholder="Enter job title"
              />
              {errors.title && (
                <span className="error-msg">
                  {errors.title.message as string}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
              Location
            </h1>
            <div className="flex gap-4">
              <div className="w-full">
                <Label
                  htmlFor="workplace"
                  className="sm:text-right required-input mt-2"
                >
                  Work Place
                </Label>
                <div>
                  <Controller
                    control={form.control}
                    name="workplace"
                    rules={{ required: "Workplace is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-outline">
                          <SelectValue placeholder="Select workplace type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WorkPlaceEnum.map((workplace) => (
                            <SelectItem
                              key={workplace.value}
                              value={workplace.value}
                            >
                              {workplace.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.workplace && (
                    <span className="error-msg">
                      {errors.workplace.message as string}
                    </span>
                  )}
                </div>
              </div>
              {/* Work Type Select */}
              <div className="w-full">
                <Label
                  htmlFor="work_type"
                  className="sm:text-right required-input mt-2"
                >
                  Work Type
                </Label>
                <div>
                  <Controller
                    control={form.control}
                    name="workType"
                    rules={{ required: "Work type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="input-outline">
                          <SelectValue placeholder="Select work type" />
                        </SelectTrigger>
                        <SelectContent>
                          {WorkTypeEnum.map((workType) => (
                            <SelectItem
                              key={workType.value}
                              value={workType.value}
                            >
                              {workType.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.workType && (
                    <span className="error-msg">
                      {errors.workType.message as string}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {!isRemote && watch("workplace") !== "" && (
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
                    <p className="error-msg mt-1">{errors.province.message}</p>
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
            )}
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
              Main Details
            </h1>
            {/* Career Stage Select */}
            <div>
              <Label
                htmlFor="career_stage"
                className="sm:text-right required-input mt-2"
              >
                Career Stage
              </Label>
              <div>
                <Controller
                  control={form.control}
                  name="careerStage"
                  rules={{ required: "Career stage is required" }}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="input-outline">
                        <SelectValue placeholder="Choose level of experience" />
                      </SelectTrigger>
                      <SelectContent>
                        {CareerStageEnum.map((careerStage) => (
                          <SelectItem
                            key={careerStage.value}
                            value={careerStage.value}
                          >
                            {careerStage.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.careerStage && (
                  <span className="error-msg">
                    {errors.careerStage.message as string}
                  </span>
                )}
              </div>
            </div>
            <div>
              <Label>ESG Categories</Label>
              <GenericMultipleSelector
                maxSelected={5}
                form={form}
                errMessage={"This field is required"}
                name="categories"
                onSearch={(value) => fetchCategories(value, "job")}
              />
              {errors.categories && (
                <p className="error-msg">{errors.categories.message}</p>
              )}
            </div>
            <div>
              <Label
                htmlFor="description"
                className="sm:text-right required-input mt-2"
              >
                Description
              </Label>
              <Textarea
                {...register("description", {
                  required: "Description is required",
                })}
                id="description"
                className="input-outline"
                placeholder="Enter job responsibilities"
              />

              {errors.description && (
                <span className="error-msg">
                  {errors.description.message as string}
                </span>
              )}
            </div>
            <div>
              <Label
                htmlFor="responsibilities"
                className="sm:text-right required-input mt-2"
              >
                Responsibilities
              </Label>
              <Textarea
                {...register("scope", {
                  required: "Responsibilities is required",
                })}
                id="responsibilities"
                className="input-outline"
                placeholder="Enter job responsibilities"
              />

              {errors.scope && (
                <span className="error-msg">
                  {errors.scope.message as string}
                </span>
              )}
            </div>
            <div>
              <Label
                htmlFor="qualifications"
                className="sm:text-right required-input mt-2"
              >
                Qualifications
              </Label>
              <Textarea
                {...register("qualifications", {
                  required: "Qualifications is required",
                })}
                id="qualifications"
                className="input-outline"
                placeholder="Enter job responsibilities"
              />

              {errors.qualifications && (
                <span className="error-msg">
                  {errors.qualifications.message as string}
                </span>
              )}
            </div>
            <div>
              <Label
                htmlFor="period"
                className="sm:text-right required-input mt-2"
              >
                Work Period
              </Label>
              <div>
                <Input
                  {...register("period", {
                    required: "Period is required",
                  })}
                  id="period"
                  type="text"
                  className="input-outline"
                  placeholder="Enter work period"
                />
                {errors.period && (
                  <span className="error-msg">
                    {errors.period.message as string}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Reg link */}
          <div>
            <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
              Registration Link
            </h1>
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

          <div className="flex flex-col gap-2">
            <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
              {isVolunteer ? "Quantity" : "Quantity and Salary"}
            </h1>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label
                  htmlFor="quantity"
                  className="sm:text-right required-input mt-2"
                >
                  Quantity
                </Label>
                <div>
                  <Input
                    {...register("quantity", {
                      required: "Quantity is required",
                      validate: (value) => value > 0,
                      setValueAs: (value) => Number(value) || 0,
                    })}
                    id="quantity"
                    type="number"
                    className="input-outline"
                    placeholder="Enter job quantity"
                    min={1}
                  />
                  {errors.quantity && (
                    <span className="error-msg">
                      {errors.quantity.message as string}
                    </span>
                  )}
                </div>
              </div>
              {!isVolunteer && (
                <div className="flex-1">
                  <Label
                    htmlFor="salary"
                    className="sm:text-right required-input mt-2"
                  >
                    <span>Salary</span>
                    <span className="text-xs text-muted-foreground font-light">
                      {" (Optional)"}
                    </span>
                  </Label>

                  <div>
                    <Input
                      {...register("salary", {
                        validate: (value) => value > 0,
                        setValueAs: (value) => Number(value) || 0,
                      })}
                      id="salary"
                      type="number"
                      className="input-outline"
                      placeholder="Enter job salary"
                      min={0}
                    />
                    {errors.salary && (
                      <span className="error-msg">
                        {errors.salary.message as string}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center gap-2 border-b pb-2">
              <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
                <span>Prerequisite Courses</span>
                <span className="text-xs text-muted-foreground font-light">
                  {" (Optional)"}
                </span>
              </h1>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={fields.length >= 4}
                onClick={() => append({ title: "", link: "" })}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex justify-center items-start gap-4 mt-2"
                >
                  {/* Course Title */}
                  <div className="w-full">
                    <Input
                      {...register(`prerequisite.${index}.title`)}
                      placeholder="Enter course title"
                    />
                    {errors.prerequisite?.[index]?.title && (
                      <p className="error-msg mt-1">
                        {errors.prerequisite[index].title.message}
                      </p>
                    )}
                  </div>

                  {/* Course URL */}

                  <div className="relative w-full">
                    <LinkIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register(`prerequisite.${index}.link`)}
                      className="pl-8"
                      placeholder="https://"
                    />
                    {errors.prerequisite?.[index]?.link && (
                      <p className="error-msg mt-1">
                        {errors.prerequisite[index].link.message}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
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
                  onClick={() => {
                    setOpenDeleteDialog(true);
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-500 rounded-md
              border border-transparent hover:border-red-500 hover:bg-transparent bg-transparent shadow-none"
                >
                  <Trash2 className="h-5 w-5" />
                  <span>Delete Job</span>
                </Button>
              )}
              <AlertDialog open={openDeleteDialog}>
                <AlertDialogContent className="max-w-md">
                  <AlertDialogHeader className="space-y-3">
                    <AlertDialogTitle className="text-lg font-semibold">
                      Are you sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                      You will remove this job permanently.
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
                  Save
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Publication</DialogTitle>
                    <DialogDescription>
                      <p className="text-center text-sm text-gray-700">
                        Are you sure you want to save and publish this event?
                        This action cannot be undone.
                      </p>

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
                            <JobPublishToggle form={form} />
                          </div>
                        </div>

                        <p className="text-xs font-light italic text-center mt-3 text-gray-500">
                          This will publish the event and make it visible to the
                          public.
                        </p>
                      </div>
                    </DialogDescription>
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

const WorkPlaceEnum = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "onsite",
    label: "On-site",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
];

const WorkTypeEnum = [
  {
    value: "fulltime",
    label: "Full-time",
  },
  {
    value: "parttime",
    label: "Part-time",
  },
  {
    value: "volunteer",
    label: "Volunteer",
  },
  {
    value: "internship",
    label: "Internship",
  },
];
const CareerStageEnum = [
  {
    value: "entrylevel",
    label: "Entry-level (~1 year)",
  },
  {
    value: "midlevel",
    label: "Mid-level (2-4 years)",
  },
  {
    value: "senior",
    label: "Senior (>5 years)",
  },
];
