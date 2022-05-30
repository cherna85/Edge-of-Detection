let config = {
      type: Phaser.AUTO,
      width: 800, // 16 x 9 aspect ratio. Can be scaled up by 2 for fullscreen or divided by 3 to get a good pixel art size
      height: 450,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH,
        zoom: 2 //4
      },
      physics: {
          default: 'arcade',
          arcade: {
                gravity: { y: 500 },
                debug: false
          }
      },
      scene: [ Menu, Option, Credit, LevelSelect, LevelTutorialA, LevelTutorialB, LevelShipyard, LevelClimb, Endscreen],
      plugins:{
        scene: [
          {
            key: 'PhaserRaycaster',
                plugin: PhaserRaycaster,
                mapping: 'raycasterPlugin'
          }
        ]
      }
  }
  
  let game = new Phaser.Game(config);
  //things to save 
  let localStorageName = "Edge_of_Sight";
  let furthestLevel = 0;
  let loadlevel;
  let smokeBombsHeld = 6;
  let plotUnlocked = 7;

  // initializing variables 
  let sceneSelect = 'playScene'; // for selecting between scenes 

  //reserve keyboard vars
  let keyLeft, keyRight, keyUp, keyDown, keyJump, keyDisguise, keyInteract;
  // for player sets Controls //uses keycodes
  let PLeft = 37;
  let PRight = 39;
  let PUp = 38;
  let PDown = 40;
  let PDisguise = 90;
  let PInteract = 88;
  // and the names for the keys......
  let PLeftT = 'ArrowLeft';
  let PRightT = 'ArrowRight';
  let PUpT = 'ArrowUp';
  let PDownT = 'ArrowDown';
  let PDisguiseT = "z";
  let PInteractT = 'x';