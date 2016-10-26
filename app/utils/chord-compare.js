import Ember from 'ember';

/** checks all notes in the chord are in notes and all notes in notes are in chord. 
 Only checks note name and accidental, not octave. Also checks size being equal.*/
let Comparer = Ember.Object.extend({
  init(chord, notes) {
    this.set('chord', chord);
    this.set('notes', notes);
    this.set('reason', "");
  },
  areSame() {
    return this.sameSize() && this.sameNotes() && this.sameBass();
  },
  sameSize() {
    let chordNotes = this.get('chord').notes();
    let userNotes = this.get('notes');
    if ( chordNotes.length === userNotes.length) {
      return true;
    } else {
      this.set('reason', 'Wrong number of notes, need '+chordNotes.length +' but had '+ userNotes.length);
      return false;
    }
  },
  sameNotes() {
    let that = this;
    let chordNotes = this.get('chord').notes();
    let userNotes = this.get('notes');
    let allOK = true;
    chordNotes.forEach(function(item) {
      let foundNote = false;
      userNotes.forEach(function(userItem) {
        if (item.name() === userItem.name()) {
          if (item.accidental() === userItem.accidental()) {
            foundNote = true;
          } else {
            foundNote = false;
            that.set('reason', 'Wrong accidental on note, need '+item.name()+item.accidental());
          }
        }
      });
      if ( ! foundNote && ! that.get('reason')) {
        that.set('reason', 'Missing note, need '+item.name()+item.accidental());
      }
      allOK = allOK && foundNote;
    });
    return allOK;
  },
  sameBass() {
    let userNotes = this.get('notes');
    let userBassNote = null;
    let chordBassNote = this.get('chord').myBassNote;
    userNotes.forEach(function(n) {
      if ( (! userBassNote ) || n.midi() < userBassNote.midi()) {
        userBassNote = n;
      }
    });
    if (userBassNote.name() !== chordBassNote.name()) {
      this.set('reason', 'Wrong bass note, should be '+chordBassNote+", but was "+userBassNote);
      return false;
    } else {
      return true;
    }
  },
  });

export default function chordCompare(chord, notes) {
  return new Comparer(chord, notes);
}
