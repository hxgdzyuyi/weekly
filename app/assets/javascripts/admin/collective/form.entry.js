var _ = require('underscore')
require('html.sortable')

_.templateSettings = {
    evaluate    : /\{\{([\s\S]+?)\}\}/g
  , interpolate : /\{\{=([\s\S]+?)\}\}/g
  , escape      : /\{\{-([\s\S]+?)\}\}/g
}

var CollectivesPanel = require('./views/collectives_panel')
  , ModalManager = require('./views/modal_manager')
  , LinksCollection = require('./collections/links')
  , $ = require('jquery')
  , Backbone = require('backbone')
  , CollectivesModel = Backbone.Model.extend({})

$(function() {
  var scope = new CollectivesModel()
    , linksJson = $('#collectives-panel-data').text().trim()

  var contntObject = JSON.parse(linksJson)

  scope.set('links', new LinksCollection(contntObject, { scope: scope }))
  scope.set('collective_id', $('input.collective-id-value').val())

  var modalManager = new ModalManager({ scope: scope })
  scope.set('modalManager', modalManager)

  var collectivesPanel = new CollectivesPanel({
    scope: scope
  })

  $('#collectives-panel-placeholder')
    .replaceWith(collectivesPanel.render().el)
})
