class LevelSelect extends Phaser.Scene {
    constructor() {
        super('levelselectScene');
    }


    create() {
        this.add.text(game.config.width/2, game.config.height/2, 'Level Select').setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        let LevelSelectConfig = {
            fontFamily:  'Ariel', 
            fontSize: '16px',
            backgroundColor: null,
            color: '#FF994F'
      }
      this.tutA = this.add.text(game.config.width/4, game.config.height/4 , '• Tutorial A •', LevelSelectConfig);
      this.add.text(game.config.width/4 + 30 , game.config.height/4+20, 'screenshot', LevelSelectConfig);
      this.tutB = this.add.text((game.config.width*2.5)/4, game.config.height/4 , '• Tutorial B •', LevelSelectConfig);
      this.add.text((game.config.width*2.5)/4 + 30 , game.config.height/4+20, 'screenshot', LevelSelectConfig);
      this.climb = this.add.text(game.config.width/4, (game.config.height*2.5)/4 , '• Climb •', LevelSelectConfig);
      this.add.text(game.config.width/4 + 30 , (game.config.height*2.5)/4+20, 'screenshot', LevelSelectConfig);
      this.shipyard = this.add.text((game.config.width*2.5)/4, (game.config.height*2.5)/4 , '• Shipyard •', LevelSelectConfig);
      this.add.text((game.config.width*2.5)/4 + 30 , (game.config.height*2.5)/4+20, 'screenshot', LevelSelectConfig);
      
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}