import discordLogo from '@/assets/images/discord.png';
import slackLogo from '@/assets/images/slack.png';

interface PlatformLogoProps {
  platform: 'DISCORD' | 'SLACK';
}

const logos: Record<'DISCORD' | 'SLACK', string> = {
  DISCORD: discordLogo,
  SLACK: slackLogo,
};

const PlatformLogo = ({ platform }: PlatformLogoProps) => {
  return <img src={logos[platform]} alt={platform} width={48} height={48} />;
};

export default PlatformLogo;
