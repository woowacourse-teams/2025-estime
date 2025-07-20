import styled from '@emotion/styled';
const A = ({ color }: { color: string }) => {
  return <Container color={color}>A</Container>;
};

export default A;

const Container = styled.div<{ color: string }>`
  width: 100%;
  height: 672px;
  background-color: ${(props) => props.color};
  flex: 1;
`;
