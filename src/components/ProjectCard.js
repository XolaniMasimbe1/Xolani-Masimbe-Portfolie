import TechTag from './ui/TechTag'

export default function ProjectCard({ title, year, description, technologies }) {
  return (
    <div className="project-card">
      <div className="project-header">
        <h4>{title}</h4>
        <span className="project-year">{year}</span>
      </div>
      <p className="project-description">{description}</p>
      <div className="project-tech">
        {technologies.map((tech, index) => (
          <TechTag key={index}>{tech}</TechTag>
        ))}
      </div>
    </div>
  )
}
