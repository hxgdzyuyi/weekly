var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , LinkItemView = require('./link_item')
  , NodeItemView = require('./node_item')

var ModalScope = Backbone.Model.extend({
  initialize: function(options) {
    this.nodeModel = options.nodeModel
  }
, getNodeId: function() {
    return ''
  }
})


var animate = function(prevRect, target, duration) {
  var currentRect = target[0].getBoundingClientRect()

  duration = duration || 200

  target.css('transition', 'none')
  target.css('transform', 'translate3d('
    + (prevRect.left - currentRect.left) + 'px,'
    + (prevRect.top - currentRect.top) + 'px,0)'
    )
  target[0].offsetWidth // repaint
  target.css('transition', 'all ' + duration + 'ms')
  target.css('transform', 'translate3d(0, 0, 0)')
  clearTimeout(target.data('animated'))
  target.data('animated', setTimeout(function() {
    target.css('transition', '')
    target.data('animated', '')
  }, duration))
}


module.exports = Backbone.View.extend({
  tmpl: $('#tmpl-collectives-panel').html()
, className: 'collectives-edit-container'
, initialize: function(options) {
    this.scope = options.scope
    var links = this.scope.get('links')
      , nodes = this.scope.get('nodes')
    this.listenTo(links, 'add', this.linkAdded, this)
    this.listenTo(nodes, 'add', this.nodeAdded, this)
    this.listenTo(nodes, 'change:position', this.moveNodeToPosition, this)
  }
, events: {
    'click .btn-add-link': 'openAddLinkModal'
  , 'click .btn-add-node': 'openAddNodeModal'
  , 'dragover .node .bd': 'itemDragedover'
  , 'dragstart .node .item': 'itemDragedstart'
  , 'dragend .node .item': 'itemDragedend'
  }
, itemDragedstart: function(e) {
    var el = $(e.currentTarget)
    el.addClass('sortable-ghost')
  }
, itemDragedover: function(e) {
    var nodeBody = $(e.currentTarget)
      , sortableGhost = this.$('.sortable-ghost')

    if (!$.contains(nodeBody[0], sortableGhost[0])) {
      var linksContainer = nodeBody.find('.links-container')
        , prevRect = sortableGhost[0].getBoundingClientRect()
      if (sortableGhost.data('animated')) { return }
      sortableGhost.detach()
      linksContainer.append(sortableGhost)
      animate(prevRect, sortableGhost, 400)
      return
    }

    var target = $(e.target)
      , target = target.is('.item') ? target : target.closest('.item', nodeBody)

    if (!target.length || target.is(sortableGhost) || target.data('animated')) { return }

    var items = nodeBody.find('.item')
      , insertMethod = items.index(target) < items.index(sortableGhost)
        ? 'before' : 'after'
    targetRect = target[0].getBoundingClientRect()
    sortableGhostRect = sortableGhost[0].getBoundingClientRect()

    sortableGhost.detach()
    target[insertMethod](sortableGhost)

    animate(sortableGhostRect, sortableGhost)
    animate(targetRect, target)
  }
, itemDragedend: function(e) {
    var el = $(e.currentTarget)
    el.removeClass('sortable-ghost')
    var node = el.closest('.node', this.$el)
      , nodeId = node.data('id') || null
      , attrs = {}
      , items = node.find('.item')
      , itemIndex = items.index(el)
      , links = this.scope.get('links')
      , linkModel = links.get(el.data('id'))

    linkModel.saveIndex(nodeId, itemIndex)
  }
, moveNodeToPosition: function(model) {
    var nodes = this.scope.get('nodes')
      , index = nodes.index(model)
      , origPosition = model.previous('position')
      , currPosition = model.get('position')

    if (origPosition == currPosition) { return }

    var node = this.$('.node[data-id="' + model.id + '"]')
      , target = this.$('.node').eq(index)

    node.detach()
    target[ origPosition > currPosition ? 'before' : 'after' ](node)
  }
, openAddLinkModal: function() {
    var modalScope = new ModalScope({ nodeModel: this.model })
    this.scope.trigger('render:modal',
      { state: 'addLink', modalScope: modalScope })
    this.scope.trigger('open:modal')
  }
, openAddNodeModal: function() {
    this.scope.trigger('render:modal', { state: 'createOrEditNode' })
    this.scope.trigger('open:modal')
  }
, nodeAdded: function(model) {
    this.createNodeItem(model)
  }
, linkAdded: function(model) {
    var nodes = this.scope.get('nodes')
    nodes.trigger('create:linkItem', model)
  }
, createLinkItem: function(model, parentView) {
    var view = new LinkItemView({ model: model, scope: this.scope })
    parentView.$('.links-container').append(view.render().el)
    return view
  }
, createNodeItem: function(model) {
    var view = new NodeItemView({ model: model, scope: this.scope })
      , el = view.render().el
    if (this.$('.default-node').length) {
      this.$('.default-node').before(el)
    } else {
      this.$('.nodes-container').append(el)
    }
    return view
  }
, sortable: function() {
    this.linksContainer.sortable({
      handle: '.btn-handle'
    , placeholder : '<tr><td colspan="4">&nbsp;</td></tr>'
    })
  }
, render: function() {
    this.$el.html(this.tmpl)

    var scope = this.scope
      , links = scope.get('links')
      , nodes = scope.get('nodes')

    nodes.each(function(node) {
      var nodeView = this.createNodeItem(node)
        , linksBelongToNode = links.findModels(node.id || null)

      if (!linksBelongToNode.length) { return }

      _.each(linksBelongToNode, function(link) {
        this.createLinkItem(link, nodeView)
      }, this)

    }, this)

    return this
  }
})
