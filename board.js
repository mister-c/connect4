// This creates the board object
// Its a bit of a hack... its not an actual constructor...

function initBoard(){
    var board_g;
    var chip_g;
    var board;
    var bottom_bound_box;

    var canvas;
    var ctx;
    var circle;

    var cell_x_pos;
    var cell_y_pos;

    board = game.add.sprite(0, 0);
    
    // Instance variable for the board
    // board.width  = 500;
    board.width  = (game.width  *  0.6 );
    board.height = (board.width * (6/7));
    
    board.num_row      = 6;
    board.num_column   = 7;
    board.chip_spacing = 15;
    board.chip_arr = new Array(board.num_row);

    // Each cell has a size that is the 1/7th the full height of the board
    // includes an adjustment for the spacing
    board.chip_size = (
	(board.width / board.num_column)
    );

    // board.chip_size = (
    // 	((board.width - (board.chip_spacing * (board.num_column + 1) )) / board.num_column)
    // );
    board.chip_size = Math.floor(board.chip_size);
    
    // * is empty
    // R is red
    // B is blue
    for (var i = 0; i < board.num_column; i++) {
	board.chip_arr[i] = Array(board.num_row);
	for(var j = 0; j < board.num_row; j++){
	    board.chip_arr[i][j] = {};
	    board.chip_arr[i][j].color = "*";
	}
    }

    // Use a canvas object to create the board graphics
    canvas = document.createElement("canvas");
    canvas.width  = board.width;
    canvas.height = board.height;
    
    ctx = canvas.getContext("2d");

    // Draw the game board
    ctx.beginPath();
    ctx.fillStyle = "rgb(75, 75, 75)";
    ctx.moveTo(0, 0);
    ctx.lineTo(board.width, 0           );
    ctx.lineTo(board.width, board.height);
    ctx.lineTo(0,           board.height);
    ctx.lineTo(0,           0           );
    ctx.closePath();
    
    // Draw the lil circles in the game board
    for (var i = 0; i < board.num_column; i++){
    	for (var j = 0; j < board.num_row; j++){
	    // circles align themselves on their center axis, so by shifting by half a circle
	    // we can make them align by their left hand side
	    // simply put, if we didnt add the 0.5 term then first column of circles would be chopped in half
    	    cell_x_pos = 0 + (board.chip_size * 0.5) + (board.chip_size * i);
    	    cell_y_pos = 0 + (board.chip_size * 0.5) + (board.chip_size * j);
    	    // cell_x_pos = 0 + (board.chip_size * 0.5) + (board.chip_size * i) - (board.chip_spacing * (i + 1));
    	    // cell_y_pos = 0 + (board.chip_size * 0.5) + (board.chip_size * j) - (board.chip_spacing * (j + 1));

    	    cell_x_pos = Math.round(cell_x_pos);
    	    cell_y_pos = Math.round(cell_y_pos);
	    
	    ctx.arc(cell_x_pos, cell_y_pos, ((board.chip_size - board.chip_spacing) / 2), 0, 2* Math.PI, true);
	    ctx.closePath();
    	}
    }
    ctx.fill();

    // Turn the canvas object into a mother fuckin' SPRITE
    board.texture = PIXI.Texture.fromCanvas(canvas);
    board.width  = (game.width  *  0.6 );
    board.height = (board.width * (6/7));
    board.name = "board";

    board.circle_graphics = game.add.graphics(0, 0);

    // board.chip_arr = chip_arr;
    board.chip_g   = game.add.group();
    board.chip_g.z = 0;
    
    board_g = game.add.group();
    board_g.add(board);
    board.z = 2;

    board.p1_color = 0xff0000;
    board.p2_color = 0x00ff00;

    // Create a invisible box at the bottom of the board so the chips don't slip
    // through and fall off the screen
    bottom_bound_box        = game.add.sprite(board.x, board.y + board.height);
    bottom_bound_box.name   = "bottom_bound_box";
    bottom_bound_box.width  = board.width;
    bottom_bound_box.height = 30;

    // Add stuff to the board_g group so that its all nicely packaged together
    board_g.add(bottom_bound_box);
    // bottom_bound_box.y -= board.chip_spacing * 0.5;

    board_g.x = (game.width  * ((1 - (board.width  / game.width )) / 2));
    board_g.y = (game.height * ((1 - (board.height / game.height)) / 2));
    board_g.z = 2;

    // Hold out invisible rectangle in place so it doesnt slide around
    // when chips bump into it
    game.physics.arcade.enable(bottom_bound_box);
    bottom_bound_box.body.allowGravity = false;
    bottom_bound_box.body.immovable    = true;

    // Create the game board
    window.board_g = board_g;

    //////////////////////////////////////////////////

    // Functions...

    board.createPhantomChip = function(){
    	if(board.phantom_chip == undefined){
    	    board.phantom_chip = game.add.sprite(0, 0);
    	    board.phantom_chip.width  = board.chip_size;
    	    board.phantom_chip.height = board.chip_size;
    	    board.phantom_chip.texture_p1 = board.genChipTexture("R");
    	    board.phantom_chip.texture_p2 = board.genChipTexture("Y");
    	    board.phantom_chip.texture = board.phantom_chip.texture_p1;
    	    board.phantom_chip.scale.x = 1;
    	    board.phantom_chip.scale.y = 1;
    	    board.phantom_chip.width  = board.chip_size;
    	    board.phantom_chip.height = board.chip_size;
	    board.phantom_chip.x = board_g.x;
	    board.phantom_chip.is_ready = true;
    	}
    }

    board.setPhantomChipDrop = function(is_ready){
	var board;
	
	board = window.board_g.getChildAt(0);

	if(board.phantom_chip){
	    // If the chip is dropping then the phantom_chip should not be visible
	    board.phantom_chip.visible  = is_ready;
	    // is_ready represents if the player can or cannot drop the chip
	    board.phantom_chip.is_ready = is_ready;
	}
    }

    board.getTopChip = function(column_index){
	chip_arr = window.board_g.getChildAt(0).chip_arr;

	// Search the chip array for the topmost available chip
	for (var i = (chip_arr[column_index].length - 1); i > -1 ; i--){
	    if(chip_arr[column_index][i].color == "*"){
		return i;
	    }
	}
    }

    board.genChipTexture = function(chip_color){
	var board;
	var texture;

	board = window.board_g.getChildAt(0);

	// Clear off old graphics
	board.circle_graphics.clear();

	if(chip_color == 'R'){
	    // Refactor this so it allows for different colors
	    board.circle_graphics.beginFill(board.p1_color);
	} else {
	    board.circle_graphics.beginFill(board.p2_color);
	}

	// Draw a plain circle to server as the chip sprite
	board.circle_graphics.drawCircle(0, 0, board.chip_size);

	texture = board.circle_graphics.generateTexture();
	board.circle_graphics.clear();
	
	return texture;
    }

    board.dropChip = function(column_index, chip_color){
	var board;
	var chip_arr;

	var top_chip_index;
	
	board = window.board_g.getChildAt(0);
	chip_arr = board.chip_arr;

	// Hide the phantom_chip
	board.setPhantomChipDrop(false);

	// Get the index of the top chip so we know where
	// the new chip should land
	top_chip_index = board.getTopChip(column_index);

	if(top_chip_index < chip_arr[column_index].length){
	    // Set the color of the chip to indicate who dropped the chip
	    chip_arr[column_index][top_chip_index].color = chip_color;

	    // Create a sprite so the chip has some graphics
	    chip_arr[column_index][top_chip_index].sprite        = game.add.sprite((board_g.x + (board.chip_size) * column_index), 0);
	    chip_arr[column_index][top_chip_index].sprite.width  = board.chip_size;
	    chip_arr[column_index][top_chip_index].sprite.height = board.chip_size;

	    // // Create a sprite so the chip has some graphics
	    chip_arr[column_index][top_chip_index].sprite.z = 0;

	    // Clear off old graphics
	    board.circle_graphics.clear();

	    if(chip_color == 'R'){
		// Refactor this so it allows for different colors
		board.circle_graphics.beginFill(board.p1_color);
	    } else {
		board.circle_graphics.beginFill(board.p2_color);
	    }

	    // Draw a plain circle to server as the chip sprite
	    board.circle_graphics.drawCircle(0, 0, board.chip_size);
	    chip_arr[column_index][top_chip_index].sprite.texture = board.genChipTexture(chip_color);
	    board.circle_graphics.clear();
	    chip_arr[column_index][top_chip_index].sprite.scale.x = 1;
	    chip_arr[column_index][top_chip_index].sprite.scale.y = 1;

	    // Let the sprite fall. Falling is easy. Anyone can fall.
	    game.physics.enable(chip_arr[column_index][top_chip_index].sprite);

	    // Try to get the sprites to exist at the right goddamn depth!!!
	    game.world.sort(0, Phaser.Group.SORT_ASCENDING);

	    // Set this chip as the active chip so it is factored into collisions
	    board.activeChip = chip_arr[column_index][top_chip_index].sprite;
	} else {
	    // Need more rebost handling of this condition....
	    console.log("chip_arr is FULL!");
	}
	
    }

    board.debugChipArr = function(){
	var chip_arr;
	var row_display_string;

	chip_arr = window.board_g.getChildAt(0).chip_arr;

	// Order of index values is....
	// chip_arr[column_index][row_index]
	for (var i = 0; i < chip_arr[0].length; i++) {
	    // console.log(chip_arr[i]);
	    row_display_string = i + ") ";
	    for(var j = 0; j < chip_arr.length; j++){
		row_display_string += " " + chip_arr[j][i].color;
	    }
	    console.log(row_display_string);
	}
    }

    board.alignChipGrid = function(){
	
    }

    board.chipCollide = function(collision_body, chip){
	var board;

	board = window.board_g.getChildAt(0);

	// Stop the chip from moving
	chip.body.allowGravity = false;
	chip.body.immovable    = true;
	chip.body.speed    = 0;
	chip.body.velocity = 0;

	// Remove the chip from active state and add it to the
	// chip group
	board.activeChip = undefined;
	board.chip_g.add(chip);

	console.log("CH-CH CHIP COLLIDE!!!");
	console.log("Name: " + chip.name);

	board.setPhantomChipDrop(true);
	// board.phantom_chip.visible = true;

	// Will use this later to force chips to align to the grid
	// alignChipGrid();
    }
}

