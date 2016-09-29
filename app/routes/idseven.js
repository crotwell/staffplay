import Ember from 'ember';

export default Ember.Route.extend({
  mtquiz: Ember.inject.service(),
  model() {
    this.get('mtquiz').set('quizType', 'seven');
    return this.get('mtquiz').get('quiz');
  }
});
