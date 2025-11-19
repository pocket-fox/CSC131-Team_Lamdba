"use strict";

var ChooseGameState = {

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
    this.professorSprite1 = this.add.sprite(
      0.37 * WIDTH,
      0.41 * HEIGHT,
      "professor_2"
    );

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.2 * WIDTH,
      0.66 * HEIGHT,
      "speechbox_3"
    );
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.2 * WIDTH + 0.5,
      0.66 * HEIGHT + 0.5,
      TextData.chooseGame,
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    // Buttons
    this.ffButton = this.add.button(
      0.25 * WIDTH,
      0.22 * HEIGHT,
      "button_ff",
      this.ffButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.ffButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.ffButton.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    this.ppButton = this.add.button(
      0.75 * WIDTH,
      0.22 * HEIGHT,
      "button_pp",
      this.ppButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.ppButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.ppButton.scale)
      .to({ x: 0.9, y: 0.9 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute button
    createMuteButton(this);

    // Start Animation
    this.animationSpeed = 500;

    this.add
      .tween(this.speechText1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

    // Audio
    AudioManager.playSong("title_music", this);
  
    // Keyboardto select game: 1 -> FF, 2 -> PP (top row)
    this.input.keyboard.addKey(Phaser.Keyboard.ONE)
      .onDown.add(this.ffButtonActions.onClick, this);
    this.input.keyboard.addKey(Phaser.Keyboard.TWO)
      .onDown.add(this.ppButtonActions.onClick, this);

    // Numpad
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_1)
      .onDown.add(this.ffButtonActions.onClick, this);
    this.input.keyboard.addKey(Phaser.Keyboard.NUMPAD_2)
      .onDown.add(this.ppButtonActions.onClick, this);

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
    

      
},
  shutdown: function () {
    if (this.a11y) { this.a11y.destroy(); this.a11y = null; }
    if (this.domElements) { A11yKit.destroyDomOverlays(this.domElements); this.domElements = null };
    
  },
  update: function () {
    updateCloudSprites(this);
  },
  ffButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("FFIntroState");
    },
  },
  ppButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPIntroState");
    },
  },
};
