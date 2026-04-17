import { Activity, CheckCircle, XCircle, Trophy, Star, Loader2, Users } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';

interface LeaderboardEntry {
  id: string;
  userName: string;
  score: number;
  total: number;
}

const questions = [
  {
    id: 1,
    question: "1. O'simliklar o'sishi uchun nimalar zarur?",
    options: [
      "Faqat tuproq va suv",
      "Yorug'lik, suv, havo, issiqlik va ozuqa",
      "Faqat quyosh nuri"
    ],
    correctAnswer: 1
  },
  {
    id: 2,
    question: "2. Suv tabiatda qanday holatlarda uchraydi?",
    options: [
      "Faqat suyuq holatda",
      "Qattiq, suyuq va gaz holatida",
      "Faqat qattiq va suyuq holatda"
    ],
    correctAnswer: 1
  },
  {
    id: 3,
    question: "3. Magnit qanday jismlarni o'ziga tortadi?",
    options: [
      "Yog'och va plastmassani",
      "Temir va po'lat kabi metallarni",
      "Shisha va qog'ozni"
    ],
    correctAnswer: 1
  },
  {
    id: 4,
    question: "4. Yil fasllari nima sababdan almashadi?",
    options: [
      "Yerning o'z o'qi atrofida aylanishi sababli",
      "Yerning Quyosh atrofida aylanishi sababli",
      "Oyning Yer atrofida aylanishi sababli"
    ],
    correctAnswer: 1
  }
];

export function Diagnostics() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const q = query(collection(db, 'results'), orderBy('score', 'desc'), limit(5));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeaderboardEntry));
      setLeaderboard(data);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const handleSelect = (questionId: number, optionIndex: number) => {
    if (showResults) return;
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) score++;
    });
    return score;
  };

  const handleShowResults = async () => {
    setShowResults(true);
    
    // Save to Firestore if user is logged in
    if (auth.currentUser) {
      setIsSaving(true);
      const path = 'results';
      try {
        await addDoc(collection(db, path), {
          userId: auth.currentUser.uid,
          userName: auth.currentUser.displayName || 'Anonym',
          score: calculateScore(),
          total: questions.length,
          testType: 'Tabiatshunoslik Testi',
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Error saving result:", err);
        handleFirestoreError(err, OperationType.CREATE, path);
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="container" style={{ margin: '3rem auto' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem', maxWidth: '800px', margin: '0 auto 4rem' }}
      >
        <div className="w-20 h-20 bg-error border-4 border-border text-text rounded-xl flex items-center justify-center mb-8 shadow-sm mx-auto">
          <Activity size={40} />
        </div>
        <h1 className="text-5xl md:text-6xl mb-6 font-serif uppercase font-black">O'yinli Testlar</h1>
        <p className="text-text font-bold text-xl">
          Tabiiy fanlar bo'yicha bilimlaringizni qiziqarli testlar orqali sinab ko'ring. Har bir to'g'ri javob uchun yulduzcha yig'ing!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-[1200px] mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card lg:col-span-2 p-8 md:p-12"
        >
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between mb-3 text-sm font-black uppercase tracking-widest text-text">
            <span>Test Jarayoni</span>
            <span>{Object.keys(answers).length} / {questions.length}</span>
          </div>
          <div className="h-6 bg-surface border-4 border-border rounded-none overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
              className="h-full bg-primary border-r-4 border-border"
            />
          </div>
        </div>

        <h3 className="text-3xl mb-10 font-serif border-b-4 border-border pb-4 uppercase">Tabiatshunoslik bilimlari</h3>
        
        <div className="flex flex-col gap-12">
          {questions.map((q) => (
            <div key={q.id} className="group">
              <p className="text-2xl font-serif mb-6 text-text">{q.question}</p>
              <div className="flex flex-col gap-4">
                {q.options.map((opt, optIndex) => {
                  const isSelected = answers[q.id] === optIndex;
                  const isCorrect = q.correctAnswer === optIndex;
                  
                  let borderColor = 'var(--color-border)';
                  let bgColor = 'var(--color-surface)';
                  let textColor = 'var(--color-text)';
                  
                  if (showResults) {
                    if (isCorrect) {
                      borderColor = 'var(--color-border)';
                      bgColor = 'var(--color-success)';
                      textColor = 'var(--color-text)';
                    } else if (isSelected && !isCorrect) {
                      borderColor = 'var(--color-border)';
                      bgColor = 'var(--color-error)';
                      textColor = 'var(--color-surface)';
                    }
                  } else if (isSelected) {
                    borderColor = 'var(--color-border)';
                    bgColor = 'var(--color-highlight)';
                    textColor = 'var(--color-text)';
                  }

                  return (
                    <label 
                      key={optIndex}
                      className="flex items-center gap-4 p-5 rounded-xl border-4 shadow-sm transition-all duration-200 cursor-pointer hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      style={{ 
                        borderColor, 
                        backgroundColor: bgColor,
                        color: textColor,
                        cursor: showResults ? 'default' : 'pointer', 
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`q${q.id}`} 
                        checked={isSelected}
                        onChange={() => handleSelect(q.id, optIndex)}
                        disabled={showResults}
                        className="w-6 h-6 accent-text"
                      />
                      <span className="flex-grow font-bold text-lg">{opt}</span>
                      {showResults && isCorrect && <CheckCircle size={28} className="text-text" />}
                      {showResults && isSelected && !isCorrect && <XCircle size={28} className="text-surface" />}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
          
          {!showResults ? (
            <button 
              className="btn btn-primary self-start mt-8 px-12 text-xl flex items-center gap-3" 
              onClick={handleShowResults}
              disabled={Object.keys(answers).length < questions.length || isSaving}
            >
              {isSaving ? <Loader2 className="animate-spin" size={24} /> : "Natijani ko'rish"}
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-12 p-12 bg-highlight border-4 border-border text-text rounded-xl shadow-md text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none flex items-center justify-center">
                <Trophy size={300} />
              </div>
              <div className="relative z-10">
                <div className="flex justify-center gap-4 mb-6">
                  {[...Array(questions.length)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={48} 
                      className={i < calculateScore() ? "text-primary fill-primary" : "text-border"} 
                    />
                  ))}
                </div>
                <h3 className="text-4xl mb-4 font-serif uppercase">
                  Sizning natijangiz: {calculateScore()} / {questions.length}
                </h3>
                <p className="text-text font-bold text-xl mb-8">
                  {calculateScore() === questions.length 
                    ? "Ajoyib! Siz tabiiy fanlar bo'yicha haqiqiy bilimdonsiz." 
                    : calculateScore() >= questions.length / 2
                    ? "Yaxshi harakat! Bilimlaringizni yanada oshirishingiz mumkin."
                    : "Ko'proq o'qish kerak! Tajribalar bo'limiga o'tib bilimlaringizni mustahkamlang."}
                </p>
                <button 
                  className="btn btn-accent px-12 text-xl" 
                  onClick={() => {
                    setAnswers({});
                    setShowResults(false);
                  }}
                >
                  Qaytadan urinish
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Leaderboard Sidebar */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="lg:col-span-1"
      >
        <div className="card bg-surface p-8">
          <h3 className="text-2xl font-serif mb-6 border-b-4 border-border pb-4 flex items-center gap-3 uppercase">
            <Users size={24} /> Bilimdonlar
          </h3>
          <div className="space-y-4">
            {leaderboard.length === 0 ? (
              <p className="text-sm font-bold opacity-50 italic">Hali natijalar yo'q...</p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div key={entry.id} className="flex items-center justify-between p-3 border-4 border-border bg-bg hover:bg-highlight transition-all">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-primary border-2 border-border font-black text-sm">
                      {idx + 1}
                    </span>
                    <span className="font-bold truncate max-w-[120px]">{entry.userName}</span>
                  </div>
                  <span className="font-black text-lg">{entry.score}/{entry.total}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </motion.div>
    </div>
  </div>
);
}
