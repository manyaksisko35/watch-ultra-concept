import Image from 'next/image';
import { BUDS_SITE, S26_SITE } from '@/lib/links';

const SITES = [
  { href: S26_SITE, img: '/ecosystem/s26-ultra.webp', name: 'Galaxy S26 Ultra', alt: 'Galaxy S26 Ultra concept site' },
  { href: BUDS_SITE, img: '/ecosystem/buds4-pro.webp', name: 'Galaxy Buds4 Pro', alt: 'Galaxy Buds4 Pro concept site' },
];

const PERKS = [
  { title: 'Unlock and find', text: 'Unlock your phone from your wrist and ring a lost Galaxy device.' },
  { title: 'Camera controller', text: 'Frame and take the shot on your phone from the watch.' },
  { title: 'Buds controls', text: 'Switch noise control and skip tracks on your Galaxy Buds from the watch.' },
];

export default function EcosystemSection() {
  return (
    <section id="ecosystem" className="sg-ambient amb-violet relative z-10 bg-[#030303] px-6 lg:px-[8%] py-24 lg:py-32">
      <div className="max-w-7xl mx-auto">
        <p className="sg-eyebrow mb-3 lg:mb-5">Galaxy ecosystem</p>
        <h2 className="sg-title max-w-3xl">
          Better <strong className="sg-ai">together.</strong>
        </h2>
        <div className="mt-10 lg:mt-14 grid md:grid-cols-2 gap-4 lg:gap-6">
          {SITES.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block overflow-hidden rounded-[28px] border border-white/10 aspect-[8/5]"
            >
              <Image
                src={s.img}
                alt={s.alt}
                width={960}
                height={600}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 p-5 lg:p-7 bg-gradient-to-t from-black/85 to-transparent flex items-end justify-between gap-4">
                <div>
                  <p className="sg-eyebrow !text-[0.6rem] mb-1">Concept</p>
                  <p className="text-xl lg:text-2xl font-semibold">{s.name}</p>
                </div>
                <span className="sg-btn !py-2.5 !px-5 text-sm shrink-0">
                  Explore
                  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
                    <path d="M3 9L9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.6" fill="none" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="mt-4 lg:mt-6 grid md:grid-cols-3 gap-3">
          {PERKS.map((p) => (
            <div key={p.title} className="sg-card !rounded-2xl px-5 py-4">
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-white/55 font-light mt-1">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-white/40 mt-4">Feature availability depends on device and software version.</p>
      </div>
    </section>
  );
}
