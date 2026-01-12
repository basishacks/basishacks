export interface RubricData {
  abbr: string
  name: string
  description: string
  weight: number
}

const rubrics = {
  junior: {
    originality: {
      abbr: 'ORG',
      name: 'Innovation & Originality',
      description: 'Novelty of idea and approach.',
      weight: 25,
    },
    impact: {
      abbr: 'IMP',
      name: 'Impact & Usefulness',
      description: 'Potential to solve real problems or benefit users.',
      weight: 15,
    },
    technicality: {
      abbr: 'TEC',
      name: 'Technical Complexity',
      description: 'Depth and quality of technical implementation.',
      weight: 15,
    },
    presentation: {
      abbr: 'PRE',
      name: 'Presentation & Design',
      description: 'Clarity, polish, and design of demo.',
      weight: 15,
    },
    theme: {
      abbr: 'THM',
      name: 'Theme Alignment',
      description: 'How clearly the project relates to the theme.',
      weight: 10,
    },
  },
  senior: {
    originality: {
      abbr: 'ORG',
      name: 'Innovation & Originality',
      description: 'Novelty of idea and approach.',
      weight: 15,
    },
    impact: {
      abbr: 'IMP',
      name: 'Impact & Usefulness',
      description: 'Potential to solve real problems or benefit users.',
      weight: 25,
    },
    technicality: {
      abbr: 'TEC',
      name: 'Technical Complexity',
      description: 'Depth and quality of technical implementation.',
      weight: 15,
    },
    presentation: {
      abbr: 'PRE',
      name: 'Presentation & Design',
      description: 'Clarity, polish, and design of demo.',
      weight: 15,
    },
    theme: {
      abbr: 'THM',
      name: 'Theme Alignment',
      description: 'How clearly the project relates to the theme.',
      weight: 10,
    },
  },
} satisfies {
  junior: Record<string, RubricData>
  senior: Record<string, RubricData>
}

export default rubrics
