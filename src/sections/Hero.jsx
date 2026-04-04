import React from 'react';
import { motion } from 'framer-motion';
import { Download, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { portfolioData } from '../data/portfolioData';

export default function Hero() {
  const { hero, contact } = portfolioData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section 
      id="hero" 
      className="section-container" 
      style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        paddingTop: '6rem' 
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center', width: '100%' }}>
        
        {/* Text Content */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <motion.div variants={itemVariants}>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}>
              Welcome to my portfolio
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontWeight: 800, lineHeight: 1.1 }}
          >
            Hi, I'm <br />
            <span className="gradient-text">{hero.name}</span>
          </motion.h1>
          
          <motion.h2 variants={itemVariants} style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
            {hero.title}
          </motion.h2>
          
          <motion.p variants={itemVariants} style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
            {hero.tagline}
          </motion.p>
          
          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <a href={hero.resumeLink} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={20} />
              View Resume
            </a>
            <a href="#contact" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={20} />
              Contact Me
            </a>
          </motion.div>

          <motion.div variants={itemVariants} style={{ display: 'flex', gap: '1.5rem', marginTop: '2rem' }}>
            <motion.a whileHover={{ y: -3, color: 'var(--accent-primary)' }} href={contact.github} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }}>
              <FaGithub size={24} />
            </motion.a>
            <motion.a whileHover={{ y: -3, color: 'var(--accent-primary)' }} href={contact.linkedin} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s', display: 'flex' }}>
              <FaLinkedin size={24} />
            </motion.a>
          </motion.div>

        </motion.div>

        {/* Image Content */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.2 }}
           style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <div style={{
            position: 'absolute',
            width: '100%',
            maxWidth: '450px',
            height: '100%',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
            filter: 'blur(40px)',
            opacity: 0.3,
            animation: 'morph 8s ease-in-out infinite',
            zIndex: 0
          }}></div>
          
          <motion.img 
            whileHover={{ scale: 1.02 }}
            src={hero.image} 
            alt={hero.name} 
            style={{
              width: '100%',
              maxWidth: '450px',
              aspectRatio: '1',
              objectFit: 'cover',
              objectPosition: 'center 20%', /* Focuses more on the face for portraits */
              borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
              border: '4px solid var(--bg-glass)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              position: 'relative',
              zIndex: 1
            }}
          />
        </motion.div>
      </div>

      <style>{`
        @keyframes morph {
          0% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
          50% { border-radius: 70% 30% 30% 70% / 70% 70% 30% 30%; }
          100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; }
        }
      `}</style>
    </section>
  );
}
