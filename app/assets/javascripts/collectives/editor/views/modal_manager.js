var _ = require('underscore')
  , $ = require('jquery')
  , Backbone = require('backbone')

require('modal/javascripts/jquery.modal.js')
require('style!css!modal/stylesheets/jquery.modal.css')

var formsSetting = {
  addLink: {
    title: '添加网页'
  , View: require('./forms/add_link')
  }
, createOrEditNode: {
    title: '添加分类'
  , View: require('./forms/node')
  }
, createLink: {
    title: '创建网页'
  , View: require('./forms/create_link')
  }
, editLink: {
    title: '编辑网页'
  , View: require('./forms/edit_link')
  }
}

module.exports = Backbone.View.extend({
  el: $('#add-link-modal')
, initialize: function(options) {
    this.content = this.$('.modal-inner-content')
    this.header = this.$('.modal-header')
    this.scope = options.scope
    this.listenTo(this.scope, 'render:modal', _.bind(this.renderModal, this))
    this.listenTo(this.scope, 'open:modal', _.bind(this.open, this))
    this.listenTo(this.scope, 'close:modal', _.bind(this.close, this))
  }
, renderModal: function(options) {
    var setting = formsSetting[options.state || 'addLink']
      , title = setting.title
      , View = setting.View
      , view = new View({
          scope: this.scope
        , modelOptions: options.modelOptions || {}
        , edittingModel: options.edittingModel || null
        , viewOptions: options.viewOptions || {}
        , modalScope: options.modalScope || null
        })


    this.content.html(view.render().el)
    this.header.text(title)
  }
, render: function(stateOptions) {
    state = stateOptions.state
    if (state === 'addLink') {
      this.addLinkModel = new AddLinkModel()
      this.content.html(this.tmplAddLink)
    } else if (state === 'loading') {
      this.content.text('网页分析中。。。')
    } else if (state === 'editLink') {
      this.editLinkModel = new EditLinkModel({
        title: this.addLinkModel.get('title')
      , url: this.addLinkModel.get('url')
      })

      this.content.html(
        _.template(this.tmplEditLink)(this.editLinkModel.toJSON()))
    }
    return this
  }
, close: function() {
    this.$el.modal({ action: 'close' })
  }
, open: function() {
    this.$el.modal()
  }
})
