import { Meta, StoryObj } from '@storybook/react-webpack5';
import Input from '.';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    isError: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력해주세요',
  },
};
