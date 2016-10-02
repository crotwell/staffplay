import Ember from 'ember';
import Teoria from 'npm:teoria';
import TeoriaChord from 'npm:teoria-chord-progression';
import QM from '../utils/quiz-maker';

export default Ember.Service.extend({

    minTreble: Teoria.note('a4'),
    maxTreble: Teoria.note('g5'),
    minBass: Teoria.note('f2'),
    maxBass: Teoria.note('c4'),
    currentQuiz: null,
    recentCorrect: [],
    recentWrong: [],

  init() {
    this.set('quizType', 'triad');
  },
  quiz: Ember.computed('quizType', 'currentQuiz', function() {
    if ( ! this.get('currentQuiz') || this.get('currentQuiz').get('quizType') !== this.get('quizType')) {
      this.next();
    }
    return this.get('currentQuiz');
  }),
  next() {
    this.set('currentQuiz', this.createQuiz(this.get('quizType'), this.randomClef()));
    return this.get('currentQuiz');
  },
  addToRecentCorrect(quiz) {
    this.get('recentCorrect').push(quiz);
  },
  addToRecentWrong(quiz) {
console.log("add to recentWrong "+quiz.wrongReason);
    //add as object as if wrong then right then reason is overwritten
    this.get('recentWrong').addObject(quiz );
  },
  createQuiz(inQuizType, instaff) {
    let qmaker = new QM();
    console.log("createQuiz "+inQuizType+" "+instaff);
    let out = Ember.Object.extend({
      quizType: inQuizType,
      staff: instaff
    }).create();

    let sc = qmaker.randomScale(1, instaff);
    
 console.log("got random scale: "+sc.simple());
    out.set('scale', sc);
    out.set('scaleSimple', sc.simple());
    out.set('scaleString', sc.tonic.name().toUpperCase()+sc.tonic.accidental()+" "+sc.name);
    out.set('root', sc.tonic);
console.log("scale root "+out.root.accidental()+out.root.name()+"  "+out.root.duration.value);
console.log("scale length="+out.scale.notes().length);
    let idx = 1+Math.floor(Math.random()* (out.scale.notes().length));
    var chords = [idx,];
console.log("chord idx="+idx);

    let chordType = 3;
    if (inQuizType === 'triad') {
      chordType = 3;
    } else if (inQuizType === 'seven') {
      chordType = 4;
    } else {
      throw "Unknown Quiz type: "+inQuizType;
    }
    // construct a diatonic chord progression
    let scaleForChord = sc;
    if (sc.name === 'minor' && (idx === 5 || idx === 7)) {
      scaleForChord = Teoria.scale(sc.tonic, 'harmonicminor');
    }
    let chord = qmaker.randomInversion(new TeoriaChord(scaleForChord, chords, chordType).getChord(0));
    if (instaff === 'treble') {
      chord = qmaker.bassBetween(chord, this.minTreble, this.maxTreble);
    } else if (instaff === 'bass') {
      chord = qmaker.bassBetween(chord, this.minBass, this.maxBass);
    } else {
      throw "Unknown clef: "+instaff;
    }
    chord.clef = instaff;
    out.set('chord', chord);
    out.set('chordRoot', chord.root);
    out.set('chordBass', chord.myBassNote);
    out.set('chordVoicing', chord.voicing());
    out.set('chordQuality', chord.quality());
    out.set('idx', idx);
    out.set('chordNotes', chord.notes());
    console.log("createQuiz "+out.chord+" "+out.chord.root.name()+" "+out.chord.root.duration.value);
    let roman = qmaker.createRoman(sc, idx, chord);
    out.set('chordRoman', roman.asText);
    out.set('chordRomanHtml', roman.asHtml);

    return out;
  },
  randomClef() {
    if (Math.random() > 0.5) {
      return 'treble';
    } else {
      return 'bass';
    }
  }
  
});
