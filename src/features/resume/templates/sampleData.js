/**
 * Standardized sample data for Canva-style live preview rendering.
 * Used strictly for thumbnail & full-preview displays. Never persisted.
 */
export const SAMPLE_RESUME_DATA = {
  personalInfo: {
    fullName: 'Alex Sharma',
    email: 'alex.sharma@example.edu',
    phone: '+91 98765 43210',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/alex-sharma',
    github: 'github.com/alexsharma',
    summary: 'Proactive Computer Science student with practical experience building scalable web applications and REST APIs. Strong foundations in data structures, distributed systems, and modern front-end architectures.',
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80'
  },
  role: 'Full Stack Engineer',
  summary: 'Proactive Computer Science student with practical experience building scalable web applications and REST APIs. Strong foundations in data structures, distributed systems, and modern front-end architectures.',
  education: [
    {
      id: 'sample_edu_1',
      degree: 'B.Tech in Computer Science & Engineering',
      college: 'National Institute of Technology',
      cgpa: '8.8 / 10',
      year: '2022 – 2026'
    }
  ],
  skills: [
    'React',
    'Node.js',
    'TypeScript',
    'JavaScript',
    'Python',
    'PostgreSQL',
    'MongoDB',
    'Docker',
    'Tailwind CSS',
    'REST APIs',
    'Git'
  ],
  projects: [
    {
      id: 'sample_proj_1',
      title: 'Distributed Event Booking Platform',
      tech: 'React, Node.js, Redis, PostgreSQL',
      link: 'https://github.com/alexsharma/event-booking',
      description: 'Engineered a concurrent seat-reservation system with Redis-backed distributed locks and transactional email notifications.'
    },
    {
      id: 'sample_proj_2',
      title: 'Real-time Collaborative Code Workspace',
      tech: 'React, WebSockets, Express, Docker',
      link: 'https://github.com/alexsharma/code-workspace',
      description: 'Implemented multi-tenant shared code execution using WebSockets and sandboxed Docker container runners.'
    }
  ],
  experience: [
    {
      id: 'sample_exp_1',
      title: 'Software Development Intern',
      company: 'TechCorp Solutions',
      duration: 'May 2025 – Jul 2025',
      location: 'Bangalore, India',
      details: 'Built REST microservices that reduced query latency by 28%. Partnered with senior engineers to deploy CI/CD pipelines to AWS ECS.'
    }
  ],
  certificates: [
    'AWS Certified Cloud Practitioner',
    'Meta Front-End Developer Professional Certificate'
  ]
};
