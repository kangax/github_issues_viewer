function pushState(url) {
  if (typeof history == 'undefined') return;
  history.pushState && history.pushState({ }, '', url);
}

function replaceState(url) {
  if (typeof history == 'undefined') return;
  history.replaceState && history.replaceState({ }, '', url);
}

function initState(url, onChange) {
  var numPopstates = 0;

  if (typeof window === 'undefined') return;

  window.onpopstate = function() {
    onChange && onChange();
    numPopstates++;
  };

  $(window).on('load', function() {
    if (numPopstates === 0) {
      window.onpopstate();
    }
  });

  url && replaceState(url);
}

module.exports = {
  pushState: pushState,
  replaceState: replaceState,
  initState: initState
};
