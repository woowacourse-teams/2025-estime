interface PlatformLogoProps {
  platform: 'DISCORD' | 'SLACK';
}

const PlatformLogo = ({ platform }: PlatformLogoProps) => {
  const logos: Record<'DISCORD' | 'SLACK', string> = {
    DISCORD: '/discord.png',
    SLACK: '/slack.png',
  };

  return <img src={logos[platform]} alt={platform} width={48} height={48} />;
};

export default PlatformLogo;
