import { Meta, StoryObj } from '@storybook/react-webpack5';
import Timetable from '.';

const meta: Meta<typeof Timetable> = {
  title: 'Components/Timetable',
  component: Timetable,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Timetable>;

export const Default: Story = {};
