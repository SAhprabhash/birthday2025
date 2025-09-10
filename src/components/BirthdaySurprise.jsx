import React, { useEffect, useState, useRef } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';

/* Deluxe Birthday Surprise Component */
export default function BirthdaySurprise(){
  const [showConfetti, setShowConfetti] = useState(true);
  const [name, setName] = useState('My Love');
  const [date, setDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate()); return d.toISOString().slice(0,10);
  });
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(()=> {
    const id = setInterval(()=>{
      const target = new Date(date + 'T00:00:00');
      const diff = target - new Date();
      if(diff<=0){ setTimeLeft('11 sep 2025!'); clearInterval(id); return; }
      const days = Math.floor(diff / (1000*60*60*24));
      const hrs = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
      const mins = Math.floor((diff%(1000*60*60))/(1000*60));
      setTimeLeft(`${days}d ${hrs}h ${mins}m`);
    }, 1000);
    return ()=> clearInterval(id);
  }, [date]);

  // Treasure hunt
  const clues = [
   { q: 'Where did we first meet?', a: 'college' ,b:'devi lal park', c:'movie hall'},
  { q: 'My favorite food?', a: 'rajkachori', b: 'momo'},
  { q: 'A pet name I call you?', a: 'sukku', b:'ninny'},
  { q: 'What is my favorite color?', a: 'blue' },

  { q: 'Where was our first trip together?', a: 'panipat' },    // adjust place
  { q: 'What do I always say before hanging up the phone?', a: 'i love you' },
  { q: 'Which movie did we watch together first?', a: 'runway 24' }, // example
  { q: 'What is my dream destination with you?', a: 'bali' }
  ];
  const [step, setStep] = useState(0);
  const [ans, setAns] = useState('');
  const [treasureDone, setTreasureDone] = useState(false);
  const submitClue = () => {
    if(ans.trim().toLowerCase() === clues[step].a){
      const nxt = step+1; setAns('');
      if(nxt >= clues.length) setTreasureDone(true); else setStep(nxt);
    } else alert('Try again ❤️');
  };

  // Memory match
  const mem = ['/src/assets/photo1.jpg','/src/assets/photo2.jpg','/src/assets/photo3.jpg'];
  const pairs = [...mem, ...mem].sort(()=>Math.random()-0.5);
  const [flipped, setFlipped] = useState(Array(pairs.length).fill(false));
  const [found, setFound] = useState(Array(pairs.length).fill(false));
  const [lock, setLock] = useState(false);
  const flipCard = async (i) => {
    if(lock || flipped[i] || found[i]) return;
    const nf = [...flipped]; nf[i]=true; setFlipped(nf);
    const open = nf.map((v,idx)=> v && !found[idx] ? idx : -1).filter(n=>n>=0);
    if(open.length===2){
      setLock(true);
      await new Promise(r=>setTimeout(r,700));
      const [a,b] = open;
      if(pairs[a]===pairs[b]){ const nf2=[...found]; nf2[a]=nf2[b]=true; setFound(nf2); }
      else { const nf2=[...flipped]; nf2[a]=nf2[b]=false; setFlipped(nf2); }
      setLock(false);
    }
  };

  // Spin wheel
  const slices = ['Hug','Kiss','Sing','Surprise','Dance','Compliment', 'Sex'];
  const [angle, setAngle] = useState(0);
  const [spinResult, setSpinResult] = useState(null);
  const spin = () => {
    const extra = Math.floor(Math.random()*360) + 720;
    const newA = angle + extra;
    setAngle(newA);
    const idx = Math.floor(((newA % 360)/360) * slices.length);
    setTimeout(()=> setSpinResult(slices[idx]), 1500);
  };

  // Slideshow
  const photos = ['/src/assets/photo1.jpg','/src/assets/photo2.jpg','/src/assets/photo3.jpg','/src/assets/photo4.jpg'];
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(()=> {
    const t = setInterval(()=> setSlideIndex(s=> (s+1)%photos.length), 3000);
    return ()=> clearInterval(t);
  }, []);

  // Love letter
  const letter = [
    "Meri jaan Aaj ka din sirf tumhara hai… aur main chahta hoon ki tumhe yaad rahe ki tum meri life ka sabse khoobsurat gift ho. ..."
  ];
  const [revealed, setRevealed] = useState(0);

  // Gift open
  const [giftOpen, setGiftOpen] = useState(false);
  const [giftConfetti, setGiftConfetti] = useState(false);

  // Voice message ref
  const voiceRef = useRef(null);

  // AI compliment via backend
 
  return (
    <div>
      <div className="floting">
        <div className="flex justify-between items-center">
          <strong className="text-blue-600">Happy Birthday Love</strong>
          <button className="text-sm text-gray-700" onClick={()=> setShowConfetti(s=>!s)}>{showConfetti ? 'Hide' : 'Show'}</button>
        </div>
        <div className="mt-2 text-sm">
          <div><strong>{name}</strong></div>
          <div className="text-xs text-gray-600">Countdown: {timeLeft}</div>
        </div>
      </div>

      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Treasure Hunt</h2>
            {!treasureDone ? (
              <>
                <p className="mt-2">{clues[step].q}</p>
                <div className="mt-3 flex gap-2">
                  <input value={ans} onChange={(e)=> setAns(e.target.value)} className="flex-1 border rounded px-3 py-2" placeholder="Type your answer"/>
                  <button onClick={submitClue} className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
                </div>
              </>
            ) : <div className="p-3 bg-blue-50 rounded">You solved all clues! 🎉</div>}
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Memory Match</h2>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {pairs.map((p, i) => (
                <div
                  key={i}
                  onClick={() => flipCard(i)}
                  className="h-32 bg-blue-50 rounded overflow-hidden cursor-pointer"
                >
                  {flipped[i] || found[i] ? (
                    <img src={p} alt="" className="w-full h-full object-cover object-top"/>
                  ) : (
                    <div className="flex items-start justify-center h-full">
                      <span className="text-2xl mt-2">?</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Spin The Wheel</h2>
            <div className="flex items-center gap-4 mt-3">
              <div style={{width:120,height:120,borderRadius:999,display:'flex',alignItems:'center',justifyContent:'center',background:'#e6f0ff',transform:`rotate(${angle}deg)`,transition:'transform 1.5s ease-out'}}>
                🎡
              </div>
              <div>
                <button onClick={spin} className="px-4 py-2 bg-blue-500 text-white rounded">Spin</button>
                {spinResult && <div className="mt-2">Result: <strong>{spinResult}</strong></div>}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Photo Slideshow</h2>
            <div className="mt-3 rounded overflow-hidden">
              <img src={photos[slideIndex]} alt="" className="w-full h-100 object-cover" />
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Love Letter</h2>
            <div className="mt-3">
              <p>{letter.slice(0,revealed).join(' ')}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={()=> setRevealed(r=> Math.min(r+1, letter.length))} className="px-3 py-1 bg-blue-500 text-white rounded">Reveal</button>
                <button onClick={()=> setRevealed(0)} className="px-3 py-1 border rounded">Reset</button>
              </div>
            </div>
          </div>

          {/* Gift Box with animation */}
          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Gift Box</h2>
            <div className="mt-3 flex items-center gap-4 relative">
              {!giftOpen ? (
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  onClick={() => { setGiftOpen(true); setGiftConfetti(true); }}
                  className="w-28 h-28 bg-blue-300 rounded-xl flex items-center justify-center text-4xl cursor-pointer shadow-lg"
                >
                  🎁
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, ease: "easeOutBack" }}
                  className="bg-white p-3 rounded shadow-md"
                >
                  <h3 className="text-lg font-semibold text-blue-600">💌 Surprise!</h3>
                  <p className="mt-2 text-gray-700"> Tell me  a wish according to my preferences (you cannot skip) ❤️</p>
                </motion.div>
              )}

              {/* Confetti on gift open */}
              <AnimatePresence>
                {giftConfetti && (
                  <Confetti
                    recycle={false}
                    numberOfPieces={300}
                    onConfettiComplete={() => setGiftConfetti(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl shadow">
            <h2 className="text-xl font-semibold text-blue-600">Voice Message</h2>
            <div className="mt-2 center">
              <audio ref={voiceRef} controls src="/src/assets/romantic.mp3" />
            </div>
          </div>

         
        </div>
      </div>

      <AnimatePresence>
        {treasureDone && <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}><Confetti recycle={false} numberOfPieces={600} /></motion.div>}
      </AnimatePresence>
    </div>
  );
}
