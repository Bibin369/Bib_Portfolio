import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import { Code, Layers, Zap } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Expertise() {
  const isMobile = useMediaQuery('(max-width: 480px)');
  const { expertise } = portfolioData;

  const icons = [Code, Layers, Zap]; // Mapping dummy icons to expertise

  return (
    <section id="expertise" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="My Expertise" subtitle="Core areas where I deliver the most value." />

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: isMobile ? '0.75rem' : '1.5rem' 
      }}>
        {expertise.map((item, index) => {
          const Icon = icons[index % icons.length];
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="glass-panel"
              style={{
                padding: isMobile ? '1.5rem 1rem' : '2.5rem 2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: isMobile ? '0.5rem' : '1rem',
                borderTop: '3px solid transparent',
                transition: 'all 0.3s ease',
                height: '100%'
              }}
              whileHover={{ 
                borderTopColor: 'var(--accent-primary)',
                transform: 'translateY(-5px)'
              }}
            >
              <div style={{
                background: 'var(--bg-primary)',
                width: isMobile ? '50px' : '70px',
                height: isMobile ? '50px' : '70px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                marginBottom: isMobile ? '0.5rem' : '1rem'
              }}>
                <Icon size={isMobile ? 24 : 32} />
              </div>
              <h3 style={{ 
                fontSize: isMobile ? '0.9rem' : '1.25rem', 
                color: 'var(--text-primary)', 
                minHeight: isMobile ? '2.5rem' : '3.5rem', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '100%',
                lineHeight: 1.2
              }}>
                {item.area}
              </h3>
              <p style={{ 
                color: 'var(--text-secondary)', 
                lineHeight: 1.4, 
                flexGrow: 1, 
                display: 'flex', 
                alignItems: 'flex-start',
                fontSize: isMobile ? '0.75rem' : '0.95rem'
              }}>
                {item.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
