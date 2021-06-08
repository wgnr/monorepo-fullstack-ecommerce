// import React from 'react';
// import { SButton } from './Button.styled';
import { Input, InputProps } from "@chakra-ui/react"
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react"

export type TextInputProps = {
  title?: string;
  value?: InputProps["value"];
  size?: InputProps["size"];
  variant?: InputProps["variant"];
  otherInputProps?: InputProps;
}

export function TextInput({ otherInputProps, title, size }: TextInputProps) {

  return (
    <FormControl id="asd">
      <FormLabel>{title}</FormLabel>
      <Input {...otherInputProps} size={size} />
      <FormHelperText>We'll never share your email.</FormHelperText>
    </FormControl>
  );
}

export default TextInput;
