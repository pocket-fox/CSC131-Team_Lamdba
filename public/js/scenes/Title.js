"use strict";

var TitleState = {

  _a11yRoot: null,
  _live: null,
  _label: null,
  
  preload: function () {},
  create: function () {

    this.game.canvas.setAttribute('role', 'img');
    // this.game.canvas.setAttribute('aria-hidden', 'true');
    this.game.canvas.setAttribute('tabindex', '1');
    
    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Titles
    this.titleProfessorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.05 * HEIGHT,
      "title_professor"
    );
    this.titlePreventsSprite = this.add.sprite(
      0.34 * WIDTH,
      0.1 * HEIGHT,
      "title_prevents"
    );

    // Characters
    this.professorSprite = this.add.sprite(
      0.03 * WIDTH,
      0.37 * HEIGHT,
      "professor_1"
    );

    // Buttons
    this.playButton = this.add.button(
      0.3 * WIDTH,
      0.68 * HEIGHT,
      "button_play",
      this.playButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.playButton.ariaLabel = 'Play';
    this.add
      .tween(this.playButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

      // captures enter key
      this.spaceKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

      // debug message + button click (open in browser, press f12)
      this.spaceKey.onDown.add(function () {
          console.log("Enter pressed on Title screen!");
          this.playButtonActions.onClick.call(this);
      }, this);

      // captures m key
      this.mKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.M]);

      // mutes when m is pressed + debug (open in browser, press f12)
      this.mKey.onDown.add(function () {
          console.log("M key pressed — toggling mute");
          AudioManager.toggleMusic(this);
      }, this);

      // / to open up the button map
      this.slashKey = this.input.keyboard.addKey(191); // "/" key
      this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
      this.switching = false;

      console.log("TitleState ready — press '/' to open StartState");

      // p to open pause screen
      this.pKey = this.input.keyboard.addKey(Phaser.Keyboard.P);
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.P]);

      this.pKey.onDown.add(function () {
          if (this.switching) return; // prevent double-trigger
          this.switching = true;

          console.log("P key pressed — opening PauseState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) {
              AudioManager.stopAll();
          }

          // remember where we came from so Resume can go back
          lastState = Game.state.current;

          this.state.start("PauseState");

          // brief delay before allowing next input
          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }, this);

    // Mute button
    createMuteButton(this);
      // Pause Button
      var onPause = function () {
          AudioManager.playSound("bloop_sfx", this);
          LastState = "PPQuestionState";
          this.state.start("PauseState");
      };
      this.pauseButton = this.add.button(
          0.892 * WIDTH,
          0.185 * HEIGHT,
          "button_pause",
          onPause,
          this,
          0,
          0,
          1
      );
      this.pauseButton.scale.setTo(0.75);

    // Audio
    AudioManager.playSong("title_music", this);

    // Keyboard spacebar to start game
    this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(this.playButtonActions.onClick, this);
    console.log(this.game.world.children);

      
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
      if (this.slashKey && !this.switching && this.slashKey.justDown) {
          this.switching = true;
          console.log("/ pressed in TitleState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) {
              AudioManager.stopAll();
          }
          this.state.start("StartState");

          // brief delay before allowing next input
          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }
  },

  playButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("IntroState");
    },
  },
};
