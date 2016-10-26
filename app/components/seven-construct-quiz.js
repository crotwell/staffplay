import Ember from 'ember';

import Teoria from 'npm:teoria';
import chordCompare from '../utils/chord-compare';
import QM from '../utils/quiz-maker';

export default Ember.Component.extend({
  mtquiz: Ember.inject.service(),
  init() {
    this._super(...arguments);
    this.set('qmUtil', new QM());
    this.get('mtquiz').set('quizType', 'seven');
//    this.set('quiz', this.get('mtquiz').get('quiz'));
    this.set('answer','');
    this.set('right','');
    this.set('correctAnswer', this.get('quiz').get('chordRoman'));
    this.set('correctAnswerHtml', this.get('quiz').get('chordRomanHtml'));
    this.set('trebleNotes', []);
    this.set('bassNotes', []);
    this.set('lastHover', null);
  },
  actions: {
    noteHover(hover) {
      if ( ! hover) {
        this.set('hoverNote', null); 
        this.set('hoverLine', null); 
        return;
      }
      let lastHover = this.get('lastHover');
      if (lastHover && lastHover.note.name() === hover.note.name() && lastHover.note.octave() === hover.note.octave()) {
        return; // over same note as last time
      }

      this.set('lastHover', hover);
      let notes = [];
      if (hover.staff === 'treble') {
        notes = this.get('trebleNotes');
      } else {
        notes = this.get('bassNotes');
      }
      let oldNote = this.containedNote(notes, hover.note);
      if (oldNote) {
        this.set('hoverNote', hover); 
        this.set('hoverLine', null); 
      } else {
        this.set('hoverLine', hover);
        this.set('hoverNote', null);
      }
    },
    noteClicked(note, staff) {
      let notes = [];
      if (staff === 'treble') {
        notes = this.get('trebleNotes');
      } else {
        notes = this.get('bassNotes');
      }
      let oldNote = this.containedNote(notes, note);
      if (oldNote) {
        let nextAccidental = '';
        switch(oldNote.accidental()) {
          case '':
            nextAccidental = 'b';
            break;
          case 'b':
            nextAccidental = '#';
            break;
          case '#':
            nextAccidental = 'bb';
            break;
          case 'bb':
            nextAccidental = 'x';
            break;
          default:
            // otherwise delete
            nextAccidental = null;
        }
        if (nextAccidental) {
            let newNote = Teoria.note(note.name()+nextAccidental+note.octave());
            notes = this.replaceOrAdd(notes, newNote);
        } else {
            notes = this.remove(notes, note);
            this.set('hoverLine', this.get('hoverNote'));
            this.set('hoverNote', null);
        }
        if (staff==='treble') {
            this.set('trebleNotes', notes);
        } else {
            this.set('bassNotes', notes);
        }
      } else {
        notes.pushObject(note);
        this.set('hoverNote', this.get('hoverLine'));
        this.set('hoverLine', null);
      }
    },
    check() {
      let ansChord = this.get('quiz').get('chord');
      let userAnsNotes = [];
      if (this.get('quiz').get('staff') === 'treble') {
        userAnsNotes = this.get('trebleNotes');
      } else {
        userAnsNotes = this.get('bassNotes');
      }
      let chordComp = chordCompare(ansChord, userAnsNotes);
      let isCorrect = chordComp.areSame();
      
      if ( ! isCorrect) {
        this.get('quiz').set('wrongReason', chordComp.get('reason'));
        this.get('mtquiz').addToRecentWrong(this.get('quiz'));
        this.set('recentWrong', this.get('mtquiz').get('recentWrong'));
        this.set('right', "Hum, maybe you should check that and try again.");
      } else {
        this.get('quiz').set('wrongReason', '');
        this.get('mtquiz').addToRecentCorrect(this.get('quiz'));
        this.set('recentCorrect', this.get('mtquiz').get('recentCorrect'));
        this.set('right', "Yes!");
      }
    },
    next() {
      this.set('trebleNotes', []);
      this.set('bassNotes', []);
      this.set('answer', '');
      this.set('right', '');
      this.set('clearOnNextKey', false);
      this.set('quiz', this.get('mtquiz').next());
      this.set('correctAnswer', this.get('quiz').get('chordRoman'));
      this.set('correctAnswerHtml', this.get('quiz').get('chordRomanHtml'));
    },
    clearAll() {
      this.set('trebleNotes', []);
      this.set('bassNotes', []);
    }
  },
  containedNote(notes, n) {
    for(let i=0; i<notes.length; i++) {
      let old = notes[i];
      if (old.name() === n.name() && old.octave() === n.octave()) {
        return old;
      }
    }
    return null;
  },
  replaceOrAdd(notes, n) {
    let newNotes = [];
    let found = false;
    for(let i=0; i<notes.length; i++) {
      let old = notes[i];
      if (old.name() === n.name() && old.octave() === n.octave()) {
        found = true;
        newNotes.push(n);
      } else {
        newNotes.push(old);
      }
    }
    if ( ! found) {
      newNotes.push(n);
    }
    return newNotes;
  },
  remove(notes, n) {
    let newNotes = [];
    for(let i=0; i<notes.length; i++) {
      let old = notes[i];
      if ( old.name() !== n.name() || old.octave() !== n.octave()) {
        newNotes.push(old);
      }
    }
    return newNotes;
  },
});
