import Ember from 'ember';

export default Ember.Object.extend({
/** checks all notes in the chord are in notes and all notes in notes are in chord. 
 Only checks note name and accidental, not octave. Also checks size being equal.*/
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
      this.set('reason', 'different num notes '+chordNotes.length +'!=='+ userNotes.length);
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
        if (item.name() === userItem.name() && item.accidental() === userItem.accidental()) {
          foundNote = true;
        }
      });
      if ( ! foundNote) {
        that.set('reason', 'dont see note '+item);
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
      this.set('reason', 'bass note diff '+chordBassNote+" "+userBassNote);
      return false;
    } else {
      return true;
    }
  },
});
