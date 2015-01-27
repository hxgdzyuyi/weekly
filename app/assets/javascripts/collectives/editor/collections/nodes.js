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
, saveIndex: function(newIndex) {
    if (!this.collection) {
      throw "collection is undefined"
      return
    }
    var origIndex = this.collection.index(this)
    if (origIndex === newIndex) { return }
    return this.save({
      position: this.collection.getPositionFromIndex(origIndex, newIndex)
    })
  }
})

module.exports = Backbone.Collection.extend({
  model: nodeModel
, comparator: 'position'
, initialize: function(models, options) {
    this.scope = options.scope
  }
, index: function(model) {
    var models = _(this.getRawNodes()).map(function(model) {
      return { position: model.get('position') }
    })

    return _.sortedIndex(models, model.toJSON(), this.comparator)
  }
, getPositionFromIndex: function(origIndex, newIndex) {
    var current = this.atRawNode(newIndex)

    if (!current) { return this.getMaxPosition() }
    var currentPosition = current.get('position')

    if (origIndex > newIndex) {
      var prev = this.atRawNode(newIndex - 1)
      if (!prev) { return  currentPosition/ 2 }
      return (prev.get('position') + currentPosition) / 2
    } else {
      var next = this.atRawNode(newIndex + 1)
      if (!next) { return this.getMaxPosition()  }
      return (next.get('position') + currentPosition) / 2
    }

  }
, atRawNode: function(index) {
    var element = this.at(index)
    if (!element || element.get('isDefaultNode')) { return undefined}
    return element
  }
, getRawNodes: function() {
    this.sort()
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
