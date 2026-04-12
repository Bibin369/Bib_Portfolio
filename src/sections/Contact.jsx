import React, { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Download } from 'lucide-react';

export default function Contact() {
  const { contact, hero } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          // USER INSTRUCTION: Replace with your actual Web3Forms access key from https://web3forms.com/
          access_key: "4b5b569b-bcc9-47f7-9662-46fbe21fc1a0",
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      });
      
      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        // Clear success message after 5 seconds
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="section-container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <SectionHeading title="Get In Touch" subtitle="Have a project in mind? Let's build something amazing together." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 style={{ fontSize: '1.5rem', marginBottom: '2rem', color: 'var(--text-primary)' }}>Contact Information</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--border-color)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                <Mail size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{contact.email}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--border-color)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                <Phone size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Phone</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{contact.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: 'var(--border-color)', padding: '1rem', borderRadius: '50%', color: 'var(--accent-primary)' }}>
                <MapPin size={24} />
              </div>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Location</p>
                <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{contact.location}</p>
              </div>
            </div>
          </div>

          <a href={hero.resumeLink} className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={20} />
            Download Resume (PDF)
          </a>
        </motion.div>

        {/* Contact Form */}
        <motion.div
           initial={{ opacity: 0, x: 30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            
            <div>
              <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              />
            </div>
            
            <div>
              <label htmlFor="message" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                style={{
                  width: '100%',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  resize: 'vertical'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', opacity: isSubmitting ? 0.7 : 1, transition: 'all 0.3s' }}
            >
              {isSubmitting ? (
                <>
                   <div style={{ width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                   Sending...
                </>
              ) : (
                <>
                  <Send size={20} /> Send Message
                </>
              )}
            </button>

            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: '#4ade80', textAlign: 'center', padding: '0.5rem', background: 'rgba(74, 222, 128, 0.1)', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.2)' }}>
                  Message sent successfully! I'll be in touch soon.
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ color: '#ef4444', textAlign: 'center', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  Oops! Something went wrong. Please try again.
                </motion.div>
              )}
            </AnimatePresence>

            <style>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
          </form>
        </motion.div>

      </div>
    </section>
  );
}
