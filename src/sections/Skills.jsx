import React from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion } from 'framer-motion';
import useMediaQuery from '../hooks/useMediaQuery';
import {
  Cpu, Code2, Layout, Server, Database, Wrench, Users,
} from 'lucide-react';

const CATEGORIES = [
  { key: 'technicalSkills',      title: 'Technical Skills',        icon: Cpu,      accent: '#6366f1' },
  { key: 'programmingLanguages', title: 'Programming Languages',   icon: Code2,    accent: '#8b5cf6' },
  { key: 'frontend',            title: 'Frontend Technologies',    icon: Layout,   accent: '#38bdf8' },
  { key: 'backend',             title: 'Backend Technologies',     icon: Server,   accent: '#4ade80' },
  { key: 'databases',           title: 'Databases',                icon: Database, accent: '#f59e0b' },
  { key: 'toolsPlatforms',      title: 'Tools & Platforms',        icon: Wrench,   accent: '#ec4899' },
  { key: 'softSkills',          title: 'Soft Skills',              icon: Users,    accent: '#14b8a6' },
];

const cardAnim = {
  hidden: { opacity: 0, y: 30 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
  }),
};

const chipAnim = {
  hidden: { opacity: 0, scale: 0.85 },
  show: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.03 },
  }),
};

export default function Skills() {
  const { skills } = portfolioData;
  const isMobile = useMediaQuery('(max-width: 640px)');

  return (
    <section id="skills" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading
        title="Skills & Arsenal"
        subtitle="Technologies, tools, and capabilities I use to build scalable and impactful solutions."
      />

      {/* ── Grid ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
        gap: isMobile ? '1.25rem' : '1.75rem',
      }}>
        {CATEGORIES.map((cat, catIdx) => {
          const Icon = cat.icon;
          const items = skills[cat.key] || [];

          return (
            <motion.div
              key={cat.key}
              custom={catIdx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              variants={cardAnim}
              className="glass-panel"
              style={{
                padding: isMobile ? '1.25rem' : '1.75rem 2rem',
                position: 'relative',
                overflow: 'hidden',
                borderTop: `3px solid ${cat.accent}`,
                /* span full width for last odd card */
                ...(catIdx === CATEGORIES.length - 1 && CATEGORIES.length % 2 !== 0 && !isMobile
                  ? { gridColumn: '1 / -1' }
                  : {}),
              }}
            >
              {/* Background glow */}
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: cat.accent,
                opacity: 0.04,
                filter: 'blur(50px)',
                pointerEvents: 'none',
              }} />

              {/* Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.25rem',
              }}>
                <div style={{
                  width: isMobile ? '38px' : '44px',
                  height: isMobile ? '38px' : '44px',
                  borderRadius: '12px',
                  background: `${cat.accent}18`,
                  border: `1.5px solid ${cat.accent}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={isMobile ? 18 : 22} color={cat.accent} />
                </div>

                <div>
                  <h3 style={{
                    fontSize: isMobile ? '1rem' : '1.15rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>
                    {cat.title}
                  </h3>
                </div>
              </div>

              {/* Chips */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: isMobile ? '0.4rem' : '0.55rem',
              }}>
                {items.map((skill, idx) => (
                  <motion.span
                    key={skill}
                    custom={idx}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={chipAnim}
                    whileHover={{
                      scale: 1.07,
                      y: -2,
                      boxShadow: `0 4px 14px ${cat.accent}30`,
                    }}
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      padding: isMobile ? '0.35rem 0.7rem' : '0.4rem 0.9rem',
                      borderRadius: '8px',
                      fontSize: isMobile ? '0.78rem' : '0.85rem',
                      fontWeight: 500,
                      cursor: 'default',
                      border: `1px solid var(--border-color)`,
                      transition: 'border-color 0.2s, color 0.2s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = cat.accent;
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-color)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>


    </section>
  );
}
