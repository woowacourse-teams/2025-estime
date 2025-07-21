import type { Meta, StoryObj } from '@storybook/react';
import LoginModal from './index';
import { ModalContext } from '@/contexts/ModalContext';
import { useState } from 'react';
import Button from '@/components/Button';
import Flex from '@/components/Layout/Flex';
import Text from '@/components/Text';

const meta: Meta<typeof LoginModal> = {
  title: 'Components/LoginModal',
  component: LoginModal,
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: false },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ModalContext.Provider value={{ onClose: () => {}, position: 'center' }}>
        <Story />
      </ModalContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <Flex>
        <Button onClick={() => setIsOpen(true)} color="primary" size="small" selected={true}>
          <Text variant="body" color="background">
            Open Modal
          </Text>
        </Button>
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    );
  },
};
export const PreOpenModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    return (
      <Flex>
        <Button onClick={() => setIsOpen(true)} color="primary" size="small" selected={true}>
          <Text variant="body" color="background">
            Open Modal
          </Text>
        </Button>
        <LoginModal isOpen={isOpen} setIsOpen={setIsOpen} />
      </Flex>
    );
  },
};
