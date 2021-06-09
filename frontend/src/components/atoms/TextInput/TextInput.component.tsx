// import React from 'react';
// import { SButton } from './Button.styled';
import {
  Input, InputProps,
  FormControlOptions,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"

export type TextInputProps = {
  error?: { message?: string };
  hint?: string;
  isDisabled?: FormControlOptions["isDisabled"]
  isRequired?: FormControlOptions["isRequired"]
  onChange?: InputProps["onChange"];
  otherTextInputProps?: InputProps;
  placeholder?: InputProps["placeholder"];
  title?: string;
  type?: "text" | "password" | "tel" | "email" & string;
  value?: InputProps["value"];
  name: string;
}

export const TextInput: React.FC<TextInputProps> = ({
  error,
  hint,
  isDisabled,
  isRequired,
  onChange,
  otherTextInputProps,
  placeholder,
  title,
  type = "text",
  value,
  name,
}) => {
  return (
    <FormControl
      isInvalid={!!error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    >
      <FormLabel>{title}</FormLabel>
      <Input
        name={name}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        errorBorderColor="crimson"
        {...otherTextInputProps}
      />

      {hint && <FormHelperText>{hint}</FormHelperText>}
      <FormErrorMessage color="crimson">{error?.message}</FormErrorMessage>
    </FormControl>
  );
}

export default TextInput;