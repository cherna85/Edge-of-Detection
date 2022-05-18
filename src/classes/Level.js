class Level{
    constructor(scene, tilemap, tilesetName, loadedImage){
        //Adding tilemap
        const mapProto = scene.make.tilemap({key: tilemap});
        const tilesCity = mapProto.addTilesetImage(tilesetName, loadedImage);
        // 1st arg, the tileset name, needs to match the tileset name in the Tiled file (check the program)

        //Creates layers matching the layers we made in Tiled software
        this.solidLayer = mapProto.createLayer('Solid', tilesCity, -16, -16);
        this.platformLayer = mapProto.createLayer('Platform', tilesCity, -16, -16);
        //Caredful that all of the keys and stuff match what was defined in the Tiled file.
        /*The -16, -16 on the tilemaps was because I used to put a 1-tile barrier around them, but now I realize
        that was unnecessary because Phaser already has something for that - Santiago*/
        
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
    getSolidLayer(){
        return this.solidLayer;
    }
    getPlatformLayer(){
        return this.platformLayer;
    }
}