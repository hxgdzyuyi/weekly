var $ = require('jquery')
  , Masonry = require('masonry')
  , imagesLoaded = require('imagesloaded')

$(function() {
  var container = $('.grids')[0]
  var msnry = new Masonry( container, { itemSelector: '.grid' })
  imagesLoaded(container, function() {
    msnry.layout()
  })
})
