import Ember from 'ember';
import Audio from 'ember-audio';
import QM from '../utils/quiz-maker';

export default Ember.Component.extend({
  audio: Ember.inject.service(),
  mtquiz: Ember.inject.service(),
  clearOnNextKey: false,

isLoading: false,
    font: null,
    notes: null,

  init() {
    this._super(...arguments);
    this.set('qmUtil', new QM());
    this.get('mtquiz').set('quizType', 'triad');
//    this.set('quiz', this.get('mtquiz').get('quiz'));
    this.set('answer','');
    this.set('right','');
    this.set('correctAnswer', this.get('quiz').get('chordRoman'));
    this.initSoundFont();
  },
  initSoundFont() {
    // acoustic_grand_piano-mp3.js is a soundfont from
    // https://github.com/gleitz/midi-js-soundfonts
    this.get('audio').load('/assets/acoustic_grand_piano-mp3.js').asFont('piano')
      .then((font) => {
        this.font = font;
        // Slicing just so the whole keyboard doesn't show up on the screen
        this.set('notes', font.get('notes')); //.slice(39, 51));
        this.set('isLoading', false);
      });
  },

  actions: {
    check() {
      if (this.get('answer') === this.get('correctAnswer')) {
        this.get('mtquiz').addToRecentCorrect(this.get('quiz'));
        this.set('recentCorrect', this.get('mtquiz').get('recentCorrect'));
        this.set('right', "Yes!");
      } else {
        this.get('mtquiz').addToRecentWrong(this.get('quiz'));
        this.set('recentWrong', this.get('mtquiz').get('recentWrong'));
        this.set('right', "Hum, maybe you should check that and try again.");
        this.set('clearOnNextKey', true);
      }
    },
    playPianoNote(chord) {
      let playableChord = [];
      for(let n of chord.notes()) {
        let note = this.get('font').getNote(n.scientific());
        if ( ! note) {
          console.log("can't find note for: "+n.scientific());
          // try enharmonic
          note = this.get('font').getNote(n.enharmonics(true)[0].scientific());
        if ( note) {
          console.log('  found it as '+n.enharmonics(true)[0].scientific());
        } else {
          console.log("not found as enharmonic "+n.enharmonics(true)[0].scientific());
        }
        }
        playableChord.push(note);
      }
      let lsound = new Audio.LayeredSound();
      lsound.set('sounds', playableChord);
      lsound.play(3.0);
    },
    next() {
      this.set('answer', '');
      this.set('right', '');
      this.set('clearOnNextKey', false);
      this.set('quiz', this.get('mtquiz').next());
      this.set('correctAnswer', this.get('quiz').get('chordRoman'));
    }
  },

});
