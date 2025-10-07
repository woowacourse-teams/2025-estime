import type { Meta, StoryFn } from '@storybook/react-webpack5';
import BasicSettings from '.';

export default {
  title: 'Components/BasicSettings',
  component: BasicSettings,
  tags: ['autodocs'],
  argTypes: {
    title: { control: false },
    time: { control: false },
    isValid: {
      control: 'boolean',
    },
  },
} as Meta<typeof BasicSettings>;

const Template: StoryFn<{ isValid: boolean }> = () => {
  return <BasicSettings isValid={true} shouldShake={false} />;
};

export const Default = Template.bind({});
