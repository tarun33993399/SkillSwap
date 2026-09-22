interface BrandLogoProps {
  inverted?: boolean;
}

export default function BrandLogo({ inverted = false }: BrandLogoProps) {
  return (
    <span className="brand-lockup">
      <img
        className="brand-icon"
        src="/skillswap-logo.png"
        alt=""
        aria-hidden="true"
      />
      <span className="brand-wordmark" style={{ color: inverted ? 'var(--color-cream)' : 'var(--color-charcoal)' }}>
        SkillSwap
      </span>
    </span>
  );
}
