class LOS{
    constructor(scene, mappedObjects){
                //creating detectors for level
                this.degree = 0;
                this.raycaster = scene.raycasterPlugin.createRaycaster({debug:false}); //when debugging is true, we get an error when we restart a level
                this.graphics;
                this.intersections;
                this.createSpotlights(scene,[mappedObjects]);


                        //Rotates the cone and re-fills the intersections list
        this.rotate = scene.time.addEvent({ delay: 100, callback: () =>{
            this.ray.setAngleDeg(this.degree++);
            this.intersections = this.ray.castCone();
            this.path.getPoint(this.follower.t, this.follower.vec);
            this.ray.setOrigin(this.follower.vec.x, this.follower.vec.y);
            //second light 
            this.ray2.setAngleDeg(this.degree+180);
            this.intersections2 = this.ray2.castCone();
            // fixes bug where send ray jumps onto the 
            //same path as the first array
            if(this.path.getPoint(this.follower.t+0.5, this.follower.vec) == null){
                this.path.getPoint(this.follower.t - 0.5, this.follower.vec);
            }
            this.ray2.setOrigin(this.follower.vec.x, this.follower.vec.y);
            this.drawLOS(scene);
            
    
         }, loop: true });
    }



    //We will have multiple rays per scene, so we may want to set this up so that it loops over all rays or something
    createSpotlights(scene, mappedObjects){
        //https://github.com/wiserim/phaser-raycaster
        this.ray = this.raycaster.createRay();
        this.ray2 = this.raycaster.createRay();

        // path to rotate along 
        this.path = new Phaser.Curves.Path();
        this.path.add(new Phaser.Curves.Ellipse(game.config.width/2, game.config.height/2-15, 25));
        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        scene.tweens.add({
            targets: this.follower,
            t: 1,
            duration: 35025,
            loop: -1
        });
        this.ray.setOrigin(this.follower.vec.x, this.follower.vec.y);
        this.ray2.setOrigin(this.follower.vec.x, this.follower.vec.y);
        
        this.ray.setAngleDeg(this.degree);
        this.ray.setConeDeg(180);
        this.ray2.setAngleDeg(this.degree+180);
        this.ray2.setConeDeg(180);

        //enable auto slicing field of view
        this.ray.autoSlice = true; 
        this.ray.enablePhysics();
        this.ray2.autoSlice = true; 
        this.ray2.enablePhysics();

        /*Could potentially limit the LOS range visually by surrounding it with a circle it colldies with,
        matching the radius of the ray's collision range.*/
        //this.rayContainer = this.add.circle(this.ray.origin.x, this.ray.origin.y, 200);
        //mappedObjects.push(this.rayContainer);

        //Maps objects to the ray so it can collide with them
        this.raycaster.mapGameObjects(mappedObjects, false, {collisionTiles: [6, 11]}); 
        
        //set collision (field of view) range
        this.ray.setCollisionRange(200);
        this.ray2.setCollisionRange(200);

        //cast ray
        this.intersections = this.ray.castCone();
        this.intersections2 = this.ray2.castCone();
        

        //Draw ray LoS
        scene.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.drawLOS(scene);


        //if player is caught in light 
        scene.physics.add.overlap(this.ray, scene.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected");
                target.detectedFunc();
            }
        }, this.ray.processOverlap.bind(this.ray));
        scene.physics.add.overlap(this.ray2, scene.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                //console.log("detected by 2");
                target.detectedFunc();
            }
        }, this.ray2.processOverlap.bind(this.ray2));

    }
    drawLOS(scene){
        this.intersections.push(this.ray.origin);
        //console.log(this.intersections);
        scene.graphics.clear();
        scene.graphics.fillStyle(0xffffff, 0.3);
        scene.graphics.fillPoints(this.intersections);
        scene.graphics.fillPoints(this.intersections2);
        //this.path.draw(this.graphics);    
    };
}