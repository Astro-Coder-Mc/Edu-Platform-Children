import { Link } from 'react-router-dom';
import { BookOpen, Activity, PlayCircle, ArrowRight, Globe, ShieldCheck, Sparkles, Microscope, FlaskConical, Atom, Languages } from 'lucide-react';
import { motion } from 'motion/react';

export function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative pt-20 bg-highlight border-b-4 border-border">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="z-10"
          >
            <div className="badge mb-6">
              <Sparkles size={14} className="inline mr-2" />
              Milliy Kontent Asosida
            </div>
            <h1 className="hero-title text-text">
              Bilim olami <span className="text-accent underline decoration-8 underline-offset-8">qiziqarli</span> va <span className="text-primary underline decoration-8 underline-offset-8">interaktiv</span> tarzda
            </h1>
            <p className="text-xl text-text font-bold mb-10 max-w-lg leading-relaxed">
              1-5 sinf o'quvchilari uchun Biologiya, Kimyo, Fizika va Ona tili fanlarini o'yinlar, videolar va audio darsliklar orqali o'rganish platformasi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/theory" className="btn btn-primary px-10 py-4 text-lg">
                Tajribalar
                <ArrowRight size={22} />
              </Link>
              <Link to="/diagnostics" className="btn btn-secondary px-10 py-4 text-lg">
                O'yinli Testlar
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-8 text-sm font-black uppercase tracking-widest text-text">
              <div className="flex items-center gap-2">
                <Globe size={24} className="text-accent" />
                <span>Milliy Dastur</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-primary" />
                <span>Ishonchli Metodika</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-lg border-4 border-border bg-surface">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000" 
                alt="Science Education" 
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-full h-full bg-accent rounded-xl border-4 border-border -z-10"></div>
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 -right-12 glass p-6 rounded-xl z-20 max-w-[220px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-primary rounded-xl border-2 border-border flex items-center justify-center text-text shadow-sm">
                  <PlayCircle size={24} />
                </div>
                <span className="font-black uppercase text-sm">Videolar</span>
              </div>
              <p className="text-sm font-bold text-text">Darslikdagi tajribalarni amalda ko'ring</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-bg border-b-4 border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl mb-4">Fanlar olami</h2>
            <p className="text-text font-bold text-xl max-w-2xl mx-auto">
              Barcha asosiy fanlar bo'yicha qiziqarli va interaktiv darsliklar to'plami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Biologiya', path: '/subject/biologiya', icon: <Activity size={40} />, color: 'bg-success', desc: 'Tabiat va hayot sirlari' },
              { name: 'Kimyo', path: '/subject/kimyo', icon: <FlaskConical size={40} />, color: 'bg-accent', desc: 'Moddalar va reaksiyalar' },
              { name: 'Fizika', path: '/subject/fizika', icon: <Atom size={40} />, color: 'bg-primary', desc: 'Koinot qonuniyatlari' },
              { name: 'Ona tili', path: '/subject/ona-tili', icon: <Languages size={40} />, color: 'bg-highlight', desc: 'Til va adabiyot olami' },
            ].map((sub, i) => (
              <motion.div 
                key={sub.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={sub.path} className={`card group ${sub.color} block h-full`}>
                  <div className="w-16 h-16 bg-surface border-4 border-border text-text rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                    {sub.icon}
                  </div>
                  <h3 className="text-3xl mb-2 text-text">{sub.name}</h3>
                  <p className="text-text font-bold opacity-80 mb-6">{sub.desc}</p>
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs bg-surface px-4 py-2 border-4 border-border w-fit shadow-sm">
                    Boshlash <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Types Section */}
      <section className="py-24 bg-surface border-b-4 border-border">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-5xl lg:text-6xl mb-4">Platforma imkoniyatlari</h2>
            <p className="text-text font-bold text-xl max-w-2xl mx-auto">
              Biz o'quvchilarga tabiiy fanlarni qiziqarli va interaktiv tarzda o'rganish uchun zamonaviy vositalarni taqdim etamiz.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="card group bg-primary"
            >
              <div className="w-20 h-20 bg-surface border-4 border-border text-text rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                <FlaskConical size={40} />
              </div>
              <h3 className="text-3xl mb-4 text-text">Tajribalar Videolari</h3>
              <p className="text-text font-bold mb-8 leading-relaxed text-lg">
                Darslikda berilgan amaliy mashg'ulotlar va tajribalarning qiziqarli video ko'rinishlari.
              </p>
              <Link to="/theory" className="mt-auto flex items-center gap-2 font-black uppercase tracking-widest text-text bg-surface px-6 py-3 rounded-xl border-4 border-border w-fit shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Ko'rish <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="card group bg-error"
            >
              <div className="w-20 h-20 bg-surface border-4 border-border text-text rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                <Activity size={40} />
              </div>
              <h3 className="text-3xl mb-4 text-text">O'yinli Testlar</h3>
              <p className="text-text font-bold mb-8 leading-relaxed text-lg">
                O'zlashtirilgan bilimlarni tekshirish uchun qiziqarli va o'yin tarzida tuzilgan test topshiriqlari.
              </p>
              <Link to="/diagnostics" className="mt-auto flex items-center gap-2 font-black uppercase tracking-widest text-text bg-surface px-6 py-3 rounded-xl border-4 border-border w-fit shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                Testdan o'tish <ArrowRight size={20} />
              </Link>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              className="card group bg-accent"
            >
              <div className="w-20 h-20 bg-surface border-4 border-border text-text rounded-xl flex items-center justify-center mb-8 shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                <PlayCircle size={40} />
              </div>
              <h3 className="text-3xl mb-4 text-text">Interaktiv Ta'lim</h3>
              <p className="text-text font-bold mb-8 leading-relaxed text-lg">
                Tabiat hodisalarini tushunishga yordam beruvchi mantiqiy va interaktiv o'yinlar.
              </p>
              <Link to="/games" className="mt-auto flex items-center gap-2 font-black uppercase tracking-widest text-text bg-surface px-6 py-3 rounded-xl border-4 border-border w-fit shadow-sm hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                O'yinlarni boshlash <ArrowRight size={20} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-32 bg-text text-surface relative overflow-hidden border-b-4 border-border">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 text-primary">
          <div className="absolute top-10 left-10"><Microscope size={180} /></div>
          <div className="absolute bottom-10 right-10"><FlaskConical size={220} /></div>
        </div>
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="text-surface text-4xl lg:text-6xl font-serif leading-tight mb-12 uppercase font-black">
                "Tabiatni o'rganish — bu dunyoni anglashdir. Biz o'quvchilarga fanning qiziqarli olamini ochib beramiz."
              </h2>
              <div className="w-32 h-2 bg-primary mx-auto mb-8"></div>
              <p className="text-primary font-black tracking-widest uppercase text-xl bg-surface inline-block px-6 py-2 border-4 border-border text-text shadow-sm">Tabiiy Fanlar Jamoasi</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-24 bg-highlight">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card bg-surface flex flex-col lg:flex-row items-center gap-12 relative overflow-hidden"
          >
            <div className="lg:w-1/2 text-center lg:text-left relative z-10">
              <h2 className="text-5xl md:text-6xl font-serif text-text mb-6">Yangiliklardan xabardor bo'ling</h2>
              <p className="text-text font-bold text-xl mb-0">
                Yangi tajriba videolari, o'yinlar va testlar haqida birinchilardan bo'lib bilib oling.
              </p>
            </div>
            
            <div className="lg:w-1/2 w-full relative z-10">
              <form className="flex flex-col sm:flex-row gap-4" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder="Email manzilingiz" 
                  className="input-field flex-grow text-lg"
                />
                <button type="submit" className="btn btn-primary px-10 py-4 whitespace-nowrap text-lg">
                  Obuna bo'lish
                </button>
              </form>
              <p className="text-sm font-bold text-text mt-4 text-center lg:text-left">
                * Biz sizning ma'lumotlaringizni hech qachon uchinchi shaxslarga bermaymiz.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
