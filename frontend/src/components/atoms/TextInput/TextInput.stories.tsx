import { Story, Meta } from '@storybook/react';
import TextInput, { TextInputProps } from './TextInput.component';

export default {
  title: 'Atoms/Input',
  component: TextInput,
  argTypes: {
    title: {
      control: 'text',
    },
    size: {
      control: {
        type: 'inline-radio',
        options: ["xs", "sm", "md", "lg"],
      },
    }
  },
} as Meta;

const Template: Story<TextInputProps> = args => <TextInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  inputProps: { placeholder: "askjldhaskldjlk" }
};