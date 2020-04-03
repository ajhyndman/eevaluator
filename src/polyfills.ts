import 'focus-visible/dist/focus-visible.min';

/**
 * Minimal polyfill for clipboard.writeText, that supports ios safari
 * @see {@link https://gist.github.com/lgarron/d1dee380f4ed9d825ca7#gistcomment-2934251}
 */
function writeText(str: string) {
  return new Promise(function(resolve, reject) {
    /********************************/
    var range = document.createRange();
    range.selectNodeContents(document.body);
    document.getSelection()?.addRange(range);
    /********************************/

    let success = false;
    function listener(e: ClipboardEvent) {
      e.clipboardData?.setData('text/plain', str);
      e.preventDefault();
      success = true;
    }
    document.addEventListener('copy', listener);
    document.execCommand('copy');
    document.removeEventListener('copy', listener);

    /********************************/
    document.getSelection()?.removeAllRanges();
    /********************************/

    success ? resolve() : reject();
  });
}

// polyfill async clipboard API if it is not present.
if (!window.navigator.clipboard) {
  Object.defineProperty(window.navigator, 'clipboard', {
    value: { writeText },
    writable: false,
  });
}
