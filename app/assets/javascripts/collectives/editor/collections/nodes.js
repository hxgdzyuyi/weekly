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
, comparator: 'position'
, initialize: function(models, options) {
    this.scope = options.scope
  }
, getRawNodes: function() {
    return _(this.models).filter(function(model) {
      return !model.get('isDefaultNode')
    })
  }
, getMaxPosition: function() {
    var rawNodes = this.getRawNodes()
    var POSITION_STEP = 65536
    if (!rawNodes.length) { return POSITION_STEP }
    return rawNodes.pop().get('position') + POSITION_STEP
  }
})
