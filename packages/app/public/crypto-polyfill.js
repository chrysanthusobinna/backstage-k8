(function () {
  // crypto.randomUUID() is only defined in secure contexts (HTTPS or localhost).
  // This deployment is served over plain HTTP from a raw IP, so the browser
  // omits it even though crypto.getRandomValues() (used below) still works
  // in insecure contexts. This polyfill fills the gap so the app can boot.
  if (typeof globalThis.crypto === 'undefined') {
    globalThis.crypto = {};
  }
  if (typeof globalThis.crypto.randomUUID === 'function') {
    return;
  }
  globalThis.crypto.randomUUID = function randomUUID() {
    var bytes = new Uint8Array(16);
    globalThis.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    var hex = Array.prototype.map.call(bytes, function (b) {
      return b.toString(16).padStart(2, '0');
    });
    return (
      hex.slice(0, 4).join('') + '-' +
      hex.slice(4, 6).join('') + '-' +
      hex.slice(6, 8).join('') + '-' +
      hex.slice(8, 10).join('') + '-' +
      hex.slice(10, 16).join('')
    );
  };
})();
