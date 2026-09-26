interface Logo {
  id: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function LogoCarousel({ logos, className = "" }: { logos: Logo[]; className?: string }) {
  const items = logos.filter((l): l is Logo & { imageUrl: string } => !!l.imageUrl);
  if (items.length === 0) return null;

  return (
    <div className={`marquee-mask overflow-hidden ${className}`}>
      <div className="marquee-track flex w-max items-center gap-14">
        {[...items, ...items].map((logo, i) => (
          <img
            key={`${logo.id}-${i}`}
            src={logo.imageUrl}
            alt={logo.imageAlt || ""}
            className="h-8 w-auto shrink-0 object-contain opacity-60 grayscale transition-opacity duration-200 hover:opacity-100 sm:h-10"
          />
        ))}
      </div>
    </div>
  );
}
