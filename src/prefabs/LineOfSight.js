class LOS{
    constructor(scene, mappedObjects){
            this.raycaster = scene.raycasterPlugin.createRaycaster({debug:false}); //when debugging is true, we get an error when we restart a level
            //Maps objects to the ray so it can collide with them
            this.raycaster.mapGameObjects(mappedObjects, false, {collisionTiles: [6, 11]});                     
    }

    createConeRay(scene, originX, originY, angleDeg, coneDeg, fov,){ 
        let ray = this.raycaster.createRay();
        ray.setOrigin(originX,originY);
        ray.setAngleDeg(angleDeg);
        ray.setConeDeg(coneDeg);
        ray.autoSlice = true; 
        ray.enablePhysics();
        //set collision (field of view) range
        ray.setCollisionRange(fov);
        ray.castCone();
        //create collision
        this.setPlayerCollision(scene,ray);
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

    drawLOS(scene,rays){
        for(let r in rays){
            this.getIntersectionsCone(rays[r]).push(rays[r].origin);
        }  
        scene.graphics.clear();
        scene.graphics.fillStyle(0xffffff, 0.3);
        for(let r in rays){
            scene.graphics.fillPoints(this.getIntersectionsCone(rays[r]));
        }
        //this.path.draw(this.graphics);    
    }
    setPlayerCollision(scene,ray){
        //Sets up collision with player and lights/cameras
        scene.physics.add.overlap(ray, scene.plrSpy, function(rayFoVCircle, target){
            if(!target.disguiseActive){
                target.detectedFunc();
            }
        }, ray.processOverlap.bind(ray));
    }
}