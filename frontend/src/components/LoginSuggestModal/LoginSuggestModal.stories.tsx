import type { Meta, StoryObj } from '@storybook/react-webpack5';
import LoginSuggestModal from '.';
import { ModalContext } from '@/contexts/ModalContext';
import { useEffect, useRef, useState } from 'react';

const meta: Meta<typeof LoginSuggestModal> = {
  title: 'Components/LoginSuggestModal',
  component: LoginSuggestModal,
  parameters: {
    layout: 'centered',
    docs: {
      story: { inline: false },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ModalContext.Provider value={{ onClose: () => {}, position: 'inside' }}>
        <Story />
      </ModalContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const modalTargetRef = useRef<HTMLDivElement>(null);
    const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
    useEffect(() => {
      if (modalTargetRef.current) {
        setIsSuggestModalOpen(true);
      }
    }, []);
    return (
      <div
        style={{ position: 'relative', width: '800px' }}
        id="login-suggest-modal"
        ref={modalTargetRef}
      >
        <LoginSuggestModal
          target={modalTargetRef.current}
          isOpen={isSuggestModalOpen}
          onLoginClick={() => {}}
        />
      </div>
    );
  },
};
