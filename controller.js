function Controller() {
    var instance;

    // Singleton stuff
    Controller = function(){
	return instance;
    }

    Controller.prototype = this;

    instance = new Controller();

    instance.constructor = Controller;

    // Instance variables
    instance.player_turn = "meatbag";
    instance.p1_color    = 0xff0000;
    instance.p2_color    = 0x00ff00;
    instance.bkg_color   = 0x000000;

    // Delay in milliseconds
    instance.ai_chip_cycle_delay = 100;

    // Instance methods
    instance.setupBoard = function(){
	game.stage.backgroundColor = instance.bkg_color;
	
	initBoard();

	board_g = window.board_g;
	board   = board_g.getChildAt(0);
	board.createPhantomChip();
    }
    
    instance.checkWin = function(){
    	var board;
    	var chip_string;

    	var i;
    	var j;
	
    	board = window.board_g.getChildAt(0);

    	// Check vertical wins
    	for (var i = 0; i < board.chip_arr.length; i++){
    	    chip_string = "";
    	    for (var j = 0; j < board.chip_arr[i].length; j++){
    		chip_string += board.chip_arr[i][j].color;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}
    	// Check horizontal wins
    	// indexes i and j are flipped here CONFUSINGING!??!
    	for (var i = 0; i < board.num_row; i++){
    	    chip_string = "";
    	    for(var j = 0; j < board.num_column; j++){
    		chip_string += board.chip_arr[j][i].color;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}
	
    	// Check for diagnol 1: NW to SE - bottom

    	// Initalize our variables for iterating diagnols
    	i = 0;
    	j = 0;

    	for (var diag_index = 0; diag_index < board.num_row; diag_index ++){
    	    i = 0;
    	    j = diag_index;
	    
    	    chip_string = ";"
	    
    	    while (i < board.num_column && j < board.num_row){
    		chip_string += board.chip_arr[i][j].color;
		
    		i++;
    		j++;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}

    	// Check for diagnol 2: NW to SE - top
	
    	for (var diag_index = 0; diag_index < board.num_column; diag_index++){
    	    i = diag_index;
    	    j = 0;
	    
    	    chip_string = "";
	    
    	    while (i < board.num_column && j < board.num_row){
    		chip_string += board.chip_arr[i][j].color;
		
    		i++;
    		j++;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}
	
    	// Check for diagnol 3: SW to NE - top

    	for (var diag_index = (board.num_row - 1); diag_index > -1; diag_index --){
    	    i = 0;
    	    j = diag_index;

    	    chip_string = "";

    	    while(i < board.num_column && j > -1){
    		chip_string += board.chip_arr[i][j].color;

    		i++;
    		j--;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}
	
    	// Check for diagnol 4: SW to NE - bottom

    	for (var diag_index = 0; diag_index < board.num_column; diag_index++){
    	    i = diag_index;
    	    j = board.num_row - 1;

    	    chip_string = "";

    	    while(i < board.num_column && j > -1){
    		chip_string += board.chip_arr[i][j].color;

    		i++;
    		j--;
    	    }
    	    if(chip_string.match("R{4}|Y{4}") != null){
    		console.log("its a win!");
    	    }
    	}
    }

    instance.getCursorColumnIndex = function(){
    	var board;

    	board = board_g.getChildAt(0);
	
    	if((game.input.activePointer.position.x < board_g.x + (board.width / board.num_column)) &&
    	   (game.input.activePointer.position.x > -1)){
    	    return 0;
    	}
    	if(game.input.activePointer.position.x < game.width &&
    	   (game.input.activePointer.position.x > board_g.x + (board.width / board.num_column) * (board.num_column - 1))){
    	    return board.num_column - 1;
    	}
    	// Next, check all the inner-most columns
    	for(var i = 1; i < board.num_column - 1; i ++){
	    
    	    if((game.input.activePointer.position.x < board_g.x + (board.width / board.num_column) * (i + 1)) &&
    	       (game.input.activePointer.position.x > board_g.x + (board.width / board.num_column) * i)
    	      ){
    		return i;
    	    }
    	}
    }

    instance.movePhantomChip = function(i){
	var board;

	board = board_g.getChildAt(0);
	board.phantom_chip.x = board_g.x + board.chip_size * i;
    }

    instance.columnPointerOver = function(){
	var board;

	if(instance.player_turn == "meatbag"){
	    board = board_g.getChildAt(0);
	    instance.movePhantomChip(controller.getCursorColumnIndex());
	}
    }

    instance.dropClick = function(){
	var board;

	board = window.board_g.getChildAt(0);
	
	if(board.phantom_chip && board.phantom_chip.is_ready == true & instance.player_turn == "meatbag"){
	    board = board_g.getChildAt(0);
	    board.dropChip(instance.getCursorColumnIndex(), "R");
	}
    }
    
    instance.createClickHandler = function(){
	game.input.onDown.add(instance.dropClick, this);
    }

    instance.chipCollide = function(collision_body, chip){
	var board;
	
	board = window.board_g.getChildAt(0);
	
	board.chipCollide(collision_body, chip);

	// Change the turn...
	instance.turn();
    }

    instance.setPlayerTurn = function(player){
	if(player == "meatbag"){
	    instance.player_turn = "meatbag";
	    board.phantom_chip.texture = board.phantom_chip.texture_p1;
	} else{
	    instance.player_turn = "geniusai";
	    board.phantom_chip.texture = board.phantom_chip.texture_p2;
	}
    }
    
    instance.aiChipCycle = function(num_cycle){
    	var board;

    	board = window.board_g.getChildAt(0);
	console.log("calling aiChipCycle()....");

	// Good version....
	board.phantom_chip.x = (((board.phantom_chip.x - board_g.x) + board.chip_size) % (board.chip_size * board.num_column)) + board_g.x;
	
    	// board.phantom_chip.x = (((board.phantom_chip.x - board_g.x) + board.chip_size) % board.width) + board_g.x;
	
    	if(num_cycle == 0){
	    instance.aiDropChip();
	    instance.player_turn == "meatbag";
    	    return;
    	}

	sleep(instance.ai_chip_cycle_delay).then(() => {
	    instance.aiChipCycle(num_cycle - 1);
	});
    	// setTimeout(instance.aiChipCycle(num_cycle - 1), 1000);
    }

    instance.aiDropChip = function(){
    	var board;

    	board = window.board_g.getChildAt(0);
	
	board.dropChip(((((board.phantom_chip.x - board_g.x) + board.chip_size) / board.chip_size) - 1), "Y");
    }

    instance.turn = function(){
	if(instance.player_turn == "meatbag"){
	    instance.setPlayerTurn("geniusai");
	} else{
	    instance.setPlayerTurn("meatbag");
	}

	if(instance.player_turn == "geniusai"){
	    sleep(instance.chip_cycle_delay).then(() => {
		instance.aiChipCycle(10);
	    });
	}
    }

    return instance;
}
