import discordLogo from '@/assets/images/discord.webp';
import slackLogo from '@/assets/images/slack.webp';

interface PlatformLogoProps {
  platformType: 'DISCORD' | 'SLACK';
}

const logos: Record<'DISCORD' | 'SLACK', string> = {
  DISCORD: discordLogo,
  SLACK: slackLogo,
};

const PlatformLogo = ({ platformType }: PlatformLogoProps) => {
  return <img src={logos[platformType]} alt={platformType} width={48} height={48} />;
};

export default PlatformLogo;
