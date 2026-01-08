import SectionTitle from './ui/SectionTitle'
import ProjectCard from './ProjectCard'

const projectsData = [
  {
    title: 'Candle Management System',
    year: '2025',
    description:
      'End-to-end candle business platform with a Java + Spring Boot backend, MySQL Workbench database, and React/React Native frontends. Exposes RESTful APIs consumed by both the web app and mobile app to manage products, stock, customer orders, production planning, and raw materials in a single system.',
    technologies: ['Java', 'Spring Boot', 'REST API', 'MySQL', 'React', 'React Native', 'Node.js'],
   // sourceCode: 'https://github.com/XolaniMasimbe1/Candle-Management-System'
  },
  {
    title: 'Healthcare Management System',
    year: '2025',
    description: 'Multi-user hospital operations system with patient appointment booking, role-based features, and secure messaging. Implements user authentication and database-driven solutions.',
    technologies: ['React', 'TypeScript', 'MySQL'],
    sourceCode: 'https://github.com/XolaniMasimbe1/HealthcareManagementSystem'
  },
  {
    title: 'CPUT Schedule System',
    year: '2023',
    description: 'Dynamic web application enabling students to track the CPUT shuttle schedule online. Delivers real-time schedule information with focus on user experience and accessibility.',
    technologies: ['HTML', 'CSS', 'JavaScript', 'PHP'],
    sourceCode: 'https://github.com/XolaniMasimbe1/CPUT_Schedule_System_Project-2/tree/main/Schedule_System'
  },
  {
    title: 'To-Do List App',
    year: '2024',
    description: 'A simple To-Do List app built with React, Redux, and Firebase. Users can add, edit, delete, and mark tasks as completed. Tasks are saved in Firestore, and users can log in using Firebase Authentication.',
    technologies: ['React', 'Redux', 'Firebase', 'Firestore'],
    sourceCode: 'https://github.com/XolaniMasimbe1/to-do-list'
  },
  {
    title: 'Car Vote System',
    year: '2024',
    description: 'A voting system where users can add cars and vote for their favorites. Built with pure Java to demonstrate client-server architecture and database interactions. Helps in understanding how client and server sides operate including database management.',
    technologies: ['Java', 'MySQL', 'JDBC', 'Client-Server Architecture'],
    sourceCode: 'https://github.com/XolaniMasimbe1/Car-vote-system-java/tree/main/Votingdb'
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
          sourceCode={project.sourceCode}
        />
      ))}
    </section>
  )
}
