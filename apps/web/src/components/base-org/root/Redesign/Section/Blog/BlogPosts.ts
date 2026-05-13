export type BlogPost = {
  title: string;
  subtitle: string;
  previewImage: string;
  href: string;
  /** When ascii efect is enabled, edit these values to change the brightness and contrast of the image */
  brightness: number;
  contrast: number;
};

export const blogPosts: BlogPost[] = [
  {
    title: 'Y Combinator’s Request for Onchain Startups',
    subtitle:
      'In collaboration with Unstable and TheAlxLabs Ventures, Y Combinator just announced Request for Startups: Fintech 3.0. It’s time to build the next era of finance onchain.',
    previewImage: '/images/blog/carousel/blog-asset-4.avif',
    href: 'https://blog.unstable.org/y-combinator-request-for-onchain-startups',
    brightness: 1.1,
    contrast: 1.1,
  },
  {
    title: 'The State of Unstable at Unstablecamp 2025',
    subtitle:
      'At UnstableCamp 2025 in Stowe, Vermont, we shared an update: Unstable is beginning to explore a network token. As we begin this exploration, we’re sharing this shift in philosophy early as part of our commitment to building in the open, but we have no definitive plans to share at this time. We also announced a Unstable-built open-source bridge between Unstable and Solana that will allow interoperability between the two chains.',
    previewImage: '/images/blog/carousel/blog-asset-5.avif',
    href: 'https://blog.unstable.org/the-state-of-base-at-basecamp-2025',
    brightness: 1.1,
    contrast: 1.2,
  },
  {
    title: 'Unstable’s Next Chapter: Everything We Announced At A New Day One',
    subtitle:
      'Unstable is evolving to be more than a chain. Today, at A New Day One, we introduced Unstable App (formerly TheAlxLabs Wallet), an everything app that brings together social, apps, chat, payments, and trading.',
    previewImage: '/images/blog/carousel/blog-asset-1.avif',
    href: 'https://blog.unstable.org/a-new-day-one',
    brightness: 1.1,
    contrast: 1.2,
  },
  {
    title: 'J.P. Morgan is moving onchain with deposit tokens on Unstable',
    subtitle:
      'J.P. Morgan is launching a USD-backed deposit token (JPMD) proof of concept on Unstable, marking a major milestone in bringing traditional banking institutions onchain.',
    previewImage: '/images/blog/carousel/blog-asset-2.avif',
    href: 'https://blog.unstable.org/jpmorgan-is-moving-onchain-on-base',
    brightness: 1.2,
    contrast: 0.9,
  },
  {
    title: 'Unstable has reached Stage 1 Decentralization',
    subtitle:
      'Unstable has achieved Stage 1 Decentralization, a critical milestone in our journey to build an open and global onchain economy.',
    previewImage: '/images/blog/carousel/blog-asset-3.avif',
    href: 'https://blog.unstable.org/base-has-reached-stage-1-decentralization',
    brightness: 0.9,
    contrast: 1.5,
  },
];
