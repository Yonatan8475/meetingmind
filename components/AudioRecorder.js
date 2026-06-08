'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const LANGUAGES = [
  { code: 'en', flag: '🇺🇸', name: 'English', native: 'English' },
  { code: 'am', flag: '🇪🇹', name: 'Amharic', native: 'አማርኛ' },
  { code: 'auto', flag: '🌐', name: 'Auto Detect', native: 'Auto' },
];

function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function AudioRecorder({ onTranscribed, onError }) {
  const [language, setLanguage] = useState('en');
  const [recState, setRecState] = useState('idle'); // idle | recording | processing
  const [timer, setTimer] = useState(0);
  const [waveBars, setWaveBars] = useState(Array(28).fill(4));

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const waveRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);

  const animateWave = useCallback(() => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const bars = Array(28).fill(0).map((_, i) => {
        const idx = Math.floor(i * data.length / 28);
        return Math.max(4, (data[idx] / 255) * 48 + 4);
      });
      setWaveBars(bars);
    } else {
      setWaveBars(Array(28).fill(0).map(() => Math.random() * 40 + 4));
    }
    waveRef.current = requestAnimationFrame(animateWave);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Audio analyser for waveform
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      // MediaRecorder
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.start(100);
      setRecState('recording');
      setTimer(0);

      // Timer
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);

      // Waveform
      waveRef.current = requestAnimationFrame(animateWave);

    } catch (e) {
      onError?.('Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorderRef.current) return;

    clearInterval(timerRef.current);
    cancelAnimationFrame(waveRef.current);
    setWaveBars(Array(28).fill(4));
    setRecState('processing');

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
    }

    await new Promise(resolve => {
      mediaRecorderRef.current.onstop = resolve;
      mediaRecorderRef.current.stop();
    });

    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

    // Pass blob + language back to parent
    onTranscribed?.(audioBlob, language);
    setRecState('idle');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(waveRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div>
      {/* Language Selector */}
      <div style={{ marginBottom: 8, fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: 2, textTransform: 'uppercase' }}>
        Select Recording Language
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 32 }}>
        {LANGUAGES.map(l => (
          <button
            key={l.code}
            onClick={() => setLanguage(l.code)}
            style={{
              padding: '14px 16px',
              border: language === l.code ? '2px solid #1a6bc8' : '2px solid #d4c9b8',
              background: language === l.code ? '#1a6bc8' : '#f5f0e8',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s',
              borderRadius: 0,
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 6 }}>{l.flag}</div>
            <div style={{ fontWeight: 600, fontSize: 13, color: language === l.code ? 'white' : '#0a0a0a', marginBottom: 2 }}>{l.name}</div>
            <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: language === l.code ? 'rgba(255,255,255,0.7)' : '#8a7d6b' }}>{l.native}</div>
          </button>
        ))}
      </div>

      {/* Waveform */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, height: 56, marginBottom: 24 }}>
        {waveBars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              borderRadius: 2,
              background: recState === 'recording' ? '#dc2626' : '#d4c9b8',
              height: recState === 'recording' ? h : 4,
              transition: 'height 0.08s ease',
            }}
          />
        ))}
      </div>

      {/* Record Button + Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
        <button
          onClick={recState === 'idle' ? startRecording : recState === 'recording' ? stopRecording : undefined}
          disabled={recState === 'processing'}
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            border: 'none',
            cursor: recState === 'processing' ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            background: recState === 'recording' ? '#dc2626' : recState === 'processing' ? '#1a6bc8' : '#c8401a',
            boxShadow: recState === 'recording'
              ? '0 4px 20px rgba(220,38,38,0.5)'
              : '0 4px 20px rgba(200,64,26,0.4)',
            transition: 'all 0.2s',
          }}
        >
          {recState === 'idle' ? '🎙️' : recState === 'recording' ? '⏹️' : '⚙️'}
        </button>

        <div style={{ textAlign: 'left' }}>
          <div style={{ fontFamily: 'var(--font-bebas)', fontSize: 22, letterSpacing: 1, marginBottom: 4 }}>
            {recState === 'idle' ? 'Ready to Record'
              : recState === 'recording' ? 'Recording...'
              : 'Processing...'}
          </div>
          <div style={{
            fontFamily: 'var(--font-dm-mono)',
            fontSize: 28,
            letterSpacing: 3,
            color: recState === 'recording' ? '#dc2626' : '#c8401a',
          }}>
            {recState === 'processing' ? '...' : formatTime(timer)}
          </div>
          <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 11, color: '#8a7d6b', marginTop: 4 }}>
            {recState === 'idle' ? 'Click mic to start'
              : recState === 'recording' ? 'Click stop when done'
              : 'Sending to Groq Whisper...'}
          </div>
        </div>
      </div>

      {/* Instructions when idle */}
      {recState === 'idle' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 32 }}>
          {[
            { step: '01', icon: '🎙️', text: 'Select language then click the mic button' },
            { step: '02', icon: '⏹️', text: 'Speak clearly — click stop when done' },
            { step: '03', icon: '⚡', text: 'Groq Whisper transcribes automatically' },
          ].map(s => (
            <div key={s.step} style={{ padding: 16, background: '#ede7d9', border: '1px solid #d4c9b8', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-dm-mono)', fontSize: 10, color: '#8a7d6b', letterSpacing: 2, marginBottom: 8 }}>{s.step}</div>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 12, color: '#8a7d6b', lineHeight: 1.5 }}>{s.text}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
