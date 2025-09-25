import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LoginModal from './index';
import { ModalContext } from '@/shared/contexts/ModalContext';
import { useState } from 'react';
import Button from '@/shared/components/Button';
import Flex from '@/shared/layout/Flex';
import Text from '@/shared/components/Text';

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
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    return (
      <Flex>
        <Button
          onClick={() => setIsLoginModalOpen(true)}
          color="primary"
          size="small"
          selected={true}
        >
          <Text variant="body" color="background">
            Open Modal
          </Text>
        </Button>
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          handleCloseLoginModal={() => {}}
          handleModalLogin={() => {}}
          userData={{ name: '' }}
          handleUserData={() => {}}
        />
      </Flex>
    );
  },
};
export const PreOpenModal: Story = {
  render: () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(true);
    return (
      <Flex>
        <Button
          onClick={() => setIsLoginModalOpen(true)}
          color="primary"
          size="small"
          selected={true}
        >
          <Text variant="body" color="background">
            Open Modal
          </Text>
        </Button>
        <LoginModal
          isLoginModalOpen={isLoginModalOpen}
          handleCloseLoginModal={() => {}}
          handleModalLogin={() => {}}
          userData={{ name: '' }}
          handleUserData={() => {}}
        />
      </Flex>
    );
  },
};
