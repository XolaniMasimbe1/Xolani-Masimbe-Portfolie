import TechTag from './ui/TechTag'

export default function ProjectCard({ title, year, description, technologies, sourceCode }) {
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
      {sourceCode && (
        <div className="project-source">
          <a 
            href={sourceCode} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="source-code-btn"
          >
            View Source Code
          </a>
        </div>
      )}
    </div>
  )
}
