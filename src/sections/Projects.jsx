import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useMediaQuery from '../hooks/useMediaQuery';

export default function Projects() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const VISIBLE = isMobile ? 1 : 3;
  const { projects } = portfolioData;
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  const canPrev = startIndex > 0;
  const canNext = startIndex + VISIBLE < projects.length;

  const handlePrev = () => {
    if (!canPrev) return;
    setDirection(-1);
    setStartIndex(i => i - 1);
  };

  const handleNext = () => {
    if (!canNext) return;
    setDirection(1);
    setStartIndex(i => i + 1);
  };

  const visible = projects.slice(startIndex, startIndex + VISIBLE);

  const variants = {
    enter: (dir) => ({ opacity: 0, x: dir > 0 ? 80 : -80 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir > 0 ? -80 : 80 }),
  };

  return (
    <section id="projects" className="section-container" style={{ paddingTop: '2rem' }}>
      <SectionHeading title="Featured Projects" subtitle="Some of the notable applications I've built." />

      <div style={{ position: 'relative' }}>

        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          disabled={!canPrev}
          aria-label="Previous projects"
          style={{
            position: 'absolute',
            left: isMobile ? '0.5rem' : '-1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            background: canPrev ? 'var(--bg-secondary)' : 'transparent',
            color: canPrev ? 'var(--text-primary)' : 'var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canPrev ? 'pointer' : 'not-allowed',
            boxShadow: canPrev ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        {/* Carousel Track */}
        <div style={{ overflow: 'hidden', padding: '1rem 0' }}>
          <AnimatePresence mode="popLayout" custom={direction}>
            <motion.div
              key={startIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${VISIBLE}, 1fr)`,
                gap: '2rem',
              }}
            >
              {visible.map((project, index) => (
                <div
                  key={project.title}
                  className="glass-panel"
                  style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Image */}
                  <div style={{ width: '100%', height: '200px', overflow: 'hidden', position: 'relative' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                      background: 'linear-gradient(to bottom, transparent, rgba(10,10,15,0.6))',
                    }} />
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
                      {project.title}
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', flexGrow: 1, fontSize: '0.9rem' }}>
                      {project.description}
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {project.technologies.map((tech) => (
                        <span key={tech} style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.65rem',
                          background: 'var(--border-color)',
                          color: 'var(--accent-primary)',
                          borderRadius: '999px',
                          fontWeight: 500,
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={!canNext}
          aria-label="Next projects"
          style={{
            position: 'absolute',
            right: isMobile ? '0.5rem' : '-1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '1px solid var(--border-color)',
            background: canNext ? 'var(--bg-secondary)' : 'transparent',
            color: canNext ? 'var(--text-primary)' : 'var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: canNext ? 'pointer' : 'not-allowed',
            boxShadow: canNext ? '0 4px 16px rgba(0,0,0,0.2)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          <ChevronRight size={22} />
        </button>
      </div>

      {/* Dot indicators */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2rem' }}>
        {Array.from({ length: projects.length - VISIBLE + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > startIndex ? 1 : -1); setStartIndex(i); }}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: i === startIndex ? '24px' : '8px',
              height: '8px',
              borderRadius: '999px',
              border: 'none',
              background: i === startIndex ? 'var(--accent-primary)' : 'var(--border-color)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              padding: 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
