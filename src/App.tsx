/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crown, 
  BookOpen, 
  Brain, 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  RotateCcw, 
  History, 
  Sparkles,
  Home as HomeIcon,
  Info,
  Map as MapIcon,
  Play,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ahomHistory, Era, Lesson, AhomKing, QuizQuestion, QuizType } from './data/ahomData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GoogleGenAI } from "@google/genai";

// --- AI Image Service ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateAIImage = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
    });
    
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("Image generation failed:", error);
  }
  return null;
};

// --- Components ---

const TypingText = ({ text, onComplete }: { text: string, onComplete?: () => void }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[index]);
        setIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [index, text, onComplete]);

  return <p className="text-amber-800 leading-relaxed text-lg italic">{displayedText}</p>;
};

const AIImage = ({ prompt, alt }: { prompt: string, alt: string }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchImage = async () => {
      setLoading(true);
      const url = await generateAIImage(prompt);
      if (isMounted) {
        setImageUrl(url);
        setLoading(false);
      }
    };
    fetchImage();
    return () => { isMounted = false; };
  }, [prompt]);

  if (loading) {
    return (
      <div className="aspect-[16/9] bg-amber-100 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-amber-300">
        <Loader2 className="animate-spin text-amber-600" size={48} />
        <p className="text-amber-600 font-medium animate-pulse">Summoning the Royal Historian's vision...</p>
      </div>
    );
  }

  if (!imageUrl) {
    return (
      <div className="aspect-[16/9] bg-amber-100 rounded-2xl flex flex-col items-center justify-center gap-4 border-2 border-amber-300">
        <ImageIcon className="text-amber-400" size={48} />
        <p className="text-amber-600 font-medium">The scrolls are faded. (Image failed)</p>
      </div>
    );
  }

  return (
    <motion.img 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      src={imageUrl} 
      alt={alt} 
      className="w-full aspect-[16/9] object-cover rounded-2xl shadow-2xl border-4 border-amber-100"
      referrerPolicy="no-referrer"
    />
  );
};

const EraMap = ({ onSelectEra }: { onSelectEra: (era: Era) => void }) => {
  return (
    <div className="w-full py-12 px-4">
      <h2 className="text-4xl font-serif font-bold text-amber-900 mb-12 text-center">The Timeline of the Peerless</h2>
      <div className="flex gap-8 overflow-x-auto pb-12 px-4 no-scrollbar scroll-smooth">
        {ahomHistory.map((era, idx) => (
          <motion.div
            key={era.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="min-w-[320px] md:min-w-[400px]"
          >
            <Card 
              className="h-full border-2 border-amber-200 hover:border-amber-500 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl"
              onClick={() => onSelectEra(era)}
            >
              <CardHeader className="bg-amber-50 border-b border-amber-100">
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-amber-700">{era.period}</Badge>
                  <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Era {idx + 1}</span>
                </div>
                <CardTitle className="text-2xl font-serif text-amber-900 group-hover:text-amber-700 transition-colors">
                  {era.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-amber-800 text-sm leading-relaxed mb-6">
                  {era.description}
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-widest">Lessons:</p>
                  {era.lessons.map(lesson => (
                    <div key={lesson.id} className="flex items-center gap-2 text-amber-900 text-sm font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {lesson.title}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="bg-amber-50/50">
                <Button variant="ghost" className="w-full text-amber-700 hover:text-amber-900 hover:bg-amber-100">
                  Enter Era <ChevronRight className="ml-2" size={16} />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const LessonFlow = ({ lesson, onComplete }: { lesson: Lesson, onComplete: () => void }) => {
  const [phase, setPhase] = useState<'story' | 'flashcards' | 'exam'>('story');
  const [storyFinished, setStoryFinished] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Flashcard state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Exam state
  const [quizIndex, setQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [examFinished, setExamFinished] = useState(false);

  const currentKing = lesson.kings[cardIndex];
  const currentQuestion = lesson.quiz[quizIndex];

  const playStoryAudio = async () => {
    if (isAudioPlaying) return;
    setIsAudioPlaying(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Listen to the story of ${lesson.title}: ${lesson.storyText}` }] }],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const audioBlob = new Blob([Uint8Array.from(atob(base64Audio), c => c.charCodeAt(0))], { type: 'audio/mp3' });
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.play();
        audio.onended = () => setIsAudioPlaying(false);
      }
    } catch (error) {
      console.error("Audio generation failed:", error);
      setIsAudioPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsAudioPlaying(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (selectedOption) return;
    setSelectedOption(option);
    if (option === currentQuestion.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (quizIndex < lesson.quiz.length - 1) {
      setQuizIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setExamFinished(true);
      if (score >= lesson.quiz.length - 1) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 pb-32">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => { stopAudio(); onComplete(); }} className="text-amber-700">
            <ChevronLeft className="mr-2" /> Back to Era
          </Button>
          <h2 className="text-2xl font-serif font-bold text-amber-900">{lesson.title}</h2>
        </div>
        <div className="flex gap-2">
          <Badge variant={phase === 'story' ? 'default' : 'outline'} className={phase === 'story' ? 'bg-amber-700' : ''}>Story</Badge>
          <Badge variant={phase === 'flashcards' ? 'default' : 'outline'} className={phase === 'flashcards' ? 'bg-amber-700' : ''}>Practice</Badge>
          <Badge variant={phase === 'exam' ? 'default' : 'outline'} className={phase === 'exam' ? 'bg-amber-700' : ''}>Exam</Badge>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {phase === 'story' && (
          <motion.div 
            key="story"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <AIImage prompt={lesson.kings[0].imagePrompt} alt={lesson.kings[0].name} />
            <div className="bg-white border-2 border-amber-100 rounded-3xl p-8 shadow-xl relative">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{lesson.subtitle}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={isAudioPlaying ? stopAudio : playStoryAudio}
                  className="rounded-full border-amber-200 text-amber-700"
                >
                  {isAudioPlaying ? <RotateCcw className="mr-2 animate-spin-slow" size={16} /> : <Play className="mr-2" size={16} />}
                  {isAudioPlaying ? 'Stop Audio' : 'Listen to Story'}
                </Button>
              </div>
              <TypingText text={lesson.storyText} onComplete={() => setStoryFinished(true)} />
              {storyFinished && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 flex justify-end">
                  <Button onClick={() => { stopAudio(); setPhase('flashcards'); }} className="bg-amber-700 hover:bg-amber-800 rounded-full px-8">
                    Start Practice <ChevronRight className="ml-2" />
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'flashcards' && (
          <motion.div 
            key="flashcards"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-md perspective-1000 h-[450px] mb-12">
              <motion.div
                className="relative w-full h-full transition-all duration-500 preserve-3d cursor-pointer"
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Front */}
                <div className="absolute inset-0 backface-hidden bg-white border-2 border-amber-200 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center">
                  <Crown className="text-amber-500 mb-6" size={64} />
                  <h3 className="text-4xl font-serif font-bold text-amber-900 mb-2">{currentKing.name}</h3>
                  <p className="text-amber-600 font-medium tracking-widest uppercase text-sm">{currentKing.reign}</p>
                  <p className="mt-12 text-amber-400 text-sm font-medium animate-bounce">Click to reveal details</p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden bg-amber-50 border-2 border-amber-400 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center rotate-y-180">
                  <h4 className="text-xl font-bold text-amber-900 mb-4">{currentKing.title}</h4>
                  <p className="text-amber-800 leading-relaxed mb-6 text-sm">
                    {currentKing.description}
                  </p>
                  <div className="w-full h-px bg-amber-200 mb-6" />
                  <div className="text-left w-full space-y-2">
                    <p className="text-xs font-bold text-amber-500 uppercase">Achievements:</p>
                    {currentKing.achievements.map((ach, i) => (
                      <p key={i} className="text-amber-900 text-xs flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-400" /> {ach}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => { setCardIndex(prev => (prev - 1 + lesson.kings.length) % lesson.kings.length); setIsFlipped(false); }}
                className="rounded-full border-amber-200"
              >
                <ChevronLeft />
              </Button>
              <Button 
                onClick={() => setPhase('exam')}
                className="bg-amber-700 hover:bg-amber-800 rounded-full px-8"
              >
                Take Exam
              </Button>
              <Button 
                variant="outline" 
                onClick={() => { setCardIndex(prev => (prev + 1) % lesson.kings.length); setIsFlipped(false); }}
                className="rounded-full border-amber-200"
              >
                <ChevronRight />
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'exam' && !examFinished && (
          <motion.div 
            key="exam"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="mb-8">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-amber-600 uppercase tracking-widest">Question {quizIndex + 1} / {lesson.quiz.length}</span>
                <span className="text-sm font-bold text-amber-900">Score: {score}</span>
              </div>
              <Progress value={((quizIndex + 1) / lesson.quiz.length) * 100} className="h-2 bg-amber-100" />
            </div>

            <Card className="border-2 border-amber-200 shadow-xl overflow-hidden">
              <CardHeader className="bg-amber-50 border-b border-amber-100">
                <CardTitle className="text-2xl font-serif text-amber-900 leading-tight">
                  {currentQuestion.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {currentQuestion.type === 'MCQ' && currentQuestion.options?.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 font-medium flex justify-between items-center ${
                      selectedOption === option
                        ? option === currentQuestion.correctAnswer
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-red-50 border-red-500 text-red-700'
                        : selectedOption !== null && option === currentQuestion.correctAnswer
                          ? 'bg-green-50 border-green-500 text-green-700'
                          : 'bg-white border-amber-100 hover:border-amber-300 text-amber-900'
                    }`}
                  >
                    {option}
                  </button>
                ))}

                {currentQuestion.type === 'FLASHCARD_CHOICE' && (
                  <div className="grid grid-cols-2 gap-4">
                    {lesson.kings.map((king) => (
                      <button
                        key={king.id}
                        onClick={() => handleAnswer(king.name)}
                        disabled={selectedOption !== null}
                        className={`p-6 rounded-2xl border-2 transition-all text-center ${
                          selectedOption === king.name
                            ? king.name === currentQuestion.correctAnswer
                              ? 'bg-green-50 border-green-500'
                              : 'bg-red-50 border-red-500'
                            : selectedOption !== null && king.name === currentQuestion.correctAnswer
                              ? 'bg-green-50 border-green-500'
                              : 'bg-white border-amber-100'
                        }`}
                      >
                        <Crown className="mx-auto mb-2 text-amber-400" size={24} />
                        <p className="font-bold text-amber-900">{king.name}</p>
                      </button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === 'STATEMENT' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-sm font-bold text-amber-600 mb-1">Statement A:</p>
                      <p className="text-amber-900">{currentQuestion.statementA}</p>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <p className="text-sm font-bold text-amber-600 mb-1">Statement B:</p>
                      <p className="text-amber-900">{currentQuestion.statementB}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      {["Statement A is true", "Statement B is true", "Both are true", "Both are false"].map(opt => (
                        <Button
                          key={opt}
                          variant="outline"
                          onClick={() => handleAnswer(opt)}
                          disabled={selectedOption !== null}
                          className={`h-auto py-4 ${
                            selectedOption === opt
                              ? opt === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                              : selectedOption !== null && opt === currentQuestion.correctAnswer ? 'border-green-500 bg-green-50' : 'border-amber-200'
                          }`}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              {selectedOption && (
                <div className="px-6 pb-6">
                  <div className={`p-4 rounded-xl text-sm ${selectedOption === currentQuestion.correctAnswer ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                    <p className="font-bold mb-1">{selectedOption === currentQuestion.correctAnswer ? 'Correct!' : 'Not quite.'}</p>
                    <p>{currentQuestion.explanation}</p>
                  </div>
                  <Button onClick={nextQuestion} className="w-full mt-4 bg-amber-700 hover:bg-amber-800 rounded-xl py-6">
                    {quizIndex === lesson.quiz.length - 1 ? 'Finish Exam' : 'Next Question'}
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {examFinished && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <Trophy className="mx-auto text-amber-500 mb-6" size={80} />
            <h2 className="text-4xl font-serif font-bold text-amber-900 mb-2">Lesson Mastered!</h2>
            <p className="text-amber-700 text-xl mb-8">You scored {score} out of {lesson.quiz.length}</p>
            <Button onClick={onComplete} className="bg-amber-700 hover:bg-amber-800 rounded-full px-12 py-6 text-lg">
              Return to Timeline
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Home = ({ onStart }: { onStart: () => void }) => (
  <div className="max-w-4xl mx-auto py-20 px-4 text-center">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="inline-block p-6 rounded-full bg-amber-100 mb-8"
    >
      <Crown size={80} className="text-amber-600" />
    </motion.div>
    <h1 className="text-6xl md:text-8xl font-serif font-bold text-amber-900 mb-8 tracking-tight">
      Ahom Era
    </h1>
    <p className="text-2xl text-amber-700 max-w-2xl mx-auto leading-relaxed mb-12">
      Experience the 600-year legacy of the Swargadeos through immersive stories, AI-visualized history, and royal challenges.
    </p>
    <Button 
      onClick={onStart}
      className="bg-amber-700 hover:bg-amber-800 text-white rounded-full px-12 py-8 text-xl shadow-2xl hover:scale-105 transition-all"
    >
      Begin the Journey <ChevronRight className="ml-2" />
    </Button>
  </div>
);

export default function App() {
  const [view, setView] = useState<'home' | 'map' | 'lesson'>('home');
  const [selectedEra, setSelectedEra] = useState<Era | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleEraSelect = (era: Era) => {
    setSelectedEra(era);
  };

  return (
    <div className="min-h-screen bg-[#fdfcf0] font-sans text-amber-950 selection:bg-amber-200">
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />
      
      <header className="py-6 px-4 border-b border-amber-100 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView('home'); setSelectedEra(null); setSelectedLesson(null); }}>
            <div className="w-10 h-10 bg-amber-700 rounded-lg flex items-center justify-center text-white shadow-lg">
              <Crown size={24} />
            </div>
            <span className="text-xl font-serif font-bold tracking-tight text-amber-900">Ahom Era</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setView('map')} className="text-amber-700 font-bold uppercase tracking-widest text-xs">
              <MapIcon className="mr-2" size={16} /> Timeline
            </Button>
          </div>
        </div>
      </header>

      <main>
        <AnimatePresence mode="wait">
          {view === 'home' && <Home onStart={() => setView('map')} />}
          
          {view === 'map' && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {!selectedEra ? (
                <EraMap onSelectEra={handleEraSelect} />
              ) : (
                <div className="max-w-4xl mx-auto py-12 px-4">
                  <Button variant="ghost" onClick={() => setSelectedEra(null)} className="mb-8 text-amber-700">
                    <ChevronLeft className="mr-2" /> Back to Timeline
                  </Button>
                  <div className="mb-12">
                    <h2 className="text-4xl font-serif font-bold text-amber-900 mb-2">{selectedEra.name}</h2>
                    <p className="text-amber-600 font-bold uppercase tracking-widest mb-4">{selectedEra.period}</p>
                    <p className="text-amber-800 text-lg leading-relaxed">{selectedEra.description}</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEra.lessons.map((lesson) => (
                      <Card 
                        key={lesson.id} 
                        className="border-2 border-amber-100 hover:border-amber-400 cursor-pointer transition-all group"
                        onClick={() => { setSelectedLesson(lesson); setView('lesson'); }}
                      >
                        <CardHeader>
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 group-hover:bg-amber-700 group-hover:text-white transition-colors">
                              <Play size={16} />
                            </div>
                            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Lesson</span>
                          </div>
                          <CardTitle className="text-xl font-serif text-amber-900">{lesson.title}</CardTitle>
                          <CardDescription>{lesson.subtitle}</CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {view === 'lesson' && selectedLesson && (
            <LessonFlow 
              lesson={selectedLesson} 
              onComplete={() => { setView('map'); setSelectedLesson(null); }} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 text-center text-amber-400 text-xs font-bold uppercase tracking-[0.3em] pb-12">
        &copy; 2026 The Ahom Kingdom Chronicles • Powered by AI Historian
      </footer>
    </div>
  );
}
