export default class Goomba extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x + 16, y - 16);

        this.scene = scene;

        this.movementRange = 192;

        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.allowGravity = false;

        this.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNames('goombaSprites', { start: 1, end: 2, prefix: 'walk-' }),
            frameRate: 2,
            repeat: -1,
        });
        this.play('walk', true);

        this.direction = 1; // Sentido en el que va el enemigo
        this.a = this.x;
        this.b = this.x + this.movementRange;
    }

    update(time, delta) {
        if (
            (this.direction === 1 && this.x > this.b) || (this.direction === -1 && this.x < this.a)
        ) {
            this.direction *= -1;
        }
        this.setVelocityX(this.direction * 2 * delta);
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