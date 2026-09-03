import { ProcessStep } from '../types';

export const INITIAL_PROCESS_STEPS: ProcessStep[] = [
  {
    id: 'step-1',
    stepNumber: '1',
    title: 'Analysis of project tasks',
    description: 'Understanding the goals and objectives of the business',
    iconName: 'target',
    tag: 'Discovery',
    duration: '1-2 weeks',
    status: 'completed',
    deliverables: [
      'Stakeholder alignment interviews',
      'Business goals & KPI definition',
      'Technical constraint mapping',
      'Scope of work baseline'
    ]
  },
  {
    id: 'step-2',
    stepNumber: '2',
    title: '2. Research',
    description: 'Analysis of the target audience, competitors, creating a persona.',
    iconName: 'search',
    tag: 'Insights',
    duration: '2 weeks',
    status: 'completed',
    deliverables: [
      'Competitive landscape analysis',
      'User interview transcripts',
      'Archetype & persona synthesis',
      'Key pain point matrix'
    ]
  },
  {
    id: 'step-3',
    stepNumber: '3',
    title: '3. Functional development',
    description: 'Based on the previous stage, creating a User story, User Flow, Map.',
    iconName: 'flow',
    tag: 'Architecture',
    duration: '2-3 weeks',
    status: 'completed',
    deliverables: [
      'Comprehensive user stories',
      'End-to-end user flows',
      'Information architecture map',
      'Feature prioritization matrix'
    ]
  },
  {
    id: 'step-4',
    stepNumber: '4',
    title: '4. Design',
    description: 'Sketching, wireframes, prototyping.',
    iconName: 'design',
    tag: 'Wireframing',
    duration: '3 weeks',
    status: 'in_progress',
    deliverables: [
      'Low-fidelity paper sketches',
      'Interactive wireframes (Figma)',
      'Clickable navigational prototypes',
      'Initial usability test rounds'
    ]
  },
  {
    id: 'step-5',
    stepNumber: '5',
    title: '5. UI Design',
    description: 'App icon, colors, illustrations, typography, icons',
    iconName: 'ui',
    tag: 'Visual System',
    duration: '2-3 weeks',
    status: 'upcoming',
    deliverables: [
      'Design tokens & color palette',
      'Typographic scale & baseline',
      'Custom vector icon set',
      'High-fidelity component library'
    ]
  },
  {
    id: 'step-6',
    stepNumber: '6',
    title: '6. Presentation',
    description: 'Animation',
    iconName: 'presentation',
    tag: 'Handoff',
    duration: '1 week',
    status: 'upcoming',
    deliverables: [
      'Micro-interactions & timing curves',
      'Interactive client walk-through deck',
      'Design token handoff for engineering',
      'Component QA checklist'
    ]
  }
];
