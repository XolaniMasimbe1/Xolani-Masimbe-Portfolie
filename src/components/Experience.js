import SectionTitle from './ui/SectionTitle'
import ExperienceItem from './ExperienceItem'

const experienceData = [
  {
    title: 'Software Developer Intern',
    company: 'Plum Systems',
    period: '2025',
    description: 'Contributing to the full development lifecycle for mobile and web applications. Working with React, React Native, Node.js, and Firebase while utilizing GitLab for version control and team collaboration.'
  },
  {
    title: 'Timekeeper Volunteer',
    company: 'AWS Community Day',
    period: '2025',
    description: 'Managed critical timeline for General Session keynotes, ensuring precise scheduling and demonstrating attention to detail in a high-visibility role.'
  }
]

export default function Experience() {
  return (
    <section className="experience">
      <SectionTitle>Experience</SectionTitle>
      {experienceData.map((item, index) => (
        <ExperienceItem
          key={index}
          title={item.title}
          company={item.company}
          period={item.period}
          description={item.description}
        />
      ))}
    </section>
  )
}
