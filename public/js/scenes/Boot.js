"use strict";

var BootState = {

  _a11yRoot: null,
  _live: null,
  _label: null,

  init: function () {
    if (this.game.device.desktop) {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);
      this.scale.pageAlignHorizontally = true;
      this.scale.pageAlignVertically = true;
    } else {
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT);
      this.scale.pageAlignHorizontally = true;
      this.scale.windowConstraints.bottom = "visual";
    }
  },
  preload: function () {
    this.load.image("background_1", "assets/background/1.png");
    this.load.image("progress_bar", "assets/progress_bar.png");
    this.load.image("progress_bar_bg", "assets/progress_bar_bg.png");
  },
  create: function () {
    this.state.start("LoadState");
    // Dom Functionality
    var domOverlays = A11yKit.buildDomOverlaysFromWorld(this.game, { startTabIndex: 100 });
    this.domElements = domOverlays.domElements;
    var focusables = [ this.game.canvas ].concat(domOverlays.focusables);
    var self = this;

    this.a11y = A11yKit.init({
      parent: this.game.canvas.parentNode,
      elements: this.domElements,
      escapeKey: 'Escape',
      live: 'polite',
      onEnable: function(){ self.a11y.announce('Game focused.'); },
      onDisable: function(){ self.a11y.announce('Game focus released'); }
    });

    this.game.canvas.addEventListener('focus', function(){ self.a11y.trap.enable(); }, true)
    this.game.canvas.addEventListener('click', function(){ self.a11y.trap.enable(); }, true)
    
    this.a11y.announce(
      'Professor Davis Green Prevents Stormwater Pollution. Press Question Mark to hear controls.'
    )

  },
  shutdown: function () {
    
    if (this.a11y) { this.a11y.destroy(); this.a11y = null; }
    if (this.domElements) { A11yKit.destroyDomOverlays(this.domElements); this.domElements = null };
  },
};
