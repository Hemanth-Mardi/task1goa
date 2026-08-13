interface TitleRule {
  keywords: string[]
  title: string
}

const RULES: TitleRule[] = [
  { keywords: ['ai', 'ml', 'machine learning', 'llm', 'data science'], title: 'THE MODEL WHISPERER' },
  { keywords: ['full stack', 'fullstack', 'full-stack'], title: 'THE SHIP-IT ARCHITECT' },
  { keywords: ['frontend', 'front-end', 'front end', 'ui', 'ux'], title: 'THE PIXEL ENGINEER' },
  { keywords: ['backend', 'back-end', 'back end', 'api', 'server'], title: 'THE SYSTEM BUILDER' },
  { keywords: ['cloud'], title: 'THE INFRA WIZARD' },
  { keywords: ['devops', 'sre', 'platform'], title: 'THE DEPLOYMENT ALCHEMIST' },
  { keywords: ['security', 'cyber', 'pentest', 'infosec'], title: 'THE DIGITAL GUARDIAN' },
  { keywords: ['iot', 'hardware', 'embedded', 'robotics'], title: 'THE REAL-WORLD HACKER' },
  { keywords: ['blockchain', 'web3', 'crypto', 'smart contract'], title: 'THE TRUSTLESS BUILDER' },
  { keywords: ['mobile', 'ios', 'android', 'app dev'], title: 'THE POCKET PLATFORM ARCHITECT' },
  { keywords: ['design', 'product design'], title: 'THE EXPERIENCE CRAFTSMAN' },
  { keywords: ['founder', 'ceo', 'entrepreneur'], title: 'THE ZERO-TO-ONE BUILDER' },
  { keywords: ['product', 'pm'], title: 'THE ROADMAP NAVIGATOR' },
  { keywords: ['game', 'unity', 'unreal'], title: 'THE WORLD BUILDER' },
]

const FALLBACK_TITLES = [
  'THE RELENTLESS BUILDER',
  'THE MIDNIGHT SHIPPER',
  'THE CODE CONJURER',
  'THE IDEA IGNITER',
]

/** Deterministically derives a builder title from free-typed stack/role text. */
export function getBuilderTitle(stackInput: string): string {
  const normalized = stackInput.trim().toLowerCase()
  if (!normalized) return FALLBACK_TITLES[0]

  for (const rule of RULES) {
    if (rule.keywords.some((kw) => normalized.includes(kw))) {
      return rule.title
    }
  }

  // Deterministic fallback based on input, so the same text always yields the same title.
  let hash = 0
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash * 31 + normalized.charCodeAt(i)) >>> 0
  }
  return FALLBACK_TITLES[hash % FALLBACK_TITLES.length]
}
