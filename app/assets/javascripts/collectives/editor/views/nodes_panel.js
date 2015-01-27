var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , LinkItemView = require('./link_item')

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-nodes-panel').html())
, className: 'nodes-panel'
, initialize: function(options) {
    this.scope = options.scope
    this.sortedNodeModel = options.sortedNodeModel
  }
, events: {
    'dragover li': 'dragover'
  }
, dragover: function(e) {
    var el = $(e.currentTarget)
    if (el.is(this.sortedNode)) { return }
    var items = this.$('li')
      , insertMethod = items.index(el) <  items.index(this.sortedNode)
        ? 'before' : 'after'
    this.sortedNode.detach()
    el[insertMethod](this.sortedNode)
  }
, render: function() {
    this.$el.html(this.tmpl({ nodes: this.scope.get('nodes') }))
    this.sortedNode = this.$('li[data-id="' + this.sortedNodeModel.get('id') + '"]')
    this.sortedNode.addClass('sorted')
    return this
  }
, getSortedNodeIndex: function() {
    return this.$('li').index(this.sortedNode)
  }
})
