export function expandAgeSyntax(str: string) {
  const regexMale = /\((\d{1,2})(M|m)\)/;
  const regexFemale = /\((\d{1,2})(F|f)\)/;

  if (str.match(regexMale)) {
    str = str.replace(regexMale, ',a ' + '$1' + ' year old male,');
  }
  if (str.match(regexFemale)) {
    str = str.replace(regexFemale, ',a ' + '$1' + ' year old female,');
  }
  return str;
}

export function removeEmojis(str: string) {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
}

export function cleanText(text: string) {
  return text.replace(/(\r\n|\n|\r)/gm, '');
}

export function preprocessText(text: string) {
  const withoutEmojis = removeEmojis(text);
  const ageExpanded = expandAgeSyntax(withoutEmojis);
  const cleaned = cleanText(ageExpanded);
  return cleaned;
}

export function toSentencedChunks(text: string, maxLength: number) {
  const chunks = [];
  const sentenceEndChars = '.!?';
  let activeChunk = '';
  let textArr = text.split('');
  while (textArr.length > 0) {
    const cutTo = textArr.findIndex((char) => sentenceEndChars.includes(char)) + 1;
    if (cutTo > -1) {
      activeChunk += textArr.splice(0, cutTo).join('');
      if (activeChunk.length > maxLength) {
        chunks.push(activeChunk);
        activeChunk = '';
      }
    } else {
      activeChunk += textArr.join('');
      chunks.push(activeChunk);
      break;
    }
  }

  return chunks;
}
