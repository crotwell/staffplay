import Ember from 'ember';
import Vex from 'npm:vexflow';
import Teoria from 'npm:teoria';
import VFConvert from '../utils/vexflow-convert';
import QM from '../utils/quiz-maker';

export default Ember.Component.extend({

  didInsertElement() {
    this._super(...arguments);
console.log("didInsertElement");
    this.redisplay();
  },
  didUpdate() {
    this._super(...arguments);
console.log("didUpdate");
    this.redisplay();
  },
  didReceiveAttrs() {
    this._super(...arguments);
console.log("didReceiveAttrs");
    //this.redisplay();
  },

  redisplay() {
    var VF = Vex.Flow;
    console.log("In vexflow-staff redisplay "+this.get('chord')+" in the "+this.get('scale')+" scale");
    var div = this.$()[0];
    var svgSubElements = div.getElementsByTagName("svg");
    if (svgSubElements.item(0)) {
       svgSubElements.item(0).parentNode.removeChild(svgSubElements.item(0));
    }
    
    var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Configure the rendering context.
    renderer.resize(500, 250);
    var context = renderer.getContext();
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");

    // Create a stave of width 400 at position 10, 40 on the canvas.
    var trebleStave = new VF.Stave(20, 40, 400);
    var bassStave = new VF.Stave(20, 120, 400);
    
    // Add a clef and time signature.
    trebleStave.addClef("treble").addTimeSignature("4/4");
    bassStave.addClef("bass").addTimeSignature("4/4");
    
    var brace = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(3);
    var lineLeft = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(1);
    var lineRight = new Vex.Flow.StaveConnector(trebleStave, bassStave).setType(6);

    // Connect it to the rendering context and draw!
    trebleStave.setContext(context).draw();
    bassStave.setContext(context).draw();
    brace.setContext(context).draw();
    lineLeft.setContext(context).draw();
    lineRight.setContext(context).draw();

    let forceDuration = 'w';
    var vfConvert = VFConvert.create();
    var tchord = null;
    var notes = [];
    if (this.get('chord')) {
      tchord = this.get('chord');
      notes = [vfConvert.toVexChord(tchord, forceDuration, tchord.clef)];
    } else {
console.log('fix: no chord?');
    }

    // Create a voice in 4/4 and add above notes
    var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(notes);

    // Format and justify the notes to 400 pixels.
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

    // Render voice
    if (this.get('clef') === 'bass') {
console.log("render to "+this.get('clef'));
      voice.draw(context, bassStave);
    } else {
console.log("render to "+this.get('clef'));
      voice.draw(context, trebleStave);
    }
  },

  minBassClef: 'c1',
  maxBassClef: 'a3',
  minTrebleClef: 'a3',
  maxTrebleClef: 'g5',
  bassNotes: []
});
