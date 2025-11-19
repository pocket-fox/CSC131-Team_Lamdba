"use strict";

var PPLevelSelectState = {

  _a11yRoot: null,
  _live: null,
  _label: null,

  preload: function () {},
  create: function () {
    // Set Restart Point
    RestartState = "PPLevelSelectState";

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Mute Button
    //this.muteBtn = this.add.button(0.9 * WIDTH, 0.1 * HEIGHT, "button_sound")
    //this.muteBtn.anchor.setTo(0.5, 0.5);

    // Characters
    this.professorSprite = this.add.sprite(
      0.08 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Speech Box
    this.speechBox = this.add.sprite(
      0.5 * WIDTH,
      0.35 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox.anchor.setTo(0.44, 0.5);
    this.speechBox.scale.setTo(-1, -1);

    // Speech Text
    this.speechText = this.add.text(
      0.49 * WIDTH + 0.5,
      0.35 * HEIGHT + 0.5,
      TextData.ppChoseLevel,
      TextStyle.centeredExtraLarge
    );
    this.speechText.anchor.setTo(0.5, 0.5);
    this.speechText.lineSpacing = TextStyle.lineSpacing;
    this.speechText.resolution = 2;

    // Level Select Buttons
    this.level1Btn = this.add.button(
      0.475 * WIDTH,
      0.55 * HEIGHT,
      "button_pp_lvl1",
      this.buttonActions.onClickOne,
      this,
      0,
      0,
      1
    );
    this.level1Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level1Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.level2Btn = this.add.button(
      0.475 * WIDTH,
      0.45 * HEIGHT,
      "button_pp_lvl2",
      this.buttonActions.onClickTwo,
      this,
      0,
      0,
      1
    );
    this.level2Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level2Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.level3Btn = this.add.button(
      0.475 * WIDTH,
      0.65 * HEIGHT,
      "button_pp_lvl3",
      this.buttonActions.onClickThree,
      this,
      0,
      0,
      1
    );
    this.level3Btn.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.level3Btn.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute button
    createMuteButton(this);

    // Keyboard can use 1, 2, and 3 to select level, numpad or top row
    this.input.keyboard.addKey(Phaser.Keyboard.ONE)
      .onDown.add(this.buttonActions.onClickOne, this);
    this.input.keyboard.addKey(Phaser.Keyboard.TWO)
      .onDown.add(this.buttonActions.onClickTwo, this);
    this.input.keyboard.addKey(Phaser.Keyboard.THREE)
      .onDown.add(this.buttonActions.onClickThree, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)
      .onDown.add(this.buttonActions.onClickOne, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2)
      .onDown.add(this.buttonActions.onClickTwo, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_3)
      .onDown.add(this.buttonActions.onClickThree, this);

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
  buttonActions: {
    onClickOne: function () {
      PPGame.levelId = 0;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
    onClickTwo: function () {
      PPGame.levelId = 1;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
    onClickThree: function () {
      PPGame.levelId = 2;
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPQuestionState");
    },
  },
};
