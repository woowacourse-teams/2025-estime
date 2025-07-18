import type { Meta } from '@storybook/react-webpack5';
import Text from '.';
import { TypographyKey } from '@/styles/theme';

const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
};

export default meta;

export const Variants = {
  render: () => {
    const variants: TypographyKey[] = ['h1', 'h2', 'h3', 'h4', 'body', 'button', 'caption'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {variants.map((variant) => (
          <Text key={variant} variant={variant}>
            {variant} text 예시입니다.
          </Text>
        ))}
      </div>
    );
  },
};
