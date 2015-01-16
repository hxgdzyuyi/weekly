var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var FormModel = Backbone.Model.extend({
  url: '/admin/links/get_info'
})

module.exports = Backbone.View.extend({
  tmpl: $('#tmpl-add-link-form').html()
, events: {
    'submit form': 'addLink'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.model = new FormModel(options.modelOptions)
    this.modalScope = options.modalScope
  }
, render: function() {
    this.$el.html(this.tmpl)
    return this
  }
, addLink: function(e) {
    e.preventDefault()
    var self = this
      , url = this.$('input[id=link_url]').val()

    this.model.fetch({
      data: { url: url }
    }).done(function() {
      self.scope.trigger('render:modal', {
        state: 'createLink'
      , modelOptions: _.extend(
          self.model.toJSON(), { node_id: self.modalScope.getNodeId() })
      , modalScope: this.modalScope
      })
    }).error(function() {
      self.scope.trigger('render:modal', {
        state: 'createLink'
      , modelOptions: { title: '', url: url, node_id: self.modalScope.getNodeId() }
      , modalScope: this.modalScope
      })
    })
    this.$el.html('加载中')
  }
})
