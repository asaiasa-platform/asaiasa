"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2 } from "lucide-react";
import React, { useState } from "react";
import {
  useForm,
  Controller,
  useFieldArray,
  FieldValues,
} from "react-hook-form";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import GenericMultipleSelector from "@/components/common/MultiSelectWithSearch";
import { Option } from "@/components/ui/MultiSelect";
import { base64ToFile, formatExternalUrl } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { provinces } from "@/components/config/Provinces";
import { useLocale } from "next-intl";
import { createOrg } from "@/features/organization/api/action";
import ImageDialog from "@/components/common/ImageDialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function OrgRegisterPage() {
  const locale = useLocale();
  const form = useForm({
    defaultValues: {
      logo: "",
      background_image: "",
      email: "",
      name: "",
      headline: "",
      specialty: "",
      description: "",
      address: "",
      province: "",
      country: "",
      latitude: "",
      longitude: "",
      phone: "",
      organizationContacts: [{ media: "", mediaLink: "" }],
      industries: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    watch,
    clearErrors,
  } = form;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOrgRemote, setIsOrgRemote] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "organizationContacts",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );

  const handleIsRemoteClick = () => {
    setIsOrgRemote(!isOrgRemote);
    // remove form value
    setValue("address", "");
    setValue("province", "");
    setValue("country", "");
    setValue("latitude", "");
    setValue("longitude", "");
  };

  const fetchIndustries = async (value: string): Promise<Option[]> => {
    try {
      const apiUrl = formatExternalUrl("/orgs/industries/list");
      const response = await fetch(apiUrl);
      const data = await response.json();
      const industries = data.industries;
      console.log(industries);
      if (value) {
        return industries
          .filter((industry: { name: string; id: number }) =>
            industry.name.toLowerCase().includes(value.toLowerCase())
          )
          .map((industry: { name: string; id: number }) => ({
            label: industry.name,
            value: industry.id,
          }));
      } else {
        return industries.map((industry: { name: string; id: number }) => ({
          label: industry.name,
          value: industry.id,
        }));
      }
    } catch (error) {
      console.error("Error fetching industries:", error);
      return [];
    }
  };

  const validateAndOpenDialog = async () => {
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

  const onSubmit = async (data: FieldValues) => {
    // Create FormData object
    const formData = new FormData();

    // Exclude `logo` from `data`
    const { logo, background_image, ...otherData } = data;

    // create image file from base64 string
    const logoFile = base64ToFile(logo, `org_logo_${Date.now()}.png`);
    const backgroundFile = base64ToFile(
      background_image,
      `org_bg_${Date.now()}.png`
    );

    // Append image to FormData
    if (logoFile instanceof File) {
      formData.append("image", logoFile);
    }
    if (backgroundFile instanceof File) {
      formData.append("background_image", backgroundFile);
    }

    // construct json from other data fields exclude image
    const jsonData = JSON.stringify({
      ...otherData,
      latitude: data.latitude ? Number(data.latitude) : null,
      longitude: data.longitude ? Number(data.longitude) : null,
      industries: Array.isArray(data.industries)
        ? data.industries.map((industry) => industry.value)
        : [],
    });
    formData.append("org", jsonData);

    // display all form value
    formData.forEach((value, key) => {
      console.log(key, value);
    });

    try {
      const result = await createOrg(formData);

      if (!result.success) {
        throw new Error(result.error.message);
      }

      toast({
        title: "Success",
        description: result.message,
      });
      window.location.href = "/my-organizations";
      setIsDialogOpen(false);
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          title: "Failed to register organization",
          variant: "destructive",
          description: error.toString(),
        });
      }
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "logo" | "background_image"
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file size (max 10MB) and type (JPEG/PNG)
      if (file.size > 10 * 1024 * 1024) {
        setError(field, {
          type: "manual",
          message: "File size must be less than 10MB",
        });
        return;
      }

      if (!["image/jpeg", "image/png"].includes(file.type)) {
        setError(field, {
          type: "manual",
          message: "Only JPEG and PNG files are allowed",
        });
        return;
      }

      // If validation passes, clear previous errors
      clearErrors(field);

      const reader = new FileReader();
      reader.onload = () => {
        const fileString = reader.result as string;
        setValue(field, fileString); // Update the form's value
        if (field === "logo") {
          setLogoPreview(fileString); // Set logo preview
        } else {
          setBackgroundPreview(fileString); // Set background preview
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError(field, {
        type: "manual",
        message: "Please select a valid file",
      });
    }
  };

  const handleUploadImage = (field: "logo" | "background_image") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e: Event) =>
      handleImageChange(
        e as unknown as React.ChangeEvent<HTMLInputElement>,
        field
      );
    input.click();
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-4 mb-16 max-w-[800px] mx-auto">
      <Card className="relative w-full">
        <CardHeader className="">
          <CardTitle className="text-2xl font-medium">
            Register Organization{" "}
            <p className="text-sm font-normal text-muted-foreground">
              Enter your organization details
            </p>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              {backgroundPreview ? (
                <div
                  style={{ aspectRatio: "12/2" }}
                  className="rounded-sm overflow-hidden w-full drop-shadow-md border group mt-1"
                >
                  <div className="absolute top-1 right-1 transform z-50 invisible group-hover:visible">
                    <button
                      onClick={() => handleUploadImage("background_image")}
                      type="button"
                      className="text-sm text-white text-medium bg-black/40 hover:bg-black/80 px-4 py-[6px] rounded-md"
                    >
                      Change File
                    </button>
                  </div>

                  <div className="invisible group-hover:visible absolute top-1 left-1 transform z-50">
                    <ImageDialog imgUrl={backgroundPreview} />
                  </div>

                  <Image
                    style={{ aspectRatio: "12/2" }}
                    src={backgroundPreview}
                    alt="background"
                    className="object-cover"
                    width={1200}
                    height={200}
                  />
                </div>
              ) : (
                <div
                  className="bg-white text-gray-400 flex flex-col text-center items-center 
                justify-center rounded-sm w-full h-auto border"
                  style={{ aspectRatio: "12/2" }}
                >
                  <p className="text-sm mt-2">Upload Background</p>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {"1200x200px (Max 10 MB)"}
                  </span>

                  <button
                    onClick={() => handleUploadImage("background_image")}
                    type="button"
                    className="mt-2 text-sm text-white text-medium bg-black px-4 py-[6px] rounded-md"
                  >
                    Choose File
                  </button>
                  <input
                    {...register("background_image", {
                      required: "background is required",
                    })}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleImageChange(e, "background_image")}
                  />
                  {errors.background_image && (
                    <p className="error-msg">
                      {errors.background_image.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="flex justify-center items-start gap-2">
              {logoPreview ? (
                <div className="rounded-lg overflow-hidden h-[200px] w-[200px] drop-shadow-md group border">
                  <Image
                    src={logoPreview}
                    alt="Logo"
                    className="object-cover"
                    style={{ aspectRatio: "1/1" }}
                    width={500}
                    height={500}
                  />
                  <div className="absolute top-1 right-1 transform z-50 invisible group-hover:visible">
                    <button
                      onClick={() => handleUploadImage("logo")}
                      type="button"
                      className="text-sm text-white text-medium bg-black/40 hover:bg-black/80 px-4 py-[6px] rounded-md"
                    >
                      Change File
                    </button>
                  </div>
                  <div className="invisible group-hover:visible absolute top-1 left-1 transform z-50">
                    <ImageDialog imgUrl={logoPreview} />
                  </div>
                </div>
              ) : (
                <div
                  className="bg-white text-gray-400 flex flex-col text-center items-center 
                justify-center rounded-lg h-[200px] w-[200px] border"
                  style={{ aspectRatio: "1/1" }}
                >
                  <p className="text-sm mt-2">Upload Logo</p>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {"500x500px"}
                  </span>
                  <span className="text-xs mt-1 text-muted-foreground">
                    {"(Max 10 MB)"}
                  </span>
                  <button
                    onClick={() => handleUploadImage("logo")}
                    type="button"
                    className="mt-2 text-sm text-white text-medium bg-black px-4 py-[6px] rounded-md"
                  >
                    Choose File
                  </button>
                  <input
                    {...register("logo", { required: "Logo is required" })}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png"
                    onChange={(e) => handleImageChange(e, "logo")}
                  />
                  {errors.logo && (
                    <p className="error-msg mt-1">{errors.logo.message}</p>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-4">
              <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
                Main Details
              </h1>
              <div>
                <Label htmlFor="email">
                  <span>Organization Email</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (Use dedicated email)"}
                  </span>
                </Label>
                <Input
                  id="email"
                  placeholder="Enter your organization email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                    maxLength: {
                      value: 100,
                      message: "Email must be less than 100 characters",
                    },
                  })}
                />
                {errors.email && (
                  <p className="error-msg mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your organization name"
                  {...register("name", {
                    required: "Organization name is required",
                    maxLength: {
                      value: 150,
                      message: "Name must be less than 150 characters",
                    },
                  })}
                />
                {errors.name && (
                  <p className="error-msg mt-1">{errors.name.message}</p>
                )}
                <div className="absolute right-0 text-[10px] text-muted-foreground mt-1">
                  {watch("name").length}/150
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="headline">
                  <span>Headline</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (short description about your organization)"}
                  </span>
                </Label>
                <Input
                  id="headline"
                  placeholder="eg. Startup Incubation Platform, etc."
                  {...register("headline", {
                    required: "Headline is required",
                    maxLength: {
                      value: 200,
                      message: "Headline must be less than 200 characters",
                    },
                  })}
                />
                {errors.headline && (
                  <p className="error-msg mt-1">{errors.headline.message}</p>
                )}
                <div className="absolute right-0 text-[10px] text-muted-foreground mt-1">
                  {watch("headline").length}/200
                </div>
              </div>

              <div className="relative">
                <Label htmlFor="specialty">
                  <span>Specialty</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (what do your organization specialize in?)"}
                  </span>
                </Label>
                <Input
                  id="specialty"
                  placeholder="eg. Elderly Care, Social Work, etc."
                  {...register("specialty", {
                    required: "Specialty is required",
                    maxLength: {
                      value: 250,
                      message: "Specialty must be less than 250 characters",
                    },
                  })}
                />
                {errors.specialty && (
                  <p className="error-msg mt-1">{errors.specialty.message}</p>
                )}
                <div className="absolute right-0 text-[10px] text-muted-foreground mt-1">
                  {watch("specialty").length}/250
                </div>
              </div>

              <div>
                <Label>
                  <span>Industries</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (Up to 5)"}
                  </span>
                </Label>
                <GenericMultipleSelector
                  maxSelected={5}
                  form={form}
                  errMessage={"Industries is required"}
                  name="industries"
                  onSearch={fetchIndustries}
                />
                {errors.industries && (
                  <p className="error-msg">{errors.industries.message}</p>
                )}
              </div>

              <div className="relative">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter your organization description"
                  {...register("description", {
                    required: "Description is required",
                    maxLength: {
                      value: 5000,
                      message: "Description must be less than 5000 characters",
                    },
                  })}
                />
                {errors.description && (
                  <p className="error-msg mt-1">{errors.description.message}</p>
                )}
                <div className="absolute right-0 text-[10px] text-muted-foreground mt-1">
                  {watch("description").length}/5000
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-base font-medium border-l-4 pl-2 border-orange-500">
                Location
              </h1>
              <div
                className="flex items-center gap-3 w-fit p-3 bg-white rounded-lg border border-gray-200 
                 hover:bg-gray-50 transition-colors duration-200 cursor-pointer shadow-sm"
              >
                <Checkbox
                  id="isRemote"
                  checked={isOrgRemote}
                  onCheckedChange={handleIsRemoteClick}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />

                <Label
                  htmlFor="isRemote"
                  className="text-sm font-medium text-gray-900 cursor-pointer select-none"
                >
                  {"Is your organization located online(Remote)?"}
                </Label>
              </div>
              {!isOrgRemote && (
                <>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter your organization address"
                      {...register("address", {
                        required: "Address is required",
                        maxLength: {
                          value: 500,
                          message: "Address must be less than 500 characters",
                        },
                      })}
                    />
                    {errors.address && (
                      <p className="error-msg mt-1">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
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
                            <SelectTrigger id="province">
                              <SelectValue placeholder="Select a province" />
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

                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Controller
                        name="country"
                        control={control}
                        rules={{ required: "Country is required" }}
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
                        <p className="error-msg mt-1">
                          {errors.country.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-2">
                    <p className="text-base font-medium">
                      <span>Map Coordinate</span>
                      <span className="text-xs text-muted-foreground font-light">
                        {" (Required for map marker)"}
                      </span>
                    </p>
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
                          placeholder="eg. 13.7563..."
                          {...register("latitude", {
                            required: "Latitude is required",
                            pattern: {
                              value: /^-?([0-8]?\d|90)(\.\d+)?$/,
                              message: "Invalid latitude",
                            },
                          })}
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
                          placeholder="eg. 100.565..."
                          {...register("longitude", {
                            required: "Longitude is required",
                            pattern: {
                              value: /^-?(\d{1,2}|1[0-7]\d|180)(\.\d+)?$/,
                              message: "Invalid longitude",
                            },
                          })}
                        />
                        {errors.longitude && (
                          <p className="error-msg mt-1">
                            {errors.longitude.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div>
                <Label htmlFor="telephone" className="flex items-center gap-1">
                  <span>Telephone</span>
                  <span className="text-xs text-muted-foreground font-light">
                    {" (Optional)"}
                  </span>
                </Label>
                <Input
                  id="telephone"
                  placeholder="0811234567"
                  {...register("phone", {
                    pattern: {
                      value: /^[0-9+\-\s()]*$/,
                      message: "Invalid telephone number",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="error-msg mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-medium">Contact Channels</h1>
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
                      <Label htmlFor={`organizationContacts.${index}.type`}>
                        Channel Name
                      </Label>
                      <Controller
                        name={`organizationContacts.${index}.media`}
                        control={control}
                        rules={{
                          required: "Channel type is required",
                        }}
                        render={({ field: { onChange, value } }) => (
                          <Select onValueChange={onChange} value={value}>
                            <SelectTrigger
                              id={`organizationContacts.${index}.type`}
                            >
                              <SelectValue placeholder="e.g. Facebook, Twitter, LinkedIn" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Facebook">Facebook</SelectItem>
                              <SelectItem value="Twitter">Twitter</SelectItem>
                              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                              <SelectItem value="Instagram">
                                Instagram
                              </SelectItem>
                              <SelectItem value="Website">Website</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.organizationContacts?.[index]?.media && (
                        <p className="error-msg mt-1">
                          {errors.organizationContacts[index].media?.message}
                        </p>
                      )}
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`organizationContacts.${index}.url`}>
                        URL
                      </Label>
                      <Input
                        id={`organizationContacts.${index}.url`}
                        placeholder="https://"
                        {...register(
                          `organizationContacts.${index}.mediaLink`,
                          {
                            required: "Channel URL is required",
                            pattern: {
                              value:
                                /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]+)*(\?.*)?$/,
                              message: "Invalid URL format",
                            },
                          }
                        )}
                      />
                      {errors.organizationContacts?.[index]?.mediaLink && (
                        <p className="error-msg mt-1">
                          {errors.organizationContacts[index].mediaLink.message}
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

            <div className="mt-4">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <Button
                  type="button"
                  onClick={validateAndOpenDialog}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  Submit
                </Button>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      <span className="text-sm text-gray-700">
                        Are you ready to create this organization? Please make
                        sure all the information is correct before creating.
                      </span>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex gap-y-1">
                    <Button
                      variant="outline"
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
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
