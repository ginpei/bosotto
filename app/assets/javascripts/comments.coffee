# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.

$(document).on 'page:change', (event)->
  data = JSON.parse($('.js-data').attr('data-data'))
  serverTime = new Date(data.serverTime)
  diff = serverTime - Date.now()
  diffS = parseInt(diff/1000, 10)
  diffMs = Math.abs(diff - diffS*1000)
  diffText = (if diffS>0 then '+' else '') + diffS + '.' + diffMs

  $('.js-time-diff').text(diffText)
  alert('WARN: Serve is delayed!') if Math.abs(diff) > 60000
