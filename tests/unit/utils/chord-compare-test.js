import chordCompare from 'staffplay/utils/chord-compare';
import { module, test } from 'qunit';
import Teoria from 'npm:teoria';
import TeoriaChord from 'npm:teoria-chord-progression';

module('Unit | Utility | chord compare');

// Replace this with your real tests.
test('it works', function(assert) {

  let tonic = Teoria.note("d#4");
  let chords = [7,];
  let scaleForChord = Teoria.scale(tonic, 'harmonicminor');
  let chordType = 4;
  let chord = new TeoriaChord(scaleForChord, chords, chordType).getChord(0);
  chord.myBassNote = chord.notes()[0];
  let notes = chord.notes();
  let result = chordCompare(chord, notes);
  assert.ok(result.areSame(), "chord is same to self");
});
