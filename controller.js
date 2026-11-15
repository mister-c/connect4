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
    
    // Search a copy of the board so simulated moves never affect live sprites.
    instance.selectAiColumn = function(board){
        var cells = board.chip_arr.map(function(column){
            return column.map(function(chip){ return chip.color; });
        });
        var columns = cells.length;
        var rows = board.num_row;
        var order = [];
        var directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
        for(var c = 0; c < columns; c++) order.push(c);
        order.sort(function(a, b){
            return Math.abs(a - (columns - 1) / 2) - Math.abs(b - (columns - 1) / 2);
        });

        function landingRow(column){
            for(var r = rows - 1; r >= 0; r--){
                if(cells[column][r] == "*") return r;
            }
            return -1;
        }

        // Score every possible four-cell line, including both diagonals.
        function evaluate(depth){
            var score = 0;
            for(var c = 0; c < columns; c++){
                for(var r = 0; r < rows; r++){
                    if(cells[c][r] != "*"){
                        score += (cells[c][r] == "Y" ? 1 : -1) *
                            (columns - Math.abs(2 * c - columns + 1));
                    }
                    for(var d = 0; d < directions.length; d++){
                        var dx = directions[d][0], dy = directions[d][1];
                        var endC = c + dx * 3, endR = r + dy * 3;
                        if(endC >= columns || endR < 0 || endR >= rows) continue;
                        var yellow = 0, red = 0;
                        for(var i = 0; i < 4; i++){
                            var color = cells[c + dx * i][r + dy * i];
                            if(color == "Y") yellow++;
                            if(color == "R") red++;
                        }
                        // Prefer earlier wins and delay unavoidable losses.
                        if(yellow == 4) return 1000000 + depth;
                        if(red == 4) return -1000000 - depth;
                        if(red == 0) score += [0, 1, 10, 100][yellow];
                        if(yellow == 0) score -= [0, 1, 10, 120][red];
                    }
                }
            }
            return score;
        }

        function search(depth, maximizing, alpha, beta){
            var score = evaluate(depth);
            if(depth == 0 || Math.abs(score) >= 1000000) return score;
            var best = maximizing ? -Infinity : Infinity;
            var hasMove = false;
            for(var i = 0; i < order.length; i++){
                var column = order[i], row = landingRow(column);
                if(row < 0) continue;
                hasMove = true;
                cells[column][row] = maximizing ? "Y" : "R";
                var value = search(depth - 1, !maximizing, alpha, beta);
                cells[column][row] = "*";
                best = maximizing ? Math.max(best, value) : Math.min(best, value);
                if(maximizing) alpha = Math.max(alpha, best);
                else beta = Math.min(beta, best);
                if(alpha >= beta) break;
            }
            return hasMove ? best : 0;
        }

        var bestColumn = null, bestScore = -Infinity;
        for(var i = 0; i < order.length; i++){
            var column = order[i], row = landingRow(column);
            if(row < 0) continue;
            cells[column][row] = "Y";
            var score = search(4, false, bestScore, Infinity);
            cells[column][row] = "*";
            if(score > bestScore){
                bestScore = score;
                bestColumn = column;
            }
        }
        return bestColumn;
    }

    instance.aiChipCycle = function(num_cycle){
        var board = window.board_g.getChildAt(0);
        if(num_cycle == 0){
            instance.aiDropChip();
            return;
        }
        board.phantom_chip.x = (((board.phantom_chip.x - board_g.x) + board.chip_size) %
            (board.chip_size * board.num_column)) + board_g.x;
        sleep(instance.ai_chip_cycle_delay).then(function(){
            instance.aiChipCycle(num_cycle - 1);
        });
    }

    instance.aiDropChip = function(){
        var board = window.board_g.getChildAt(0);
        var column = instance.selectAiColumn(board);
        if(column === null) return; // A full board has no legal move.
        instance.movePhantomChip(column);
        board.dropChip(column, "Y");
    }

    instance.turn = function(){
	if(instance.player_turn == "meatbag"){
	    instance.setPlayerTurn("geniusai");
	} else{
	    instance.setPlayerTurn("meatbag");
	}

	if(instance.player_turn == "geniusai"){
	    sleep(instance.ai_chip_cycle_delay).then(() => {
		instance.aiChipCycle(10);
	    });
	}
    }

    return instance;
}
