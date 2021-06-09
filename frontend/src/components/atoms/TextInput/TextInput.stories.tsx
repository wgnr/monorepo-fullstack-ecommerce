import { Story, Meta } from '@storybook/react';
import TextInput, { TextInputProps } from './TextInput.component';

export default {
  title: 'Atoms/Input',
  component: TextInput,
  argTypes: {
  },
} as Meta;

const Template: Story<TextInputProps> = args => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  hint: "This is a hint",
  placeholder: "Insert text",
  title: "Text",
};

export const Password = Template.bind({});
Password.args = {
  title: "Password",
  placeholder: "Min lenght 8 chars",
  type: "password",
  otherTextInputProps: {
    defaultValue: "teresito"
  }
};