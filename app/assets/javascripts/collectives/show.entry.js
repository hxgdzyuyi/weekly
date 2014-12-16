var $ = require('jquery')
  , Masonry = require('Masonry')
  , imagesLoaded = require('imagesLoaded')

$(function() {
  var container = $('.grids')[0]
  var msnry = new Masonry( container, { itemSelector: '.grid' })
  imagesLoaded(container, function() {
    msnry.layout()
  })
})
