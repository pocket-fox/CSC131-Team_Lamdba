"use strict";

var PauseState = {

  _a11yRoot: null,
  _live: null,
  _label: null,

  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite = this.add.sprite(
      0.08 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Speech Boxes
    this.speechBox = this.add.sprite(0.5 * WIDTH, 0.25 * HEIGHT, "speechbox_2");
    this.speechBox.anchor.setTo(0.44, 0.5);
    this.speechBox.scale.setTo(-1.0, 1.0);

    // Speech Text
    this.speechText = this.add.text(
      0.5 * WIDTH,
      0.25 * HEIGHT,
      TextData.pause,
      TextStyle.centeredXXLarge
    );
    this.speechText.anchor.setTo(0.5, 0.5);
    this.speechText.lineSpacing = TextStyle.lineSpacing;
    this.speechText.addFontWeight("bold", 0);
    this.speechText.resolution = 2;

    // Buttons
    this.resumeButton = this.add.button(
      0.4 * WIDTH,
      0.52 * HEIGHT,
      "button_play",
      this.resumeButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.resumeButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.resumeButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.restartButton = this.add.button(
      0.6 * WIDTH,
      0.52 * HEIGHT,
      "button_replay",
      this.restartButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.restartButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.restartButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.homeButton = this.add.button(
      0.4 * WIDTH,
      0.77 * HEIGHT,
      "button_home",
      this.homeButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.homeButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.homeButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute Button
    this.muteButton = createMuteButtonPos(this, 0.6, 0.77);
    this.muteButton.anchor.setTo(0.5, 0.5);
    this.muteButton.scale.setTo(1.0, 1.0);
    this.add
      .tween(this.muteButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

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
    console.log("shutting down Title.js...");

    if (this.a11y) { this.a11y.destroy(); this.a11y = null; }
    if (this.domElements) { A11yKit.destroyDomOverlays(this.domElements); this.domElements = null };
  },
  update: function () {
    updateCloudSprites(this);
  },
  resumeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start(LastState);
    },
  },
  restartButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      FFGame.reset();
      PPGame.reset();
      this.state.start(RestartState);
    },
  },
  homeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      FFGame.reset();
      PPGame.reset();
      this.state.start("ChooseGameState");
    },
  },
};
