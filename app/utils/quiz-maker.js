import Ember from 'ember';
import Teoria from 'npm:teoria';

const minorSecond = Teoria.interval('m2');
const OCTAVE = Teoria.interval('P8');
const DOWN_OCTAVE = Teoria.interval('P-8');


export default Ember.Object.extend({

    allNoteNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    allMajScaleNames: ['c#', 'f#', 'b', 'e', 'a', 'd', 'g', 'c', 'f', 'bb', 'eb', 'ab', 'db', 'gb', 'cb'],
    minTreble: Teoria.note('a4'),
    maxTreble: Teoria.note('g5'),
    minBass: Teoria.note('c2'),
    maxBass: Teoria.note('c4'),
    diminishedSym: 'd',
    halfDiminishedSym: 'h',
    augmentedSym: '+',
  init() {
  },

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
    let root = Teoria.note( this.get('allMajScaleNames')[idx]+tonicOctave, {value: duration});
    let scale = Teoria.scale(root, 'major');
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
    let out = this.arabicToRoman(idx);
    if (chord.quality() === 'diminished') {
       out += this.diminishedSym;
    } else if (chord.quality() === 'half-diminished') {
       out += this.halfDiminishedSym;
    } else if (chord.quality() === 'minor') {
       out = out.toLowerCase();
    } else if (chord.quality() === 'dominant') {
       out = out.toUpperCase();
    } else if (chord.quality() === 'major') {
       out = out.toUpperCase();
    } else if (chord.quality() === 'augmented') {
       out += this.augmentedSym;
    }
    if (chord.notes().length === 3) {
      //triad
      if (chord.inversion === 0) {
        // no symbol
      } else if (chord.inversion === 1) {
        out += '6';
      } else if (chord.inversion === 2) {
        out += '64';
      } else {
        throw "inversion for triad should be 0,1,2 but was :"+chord.inversion;
      }
    } else if (chord.notes().length === 4) {
      // 7 chord
      if (chord.inversion === 0) {
        out += '7';
      } else if (chord.inversion === 1) {
        out += '65';
      } else if (chord.inversion === 2) {
        out += '43';
      } else if (chord.inversion === 3) {
        out += '42';
      } else {
        throw "inversion for seven chord should be 0,1,2,3 but was :"+chord.inversion;
      }
    }
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


});
