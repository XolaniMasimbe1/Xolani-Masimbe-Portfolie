export default function ContactLink({ label, value, href, external = false }) {
  return (
    <a 
      href={href} 
      className="contact-link"
      {...(external && { 
        target: '_blank', 
        rel: 'noopener noreferrer' 
      })}
    >
      <span className="link-label">{label}</span>
      <span className="link-value">{value}</span>
    </a>
  )
}
