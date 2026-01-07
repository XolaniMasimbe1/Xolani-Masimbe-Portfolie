import SectionTitle from './ui/SectionTitle'
import SkillCategory from './SkillCategory'

const skillsData = [
  {
    title: 'Frontend',
    skills: ['React', 'React Native', 'JavaScript', 'HTML & CSS']
  },
  {
    title: 'Backend',
    skills: ['Node.js', 'PHP', 'Python', 'Java']
  },
  {
    title: 'Database',
    skills: ['SQL', 'MySQL', 'Firebase']
  },
  {
    title: 'Tools',
    skills: ['Git & GitLab', 'AWS', 'Figma']
  }
]

export default function Skills() {
  return (
    <section className="skills">
      <SectionTitle>Technical Skills</SectionTitle>
      <div className="skills-grid">
        {skillsData.map((category, index) => (
          <SkillCategory
            key={index}
            title={category.title}
            skills={category.skills}
          />
        ))}
      </div>
    </section>
  )
}
