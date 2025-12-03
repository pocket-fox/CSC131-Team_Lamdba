"use strict";

var lastState = null;

var PPScoreState = {
  preload: function () {},
  create: function () {
    this.subSceneIndex = 0;

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.6 * WIDTH,
      0.39 * HEIGHT,
      "professor_3"
    );

    // Title
    this.titleSprite = this.add.sprite(
      0.5 * WIDTH,
      0.2 * HEIGHT,
      "pp_score_title"
    );
    this.titleSprite.anchor.setTo(0.5, 0.5);

    // Speech Box
    this.speechBox = this.add.sprite(0.32 * WIDTH, 0.5 * HEIGHT, "speechbox_5");
    this.speechBox.anchor.setTo(0.44, 0.5);

    // Score
    this.scoreText = this.add.text(
      0.32 * WIDTH,
      0.5 * HEIGHT,
      PPGameData.finalScore(PPGame.score),
      TextStyle.centeredExtraLarge
    );
    this.scoreText.anchor.setTo(0.5, 0.5);
    this.scoreText.lineSpacing = TextStyle.lineSpacing;
    this.scoreText.addFontWeight("bold", 0);
    this.scoreText.addFontWeight("normal", 11);
    this.scoreText.resolution = 2;

    // Buttons
    this.homeButton = this.add.button(
      0.2 * WIDTH,
      0.78 * HEIGHT,
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

    this.replayButton = this.add.button(
      0.4 * WIDTH,
      0.78 * HEIGHT,
      "button_replay",
      this.replayButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.replayButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.replayButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

      // control button
      var onQuestion = function () {
          AudioManager.playSound("bloop_sfx", this);

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;
          this.state.start("StartState");
      };

      this.questionButton = this.add.button(
          0.892 * WIDTH,     // move left/right
          0.02 * HEIGHT,    // move up/down
          "button_question",
          onQuestion,
          this
      );
      this.questionButton.scale.setTo(0.75);

    // Start Animation
    this.animationSpeed = 500;

    this.add
      .tween(this.scoreText.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

    // Reset PPGame
    PPGame.reset();

    // Audio
    AudioManager.playSong("results_music", this);


    this.game.canvas.setAttribute('role', 'img');
    this.game.canvas.setAttribute('tabindex', '1');

    var domOverlays = A11yKit.buildDomOverlaysFromWorld(this.game, { startTabIndex: 100 });
    this.domElements = domOverlays.domElements;
    self = this;

    // 3. Initialize A11yKit with focus management
    this.a11y = A11yKit.init({
        parent: this.game.canvas.parentNode,
        elements: this.domElements,
        escapeKey: 'Escape',
        live: 'polite',
        onEnable: function(){ self.a11y.announce('Game focused.'); },
        onDisable: function(){ self.a11y.announce('Game focus released'); }
    });

    // 4. Enable focus trap on canvas interaction
    this.game.canvas.addEventListener('focus', function(){ self.a11y.trap.enable(); }, true);
    this.game.canvas.addEventListener('click', function(){ self.a11y.trap.enable(); }, true);
    self.a11y.trap.enable();
    
      this.mKey = this.input.keyboard.addKey(Phaser.Keyboard.M);
      this.input.keyboard.addKeyCapture([Phaser.Keyboard.M]);

      // mutes when m is pressed + debug (open in browser, press f12)
      this.mKey.onDown.add(function () {
          console.log("M key pressed — toggling mute");
          AudioManager.toggleMusic(this);
      }, this);

      // / to open button map
      this.slashKey = this.input.keyboard.addKey(191); // "/" key
      this.shiftKey = this.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
      this.switching = false;

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
          console.log("/ pressed in PPScoreState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;

          this.state.start("StartState");

          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }
  },
  homeButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);

      this.state.start("PPIntroState");

    },
  },
  replayButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPLevelSelectState");
    },
  },
};
