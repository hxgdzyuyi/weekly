var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , LinkItemView = require('./link_item')
  , NodesPanel = require('./nodes_panel')

var ModalScope = Backbone.Model.extend({
  initialize: function(options) {
    this.nodeModel = options.nodeModel
  }
, getNodeId: function() {
    return this.nodeModel.get('id')
  }
})

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-node-item').html())
, tagName: 'section'
, className: 'node'
, events: {
    'click .btn-delete-node': 'actionDelete'
  , 'click .btn-edit-node': 'openEditNodeModal'
  , 'click .btn-add-link': 'openAddLinkModal'
  , 'mousedown .header': 'mousedown'
  , 'dragstart .header': 'dragstart'
  , 'dragend .header': 'dragend'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.listenTo(this.model, 'destroy', this.remove, this)
    this.listenTo(this.model, 'change', this.renderOnlyTitle, this)
    this.listenTo(this.scope.get('nodes'), 'create:linkItem', function(linkModel) {
      if (linkModel.get('node_id') && (linkModel.get('node_id') !== this.model.get('id'))
        || !linkModel.get('node_id') && !this.model.get('isDefaultNode')) { return }
      this.createLinkItem(linkModel)
    }, this)
  }
, dragstart: function(e) {
    this.nodesPanel = new NodesPanel({
      scope: this.scope
    , sortedNodeModel: this.model
    })
    this.$el.append(this.nodesPanel.render().el)
  }
, dragend: function() {
    var sortedIndex = this.nodesPanel.getSortedNodeIndex()
    this.nodesPanel.remove()
    this.model.saveIndex(sortedIndex)
  }
, mousedown: function(e) {
    var btnSortNode = this.$('.btn-sort-node')
    if (!btnSortNode.length || !$(e.target).is('.btn-sort-node')
      && !$.contains(btnSortNode[0], e.target)) {
      return e.preventDefault()
    }
  }
, createLinkItem: function(model) {
    var view = new LinkItemView({ model: model, scope: this.scope })
    this.$('.links-container').append(view.render().el)
    return view
  }
, openEditNodeModal: function() {
    this.scope.trigger('render:modal'
      , { state: 'createOrEditNode', edittingModel: this.model })
    this.scope.trigger('open:modal')
  }
, openAddLinkModal: function(e) {
    e.preventDefault()
    e.stopPropagation()
    var modalScope = new ModalScope({ nodeModel: this.model })
    this.scope.trigger('render:modal',
      { state: 'addLink', modalScope: modalScope })
    this.scope.trigger('open:modal')
  }
, renderOnlyTitle: function() {
    this.$('.node-title').text(this.model.get('title'))
  }
, render: function() {
    this.$el.attr('data-id', this.model.id)
    this.$el.html(this.tmpl(this.model.toJSON()))
    this.header =  this.$('.header')
    this.header[0].draggable = true
    if (this.model.get('isDefaultNode')) {
      this.$('.header .btn').remove()
      this.$('.btn-add-link').remove()
      this.$el.addClass('default-node')
    }
    return this
  }
, actionDelete: function() {
    this.model.destroy()
  }
})
