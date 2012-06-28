#= require jquery-1.7.1.min.js
#= require underscore-min.js

jQuery ->
  # Home page
  if window.location.pathname is '/'
    refresh = ->
      window.location = '/'

    socket = io.connect("/")
    socket.on "pie:changed", (pie) ->
      refresh()

    setTimeout refresh, 1000*60

    # DEBUG
    window.socket = socket

  # Admin
  $('ul#listing li div.status div').click ->
    dataId      = $(@).closest('li').attr('data-id')
    classNames  = $(@).attr('class').split(' ')
    statesArray = _.reject classNames, (className) -> className is 'on'
    state       = statesArray[0]
    $.ajax "/admin/pies/#{dataId}",
      type:'PUT'
      data: {state}
    $(@).closest('li').find('div.status div').removeClass 'on'
    $(@).addClass 'on'
