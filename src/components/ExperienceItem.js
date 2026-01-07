export default function ExperienceItem({ title, company, period, description }) {
  return (
    <div className="experience-item">
      <div className="experience-header">
        <div>
          <h4>{title}</h4>
          <p className="company">{company}</p>
        </div>
        <span className="period">{period}</span>
      </div>
      <p>{description}</p>
    </div>
  )
}
