var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var LinkModel = Backbone.Model.extend({
  urlRoot: '/admin/links/'
, defaults: {
    link_cover_thumb: ''
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
})
