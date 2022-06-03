class Credit extends Phaser.Scene {
    constructor() {
        super('creditScene');
    }


    create() {
        let CreditsConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            fontFamily:  'PressStart2P', 
            fontSize: '24px',
            backgroundColor: null,
            color: '#72A046',
            shadow: {
                offsetX: -5,
                offsetY: 3,
                color: '#FFFFFF',
                blur: 25,
                stroke: true,
                fill: true
            }, padding: {
                left: 50,
                right: 50,
                top: 50,
                bottom: 50,
            },
        }
        this.add.text(game.config.width/2 - 200, game.config.height/2 - 200, 'Meet the team!!',CreditsConfig).setOrigin(0.5);
        CreditsConfig.color = '#99AD95';
        CreditsConfig.fontSize = '16px';
        
        this.add.text(game.config.width/2 - 60 , game.config.height/2 - 170, 'Santiago Ponce ... Design, Production,',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 +210 , game.config.height/2 - 140, 'and Programming',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 20 , game.config.height/2 - 110, 'Hunter Hechtl ... Art, Animation, and Music',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 90.5 , game.config.height/2 - 50, 'Citlalli Hernandez ... Programming',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 +200 , game.config.height/2 - 20, 'and Sound Design',CreditsConfig).setOrigin(0.5);
        CreditsConfig.color = '#72A046';
        CreditsConfig.fontSize = '24px';
        this.add.text(game.config.width/2 - 115, game.config.height/2 +10, 'Additonal Attributions',CreditsConfig).setOrigin(0.5);
        CreditsConfig.color = '#99AD95';
        CreditsConfig.fontSize = '12px';
       
        this.add.text(game.config.width/2 - 35, game.config.height/2 +40, '• Font: "PressStart2P" courtesy of "CodeMan38" Boisclair',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 225, game.config.height/2 +60, ' Via Google Fonts',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 95, game.config.height/2 +80, '• SFX Software: "Bfxr" courtesy of "increpare"',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 +132.5, game.config.height/2 +100, ' aka Stephen Lavelle Via Bfxr.net',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 101.5, game.config.height/2 +120, '• Music Software: "SOUNDRAW" by SOUNDRAW inc.',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 + 242.5, game.config.height/2 +140, 'Via soundraw.io',CreditsConfig).setOrigin(0.5);
        this.add.text(game.config.width/2 - 22.5, game.config.height/2 +160, '• Game Software: "Phaser Raycaster" by wiserim Via Github ',CreditsConfig).setOrigin(0.5);
        keyJump = this.input.keyboard.addKey(PInteract);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyJump)) {
            this.scene.start('menuScene');    
        }
    }

}