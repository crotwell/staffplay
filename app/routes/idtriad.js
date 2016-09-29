import Ember from 'ember';

export default Ember.Route.extend({
  mtquiz: Ember.inject.service(),
  model() {
    this.get('mtquiz').set('quizType', 'triad');
    return this.get('mtquiz').get('quiz');
  }
});
