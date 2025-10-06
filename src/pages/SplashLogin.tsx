// src/pages/SplashLogin.tsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login"; // ton composant Login original

// Génère des particules aléatoires
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 4, // taille 
    x: Math.random() * 100,      // position horizontale
    y: Math.random() * 100,      // position verticale 
    delay: Math.random() * 2,    // décalage animer
    duration: Math.random() * 4 + 3, // durée animer
  }));
};

const particles = generateParticles(20);

const SplashLogin: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2200); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen relative bg-indigo-600 overflow-hidden flex justify-center items-center">
      {/* Particules flottantes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-yellow-400 opacity-60"
          style={{ width: p.size, height: p.size, top: `${p.y}%`, left: `${p.x}%` }}
          animate={{ y: ["0%", "-200%"] }}
          transition={{ repeat: Infinity, duration: p.duration, delay: p.delay, ease: "linear" }}
        />
      ))}

      <AnimatePresence>
        {showSplash ? (
          <motion.div
            key="splash"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="z-10 flex flex-col justify-center items-center"
          >
            <motion.img
              src="src/assets/yellow.png" // logo post smart
              alt="Logo"
              className="w-24 h-24 mb-4"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.h1
              className="text-4xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Bienvenue à Post Smart
            </motion.h1>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="w-full z-10"
          >
            <Login /> 
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SplashLogin;
