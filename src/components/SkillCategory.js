export default function SkillCategory({ title, skills }) {
  return (
    <div className="skill-category">
      <h4>{title}</h4>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  )
}
