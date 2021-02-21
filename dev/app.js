(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory();
	else
		root["app"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/coin/Coin.js":
/*!**************************!*\
  !*** ./src/coin/Coin.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Class
/* harmony export */ });
class Class extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x + 16, y - 16);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.allowGravity = false;
    this.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('coinSprites', {
        start: 1,
        end: 4,
        prefix: 'idle-'
      }),
      frameRate: 10,
      repeat: -1
    });
    this.play('idle', true);
  }

  OnHit() {
    this.scene.increaseScore();
    this.scene.destroyObject(this);
  }

}

/***/ }),

/***/ "./src/enemy/ShyGuy/ShyGuy.js":
/*!************************************!*\
  !*** ./src/enemy/ShyGuy/ShyGuy.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ ShyGuy
/* harmony export */ });
class ShyGuy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x + 16, y - 16);
    this.scene = scene;
    this.movementRange = 200;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.allowGravity = false;
    this.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('shyGuySprites', {
        start: 1,
        end: 4,
        prefix: 'idle-'
      }),
      frameRate: 10,
      repeat: -1
    });
    this.play('idle', true);
    this.direction = 1; // Sentido en el que va el enemigo. 1 = Arriba, -1 = Abajo

    this.a = this.y;
    this.b = this.y + this.movementRange;
  }

  update(time, delta) {
    if (this.direction === 1 && this.y > this.b || this.direction === -1 && this.y < this.a) {
      this.direction *= -1;
    }

    this.setVelocityY(this.direction * 2 * delta);
  }

  OnHit() {
    if (this.body.touching.up) {
      this.scene.player.jump(this.scene.delta);
      this.scene.increaseScore();
      this.scene.destroyObject(this);
    } else {
      this.scene.onPlayerDied();
    }
  }

}

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _scenes_Boot_Boot__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./scenes/Boot/Boot */ "./src/scenes/Boot/Boot.js");
/* harmony import */ var _scenes_Start_Start__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scenes/Start/Start */ "./src/scenes/Start/Start.js");
/* harmony import */ var _scenes_Level1_Level1__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scenes/Level1/Level1 */ "./src/scenes/Level1/Level1.js");
/* harmony import */ var _scenes_Pause_Pause__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scenes/Pause/Pause */ "./src/scenes/Pause/Pause.js");




const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  pixelArt: true,
  parent: 'canvas',
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 300
      },
      debug: true
    }
  },
  scene: [_scenes_Boot_Boot__WEBPACK_IMPORTED_MODULE_0__.default, _scenes_Start_Start__WEBPACK_IMPORTED_MODULE_1__.default, _scenes_Level1_Level1__WEBPACK_IMPORTED_MODULE_2__.default, _scenes_Pause_Pause__WEBPACK_IMPORTED_MODULE_3__.default]
}; // eslint-disable-next-line no-new

new Phaser.Game(config);

/***/ }),

/***/ "./src/player/Player.js":
/*!******************************!*\
  !*** ./src/player/Player.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Player
/* harmony export */ });
class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player');
    this.scene = scene;
    this.jumpSound = this.scene.sound.add('jump');
    this.isJumping = false;
    this.isJumpingUp = false;
    this.isJumpingDown = false;
    this.isDoubleJumping = false;
    this.doubleJumpingAllowed = false;
    this.doubleJumpTime = 0.9; // Segundos que se puede mantener el doble salto

    this.doubleJumpingAutoTime = 0.6; // Segundos para realizar el doble salto si se mantiene el espacio al saltar

    this.doubleJumpingTimeout = null;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.cursor = this.scene.input.keyboard.createCursorKeys();
    this.body.setSize(this.width * 0.3, this.height * 0.75);
    this.body.setOffset((this.width - this.body.width) * 0.5, this.height * 0.25);
    this.scene.physics.add.collider(this, this.scene.layer);
    this.scene.physics.add.collider(this, this.scene.seaLayer, this.die, null, this);
    this.scene.physics.add.collider(this, this.scene.goalLayer, this.win, null, this);
    this.anims.create({
      key: 'walk',
      frames: this.scene.anims.generateFrameNames('playerSprites', {
        start: 1,
        end: 10,
        prefix: 'walk-'
      }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.scene.anims.generateFrameNames('playerSprites', {
        start: 1,
        end: 3,
        prefix: 'idle-'
      }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'jump-up',
      frames: this.scene.anims.generateFrameNames('playerSprites', {
        start: 1,
        end: 2,
        prefix: 'jump-'
      }),
      frameRate: 2,
      repeat: 1
    });
    this.anims.create({
      key: 'jump-down',
      frames: this.scene.anims.generateFrameNames('playerSprites', {
        start: 3,
        end: 3,
        prefix: 'jump-'
      }),
      frameRate: 2,
      repeat: 1
    });
    this.anims.create({
      key: 'double-jump',
      frames: this.scene.anims.generateFrameNames('playerSprites', {
        start: 1,
        end: 3,
        prefix: 'double-jump-'
      }),
      frameRate: 20,
      repeat: -1
    });
  }

  update(time, delta) {
    if (this.cursor.left.isDown) {
      this.setVelocityX(-10 * delta);
      this.setFlipX(true);
    } else if (this.cursor.right.isDown) {
      this.setVelocityX(10 * delta);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    if (this.body.onFloor()) {
      this.isJumping = false;
      this.isJumpingUp = false;
      this.isJumpingDown = false;

      if (this.doubleJumpingTimeout) {
        clearTimeout(this.doubleJumpingTimeout);
        this.doubleJumpStopped();
      }
    }

    if (this.cursor.space.isDown && this.body.onFloor()) {
      this.isJumping = true;
      this.jump(delta);
      setTimeout(() => {
        this.doubleJumpingAllowed = true;
      }, this.doubleJumpingAutoTime * 1000);
    }

    if (this.isJumping) {
      this.handleJump();
    } else if (this.body.velocity.x !== 0) {
      this.play('walk', true);
    } else {
      this.play('idle', true);
    }
  }

  jump(delta) {
    this.setVelocityY(-15 * delta);
    this.jumpSound.play();
  }

  handleJump() {
    // Si se suelta el botón de salto mientras se está realizando doble salto, este termina
    if (this.isDoubleJumping && !this.cursor.space.isDown) {
      this.setAcceleration(0); // Si se ha quedado el timeout sin terminar lo paramos

      if (this.doubleJumpingTimeout) {
        clearTimeout(this.doubleJumpingTimeout);
      } // Paramos el doble salto


      this.doubleJumpStopped();
    }

    if (this.doubleJumpingAllowed && this.cursor.space.isDown) {
      // Si podemos hacer doble salto y se está apretando la tecla de salto
      //    aplicamos la fuerza del doble salto
      this.handleDoubleJump();
    } else if (!this.isJumpingUp && this.body.velocity.y < 0) {
      this.jumpUp();
    } else if (!this.isJumpingDown && this.body.velocity.y > 0) {
      this.jumpDown();
    }
  }

  handleDoubleJump() {
    if (this.isDoubleJumping) {
      // Aplicamos fuerza
      this.scene.physics.accelerateTo(this, this.body.position.x, this.body.position.y, 400, 200, 200);
    } else {
      // Hacemos animación si es la primera vez
      this.play('double-jump', true);
      this.isDoubleJumping = true;
      this.isJumpingUp = false;
      this.isJumpingDown = false;

      if (this.doubleJumpingTimeout) {
        clearTimeout(this.doubleJumpingTimeout);
      } // Ponemos countdown para deshabilitar el doble salto


      this.doubleJumpingTimeout = setTimeout(() => {
        this.doubleJumpStopped();
      }, this.doubleJumpTime * 1000); // No se debe poner delta, es tiempo de JS
    }
  }

  doubleJumpStopped() {
    this.doubleJumpingAllowed = false;
    this.isDoubleJumping = false;
    this.setAcceleration(0);
  }

  jumpUp() {
    if (this.isJumpingDown) {
      // Si mientras salta vuelve a ir hacia arriba (pisar enemigo por ejemplo), habilitamos doble salto de nuevo
      this.doubleJumpingAllowed = true;
    }

    this.play('jump-up', true);
    this.isJumpingUp = true;
    this.isJumpingDown = false;
  }

  jumpDown() {
    this.play('jump-down', true);
    this.isJumpingDown = true;
    this.isJumpingUp = false;
  }

  die() {
    // llamar al PlayerDied de la escena
    this.scene.onPlayerDied();
  }

  win() {
    this.scene.onPlayerWin();
  }

}

/***/ }),

/***/ "./src/powerup/mushroom/Mushroom.js":
/*!******************************************!*\
  !*** ./src/powerup/mushroom/Mushroom.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Mushroom
/* harmony export */ });
class Mushroom extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x + 16, y - 16, 'tilesSprites', 114);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.allowGravity = false;
  }

  OnHit() {
    this.scene.powerupSound.play();
    this.scene.destroyObject(this);
  }

}

/***/ }),

/***/ "./src/scenes/Boot/Boot.js":
/*!*********************************!*\
  !*** ./src/scenes/Boot/Boot.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Boot
/* harmony export */ });
class Boot extends Phaser.Scene {
  constructor() {
    super({
      key: 'Boot'
    });
    this.canPLay = false;
  }

  preload() {
    const progress = this.add.graphics();
    this.load.on('progress', value => {
      progress.clear();
      progress.fillStyle(0xffffff, 1);
      progress.fillRect(0, this.sys.game.config.height / 2, this.sys.game.config.width * value, 60);
    });
    this.load.on('complete', () => {
      progress.destroy();
      this.add.bitmapText(16 * 8 + 4, 8 * 16, 'font', 'PRESS X TO POWER ON', 8);
      this.canPLay = true;
    });
    this.input.on('pointerdown', () => {
      if (this.canPLay) {
        this.sound.add('bootMusic').play();
        setTimeout(() => {
          this.scene.start('Start');
        }, 1000);
      }
    }); // LOAD

    this.load.audio('bootMusic', 'src/scenes/Boot/music.mp3');
    this.load.audio('startMusic', 'src/scenes/Start/music.mp3');
    this.load.audio('playMusic', 'src/scenes/Start/play.mp3');
    this.load.audio('level1Music', 'src/scenes/Level1/music.mp3');
    this.load.audio('gameoverMusic', 'src/scenes/Start/gameover.mp3');
    this.load.audio('winMusic', 'src/scenes/Start/win.mp3');
    this.load.audio('jump', 'src/player/jump.mp3');
    this.load.audio('powerup', 'src/powerup/powerup.wav');
    this.load.audio('coin', 'src/coin/coin.wav');
    this.load.image('startBackground', 'src/scenes/Start/background.jpg');
    this.load.image('tiles', 'src/scenes/Level1/background/tileset.png');
    this.load.spritesheet('tilesSprites', 'src/scenes/Level1/background/tileset.png', {
      frameWidth: 32,
      frameHeight: 32
    });
    this.load.tilemapTiledJSON('map', 'src/scenes/Level1/background/config.json');
    this.load.image('level1Background', 'src/scenes/Level1/background/sky.png');
    this.load.bitmapFont('font', 'src/scenes/font.png', 'src/scenes/font.fnt');
    this.load.image('player', 'src/player/animation/main.png');
    this.load.atlas('playerSprites', 'src/player/animation/spritesheet.png', 'src/player/animation/config.json');
    this.load.atlas('coinSprites', 'src/coin/animation/spritesheet.png', 'src/coin/animation/config.json');
    this.load.atlas('shyGuySprites', 'src/enemy/ShyGuy/spritesheet.png', 'src/enemy/ShyGuy/config.json');
  }

}

/***/ }),

/***/ "./src/scenes/Level1/Level1.js":
/*!*************************************!*\
  !*** ./src/scenes/Level1/Level1.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Level1
/* harmony export */ });
/* harmony import */ var _player_Player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../player/Player */ "./src/player/Player.js");
/* harmony import */ var _powerup_mushroom_Mushroom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../powerup/mushroom/Mushroom */ "./src/powerup/mushroom/Mushroom.js");
/* harmony import */ var _coin_Coin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../coin/Coin */ "./src/coin/Coin.js");
/* harmony import */ var _enemy_ShyGuy_ShyGuy__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../enemy/ShyGuy/ShyGuy */ "./src/enemy/ShyGuy/ShyGuy.js");




class Level1 extends Phaser.Scene {
  constructor() {
    super({
      key: 'Level1'
    });
    this.updateObjects = []; // Objetos que tienen un update()

    this.delta = 0;
  }

  preload() {
    // this.load.scenePlugin({
    //     key: 'animatedTiles',
    //     url: 'node_modules/phaser-animated-tiles/dist/AnimatedTiles.min',
    // });
    this.music = this.sound.add('level1Music', {
      loop: true
    });
    this.powerupSound = this.sound.add('powerup');
    this.coinSound = this.sound.add('coin');
  }

  create() {
    this.music.play();
    this.loadBackground();
    this.loadMap();
    this.player = new _player_Player__WEBPACK_IMPORTED_MODULE_0__.default(this, 50, 100);
    this.updateObjects.push(this.player);
    this.loadPhysics();
    this.loadUI();
    this.loadItem('Coin', _coin_Coin__WEBPACK_IMPORTED_MODULE_2__.default);
    this.loadItem('PowerUp', _powerup_mushroom_Mushroom__WEBPACK_IMPORTED_MODULE_1__.default);
    this.loadItem('ShyGuy', _enemy_ShyGuy_ShyGuy__WEBPACK_IMPORTED_MODULE_3__.default);
  }

  update(time, delta) {
    this.delta = delta; // Al revés para poder borrar elementos

    for (let i = this.updateObjects.length - 1; i >= 0; i--) {
      try {
        this.updateObjects[i].update(time, delta);
      } catch (e) {
        this.updateObjects.splice(i, 1);
      }
    }

    if (this.pauseKey.isDown) {
      this.pauseGame();
    }
  } ///


  loadBackground() {
    this.add.tileSprite(0, 0, this.cameras.main.width * 2, this.cameras.main.height * 2, 'level1Background').setScrollFactor(0);
  }

  loadMap() {
    this.map = this.make.tilemap({
      key: 'map'
    });
    this.map.createLayer('Background', this.map.addTilesetImage('Plataformas', 'tiles'), 0, 0);
    this.layer = this.map.createLayer('Floor', this.map.addTilesetImage('Plataformas', 'tiles'), 0, 0); // Habilitar colisión para Floor

    this.layer.setCollisionByExclusion(-1, true); // capa para detectar el mar

    this.seaLayer = this.map.createLayer('Sea', this.map.addTilesetImage('Plataformas', 'tiles'), 0, 0); // Habilitar colisión para Sea

    this.seaLayer.setCollisionByExclusion(-1, true);
    this.seaLayer.setVisible(false); // capa para detectar la meta(Goal)

    this.goalLayer = this.map.createLayer('Goal', this.map.addTilesetImage('Plataformas', 'tiles'), 0, 0); // Habilitar colisión para Goal

    this.goalLayer.setCollisionByExclusion(-1, true);
    this.goalLayer.setVisible(false);
  }

  loadPhysics() {
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels - 1);
    this.cameras.main.startFollow(this.player, false, 1, 0, 0, -500);
  }

  loadUI() {
    // Fondo negro de la parte superior
    this.add.graphics().fillStyle(0x000000).fillRect(0, 0, this.sys.game.config.width, 16).setScrollFactor(0); // Puntuación

    this.score = 0;
    this.scoreText = this.add.bitmapText(8, 8, 'font', `SCORE: ${this.score}`);
    this.scoreText.setScrollFactor(0); // Pause text

    this.pauseText = this.add.bitmapText(660, 8, 'font', 'PRESS ESC to PAUSE');
    this.pauseText.setScrollFactor(0);
    this.pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  loadItem(layer, Class) {
    this.map.getObjectLayer(layer).objects.forEach(item => {
      const instance = new Class(this, item.x, item.y);
      this.updateObjects.push(instance);
      this.physics.add.overlap(instance, this.player, instance.OnHit, null, instance);
    });
  }

  increaseScore() {
    this.score++;
    this.updateScore();
    this.coinSound.play();
  }

  updateScore() {
    this.scoreText.setText(`SCORE: ${this.score}`);
  }

  destroyObject(object) {
    for (let i = 0; i < this.updateObjects.length; i++) {
      if (this.updateObjects[i] === object) {
        this.updateObjects.splice(i, 1);
      }
    }

    object.destroy();
  }

  onPlayerDied() {
    this.music.stop();
    this.scene.start('Start', {
      gameover: true
    });
  }

  onPlayerWin() {
    this.music.stop();
    this.scene.start('Start', {
      win: true
    });
  }

  pauseGame() {
    this.scene.pause();
    this.scene.launch('Pause');
  }

}

/***/ }),

/***/ "./src/scenes/Pause/Pause.js":
/*!***********************************!*\
  !*** ./src/scenes/Pause/Pause.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Pause
/* harmony export */ });
class Pause extends Phaser.Scene {
  constructor() {
    super({
      key: 'Pause'
    });
  }

  preload() {}

  create() {
    this.add.image(0, 0, 'startBackground').setOrigin(0, 0);
    this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, this.sys.game.config.height / 2 - 20, this.sys.game.config.width, 50);
    this.pressX = this.add.bitmapText(this.sys.game.config.width / 2 - 140, this.sys.game.config.height / 2, 'font', 'PAUSED - PRESS ESC TO RESUME', 10);
    this.resumeKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update() {
    if (this.resumeKey.isDown) {
      this.resumeGame();
    }
  }

  resumeGame() {
    this.scene.resume('Level1');
    this.scene.stop('Pause');
  }

}

/***/ }),

/***/ "./src/scenes/Start/Start.js":
/*!***********************************!*\
  !*** ./src/scenes/Start/Start.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => /* binding */ Start
/* harmony export */ });
class Start extends Phaser.Scene {
  constructor() {
    super({
      key: 'Start'
    });
  }

  init(data) {
    this.DEVELOPMENT = true;
    this.gameover = data.gameover;
    this.win = data.win;
  }

  preload() {
    this.music = this.sound.add(`${this.gameover ? 'gameover' : this.win ? 'win' : 'start'}Music`);
    this.playMusic = this.sound.add('playMusic');
  }

  create() {
    if (this.DEVELOPMENT) {
      this.startGame();
    } else {
      this.add.image(0, 0, 'startBackground').setOrigin(0, 0);
      this.music.play();
      this.add.graphics().fillStyle(0x000000, 0.5).fillRect(0, this.sys.game.config.height / 2 - 20, this.sys.game.config.width, 50);
      let width = 75;
      let text = 'PRESS X TO PLAY';

      if (this.gameover) {
        width = 140;
        text = 'GAME OVER - PRESS X TO TRY AGAIN!';
      } else if (this.win) {
        width = 130;
        text = 'YOU WIN - PRESS X TO REPLAY!';
      }

      this.pressX = this.add.bitmapText(this.sys.game.config.width / 2 - width, this.sys.game.config.height / 2, 'font', text, 10);
      this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
      this.input.on('pointerdown', () => {
        this.startGame();
      });
    }
  }

  update() {
    if (this.startKey.isDown) {
      this.startGame();
    }
  }

  startGame() {
    if (this.DEVELOPMENT) {
      this.scene.start('Level1');
    } else {
      this.music.stop();
      this.playMusic.play();
      setTimeout(() => this.scene.start('Level1'), 2000);
    }
  }

}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__("./src/main.js");
/******/ })()
;
});
//# sourceMappingURL=app.js.map