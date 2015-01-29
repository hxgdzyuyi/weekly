var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var FormModel = Backbone.Model.extend({
  defaults: {
    summary: ''
  }
})

module.exports = Backbone.View.extend({
  tmpl: _.template($('#tmpl-create-link-form').html())
, events: {
    'submit form': 'formSubmitted'
  , 'click .thumbs-form-link .thumb': 'thumbFromLinkSelected'
  }
, initialize: function(options) {
    this.scope = options.scope
    this.model = new FormModel(options.modelOptions)
  }
, thumbFromLinkSelected: function(e) {
    e.preventDefault()
    var el = $(e.currentTarget)
      , img = el.find('img')
      , coverIdFromLinkInput = $('input[name=cover_id_from_link]')
      , currentGrappedCoverId = img.data('identifier')
      , hasSelcted = el && el.hasClass('selected')

    if (this.selectedThumbFromLink) {
      this.selectedThumbFromLink.removeClass('selected')
    }

    this.selectedThumbFromLink = hasSelcted ? '' : el
    coverIdFromLinkInput.val(hasSelcted ? '' : currentGrappedCoverId)

    if (this.selectedThumbFromLink) {
      this.selectedThumbFromLink.addClass('selected')
    }
  }
, render: function() {
    this.selectedThumbFromLink = ''
    this.$el.html(this.tmpl(this.model.toJSON()))
    return this
  }
, formSubmitted: function(e) {
    e.preventDefault()
    var scope = this.scope
      , links = scope.get('links')
      , Model = links.model
      , nodeId = this.model.get('node_id')
      , model = new Model({
          title: this.$('input[name=title]').val()
        , url: this.$('input[name=url]').val()
        , summary: this.$('textarea[name=summary]').val()
        , collective_id: scope.get('collective_id')
        , node_id: nodeId
        , position: links.getMaxPositionFromNode(nodeId)
        })
    console.log('position')
    console.log(links.getMaxPositionFromNode(nodeId))

    model.save().done(function() {
      links.add(model)
      scope.trigger('close:modal')
      console.log(links.findModels(nodeId))
    })
    return
  }
})
