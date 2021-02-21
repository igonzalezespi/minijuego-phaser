export default class Player extends Phaser.Physics.Arcade.Sprite {
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

        this.doubleJumpForce = 400;
        this.doubleJumpMax = 220;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        this.cursor = this.scene.input.keyboard.createCursorKeys();
        this.body.setSize(this.width * 0.65, this.height * 0.75);
        this.body.setOffset((this.width - this.body.width) * 0.5, this.height * 0.25);
        this.scene.physics.add.collider(this, this.scene.layer);
        this.scene.physics.add.collider(this, this.scene.seaLayer, this.die, null, this);
        this.scene.physics.add.collider(this, this.scene.goalLayer, this.win, null, this);

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('playerSprites', { start: 1, end: 10, prefix: 'walk-' }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.create({
            key: 'idle',
            frames: this.scene.anims.generateFrameNames('playerSprites', { start: 1, end: 3, prefix: 'idle-' }),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'jump-up',
            frames: this.scene.anims.generateFrameNames('playerSprites', { start: 1, end: 2, prefix: 'jump-' }),
            frameRate: 2,
            repeat: 1,
        });

        this.anims.create({
            key: 'jump-down',
            frames: this.scene.anims.generateFrameNames('playerSprites', { start: 3, end: 3, prefix: 'jump-' }),
            frameRate: 2,
            repeat: 1,
        });

        this.anims.create({
            key: 'double-jump',
            frames: this.scene.anims.generateFrameNames('playerSprites', { start: 1, end: 3, prefix: 'double-jump-' }),
            frameRate: 20,
            repeat: -1,
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
            setTimeout(() => { this.doubleJumpingAllowed = true; }, this.doubleJumpingAutoTime * 1000);
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
            this.setAcceleration(0);
            // Si se ha quedado el timeout sin terminar lo paramos
            if (this.doubleJumpingTimeout) { clearTimeout(this.doubleJumpingTimeout); }
            // Paramos el doble salto
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
            this.scene.physics.accelerateTo(this, this.body.position.x, this.body.position.y, this.doubleJumpForce, this.doubleJumpMax, this.doubleJumpMax);
        } else {
            // Hacemos animación si es la primera vez
            this.play('double-jump', true);
            this.isDoubleJumping = true;
            this.isJumpingUp = false;
            this.isJumpingDown = false;
            if (this.doubleJumpingTimeout) { clearTimeout(this.doubleJumpingTimeout); }
            // Ponemos countdown para deshabilitar el doble salto
            this.doubleJumpingTimeout = setTimeout(() => { this.doubleJumpStopped(); }, this.doubleJumpTime * 1000); // No se debe poner delta, es tiempo de JS
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