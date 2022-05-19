class PlayerSpy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, disguiseTex) {
        super(scene, x, y, texture, frame);
        this.texDisguise = disguiseTex; //Texture to use while disguised
        this.texNormal = texture;
        //These have to be first for physics stuff to work
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        

        this.scaleY = 0.75 //New body size is 16 x 24. Possibly smaller in future
        this.setBodySize(16, 32);
        this.tempUI = false; // remove later 


        //player variables 
        this.disguiseActive = false;
        this.gettingDressed = false;
        this.detected = false;

        this.disguiseTimer = 0;
        this.disguiseDuration = 10000;
        

        //needs to be tweaked 
        this.normalAccel = 500; //Horizontal acceleration
        this.slowedAccel = 500; //Slow (disguising) acceleration
        this.normalVel = 250;
        this.slowedVel = 100;
        this.setMaxVelocity(this.normalVel, 500); // max velocity (x, y)
        this.setDragX(1000);
        this.jumpPower = -300;
        this.jumpTime = 1;

        // remove later, for testing
        //BUG: Causes player to collide with invisible wall if level is too big
        //Can we make the bounds match the tilemap instead of the screen?
        this.setCollideWorldBounds(true);
    }

    /*Can currently jump 6 tiles in the air
    Gravity is also pretty high for the */

    update(time, delta){
        //Horizontal movement
        if(keyLeft.isDown && this.x > 0 ){  //player will move slower when disguise is active
            this.gettingDressed ? this.setAccelerationX(-this.slowedAccel) : this.setAccelerationX(-this.normalAccel);
            if(this.body.velocity.x > 0){ //prevents 'sliding' when changing directions
                this.setAccelerationX(0);
            }
        }
        else if(keyRight.isDown && this.x < config.width){
            this.gettingDressed ? this.setAccelerationX(this.slowedAccel) : this.setAccelerationX(this.normalAccel);
            if(this.body.velocity.x < 0){ //prevents 'sliding' when changing directions
                this.setAccelerationX(0);
            }
        }
        else{
            //player stops moving when not holding 
            this.setAccelerationX(0);
        }
        //while getting dressed max speed is slower
        this.gettingDressed ? this.setMaxVelocity(this.slowedVel,500) : this.setMaxVelocity(this.normalVel,500);

        //jumping 
        // how to implement it was looked from here.
        //http://floss.booktype.pro/learn-javascript-with-phaser/game-mechanic-longer-jumps-if-holding-jump-down/
        if(!this.gettingDressed){ // player can only jump when not gettig dressed
            if(keyJump.isDown && !keyDown.isDown){
                if(this.body.onFloor() && this.jumpTime == 0){
                    this.scene.sound.play('sfx_jump');
                    // starts the jump
                    this.jumpTime = 1;
                    this.setVelocityY(this.jumpPower);
                }else if (this.jumpTime > 0 && this.jumpTime < 20){ // can shorten jump time 
                    // this lets the player jump higher
                    this.jumpTime++;
                    this.setVelocityY(this.jumpPower+(this.jumpTime * 5)); // how much higher you jump
                }
            }
            else{
                //reset jump timer when it's not being pressed
                this.jumpTime = 0;
            }
        }

        this.disguiseTimer -= delta;
        if(this.disguiseTimer <= 0 && this.disguiseActive){
            console.log("its off");
            this.disguiseOff();
            this.tempUI = false;
            this.scene.dressedText.x = this.y - 50; // remove later
            this.scene.dressedText.text = "Getting Dressed..."; //remove later
            this.scene.disguiseTimer.alpha = 0;
        }
        else if(this.disguiseTimer > 0){
            //Display time remaining in seconds
            this.scene.disguiseTimer.text = Math.ceil(this.disguiseTimer / 1000);
        }

        //applying disguise
        if( (keyDisguise.getDuration() >= 3*1000) && !this.disguiseActive){
            this.disguiseOn(); 
            // timer on how long the disguise is active
            this.scene.sound.play('sfx_disguise');
            //this.scene.disguiseTween.duration = this.disguiseDuration;
        }else if( keyDisguise.getDuration() != 0 && (keyDisguise.getDuration() <= 5*1000) && !this.disguiseActive){
            this.gettingDressed = true; // text follows player 
        }else if (!this.disguiseActive){
            this.gettingDressed = false;
            this.scene.dressedText.x = game.config.width/2 + 600; 
        }

        //Dropping through platforms (while DOWN + JUMP is held down)
        if(keyDown.isDown && keyJump.isDown){
            this.scene.platformCollision.active = false;
        }
        else{
            this.scene.platformCollision.active = true;
        }
    }

    disguiseOn(){
        console.log("Disguise On");
        this.disguiseActive = true;
        this.gettingDressed = false;               //turn these on when we have visuals
        //this.scene.dressedText.x = this.y - 300;
        this.tempUI = true; //remove later

        this.scene.dressedText.text = "Disguised"; // remove later
        this.scene.disguiseTimer.alpha = 1;
        this.scene.disguiseTween.restart();

        this.setTexture(this.texDisguise);
        this.disguiseTimer = this.disguiseDuration;

    }

    disguiseOff(){
        this.disguiseActive = false;
        this.setTexture(this.texNormal);
    }

    detectedFunc(){
        this.detected = true;
        this.scene.gameOver = true;
        if(this.scene.check <3){
            this.scene.check++;
        }
        //bug fixes
        this.scene.dressedText.x = game.config.width/2 + 600; 
        this.setAccelerationX(0);
    }

    gameOverFunc(){
        this.scene.add.text(this.scene.camera.main.x, this.scene.camera.main.y, 'GAMEOVER' ).setOrigin(0.5);
        this.scene.restartbutton = this.scene.add.text(game.config.width/2, game.config.height/2 +32 , 'Restart', {color: '#FF994F'}).setOrigin(0.5);
        this.scene.MainMenubutton = this.scene.add.text(game.config.width/2, game.config.height/2 +64 , 'Main Menu' ,{color: '#FFFFFF'}).setOrigin(0.5);
    }
}