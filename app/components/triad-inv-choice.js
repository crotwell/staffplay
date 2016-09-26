import Ember from 'ember';

export default Ember.Component.extend({
  rootPos: '',
  six: Ember.String.htmlSafe('<span style="font-size: 70%;"><span style="display:inline-block; vertical-align: -0.4em; line-height:1.1em;">6<br />3</span></span><span style="font-size: 40%;">&#160;</span></span>'),
  sixFour: Ember.String.htmlSafe('<span style="font-size: 70%;"><span style="display:inline-block; vertical-align: -0.4em; line-height:1.1em;">6<br />4</span></span><span style="font-size: 40%;">&#160;</span></span>'),
  invsymbols: [ "root", "6", "6 4" ],
  init() {
    this._super(...arguments);
    this.set('invsymbols', ['root', this.get('six'), this.get('sixFour') ]);
  },
  majRoman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii'+this.hafDim],
  minorRoman: ['i', 'ii'+this.halfDim, 'III', 'iv', 'V', 'VI', 'vii'+this.dim],
});
