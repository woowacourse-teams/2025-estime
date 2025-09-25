import styled from '@emotion/styled';
import { shimmerStyle } from './Shimmer.styled';

export const Box = styled.div<{
  width?: string;
  height?: string;
  radius?: string;
}>`
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || '1.5rem'};
  border-radius: ${({ radius }) => radius || 'var(--gap-4)'};
  ${shimmerStyle};
`;

export const Text = (props: { width?: string }) => <SkeletonBox {...props} />;
export const Title = (props: { width?: string }) => <SkeletonBox height="2rem" {...props} />;
export const Button = (props: { width?: string; height?: string }) => <SkeletonBox {...props} />;
export const Input = (props: { width?: string }) => <SkeletonBox height="2.5rem" {...props} />;
export const Block = (props: { width?: string; height?: string }) => <SkeletonBox {...props} />;

export const SkeletonBox = Object.assign(Box, {
  Text,
  Title,
  Button,
  Input,
  Block,
});
