"use strict";

var TitleState = {

  _a11yRoot: null,
  _live: null,
  _label: null,
  
  preload: function () {},
  create: function () {

    this.game.canvas.setAttribute('role', 'img');
    // this.game.canvas.setAttribute('aria-label', 'Game canvas region')
    
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
    var domButton = document.createElement('button');
    domButton.setAttribute('aria-label', 'Banana');
    domButton.setAttribute('tabindex', '0');
    domButton.style.position = 'absolute';
    domButton.style.left = (this.game.canvas.offsetLeft + (0.3 * WIDTH)) + 'px';
    domButton.style.top = (this.game.canvas.offsetTop + (0.68 * HEIGHT)) + 'px';
    domButton.style.width = '100px';
    domButton.style.height = '100px';
    domButton.style.transform = 'translate(-50%, -50%)';
    domButton.style.zIndex = 1000;
    domButton.style.pointerEvents = 'auto';
    domButton.style.background = 'transparent';
    domButton.style.border = 'none';
    domButton.addEventListener('click', this.playButtonActions.onClick.bind(this))
    this.game.canvas.parentNode.appendChild(domButton);
    
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
    this.playButton.anchor.setTo(0.5, 0.5);
    this.add
      .tween(this.playButton.scale)
      .to({ x: 1.1, y: 1.1 }, 600, "Linear", true)
      .yoyo(true, 0)
      .loop(true);

    // Mute button
    createMuteButton(this);

    // Audio
    AudioManager.playSong("title_music", this);

    this.game.world.children.forEach(function(child) {
      if (child.inputEnabled) {
        console.log('Found an interactable: ', child.key, child.x, child.y, child.width, child.height);
      }
    });
  },
  update: function () {
    updateCloudSprites(this);
  },
  playButtonActions: {
    onClick: function () {
      AudioManager.playSound("bloop_sfx", this);
      this.state.start("IntroState");
    },
  },
};
