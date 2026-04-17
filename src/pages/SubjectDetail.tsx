import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { PlayCircle, Music, Gamepad2, FileText, FlaskConical, Atom, Activity, Languages, Loader2, ChevronRight, Star, Award, ArrowLeft, Search, Heart } from 'lucide-react';
import { ContentPlayer } from '../components/ContentPlayer';
import { Link } from 'react-router-dom';

interface Content {
  id: string;
  title: string;
  subject: string;
  contentType: string;
  grade: number;
  url: string;
  description?: string;
  isFavorite?: boolean;
}

export function SubjectDetail() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('video-dars');
  const [activeGrade, setActiveGrade] = useState<number | 'all'>('all');
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(JSON.parse(localStorage.getItem('fav_contents') || '[]'));

  const subjectInfo = {
    biologiya: { name: 'Biologiya', icon: <Activity size={48} />, color: 'bg-success', accent: 'border-success' },
    kimyo: { name: 'Kimyo', icon: <FlaskConical size={48} />, color: 'bg-accent', accent: 'border-accent' },
    fizika: { name: 'Fizika', icon: <Atom size={48} />, color: 'bg-primary', accent: 'border-primary' },
    'ona-tili': { name: 'Ona tili', icon: <Languages size={48} />, color: 'bg-highlight', accent: 'border-highlight' },
  }[subjectId || 'biologiya'];

  useEffect(() => {
    const fetchContents = async () => {
      if (!subjectId) return;
      setLoading(true);
      const path = 'contents';
      try {
        const q = query(
          collection(db, path),
          where('subject', '==', subjectId),
          orderBy('grade', 'asc')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
        setContents(data);
      } catch (err) {
        console.error("Error fetching subject content:", err);
        // handleFirestoreError(err, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [subjectId]);

  useEffect(() => {
    localStorage.setItem('fav_contents', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const filteredContents = contents.filter(c => 
    (activeTab === 'all' || c.contentType === activeTab) &&
    (activeGrade === 'all' || c.grade === activeGrade) &&
    (c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     c.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const tabs = [
    { id: 'video-dars', name: 'Video Darslar', icon: <PlayCircle size={20} /> },
    { id: 'tajriba', name: 'Tajribalar', icon: <FlaskConical size={20} /> },
    { id: 'audio', name: 'Audio', icon: <Music size={20} /> },
    { id: 'game', name: 'O\'yinlar', icon: <Gamepad2 size={20} /> },
    { id: 'test', name: 'Testlar', icon: <FileText size={20} /> },
  ];

  if (loading) {
    return (
      <div className="container flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin" size={64} />
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Breadcrumbs */}
      <div className="mb-8">
        <Link to="/" className="flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:text-primary transition-colors">
          <ArrowLeft size={18} /> Asosiy sahifa
        </Link>
      </div>

      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card ${subjectInfo?.color} mb-12 flex flex-col md:flex-row items-center gap-8 p-10`}
      >
        <div className="p-6 bg-surface border-4 border-border shadow-sm">
          {subjectInfo?.icon}
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black uppercase mb-4 break-words">{subjectInfo?.name}</h1>
          <p className="text-lg md:text-xl font-bold opacity-80 max-w-2xl">
            {subjectInfo?.name} fanidan 1-5 sinf o'quvchilari uchun maxsus tayyorlangan interaktiv darsliklar, tajribalar va o'yinlar to'plami.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Filters */}
        <div className="lg:col-span-1 space-y-8">
          <div className="card bg-surface p-6">
            <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-4 border-border pb-2">Sinfni tanlang</h3>
            <div className="flex flex-wrap gap-2">
              {['all', 1, 2, 3, 4, 5].map(g => (
                <button
                  key={g}
                  onClick={() => setActiveGrade(g as any)}
                  className={`px-4 py-2 border-4 border-border font-black text-sm md:text-base transition-all flex-grow text-center ${activeGrade === g ? 'bg-primary shadow-none translate-x-1 translate-y-1' : 'bg-bg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-highlight'}`}
                >
                  {g === 'all' ? 'Hammasi' : `${g}-sinf`}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-surface p-6">
            <h3 className="text-xl font-black uppercase tracking-widest mb-6 border-b-4 border-border pb-2">Bo'limlar</h3>
            <div className="flex flex-col gap-3">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between md:justify-start gap-3 p-4 border-4 border-border font-bold transition-all ${activeTab === tab.id ? 'bg-accent shadow-none translate-x-1 translate-y-1' : 'bg-bg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-highlight'}`}
                >
                  <div className="flex items-center gap-3">
                    {tab.icon}
                    <span className="text-sm md:text-base">{tab.name}</span>
                  </div>
                  <ChevronRight size={16} className="md:hidden opacity-40" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <input 
              type="text"
              placeholder="Darslarni qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field w-full pl-12 py-4 text-lg"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text opacity-40" size={24} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeGrade}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {filteredContents.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-surface border-4 border-dashed border-border">
                  <div className="inline-block p-6 bg-bg border-4 border-border mb-6">
                    <Star size={48} className="opacity-20" />
                  </div>
                  <h3 className="text-2xl font-serif font-black opacity-50">Hozircha bu bo'limda ma'lumot yo'q</h3>
                  <p className="font-bold opacity-40 mt-2">Tez orada yangi darslar qo'shiladi!</p>
                </div>
              ) : (
                filteredContents.map((content) => (
                  <motion.div
                    key={content.id}
                    whileHover={{ y: -8 }}
                    className={`card bg-surface p-0 overflow-hidden flex flex-col border-4 ${subjectInfo?.accent || 'border-border'}`}
                  >
                    <div className="relative aspect-video bg-bg border-b-4 border-border overflow-hidden">
                      <button 
                        onClick={(e) => toggleFavorite(content.id, e)}
                        className={`absolute top-4 right-4 z-10 p-2 border-4 border-border transition-all ${favorites.includes(content.id) ? 'bg-error text-surface' : 'bg-surface text-text hover:bg-highlight'}`}
                      >
                        <Heart size={20} fill={favorites.includes(content.id) ? "currentColor" : "none"} />
                      </button>

                      {content.contentType === 'video-dars' || content.contentType === 'tajriba' ? (
                        <div 
                          className="w-full h-full flex items-center justify-center group cursor-pointer"
                          onClick={() => setSelectedContent(content)}
                        >
                          <img 
                            src={`https://picsum.photos/seed/${content.id}/800/450`} 
                            alt={content.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className={`p-4 ${subjectInfo?.color || 'bg-primary'} border-4 border-border rounded-full shadow-sm group-hover:scale-110 transition-transform`}>
                              <PlayCircle size={48} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="w-full h-full flex items-center justify-center bg-highlight/30 cursor-pointer group"
                          onClick={() => setSelectedContent(content)}
                        >
                          <div className="group-hover:scale-110 transition-transform">
                            {content.contentType === 'audio' ? <Music size={64} /> : 
                             content.contentType === 'game' ? <Gamepad2 size={64} /> : <FileText size={64} />}
                          </div>
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="badge bg-surface">{content.grade}-sinf</span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-grow">
                      <h4 className="text-2xl font-serif font-black mb-3 leading-tight">{content.title}</h4>
                      {content.description && (
                        <p className="text-sm font-bold opacity-70 line-clamp-2 mb-6">{content.description}</p>
                      )}
                      <button 
                        onClick={() => setSelectedContent(content)}
                        className={`btn ${subjectInfo?.color || 'btn-primary'} w-full flex items-center justify-center gap-2`}
                      >
                        Boshlash <ChevronRight size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence>
        {selectedContent && (
          <ContentPlayer 
            content={selectedContent} 
            onClose={() => setSelectedContent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
