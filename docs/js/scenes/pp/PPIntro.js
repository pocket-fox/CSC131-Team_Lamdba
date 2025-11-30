"use strict";

var lastState = null;
var ppIntroSubSceneIndex = 0;

var PPIntroState = {
  preload: function () {},
  create: function () {
    this.subSceneIndex = 0;

    // Background
    this.backgroundSprite = this.add.sprite(0, 0, "background_1");

    // Clouds
    this.cloudSprites = createCloudSprites(this);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.42 * WIDTH,
      0.4 * HEIGHT,
      "professor_5"
    );

    this.professorSprite2 = this.add.sprite(
      0.4 * WIDTH,
      0.39 * HEIGHT,
      "professor_3"
    );
    this.professorSprite2.visible = false;

    this.professorSprite3 = this.add.sprite(
      0.6 * WIDTH,
      0.39 * HEIGHT,
      "professor_4"
    );
    this.professorSprite3.scale.setTo(-1.0, 1.0);
    this.professorSprite3.visible = false;

    // Misc.
    this.trashcanSprite = this.add.sprite(
      0.08 * WIDTH,
      0.43 * HEIGHT,
      "pp_trashcan"
    );
    this.dirtSprite = this.add.sprite(0.23 * WIDTH, 0.75 * HEIGHT, "pp_dirt");
    this.dogSprite = this.add.sprite(0.28 * WIDTH, 0.64 * HEIGHT, "pp_dog");
    this.wetlandsSprite = this.add.sprite(
      0.2 * WIDTH,
      0.48 * HEIGHT,
      "pp_wetlands"
    );
    this.wetlandsSprite.anchor.setTo(0.5, 0.5);
    this.wetlandsSprite.visible = false;

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox1.scale.setTo(-1.0, -1.0);
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[0],
      TextStyle.centered
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

    this.speechText2 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[1],
      TextStyle.centered
    );
    this.speechText2.anchor.setTo(0.5, 0.5);
    this.speechText2.lineSpacing = TextStyle.lineSpacing;
    this.speechText2.visible = false;
    this.speechText2.resolution = 2;

    this.speechText3 = this.add.text(
      0.82 * WIDTH,
      0.58 * HEIGHT,
      TextData.ppIntro[2],
      TextStyle.centered
    );
    this.speechText3.anchor.setTo(0.5, 0.5);
    this.speechText3.lineSpacing = TextStyle.lineSpacing;
    this.speechText3.visible = false;
    this.speechText3.resolution = 2;

    // Buttons
    this.nextButton = this.add.button(
      0.5 * WIDTH,
      0.2 * HEIGHT,
      "button_play",
      this.nextButtonActions.onClick,
      this,
      0,
      0,
      1
    );
    this.nextButton.anchor.setTo(0.5, 0.5);
    this.nextButton.visible = false;
    this.add
      .tween(this.nextButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute button
    createMuteButton(this);

      // Pause Button
      var onPause = function () {
          AudioManager.playSound("bloop_sfx", this);
          lastState = this.state.current;
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

      // control button
      var onQuestion = function () {
          AudioManager.playSound("bloop_sfx", this);

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;
          this.state.start("StartState");
      };

      this.questionButton = this.add.button(
          0.78 * WIDTH,     // move left/right
          0.02 * HEIGHT,    // move up/down
          "button_question",
          onQuestion,
          this
      );
      this.questionButton.scale.setTo(0.75);

    // Start Animation
    this.nextDelay = 1000;
    this.animationSpeed = 500;

    this.add
      .tween(this.speechText1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.add
      .tween(this.speechBox1.scale)
      .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
    this.time.events.add(
      this.nextDelay,
      function () {
        this.nextButton.visible = true;
      },
      this
    );

    // Keyboard spacebar to continue
    this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(function(){
        if (this.nextButton && this.nextButton.visible && this.nextButtonActions && this.nextButtonActions.onClick) {
          this.nextButtonActions.onClick.call(this);
        }
      }, this);

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

      if (ppIntroSubSceneIndex > 0) {
          console.log("Restoring PPIntroState to subSceneIndex:", ppIntroSubSceneIndex);
          for (var i = 0; i < ppIntroSubSceneIndex; i++) {
              this.nextSubScene(true);
          }
      }

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
          console.log("/ pressed in PPIntroState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;

          this.state.start("StartState");

          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }
  },
  nextSubScene: function (restoreMode) {
      restoreMode = !!restoreMode;

    // Before changing subscene
    switch (this.subSceneIndex) {
      case 0:
        this.professorSprite1.visible = false;
        this.speechText1.visible = false;
        this.trashcanSprite.visible = false;
        this.dirtSprite.visible = false;
        this.dogSprite.visible = false;

        this.nextButton.visible = false;
        break;
      case 1:
        this.professorSprite2.visible = false;
        this.speechText2.visible = false;

        this.nextButton.visible = false;
        break;
      case 2:
        this.professorSprite3.visible = false;
        this.speechText3.visible = false;

        this.nextButton.visible = false;
        break;
    }

    // Increment subscene
    this.subSceneIndex++;
      if (!restoreMode) {
          ppIntroSubSceneIndex = this.subSceneIndex;
      }

      // After changing subscene
    switch (this.subSceneIndex) {
      case 1:
        this.professorSprite2.visible = true;
        this.speechText2.visible = true;
        this.wetlandsSprite.visible = true;

          if (!restoreMode) {
              this.add
                  .tween(this.speechText2.scale)
                  .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
              this.add
                  .tween(this.speechBox1.scale)
                  .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
              this.add
                  .tween(this.wetlandsSprite.scale)
                  .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

              this.time.events.add(
                  this.nextDelay,
                  function () {
                      this.nextButton.visible = true;
                  },
                  this
              );
          } else {
              this.nextButton.visible = true;
          }
          break;

        case 2:
            this.professorSprite3.visible = true;
            this.speechText3.visible = true;

            if (!restoreMode) {
                this.add
                    .tween(this.speechText3.scale)
                    .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);
                this.add
                    .tween(this.speechBox1.scale)
                    .from({ x: 0.0, y: 0.0 }, this.animationSpeed, "Elastic", true);

                this.time.events.add(
                    this.nextDelay,
                    function () {
                        this.nextButton.visible = true;
                    },
                    this
                );
            } else {
                this.nextButton.visible = true;
            }
            break;

        case 3:
            ppIntroSubSceneIndex = 0;
            this.state.start("PPLevelSelectState");
            break;
    }
  },
  nextButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.nextSubScene(false);
    },
  },
};
