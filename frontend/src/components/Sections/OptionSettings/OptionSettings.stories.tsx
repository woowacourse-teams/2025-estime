import { Meta, StoryFn } from '@storybook/react-webpack5';
import OptionSettings from '.';

export default {
  title: 'Components/OptionSettings',
  component: OptionSettings,
  tags: ['autodocs'],
} as Meta<typeof OptionSettings>;

const Template: StoryFn<typeof OptionSettings> = (args) => <OptionSettings {...args} />;

export const Default = Template.bind({});
Default.args = {};
