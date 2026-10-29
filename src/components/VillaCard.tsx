import { h } from 'preact';

interface Props {
  name: string;
  id: string;
  category: string;
  viewType: string;
  imageSrc: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    maxGuests: number;
    sqft: number;
  };
  tagline?: string;
  eager?: boolean;
}

export default function VillaCard({
  name,
  id,
  category,
  viewType,
  imageSrc,
  specs,
  tagline,
  eager = false,
}: Props) {
  const badgeStyle = viewType === "Ocean Front" ? "badge-ocean" : "badge-coral";

  const chips = [
    category === 'Studio' ? 'Studio' : `${specs.bedrooms} bed`,
    `${specs.bathrooms} bath`,
  ];
  if (specs.maxGuests) chips.push(`${specs.maxGuests} guests`);
  if (specs.sqft) chips.push(`${specs.sqft.toLocaleString()} sq ft`);

  return (
    <article class="villa-card-reveal card group flex flex-col h-full transition-shadow duration-300 hover:shadow-[var(--shadow-lift)]">
      {/* Large photo */}
      <a
        href={`/villas/${id}/`}
        class="relative block overflow-hidden aspect-[4/3]"
        aria-label={`View ${name}`}
      >
        <img
          src={imageSrc}
          alt={name}
          class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading={eager ? "eager" : "lazy"}
        />
        <span class={`badge absolute top-4 left-4 ${badgeStyle}`}>
          {viewType}
        </span>
      </a>

      {/* Text content */}
      <div class="p-6 flex flex-col flex-1">
        <div class="mb-4">
          <a href={`/villas/${id}/`} class="hover:text-seafoam transition-colors block group-hover:text-seafoam">
            <h3 class="font-serif text-h3 text-navy">{name}</h3>
          </a>
          {tagline && <p class="text-sm text-brand-muted mt-2 leading-relaxed line-clamp-2">{tagline}</p>}
        </div>

        {/* Quick facts (chips) */}
        <div class="flex flex-wrap gap-2 mb-6">
          {chips.map((label) => (
            <span key={label} class="chip">{label}</span>
          ))}
        </div>

        {/* Actions */}
        <div class="mt-auto flex gap-3">
          <a href={`/villas/${id}/`} class="btn btn-primary flex-1 !py-2.5 text-sm flex items-center justify-center">
            View details
          </a>
        </div>
      </div>
    </article>
  );
}
