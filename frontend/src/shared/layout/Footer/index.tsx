import * as S from './Footer.styled';
import Text from '@/shared/components/Text';
import Flex from '../Flex';

const Footer = () => {
  return (
    <S.Container>
      <Flex direction="column" align="center" gap="var(--gap-4)">
        <S.Content>
          <S.Links>
            <Text variant="h4">
              <S.Anchor
                href={process.env.PRIVACY_POLICY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                개인정보 처리 방침
              </S.Anchor>
            </Text>
            <S.Dot>·</S.Dot>
            <Text variant="h4">
              <S.Anchor href={process.env.ISSUE_URL} target="_blank" rel="noopener noreferrer">
                문제가 생겼나요?
              </S.Anchor>
            </Text>
          </S.Links>

          <S.Meta onClick={() => window.open(`${window.location.origin}/credits`, '_self')}>
            <Text color="primary" variant="h4">
              아인슈타임을 만든 사람들
            </Text>
          </S.Meta>
        </S.Content>
        <Text variant="h4">© 2025 Estime. All rights reserved.</Text>
      </Flex>
    </S.Container>
  );
};

export default Footer;
