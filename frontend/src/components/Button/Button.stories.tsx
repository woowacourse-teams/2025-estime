import { Meta, StoryObj } from '@storybook/react-webpack5';
import Button from '.';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'],
    },
    color: {
      control: { type: 'radio' },
      options: ['primary', 'secondary', 'gray10'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    size: 'medium',
    color: 'primary',
    children: 'Primary 버튼',
  },
};

export const Secondary: Story = {
  args: {
    size: 'medium',
    color: 'secondary',
    children: 'Secondary 버튼',
  },
};

export const Ghost: Story = {
  args: {
    size: 'medium',
    color: 'gray10',
    children: 'Ghost 버튼',
  },
};
