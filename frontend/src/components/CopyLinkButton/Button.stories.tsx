import { Meta, StoryObj } from '@storybook/react-webpack5';
import CopyLinkButton from '.';

const meta: Meta<typeof CopyLinkButton> = {
  title: 'Components/CopyLinkButton',
  component: CopyLinkButton,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof CopyLinkButton>;

export const CopyLinkButtonStory: Story = {};
