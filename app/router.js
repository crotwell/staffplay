import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('idtriad');
  this.route('idseven');
  this.route('constructtriad');
  this.route('constructseven');
});

export default Router;
