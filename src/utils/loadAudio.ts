import startAudio from '../assets/audios/start.wav';

export function loadAudio() {
  const audio = new Audio(startAudio);
  audio.load();
  return () => {
    audio.currentTime = 0;
    audio.play().catch(error => console.log('Erro ao tocar áudio', error));
  };
}
