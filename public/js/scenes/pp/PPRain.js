"use strict";

var PPRainState = {
  preload: function () {},
  create: function () {
    // Background
    this.backgroundSprite1 = this.add.sprite(0, 0, "background_1");
    this.backgroundSprite2 = this.add.sprite(0, 0, "background_1_1");

    // Clouds
    this.cloudSprite1 = this.add.sprite(
      -0.18 * WIDTH,
      0.02 * HEIGHT,
      "cloud_3"
    );
    this.add
      .tween(this.cloudSprite1)
      .to({ x: -0.02 * WIDTH }, 2000, "Sine", true);

    this.cloudSprite2 = this.add.sprite(0.88 * WIDTH, 0.18 * HEIGHT, "cloud_4");
    this.add
      .tween(this.cloudSprite2)
      .to({ x: 0.7 * WIDTH }, 2000, "Sine", true);

      //Start of gradient//////////////////////////////////////
      // Create bitmap data for gradient
      var gradientBmd = this.add.bitmapData(WIDTH, HEIGHT);
      var ctx = gradientBmd.ctx;

      // Vertical gradient: dark at top -> transparent at bottom
      var grd = ctx.createLinearGradient(0, 0, 0, HEIGHT);
      grd.addColorStop(0, 'rgba(0,0,50,0.5)');    // top: dark blue semi-transparent
      grd.addColorStop(1, 'rgba(0,0,0,0)');       // bottom: fully transparent

      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, WIDTH, HEIGHT);

      // Add gradient sprite to the scene
      this.gradientSprite = this.add.sprite(0, 0, gradientBmd);
      this.gradientSprite.alpha = 0; // start invisible for fade-in

      // Fade-in animation
      this.add.tween(this.gradientSprite).to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true);
      //end of gradient/////////////////////////////////////////

    // Misc.
    this.houseSprite = this.add.sprite(0.08 * WIDTH, 0.45 * HEIGHT, "pp_house");

    // Rain
    this.rainEmitter = this.add.emitter(0.5 * WIDTH, -0.5 * HEIGHT, 200);
    this.rainEmitter.width = 1.5 * WIDTH;
    this.rainEmitter.angle = 20;
    this.rainEmitter.makeParticles("pp_raindrop");
    this.rainEmitter.minParticleScale = 0.8;
    this.rainEmitter.maxParticleScale = 1.0;
    this.rainEmitter.setYSpeed(300, 500);
    this.rainEmitter.setXSpeed(-5, 5);
    this.rainEmitter.minRotation = this.rainEmitter.maxRotation = 0;
    this.rainEmitter.start(false, 1600, 5, 0);

    // Characters
    this.professorSprite1 = this.add.sprite(
      0.37 * WIDTH,
      0.4 * HEIGHT,
      "professor_2"
    );

    // Speech Boxes
    this.speechBox1 = this.add.sprite(
      0.8 * WIDTH,
      0.68 * HEIGHT,
      "speechbox_2"
    );
    this.speechBox1.scale.setTo(-1.0, -1.0);
    this.speechBox1.anchor.setTo(0.44, 0.5);

    // Speech Text
    this.speechText1 = this.add.text(
      0.8 * WIDTH,
      0.68 * HEIGHT,
      TextData.ppRain,
      TextStyle.centeredLarge
    );
    this.speechText1.anchor.setTo(0.5, 0.5);
    this.speechText1.lineSpacing = TextStyle.lineSpacing;
    this.speechText1.resolution = 2;

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
      LastState = "PPRainState";
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

    // Play sound
    AudioManager.playSound("rain_sfx", this);

    // Keyboard spacebar to continue to the next screen
    this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
      .onDown.add(function () {
        if (this.nextButton && this.nextButton.visible && this.nextButtonActions && this.nextButtonActions.onClick) {
          this.nextButtonActions.onClick.call(this);
        }
      }, this);

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

  update: function () {
      if (this.slashKey && !this.switching && this.slashKey.justDown) {
          this.switching = true;
          console.log("/ pressed in PPRainState");

          if (window.speechSynthesis) window.speechSynthesis.cancel();
          if (AudioManager && AudioManager.stopAll) AudioManager.stopAll();

          lastState = Game.state.current;

          this.state.start("StartState");

          this.time.events.add(Phaser.Timer.SECOND * 0.25, function () {
              this.switching = false;
          }, this);
      }
  },
  nextButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("PPResultState");
    },
  },
};
