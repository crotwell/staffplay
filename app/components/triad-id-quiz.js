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
    this.get('mtquiz').set('quizType', 'triad');
    this.set('quiz', this.get('mtquiz').get('quizData'));
    this.set('answer','');
    this.set('right','');
  },

//  chord: Ember.Computed('quiz.chord', function() {
//    return this.get('quiz').get('chord');
//  }),

  didInsertElement() {
    this._super(...arguments);
    
    console.log("In didInsertElement triad-id-quiz"+this.get('mtquiz'));
  },
  actions: {
    updateAnswer(key) {
console.log("updateAnswer "+key);
      if ( ! this.qmUtil.validChord(key)) {
        this.set('answer', key.slice(0, -1)); 
      }
      if (this.get('clearOnNextKey')) {
console.log('set right empty');
       // this.set('right', '');
        this.set('clearOnNextKey', false);
      }
    },
    check() {
      let correctAns = this.get('quiz').get('chordRoman');
      if (this.get('answer') === correctAns) {
console.log("YES!");
        this.set('right', "yes");
      } else {
console.log("no, sorry");
        this.set('right', "no, "+correctAns);
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
