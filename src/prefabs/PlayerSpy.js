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
        this.disguiseDuration = 3000;
        

        //needs to be tweaked 
        this.normalAccel = 384; //Horizontal acceleration
        this.slowedAccel = 256; //Slow (disguising) acceleration
        this.normalVel = 128; //
        this.slowedVel = 64;
        this.setMaxVelocity(this.normalVel, 500); // max velocity (x, y)
        this.setDragX(1000);
        this.jumpPower = -240;
        this.jumpPowerMin = -64;

        // remove later, for testing
        //BUG: Causes player to collide with invisible wall if level is too big
        //Can we make the bounds match the tilemap instead of the screen?
        this.setCollideWorldBounds(true);
        this.body.setBoundsRectangle(new Phaser.Geom.Rectangle(0, 0, scene.tilemap.widthInPixels, scene.tilemap.heightInPixels))
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

        //Maybe if holding down jump button, reduce the effect that gravity is having on it
        /*New jump method references this video: 
        https://www.youtube.com/watch?v=rVfR14UNNDo
        */
        if(!this.gettingDressed) { // player can only jump when not gettig dressed
            if(Phaser.Input.Keyboard.JustDown(keyJump) && this.body.onFloor()) {
                this.scene.sound.play('sfx_jump');
                // starts the jump
                this.setVelocityY(this.jumpPower);
            }
        }
        if(Phaser.Input.Keyboard.JustUp(keyJump)) {
            if(this.body.velocity.y < this.jumpPowerMin) {
                this.body.velocity.y = this.jumpPowerMin;
            }
        }

        this.disguiseTimer -= delta;
        if(this.disguiseTimer <= 0 && this.disguiseActive){
            console.log("its off");
            this.disguiseOff();
            this.tempUI = false;
            this.scene.dressedText.x = this.y - 1000; // remove later
            this.scene.dressedText.text = "Getting Dressed..."; //remove later
            this.scene.disguiseTimer.alpha = 0;
        }
        else if(this.disguiseTimer > 0){
            //Display time remaining in seconds
            this.scene.dressedText.text = "Disguised";
            this.scene.disguiseTimer.text = Math.ceil(this.disguiseTimer / 1000);
        }

        //applying disguise
        // *NOTE*: the second condition will let us limit how often the player can reapply disguises
        // if we have a 3sec disguise and only want to let them reapply after 1 second has passed
        // this.disguiseTimer <= 2000   .... 
        if( (  keyDisguise.getDuration() >= 0.5*1000) && this.disguiseTimer <= 3000 ){
            if(keyDisguise.getDuration() <= 0.6*1000){ //player needs to release key before they can reapply disguise
                this.disguiseOn(); 
                this.detected=false; 
                this.scene.warningText.x = this.scene.plrSpy.x + 1000;
                // timer on how long the disguise is active
                this.scene.sound.play('sfx_disguise');
                //this.scene.disguiseTween.duration = this.disguiseDuration;
            }
        }else if( keyDisguise.getDuration() != 0 && (keyDisguise.getDuration() <= 5*1000  )&& this.disguiseTimer <= 3000){ // be sure to update here
            this.gettingDressed = true; // text follows player 
            this.scene.dressedText.text = "Getting Dressed..."; 
        }else if (!this.disguiseActive){
            this.gettingDressed = false;
            this.scene.dressedText.x = game.config.width/2 + 600; 
        }

        //Dropping through platforms (while DOWN + JUMP is held down)
        /*
        What could be causing the bug?
        - Console is logging so it can't be anything related to input
        - Works on shipyard, but not the tutorial levels, so most likely it's a
        difference in level json or js files
        - No differences in js files, so must have something to do with the json files
        - Collider exists, and is becoming false while key is held down
        - ...it's the enemy...
        - Somehow the enemy is taking the place of the playerspy in the collider
        */
        if(keyDown.isDown){
            //console.log(this.scene.platformCollision);
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
        //change delay to change grace period timmer
        this.graceTimer = this.scene.time.addEvent({ delay:2000, callback: () =>{
            if(!this.disguiseActive){
                this.scene.gameOver = true;
                this.scene.check++;
                this.scene.dressedText.x = game.config.width/2 + 600; 
                this.setAccelerationX(0);
            }
        } });
    }

    gameOverFunc(){23
        this.scene.add.text(this.scene.camera.main.x, this.scene.camera.main.y, 'GAMEOVER' ).setOrigin(0.5);
        this.scene.restartbutton = this.scene.add.text(game.config.width/2, game.config.height/2 +32 , 'Restart', {color: '#FF994F'}).setOrigin(0.5);
        this.scene.MainMenubutton = this.scene.add.text(game.config.width/2, game.config.height/2 +64 , 'Main Menu' ,{color: '#FFFFFF'}).setOrigin(0.5);
    }
}