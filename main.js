// Connect Four is a game where you try to drop 4 chips in a row that connect

var game;
var controller;

game = new Phaser.Game(800, 600, Phaser.CANVAS, "", {preload: preload, create: create, update: update, render: render});
controller = new Controller();

function preload(){
    // This game dun use no sprites
    // so FUCK this function

    // It probably will later though...
}

function create(){
    var circle_graphics;
    
    var board;
    var board_g;

    controller.setupBoard();
    controller.createClickHandler();
    
    // Set the gravity level and sort the sprites
    game.physics.arcade.gravity.y = 900;
    game.world.sort(0, Phaser.Group.SORT_ASCENDING);
}

function update(){
    var bottom_bound_box;
    var board;
    
    bottom_bound_box = window.board_g.getChildAt(1);
    board = window.board_g.getChildAt(0);

    if(board.activeChip){
	game.physics.arcade.collide(bottom_bound_box, board.activeChip, controller.chipCollide);
	game.physics.arcade.collide(board.chip_g.children, board.activeChip, controller.chipCollide);
    }

    controller.columnPointerOver();
}

function render(){
    var bottom_bound_box;
    var board;

    bottom_bound_box = window.board_g.getChildAt(1);
    board = window.board_g.getChildAt(0);
    
    // game.debug.spriteBounds(bottom_bound_box);
    // game.debug.spriteBounds(board.chip_g);
    // game.debug.spriteBounds(board.phantom_chip);
}
