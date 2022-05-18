class Level{
    constructor(scene, tilemap, tilesetName, loadedImage){
        //Adding tilemap
        this.mapProto = scene.make.tilemap({key: tilemap});
        this.tilesCity = this.mapProto.addTilesetImage(tilesetName, loadedImage);
        // 1st arg, the tileset name, needs to match the tileset name in the Tiled file (check the program)

        //Creates layers matching the layers we made in Tiled software
        this.solidLayer = this.mapProto.createLayer('Solid', this.tilesCity, -16, -16);
        this.platformLayer = this.mapProto.createLayer('Platform', this.tilesCity, -16, -16);
        //Caredful that all of the keys and stuff match what was defined in the Tiled file.
        
        //Makes all tiles that have property "collides" have collision
        this.solidLayer.setCollisionByProperty( {collides: true} );
        this.platformLayer.setCollisionByProperty( {collides: true} );
        //Makes all the platform tiles only have 1-way collision
        this.platformLayer.forEachTile(tile => {
            if(tile.index == 16){
                tile.collideLeft = false;
                tile.collideRight = false;
                tile.collideDown = false;
            }
            if(tile.index == 7){
                tile.collideRight = true;
                tile.collideLeft = false;
                tile.collideDown = true;
                tile.collideUp = true;
            }
        })
    }
    getMapProto(){
        return this.mapProto;
    }
    getTiles(){
        return this.tilesCity;
    }
    getSolidLayer(){
        return this.solidLayer;
    }
    getPlatformLayer(){
        return this.platformLayer;
    }
}