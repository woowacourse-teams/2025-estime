import type { Meta, StoryObj } from '@storybook/react';
import Tooltip from './index';
import IInfo from '@/icons/IInfo';
import Text from '@/components/Text';
import Flex from '@/components/Layout/Flex';

const meta: Meta<typeof Tooltip> = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    content: '기본 툴팁 메시지입니다',
  },
  render: (args) => (
    <Tooltip {...args}>
      <Flex align="center" gap="var(--gap-2)">
        <IInfo />
        <Text>{'마우스를 올려보세요!'}</Text>
      </Flex>
    </Tooltip>
  ),
};
