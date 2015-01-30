var _ = require('underscore')
_.templateSettings = {
    evaluate    : /\{\{([\s\S]+?)\}\}/g
  , interpolate : /\{\{=([\s\S]+?)\}\}/g
  , escape      : /\{\{-([\s\S]+?)\}\}/g
}

var $ = require('jquery')
  , LinksCollection = require('../collections/links.js')
  , Backbone = require('backbone')
  , CollectivesModel = Backbone.Model.extend({})
  , CollectivesPanel = require('./views/collectives_panel')

$(function() {
  var scope = new CollectivesModel({})
    , resp = JSON.parse($('#links_json[type="json"]').html())

  scope.set('links', new LinksCollection(resp, { scope: scope }))
  var collectivesPanel = new CollectivesPanel({ scope: scope })
})
