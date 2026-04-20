import { Link } from 'react-router-dom';
import { BookOpen, Activity, PlayCircle, ArrowRight, Globe, ShieldCheck, Sparkles, Microscope, FlaskConical, Atom, Languages, Trophy, Star, Zap, Clock, Gamepad2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Skeleton } from '../components/ui/Skeleton';

export function Home() {
  const [recentContent, setRecentContent] = useState<any[]>([]);
  const [topLearners, setTopLearners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qContent = query(collection(db, 'contents'), orderBy('createdAt', 'desc'), limit(3));
    const qLearners = query(collection(db, 'results'), orderBy('score', 'desc'), limit(5));

    const unsubContent = onSnapshot(qContent, (snapshot) => {
      setRecentContent(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    const unsubLearners = onSnapshot(qLearners, (snapshot) => {
      setTopLearners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubContent();
      unsubLearners();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center relative pt-20 bg-highlight border-b-4 border-border">
        {/* Animated Background Icons */}
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              rotate: [0, 360],
              x: [0, 100, 0],
              y: [0, 50, 0]
            }} 
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-20 left-[10%]"
          >
            <Atom size={120} />
          </motion.div>
          <motion.div 
            animate={{ 
              rotate: [360, 0],
              x: [0, -50, 0],
              y: [0, 100, 0]
            }} 
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-20 right-[15%]"
          >
            <Microscope size={150} />
          </motion.div>
        </div>

        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="badge mb-6 flex items-center w-fit">
              <Sparkles size={14} className="mr-2" />
              Yangi Davr Ta'limi
            </div>
            <h1 className="hero-title text-text">
              Bilim olami <span className="text-accent underline decoration-[12px] underline-offset-8">qiziqarli</span> va <span className="text-primary underline decoration-[12px] underline-offset-8">jonli</span>
            </h1>
            <p className="text-xl text-text font-black mb-10 max-w-lg leading-relaxed bg-surface/50 p-4 border-l-8 border-border">
              Tabiiy fanlarni 1-4 sinf o'quvchilari uchun o'yinlar, real tajribalar va videolar orqali o'rganishning eng zo'r usuli!
            </p>
            <div className="flex flex-wrap gap-6">
              <Link to="/theory" className="btn btn-primary px-12 py-5 text-xl group shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                Boshlash
                <ArrowRight size={26} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/diagnostics" className="btn btn-secondary px-12 py-5 text-xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
                Testlar
              </Link>
            </div>
          </motion.div>

          {/* Featured Content Display */}
          <div className="hidden lg:flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="card bg-accent text-white p-6 rotate-[-2deg] border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white text-accent p-3 rounded-xl border-4 border-black">
                  <PlayCircle size={32} />
                </div>
                <div>
                  <h3 className="text-2xl text-white">Video Darslar</h3>
                  <p className="font-bold opacity-90">Eng sara tajribalar videosi</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="card bg-primary text-black p-6 rotate-[2deg] translate-x-12 border-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-white text-primary p-3 rounded-xl border-4 border-black">
                  <Gamepad2 size={32} />
                </div>
                <div>
                  <h3 className="text-2xl">O'yinlar</h3>
                  <p className="font-bold opacity-90">O'ynab, bilim oling!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee/Ticker for Latest News */}
      <div className="bg-text text-highlight py-4 border-y-4 border-border overflow-hidden whitespace-nowrap rotate-1">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 items-center font-black uppercase text-2xl"
        >
          {Array(10).fill('YANGI TAJRIBA VIDEOLARI QO\'SHILDI! • O\'YINLI TESTLARDA QATNASHING • REYTINGDA BIRINCHI BO\'LING! •').map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </motion.div>
      </div>

      {/* Stats & Latest Activity */}
      <section className="py-24 bg-surface border-b-4 border-border overflow-hidden">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Top Learners List */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-primary border-4 border-border shadow-sm">
                  <Trophy size={32} />
                </div>
                <h2 className="text-4xl">Eng Zo'rlar</h2>
              </div>
              <div className="space-y-4">
                {loading ? (
                  <Skeleton count={5} className="h-16 w-full" />
                ) : topLearners.map((user, i) => (
                  <motion.div 
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex justify-between items-center p-4 bg-bg border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`w-8 h-8 flex items-center justify-center border-2 border-border font-black ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-accent' : 'bg-surface'}`}>
                        {i + 1}
                      </span>
                      <span className="font-black truncate max-w-[120px]">{user.userName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Star size={16} className="text-highlight fill-highlight" />
                       <span className="font-black text-xl">{user.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Recent Uploads Grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-10">
                <div className="p-4 bg-highlight border-4 border-border shadow-sm">
                  <Zap size={32} />
                </div>
                <h2 className="text-4xl">Yangi Qo'shilganlar</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  Array(3).fill(0).map((_, i) => (
                    <div key={i} className="card h-48">
                      <Skeleton className="h-full w-full" />
                    </div>
                  ))
                ) : recentContent.map((item, i) => (
                  <motion.div 
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    className={`card p-4 border-4 border-border relative overflow-hidden group h-full flex flex-col ${i % 3 === 0 ? 'bg-accent text-white' : i % 3 === 1 ? 'bg-success text-black' : 'bg-highlight text-black'}`}
                  >
                    <div className="flex justify-between mb-4">
                      <div className="badge bg-surface text-black">
                        {item.grade}-sinf
                      </div>
                      <Clock size={16} className="opacity-50" />
                    </div>
                    <h4 className="text-xl mb-4 line-clamp-2">{item.title}</h4>
                    <Link 
                      to={item.contentType === 'game' ? '/games' : '/theory'} 
                      className="mt-auto flex items-center gap-2 font-black uppercase text-xs border-2 border-black bg-surface text-black p-2 w-fit group-hover:bg-primary transition-all shadow-sm"
                    >
                      Ko'rish <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grades Section */}
      <section className="py-24 bg-bg border-b-4 border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
               <h2 className="text-5xl lg:text-7xl mb-4">Sinflar olami</h2>
               <p className="text-text font-black text-xl max-w-xl border-l-8 border-primary pl-4">
                 Sinfingizni tanlang va qit'alar bozoridek qiziqarli darslarni boshlang.
               </p>
            </div>
            <div className="text-right">
              <div className="p-8 bg-surface border-4 border-border inline-block rotate-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Languages size={48} className="text-accent" />
              </div>
            </div>
          </div>
 
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: '1-sinf', path: '/grade/1', icon: '01', color: 'bg-success', desc: 'Sayohatni boshlash' },
              { name: '2-sinf', path: '/grade/2', icon: '02', color: 'bg-accent', desc: 'Bilimlar kashfiyoti' },
              { name: '3-sinf', path: '/grade/3', icon: '03', color: 'bg-primary', desc: 'Fanlar olami' },
              { name: '4-sinf', path: '/grade/4', icon: '04', color: 'bg-highlight', desc: 'Yangi maqsadlar' },
            ].map((grade, i) => (
              <motion.div 
                key={grade.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={grade.path} className={`card group ${grade.color} block h-full overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
                  <div className="text-8xl font-black text-black/10 absolute -right-4 -top-4 group-hover:text-black/20 transition-all">
                    {grade.icon}
                  </div>
                  <div className="w-16 h-16 bg-surface border-4 border-border text-text rounded-xl flex items-center justify-center mb-6 shadow-sm group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1 transition-all">
                    <span className="text-3xl font-black">{grade.icon.replace('0', '')}</span>
                  </div>
                  <h3 className="text-3xl mb-2 text-text relative z-10">{grade.name}</h3>
                  <p className="text-text font-black opacity-80 mb-6 relative z-10">{grade.desc}</p>
                  <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs bg-surface px-4 py-2 border-4 border-border w-fit shadow-sm relative z-10 group-hover:bg-primary transition-colors">
                    Boshlash <ArrowRight size={14} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section - Refined */}
      <section className="py-32 bg-text text-surface relative overflow-hidden border-b-4 border-border">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 flex flex-wrap gap-20 p-20">
           <Microscope size={200} />
           <FlaskConical size={250} />
           <Atom size={180} />
           <Globe size={220} />
        </div>
        <div className="container relative z-10 flex flex-col items-center">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-primary mb-8 animate-bounce ">
                 <Zap size={64} className="mx-auto" />
              </div>
              <h2 className="text-surface text-4xl lg:text-7xl font-sans leading-tight mb-12 uppercase font-black italic tracking-tighter">
                "Bilim — bu harakatdagi quvvatdir. Biz har bir tajribani kashfiyotga aylantiramiz."
              </h2>
              <p className="text-primary font-black tracking-[0.2em] uppercase text-2xl bg-surface inline-block px-10 py-4 border-8 border-border text-text shadow-[10px_10px_0px_0px_rgba(255,255,255,1)]">
                TABIIY FANLAR JAMOASI
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter - More Brutal */}
      <section className="py-24 bg-accent p-6">
        <div className="container max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, rotate: -1 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            className="card bg-surface p-12 lg:p-20 border-[10px] border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="text-center mb-12">
               <h2 className="text-6xl md:text-8xl text-text mb-6">XABARDOR BO'LING</h2>
               <p className="text-text font-black text-2xl">
                 Yangi o'yinlar va tajribalarni o'tkazib yubormang.
               </p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="EMAIL MANZILINGIZ" 
                className="input-field flex-grow text-2xl p-6 border-8 border-black placeholder:text-black/30"
              />
              <button type="submit" className="btn bg-primary px-12 py-6 text-2xl shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] font-black">
                YUBORISH
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
