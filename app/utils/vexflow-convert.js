import Vex from 'npm:vexflow';
//import Teoria from 'npm:teoria';


let out = {
  toVexChord(chord, forceDuration, clef) {
    return this.toVexChordFromNotes(chord.notes(), forceDuration, clef);
  },

  toVexChordFromNotes(notes, forceDuration, clef) {
    var keyNames = [];
    var that = this;
    notes.forEach(function(item) {
      var vn = that.toVexNote(item, forceDuration, clef);
      keyNames.push(vn.keys[0]);
    });
    var vexChord = new Vex.Flow.StaveNote({keys: keyNames, duration: this.toVexDuration(forceDuration), clef: clef });
    var vexKey = vexChord.getKeyProps();
    vexKey.forEach(function (item, index) {
      if (item.accidental) {
        vexChord.addAccidental(index, that.toVexAccidental(item.accidental));
      }

    });
    return vexChord;
  },

  toVexNote(note, forceDuration, clef) {
    var vexNote = new Vex.Flow.StaveNote({ 
        keys: [note.name()+this.toVexAccidentalStr(note.accidental())+"/"+note.octave() ], 
        duration: this.toVexDuration(forceDuration), 
        clef: clef });
    if (note.accidental() && note.accidental() !== '') {
      vexNote.addAccidental(0, this.toVexAccidental(note.accidental()));
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
  toVexAccidental(accidental) {
    if (accidental === 'x') {
      return new Vex.Flow.Accidental('##');
    } else {
      return new Vex.Flow.Accidental(accidental);
    }
  },
  toVexAccidentalStr(accidental) {
    if (accidental === 'x') {
      return '##';
    } else {
      return accidental;
    }
  }

};

export default function vexflowConvert() {
  return out;
}
