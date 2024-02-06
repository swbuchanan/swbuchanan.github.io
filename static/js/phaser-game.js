// Import the Phaser library
// import Phaser from 'phaser';

// Phaser configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

// Create a Phaser game instance
const game = new Phaser.Game(config);

// Preload assets
function preload() {
  this.load.image('sky', '/phaser-game-assets/sky.png');
  this.load.image('ground', '/phaser-game-assets/platform.png');
  this.load.image('star', '/phaser-game-assets/star.png');
  this.load.spritesheet('dude', '/phaser-game-assets/dude.png', { frameWidth: 32, frameHeight: 48 });
}

// Create game elements
function create() {
  // Background
  this.add.image(400, 300, 'sky');

  // Platforms
  const platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, 'ground').setScale(2).refreshBody();

  // Player
  const player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // Player animations
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });
  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  // Physics
  this.physics.add.collider(player, platforms);

  // Cursor keys
  const cursors = this.input.keyboard.createCursorKeys();

  // Update function
  function update() {
    if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
    } else {
      player.setVelocityX(0);
      player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-330);
    }
  }

  // Set the update function for the scene
  this.update = update;
}

