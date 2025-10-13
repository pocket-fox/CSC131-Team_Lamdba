/*!
 * a11yKit.js — unified ARIA live + focus-trap helper (Phaser 2 friendly, ES5)
 *
 * Global API:
 *   var kit = A11yKit.init({
 *     parent: game.canvas.parentNode,   // container to append live region (defaults to <body>)
 *     elements: [game.canvas],          // focus cycle list (can update later)
 *     escapeKey: 'Escape',              // optional; default 'Escape'
 *     live: 'polite',                   // 'polite' | 'assertive' (default 'polite')
 *     atomic: true,                     // default true
 *     className: 'sr-only',             // optional CSS class for visually-hidden
 *     onEnable: function(){},           // trap enabled callback
 *     onDisable: function(){}           // trap disabled callback
 *   });
 *
 *   kit.announce('Text');  kit.assertive(); kit.polite();
 *   kit.trap.enable();     kit.trap.disable(); kit.trap.update(newElems);
 *   kit.destroy();         // removes listeners + live region
 */
(function (global) {
  'use strict';

  // ---------- Live Region ----------
  function createLiveRegion(parent, opts) {
    var el = document.createElement('div');

    var live = opts && opts.live ? String(opts.live) : 'polite';
    el.setAttribute('aria-live', live);

    var atomic = (opts && typeof opts.atomic !== 'undefined') ? !!opts.atomic : true;
    el.setAttribute('aria-atomic', atomic ? 'true' : 'false');

    if (opts && opts.className) {
      el.className = String(opts.className);
    } else {
      // default visually-hidden styles
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      el.style.width = '1px';
      el.style.height = '1px';
      el.style.overflow = 'hidden';
      el.style.clip = 'rect(0,0,0,0)';
      el.style.whiteSpace = 'nowrap';
      el.style.border = '0';
    }

    (parent || document.body).appendChild(el);
    return el;
  }

  function makeAnnouncer(liveEl) {
    var timer = null;
    var last = '';
    function setLive(val) { if (liveEl) liveEl.setAttribute('aria-live', val); }
    return {
      announce: function (msg) {
        if (!liveEl) return;
        var text = (msg == null) ? '' : String(msg);
        if (text === last) text += ' '; // nudge SRs to re-announce duplicates
        last = text;

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

  // ---------- Focus Trap ----------
  function isFocusable(el) {
    if (!el) return false;
    if (el.tabIndex >= 0) return true;
    el.setAttribute('tabindex', '0');
    return true;
  }

  function FocusTrap(opts) {
    this.enabled = false;
    this.escapeKey = (opts && opts.escapeKey) || 'Escape';
    this.onEnable = (opts && opts.onEnable) || null;
    this.onDisable = (opts && opts.onDisable) || null;
    this._keydown = null;
    this._elements = [];
    if (opts && opts.elements && opts.elements.length) {
      this.update(opts.elements);
    }
  }

  FocusTrap.prototype._cycle = function (dir) {
    var els = this._elements;
    if (!els || !els.length) return;

    var active = document.activeElement;
    var i, idx = -1;
    for (i = 0; i < els.length; i++) { if (els[i] === active) { idx = i; break; } }
    if (idx === -1) idx = 0;

    var next = (idx + dir + els.length) % els.length;
    els[next].focus();
  };

  FocusTrap.prototype.enable = function () {
    if (this.enabled) return;
    this.enabled = true;

    for (var i = 0; i < this._elements.length; i++) { isFocusable(this._elements[i]); }
    if (this._elements.length) this._elements[0].focus();

    var self = this;
    this._keydown = function (e) {
      if (!self.enabled) return;
      var key = e.key || e.code;
      if (key === 'Tab') {
        e.preventDefault();
        self._cycle(e.shiftKey ? -1 : 1);
        return;
      }
      if (key === self.escapeKey) {
        e.preventDefault();
        self.disable();
      }
    };
    document.addEventListener('keydown', this._keydown, true);
    if (typeof this.onEnable === 'function') this.onEnable();
  };

  FocusTrap.prototype.disable = function () {
    if (!this.enabled) return;
    this.enabled = false;
    if (this._keydown) {
      document.removeEventListener('keydown', this._keydown, true);
      this._keydown = null;
    }
    if (typeof this.onDisable === 'function') this.onDisable();
  };

  FocusTrap.prototype.update = function (elements) {
    this._elements = [];
    if (elements && elements.length) {
      for (var i = 0; i < elements.length; i++) {
        if (elements[i]) this._elements.push(elements[i]);
      }
    }
  };

  FocusTrap.prototype.destroy = function () {
    this.disable();
    this._elements = [];
    this.onEnable = null;
    this.onDisable = null;
  };

  // ---------- Unified Kit ----------
  var A11yKit = {
    /**
     * Create a live region + focus trap.
     * @param {Object} opts  see header docs
     * @returns {{
     *   announce:Function, polite:Function, assertive:Function,
     *   trap:{enable:Function, disable:Function, update:Function, destroy:Function},
     *   destroy:Function
     * }}
     */
    init: function (opts) {
      opts = opts || {};
      var liveEl = createLiveRegion(opts.parent || null, opts);
      var announcer = makeAnnouncer(liveEl);
      var trap = new FocusTrap({
        elements: opts.elements || [],
        escapeKey: opts.escapeKey || 'Escape',
        onEnable: opts.onEnable || null,
        onDisable: opts.onDisable || null
      });

      return {
        // live
        announce: announcer.announce,
        polite: announcer.polite,
        assertive: announcer.assertive,

        // trap
        trap: {
          enable: function () { trap.enable(); },
          disable: function () { trap.disable(); },
          update: function (els) { trap.update(els); },
          destroy: function () { trap.destroy(); }
        },

        // teardown
        destroy: function () {
          trap.destroy();
          announcer.destroy();
        }
      };
    }
  };

  // expose globally
  global.A11yKit = A11yKit;

})(window);
