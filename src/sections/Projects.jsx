import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';

export default function Projects() {
  const { projects } = portfolioData;

  return (
    <section id="projects" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Featured Projects" subtitle="Some of the notable applications I've built." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
        {projects.map((project, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
            whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
          >
            {/* Project Image */}
            <div style={{ width: '100%', height: '220px', overflow: 'hidden', position: 'relative' }}>
              <img 
                src={project.image} 
                alt={project.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
              />
              <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'linear-gradient(to bottom, transparent, rgba(10,10,15,0.7))',
                zIndex: 1
              }}></div>
            </div>

            {/* Project Content */}
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1, zIndex: 2 }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                {project.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1 }}>
                {project.description}
              </p>

              {/* Technologies */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                {project.technologies.map((tech, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.8rem',
                    padding: '0.25rem 0.75rem',
                    background: 'var(--border-color)',
                    color: 'var(--accent-primary)',
                    borderRadius: '999px',
                    fontWeight: 500
                  }}>
                    {tech}
                  </span>
                ))}
              </div>

            </div>

            <style>{`
              .hover-link:hover { color: var(--accent-primary) !important; }
            `}</style>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
