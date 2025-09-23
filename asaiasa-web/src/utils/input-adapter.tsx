import React from 'react';
import { Input as BaseInput } from '@/components/base/input/input';

// Adapter component that converts standard input onChange to our Input component's expected signature
interface AdaptedInputProps extends Omit<React.ComponentProps<typeof BaseInput>, 'onChange'> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AdaptedInput = React.forwardRef<HTMLInputElement, AdaptedInputProps>(
  ({ onChange, ...props }, ref) => {
    const handleChange = (value: string) => {
      if (onChange) {
        // Create a synthetic event that matches React.ChangeEvent<HTMLInputElement>
        const syntheticEvent = {
          target: { value },
          currentTarget: { value },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <BaseInput
        {...props}
        ref={ref}
        onChange={handleChange}
      />
    );
  }
);

AdaptedInput.displayName = 'AdaptedInput';
