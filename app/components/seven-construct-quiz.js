import AbstractConstructionQuiz from './abstract-construction-quiz';

export default AbstractConstructionQuiz.extend({
  init() {
    this._super('seven');
console.log("init seven-construction-quiz");
  },
  layoutName: 'components/abstract-construction-quiz'
});
