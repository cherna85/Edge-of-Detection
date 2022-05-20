class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, losAngle = 0, losWidth = 45, losRange = 100) {
        super(scene, x, y, texture, frame);
       
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
        this.detection = this.enemyLOS.createConeRay(scene, this.x, this.y, losAngle, losWidth, losRange);
        this.drawEnemyLOS(scene,[this.detection]);


        //creating collider 
        scene.physics.add.collider(this, scene.solidLayer);
        scene.platformCollision = scene.physics.add.collider(this, scene.platformLayer);

    }

    update(time,delta, scene){
        //moves enemy along a path 
        if(this.moving){
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.x = this.follower.vec.x;
            this.y = this.follower.vec.y;
            this.enemyLOS.setOriginRay(this.detection, this.follower.vec.x, this.follower.vec.y);
            //once you reach the end of the path flip
            if((this.path.getPoint(1).x == this.x) && (this.path.getPoint(1).y ==  this.y)){
                this.flip(true);
                this.enemyLOS.setAngleDegRay(this.detection,180);
            }
            else if((this.path.getPoint(0).x == this.x) && (this.path.getPoint(0).y ==  this.y)){
                this.flip(false);
                this.enemyLOS.setAngleDegRay(this.detection,0);
            }
        }
        this.drawEnemyLOS(scene,this.detection);
    }

    flip(toggle){
        this.flipX=toggle;
    }

    
    straightPath(scene, endX ,endY, duration){
        let line = new Phaser.Curves.Line([this.x,this.y, endX, endY]);
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