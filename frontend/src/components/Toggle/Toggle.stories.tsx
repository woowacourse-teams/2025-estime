import { Meta, StoryObj } from '@storybook/react-webpack5';
import Toggle from '.';

const meta: Meta<typeof Toggle> = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],

  decorators: [
    (Story) => (
      <div style={{ width: '70px', padding: '10px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const OnToggle: Story = {
  args: {
    isOn: true,
    onToggle: () => {},
  },
};

export const OffToggle: Story = {
  args: {
    isOn: false,
    onToggle: () => {},
  },
};
