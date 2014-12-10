var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

var Dropzone = require('dropzone/downloads/dropzone.min.js')
require('style!css!dropzone/downloads/css/basic.css')

var FormModel = Backbone.Model.extend({ })

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
    var dropzone = new Dropzone(this.$('.dropzone')[0], {
      url: '/admin/links/create_grapped_link_cover'
    , maxFiles: 1
    })

    dropzone.on('sending', function(file, xhr, formData) {
      $.rails.CSRFProtection(xhr)
    })

    dropzone.on('maxfilesexceeded', function(file) {
      this.removeAllFiles()
      this.addFile(file)
    })

    dropzone.on('success', _.bind(function(file, resp) {
      this.$('.link-cover').hide()
      this.$('input[name=cover_id_from_link]').val(resp.identifier)
    }, this))

    return this
  }
, formSubmitted: function(e) {
    e.preventDefault()
    var coverIdFromLink = this.$('input[name=cover_id_from_link]').val()

    if (coverIdFromLink) {
      this.edittingModel.set({
        cover_id_from_link: coverIdFromLink
      })
    }

    this.edittingModel.set({
      title: this.$('input[name=title]').val()
    , url: this.$('input[name=url]').val()
    }).save().done(_.bind(function() {
      this.scope.trigger('close:modal')
    }, this))

    return
  }
})
