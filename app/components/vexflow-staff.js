import Ember from 'ember';
import Teoria from 'npm:teoria';
import Vex from 'npm:vexflow';
import vexflowConvert from '../utils/vexflow-convert';

export default Ember.Component.extend({
  init() {
    this._super(...arguments);
  },
  staveWidth: 400,
  didInsertElement() {
    this._super(...arguments);
    this.redisplay();
  },
  didUpdate() {
    this._super(...arguments);
    this.redisplay();
  },
  willDestroyElement() {
    this._super(...arguments);
    let div = this.$()[0];
    let svgSubElements = div.getElementsByTagName("svg");
    if (svgSubElements.item(0)) {
       svgSubElements.item(0).parentNode.removeChild(svgSubElements.item(0));
    }
  },
  hoverChanged: Ember.observer('hoverLine', 'hoverNote', function() {
    this.redisplay();
  }),
  notesChanged: Ember.observer('trebNotes.[]', 'bassNotes.[]', function() {
    this.redisplay();
  }),

  redisplay() {
    let div = this.$()[0];
    let svgSubElements = div.getElementsByTagName("svg");
    if (svgSubElements.item(0)) {
       svgSubElements.item(0).parentNode.removeChild(svgSubElements.item(0));
    }
    
    this.vexRenderer = new Vex.Flow.Renderer(div, Vex.Flow.Renderer.Backends.SVG);

    // Configure the rendering context.
    this.vexRenderer.resize(500, 250);
    let context = this.vexRenderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // Create a stave of width this.staveWidth at position 10, 40 on the canvas.
    let trebleStave = new Vex.Flow.Stave(20, 40, this.staveWidth);
    let bassStave = new Vex.Flow.Stave(20, 140, this.staveWidth);
    this.trebleStave = trebleStave;
    this.bassStave = bassStave;
    
    // Add a clef and time signature.
    trebleStave.addClef("treble").addTimeSignature("4/4");
    bassStave.addClef("bass").addTimeSignature("4/4");
    
    let brace = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(3);
    let lineLeft = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(1);
    let lineRight = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(6);

    // Connect it to the rendering context and draw!
    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();
    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    let forceDuration = 'w';
    let tchord = null;
    if (this.get('chord')) {
      tchord = this.get('chord');
      this.addChordToStaff(tchord, tchord.clef, forceDuration);
    } else {
      if (this.get('trebNotes')) {
        this.addNotesToStaff(this.get('trebNotes'), 'treble', forceDuration, true);
      }
      if (this.get('bassNotes')) {
        this.addNotesToStaff(this.get('bassNotes'), 'bass', forceDuration, true);
      }
    }
    if (this.get('hoverLine')) {
      let hoverLine = this.get('hoverLine');
      let svg = div.getElementsByTagName("svg").item(0);
      if (hoverLine.isLine) {
        this.svgLine(hoverLine.mousex, hoverLine.yForLine, hoverLine.staff, svg);
      } else {
        // space
        this.svgLine(hoverLine.mousex, Math.floor(hoverLine.yForLine-hoverLine.lineSeparation/2), hoverLine.staff, svg);
        this.svgLine(hoverLine.mousex, Math.floor(hoverLine.yForLine+hoverLine.lineSeparation/2), hoverLine.staff, svg);
      }
      this.svgTextWholeNote(hoverLine.mousex, hoverLine.yForLine, "o", hoverLine.staff, svg);
    } else {
console.log("no hoverLine");
    } 
    if (this.get('hoverNote')) {
console.log("hoverNote");
      let hoverNote = this.get('hoverNote');
      let svg = div.getElementsByTagName("svg").item(0);
      this.svgTextWholeNote(hoverNote.mousex-20, hoverNote.yForLine, "b # bb ## del", hoverNote.staff, svg);
    }
    this.addNoteClickListener();
  },
  svgLine(x, y, staff, svg) {
    var aLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    aLine.setAttribute('x1', x-20);
    aLine.setAttribute('y1', y);
    aLine.setAttribute('x2', x+20);
    aLine.setAttribute('y2', y);
    if (staff === 'treble') {
      aLine.setAttribute('stroke', 'green');
    } else {
      aLine.setAttribute('stroke', 'red');
    }
    svg.appendChild(aLine);
  },
  svgTextWholeNote(x, y, text, staff, svg) {
      var textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      textEl.setAttribute('x', x);
      textEl.setAttribute('y', y);
      textEl.setAttribute('dominant-baseline', 'middle');
      if (staff === 'treble') {
        textEl.setAttribute('stroke', 'green');
      } else {
        textEl.setAttribute('stroke', 'blue');
      }
      textEl.appendChild(document.createTextNode(text));
      svg.appendChild(textEl);
  },

  addChordToStaff(tchord, staff, forceDuration) {
    let vfConvert = vexflowConvert();
    let notes = [vfConvert.toVexChord(tchord, forceDuration, staff)];
    this.addVexNotesToStaff(notes, staff);
  },
  
  addNotesToStaff(tNotes, staff, forceDuration, asChord) {
    if (tNotes.length > 0) {
      let vfConvert = vexflowConvert();
      let notes = [];
      if (asChord) {
        notes.push(vfConvert.toVexChordFromNotes(tNotes, forceDuration, staff));
      } else {
        tNotes.forEach(function(item ) {
          notes.push(vfConvert.toVexNote(item, forceDuration, staff));
        });
      }
      this.addVexNotesToStaff(notes, staff);
    }
  },

  addVexNotesToStaff(notes, staff) {
    let voice = new Vex.Flow.Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    let formatter = new Vex.Flow.Formatter();
    formatter.joinVoices([voice]).format([voice], 400);
    let context = this.vexRenderer.getContext();

    // Render voice
    if (staff === 'bass') {
      voice.draw(context, this.bassStave);
    } else {
      voice.draw(context, this.trebleStave);
    }
  },

  addNoteClickListener() {
    let div = this.$()[0];
    let svg = div.getElementsByTagName("svg").item(0);
    let that = this;
    svg.addEventListener('mouseup',function(evt){
      if (that.get('noteClicked')) {
        let bestNote = that.noteForMouseLoc(evt, that, svg);
        that.get('noteClicked')(bestNote.note, bestNote.staff);
      }
    },false);
    svg.addEventListener('mousemove', function(evt) {
      if (that.get('noteHover')) {
        let bestNote = that.noteForMouseLoc(evt, that, svg);
        that.get('noteHover')(bestNote);
      }
    }, false);
/*
    svg.addEventListener('mouseleave', function() {
console.log("mouseleave");
      if (that.get('noteHover')) {
        Ember.run.later(that, function() {
          this.get('noteHover')(null);
        }, 100);
      }
    }, false);
*/
/*
    svg.addEventListener('keydown', function(evt) {
if (evt.keyCode === 8 || evt.keyCode === 46) {
console.log("keyCode delete: "+evt.keyCode);
}
      if (evt.key == "delete") {
console.log("delete");
      }
      return false;
    }, false);
*/
  },
  noteForMouseLoc(evt, that, svg) {
    let pt = svg.createSVGPoint();
    let loc = that.cursorPoint(evt, pt, svg);
    // Use loc.x and loc.y here
    //lineForY will be integer for line and integer+1/2 for space
    let lineForY = Math.round( 2 * that.trebleStave.getLineForY(loc.y))/2;
    let trebleNote = Teoria.note(that.lineToNote('treble', lineForY));
    let bassLineForY = Math.round( 2 * that.bassStave.getLineForY(loc.y))/2;
    let bassNote = Teoria.note(that.lineToNote('bass', bassLineForY));
    let lineSeparation = that.trebleStave.getSpacingBetweenLines();
    let isLine = true;
    let out = null;
    if (trebleNote.octave() > 3 || (trebleNote.octave() === 3 && (trebleNote.name() === 'g' || trebleNote.name() === 'a' || trebleNote.name() === 'b'))) {
      if (lineForY - Math.floor(lineForY) > 0.25) {
        isLine = false;
      }
      out = { note:trebleNote, 
              staff:"treble", 
              mousex: loc.x,
              lineNum: lineForY,
              yForLine: that.trebleStave.getYForLine(lineForY),
              isLine: isLine,
              lineSeparation: lineSeparation };
    } else {
      if (bassLineForY - Math.floor(bassLineForY) > 0.25) {
        isLine = false;
      }
      out = { note:bassNote, 
              staff:"bass" ,
              mousex: loc.x,
              lineNum: bassLineForY,
              yForLine: that.bassStave.getYForLine(bassLineForY),
              isLine: isLine,
              lineSeparation: lineSeparation };
    }
    return out;
  },
  lineToNote(stave, lineNum) {
    if (stave === 'treble') {
      // middle C is C4, so top of treble clef is F5=7*5+5
      let rndLine = 5*7+5 - Math.round( 2 * lineNum);
      let lineSpace = ( rndLine) % 7;
      // octave number changes from B to C, not from G to A (thanks Lottie)
      let octave =  Math.floor((rndLine -2 ) / 7);
      return this.lineNoteArray[lineSpace]+octave;
    } else if (stave === 'bass') {
      // middle C is C4, so top of bass clef is A3=7*3+5
      let rndLine = 4*7 - Math.round( 2 * lineNum);
      let lineSpace = ( rndLine) % 7;
      // octave number changes from B to C, not from G to A (thanks Lottie)
      let octave =  Math.floor((rndLine -2 ) / 7);
      return this.lineNoteArray[lineSpace]+octave;
    } else {
      return "unknown";
    }
  },
  lineNoteArray: [ 'A','B','C','D','E','F','G'],

  // Get point in global SVG space
  cursorPoint(evt, pt, svg) {
    // Create an SVGPoint for future math
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  },

  minBassClef: 'c1',
  maxBassClef: 'a3',
  minTrebleClef: 'a3',
  maxTrebleClef: 'g5',
});
