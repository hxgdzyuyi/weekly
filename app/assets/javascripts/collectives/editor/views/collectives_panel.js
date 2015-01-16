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

module.exports = Backbone.View.extend({
  tmpl: $('#tmpl-collectives-panel').html()
, initialize: function(options) {
    this.scope = options.scope
    var links = this.scope.get('links')
      , nodes = this.scope.get('nodes')
    this.listenTo(links, 'add', this.linkAdded, this)
    this.listenTo(nodes, 'add', this.nodeAdded, this)
  }
, events: {
    'click .btn-add-link': 'openAddLinkModal'
  , 'click .btn-add-node': 'openAddNodeModal'
  }
, openAddLinkModal: function() {
    var modalScope = new ModalScope({ nodeModel: this.model })
    this.scope.trigger('render:modal',
      { state: 'addLink', modalScope: modalScope })
    this.scope.trigger('open:modal')
  }
, openAddNodeModal: function() {
    this.scope.trigger('render:modal', { state: 'createNode' })
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
, saveNewOrder: function() {
    var linksIds = _(this.$('.item')).map(function(el) {
      return $(el).data('id')
    })

    $.ajax({
      type: 'POST'
    , url: '/admin/links/sort'
    , dataType: 'json'
    , data: {
        links_ids: linksIds
      }
    }).fail(function() {
      alert('发生了奇怪的错误')
    })
  }
, render: function() {
    this.$el.html(this.tmpl)

    var scope = this.scope
      , links = scope.get('links')
      , nodes = scope.get('nodes')

    nodes.each(function(node) {
      var nodeView = this.createNodeItem(node)
        , linksBelongToNode = links.filter(function(link) {
            return link.get('node_id')
              ? link.get('node_id') === node.id : node.get('isDefaultNode')
          })

      if (!linksBelongToNode.length) { return }

      _.each(linksBelongToNode, function(link) {
        this.createLinkItem(link, nodeView)
      }, this)

    }, this)
    return this
  }
})
