import Ember from 'ember';
import QM from '../utils/quiz-maker';

export default Ember.Component.extend({
  mtquiz: Ember.inject.service(),
  clearOnNextKey: false,

  init() {
    this._super(...arguments);
    this.set('qmUtil', new QM());
    this.get('mtquiz').set('quizType', 'seven');
//    this.set('quiz', this.get('mtquiz').get('quiz'));
    this.set('answer','');
    this.set('right','');
    this.set('correctAnswer', this.get('quiz').get('chordRoman'));
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
    next() {
      this.set('answer', '');
      this.set('right', '');
      this.set('clearOnNextKey', false);
      this.set('quiz', this.get('mtquiz').next());
      this.set('correctAnswer', this.get('quiz').get('chordRoman'));
    }
  },

});
