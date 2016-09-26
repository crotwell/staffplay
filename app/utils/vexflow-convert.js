import Ember from 'ember';
import Vex from 'npm:vexflow';
import Teoria from 'npm:teoria';

export default Ember.Object.extend({

  init() {
  },

  toVexChord(chord, forceDuration, clef) {
    var keyNames = [];
    var that = this;
    chord.notes().forEach(function (item, index, array) {
      var vn = that.toVexNote(item, forceDuration, clef);
      console.log("toVexChord: note "+item+" "+index+" -> "+vn.keys[0]);
      keyNames.push(vn.keys[0]);
    });
console.log("toVexChord choord duration: "+chord.root.duration.value+" "+this.toVexDuration(chord.root));
    var vexChord = new Vex.Flow.StaveNote({keys: keyNames, duration: this.toVexDuration(forceDuration), clef: clef });
console.log("toVexChord keys: "+keyNames.join(', '));
// ugg vexflow sorts the notes, but we have them in root position order
// but transposed up an octave for inversions???
// find the key after the fact to find the index???
var vexKey = vexChord.getKeyProps();

vexKey.forEach(function (item, index, array) {
console.log("vexKeys: "+item.key+" "+item.accidental+" "+index);
if (item.accidental) {
        vexChord.addAccidental(index, new Vex.Flow.Accidental(item.accidental));
      }

});
    return vexChord;
  },

  toVexNote(note, forceDuration, clef) {
    console.log("toVexNote: "+note.name()+note.accidental()+"/"+note.octave()+"   "+this.toVexDuration(note)+" "+clef);
    var vexNote = new Vex.Flow.StaveNote({ keys: [note.name()+note.accidental()+"/"+note.octave() ], duration: this.toVexDuration(forceDuration), clef: clef })
    if (note.accidental()) {
      vexNote.addAccidental(0, new Vex.Flow.Accidental(note.accidental()));
    }
    return vexNote;
  },

  toVexDuration(note) {
    let v = note;
    if (typeof note.duration === 'undefined') {
       v = note;
    } else {
       v = note.duration.value;
    }
    switch(v) {
      case 1:
        return 'w';
      case 2:
        return 'h';
      case 4:
        return 'q';
    }
    return ""+v;
  },

});
