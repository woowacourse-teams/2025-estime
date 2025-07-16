import type { Meta, StoryObj } from '@storybook/react';
import Text from '.';

const meta = {
  title: 'Component/Text',
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof Text>;

export const Heading1: Story = {
  args: {
    variant: 'h1',
    children: '안녕하세요!',
  },
};

export const Heading2: Story = {
  args: {
    variant: 'h2',
    children: '안녕하세요!',
  },
};

export const Heading3: Story = {
  args: {
    variant: 'h3',
    children: '안녕하세요!',
  },
};

export const Heading4: Story = {
  args: {
    variant: 'h4',
    children: '안녕하세요!',
  },
};

export const Body: Story = {
  args: {
    variant: 'body',
    children: '안녕하세요!',
  },
};

export const ButtonText: Story = {
  args: {
    variant: 'button',
    children: '안녕하세요!',
  },
};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: '안녕하세요!',
  },
};
