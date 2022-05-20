class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, flipped = false, losRange = 100, losAngle = 0, losWidth = 45) {
        super(scene, x, y + 4, texture, frame); //The +4 is to make them standing on the ground when they are spawned
       
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.body.allowGravity = false;

        this.path = scene.add.path();
        this.moving = false;
        this.draw = false;

        this.scaleY = 0.75 //New body size is 16 x 24. Possibly smaller in future
        this.setBodySize(16, 32);
        //create a detection frame
        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.enemyLOS = new LOS(scene, scene.solidLayer);
        
        this.detection = this.enemyLOS.createConeRay(scene, this.x, this.y - 8, losAngle, losWidth, losRange);
        this.drawEnemyLOS(scene,[this.detection]);


        //creating collider 
        scene.physics.add.collider(this, scene.solidLayer);
        scene.platformCollision = scene.physics.add.collider(this, scene.platformLayer);
        this.flipSetting = flipped;
        this.flip(flipped);
    }

    update(time,delta, scene){
        //moves enemy along a path 
        if(this.moving){
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.x = this.follower.vec.x;
            this.y = this.follower.vec.y;
            //The -8 for the ray puts it roughly where the enemy's eyes are - Santiago
            this.enemyLOS.setOriginRay(this.detection, this.follower.vec.x, this.follower.vec.y - 8);
            //once you reach the end of the path flip
            if((this.path.getPoint(1).x == this.x) && (this.path.getPoint(1).y ==  this.y)){
                this.flip(!this.flipSetting);
            }
            else if((this.path.getPoint(0).x == this.x) && (this.path.getPoint(0).y ==  this.y)){
                this.flip(this.flipSetting);
            }
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
        let line = new Phaser.Curves.Line([this.x,this.y, endX, endY + 4]);
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
        this.graphics.fillStyle(0xffffff, 0.3);
        this.graphics.fillPoints(intersections);

        if(this.draw){
            this.path.draw(this.graphics);
        }
    }
    
}