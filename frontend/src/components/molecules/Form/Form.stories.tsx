import { Story, Meta } from '@storybook/react';
import Form, { FormProps } from './Form.component';

export default {
  title: 'Molecules/Form',
  component: Form,
  argTypes: {
  },
} as Meta;

const Template: Story<FormProps> = args => <Form {...args} />;

export const Default = Template.bind({});
Default.args = {
  formInputs: [
    {
      name: "username",
      title: "Username",
      otherTextInputProps: {
        autoComplete: "username"
      },
    },
    {
      name: "password",
      title: "Password",
      placeholder: "Min lenght 8 chars",
      type: "password",
      otherTextInputProps: {
        autoComplete: "current-password"
      },
      registerOptions: {
        required: "Required",
        minLength: { value: 4, message: "Minimum length should be 4" }
      }
    }
  ]
};
