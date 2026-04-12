import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import About from './sections/About';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Certifications from './sections/Certifications';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Expertise from './sections/Expertise';
import Travel from './sections/Travel';
import ExtraCurricular from './sections/ExtraCurricular';
import Interests from './sections/Interests';
import Contact from './sections/Contact';
import Chatbot from './components/Chatbot';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <About />
            <Experience />
            <Education />
            <Skills />
            <Certifications />
            <Projects />
            <Expertise />
            <ExtraCurricular />
            <Interests />
            <Contact />
          </main>
        } />
        <Route path="/travel" element={
          <main style={{ paddingTop: '60px', minHeight: '100vh' }}>
            <Travel />
          </main>
        } />
      </Routes>
      <Footer />
      <Chatbot />
    </>
  );
}

export default App;
