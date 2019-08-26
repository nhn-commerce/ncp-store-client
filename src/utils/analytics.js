/* eslint-disable */

// GA 파라미터 설정.
var trackId = '' // GA계정에서 확인하는 trackId.
var domain = location.href // GA계정에 설정한 default url의 도메인.

var setGAParam = function () {
  trackId = ''
}

setGAParam();

//GA스크립트 초기화
/*-- Google Analytics --*/
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments) }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

var _gaq = _gaq || [];
_gaq.push(['_setAccount', trackId]);
_gaq.push(['_setDomainName', domain]);
_gaq.push(['_trackPageview']);

ga('create', trackId, 'auto', { 'legacyCookieDomain': domain });
ga('send', 'pageview');

//수동으로 GA PV기록을 남기는 메서드. 페이지 변경 이벤트 발생시 호출. path:기록을 남기는 url
const trackGA = function (path) {
  ga('set', { page: path });
  ga('send', 'pageview');
}

export default trackGA
