import React from 'react';
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
import ExtraCurricular from './sections/ExtraCurricular';
import Interests from './sections/Interests';
import Contact from './sections/Contact';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Education />
        <Skills />
        <Certifications />
        <Experience />
        <Projects />
        <Expertise />
        <ExtraCurricular />
        <Interests />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
