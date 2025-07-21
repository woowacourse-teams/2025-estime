import { Meta, StoryObj } from '@storybook/react-webpack5';
import Accordion from '.';

const meta: Meta<typeof Accordion> = {
  title: 'Components/Accordion',
  component: Accordion,
  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Accordion>;

export const OpenAccodion: Story = {
  args: {
    title: '선택 설정',
    isOpen: true,
    onToggle: () => {},
    children: <div>스토리북용 콘텐츠</div>,
  },
};

export const CloseAccodion: Story = {
  args: {
    title: '선택 설정',
    isOpen: false,
    onToggle: () => {},
    children: <div>스토리북용 콘텐츠</div>,
  },
};
