"use strict";

var TitleState = {

  _a11yRoot: null,
  _live: null,
  _label: null,
  
  preload: function () {},
  create: function () {

    this.game.canvas.setAttribute('role', 'img');
    this.game.canvas.setAttribute('aria-hidden', 'true');
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

    // Mute button
    createMuteButton(this);

    // Audio
    AudioManager.playSong("title_music", this);

    // Dom Functionality
    this.domElements = new Array();
    var self = this;
    const startingTabIndex = 100
    this.game.world.children.forEach(function(child, i) {

      if (!(child instanceof Phaser.Button) && !(child instanceof Phaser.Text)) return;

      const n = i + startingTabIndex;
      var domElement = null;
      var label = (child.ariaLabel || child.key || `button-${n}`);
      
      if (child instanceof Phaser.Button) {
        console.log('Found interactable item', n, ': ', (child.ariaLabel || child.key || `button-${n}`), child.x, child.y, child.width, child.height);
        domElement = document.createElement('button');
        domElement.setAttribute('type', 'button');
        domElement.setAttribute('aria-label', label);
        
        domElement.addEventListener('click', function() {
          let pointer = null;
          if (self.game && self.game.input) {
            pointer = self.game.input.activePointer;
          }
          if (typeof child.callback === 'function') {
            child.callback.call(child.callbackContext || child, child, pointer, true);
          } else {
            child.onInputUp.dispatch(child, pointer, true);
          }
        });
      } else if (child instanceof Phaser.Text) {
        console.log('Found text item', n, ': ', (child.ariaLabel || child.key || `button-${n}`), child.x, child.y, child.width, child.height);
        domElement = document.createElement('p');
        domElement.setAttribute('aria-label', String(child.text) || '')
      }

      if (!domElement) return;
      

      // Things to do to both Buttons and Text
      domElement.setAttribute('tabindex', String(n));
      domElement.style.position = 'absolute';
      domElement.style.left = (self.game.canvas.offsetLeft + child.x) + 'px';
      domElement.style.top = (self.game.canvas.offsetTop + child.y) + 'px';
      domElement.style.width = child.width + 'px';
      domElement.style.height = child.height + 'px';
      domElement.style.zIndex = 1000;
      domElement.style.pointerEvents = 'auto';
      domElement.style.background = 'transparent';
      domElement.style.border = 'none';

      self.game.canvas.parentNode.appendChild(domElement);
      self.domElements.push(domElement);
    });

    

  },
  shutdown: function () {
    console.log("shutting down Title.js...");
    if (this.domElements) {
      this.domElements.forEach(function(element) {
        if (element.parentNode) element.parentNode.removeChild(element);
        element.replaceWith(element.cloneNode(true));
      });
      this.domElements = [];
    }
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
