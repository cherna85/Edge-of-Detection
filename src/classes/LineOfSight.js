class LOS{
    constructor(scene, mappedObjects){
            //creating detectors for level
                this.degree = 0;
                this.raycaster = scene.raycasterPlugin.createRaycaster({debug:false}); //when debugging is true, we get an error when we restart a level
                this.graphics;
                this.intersections;
                this.createSpotlights(scene,[mappedObjects]);
            //Maps objects to the ray so it can collide with them
            this.raycaster.mapGameObjects(mappedObjects, false, {collisionTiles: [6, 11]}); 
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

    createConeArray(scene, originX,originY, angleDeg, coneDeg, fov,){ 
        let ray = this.raycaster.createRay();
        ray.setOrigin(originX,originY);
        ray.setAngleDeg(angleDeg);
        ray.setConeDeg(coneDeg);
        ray.autoSlice = true; 
        ray.enablePhysics();
        //set collision (field of view) range
        ray.setCollisionRange(fov);
        ray.castCone();

        return ray; 
    }
    getIntersectionsCone(ray){
        return ray.castCone();
    }
    setOriginRay(ray, originX, originY){
        ray.setOrigin(originX,originY);
    }
    setAngleDegRay(ray,angleDeg){
        ray.setAngleDeg(angleDeg);
    }
    setConeDegRay(ray,coneDeg){
        ray.setConeDeg(coneDeg);
    }
    setFOV(fov){
        ray.setCollisionRange(fov);
    }

    //We will have multiple rays per scene, so we may want to set this up so that it loops over all rays or something
    createSpotlights(scene, mappedObjects){
        //https://github.com/wiserim/phaser-raycaster
        
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
        
        this.ray = this.createConeArray(scene, this.follower.vec.x, this.follower.vec.y, this.degree, 180, 200);
        this.intersections = this.getIntersectionsCone(this.ray);
        this.ray2 = this.createConeArray(scene, this.follower.vec.x, this.follower.vec.y, this.degree+180, 180, 200);
        this.intersections2 = this.getIntersectionsCone(this.ray2)
        
        


        /*Could potentially limit the LOS range visually by surrounding it with a circle it colldies with,
        matching the radius of the ray's collision range.*/
        //this.rayContainer = this.add.circle(this.ray.origin.x, this.ray.origin.y, 200);
        //mappedObjects.push(this.rayContainer);

    
        
     


        

        //Draw ray LoS
        scene.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xffffff, alpha: 0.3 } });
        this.drawLOS(scene);


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