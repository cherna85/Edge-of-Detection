class LOS extends Phaser.GameObjects.GameObject {
    constructor(scene, type = 'LoS', mappedObject){
        super(scene,type);
        this.raycaster = scene.raycasterPlugin.createRaycaster({debug:false}); //when debugging is true, we get an error when we restart a level
        this.raycaster.setBoundingBox(0, 0, scene.tilemap.widthInPixels, scene.tilemap.heightInPixels)
        //Maps objects to the ray so it can collide with them
        /*Need to add all tiles with collision
        Mapped object is the solid layer
        Can loop through all tiles that collide
        */
        let solidIndiciesSet = new Set([]);
        mappedObject.forEachTile(tile => {
            if(tile.collides){
                solidIndiciesSet.add(tile.index);
            }
        })
        let solidIndicies = [];
        for(let i of solidIndiciesSet.values()){
            solidIndicies.push(i);
        }

        solidIndicies.push(47); // what we will use as the door for raycasting
        //since the layer is below objects you cant see it
        

        this.raycaster.mapGameObjects(mappedObject, true, {collisionTiles: solidIndicies});
        // true sets dynamic updating

        this.scene = scene; 
        this.rangeLayer = scene.add.layer();  
        
        this.rangeGraphics = scene.make.graphics();
        this.graphics = scene.add.graphics({ lineStyle: { width: 1, color: 0x00ff00}, fillStyle: { color: 0xff8282, alpha: 0.3 } });


                     
    }

    update(){

    }

    createConeRay(scene, originX, originY, angleDeg, coneDeg, fov,){ 
        this.fov = fov;
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
        this.setRange(originX, originY,fov);
        return ray; 
    }
    createCircleRay(scene, originX, originY, fov){
        this.fov = fov;
        let ray = this.raycaster.createRay();
        ray.setOrigin(originX,originY);
        ray.autoSlice = true; 
        ray.enablePhysics();
        //set collision (field of view) range
        ray.setCollisionRange(fov);
        ray.castCircle();
        //create collision
       // this.range  =  scene.add.circle( originX, originY, fov);
       // this.raycaster.mapGameObjects(this.range, true); 
        this.setPlayerCollision(scene,ray);
        this.setRange(originX, originY,fov);
        return ray; 
    }

    getIntersectionsCone(ray){
        return ray.castCone();
    }
    getIntersectionsCircle(ray){
        return ray.castCircle();
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
        this.graphics.clear();
        this.graphics.fillStyle(0xff8282, 0.3);
        for(let r in rays){
            this.graphics.fillPoints(this.getIntersectionsCone(rays[r]));
        }
        //this.path.draw(this.graphics);    
    }
    drawLOSCircle(scene,rays){
        
        for(let r in rays){
            this.getIntersectionsCircle(rays[r]).push(rays[r].origin);
        }  
        this.graphics.clear();
        this.graphics.fillStyle(0xff8282, 0.3);
        for(let r in rays){
            this.graphics.fillPoints(this.getIntersectionsCircle(rays[r]));
        }
        //this.path.draw(this.graphics);    
    }
    setPlayerCollision(scene,ray){
        //Sets up collision with player and lights/cameras
        scene.physics.add.overlap(ray, scene.plrSpy, function(rayFoVCircle, target){
            target.inLOS = true;
            if(!target.disguiseActive){
                target.detectedFunc();
            }
        }, ray.processOverlap.bind(ray));
    }
    setRange(x,y,fov){


        this.rangeGraphics.fillStyle(0xff8282);
        this.rangeGraphics.fillCircle(x,y, fov);
    
        const mask = this.rangeGraphics.createGeometryMask();

        this.rangeLayer.setMask(mask); 

        
        this.rangeLayer.add([this.graphics]);
        
    }
    setRangeXY(X,step, Y ,stepY){
      
        this.rangeGraphics.x = X + step;
        if(stepY != 'undefined'){
          
            this.rangeGraphics.y = Y + stepY;
        }
    
    }

}