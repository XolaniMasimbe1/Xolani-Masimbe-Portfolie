import SectionTitle from './ui/SectionTitle'
import ContactLink from './ContactLink'

const contactData = [
  {
    label: 'Email',
    value: 'xmasimbe965@gmail.com',
    href: 'mailto:xmasimbe965@gmail.com'
  },
  {
    label: 'GitHub',
    value: 'github.com/XolaniMasimbe1',
    href: 'https://github.com/XolaniMasimbe1',
    external: true
  },
  {
    label: 'Resume',
    value: 'Download Full CV',
    href: '/xolani_masimbe_full_resume_.pdf',
    external: true
  }
]

export default function Contact() {
  return (
    <section className="contact">
      <SectionTitle>Get In Touch</SectionTitle>
      <div className="contact-links">
        {contactData.map((contact, index) => (
          <ContactLink
            key={index}
            label={contact.label}
            value={contact.value}
            href={contact.href}
            external={contact.external}
          />
        ))}
      </div>
    </section>
  )
}
