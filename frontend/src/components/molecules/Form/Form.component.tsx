import { useForm, RegisterOptions } from "react-hook-form";
import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button
} from "@chakra-ui/react";
import { TextInput, TextInputProps } from "../../atoms"

export type FormProps = {
  formInputs?: (TextInputProps & { registerOptions?: RegisterOptions })[],
  buttonsActions?: React.FC
}

let inputs: FormProps["formInputs"] = []

const Form: React.FC<FormProps> = ({ formInputs, buttonsActions }) => {
  if (!Array.isArray(formInputs)) return <></>

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  inputs = formInputs.map(fi => ({
    ...fi,
    otherTextInputProps: {
      ...fi.otherTextInputProps,
      ...register(fi.name, fi.registerOptions)
    },
    error: errors[fi.name]
  })
  )
  function onSubmit(values) {
    return new Promise((resolve) => {
      setTimeout(() => {
        alert(JSON.stringify(values, null, 2));
        resolve({});
      }, 3000);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {inputs.map((input, i) => {
        return <TextInput {...input} key={`textinput-${i}-${input.name}`} />
      })}
      <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </form>
  )
}

export default Form