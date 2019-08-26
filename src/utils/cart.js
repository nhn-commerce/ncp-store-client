import ssq from 'jquery'

function floatingBtn () {
  var body, tTop, wScl, wH, cb
  body = ssq('body')
  wScl = ssq(window).scrollTop()
  wH = ssq(window).height()
  cb = (ssq('.cart_bottom').length !== 0) ? ssq('.cart_bottom') : 0
  tTop = (ssq('.order_buy_btn').length !== 0) ? ssq('.order_buy_btn').offset().top : 0
  var scl = wScl + wH
  if ((scl < tTop) && (cb !== 0)) {
    body.addClass('floating_bottom')
  } else {
    body.removeClass('floating_bottom')
  }
}
function resizePage (e) {

}
var listener = {
  start: function () {
    ssq(window).bind('resize', resizePage); resizePage()
  }
}
listener.start()
export default floatingBtn
