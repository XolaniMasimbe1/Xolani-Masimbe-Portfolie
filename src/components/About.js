import SectionTitle from './ui/SectionTitle'
import profilePicture from '../img/Profile picture.jpg'

export default function About() {
  return (
    <section className="about">
      <SectionTitle>About Me</SectionTitle>
      <div className="about-layout">
        <div className="about-photo-wrapper">
          <img
            src={profilePicture}
            alt="Portrait of Xolani Masimbe"
            className="about-photo"
          />
        </div>

        <div className="about-content">
          <p className="about-intro">
            <span className="about-greeting">Hi, I&apos;m Xolani.</span> I build modern web and mobile
            applications with a strong focus on clean architecture, performance, and a smooth user
            experience.
          </p>
          <p>
            I completed my ICT Application Development diploma at CPUT in 2025 and finished my
            Software Developer Internship at Plum Systems (March 2025 - December 2025), working across
            React, React Native, Node.js, and Firebase. I enjoy turning real-world business problems
            into reliable, well‑designed digital products.
          </p>
          <p>
            My experience spans full-stack concepts, from databases (SQL/MySQL) to frontend UX.
            I thrive in collaborative environments, shipping features end-to-end, reviewing code, and
            continuously learning new patterns and tools.
          </p>
        </div>
      </div>
    </section>
  )
}
