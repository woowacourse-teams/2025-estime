import { Meta, StoryObj } from '@storybook/react-webpack5';
import DatePicker from '.';

const meta: Meta<typeof DatePicker> = {
  title: 'Components/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof DatePicker>;

export const DefaultDatePicker: Story = {
  args: {
    isError: false,
  },
};

export const ErrorDatePicker: Story = {
  args: {
    isError: true,
  },
};
