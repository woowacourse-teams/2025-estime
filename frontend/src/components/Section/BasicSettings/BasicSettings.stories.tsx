import React from 'react';
import type { Meta, StoryFn } from '@storybook/react-webpack5';
import BasicSettings from '.';

export default {
  title: 'Components/BasicSettings',
  component: BasicSettings,
  tags: ['autodocs'],
} as Meta<typeof BasicSettings>;

const Template: StoryFn<typeof BasicSettings> = (args) => <BasicSettings {...args} />;

export const Default = Template.bind({});
Default.args = {};
