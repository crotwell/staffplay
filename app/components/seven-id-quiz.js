import Ember from 'ember';
import Vex from 'npm:vexflow';
import Teoria from 'npm:teoria';
import VFConvert from '../utils/vexflow-convert';
import QM from '../utils/quiz-maker';

export default Ember.Component.extend({
  mtquiz: Ember.inject.service(),
  clearOnNextKey: false,

  init() {
    this._super(...arguments);
    this.set('qmUtil', new QM());
    this.get('mtquiz').set('quizType', 'seven');
    this.set('quiz', this.get('mtquiz').get('quiz'));
    this.set('answer','');
    this.set('right','');
    this.set('correctAnswer', this.get('quiz').get('chordRoman'));
  },

//  chord: Ember.Computed('quiz.chord', function() {
//    return this.get('quiz').get('chord');
//  }),

  didInsertElement() {
    this._super(...arguments);
    
    console.log("In didInsertElement seven-id-quiz"+this.get('mtquiz'));
  },
  actions: {
    updateAnswer(key) {
console.log("updateAnswer "+key);
//      if ( ! this.qmUtil.validChord(key)) {
//        this.set('answer', key.slice(0, -1)); 
//      }
      if (this.get('clearOnNextKey')) {
console.log('set right empty');
       // this.set('right', '');
        this.set('clearOnNextKey', false);
      }
    },
    check() {
      if (this.get('answer') === this.get('correctAnswer')) {
console.log("YES!");
        this.set('right', "yes");
      } else {
console.log("no, sorry");
        this.set('right', "No, try again.");
        this.set('clearOnNextKey', true);
console.log('set clearOnNextKey');
      }
    },
    next() {
      console.log("Next");
      this.set('answer', '');
      this.set('right', '');
      this.set('clearOnNextKey', false);
      this.set('quiz', this.get('mtquiz').next());
      console.log("Quiz: "+this.get('quiz'));
    }
  },

});
