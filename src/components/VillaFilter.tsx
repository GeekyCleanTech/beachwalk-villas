import { h } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import type { CollectionEntry } from 'astro:content';
import VillaCard from './VillaCard';

interface Props {
  villas: CollectionEntry<'villas'>[];
}

export default function VillaFilter({ villas }: Props) {
  const [filter, setFilter] = useState('All');

  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: villas.length };
    villas.forEach((v) => {
      const cat = v.data.category;
      counts[cat] = (counts[cat] || 0) + 1;
    });
    
    // Sort logic to order categories logically if desired
    return [
      { key: 'All', label: 'All Villas', count: counts['All'] },
      { key: 'Studio', label: 'Studios', count: counts['Studio'] },
      { key: 'One Bedroom', label: 'One Bedroom', count: counts['One Bedroom'] },
      { key: 'Two Bedroom', label: 'Two Bedroom', count: counts['Two Bedroom'] },
      { key: 'Three Bedroom Penthouse', label: 'Penthouses', count: counts['Three Bedroom Penthouse'] },
    ].filter(c => c.count > 0);
  }, [villas]);

  const filteredVillas = useMemo(() => {
    if (filter === 'All') return villas;
    return villas.filter((v) => v.data.category === filter);
  }, [filter, villas]);

  return (
    <div>
      {/* Filter bar */}
      <div class="bg-sand/95 border-b border-brand-border sticky top-16 md:top-20 z-40">
        <div class="container-site py-4 flex flex-wrap gap-2.5">
          {categoriesWithCounts.map((c) => {
            const isActive = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                class={`px-4 py-2 text-sm font-semibold rounded-full border transition-colors ${
                  isActive
                    ? 'border-seafoam bg-seafoam text-white'
                    : 'border-brand-border text-navy/80 hover:border-seafoam hover:text-seafoam'
                }`}
              >
                {c.label} ({c.count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Villas grid */}
      <section class="section-pad bg-sand reveal">
        <div class="container-site">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredVillas.map((villa) => (
              <VillaCard
                key={villa.id}
                id={villa.id}
                name={villa.data.name}
                category={villa.data.category}
                viewType={villa.data.viewType}
                imageSrc={villa.data.image.src}
                specs={villa.data.specs}
                tagline={villa.data.tagline}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
