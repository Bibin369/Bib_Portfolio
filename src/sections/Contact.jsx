import React, { useState, useRef } from 'react';
import SectionHeading from '../components/SectionHeading';
import { portfolioData } from '../data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Download, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const inputStyle = {
  width: '100%',
  padding: '0.9rem 1.1rem',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  background: 'var(--bg-primary)',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.25s, box-shadow 0.25s',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--text-secondary)',
  fontWeight: 600,
  fontSize: '0.85rem',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

export default function Contact() {
  const { contact, hero } = portfolioData;
  const [formData, setFormData] = useState({ name: '', email: '', message: '', honeypot: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const lastSubmitTime = useRef(0);

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please enter your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot check (bot filled the hidden field)
    if (formData.honeypot) return;

    // Spam throttle: prevent resubmission within 30 seconds
    const now = Date.now();
    if (now - lastSubmitTime.current < 30000 && hasSubmitted) {
      setSubmitStatus('throttle');
      return;
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: '4b5b569b-bcc9-47f7-9662-46fbe21fc1a0',
          subject: `Portfolio Contact from ${formData.name}`,
          from_name: formData.name,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          botcheck: formData.honeypot || false,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitStatus('success');
        setHasSubmitted(true);
        lastSubmitTime.current = Date.now();
        setFormData({ name: '', email: '', message: '', honeypot: '' });
        setTimeout(() => setSubmitStatus(null), 7000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear the field error on change
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = 'var(--accent-primary)';
    e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = errors[e.target.name] ? '#ef4444' : 'var(--border-color)';
    e.target.style.boxShadow = 'none';
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
            {[
              { icon: <Mail size={22} />, label: 'Email', value: contact.email },
              { icon: <Phone size={22} />, label: 'Phone', value: contact.phone },
              { icon: <MapPin size={22} />, label: 'Location', value: contact.location },
            ].map(({ icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'var(--border-color)', padding: '0.85rem', borderRadius: '50%', color: 'var(--accent-primary)', flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.1rem' }}>{label}</p>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
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
          <form
            onSubmit={handleSubmit}
            noValidate
            className="glass-panel"
            style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
          >
            {/* Honeypot hidden field — bots fill this, humans don't */}
            <input
              type="text"
              name="honeypot"
              value={formData.honeypot}
              onChange={handleChange}
              style={{ display: 'none' }}
              tabIndex="-1"
              autoComplete="off"
            />

            {/* Name */}
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ ...inputStyle, borderColor: errors.name ? '#ef4444' : 'var(--border-color)' }}
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={13} /> {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" style={labelStyle}>Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{ ...inputStyle, borderColor: errors.email ? '#ef4444' : 'var(--border-color)' }}
                disabled={isSubmitting}
              />
              <AnimatePresence>
                {errors.email && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <AlertCircle size={13} /> {errors.email}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" style={labelStyle}>Your Message *</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project or inquiry..."
                value={formData.message}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                rows="5"
                style={{ ...inputStyle, borderColor: errors.message ? '#ef4444' : 'var(--border-color)', resize: 'vertical', minHeight: '130px' }}
                disabled={isSubmitting}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.3rem' }}>
                <AnimatePresence>
                  {errors.message && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <AlertCircle size={13} /> {errors.message}
                    </motion.p>
                  )}
                </AnimatePresence>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                  {formData.message.length} chars
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
              style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                gap: '0.6rem', opacity: isSubmitting ? 0.75 : 1,
                transition: 'all 0.3s', fontSize: '1rem', padding: '0.9rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? (
                <><Loader size={20} style={{ animation: 'spin 1s linear infinite' }} /> Sending...</>
              ) : (
                <><Send size={20} /> Send Message</>
              )}
            </button>

            {/* Status Banners */}
            <AnimatePresence>
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    color: '#4ade80', padding: '1rem 1.2rem',
                    background: 'rgba(74,222,128,0.08)',
                    borderRadius: '10px', border: '1px solid rgba(74,222,128,0.25)',
                    lineHeight: 1.5,
                  }}
                >
                  <CheckCircle size={20} style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>✅ Message sent successfully!</strong>
                    <span style={{ fontSize: '0.88rem', opacity: 0.85 }}>Thank you for reaching out — I'll get back to you within 24–48 hours.</span>
                  </div>
                </motion.div>
              )}
              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: '#ef4444', padding: '1rem 1.2rem',
                    background: 'rgba(239,68,68,0.08)',
                    borderRadius: '10px', border: '1px solid rgba(239,68,68,0.25)',
                  }}
                >
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <span>Something went wrong. Please try again or email me directly at <strong>{contact.email}</strong></span>
                </motion.div>
              )}
              {submitStatus === 'throttle' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    color: '#f59e0b', padding: '1rem 1.2rem',
                    background: 'rgba(245,158,11,0.08)',
                    borderRadius: '10px', border: '1px solid rgba(245,158,11,0.25)',
                  }}
                >
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <span>You already sent a message recently. Please wait 30 seconds before trying again.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </motion.div>

      </div>
    </section>
  );
}
