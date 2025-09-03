import { Meta, StoryObj } from '@storybook/react-webpack5';
import Toast from '.';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'radio' },
      options: ['success', 'error', 'warning'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const SuccessToast: Story = {
  args: {
    id: 'success',
    type: 'success',
    message: '성공입니다!!',
  },
};

export const ErrorToast: Story = {
  args: {
    id: 'error',
    type: 'error',
    message: '에러입니둥!!',
  },
};

export const WarningToast: Story = {
  args: {
    id: 'warning',
    type: 'warning',
    message: '경고입니다!! 앞으로는 조심하세요',
  },
};
