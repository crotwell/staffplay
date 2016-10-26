import Ember from 'ember';
import AbstractConstructionQuiz from './abstract-construction-quiz';

export default AbstractConstructionQuiz.extend({
  init() {
    this._super('triad');
  },
  layoutName: 'components/abstract-construction-quiz'
});
