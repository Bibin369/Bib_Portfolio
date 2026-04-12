import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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
import StoryMode from './pages/StoryMode';
import CatchTheBug from './components/CatchTheBug';

function App() {
  const location = useLocation();

  // Scroll to top on every route change natively
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isStoryMode = location.pathname === '/story';

  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: "easeOut" }
  };

  return (
    <>
      {!isStoryMode && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={
            <motion.main
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              transition={pageTransition.transition}
            >
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
            </motion.main>
          } />
          <Route path="/travel" element={
            <motion.main 
              style={{ paddingTop: '60px', minHeight: '100vh' }}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              transition={pageTransition.transition}
            >
              <Travel />
            </motion.main>
          } />
          <Route path="/story" element={
            <motion.main
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              transition={pageTransition.transition}
            >
              <StoryMode />
            </motion.main>
          } />
        </Routes>
      </AnimatePresence>
      {!isStoryMode && <Footer />}
      {!isStoryMode && <Chatbot />}
      {!isStoryMode && <CatchTheBug />}
    </>
  );
}

export default App;
