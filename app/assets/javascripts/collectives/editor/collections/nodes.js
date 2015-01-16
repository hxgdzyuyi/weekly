var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var nodeModel = Backbone.Model.extend({
  urlRoot: '/nodes/'
, defaults: {
    title: ''
  , summary: ''
  , isDefaultNode: false
  }
})

module.exports = Backbone.Collection.extend({
  model: nodeModel
, initialize: function(models, options) {
    this.scope = options.scope
  }
})
