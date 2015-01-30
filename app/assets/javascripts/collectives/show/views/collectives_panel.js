var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , LinkItem = require('./link_item')

module.exports = Backbone.View.extend({
  el: '.collective-content'
, initialize: function(options) {
    this.scope = options.scope
    var links = this.scope.get('links')
    this.createViews()
  }
, events: {
    'click': 'collpaseLinks'
  }
, collpaseLinks: function() {
    this.scope.trigger('collapse:links')
  }
, createViews: function() {
    var scope = this.scope
    this.$('.link-item').each(function(index, item) {
      var view = new LinkItem({el: item, scope: scope})
    })
  }
})
