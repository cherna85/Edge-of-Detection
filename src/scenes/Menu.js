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
            //this.load.image('spymanGreen'. 'assets/')
            this.load.atlas('green_atlas', 'Spyman-Sheet.png', 'spymanGreen.json');
            this.load.atlas('red_atlas', 'SpymanDisguise-Sheet', 'spymanRed.json');
            
        }

        create(){

            let MenuConfig = {
                  fontFamily:  'Ariel', 
                  fontSize: '16px',
                  backgroundColor: null,
                  color: '#FF994F'
            }
        
            
            
            
            //load data
            loadlevel = localStorage.getItem(localStorageName+'_loadlevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_loadlevel');
            furthestLevel = localStorage.getItem(localStorageName+'_furthestLevel') == null ? 0 :
                localStorage.getItem(localStorageName+'_furthestLevel');
            //loads users controls and sets them
            let controls  = localStorage.getItem(localStorageName+'_controls_Text') == null ? 0 :
                localStorage.getItem(localStorageName+'_controls_Text').split(',');
                console.log(controls);
            if(controls == 0){
                console.log(controls, "not saved ");
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
                console.log(controls);
                if(controls == 0){
                    console.log(controls,"not saved");
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
                
            
    
            //localStorage.removeItem(localStorageName+'_controls');
            //localStorage.removeItem(localStorageName+'_controls_Text');



            this.add.text(game.config.width/2, game.config.height/2 -96, 'Main Menu', MenuConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 -64, 'Press "' + PDisguiseT+ '" to Select, "'+ PInteractT + '" to go back', MenuConfig).setOrigin(0.5);
            

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
            this.playbutton = this.add.text(game.config.width/2, game.config.height/2 - 32 , 'New Game', MenuConfig).setOrigin(0.5);
            MenuConfig.color =  '#FF994F';
           
            if(loadlevel == 0){
                MenuConfig.color =  '#808080';
           }
            this.loadgamebutton = this.add.text(game.config.width/2, game.config.height/2, 'Load Game', MenuConfig).setOrigin(0.5); //not set up, will do when we save data
            MenuConfig.color =  '#FF994F';

            this.lsbutton = this.add.text(game.config.width/2, game.config.height/2 +32 , 'Level Select', MenuConfig).setOrigin(0.5);
            this.optionsbutton = this.add.text(game.config.width/2, game.config.height/2 +64 , 'Options', MenuConfig).setOrigin(0.5);
            this.creditsbutton = this.add.text(game.config.width/2, game.config.height/2 +96 , 'Credits', MenuConfig).setOrigin(0.5);
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
            current.setColor('#FF994F');
            sceneSelect = scene;
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
                this.sound.play('sfx_select');
                this.scene.start(sceneSelect);    
            }
        }
}