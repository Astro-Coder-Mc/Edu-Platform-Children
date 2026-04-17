import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, Timer, Trophy, Leaf, Droplets, Sun, Wind, Recycle, TreeDeciduous, ArrowLeft, Factory, Bike, Car, Trash2, Fish, AlertTriangle, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

type GameState = 'map' | 'playing_memory' | 'playing_air' | 'playing_water' | 'won';

interface Card {
  id: number;
  icon: ReactNode;
  name: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const ECO_ICONS = [
  { icon: <Leaf size={32} />, name: 'Barg' },
  { icon: <Droplets size={32} />, name: 'Suv' },
  { icon: <Sun size={32} />, name: 'Quyosh' },
  { icon: <Wind size={32} />, name: 'Shamol' },
  { icon: <Recycle size={32} />, name: 'Qayta ishlash' },
  { icon: <TreeDeciduous size={32} />, name: 'Daraxt' },
];

const AIR_ITEMS = [
  { id: 1, name: 'Zavod tutuni', type: 'bad', icon: <Factory size={80} /> },
  { id: 2, name: 'Velosiped', type: 'good', icon: <Bike size={80} /> },
  { id: 3, name: 'Avtomobil gazi', type: 'bad', icon: <Car size={80} /> },
  { id: 4, name: 'Daraxt ekish', type: 'good', icon: <TreeDeciduous size={80} /> },
  { id: 5, name: 'Quyosh paneli', type: 'good', icon: <Sun size={80} /> },
  { id: 6, name: 'Plastik yoqish', type: 'bad', icon: <Trash2 size={80} /> },
];

export function Games() {
  const [view, setView] = useState<GameState>('map');
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastPlayed, setLastPlayed] = useState<'memory' | 'air' | 'water'>('memory');

  // Memory Game State
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);

  // Air Game State
  const [airItems, setAirItems] = useState(AIR_ITEMS);
  const [currentAirIndex, setCurrentAirIndex] = useState(0);
  const [airScore, setAirScore] = useState(0);

  // Water Game State
  const [waterItems, setWaterItems] = useState<any[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- MEMORY GAME ---
  const initMemoryGame = () => {
    const shuffledCards = [...ECO_ICONS, ...ECO_ICONS]
      .sort(() => Math.random() - 0.5)
      .map((item, index) => ({
        id: index,
        ...item,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
    setTimer(0);
    setIsActive(true);
    setLastPlayed('memory');
    setView('playing_memory');
  };

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].isFlipped || cards[id].isMatched) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [firstId, secondId] = newFlipped;
      
      if (newCards[firstId].name === newCards[secondId].name) {
        setTimeout(() => {
          setCards(prevCards => {
            const matchedCards = [...prevCards];
            matchedCards[firstId].isMatched = true;
            matchedCards[secondId].isMatched = true;
            
            if (matchedCards.every(c => c.isMatched)) {
              setIsActive(false);
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#00E676', '#2979FF', '#FFEA00', '#FF1744']
              });
              setView('won');
            }
            return matchedCards;
          });
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prevCards => {
            const resetCards = [...prevCards];
            resetCards[firstId].isFlipped = false;
            resetCards[secondId].isFlipped = false;
            return resetCards;
          });
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // --- AIR GAME ---
  const initAirGame = () => {
    setAirItems([...AIR_ITEMS].sort(() => Math.random() - 0.5));
    setCurrentAirIndex(0);
    setAirScore(0);
    setMoves(0);
    setTimer(0);
    setIsActive(true);
    setLastPlayed('air');
    setView('playing_air');
  };

  const handleAirChoice = (choice: 'good' | 'bad') => {
    const currentItem = airItems[currentAirIndex];
    if (currentItem.type === choice) {
      setAirScore(s => s + 1);
    }
    setMoves(m => m + 1);
    
    if (currentAirIndex + 1 < airItems.length) {
      setCurrentAirIndex(i => i + 1);
    } else {
      setIsActive(false);
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00E676', '#2979FF', '#FFEA00', '#FF1744']
      });
      setView('won');
    }
  };

  // --- WATER GAME ---
  const initWaterGame = () => {
    const items = [];
    for(let i=0; i<10; i++) {
      items.push({ id: `trash-${i}`, type: 'trash', x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, isCleaned: false });
    }
    for(let i=0; i<5; i++) {
      items.push({ id: `fish-${i}`, type: 'fish', x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, isCleaned: false });
    }
    setWaterItems(items);
    setMoves(0);
    setTimer(0);
    setIsActive(true);
    setLastPlayed('water');
    setView('playing_water');
  };

  const handleWaterClick = (id: string, type: string) => {
    if (type === 'trash') {
      const newItems = waterItems.map(item => item.id === id ? { ...item, isCleaned: true } : item);
      setWaterItems(newItems);
      setMoves(m => m + 1);
      
      if (newItems.filter(i => i.type === 'trash' && !i.isCleaned).length === 0) {
        setIsActive(false);
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00E676', '#2979FF', '#FFEA00', '#FF1744']
        });
        setView('won');
      }
    } else {
      // Clicked a fish! Penalty
      setMoves(m => m + 1);
      setTimer(t => t + 5); // 5 seconds penalty
    }
  };

  const restartCurrentGame = () => {
    if (lastPlayed === 'memory') initMemoryGame();
    if (lastPlayed === 'air') initAirGame();
    if (lastPlayed === 'water') initWaterGame();
  };

  return (
    <div className="container" style={{ margin: '3rem auto', minHeight: '70vh' }}>
      <AnimatePresence mode="wait">
        {view === 'map' && (
          <motion.div
            key="map"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ textAlign: 'center' }}
          >
            <div className="page-header" style={{ borderRadius: '0', padding: '3rem 1rem md:6rem 2rem', marginBottom: '3rem', position: 'relative', overflow: 'hidden', minHeight: 'auto md:600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', zIndex: 1, width: '100%' }}>
                <h1 className="text-4xl sm:text-5xl lg:text-7xl mb-4 text-text font-serif uppercase font-black break-words">Interaktiv O'yinlar Oroli</h1>
                <p className="text-text font-bold text-xl mb-12 max-w-2xl mx-auto bg-surface border-4 border-border px-6 py-3 shadow-sm inline-block">
                  Ekologik bilimlaringizni o'yin orqali mustahkamlang va yangi bosqichlarni oching!
                </p>
                
                <div className="flex justify-center gap-12 flex-wrap px-8">
                  {/* Level 1 - Memory */}
                  <motion.div 
                    whileHover={{ scale: 1.05, translateY: -10 }}
                    className="card bg-surface" 
                    style={{ width: '300px', cursor: 'pointer', padding: '2.5rem' }}
                    onClick={initMemoryGame}
                  >
                    <div className="w-24 h-24 bg-primary border-4 border-border text-text rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Recycle size={48} />
                    </div>
                    <div className="badge mb-4">1-Bosqich</div>
                    <h3 className="text-3xl mb-2 font-serif text-text">Xotira Mashqi</h3>
                    <p className="text-lg font-bold text-text mb-6">Ekologik belgilarni juftligini toping.</p>
                    <button className="btn btn-primary w-full text-lg">
                      <Play size={24} /> O'ynash
                    </button>
                  </motion.div>

                  {/* Level 2 - Air */}
                  <motion.div 
                    whileHover={{ scale: 1.05, translateY: -10 }}
                    className="card bg-surface" 
                    style={{ width: '300px', cursor: 'pointer', padding: '2.5rem' }}
                    onClick={initAirGame}
                  >
                    <div className="w-24 h-24 bg-highlight border-4 border-border text-text rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Wind size={48} />
                    </div>
                    <div className="badge mb-4">2-Bosqich</div>
                    <h3 className="text-3xl mb-2 font-serif text-text">Havo Tozaligi</h3>
                    <p className="text-lg font-bold text-text mb-6">Atmosferani asrash haqida interaktiv topshiriq.</p>
                    <button className="btn btn-primary w-full text-lg">
                      <Play size={24} /> O'ynash
                    </button>
                  </motion.div>

                  {/* Level 3 - Water */}
                  <motion.div 
                    whileHover={{ scale: 1.05, translateY: -10 }}
                    className="card bg-surface" 
                    style={{ width: '300px', cursor: 'pointer', padding: '2.5rem' }}
                    onClick={initWaterGame}
                  >
                    <div className="w-24 h-24 bg-accent border-4 border-border text-text rounded-xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                      <Droplets size={48} />
                    </div>
                    <div className="badge mb-4">3-Bosqich</div>
                    <h3 className="text-3xl mb-2 font-serif text-text">Suv Hayoti</h3>
                    <p className="text-lg font-bold text-text mb-6">Suv havzalarini tozalash simulyatsiyasi.</p>
                    <button className="btn btn-primary w-full text-lg">
                      <Play size={24} /> O'ynash
                    </button>
                  </motion.div>
                </div>
              </div>
              
              {/* Background decorative elements - Island style */}
              <div className="absolute top-10 left-10 opacity-20 rotate-12">
                <Leaf size={200} color="var(--color-text)" />
              </div>
              <div className="absolute bottom-10 right-10 opacity-20 -rotate-12">
                <TreeDeciduous size={250} color="var(--color-text)" />
              </div>
              <div className="absolute top-1/2 right-20 opacity-10">
                <Sun size={150} color="var(--color-text)" />
              </div>
            </div>
          </motion.div>
        )}

        {view === 'playing_memory' && (
          <motion.div
            key="playing_memory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="card bg-surface p-4 sm:p-8">
              {/* Game Header */}
              <div className="flex flex-wrap justify-between items-center gap-4 mb-8 bg-highlight p-4 sm:p-6 rounded-xl border-4 border-border shadow-sm">
                <button onClick={() => setView('map')} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                  <ArrowLeft size={24} />
                </button>
                
                <div className="flex flex-wrap gap-4 sm:gap-12 items-center justify-center flex-grow">
                  <div className="flex items-center gap-2 sm:gap-4 text-text bg-surface px-4 py-2 sm:px-6 sm:py-3 border-4 border-border rounded-xl shadow-sm">
                    <Timer size={24} className="text-accent" />
                    <span className="text-2xl sm:text-4xl font-bold font-mono">{formatTime(timer)}</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 text-text bg-surface px-4 py-2 sm:px-6 sm:py-3 border-4 border-border rounded-xl shadow-sm">
                    <Trophy size={24} className="text-accent" />
                    <span className="text-lg sm:text-2xl font-bold">Moves: {moves}</span>
                  </div>
                </div>

                <button onClick={initMemoryGame} className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                  <RotateCcw size={24} />
                </button>
              </div>

              {/* Game Grid */}
              <div className="game-grid max-w-2xl mx-auto w-full p-2 bg-text/5 rounded-3xl border-4 border-dashed border-border/20">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(card.id)}
                    className="memory-card group"
                  >
                    <motion.div
                      animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                      transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                      className="memory-card-inner"
                    >
                      {/* Front Side */}
                      <div className="memory-card-front group-hover:-translate-y-1 group-hover:-translate-x-1 group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all">
                        <div className="bg-surface border-4 border-border p-2 rounded-xl rotate-3 shadow-sm mb-2 group-hover:rotate-0 transition-transform">
                          <Leaf size={24} className="text-primary-dark" />
                        </div>
                        <span className="text-2xl font-black tracking-tight uppercase bg-white border-2 border-border px-2 py-0.5 rounded shadow-sm">EKO</span>
                      </div>

                      {/* Back Side */}
                      <div className={`memory-card-back ${card.isMatched ? 'bg-success text-text opacity-50' : 'bg-surface text-text'}`}>
                        <div className="scale-125 sm:scale-150 mb-3 bg-white p-3 rounded-full border-4 border-border shadow-md">
                          {card.icon}
                        </div>
                        <span className="text-xs sm:text-sm font-black uppercase text-center px-2 bg-text text-white py-1 rounded-sm shadow-sm">
                          {card.name}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {view === 'playing_air' && (
          <motion.div
            key="playing_air"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="card bg-surface">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-12 bg-highlight p-6 rounded-xl border-4 border-border shadow-sm">
                <button onClick={() => setView('map')} className="w-16 h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                  <ArrowLeft size={32} />
                </button>
                
                <div className="flex gap-12 items-center">
                  <div className="flex items-center gap-4 text-text bg-surface px-6 py-3 border-4 border-border rounded-xl shadow-sm">
                    <Timer size={32} className="text-accent" />
                    <span className="text-4xl font-bold font-mono">{formatTime(timer)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-text bg-surface px-6 py-3 border-4 border-border rounded-xl shadow-sm">
                    <span className="text-2xl font-bold uppercase">Bosqich: {currentAirIndex + 1}/{airItems.length}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={initAirGame} className="w-16 h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                    <RotateCcw size={32} />
                  </button>
                </div>
              </div>

              {/* Air Game Content */}
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-serif uppercase font-black mb-8">Bu narsa tabiat uchun...</h2>
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentAirIndex}
                    initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                    className="bg-bg border-4 border-border rounded-xl p-16 mb-12 shadow-sm inline-block"
                  >
                    <div className="text-primary mb-6 flex justify-center">
                      {airItems[currentAirIndex].icon}
                    </div>
                    <h3 className="text-3xl font-bold uppercase">{airItems[currentAirIndex].name}</h3>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-8 justify-center">
                  <button 
                    onClick={() => handleAirChoice('bad')}
                    className="btn bg-error text-surface border-4 border-border hover:-translate-y-2 hover:shadow-none transition-all py-6 px-12 text-2xl flex items-center gap-4"
                  >
                    <X size={32} /> Zararli
                  </button>
                  <button 
                    onClick={() => handleAirChoice('good')}
                    className="btn bg-success text-text border-4 border-border hover:-translate-y-2 hover:shadow-none transition-all py-6 px-12 text-2xl flex items-center gap-4"
                  >
                    <Check size={32} /> Foydali
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'playing_water' && (
          <motion.div
            key="playing_water"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl mx-auto"
          >
            <div className="card bg-surface">
              {/* Game Header */}
              <div className="flex justify-between items-center mb-12 bg-highlight p-6 rounded-xl border-4 border-border shadow-sm">
                <button onClick={() => setView('map')} className="w-16 h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                  <ArrowLeft size={32} />
                </button>
                
                <div className="flex gap-12 items-center">
                  <div className="flex items-center gap-4 text-text bg-surface px-6 py-3 border-4 border-border rounded-xl shadow-sm">
                    <Timer size={32} className="text-accent" />
                    <span className="text-4xl font-bold font-mono">{formatTime(timer)}</span>
                  </div>
                  <div className="flex items-center gap-4 text-text bg-surface px-6 py-3 border-4 border-border rounded-xl shadow-sm">
                    <Trash2 size={32} className="text-error" />
                    <span className="text-2xl font-bold uppercase">Chiqindi: {waterItems.filter(i => i.type === 'trash' && !i.isCleaned).length} qoldi</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={initWaterGame} className="w-16 h-16 rounded-xl bg-surface border-4 border-border shadow-sm flex items-center justify-center text-text hover:bg-primary hover:-translate-y-1 transition-all">
                    <RotateCcw size={32} />
                  </button>
                </div>
              </div>

              {/* Water Game Content */}
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl font-serif uppercase font-black mb-6">Suvni tozalang! Faqat chiqindilarni bosing.</h2>
                
                <div className="relative w-full h-[500px] bg-accent border-4 border-border rounded-xl overflow-hidden shadow-inner">
                  {/* Water waves background */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
                  
                  {waterItems.map((item) => {
                    if (item.isCleaned) return null;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.2 }}
                        onClick={() => handleWaterClick(item.id, item.type)}
                        className={`absolute cursor-pointer flex items-center justify-center w-16 h-16 rounded-full border-4 border-border shadow-sm -translate-x-1/2 -translate-y-1/2 ${item.type === 'trash' ? 'bg-surface text-error' : 'bg-highlight text-text'}`}
                        style={{ left: `${item.x}%`, top: `${item.y}%` }}
                      >
                        {item.type === 'trash' ? <Trash2 size={32} /> : <Fish size={32} />}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {view === 'won' && (
          <motion.div
            key="won"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-10 px-4"
          >
            <div className="card max-w-lg mx-auto p-6 sm:p-12 relative z-10 bg-surface">
              <div className="mb-6 sm:mb-8 w-24 h-24 sm:w-32 sm:h-32 bg-highlight border-4 border-border rounded-xl flex items-center justify-center mx-auto shadow-sm">
                <Trophy size={48} className="text-text" />
              </div>
              <h2 className="text-4xl sm:text-6xl mb-4 font-serif text-text uppercase">G'alaba!</h2>
              <p className="text-xl sm:text-2xl font-bold text-text mb-8 sm:mb-10">
                Siz bosqichni muvaffaqiyatli yakunladingiz!
              </p>
              
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-10">
                <div className="bg-bg p-4 sm:p-6 rounded-xl border-4 border-border shadow-sm">
                  <p className="text-[10px] sm:text-sm text-text uppercase font-black tracking-widest mb-1 sm:mb-2 text-center">Vaqt</p>
                  <p className="text-2xl sm:text-4xl font-bold font-mono text-text text-center">{formatTime(timer)}</p>
                </div>
                <div className="bg-bg p-4 sm:p-6 rounded-xl border-4 border-border shadow-sm">
                  <p className="text-[10px] sm:text-sm text-text uppercase font-black tracking-widest mb-1 sm:mb-2 text-center">
                    {lastPlayed === 'air' ? 'Natija' : 'Harakatlar'}
                  </p>
                  <p className="text-2xl sm:text-4xl font-bold font-mono text-text text-center">
                    {lastPlayed === 'air' ? `${airScore}/${airItems.length}` : moves}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={restartCurrentGame} className="btn btn-primary flex-grow py-4 text-lg sm:text-xl">
                  <RotateCcw size={20} /> Qayta
                </button>
                <button onClick={() => setView('map')} className="btn btn-secondary flex-grow py-4 text-lg sm:text-xl">
                  Xarita
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
