var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

module.exports = Backbone.View.extend({
  tmplCollapsed: _.template($('#tmpl-link-item-collapsed').html())
, tmplExpanded: _.template($('#tmpl-link-item-expanded').html())
, tagName: 'li'
, className: 'link-item'
, events: {
    'click': 'clicked'
  , 'click a[href]': 'stopPropagation'
  , 'click .summary': 'stopPropagation'
  }
, stopPropagation: function(e) {
    if (!this.isExpanded) { return }
    e.stopPropagation()
  }
, initialize: function(options) {
    this.scope = options.scope
    this.listenTo(this.scope, 'collapse:links', this.renderCollapsed, this)

    var links = this.scope.get('links')
      , link = links.get(+this.$el.data('id'))
    this.model = link
    this.isExpanded = false
  }
, clicked: function(e) {
    if (this.isExpanded) { return this.renderCollapsed() }
    e.stopPropagation()
    this.scope.trigger('collapse:links')
    this.renderExpanded()
  }
, renderExpanded: function() {
    if (this.isExpanded) { return }
    this.isExpanded = true
    return this.render()
  }
, renderCollapsed: function() {
    if (!this.isExpanded) { return }
    this.isExpanded = false
    return this.render()
  }
, render: function() {
    this.$el[this.isExpanded ? 'addClass' : 'removeClass']('expanded')
    this.$el.html(
      this[this.isExpanded ? 'tmplExpanded': 'tmplCollapsed'](this.model.toJSON()))
    return this
  }
})
