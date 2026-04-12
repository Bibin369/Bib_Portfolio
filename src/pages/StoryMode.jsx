import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import { ArrowLeft, ChevronDown, Rocket, Compass, BookOpen, Briefcase, Code, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const CinematicSection = ({ children, background, index }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  
  return (
    <div 
      ref={ref}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: background || 'var(--bg-primary)',
        padding: '2rem'
      }}
    >
      {/* Dynamic Background Parallax Grid */}
      <motion.div 
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          zIndex: 0,
          y: useTransform(scrollYProgress, [0, 1], [0, index % 2 === 0 ? 100 : -100]),
          backgroundImage: 'radial-gradient(var(--text-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      
      <motion.div 
        style={{ 
          maxWidth: '900px', 
          width: '100%', 
          zIndex: 1,
          y,
          opacity
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default function StoryMode() {
  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const { hero, about, education, experience, projects, travel } = portfolioData;

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Top Progress Bar */}
      <motion.div 
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          height: '5px', 
          background: 'var(--accent-primary)', 
          scaleX: scaleProgress, 
          transformOrigin: '0%', 
          zIndex: 100 
        }} 
      />

      {/* Exit Button */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        style={{ position: 'fixed', top: '2rem', left: '2rem', zIndex: 90 }}
      >
        <Link to="/" className="btn-outline glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backdropFilter: 'blur(10px)' }}>
          <ArrowLeft size={18} />
          Exit Story
        </Link>
      </motion.div>

      {/* 1. Introduction */}
      <CinematicSection index={0}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ textAlign: 'center' }}
        >
          <Compass size={40} color="var(--accent-primary)" style={{ margin: '0 auto 2rem auto' }} />
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: 'var(--accent-primary)', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 600 }}>The Journey of</h2>
          <h1 style={{ fontSize: 'clamp(4rem, 10vw, 7rem)', fontWeight: 800, lineHeight: 1, marginBottom: '2rem', background: 'linear-gradient(to right, var(--text-primary), var(--text-secondary))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            {hero.name}
          </h1>
          <p style={{ fontSize: 'clamp(1.2rem, 2vw, 1.5rem)', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
            {about.summary}
          </p>
          
          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            style={{ marginTop: '5rem', opacity: 0.5 }}
          >
            <span style={{ display: 'block', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Scroll to Explore</span>
            <ChevronDown size={24} style={{ margin: '0 auto' }} />
          </motion.div>
        </motion.div>
      </CinematicSection>

      {/* 2. Education */}
      <CinematicSection index={1} background="var(--bg-secondary)">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <BookOpen size={40} color="var(--accent-primary)" />
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Academic Foundation</h2>
        </div>
        <div style={{ display: 'grid', gap: '3rem' }}>
          {education.map((edu, i) => (
            <motion.div 
              key={i}
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: '2rem' }}
            >
              <h3 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{edu.degree}</h3>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--accent-primary)', marginBottom: '1rem' }}>{edu.institution} {edu.year && `• ${edu.year}`}</h4>
            </motion.div>
          ))}
        </div>
      </CinematicSection>

      {/* 3. Experience */}
      <CinematicSection index={2}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2rem', marginBottom: '4rem', textAlign: 'right' }}>
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Professional Grit</h2>
          <Briefcase size={40} color="var(--accent-secondary)" />
        </div>
        <div style={{ display: 'grid', gap: '4rem' }}>
          {experience.map((exp, i) => (
            <motion.div 
              key={i}
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              className="glass-panel"
              style={{ padding: '3rem', borderRight: '4px solid var(--accent-secondary)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '2.2rem', fontWeight: 700 }}>{exp.role}</h3>
                <span style={{ background: 'var(--accent-glow)', color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>{exp.duration}</span>
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>{exp.company}</h4>
              <p style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
                {exp.responsibilities[0]}
              </p>
            </motion.div>
          ))}
        </div>
      </CinematicSection>

      {/* 4. Projects & Skills */}
      <CinematicSection index={3} background="var(--bg-secondary)">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '4rem' }}>
          <Code size={40} color="var(--accent-primary)" />
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Building the Future</h2>
        </div>
        <p style={{ fontSize: '1.2rem', lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '800px' }}>
          Through countless lines of code exploring architectures like IIB, ESQL, and the MERN stack, I've engineered systems aimed at supreme efficiency and scalability. 
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {projects.slice(0,3).map((proj, i) => (
            <motion.div 
              key={i}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)' }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>{proj.title}</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{proj.description}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {proj.technologies.slice(0, 3).map(t => <span key={t} style={{ fontSize: '0.7rem', border: '1px solid var(--text-secondary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{t}</span>)}
              </div>
            </motion.div>
          ))}
        </div>
      </CinematicSection>

      {/* 5. Travel & Expanding Horizons */}
      <CinematicSection index={4}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', marginBottom: '4rem', textAlign: 'center' }}>
          <MapPin size={40} color="var(--accent-secondary)" />
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 700 }}>Beyond the Screen</h2>
        </div>
        <div style={{ position: 'relative', height: '400px', borderRadius: '24px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.img 
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 2 }}
            src={travel[0].image} 
            style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', zIndex: 0, opacity: 0.4 }} 
          />
          <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '2rem' }}>
            <p style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', fontWeight: 500, lineHeight: 1.6, maxWidth: '700px', margin: '0 auto', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
              "Traveling through places like {travel[0].title}, {travel[1].title}, and {travel[2].title} provides the ultimate perspective. It reminds me that every journey, much like every line of code, is part of a much larger, beautiful architecture."
            </p>
          </div>
        </div>
      </CinematicSection>

      {/* 6. Future & Outro */}
      <CinematicSection index={5} background="var(--bg-secondary)">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          style={{ textAlign: 'center' }}
        >
          <Rocket size={50} color="var(--accent-primary)" style={{ margin: '0 auto 2rem auto' }} />
          <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 800, marginBottom: '2rem' }}>What's Next?</h2>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 4rem auto', lineHeight: 1.6 }}>
            I am continually expanding my mastery in scalable backend infrastructures, AI integrations, and seamless user experiences. The story is just beginning.
          </p>
          
          <Link to="/" className="btn-primary" style={{ fontSize: '1.2rem', padding: '1rem 3rem', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
            Back to Portfolio
            <ArrowLeft style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </motion.div>
      </CinematicSection>

    </div>
  );
}
