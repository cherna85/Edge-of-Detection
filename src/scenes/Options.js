class Option extends Phaser.Scene {
    constructor() {
        super("optionsScene");
    }

    create() {
        let OptionsConfig = {
            //font from https://fonts.google.com/specimen/Press+Start+2P
            //https://www.1001fonts.com/sortelo-font.html
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
       
        this.add.text(game.config.width/7, game.config.height/9, 'OPTIONS', OptionsConfig).setOrigin(0.5);
        
        OptionsConfig.fontSize = '16px';
        this.warning = this.add.text(-100, (game.config.height*10)/9 ,"Key Conflict: Retry", OptionsConfig).setOrigin(0.5);
        OptionsConfig.shadow.color = '#000000';
        OptionsConfig.color =  '#99AD95';
        this.add.text((game.config.width/7)+20, (game.config.height*2)/9 , 'ADJUST CONTROLS:', OptionsConfig).setOrigin(0.5);
        OptionsConfig.color =  '#72A046';
        this.add.text(game.config.width/7, (game.config.height*3)/9 , 'Move Left', OptionsConfig).setOrigin(0.5);
        this.add.text(game.config.width/7, (game.config.height*4)/9 , 'Move Right', OptionsConfig).setOrigin(0.5);
        this.add.text(game.config.width/7, (game.config.height*5)/9 , 'Jump/Up', OptionsConfig).setOrigin(0.5);
        this.add.text(game.config.width/7, (game.config.height*6)/9 , 'Drop/Down', OptionsConfig).setOrigin(0.5);
        this.add.text(game.config.width/7, (game.config.height*7)/9 , 'Disguise', OptionsConfig).setOrigin(0.5);
        this.add.text(game.config.width/7, (game.config.height*8)/9 , 'Interact', OptionsConfig).setOrigin(0.5);
        
        OptionsConfig.color =  '#FFFFFF';
        this.CLeft = this.add.text((game.config.width*3)/7, (game.config.height*3)/9 ,PLeftT, OptionsConfig).setOrigin(0.5);
        OptionsConfig.color =  '#99AD95';
        //changing text

        this.CRight = this.add.text((game.config.width*3)/7, (game.config.height*4)/9 ,PRightT, OptionsConfig).setOrigin(0.5);
        this.CUp = this.add.text((game.config.width*3)/7, (game.config.height*5)/9 ,PUpT, OptionsConfig).setOrigin(0.5);
        this.CDown = this.add.text((game.config.width*3)/7, (game.config.height*6)/9 ,PDownT, OptionsConfig).setOrigin(0.5);
         this.CDisguise = this.add.text((game.config.width*3)/7, (game.config.height*7)/9 ,PDisguiseT, OptionsConfig).setOrigin(0.5);
         this.CInteract = this.add.text((game.config.width*3)/7, (game.config.height*8)/9 ,PInteractT, OptionsConfig).setOrigin(0.5);
        this.setUpKeys();
        this.control = PLeft;
        this.editing = false;
    }

    update() {
        this.setUpControls();
        
    }
        
    
    setUpKeys(){
        keyDisguise = this.input.keyboard.addKey(PDisguise);
        keyInteract = this.input.keyboard.addKey(PInteract);
        keyUp = this.input.keyboard.addKey(PUp);
        keyDown = this.input.keyboard.addKey(PDown);
    }
    setUpControls(){
        if (Phaser.Input.Keyboard.JustDown(keyDown)) {
            this.warning.x = -100; 
            this.warning.y = (game.config.height*10)/9;
            if(this.control == PLeft){
                this.updateMenu(this.CLeft,this.CRight, PRight);
            }
            else if(this.control == PRight){
                this.updateMenu(this.CRight, this.CUp, PUp);
            }  
            else if(this.control == PUp){
                this.updateMenu(this.CUp, this.CDown, PDown);
            }  
            else if(this.control == PDown){
                this.updateMenu(this.CDown, this.CDisguise, PDisguise);
            }
            else if (this.control == PDisguise){
                this.updateMenu(this.CDisguise, this.CInteract, PInteract);
            }
            else if (this.control == PInteract){
                this.updateMenu(this.CInteract, this.CLeft, PLeft);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyUp)) {
            this.warning.x = -100; 
            this.warning.y = (game.config.height*10)/9;
            if(this.control == PLeft){
                this.updateMenu(this.CLeft,this.CInteract, PInteract);
            }
            else if(this.control == PRight){
                this.updateMenu(this.CRight, this.CLeft, PLeft );
            }  
            else if(this.control == PUp){
                this.updateMenu(this.CUp, this.CRight, PRight);
            }  
            else if(this.control == PDown){
                this.updateMenu(this.CDown, this.CUp, PUp);
            }
            else if (this.control == PDisguise){
                this.updateMenu(this.CDisguise, this.CDown, PDown);
            }
            else if (this.control == PInteract){
                this.updateMenu(this.CInteract, this.CDisguise, PDisguise);
            }
        }
        if (Phaser.Input.Keyboard.JustDown(keyDisguise) && !this.editing) {
            this.SelectControl();
        }
        if (Phaser.Input.Keyboard.JustDown(keyInteract) ) {
            this.scene.start('menuScene'); 
            localStorage.setItem(localStorageName+'_controls', [PLeft,PRight,PUp,PDown, PDisguise, PInteract]);
            localStorage.setItem(localStorageName+'_controls_Text', [PLeftT,PRightT,PUpT,PDownT, PDisguiseT, PInteractT]);
            this.sound.play('sfx_fall');
        }

    } 
    updateMenu(current, next, scene){
        next.setColor('#FFFFFF');
        current.setColor('#99AD95');
        this.control = scene;
        this.sound.play('sfx_select');
    }
    SelectControl(){
        this.editing = true;
        this.sound.play('sfx_finishedObjective');
        let newKey = this.input.keyboard.on('keydown', function (event){
            if(PLeft == event.keyCode || PRight == event.keyCode || PUp == event.keyCode ||
                 PDown == event.keyCode || PDisguise == event.keyCode || PInteract == event.keyCode){
                    this.scene.warning.x = (game.config.width/2);
                    this.scene.warning.y = game.config.height/2 ;
                    this.scene.sound.play('sfx_discovered');
            }else if(this.scene.control == PLeft){
                PLeft = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CLeft.text = "Space";
                    PLeftT = "Space";
                }else{
                    this.scene.CLeft.text = event.key;
                    PLeftT = event.key;
                }
            }else if(this.scene.control == PRight){
                PRight = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CRight.text = "Space";
                    PRightT = "Space";
                }else{
                    this.scene.CRight.text = event.key;
                    PRightT = event.key;
                }
            }else if(this.scene.control == PUp){
                PUp = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CUp.text = "Space";
                    PUpT = "Space";
                }else{
                    this.scene.CUp.text = event.key;
                    PUpT = event.key;
                }
            }else if(this.scene.control == PDown){
                PDown = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CDown.text = "Space";
                    PDownT = "Space";
                }else{
                    this.scene.CDown.text = event.key;
                    PDownT = event.key;
                }
            }else if(this.scene.control == PDisguise){
                PDisguise = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CDisguise.text = "Space";
                    PDisguiseT = "Space";
                }else{
                    this.scene.CDisguise.text = event.key;
                    PDisguiseT = event.key;
                }
            }else if(this.scene.control == PInteract){
                PInteract = event.keyCode;
                this.scene.control = event.keyCode;
                if(event.key == ' '){
                    this.scene.CInteract.text = "Space";
                    PInteractT = "Space";
                }else{
                    this.scene.CInteract.text = event.key;
                    PInteractT = event.key;
                }
            }
            newKey._events = {};
            this.scene.editing = false;
            this.scene.setUpKeys();
            });
        

    }

}