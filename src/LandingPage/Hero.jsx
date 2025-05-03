import React, { useState, useEffect } from 'react';
import logo from '../assets/Frame 6.jpg';
import bgImage from '../assets/entree.png';
import chartImage from '../assets/fxemoji_barchart.jpg';
import esiLogo from '../assets/esi.svg';
import usthbLogo from '../assets/usthb.png';
import sonatrachLogo from '../assets/sonatrach.png';
import koudilImage from '../assets/Koudil.png';
import { IoMdSearch } from "react-icons/io";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoMdMail, IoMdCall, IoMdPin, IoMdGlobe } from "react-icons/io";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { useInView } from 'react-intersection-observer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const collaborationLogos = [
  { src: esiLogo, alt: 'ESI' },
  { src: usthbLogo, alt: 'USTHB' },
  { src: sonatrachLogo, alt: 'Sonatrach' },
  { src: esiLogo, alt: 'Partenaire 4' },
  { src: usthbLogo, alt: 'Partenaire 5' },
  { src: sonatrachLogo, alt: 'Partenaire 6' },
];

const Hero = () => {
  // State variables
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);

  // Data from API
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalPublications: 0,
    totalChercheurs: 0,
    totalEquipes: 0,
    totalDoctorants: 0,
    publicationsParAnnee: []
  });
  const [teamMembers, setTeamMembers] = useState([]);
  const [collaborations, setCollaborations] = useState([]);

  // Counter animation states
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const animationDuration = 2000; // 2 seconds
  const frameRate = 60;

  // Intersection observer hooks
  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  const { ref: aboutRef, inView: aboutInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const { ref: collaborationsRef, inView: collaborationsInView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001');
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        
        setStatsData(data.stats);
        setTeamMembers(data.teamMembers || []);
        setCollaborations(data.collaborations || []);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching homepage data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle counter animation when stats are in view
  useEffect(() => {
    if (statsInView && !isLoading) {
      const statsArray = [
        statsData.totalPublications, 
        statsData.totalChercheurs, 
        statsData.totalEquipes, 
        statsData.totalDoctorants
      ];
      
      const framesCount = (animationDuration / 1000) * frameRate;
      const animations = statsArray.map(targetValue => {
        const increment = targetValue / framesCount;
        return { targetValue, increment };
      });
      
      let frame = 0;

      const animate = () => {
        if (frame < framesCount) {
          setCounters(prev => 
            prev.map((_, index) => Math.min(
              Math.ceil(animations[index].increment * frame), 
              animations[index].targetValue
            ))
          );
          frame++;
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [statsInView, isLoading, statsData]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % teamMembers.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Le nom est requis';
    }
    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'L\'email n\'est pas valide';
    }
    if (!formData.message.trim()) {
      errors.message = 'Le message est requis';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length === 0) {
      try {
        setIsSubmitting(true);
        setSubmitMessage(null);
        
        const response = await fetch(' http://localhost:3001/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          setSubmitMessage({ type: 'success', text: 'Votre message a été envoyé avec succès!' });
          setFormData({ name: '', email: '', message: '' });
        } else {
          const errorData = await response.json();
          setSubmitMessage({ 
            type: 'error', 
            text: errorData.message || 'Une erreur est survenue lors de l\'envoi du message.' 
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSubmitMessage({ 
          type: 'error', 
          text: 'Une erreur de connexion est survenue. Veuillez réessayer.'
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setFormErrors(errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };
  const handleVoirPlusRedirect = () => {
    window.location.href = '/visiteur';
  };

  // Prepare chart data
  const chartData = statsData.publicationsParAnnee.map(item => ({
    annee: item.annee,
    publications: parseInt(item.count)
  }));

  // Statistic labels
  const statsLabels = [
    "Publications",
    "Chercheurs",
    "Équipes",
    "Doctorants"
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex-shrink-0">
              <a href="/"><img src={logo} alt="LMCS Logo" className="h-12" /></a>
            </div>

            {/* Center - Menu Items */}
            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
              <a 
                href="#about" 
                className="relative text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-[-4px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                A propos
              </a>
              <a 
                href="#team" 
                className="relative text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-[-4px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Notre équipe
              </a>
              <a 
                href="#contact" 
                className="relative text-gray-800 font-medium hover:text-blue-600 transition-colors duration-300 after:content-[''] after:absolute after:w-full after:h-0.5 after:bg-blue-600 after:left-0 after:bottom-[-4px] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300"
              >
                Contact us
              </a>
            </div>

            {/* Right - Login Button & Mobile Menu */}
            <div className="flex items-center">
              {/* Login Button */}
              <button 
                onClick={handleLoginRedirect}
                className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
              >
                Se connecter
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden ml-4 text-gray-800 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
          <div className="px-4 py-2 space-y-3">
            <a href="#about" className="block py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 transition-colors duration-200">
              A propos
            </a>
            <a href="#team" className="block py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 transition-colors duration-200">
              Notre équipe
            </a>
            <a href="#contact" className="block py-2 text-gray-800 hover:text-blue-600 hover:bg-blue-50 rounded-lg px-3 transition-colors duration-200">
              Contact us
            </a>
            <button 
              onClick={handleLoginRedirect}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300"
            >
              Se connecter
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow relative min-h-screen">
         {/* Background Image with Overlay */}
         <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${bgImage})`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0" style={{ backgroundColor: 'hsla(0, 0%, 0%, 0.3)' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white text-center font-poppins px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">BIENVENUE</h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
            LABORATOIRE DE METHODE ET DE<br />
            CONCEPTION DES SYSTEMES
          </h2>
          <button
          onClick={handleVoirPlusRedirect} 
          className="bg-blue-500 hover:bg-blue-600 px-8 py-3 rounded-lg flex items-center gap-2 transition-all duration-300">
            Voir plus
            
          </button>
        </div>
      </main>

     {/* Statistics Section */}
<section className="py-16 bg-white">
  {/* Project Statistics */}
  <div 
    ref={statsRef}
    className="max-w-7xl mx-auto px-4 mb-20"
  >
    {isLoading ? (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {counters.map((count, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl shadow-lg p-6 transform transition-all duration-700 ${
              statsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="bg-[#0066b1] text-white w-full rounded-lg flex flex-col items-center justify-center py-6 min-h-[100px] min-w-[200px]">
              <h3 className="text-4xl font-bold text-center mb-1">{count}+</h3>
              <p className="text-center text-sm text-white ">{statsLabels[index]}</p>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  
  {/* About Section */}
  <div 
    ref={aboutRef}
    className={`max-w-5xl mx-auto px-4 transition-all duration-1000 ${
      aboutInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
    }`}
  >
    <h2 className="text-4xl font-bold text-center mb-16" id="about">A propos</h2>
    
    <div className="flex flex-col items-center">
      {/* Text Content */}
      <p className="text-center text-gray-800 max-w-4xl mb-16 text-lg">
        LMCS (Laboratoire de Méthodes de Conception des Systèmes) est un laboratoire de recherche actif depuis 2001, réunissant 38 enseignants-chercheurs et 102 doctorants. Nos travaux couvrent plusieurs domaines, dont la sécurité informatique, l'intelligence artificielle et l'optimisation.
      </p>
      
      <div className="grid md:grid-cols-2 gap-16 items-center w-full">
        {/* Publications Chart */}
        <div className="w-full max-w-md mx-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              <div className="w-full h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="annee" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="publications" fill="#0066b1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <h4 className="text-center text-lg font-medium mt-2">Publications par année</h4>
            </>
          )}
        </div>
        
        {/* Blue Info Box */}
        <div className="bg-[hsla(204,76%,40%,1)] text-white p-8 rounded-lg">
          <p className="text-center text-lg text-white leading-relaxed">
            Chaque année, nos enseignants-chercheurs et doctorants contribuent à l'avancement des connaissances à travers de nombreuses publications scientifiques.
          </p>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Collaborations Section */}
      
      <section className="py-16 bg-white">
        <div 
          ref={collaborationsRef}
          className={`max-w-7xl mx-auto px-4 transition-all duration-1000 ${
            collaborationsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <h2 className="text-4xl font-bold text-center mb-8">Collaborations</h2>
          <p className="text-center text-gray-800 max-w-4xl mx-auto mb-16 text-lg px-4">
            Le LMCS collabore activement avec des institutions académiques et industrielles à l'échelle nationale et internationale. Ces collaborations permettent d'enrichir la recherche, de développer des projets innovants
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center px-4 md:px-8">
            {collaborationLogos.map((logo, index) => (
              <div 
                key={index} 
                className={`w-full flex justify-center items-center p-4 hover:shadow-lg rounded-lg transition-all duration-700 ${
                  collaborationsInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <img 
                  src={logo.src}
                  alt={logo.alt}
                  className="w-20 sm:w-24 h-auto hover:opacity-80 transition-opacity duration-300"
                />
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* Notre Equipe Section */}
      <section className="py-16 bg-gray-50" id="team">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Notre équipe</h2>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="relative px-4 md:px-12">
              {/* Slider Container */}
              <div className="flex justify-center items-center">
                {/* Cards Container */}
                <div className="flex gap-6 md:gap-8 justify-center overflow-hidden py-8">
                  {/* Show only current slide on mobile, three slides on desktop */}
                  {[0].map((offset) => {
                    const index = currentSlide;
                    const member = teamMembers[index];
                    return (
                      <div 
                        key={index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden w-[280px] transform transition-all duration-500 ease-in-out md:hidden"
                      >
                        <div className={`w-full py-3 text-center text-white ${
                          member.role.includes("Chef") ? "bg-[hsla(204,76%,40%,1)]" : "bg-green-400"
                        }`}>
                          {member.role}
                        </div>
                        <div className="p-8">
                          <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-gray-100">
                            <img 
                              src={member.image || koudilImage}
                              alt={member.name}
                              className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <h3 className="text-xl font-semibold text-center mb-3">{member.name}</h3>
                          <p className="text-gray-600 text-center mb-3">{member.description}</p>
                          <p className="text-gray-500 text-sm text-center">{member.occupation}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Desktop version with 3 slides */}
                  <div className="hidden md:flex gap-8">
                    {[-1, 0, 1].map((offset) => {
                      const index = (currentSlide + offset + teamMembers.length) % teamMembers.length;
                      const member = teamMembers[index];
                      return (
                        <div 
                          key={index}
                          className={`bg-white rounded-xl shadow-lg overflow-hidden w-72 transform transition-all duration-500 ease-in-out ${
                            offset === 0 
                              ? 'scale-100 z-10 opacity-100' 
                              : 'scale-90 opacity-50'
                          }`}
                          style={{
                            transform: `translateX(${offset * 10}%) scale(${offset === 0 ? 1 : 0.9})`,
                          }}
                        >
                          <div className={`w-full py-3 text-center text-white ${
                            member.role.includes("Chef") ? "bg-[hsla(204,76%,40%,1)]" : "bg-green-400"
                          }`}>
                            {member.role}
                          </div>
                          <div className="p-8">
                            <div className="w-32 h-32 rounded-full mx-auto mb-6 overflow-hidden ring-4 ring-gray-100">
                              <img 
                                src={member.image || koudilImage}
                                alt={member.name}
                                className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <h3 className="text-xl font-semibold text-center mb-3">{member.name}</h3>
                            <p className="text-gray-600 text-center mb-3">{member.description}</p>
                            <p className="text-gray-500 text-sm text-center">{member.occupation}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation Arrows - Adjusted for better mobile positioning */}
                <button 
                  onClick={prevSlide}
                  className="absolute left-0 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl -translate-x-1/2 md:translate-x-0"
                  aria-label="Previous slide"
                >
                  <IoIosArrowBack size={28} className="text-gray-600" />
                </button>

                <button 
                  onClick={nextSlide}
                  className="absolute right-0 z-10 bg-white rounded-full p-3 shadow-lg hover:bg-gray-100 transition-all duration-300 hover:shadow-xl translate-x-1/2 md:translate-x-0"
                  aria-label="Next slide"
                >
                  <IoIosArrowForward size={28} className="text-gray-600" />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Aucun membre d'équipe à afficher</p>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white" id="contact">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">CONTACT US</h2>
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Map */}
            <div className="rounded-lg overflow-hidden shadow-lg h-[400px]">
            <iframe
              src="https://www.google.com/maps?q=36.70515892323711,3.174065803576865&z=18&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full rounded-lg"
              title="ESI Location"
            />
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Votre e-mail"
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg border ${formErrors.message ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  ></textarea>
                  {formErrors.message && <p className="text-red-500 text-sm mt-1">{formErrors.message}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-[hsla(204,76%,40%,1)] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                >
                  ENVOYER
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[hsla(204,76%,40%,1)] text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <img src={logo} alt="LMCS Logo" className="h-12 bg-white p-2 rounded" />
              <h3 className="text-lg font-bold">LABORATOIRE DE METHODES DE CONCEPTION DES SYSTEMES</h3>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Pages</h4>
              <ul className="space-y-2">
                <li><a href="/" className="hover:text-gray-300 transition-colors">Home</a></li>
                <li><a href="#about" className="hover:text-gray-300 transition-colors">A propos</a></li>
                <li><a href="#team" className="hover:text-gray-300 transition-colors">Notre équipe</a></li>
                <li><a href="#contact" className="hover:text-gray-300 transition-colors">Contact us</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Contact</h4>
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-white">
                  <IoMdMail className="flex-shrink-0" />
                  <a href="mailto:lmcs@esi.dz" className="hover:text-gray-300 transition-colors ">lmcs@esi.dz</a>
                </p>
                <p className="flex items-center gap-2 text-white">
                  <IoMdCall className="flex-shrink-0" />
                  <span>00 213 (0) 23-93-91-30</span>
                </p>
                <p className="flex items-center gap-2 text-white">
                  <IoMdGlobe className="flex-shrink-0" />
                  <a href="https://lmcs.esi.dz/" className="hover:text-gray-300 transition-colors ">https://lmcs.esi.dz/</a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4 text-white">
              <h4 className="text-lg font-semibold">Adresse</h4>
              <p className="flex items-start gap-2 text-white">
                <IoMdPin className="flex-shrink-0 mt-1" />
                <span>LMCS, École nationale Supérieure d'Informatique, BP M68, Oued Smar, Alger 16309</span>
              </p>
              {/* Social Media */}
              <div className="flex gap-4 mt-4">
                <a href="#" className="bg-white p-2 rounded-full text-[hsla(204,76%,40%,1)] hover:bg-gray-200 transition-colors">
                  <FaFacebookF size={20} />
                </a>
                <a href="#" className="bg-white p-2 rounded-full text-[hsla(204,76%,40%,1)] hover:bg-gray-200 transition-colors">
                  <FaTwitter size={20} />
                </a>
                <a href="#" className="bg-white p-2 rounded-full text-[hsla(204,76%,40%,1)] hover:bg-gray-200 transition-colors">
                  <FaLinkedinIn size={20} />
                </a>
                <a href="#" className="bg-white p-2 rounded-full text-[hsla(204,76%,40%,1)] hover:bg-gray-200 transition-colors">
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 mt-8 pt-8 text-center ">
            <p className="text-white">&copy; {new Date().getFullYear()} LMCS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Hero; 