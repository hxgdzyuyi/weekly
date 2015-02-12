// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require turbolinks

$(function() {
  $(document).on('click', 'a[href="#"]', function(e) {
    e.preventDefault()
  })
})

$(function() {
  var doc = $(document)

  doc.on('click', '.dropmenu-content', function(e) {
    e.stopPropagation()
  })

  doc.on('click', '.dropmenu-wrapper .dropmenu-toggle', function(e) {

    var dropmenuToggle = $(e.currentTarget)
      , dropmenuContainer = dropmenuToggle.closest('.dropmenu-wrapper')
      , dropmenuContent = dropmenuContainer.find('.dropmenu-content')

    if (dropmenuToggle.data('expanded')) { return }

    dropmenuContent.show()
    dropmenuToggle.data('expanded', true)

    setTimeout(function() {
      doc.one('click', function() {
        dropmenuToggle.data('expanded', false)
        dropmenuContent.hide()
      })
    }, 0)
  })
})
