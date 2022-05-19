class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
       
        scene.add.existing(this);
        scene.physics.add.existing(this); //Assigns this sprite a physics body
        
        this.body.allowGravity = false;

        this.path = scene.add.path();
        this.moving = false;

        this.scaleY = 0.75 //New body size is 16 x 24. Possibly smaller in future
        this.setBodySize(16, 32);

        //creating collider 
        scene.physics.add.collider(this, scene.solidLayer);
        scene.platformCollision = scene.physics.add.collider(this, scene.platformLayer);

    }
    update(time,delta){
        //moves enemy along a path 
        if(this.moving){
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.x = this.follower.vec.x;
            this.y = this.follower.vec.y;
            //once you reach the end of the path flip
            if((this.path.getPoint(1).x == this.x) && (this.path.getPoint(1).y ==  this.y)){
                this.flip(true);
            }
            else if((this.path.getPoint(0).x == this.x) && (this.path.getPoint(0).y ==  this.y)){
                this.flip(false);
            }
        }

        
        

    }
    flip(toggle){
        this.flipX=toggle;
    }
    straightPath(scene,startX,startY,endX,endY, duration){
        let line = new Phaser.Curves.Line([startX,startY, endX, endY]);
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


    
}