var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var FormModel = Backbone.Model.extend({
  defaults: {
    title: ''
  , summary: ''
  }
})

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-create-node-form').html())
, events: {
    'submit form': 'formSubmitted'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.model = new FormModel(options.modelOptions)
  }
, render: function() {
    this.$el.html(this.tmpl(this.model.toJSON()))
    return this
  }
, formSubmitted: function(e) {
    e.preventDefault()
    var scope = this.scope
      , nodes = scope.get('nodes')
      , Model = nodes.model
      , model = new Model({
          title: this.$('input[name=title]').val()
        , summary: this.$('textarea[name=summary]').val()
        , collective_id: scope.get('collective_id')
        })

    model.save().done(function() {
      nodes.add(model)
      scope.trigger('close:modal')
    })
    return
  }
})
