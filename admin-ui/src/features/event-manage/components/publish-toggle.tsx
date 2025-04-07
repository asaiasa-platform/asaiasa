import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { EventFormValues } from "@/lib/types";
import { Controller, UseFormReturn } from "react-hook-form";

export const EventPublishToggle = ({
  form,
}: {
  form: UseFormReturn<EventFormValues>;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Controller
        control={form.control}
        name="status"
        render={({ field }) => (
          <Switch
            id="publish-toggle"
            checked={field.value === "published"}
            onCheckedChange={(checked) =>
              field.onChange(checked ? "published" : "draft")
            }
          />
        )}
      />
      <Label htmlFor="publish-toggle" className="font-medium text-gray-700">
        Publish
      </Label>
    </div>
  );
};
