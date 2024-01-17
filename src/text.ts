export function expandAgeSyntax(str: string) {
  const regexMaleP = /\((\d{1,2})\s?(M|m)\)/;
  const regexFemaleP = /\((\d{1,2})\s?(F|f)\)/;
  const regexMaleB = /\[(\d{1,2})\s?(M|m)\]/;
  const regexFemaleB = /\[(\d{1,2})\s?(F|f)\]/;

  if (str.match(regexMaleP)) {
    str = str.replace(regexMaleP, ', ' + '$1' + ' year old male,');
  }
  if (str.match(regexFemaleP)) {
    str = str.replace(regexFemaleP, ', ' + '$1' + ' year old female,');
  }
  if (str.match(regexMaleB)) {
    str = str.replace(regexMaleB, ', ' + '$1' + ' year old male,');
  }
  if (str.match(regexFemaleB)) {
    str = str.replace(regexFemaleB, ', ' + '$1' + ' year old female,');
  }
  return str;
}

export function expandAbbrevations(str: string) {
  const regex = /\saita|\sAITA/;

  if (str.match(regex)) {
    str = str.replace(regex, ' am i the ahole');
  }
  return str;
}

export function expandPeople(str: string) {
  const regexBF = /\sbf|\sBF/;
  const regexGF = /\sgf|\sGF/;
  const regexFWB = /\sfwb|\sFWB/;
  const regexMIL = /\sMIL/;
  const regexSIL = /\sSIL/;
  const regexBIL = /\sBIL/;

  if (str.match(regexBF)) {
    str = str.replace(regexBF, ' boyfriend');
  }
  if (str.match(regexGF)) {
    str = str.replace(regexGF, ' girlfriend');
  }
  if (str.match(regexFWB)) {
    str = str.replace(regexFWB, ' friend with benefits');
  }
  if (str.match(regexMIL)) {
    str = str.replace(regexMIL, ' mother in law');
  }
  if (str.match(regexSIL)) {
    str = str.replace(regexSIL, ' sister in law');
  }
  if (str.match(regexBIL)) {
    str = str.replace(regexBIL, ' brother in law');
  }
  return str;
}

export function removeEmojis(str: string) {
  return str.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
}

export function cleanNewlines(text: string) {
  return text.replace(/(\r\n|\n|\r)/gm, ' ');
}

export function removeSpecialChars(text: string) {
  return text.replace(/\*/gm, '');
}

export function removeLinks(text: string) {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

export function replaceHtmlEncoded(text: string) {
  return text.replace(/&amp;/g, 'and');
}

export function removeTags(text: string) {
  const regexNSFW = /\[NSFW\]|\[nsfw\]/g;
  const regexMA = /\[MA\]|\[ma\]/g;

  if (text.match(regexNSFW)) {
    text = text.replace(regexNSFW, '');
  }
  if (text.match(regexMA)) {
    text = text.replace(regexMA, '');
  }

  return text;
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
      activeChunk = '';
      break;
    }
  }
  if (activeChunk.length) {
    chunks.push(activeChunk);
  }

  return chunks;
}

export function preprocessTextVoiceover(text: string) {
  const withoutEmojis = removeEmojis(text);
  const ageExpanded = expandAgeSyntax(withoutEmojis);
  const peopleExpanded = expandPeople(ageExpanded);
  const cleanedNewlines = cleanNewlines(peopleExpanded);
  const noLinks = removeLinks(cleanedNewlines);
  const noTags = removeTags(noLinks);
  const noHtmlEncoded = replaceHtmlEncoded(noTags);
  const done = removeSpecialChars(noHtmlEncoded);
  return done;
}

export function preprocessTextReading(text: string) {
  const cleaned = cleanNewlines(text);
  const noLinks = removeLinks(cleaned);
  const noTags = removeTags(noLinks);
  const done = replaceHtmlEncoded(noTags);
  return done;
}
