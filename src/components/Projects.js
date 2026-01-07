import SectionTitle from './ui/SectionTitle'
import ProjectCard from './ProjectCard'

const projectsData = [
  {
    title: 'Candle Management System',
    year: '2025',
    description: 'Full-stack web and mobile application for automating candle business operations. Manages products, stock levels, customer orders, production planning, and raw material requirements. Consolidates manual spreadsheet processes into a centralized platform.',
    technologies: ['React', 'React Native', 'Node.js', 'MySQL']
  },
  {
    title: 'Healthcare Management System',
    year: '2025',
    description: 'Multi-user hospital operations system with patient appointment booking, role-based features, and secure messaging. Implements user authentication and database-driven solutions.',
    technologies: ['React', 'TypeScript', 'MySQL']
  },
  {
    title: 'CPUT Schedule System',
    year: '2023',
    description: 'Dynamic web application enabling students to track the CPUT shuttle schedule online. Delivers real-time schedule information with focus on user experience and accessibility.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP']
  }
]

export default function Projects() {
  return (
    <section className="projects">
      <SectionTitle>Featured Projects</SectionTitle>
      {projectsData.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          year={project.year}
          description={project.description}
          technologies={project.technologies}
        />
      ))}
    </section>
  )
}
