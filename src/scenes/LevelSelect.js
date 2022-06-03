class LevelSelect extends Phaser.Scene {
    constructor() {
        super('levelselectScene');
    }
    preload(){
        this.load.image('TutA' , 'assets/gameScreenShots/Level1.png');
        this.load.image('TutB' , 'assets/gameScreenShots/Level2.png');
        this.load.image('Climb' , 'assets/gameScreenShots/LevelClimb.png');
    }

    create() {
        keyJump = this.input.keyboard.addKey(PDisguise);
        keyDisguise = this.input.keyboard.addKey(PInteract);
        keyUp = this.input.keyboard.addKey(PUp);
        keyDown = this.input.keyboard.addKey(PDown);

        let LevelSelectConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
            fontFamily:  'PressStart2P', 
            fontSize: '16px',
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
        LevelSelectConfig.color = '#FFFFFF';
        this.tutA = this.add.text((game.config.width)/10, game.config.height/10 , '• Tutorial A •', LevelSelectConfig);
        LevelSelectConfig.color = '#72A046';
        LevelSelectConfig.shadow.color = '#000000';
        this.add.tileSprite((game.config.width*2.75)/10 + 30 , (game.config.height*3.75)/10+20, 1561,889, 'TutA',).setScale(0.15);
        LevelSelectConfig.color = '#72A046';
        if(furthestLevel < 2){
            LevelSelectConfig.color =  '#808080';
        }else{
            this.add.tileSprite((game.config.width*2.75)/10 + 30 , (game.config.height*7.75)/10+20, 1588,885,  'TutB').setScale(0.15);
        }
        this.tutB = this.add.text(game.config.width/10, (game.config.height*5)/10 , '• Tutorial B •', LevelSelectConfig);
        
       
        if(furthestLevel < 3){
            LevelSelectConfig.color =  '#808080';
        }else{ 
          this.add.tileSprite((game.config.width*6.75)/10 + 30 , (game.config.height*3.75)/10+20, 1593,890,'Climb').setScale(0.15);  
        }
        this.climb = this.add.text((game.config.width*5.75)/10, game.config.height/10 , '• Climb •', LevelSelectConfig);
        
        
        /*
        if(furthestLevel < 4){
            LevelSelectConfig.color =  '#808080';
        }
        this.shipyard = this.add.text((game.config.width*5)/10, (game.config.height*5)/10 , '• Shipyard •', LevelSelectConfig);
        this.add.text((game.config.width*5)/10 + 30 , (game.config.height*5)/10+20, 'screenshot', LevelSelectConfig);*/
        sceneSelect = 'levelTutorialA'; //reinitalize menu
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyDisguise)) {
            this.scene.start('menuScene');  
            this.sound.play('sfx_fall');  
        }
        if (Phaser.Input.Keyboard.JustDown(keyDown)) {
            if(sceneSelect == 'levelTutorialA'){
                this.updateMenu(this.tutA,this.tutB, 'levelTutorialB');
            }else if(sceneSelect == 'levelTutorialB'){
                this.updateMenu(this.tutB,this.climb, 'levelClimb');
            }else if(sceneSelect == 'levelClimb'){
                this.updateMenu(this.climb,this.tutA, 'levelTutorialA');
            }//else if (sceneSelect == 'levelShipyard'){
                //this.updateMenu(this.shipyard, this.tutA, 'levelTutorialA');
            //}
        }
        if (Phaser.Input.Keyboard.JustDown(keyUp)) {
            if(sceneSelect == 'levelTutorialA'){
                this.updateMenu(this.tutA,this.climb, 'levelClimb');
            }else if(sceneSelect == 'levelTutorialB'){
                this.updateMenu(this.tutB,this.tutA, 'levelTutorialA');
            }else if(sceneSelect == 'levelClimb'){
                this.updateMenu(this.climb,this.tutB, 'levelTutorialB');
            }//else if (sceneSelect == 'levelShipyard'){
                //this.updateMenu(this.shipyard, this.climb, 'levelClimb');
            //}
        }
        this.Select();
    }
    updateMenu(current, next, scene){
        next.setColor('#FFFFFF');
        next.setShadowColor('#FFFFFF');
        current.setShadowColor('#000000');
        this.sound.play('sfx_select');
        if((sceneSelect == 'levelTutorialA' && furthestLevel <= 1 )|| (sceneSelect == 'levelTutorialB' && furthestLevel  < 2) 
            || (sceneSelect == 'levelClimb' && furthestLevel < 3) || (sceneSelect == 'levelShipyard' && furthestLevel < 4)){
                current.setColor('#808080');
        }else{
            current.setColor('#72A046');
        }
        sceneSelect = scene;
    }
    Select(){
        //selects the scene 
        if (Phaser.Input.Keyboard.JustDown(keyJump)) { 
            if((sceneSelect == 'levelTutorialA' && furthestLevel <= 1 )|| (sceneSelect == 'levelTutorialB' && furthestLevel  < 2) 
            || (sceneSelect == 'levelClimb' && furthestLevel < 3) || (sceneSelect == 'levelShipyard' && furthestLevel < 4)){
                console.log('not allowed');
                this.sound.play('sfx_discovered');
            }else{
                this.sound.play('sfx_finishedObjective');
                this.scene.start(sceneSelect);    
            }   
        }
    }

}