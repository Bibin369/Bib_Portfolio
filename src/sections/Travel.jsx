import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioData } from '../data/portfolioData';
import SectionHeading from '../components/SectionHeading';
import { MapPin, X } from 'lucide-react';

const { travel } = portfolioData;

const categories = ["All", "Kerala", "Tamil Nadu", "Karnataka", "Maharashtra", "Goa", "Puducherry"];

export default function Travel() {
  const [filter, setFilter] = useState("All");
  const [selectedPlace, setSelectedPlace] = useState(null);

  const filteredPlaces = filter === "All" 
    ? travel 
    : travel.filter(place => place.state === filter);

  return (
    <section id="travel" className="section">
      <div className="container">
        <SectionHeading title="My Travel Journey" subtitle="Exploring places, creating memories" />
        
        {/* Filters */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          {categories.map((cat, index) => (
            <button
              key={index}
              onClick={() => setFilter(cat)}
              style={{ 
                padding: '0.6rem 1.5rem', 
                borderRadius: '50px', 
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: filter === cat ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' : 'transparent',
                color: filter === cat ? '#fff' : 'var(--text-primary)',
                border: filter === cat ? 'none' : '1px solid var(--border-color)',
                boxShadow: filter === cat ? '0 4px 15px var(--accent-glow)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Travel Grid */}
        <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <AnimatePresence>
            {filteredPlaces.map((place, index) => (
              <motion.div
                key={place.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass-panel"
                style={{ overflow: 'hidden', cursor: 'pointer', padding: 0 }}
                onClick={() => setSelectedPlace(place)}
                whileHover={{ y: -10 }}
              >
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={place.image} 
                    alt={place.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    padding: '1.5rem 1rem 1rem',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    color: 'white'
                  }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 600, margin: 0 }}>{place.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: '#d0d0d0', marginTop: '0.3rem' }}>
                      <MapPin size={14} /> {place.state}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Modal for Details */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                backdropFilter: 'blur(10px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem'
              }}
              onClick={() => setSelectedPlace(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 50, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 50, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-panel"
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '0',
                  position: 'relative'
                }}
              >
                <button
                  onClick={() => setSelectedPlace(null)}
                  style={{
                    position: 'absolute',
                    top: '1.5rem',
                    right: '1.5rem',
                    background: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px', height: '40px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10,
                    backdropFilter: 'blur(5px)'
                  }}
                >
                  <X size={22} />
                </button>
                <div style={{ position: 'relative', width: '100%', height: '350px' }}>
                  <img 
                    src={selectedPlace.image} 
                    alt={selectedPlace.title} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0,
                    height: '150px', background: 'linear-gradient(transparent, var(--bg-primary))'
                  }} />
                </div>
                
                <div style={{ padding: '0 2.5rem 2.5rem', position: 'relative', top: '-40px' }}>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                    {selectedPlace.title}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '1.5rem', fontWeight: 600, fontSize: '1.1rem' }}>
                    <MapPin size={20} /> {selectedPlace.state}
                  </div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                    {selectedPlace.description}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
