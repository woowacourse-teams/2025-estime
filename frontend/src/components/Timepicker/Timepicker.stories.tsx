import { Meta, StoryObj } from '@storybook/react-webpack5';
import TimePicker from '.';

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
  tags: ['autodocs'],
  args: {
    color: 'gray10',
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: '기본 시간 값 (예: "09:00")',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: '280px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof TimePicker>;

export const Default: Story = {};
