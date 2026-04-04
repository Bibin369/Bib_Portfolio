import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';

export default function Experience() {
  const { experience } = portfolioData;

  return (
    <section id="experience" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Work Experience" subtitle="My professional journey and career milestones." />

      <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto' }}>
        {/* Timeline Line */}
        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '24px',
          width: '2px',
          background: 'var(--border-color)',
          zIndex: 0
        }}></div>

        {experience.map((job, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            style={{
              position: 'relative',
              paddingLeft: '70px',
              marginBottom: '4rem',
              zIndex: 1
            }}
          >
            {/* Timeline Icon */}
            <div style={{
              position: 'absolute',
              left: '0px',
              top: '0px',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px var(--accent-glow)'
            }}>
              <Briefcase size={20} />
            </div>

            <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {job.role}
                  </h3>
                  <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 500 }}>
                    {job.company}
                  </h4>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--border-color)',
                  padding: '0.25rem 1rem',
                  borderRadius: '999px',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)'
                }}>
                  {job.duration}
                </div>
              </div>
              
              <ul style={{ listStyleType: 'none', paddingLeft: '0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} style={{ 
                    position: 'relative', 
                    paddingLeft: '1.5rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '10px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--accent-primary)'
                    }}></span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
