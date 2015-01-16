var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var FormModel = Backbone.Model.extend({})

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-edit-link-form').html())
, events: {
    'submit form': 'formSubmitted'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.model = new FormModel(options.modelOptions)
    this.edittingModel = options.edittingModel
  }
, render: function() {
    this.$el.html(this.tmpl(this.model.toJSON()))
    return this
  }
, formSubmitted: function(e) {
    e.preventDefault()

    this.edittingModel.set({
      title: this.$('input[name=title]').val()
    , url: this.$('input[name=url]').val()
    , summary: this.$('textarea[name=summary]').val()
    }).save().done(_.bind(function() {
      this.scope.trigger('close:modal')
    }, this))

    return
  }
})
