import { Link, Outlet, useLocation } from 'react-router-dom';
import { Microscope, BookOpen, Activity, User, Menu, X, Gamepad2, Settings, ChevronDown, Atom, FlaskConical, Languages, GraduationCap, Bookmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ScienceAssistant } from './ScienceAssistant';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
    setIsSubjectsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'astrojamshid@gmail.com') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const subjects = [
    { name: 'Biologiya', path: '/subject/biologiya', icon: <Activity size={18} />, color: 'bg-success' },
    { name: 'Kimyo', path: '/subject/kimyo', icon: <FlaskConical size={18} />, color: 'bg-accent' },
    { name: 'Fizika', path: '/subject/fizika', icon: <Atom size={18} />, color: 'bg-primary' },
    { name: 'Ona tili', path: '/subject/ona-tili', icon: <Languages size={18} />, color: 'bg-highlight' },
  ];

  const navLinks = [
    { name: 'Asosiy', path: '/', icon: <Microscope size={20} /> },
    { name: 'Tajribalar', path: '/theory', icon: <BookOpen size={20} /> },
    { name: "Testlar", path: '/diagnostics', icon: <Activity size={20} /> },
    { name: 'O\'yinlar', path: '/games', icon: <Gamepad2 size={20} /> },
    { name: 'Kutubxona', path: '/library', icon: <Bookmark size={20} /> },
    { name: 'Profil', path: '/profile', icon: <User size={20} /> },
  ];

  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin', icon: <Settings size={20} /> });
  }

  return (
    <div className="layout">
      <header className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="navbar-brand">
            <GraduationCap className="icon" size={24} />
            <span>Bilim Platformasi</span>
          </Link>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMenuOpen(false)}
                  className="fixed inset-0 bg-text/40 backdrop-blur-sm z-[55] lg:hidden"
                />
                <motion.nav
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="navbar-menu open lg:hidden"
                >
                  <div className="flex flex-col gap-6 w-full">
                    {navLinks.map((link) => (
                      <Link
                        key={link.path}
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={`nav-link text-2xl ${location.pathname === link.path ? 'active' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}
                      >
                        {link.icon}
                        {link.name}
                      </Link>
                    ))}
                    <div className="border-t-4 border-border pt-6 mt-4">
                      <p className="text-xs font-black uppercase tracking-widest mb-4 opacity-50">Fanlar bo'limi</p>
                      <div className="grid grid-cols-1 gap-4">
                        {subjects.map((sub) => (
                          <Link 
                            key={sub.path}
                            to={sub.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="flex items-center gap-4 p-4 bg-bg border-4 border-border font-bold hover:bg-highlight"
                          >
                            <div className={`p-2 border-2 border-border ${sub.color}`}>
                              {sub.icon}
                            </div>
                            {sub.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.nav>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Nav */}
          <nav className="navbar-menu">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            
            {/* Subjects Dropdown */}
            <div className="relative ml-4 group">
              <button 
                onClick={() => setIsSubjectsOpen(!isSubjectsOpen)}
                className="btn btn-primary flex items-center gap-2 py-2 px-4"
              >
                Fanlar <ChevronDown size={18} className={`transition-transform ${isSubjectsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isSubjectsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-56 bg-surface border-4 border-border shadow-sm z-50"
                  >
                    {subjects.map((sub) => (
                      <Link 
                        key={sub.path}
                        to={sub.path}
                        className="flex items-center gap-3 p-3 hover:bg-highlight border-b-2 border-border last:border-b-0 transition-colors font-bold text-sm"
                      >
                        <div className={`p-1 border-2 border-border ${sub.color}`}>
                          {sub.icon}
                        </div>
                        {sub.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="footer-brand mb-6">
                <GraduationCap size={32} className="text-text" />
                <span className="text-2xl font-serif">Bilim Platformasi</span>
              </div>
              <p className="text-text max-w-md text-lg leading-relaxed mb-8 font-bold">
                1-5 sinf o'quvchilari uchun interaktiv va qiziqarli ta'lim platformasi. Biologiya, Kimyo, Fizika va Ona tili fanlari bo'yicha darsliklar.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-xl bg-surface border-4 border-border flex items-center justify-center hover:bg-highlight hover:-translate-y-1 hover:shadow-sm transition-all cursor-pointer">
                    <div className="w-4 h-4 bg-text rounded-sm"></div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-text font-serif text-xl mb-6">Fanlar</h4>
              <ul className="footer-links space-y-4">
                {subjects.map(sub => (
                  <li key={sub.path}><Link to={sub.path} className="hover:text-surface transition-colors">{sub.name}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-text font-serif text-xl mb-6">Foydalanuvchi</h4>
              <ul className="footer-links space-y-4">
                <li><Link to="/profile" className="hover:text-surface transition-colors">Shaxsiy profil</Link></li>
                <li><Link to="/profile" className="hover:text-surface transition-colors">Natijalar</Link></li>
                <li><Link to="/" className="hover:text-surface transition-colors">Yordam markazi</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom mt-16 pt-8 border-t-4 border-border text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-text">© {new Date().getFullYear()} Tabiiy Fanlar platformasi</p>
            <div className="flex gap-8 text-sm text-text">
              <a href="#" className="hover:text-surface transition-colors">Maxfiylik siyosati</a>
              <a href="#" className="hover:text-surface transition-colors">Foydalanish shartlari</a>
            </div>
          </div>
        </div>
      </footer>
      <ScienceAssistant />
    </div>
  );
}
