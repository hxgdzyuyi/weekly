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
    this.edittingModel = options.edittingModel
    this.model = new FormModel(
      this.edittingModel ? this.edittingModel.toJSON() : options.modelOptions)
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
      , model
      , changedAttrs = {
          title: this.$('input[name=title]').val()
        , summary: this.$('textarea[name=summary]').val()
        , collective_id: scope.get('collective_id')
        }

    if (this.edittingModel) {
      model = this.edittingModel.set(changedAttrs)
    } else {
      model = new Model(changedAttrs)
    }

    model.save().done(_.bind(function() {
      if (!this.edittingModel) {
        nodes.add(model)
      }
      scope.trigger('close:modal')
    }, this))
    return
  }
})
