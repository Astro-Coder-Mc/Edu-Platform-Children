import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Trash2, Video, AlertCircle, Database, Sparkles, Search } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

interface Content {
  id: string;
  title: string;
  subject: string;
  contentType: string;
  grade: number;
  url: string;
  description?: string;
}

export function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contents, setContents] = useState<Content[]>([]);
  const [adminSearch, setAdminSearch] = useState('');
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('biologiya');
  const [contentType, setContentType] = useState('video-dars');
  const [grade, setGrade] = useState(1);
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'astrojamshid@gmail.com') {
        setIsAdmin(true);
        fetchContents();
      } else {
        setIsAdmin(false);
        navigate('/'); // Redirect non-admins
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchContents = async () => {
    const path = 'contents';
    try {
      const q = query(collection(db, path), orderBy('grade', 'asc'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
      setContents(data);
    } catch (err) {
      console.error("Error fetching contents:", err);
      // handleFirestoreError(err, OperationType.LIST, path);
    }
  };

  const filteredAdminContents = contents.filter(c => 
    c.title.toLowerCase().includes(adminSearch.toLowerCase()) ||
    c.subject.toLowerCase().includes(adminSearch.toLowerCase()) ||
    c.contentType.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) {
      setError("Iltimos, barcha majburiy maydonlarni to'ldiring.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    const path = 'contents';
    try {
      await addDoc(collection(db, path), {
        title,
        subject,
        contentType,
        grade: Number(grade),
        url,
        description,
        createdAt: serverTimestamp()
      });
      
      // Reset form
      setTitle('');
      setUrl('');
      setDescription('');
      
      // Refresh list
      fetchContents();
    } catch (err) {
      console.error("Error adding document: ", err);
      setError("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
      // handleFirestoreError(err, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Haqiqatan ham bu kontentni o'chirmoqchimisiz?")) {
      const path = `contents/${id}`;
      try {
        await deleteDoc(doc(db, 'contents', id));
        fetchContents();
      } catch (err) {
        console.error("Error deleting document: ", err);
        alert("O'chirishda xatolik yuz berdi.");
        // handleFirestoreError(err, OperationType.DELETE, path);
      }
    }
  };

  const seedData = async () => {
    if (!window.confirm("Haqiqatan ham namunaviy ma'lumotlarni yuklamoqchimisiz? Bu mavjud ma'lumotlarga qo'shiladi.")) return;
    
    setIsSubmitting(true);
    const path = 'contents';
    const sampleData = [
      // Biologiya
      { title: 'Hujayra tuzilishi', subject: 'biologiya', contentType: 'video-dars', grade: 5, url: 'https://www.youtube.com/embed/URUJD5NEXC8', description: 'Hujayra va uning tarkibiy qismlari haqida batafsil dars.' },
      { title: 'Fotosintez jarayoni', subject: 'biologiya', contentType: 'tajriba', grade: 4, url: 'https://www.youtube.com/embed/D1Ymc311XS8', description: 'Osimliklar qanday oziqlanishini tajriba orqali koramiz.' },
      { title: 'Hayvonlar dunyosi', subject: 'biologiya', contentType: 'game', grade: 2, url: 'built-in', description: 'Hayvonlarni guruhlarga ajratish oyini.' },
      { title: 'Inson tanasi', subject: 'biologiya', contentType: 'test', grade: 5, url: 'built-in', description: 'Inson a\'zolari boyicha bilimingizni sinang.' },
      
      // Kimyo
      { title: 'Suvning xossalari', subject: 'kimyo', contentType: 'tajriba', grade: 3, url: 'https://www.youtube.com/embed/HVT3Y3_gHGg', description: 'Suvning fizik va kimyoviy xossalarini organamiz.' },
      { title: 'Modda agregat holatlari', subject: 'kimyo', contentType: 'video-dars', grade: 5, url: 'https://www.youtube.com/embed/bMbmQzV-Ezs', description: 'Qattiq, suyuq va gaz holatlari haqida.' },
      { title: 'Elementlar jadvali', subject: 'kimyo', contentType: 'game', grade: 5, url: 'built-in', description: 'Kimyoviy elementlarni topish oyini.' },
      { title: 'Kimyoviy reaksiyalar', subject: 'kimyo', contentType: 'test', grade: 4, url: 'built-in', description: 'Oddiy kimyoviy reaksiyalar testi.' },

      // Fizika
      { title: 'Inersiya qonuni', subject: 'fizika', contentType: 'game', grade: 5, url: 'built-in', description: 'Inersiya haqida qiziqarli interaktiv oyin.' },
      { title: 'Tovush va uning tarqalishi', subject: 'fizika', contentType: 'audio', grade: 4, url: 'https://example.com/audio/sound.mp3', description: 'Tovush toalqinlari haqida audio darslik.' },
      { title: 'Yorug\'likning sinishi', subject: 'fizika', contentType: 'tajriba', grade: 5, url: 'https://www.youtube.com/embed/9n3628it5Hg', description: 'Prizma orqali yoruglikning parchalanishi.' },
      { title: 'Elektr zanjiri', subject: 'fizika', contentType: 'test', grade: 5, url: 'built-in', description: 'Elektr va magnitizm boyicha savollar.' },

      // Ona tili
      { title: 'Alifbo qoidalari', subject: 'ona-tili', contentType: 'video-dars', grade: 1, url: 'https://www.youtube.com/embed/example1', description: 'Harflar va tovushlarni organamiz.' },
      { title: 'Gap bo\'laklari', subject: 'ona-tili', contentType: 'test', grade: 4, url: 'built-in', description: 'Gap bolaklari boyicha bilimingizni sinang.' },
      { title: 'Imlo qoidalari', subject: 'ona-tili', contentType: 'game', grade: 3, url: 'built-in', description: 'Sozlarni togri yozish oyini.' },
      { title: 'Ertaklar olami', subject: 'ona-tili', contentType: 'audio', grade: 2, url: 'https://example.com/audio/fairy-tale.mp3', description: 'Ozbek xalq ertaklari audio talqinda.' },
    ];

    try {
      for (const item of sampleData) {
        await addDoc(collection(db, path), {
          ...item,
          createdAt: serverTimestamp()
        });
      }
      alert("Namunaviy ma'lumotlar muvaffaqiyatli yuklandi!");
      fetchContents();
    } catch (err) {
      console.error("Error seeding data:", err);
      alert("Xatolik yuz berdi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container py-20 text-center text-2xl font-bold">Yuklanmoqda...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container py-12">
      <div className="mb-12 border-b-4 border-border pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-serif uppercase font-black mb-4">Admin Panel</h1>
          <p className="text-xl text-text font-bold">
            Platforma kontentlarini boshqarish va yangilash.
          </p>
        </div>
        <button 
          onClick={seedData}
          disabled={isSubmitting}
          className="btn bg-highlight flex items-center gap-2 px-6 py-3 border-4 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase text-sm"
        >
          <Database size={20} /> Namunaviy ma'lumotlar qo'shish
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Add Video Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="card lg:col-span-1 bg-surface"
        >
          <h2 className="text-3xl font-serif mb-6 border-b-4 border-border pb-4 flex items-center gap-3">
            <Video size={28} /> Yangi Video
          </h2>
          
          {error && (
            <div className="bg-error text-surface p-4 border-4 border-border mb-6 font-bold flex items-center gap-2">
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-bold mb-2">Fan</label>
                <select 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  className="input-field w-full text-lg"
                >
                  <option value="biologiya">Biologiya</option>
                  <option value="kimyo">Kimyo</option>
                  <option value="fizika">Fizika</option>
                  <option value="ona-tili">Ona tili</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold mb-2">Sinf</label>
                <select 
                  value={grade} 
                  onChange={(e) => setGrade(Number(e.target.value))}
                  className="input-field w-full text-lg"
                >
                  <option value={1}>1-sinf</option>
                  <option value={2}>2-sinf</option>
                  <option value={3}>3-sinf</option>
                  <option value={4}>4-sinf</option>
                  <option value={5}>5-sinf</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">Kontent turi</label>
              <select 
                value={contentType} 
                onChange={(e) => setContentType(e.target.value)}
                className="input-field w-full text-lg"
              >
                <option value="video-dars">Video Dars</option>
                <option value="tajriba">Tajriba</option>
                <option value="audio">Audio</option>
                <option value="game">O'yin</option>
                <option value="test">Test</option>
              </select>
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">Sarlavha</label>
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Masalan: Hujayra tuzilishi"
                className="input-field w-full text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">URL (Video, Audio yoki O'yin)</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="input-field w-full text-lg"
              />
            </div>

            <div>
              <label className="block text-lg font-bold mb-2">Qisqacha tavsif (ixtiyoriy)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tajriba haqida ma'lumot..."
                className="input-field w-full text-lg min-h-[120px]"
              />
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full text-lg flex items-center justify-center gap-2"
            >
              <Plus size={24} /> {isSubmitting ? "Qo'shilmoqda..." : "Videoni Qo'shish"}
            </button>
          </form>
        </motion.div>

        {/* Content List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="text-3xl font-serif border-b-4 border-border pb-4 w-full md:w-auto">Yuklangan Kontentlar</h2>
            <div className="relative w-full md:w-72">
              <input 
                type="text" 
                placeholder="Qidirish..."
                value={adminSearch}
                onChange={(e) => setAdminSearch(e.target.value)}
                className="input-field w-full pl-10 py-2 text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={16} />
            </div>
          </div>
          
          {filteredAdminContents.length === 0 ? (
            <div className="bg-highlight p-8 border-4 border-border text-center font-bold text-xl">
              {adminSearch ? "Qidiruv bo'yicha ma'lumot topilmadi." : "Hozircha kontentlar yo'q."}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredAdminContents.map((item) => (
                <div key={item.id} className="bg-surface border-4 border-border p-6 flex flex-col md:flex-row gap-6 items-start md:items-center shadow-sm">
                  <div className="w-full md:w-48 aspect-video bg-bg border-4 border-border flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    {item.contentType === 'video-dars' || item.contentType === 'tajriba' ? (
                      item.url.includes('youtube.com') || item.url.includes('youtu.be') ? (
                        <iframe 
                          src={item.url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
                          className="w-full h-full object-cover"
                          title={item.title}
                        ></iframe>
                      ) : (
                        <video src={item.url} className="w-full h-full object-cover" />
                      )
                    ) : (
                      <div className="text-4xl opacity-20">
                        {item.contentType === 'audio' ? '🎵' : item.contentType === 'game' ? '🎮' : '📝'}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <div className="flex gap-2 mb-2">
                      <div className="badge">{item.grade}-sinf</div>
                      <div className="badge bg-primary">{item.subject}</div>
                      <div className="badge bg-accent">{item.contentType}</div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    {item.description && <p className="text-text/80 line-clamp-2">{item.description}</p>}
                  </div>
                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="btn bg-error text-surface border-4 border-border hover:-translate-y-1 hover:shadow-none p-4 flex-shrink-0"
                    title="O'chirish"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
