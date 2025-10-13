/*!
 * a11yLive.js — tiny aria-live helper for Phaser 2 (or any app)
 * Usage:
 *   this.a11y = A11yLive.init(this.game.canvas.parentNode, { live: 'polite' });
 *   this.a11y.announce('Level 1 ready.');
 *   this.a11y.assertive(); this.a11y.announce('Warning!'); this.a11y.polite();
 *   this.a11y.destroy(); // in shutdown()
 */
(function (global) {
  'use strict';

  function createLiveRegion(parent, opts) {
    var el = document.createElement('div');

    // live mode: 'polite' (default) or 'assertive'
    var live = opts && opts.live ? String(opts.live) : 'polite';
    el.setAttribute('aria-live', live);

    // atomic: SR should read the whole node when it changes
    var atomic = (opts && typeof opts.atomic !== 'undefined') ? !!opts.atomic : true;
    el.setAttribute('aria-atomic', atomic ? 'true' : 'false');

    // Hide visually (or allow custom class)
    if (opts && opts.className) {
      el.className = String(opts.className);
    } else {
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.width = '1px';
      el.style.height = '1px';
      el.style.overflow = 'hidden';
    }

    (parent || document.body).appendChild(el);
    return el;
  }

  function makeAnnouncer(liveEl) {
    var timer = null;
    var last = '';

    function setLive(val) {
      if (liveEl) liveEl.setAttribute('aria-live', val);
    }

    return {
      announce: function (msg) {
        if (!liveEl) return;
        // Avoid SRs ignoring repeated identical text
        var text = (msg == null) ? '' : String(msg);
        if (text === last) text += ' ';
        last = text;

        // Clear then set shortly after to ensure change is detected
        liveEl.textContent = '';
        if (timer) clearTimeout(timer);
        timer = setTimeout(function () {
          if (liveEl) liveEl.textContent = text;
        }, 10);
      },
      polite: function () { setLive('polite'); },
      assertive: function () { setLive('assertive'); },
      destroy: function () {
        if (timer) { clearTimeout(timer); timer = null; }
        if (liveEl && liveEl.parentNode) liveEl.parentNode.removeChild(liveEl);
        liveEl = null;
      }
    };
  }

  var A11yLive = {
    /**
     * Initialize once per scene/state.
     * @param {HTMLElement} parent - container to append the live region (e.g., game.canvas.parentNode).
     * @param {Object} [opts] - { live: 'polite'|'assertive', atomic: true|false, className: 'sr-only' }
     * @returns {{announce:Function, polite:Function, assertive:Function, destroy:Function}}
     */
    init: function (parent, opts) {
      var el = createLiveRegion(parent, opts || {});
      return makeAnnouncer(el);
    }
  };

  // Expose globally
  global.A11yLive = A11yLive;

})(window);
