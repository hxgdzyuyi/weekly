var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , LinkItemView = require('./link_item')
  , AddLinkForm = require('./forms/add_link')

module.exports = Backbone.View.extend({
  tmpl: $('#tmpl-collectives-panel').html()
, initialize: function(options) {
    this.scope = options.scope
    var linksCollection = this.scope.get('links')
    this.listenTo(linksCollection, 'add', this.linkAdded, this)
  }
, events: {
    'click .btn-add-link': 'openAddLinkModal'
  }
, openAddLinkModal: function() {
    this.scope.trigger('render:modal', { state: 'addLink' })
    this.scope.trigger('open:modal')
  }
, linkAdded: function(model) {
    this.createLinkItem(model)
    this.sortable()
  }
, createLinkItem: function(model) {
    var view = new LinkItemView({ model: model, scope: this.scope })
    this.$('.links-container').append(view.render().el)
  }
, sortable: function() {
    this.linksContainer.sortable({
      handle: '.btn-handle'
    , placeholder : '<tr><td colspan="7">&nbsp;</td></tr>'
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
    this.linksContainer = this.$('.links-container')
    this.linksContainer.on('sortupdate', _.bind(this.saveNewOrder, this))
    this.scope.get('links').each(function(model) {
      this.createLinkItem(model)
    }, this)
    this.sortable()
    return this
  }
})
