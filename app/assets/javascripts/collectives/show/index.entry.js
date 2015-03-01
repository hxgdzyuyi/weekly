var $ = require('jquery')
  , Masonry = require('masonry')

$(function() {

  $('.links-list').each(function(index, element) {
    var linksList = $(element)
    linksList.removeClass('without-masonry')
      .addClass('with-masonry')

    var gutterSizer = $('<div>', { class: 'gutter-sizer'})
    linksList.append(gutterSizer)
    var msnry = new Masonry( element, {
      itemSelector: '.link-item'
    , gutter: '.gutter-sizer'
    })
  })
})
