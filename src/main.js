let config = {
      type: Phaser.AUTO,
      width: 400, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
      height: 225,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 4
      },
      physics: {
          default: 'arcade',
          arcade: {
                gravity: { y: 0 },
                debug: false
          }
      },
      scene: [ Menu ]
  }
  
  let game = new Phaser.Game(config);