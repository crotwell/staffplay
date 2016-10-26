import Ember from 'ember';
import Teoria from 'npm:teoria';

const minorSecond = Teoria.interval('m2');
const OCTAVE = Teoria.interval('P8');
const DOWN_OCTAVE = Teoria.interval('P-8');



let out = {
    allNoteNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    allMajScaleNames: ['c#', 'f#', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bb', 'eb', 'ab', 'db', 'gb', 'cb'],
    allMinorScaleNames: [ 'a#', 'd#', 'g#', 'c#', 'f#', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bb', 'eb', 'ab'],
    minTreble: Teoria.note('a4'),
    maxTreble: Teoria.note('g5'),
    minBass: Teoria.note('c2'),
    maxBass: Teoria.note('c4'),
    diminishedSym: 'd',
    halfDiminishedSym: 'h',
    augmentedSym: '+',
  randomNote(minNote, maxNote) {
    let all = [];
    let n = minNote;
    while( n.key() <= maxNote.key()) {
      all.push(n);
      n = n.interval(minorSecond);
      
    }
    let rand = Math.random();
    return all[Math.floor(rand*all.length)];
  },

  randomScale(duration, clef) {
    if (arguments.length < 1) {
      duration = 1;
    }
    let quality;
    if (Math.random() < 0.5) {
      quality = 'minor';
    } else {
      quality = 'major';
    }
    let rand = Math.random();
    let idx = Math.floor(rand * this.get('allMajScaleNames').length);
    let tonicOctave = '4';
    if (clef === 'treble') {
      tonicOctave = '4';
    } else if (clef === 'bass') {
      tonicOctave = '3';
    } else {
      throw "Unknown clef: "+clef;
    }
    let root = null;
    if (quality === 'major') {
      root = Teoria.note( this.get('allMajScaleNames')[idx]+tonicOctave, {value: duration});
    } else {
      root = Teoria.note( this.get('allMinorScaleNames')[idx]+tonicOctave, {value: duration});
    }
    let scale = Teoria.scale(root, quality);
    return scale;
  },

  randomInversion(chord) {
    let voicing = chord.voicing();
    let invNum = Math.floor(Math.random() * chord.notes().length);
    let newVoicing = [];
    for (let i=0; i<voicing.length; i++) {
      newVoicing[i] = voicing[i].toString();
    }
    for (let j=0; j<invNum; j++) {
      newVoicing[j] = voicing[j].add(OCTAVE).toString();
    }
    
    chord.voicing(newVoicing);
    let bassNote = chord.notes()[0];
    chord.notes().forEach(function(n) {
      if (n.midi() < bassNote.midi()) {
        bassNote = n;
      }
    });
    chord.myBassNote = bassNote;
    
    if (chord.myBassNote.octave > 4) {
      chord = chord.interval(DOWN_OCTAVE);
      chord.myBassNote = bassNote.interval(DOWN_OCTAVE);
    }
    chord.inversion = invNum;
    return chord;
  },

  bassBetween(chord, minNote, maxNote) {
// temp disable
//return chord;

    let inversion = chord.inversion;
    while(chord.myBassNote.midi() < minNote.midi()) {
      let voicing = chord.voicing();
      let newVoicing = [];
      for (var i=0; i<voicing.length; i++) {
        newVoicing[i] = voicing[i].add(OCTAVE).toString();
      }
      chord.voicing(newVoicing);
      chord.myBassNote = chord.myBassNote.interval(OCTAVE);
 //     chord = chord.interval(OCTAVE);
    }
    while(chord.myBassNote.midi() > maxNote.midi()) {
      let voicing = chord.voicing();
      let newVoicing = [];
      for (let j=0; j<voicing.length; j++) {
        newVoicing[j] = voicing[j].add(DOWN_OCTAVE).toString();
      }
      chord.voicing(newVoicing);
      chord.myBassNote = chord.myBassNote.interval(DOWN_OCTAVE);
    //  chord = chord.interval(DOWN_OCTAVE);
    }
    chord.inversion = inversion;
    return chord;
  },

  downOctave(chord) {
    let voicing = chord.voicing();
    let newVoicing = [];
    for (var i=0; i<voicing.length; i++) {
      newVoicing[i] = voicing[i].add(DOWN_OCTAVE).toString();
    }

    chord.voicing(newVoicing);
    return chord;
  },

  createRoman(scale, idx, chord) {
    let out = { asText: this.arabicToRoman(idx) };
    out.asHtml = out.asText;
    if (chord.quality() === 'diminished') {
       out.asText += this.diminishedSym;
       out.asHtml += '<span class="music-symbol" style="font-family: Arial Unicode MS, Lucida Sans Unicode;"><sup>o</sup></span>';
    } else if (chord.quality() === 'half-diminished') {
       out.asText += this.halfDiminishedSym;
       out.asHtml += '<span class="music-symbol" style="font-family: Arial Unicode MS, Lucida Sans Unicode;"><sup>ø</sup></span>';
    } else if (chord.quality() === 'minor') {
       out.asText = out.asText.toLowerCase();
       out.asHtml = out.asText;
    } else if (chord.quality() === 'dominant') {
       out.asText = out.asText.toUpperCase();
       out.asHtml = out.asText;
    } else if (chord.quality() === 'major') {
       out.asText = out.asText.toUpperCase();
       out.asHtml = out.asText;
    } else if (chord.quality() === 'augmented') {
       out.asText += this.augmentedSym;
       out.asHtml = out.asText;
    }
    if (chord.notes().length === 3) {
      //triad
      if (chord.inversion === 0) {
        // no symbol
      } else if (chord.inversion === 1) {
        out.asText += '6';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:-0.4em;line-height:1.2em;font-size:80%;text-align:left">6<br /> </span>';
      } else if (chord.inversion === 2) {
        out.asText += '64';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:-0.4em;line-height:1.2em;font-size:80%;text-align:left">6<br />4</span>';
      } else {
        throw "inversion for triad should be 0,1,2 but was :"+chord.inversion;
      }
    } else if (chord.notes().length === 4) {
      // 7 chord
      if (chord.inversion === 0) {
        out.asText += '7';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:0.4em;line-height:1.2em;font-size:80%;text-align:left">7 </span>';
      } else if (chord.inversion === 1) {
        out.asText += '65';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:-0.4em;line-height:1.2em;font-size:80%;text-align:left">6<br />5</span>';
      } else if (chord.inversion === 2) {
        out.asText += '43';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:-0.4em;line-height:1.2em;font-size:80%;text-align:left">4<br />3</span>';
      } else if (chord.inversion === 3) {
        out.asText += '42';
        out.asHtml += '<span style="display:inline-block;margin-bottom:-0.3em;vertical-align:-0.4em;line-height:1.2em;font-size:80%;text-align:left">4<br />2</span>';
      } else {
        throw "inversion for seven chord should be 0,1,2,3 but was :"+chord.inversion;
      }
    }
    out.asHtml = Ember.String.htmlSafe(out.asHtml);
    return out;
  },
  validChord(sym) {
    let re = /^[iIvV]+[dh]?[765432]{0,2}$/;
    return sym.match(re);
  },

  arabicToRoman(i) {
    switch(i) {
      case 1:
        return 'i';
      case 2:
        return 'ii';
      case 3:
        return 'iii';
      case 4:
        return 'iv';
      case 5:
        return 'v';
      case 6:
        return 'vi';
      case 7:
        return 'vii';
      default:
        throw "arabicToRoman must be 1-7";
    }
  }
};

export default function quizMaker() {
  return out;
}
