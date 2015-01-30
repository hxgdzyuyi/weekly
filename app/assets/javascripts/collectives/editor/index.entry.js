var _ = require('underscore')
require('textarea-autosize')

_.templateSettings = {
    evaluate    : /\{\{([\s\S]+?)\}\}/g
  , interpolate : /\{\{=([\s\S]+?)\}\}/g
  , escape      : /\{\{-([\s\S]+?)\}\}/g
}

var CollectivesPanel = require('./views/collectives_panel')
  , ModalManager = require('./views/modal_manager')
  , LinksCollection = require('./collections/links')
  , NodesCollection = require('./collections/nodes')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , CollectivesModel = Backbone.Model.extend({})

$(function() {
  var scope = new CollectivesModel({})

  scope.set('collective_id', $('input.collective-id-value').val())

  var CollectiveEditMode = Backbone.Model.extend({})
  var collectiveEditMode = new CollectiveEditMode({})

  collectiveEditMode.fetch({
    url: '/collectives/' + scope.get('collective_id') + '/edit_info'
  }).done(function(resp) {

    scope.set('links', new LinksCollection(resp.links, { scope: scope }))
    scope.set('nodes', new NodesCollection(resp.nodes, { scope: scope }))

    scope.get('nodes')
      .push({ title: '未分类', isDefaultNode: true, summary: '', node_id: null })

    var modalManager = new ModalManager({ scope: scope })
    scope.set('modalManager', modalManager)

    var collectivesPanel = new CollectivesPanel({ scope: scope })

    $('#collectives-panel-placeholder')
      .replaceWith(collectivesPanel.render().el)
  })
})
