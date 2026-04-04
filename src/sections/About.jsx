import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';

export default function About() {
  const { about } = portfolioData;

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section id="about" className="section-container">
      <SectionHeading title="About Me" subtitle="A brief introduction to who I am and what I do." />
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '4rem',
        alignItems: 'start'
      }}>
        
        <motion.div 
          className="glass-panel"
          style={{ padding: '2.5rem' }}
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>
            My Journey
          </h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.8' }}>
            {about.description}
          </p>
          <div style={{
            position: 'relative',
            paddingLeft: '1.5rem',
            borderLeft: '2px solid var(--accent-primary)',
            marginTop: '2rem'
          }}>
            <p style={{ fontStyle: 'italic', color: 'var(--text-primary)', fontWeight: 500 }}>
              "{about.summary}"
            </p>
          </div>
        </motion.div>

        {/* Visual Decoration or Stats */}
        <motion.div
           initial={{ opacity: 0, x: 50 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
           style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}
        >
           <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
             <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>1+</h4>
             <p style={{ color: 'var(--text-secondary)' }}>Years Experience</p>
           </div>
           <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
             <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>15+</h4>
             <p style={{ color: 'var(--text-secondary)' }}>Projects Completed</p>
           </div>
           <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', gridColumn: 'span 2' }}>
             <h4 style={{ fontSize: '3rem', fontWeight: 800, className: 'gradient-text' }}>100%</h4>
             <p style={{ color: 'var(--text-secondary)' }}>Client Satisfaction</p>
           </div>
        </motion.div>

      </div>
    </section>
  );
}
