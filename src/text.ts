// const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz';
const alphabetLower = 'abcdefghijklmnopqrstuvxyz';

export function replaceAgeSyntax(str: string) {
  const regexMaleP = /\((\d{1,2})\s?(M|m)\)/;
  const regexFemaleP = /\((\d{1,2})\s?(F|f)\)/;
  const regexMaleB = /\[(\d{1,2})\s?(M|m)\]/;
  const regexFemaleB = /\[(\d{1,2})\s?(F|f)\]/;
  const regexMalePR = /\((M|m)\s?(\d{1,2})\)/;
  const regexFemalePR = /\((F|f)\s?(\d{1,2})\)/;
  const regexMaleBR = /\[(M|m)\s?(\d{1,2})\]/;
  const regexFemaleBR = /\[(F|f)\s?(\d{1,2})\]/;

  if (str.match(regexMaleP)) {
    str = str.replace(regexMaleP, '');
  }
  if (str.match(regexFemaleP)) {
    str = str.replace(regexFemaleP, '');
  }
  if (str.match(regexMaleB)) {
    str = str.replace(regexMaleB, '');
  }
  if (str.match(regexFemaleB)) {
    str = str.replace(regexFemaleB, '');
  }
  if (str.match(regexMalePR)) {
    str = str.replace(regexMalePR, '');
  }
  if (str.match(regexFemalePR)) {
    str = str.replace(regexFemalePR, '');
  }
  if (str.match(regexMaleBR)) {
    str = str.replace(regexMaleBR, '');
  }
  if (str.match(regexFemaleBR)) {
    str = str.replace(regexFemaleBR, '');
  }
  return str;
}

export function expandAgeSyntax(str: string) {
  const regexMaleP = /\((\d{1,2})\s?(M|m)\)/;
  const regexFemaleP = /\((\d{1,2})\s?(F|f)\)/;
  const regexMaleB = /\[(\d{1,2})\s?(M|m)\]/;
  const regexFemaleB = /\[(\d{1,2})\s?(F|f)\]/;
  const regexMalePR = /\((M|m)\s?(\d{1,2})\)/;
  const regexFemalePR = /\((F|f)\s?(\d{1,2})\)/;
  const regexMaleBR = /\[(M|m)\s?(\d{1,2})\]/;
  const regexFemaleBR = /\[(F|f)\s?(\d{1,2})\]/;

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
  if (str.match(regexMalePR)) {
    str = str.replace(regexMalePR, ', ' + '$2' + ' year old male,');
  }
  if (str.match(regexFemalePR)) {
    str = str.replace(regexFemalePR, ', ' + '$2' + ' year old female,');
  }
  if (str.match(regexMaleBR)) {
    str = str.replace(regexMaleBR, ', ' + '$2' + ' year old male,');
  }
  if (str.match(regexFemaleBR)) {
    str = str.replace(regexFemaleBR, ', ' + '$2' + ' year old female,');
  }
  return str;
}

export function expandAbbrevations(str: string) {
  const regex = /\saita|\sAITA|Aita/;

  if (str.match(regex)) {
    str = str.replace(regex, 'am i the a-hole');
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
    str = str.replace(regexBF, 'boyfriend');
  }
  if (str.match(regexGF)) {
    str = str.replace(regexGF, 'girlfriend');
  }
  if (str.match(regexFWB)) {
    str = str.replace(regexFWB, 'friend with benefits');
  }
  if (str.match(regexMIL)) {
    str = str.replace(regexMIL, 'mother in law');
  }
  if (str.match(regexSIL)) {
    str = str.replace(regexSIL, 'sister in law');
  }
  if (str.match(regexBIL)) {
    str = str.replace(regexBIL, 'brother in law');
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

export function noDoubleQuotes(text: string) {
  return text.replace(/\"/gm, '');
}

export function yrsToYears(text: string) {
  return text.replace(/YRS|Yrs|yrs/gm, 'years');
}

export function removeLinks(text: string) {
  return text.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
}

export function replaceHtmlEncoded(text: string) {
  text = text.replace(/&amp;#x200B;/g, ' ');
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

export function upperCaseFirstLetter(text: string) {
  let trimmed = text.trim();
  if (alphabetLower.includes(trimmed[0])) {
    return trimmed[0].toUpperCase() + trimmed.slice(1);
  }
  return text;
}

export function removeDoubleSpace(text: string) {
  return text.replace(/\s\s/g, ' ');
}

export function preprocessTextVoiceover(text: string) {
  const withoutEmojis = removeEmojis(text);
  const noAgeSyntax = replaceAgeSyntax(withoutEmojis);
  const peopleExpanded = expandPeople(noAgeSyntax);
  const cleanedNewlines = cleanNewlines(peopleExpanded);
  const noLinks = removeLinks(cleanedNewlines);
  const noTags = removeTags(noLinks);
  const noHtmlEncoded = replaceHtmlEncoded(noTags);
  const yrsIsYears = yrsToYears(noHtmlEncoded);
  const noSpecialChars = removeSpecialChars(yrsIsYears);
  const done = removeDoubleSpace(noSpecialChars);
  return done;
}

export function preprocessTextReading(text: string) {
  const cleaned = cleanNewlines(text);
  const noLinks = removeLinks(cleaned);
  const noTags = removeTags(noLinks);
  const noHtmlEncoded = replaceHtmlEncoded(noTags);
  const noAgeSyntax = replaceAgeSyntax(noHtmlEncoded);
  const noDoubleQuoted = noDoubleQuotes(noAgeSyntax);
  const uppercasedFirstLetter = upperCaseFirstLetter(noDoubleQuoted);
  const done = removeDoubleSpace(uppercasedFirstLetter);
  return done;
}
