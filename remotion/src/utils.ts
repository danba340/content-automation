import { WordConfig, WordType } from './Word';
import { FPS, SUBTITLE_FORBIDDEN_CHARS } from './config';

export function frameToMs(frame: number) {
  return (frame / FPS) * 1000;
}

// export function msToFrame(ms: number) {
//   const s = ms / 1000;
//   return FPS * s;
// }

export function transitionAdjustSubtitle(config: WordConfig, word: WordType, ms: number): WordConfig {
  const { start, end } = word;
  const { transitionInDuration, transitionOutDuration, transitionInStyle, transitionOutStyle } = config;
  const isInTransition = start < ms && ms < start + transitionInDuration;
  const isOutTransition = end > ms && ms > end - transitionOutDuration;

  if (isInTransition) {
    if (transitionInStyle === 'fade') {
      const opacity = (ms - start) / transitionInDuration;
      return {
        ...config,
        opacity,
      };
    }
    if (transitionInStyle === 'grow') {
      const scale = ((ms - start) / transitionInDuration) * config.scale;
      return {
        ...config,
        scale,
      };
    }
  }
  if (isOutTransition) {
    if (transitionOutStyle === 'fade') {
      const opacity = (end - ms) / transitionInDuration;
      return {
        ...config,
        opacity,
      };
    }
    if (transitionOutStyle === 'shrink') {
      const scale = ((end - ms) / transitionInDuration) * config.scale;
      return {
        ...config,
        scale,
      };
    }
  }
  return config;
}

export function cleanSpecialChars(text: string) {
  return text
    .split('')
    .filter((c) => !SUBTITLE_FORBIDDEN_CHARS.includes(c))
    .join('');
}
