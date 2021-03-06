class PlayerSpy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, disguiseTex) {
        super(scene, x, y, texture, frame);

        //Player animations created
        //normal Idle left
        this.anims.create({
            key: 'idle_left_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'idle_left_',
                start: 1,
                end: 4, 
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        //normal Idle right
        this.anims.create({
            key: 'idle_right_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'idle_right_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        //normal run right
        this.anims.create({
            key: 'run_right_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'run_right_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 13,
            repeat: -1,
        });
        //normal run left
        this.anims.create({
            key: 'run_left_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'run_left_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 13,
            repeat: -1,
        });
        //normal jump right
        this.anims.create({
            key: 'jump_right_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'jump_right_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 2,
            repeat: -1,
        });
        //normal jump left
        this.anims.create({
            key: 'jump_left_green',
            frames: this.anims.generateFrameNames('green_atlas', {
                prefix: 'jump_left_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 2,
            repeat: -1,
        });
        //putting on disguse animation (right)
        this.anims.create({
            key: 'diguise_right',
            frame: this.anims.generateFrameNames('green_atlas', {
                prefix: 'disguise_right_',
                start: 1,
                end: 6,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 2,
            repeat: -1,
        });
        //putting on disguise animation (left)
        this.anims.create({
            key: 'disguise_left',
            frame: this.anims.generateFrameNames('green_atlas', {
                prefix: 'disguise_left_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frmaeRate: 2,
            repeat: -1,
        });
        //disguise idle left
        this.anims.create({
            key: 'idle_left_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'idle_left_',
                start: 1,
                end: 4, 
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        //disguise idle right
        this.anims.create({
            key: 'idle_right_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'idle_right_',
                start: 1,
                end: 4,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 6,
            repeat: -1,
        });
        //disguise run right
        this.anims.create({
            key: 'run_right_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'run_right_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 13,
            repeat: -1,
        });

        //disguise run left
        this.anims.create({
            key: 'run_left_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'run_left_',
                start: 1,
                end: 10,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 13,
            repeat: -1,
        });

        //disguise jump right
        this.anims.create({
            key: 'jump_right_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'jump_right_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 4,
            repeat: -1,
        });

        //disguise jump left
        this.anims.create({
            key: 'jump_left_red',
            frames: this.anims.generateFrameNames('red_atlas', {
                prefix: 'jump_left_',
                start: 1,
                end: 2,
                suffix: '',
                zeroPad: 4
            }),
            frameRate: 4,
            repeat: -1,
        });


        //this.texDisguise = disguiseTex; //Texture to use while disguised
        //this.texNormal = texture;
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
        this.inLOS = false;
        this.graceTimer=0;
        this.graceDuration = 1000
        this.check = 0; //prevents the game over sound from reapplying 
        this.facingLeft = false;

        this.disguiseTimer = 0;
        this.disguiseDuration = 3000;
        // *NOTE*: the second condition will let us limit how often the player can reapply disguises
        // if we have a 3sec disguise and only want to let them reapply after 1 second has passed
        // this.disguiseWait = 2000   .... 
        this.disguiseWait = 3000;
        this.steps = 0;

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
        //check if player is in LOS
        if(this.inLOS && !this.disguiseActive){
            if(this.graceTimer < 20){
                this.scene.warningText.alpha = 1;
                this.scene.warningTween.restart();
            }
            if( this.graceTimer%300 < 20 ){
                this.scene.sound.play('sfx_inLOS');
            }
            this.detected = true;
            this.graceTimer+=delta;
        }else{
            this.detected = false;
            this.graceTimer=0;
            this.scene.warningText.x = this.scene.plrSpy.x + 1000;
            this.scene.warningText.alpha = 0;
        }  
        if(keyLeft.isDown && this.x > 0 ){  //player will move slower when disguise is active
            this.steps++;
            this.facingLeft = true;
            this.facingRight = false;
            if(this.disguiseActive){
                this.anims.play('run_left_red', true);
            }
            else{
                this.anims.play('run_left_green', true);
            }
            this.gettingDressed ? this.setAccelerationX(-this.slowedAccel) : this.setAccelerationX(-this.normalAccel);
            //this.scene.sound.play('sfx_walking');
            if(this.body.velocity.x > 0){ //prevents 'sliding' when changing directions
                this.setAccelerationX(0);
                this.steps++;
            }
            this.walkingSound();
        }
        else if(keyRight.isDown && this.x < config.width){
            this.steps++;
            this.facingLeft = false;
            if(this.disguiseActive){
                this.anims.play('run_right_red', true);
            }
            else{
                this.anims.play('run_right_green', true);
            }
            this.gettingDressed ? this.setAccelerationX(this.slowedAccel) : this.setAccelerationX(this.normalAccel);
            //this.scene.sound.play('sfx_walking');
            if(this.body.velocity.x < 0){ //prevents 'sliding' when changing directions
                this.setAccelerationX(0);
            }
            this.walkingSound();
        }
        else{
            if(this.body.velocity.x > 0 && this.body.blocked.down){
                this.setAccelerationX(0);
                this.steps = 0;
                if(this.disguiseActive){
                    this.anims.play('idle_right_red');
                }
                else{
                    this.anims.play('idle_right_green');
                }
            }
            else if(this.body.velocity.x < 0 && this.body.blocked.down){
                this.setAccelerationX(0);
                this.steps = 0;
                if(this.disguiseActive){
                    this.anims.play('idle_left_red');
                }
                else{
                    this.anims.play('idle_left_green');
                }
            }
            //player stops moving when not holding 
            
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
                // // starts the jump
                this.setVelocityY(this.jumpPower);
            }
        }
           //play jump animations
          if(!this.body.blocked.down && this.disguiseActive){
                 if(this.facingLeft){
                    this.anims.play('jump_left_red', true);
                 } 
                 else{
                    this.anims.play('jump_right_red', true);
                 }
          }
          else if(!this.body.blocked.down && !this.diguiseActive){
                  if(this.facingLeft){
                    this.anims.play('jump_left_green', true);
                  }
                  else{
                    this.anims.play('jump_right_green', true);
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
        //play getting dressed animation
              
            
        //applying disguise
        if( (  keyDisguise.getDuration() >= 0.5*1000) && this.disguiseTimer <= this.disguiseWait && !this.inLOS ){
            if(keyDisguise.getDuration() <= 0.53*1000){ //player needs to release key before they can reapply disguise
                this.disguiseOn(); 
                this.detected=false; 
                this.scene.warningText.x = this.scene.plrSpy.x + 1000;
                // timer on how long the disguise is active
                this.scene.sound.play('sfx_disguise');
                //this.scene.disguiseTween.duration = this.disguiseDuration;
            }
        }else if( keyDisguise.getDuration() != 0 && (keyDisguise.getDuration() <= 5*1000  )&& this.disguiseTimer <= this.disguiseWait && !this.inLOS){
            this.gettingDressed = true; // text follows player 
            //this.scene.dressedText.text = "Getting Dressed..."; 
        }else if (!this.disguiseActive){
            this.gettingDressed = false;
            this.scene.dressedText.x = game.config.width/2 + 600; 
        }else{
            this.gettingDressed = false;
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
            if(this.check == 1&& this.body.velocity.y > 0){
                this.scene.sound.play('sfx_fall');
            }
            this.check++;
        }
        else{
            this.check = 0;
            this.scene.platformCollision.active = true;
        }
        this.inLOS = false; // unless overlapping it will be off.
    }
    walkingSound(){
        //play walking noise
        if((this.body.velocity.y ==0))
            if(this.steps%15 == 0 && !(this.steps%30 == 0)){
                this.scene.sound.play('sfx_walking');
            }else if(this.steps%30 == 0){
                this.scene.sound.play('sfx_walking2');
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

        //this.setTexture(this.texDisguise);
        //play idle animation
        if(this.facingLeft){
            this.anims.play('idle_left_red');
        }
        else{
            this.anims.play('idle_right_red');
        }
        this.disguiseTimer = this.disguiseDuration;

    }

    disguiseOff(){
        this.disguiseActive = false;
        //play new idle animation
        if(this.facingLeft){
            this.anims.play('idle_left_green');
        }
        else{
            this.anims.play('idle_right_green');
        }
        this.scene.sound.play('sfx_disguiseOff');
        //this.setTexture(this.texNormal);
    }

    detectedFunc(){
        this.inLOS = true
        //change val to change grace period
        if(this.graceTimer >= this.graceDuration){
            if(!this.disguiseActive && this.detected){
                this.check++;
                this.scene.gameOver = true;
                this.scene.dressedText.x = game.config.width/2 + 600; 
                this.setAccelerationX(0);
                localStorage.setItem(localStorageName+'_furthestLevel', furthestLevel);
                localStorage.setItem(localStorageName+'_loadlevel', loadlevel);
                //localStorage.setItem(localStorageName+'_smokeBombsHeld', smokeBombsHeld);
                //localStorage.setItem(localStorageName+'_plotUnlocked', plotUnlocked);
            }
        }
        if(this.check == 1){
            this.scene.sound.play('sfx_discovered');
        }
        
    }
}