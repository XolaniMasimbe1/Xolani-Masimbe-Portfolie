import SectionTitle from './ui/SectionTitle'
import ProjectCard from './ProjectCard'

const projectsData = [
  {
    title: 'Candle Management System',
    year: '2025',
    description:
      'End-to-end candle business platform with a Java + Spring Boot backend, MySQL Workbench database, and React/React Native frontends. Exposes RESTful APIs consumed by both the web app and mobile app to manage products, stock, customer orders, production planning, and raw materials in a single system.',
    technologies: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'React', 'React Native', 'Node.js']
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
