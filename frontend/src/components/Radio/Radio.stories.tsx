import { Meta, StoryObj } from '@storybook/react-webpack5';
import Radio from '.';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Radio>;

export const RadioDefault: Story = {
  args: {
    value: '공개',
    name: 'visibility',
    checked: false,
    onChange: () => {},
    children: <span>공개</span>,
  },
};

export const RadioChecked: Story = {
  args: {
    value: '비공개',
    name: 'visibility',
    checked: true,
    onChange: () => {},
    children: <span>공개</span>,
  },
};
