"use client";
import React from "react";
import MultipleSelector, { Option } from "../ui/MultiSelect";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";
import Spinner from "../ui/spinner";

interface MultipleSelectorProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
  errMessage?: string;
  onSearch: (value: string) => Promise<Option[]>;
  maxSelected: number;
}

const GenericMultipleSelector = <T extends FieldValues>({
  form,
  name,
  errMessage = "This field is required",
  onSearch,
  maxSelected,
}: MultipleSelectorProps<T>) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <Controller
        control={form.control}
        name={name}
        rules={{ required: errMessage }}
        render={({ field }) => (
          <MultipleSelector
            maxSelected={maxSelected}
            onSearch={async (value) => {
              const res = await onSearch(value);
              return res;
            }}
            value={field.value}
            onChange={(value) => {
              field.onChange(
                value.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))
              );
            }}
            className="focus:border"
            triggerSearchOnFocus
            hidePlaceholderWhenSelected
            placeholder="Enter Event Categories..."
            loadingIndicator={
              <div className="py-4 flex items-center justify-center">
                <Spinner />
              </div>
            }
            emptyIndicator={
              <p className="w-full text-center text-lg leading-10 text-muted-foreground">
                no results found.
              </p>
            }
          />
        )}
      />
    </div>
  );
};

export default GenericMultipleSelector;
