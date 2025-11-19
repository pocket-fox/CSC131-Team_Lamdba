"use strict";

var PPLevelSelectState = {
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
          0.45 * HEIGHT,
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
          0.55 * HEIGHT,
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
      

      // captures m key
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
          console.log("/ pressed in PPLevelSelectState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;

          this.state.start("StartState");

          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }
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
