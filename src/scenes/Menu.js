class Menu extends Phaser.Scene {
        constructor(){
            super("menuScene");
        }

        preload(){
                //load audio
            this.load.audio('sfx_select', './assets/sfx/Blip_Select.wav');
            this.load.audio('sfx_disguise', 'assets/sfx/Disguise_applied.wav');
            this.load.audio('sfx_finishedObjective', 'assets/sfx/Finished_objective.wav');
            this.load.audio('sfx_jump', 'assets/sfx/Jump2.wav');
            this.load.audio('sfx_discovered', 'assets/sfx/Player_discovered.wav');
            this.load.audio('sfx_fall', 'assets/sfx/Falling.wav');
            this.load.audio('sfx_inLOS', 'assets/sfx/inLOS.wav');
            this.load.audio('sfx_walking', 'assets/sfx/walking.wav');
            this.load.audio('sfx_walking2', 'assets/sfx/walking2.wav');
            this.load.audio('sfx_disguiseOff', 'assets/sfx/Disguise_Fall.wav');
            this.load.audio('sfx_Door', 'assets/sfx/DoorOpen.wav');
            
            this.load.atlas('green_atlas', './assets/Spyman-Sheet.png', './assets/spymanGreen.json');
            this.load.atlas('red_atlas', './assets/SpymanDisguise-Sheet.png', './assets/spymanRed.json');
            this.load.atlas('enemy_atlas', './assets/SpyEnemy-Sheet.png', './assets/spyEnemy.json');
        
        }

        create(){

            let MenuConfig = {
                //font from https://fonts.google.com/specimen/Press+Start+2P
                //https://www.1001fonts.com/sortelo-font.html
                fontFamily:  'PressStart2P', 
                fontSize: '38px',
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
               
                      
            
            //load data
            loadlevel = localStorage.getItem(localStorageName+'_loadlevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_loadlevel');
            furthestLevel = localStorage.getItem(localStorageName+'_furthestLevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_furthestLevel');
            //loads users controls and sets them
            let controls  = localStorage.getItem(localStorageName+'_controls_Text') == null ? 0 :
                localStorage.getItem(localStorageName+'_controls_Text').split(',');
            if(controls == 0){
                PLeftT = 'ArrowLeft';
                PRightT = 'ArrowRight';
                PUpT = 'ArrowUp';
                PDownT = 'ArrowDown';
                PDisguiseT = "z";
                PInteractT = 'x';
            }else{
               PLeftT = controls[0];
                PRightT = controls[1];
                PUpT = controls[2];
                PDownT = controls[3];
                PDisguiseT = controls[4];
                PInteractT = controls[5]; 
            }
            

            controls  = localStorage.getItem(localStorageName+'_controls') == null ? 0 :
                localStorage.getItem(localStorageName+'_controls').split(',');
                if(controls == 0){
                    PLeft = 37;
                    PRight = 39;
                    PUp = 38;
                    PDown = 40;
                    PDisguise = 90;
                    PInteract = 88;
                }else{
                    PLeft = parseInt(controls[0]);
                    PRight = parseInt(controls[1]);
                    PUp = parseInt(controls[2]);
                    PDown = parseInt(controls[3]);
                    PDisguise = parseInt(controls[4]);
                    PInteract = parseInt(controls[5]);
                }
                
        
            this.add.text(game.config.width/2, game.config.height/2 -96, 'Edge of Detection', MenuConfig).setOrigin(0.5);
            MenuConfig.fontSize =  '16px';
            MenuConfig.color =  '#99AD95';
            this.add.text(game.config.width/2, game.config.height/2 -32, 'Press [' + PDisguiseT+ '] to Select, ['+ PInteractT + '] to go back', MenuConfig).setOrigin(0.5);
            

             //setting up keys
             keyUp = this.input.keyboard.addKey(PUp);
             keyDown = this.input.keyboard.addKey(PDown);
             keyJump = this.input.keyboard.addKey(PDisguise);
             keyInteract = this.input.keyboard.addKey(PInteract);

            if(loadlevel == 'levelTutorialA'){
                loadlevel = 0;
            }

            //setting up "buttons" for scene selecting 
            MenuConfig.color =  '#FFFFFF';
            
            this.playbutton = this.add.text(game.config.width/2, game.config.height/2  , 'New Game', MenuConfig).setOrigin(0.5);
            MenuConfig.shadow.color = '#000000';
            MenuConfig.color =  '#99AD95';
           
            if(loadlevel == 0){
                MenuConfig.color =  '#808080';
           }
            this.loadgamebutton = this.add.text(game.config.width/2, game.config.height/2 +32, 'Load Game', MenuConfig).setOrigin(0.5); //not set up, will do when we save data
            MenuConfig.color =  '#99AD95';

            this.lsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Level Select', MenuConfig).setOrigin(0.5);
            this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Options', MenuConfig).setOrigin(0.5);
            this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +128 , 'Credits', MenuConfig).setOrigin(0.5);
            sceneSelect = 'levelTutorialA'; //reinitalize menu


        }

        update(time, delta){
           if(loadlevel ==0){
                this.menuWithoutSave();
           }else{
               this.menuWithSave();
           }                  
        }

        updateMenu(current, next, scene){
            next.setColor('#FFFFFF');
            next.setShadowColor('#FFFFFF');
            current.setColor('#99AD95');
            current.setShadowColor('#000000');
            sceneSelect = scene;
            this.sound.play('sfx_select');
        }
        menuWithSave(){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.loadgamebutton, loadlevel);
                }
                else if(sceneSelect == loadlevel){
                    this.updateMenu(this.loadgamebutton, this.lsbutton, 'levelselectScene');
                }  
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.optionsbutton, 'optionsScene');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.playbutton, "levelTutorialA");
                }
                }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
                }
                else if(sceneSelect == loadlevel){
                    this.updateMenu(this.loadgamebutton, this.playbutton, 'levelTutorialA' );
                }  
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.loadgamebutton, loadlevel);
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.lsbutton, "levelselectScene");
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.optionsbutton, "optionsScene");
                }
            }
            this.Select();

        } 
        menuWithoutSave(){
            if (Phaser.Input.Keyboard.JustDown(keyDown)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.lsbutton, 'levelselectScene');
                }
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.optionsbutton, 'optionsScene');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.creditsbutton, 'creditScene');
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.playbutton, "levelTutorialA");
                }
                }
            if (Phaser.Input.Keyboard.JustDown(keyUp)) {
                if(sceneSelect == 'levelTutorialA'){
                    this.updateMenu(this.playbutton,this.creditsbutton, 'creditScene');
                }
                else if(sceneSelect == 'levelselectScene'){
                    this.updateMenu(this.lsbutton, this.playbutton, 'levelTutorialA');
                }  
                else if(sceneSelect == "optionsScene"){
                    this.updateMenu(this.optionsbutton, this.lsbutton, "levelselectScene");
                }
                else if (sceneSelect == "creditScene"){
                    this.updateMenu(this.creditsbutton, this.optionsbutton, "optionsScene");
                }
            }
            this.Select();
        }
        Select(){
            //selects the scene 
            if (Phaser.Input.Keyboard.JustDown(keyJump)) { 
                this.sound.play('sfx_finishedObjective');
                this.scene.start(sceneSelect);    
            }
        }
}