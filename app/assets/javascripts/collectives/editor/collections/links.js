var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var LinkModel = Backbone.Model.extend({
  urlRoot: '/admin/links/'
, defaults: {
    link_cover_thumb: ''
  , summary: ''
  }
, saveIndex: function(newNodeId, newIndex) {
    if (!this.collection) {
      throw "collection is undefined"
      return
    }
    var origNodeId = this.get('node_id')
      , origIndex = this.collection.index(this, origNodeId)

    if (origNodeId === newNodeId && origIndex === newIndex) { return }

    return this.save({
      position: this.collection
        .getPositionFromIndex(origNodeId, origIndex, newNodeId, newIndex)
    , node_id: newNodeId || null
    })
  }
})

module.exports = Backbone.Collection.extend({
  model: LinkModel
, initialize: function(models, options) {
    this.scope = options.scope
    this.on('add remove change', function() {
      this.scope.trigger('save:content')
    }, this)
  }
, index: function(model, nodeId) {
    var models = _(this.findModels(nodeId)).map(function(model) {
      return { position: model.get('position') }
    })

    return _.sortedIndex(models, model.toJSON(), 'position')
  }
, findModels: function(nodeId) {
    return _(this.filter(function(model) {
      return model.get('node_id') === nodeId
    })).sortBy(function(model) {
      return model.get('position')
    })
  }
, getPositionFromIndex: function(origNodeId, origIndex, newNodeId, newIndex) {
    var sortedNewNodeLinks = this.findModels(newNodeId)
      , current
      , previous

    if (newIndex > sortedNewNodeLinks.length - 1) {
      return this.getMaxPositionFromNode(newNodeId)
    }

    if (origNodeId !== newNodeId
      || origNodeId === newNodeId && origIndex > newIndex) {
      current = sortedNewNodeLinks[newIndex]
      previous = sortedNewNodeLinks[newIndex - 1]
      return (current.get('position')
        - (previous ? previous.get('position') : 0)) / 2
    }


    var next = sortedNewNodeLinks[newIndex + 1]
    if (!next) { return this.getMaxPositionFromNode(newNodeId) }
    return (next.get('position') + current.get('position')) / 2
  }
, getMaxPositionFromNode: function(nodeId) {
    var models = this.findModels(nodeId)
      , POSITION_STEP = 65536

    if (!models.length) { return POSITION_STEP }
    return _.clone(models).pop().get('position') + POSITION_STEP
  }
})
