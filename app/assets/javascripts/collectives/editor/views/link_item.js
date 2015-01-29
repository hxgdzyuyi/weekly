var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-link-item').html())
, tagName: 'li'
, className: 'sortable item'
, events: {
    'click .btn-delete': 'actionDelete'
  , 'click .btn-edit': 'openEditLinkModal'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.listenTo(this.model, 'destroy', this.remove, this)
    this.listenTo(this.model, 'change', this.render, this)
  }
, openEditLinkModal: function() {
    this.scope.trigger('render:modal', {
      state: 'editLink', edittingModel: this.model
    , modelOptions: this.model.toJSON()
    })
    this.scope.trigger('open:modal')
  }
, actionDelete: function() {
    if (!confirm('確定刪除')) { return }
    this.model.destroy()
  }
, render: function() {
    this.$el.data('id', this.model.id)
    this.$el.html(this.tmpl(this.model.toJSON()))
    return this
  }
})
