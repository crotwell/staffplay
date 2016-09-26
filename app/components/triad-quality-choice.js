import Ember from 'ember';

export default Ember.Component.extend({
  dim: Ember.String.htmlSafe('<sup>o</sup>'),
  halfDim: Ember.String.htmlSafe('<sup>ø</sup>'),
  minor: 'm',
  dom: '7',
  major: 'M',
  isDiminished: Ember.computed('quality', function() {
    return this.get('quality') === this.get('dim');
  }),
  setDiminished() {
    this.set('quality', this.get('dim'));
  },
  init() {
    this._super(...arguments);
    console.log("triad-qual-choice init########################");
    this.set('qualsymbols', [this.dim, this.halfDim, this.minor, this.dom, this.major]);
    this.set('quality', this.get('major'));
  }
});
