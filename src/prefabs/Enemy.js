class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, flipped = false, losRange = 100, losAngle = 0, losWidth = 45) {
        super(scene, x, y + 7, texture, frame); //The +4 is to make them standing on the ground when they are spawned
       

        //create enemy animations
        // idle left enemy
        this.anims.create({
            key: 'idle_left_enemy',
            frames: this.anims.generateFrameNames('enemy_atlas', {
                prefix: 'idle_left_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4,
            }),
            frameRate: 3,
            repeat: -1,
            repeatDelay: 5000,
        });
        
        //idle right enemy
        this.anims.create({
            key: 'idle_right_enemy',
            frames: this.anims.generateFrameNames('enemy_atlas', {
                prefix: 'idle_right_',
                start: 1,
                end: 3,
                suffix: '',
                zeroPad: 4,

            }),
            frameRate: 3,
            repeat: -1,
            repeatDelay: 6000,
        });

        // enemy patrol left
        this.anims.create({
            key: 'walk_left_enemy',
            frames: this.anims.generateFrameNames('enemy_atlas', {
                prefix: 'patrol_left_',
                start: 1,
                end: 9,
                suffix: '', 
                zeroPad: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //enemy patrol right
        this.anims.create({
            key: 'walk_right_enemy',
            frames: this.anims.generateFrameNames('enemy_atlas', {
                prefix: 'patrol_right_',
                start: 1,
                end: 9,
                suffix: '',
                zeroPad: 4,
            }),
            frameRate: 10,
            repeat: -1,
        });

        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.body.allowGravity = false;

        this.path = scene.add.path();
        this.moving = false;
        this.draw = false;
        this.steps = 0;

        this.scaleY = 0.75 //New body size is 16 x 24. Possibly smaller in future
        this.setBodySize(16, 32);
        //create a detection frame
        this.rangeLayer = scene.add.layer();  
            
        this.rangeGraphics = scene.make.graphics();

        this.rangeGraphics.fillStyle(0xff8282);
        this.rangeGraphics.fillCircle(x, y, losRange);
        //console.log(this.rangeGraphics );
    
        const mask = this.rangeGraphics.createGeometryMask();

        this.rangeLayer.setMask(mask); 

        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xff8282, alpha: 0.4 } });
        this.enemyLOS = new LOS(scene, "EnemyLOS",scene.solidLayer);
        this.rangeLayer.add([this,this.graphics]);
        //console.log(this.rangeLayer );
        
       
        
        this.detection = this.enemyLOS.createConeRay(scene, this.x, this.y - 7.5, losAngle, losWidth, losRange);
        this.drawEnemyLOS(scene,[this.detection]);



        //creating collider 
        scene.physics.add.collider(this, scene.solidLayer);
        scene.physics.add.collider(this, scene.platformLayer);
        this.flipSetting = flipped;
        this.flip(flipped);
        this.setDepth(-2);
        this.drawPath(false);
    }

    update(time,delta, scene){
        //moves enemy along a path 
        if(this.moving){
            this.anims.play('walk_right_enemy', true);
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.x = this.follower.vec.x;
            this.y = this.follower.vec.y;
            this.steps++;
            //The -7.5 for the ray puts it roughly where the enemy's eyes are - Santiago
            this.enemyLOS.setOriginRay(this.detection, this.follower.vec.x, this.follower.vec.y -7.5);
            //once you reach the end of the path flip
            if((this.path.getPoint(1).x == this.x) && (this.path.getPoint(1).y ==  this.y)){
                this.flip(!this.flipSetting);
                this.anims.play('walk_left_enemy', true)
            }
            else if((this.path.getPoint(0).x == this.x) && (this.path.getPoint(0).y ==  this.y)){
                this.flip(this.flipSetting);

            }
            this.setEnemyRangeXY(this.x,this.y);
            this.walkingSound();
        }
        this.drawEnemyLOS(scene,this.detection);
    }

    flip(toggle){
        this.flipX=toggle;
        if(toggle){ //when player is flipped
            this.enemyLOS.setAngleDegRay(this.detection,180);
        }else{ //when they are not
            this.enemyLOS.setAngleDegRay(this.detection, 0);
        }
       
    }

    
    straightPath(scene, endX ,endY, duration){
        let line = new Phaser.Curves.Line([this.x,this.y, endX, endY+7]);
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.path.add(line);
        scene.tweens.add({
            targets: this.follower,
            t: 1,
            //ease: 'Linear',
            duration: duration,
            yoyo: true,
            repeat: -1
        });
        this.moving = true;
    }
    standingTurn(scene, speed ){
        this.turn = scene.time.addEvent({ delay: speed, callback: () =>{
            this.flipSetting  =  !this.flipSetting    
            this.flip(this.flipSetting)
            }, loop: true });
    }
    
    drawPath(toggle){
        this.draw = toggle;
    }
    getDetection(){
        return this.detection;
    }
    drawEnemyLOS(){
        //console.log(rays[r]);
        let intersections = this.detection.castCone();
        intersections.push(this.detection.origin);
        this.graphics.clear();
        this.graphics.fillStyle(0xff8282, 0.5);
        this.graphics.fillPoints(intersections);

        if(this.draw){
            this.path.draw(this.graphics);
        }
    }
    setEnemyRangeXY(X,Y){
        
        this.rangeGraphics.x = X-320;
    }
    walkingSound(){
        //play walking noise
        if(this.scene.cameras.main.worldView.contains(this.x, this.y)){ // will only make sound if in view
            if((this.body.velocity.y ==0)){
                if(this.steps%15 == 0 && !(this.steps%30 == 0)){
                    this.scene.sound.play('sfx_walking');
                }else if(this.steps%30 == 0){
                    this.scene.sound.play('sfx_walking2');
                }
            }
        }
    }
    
}