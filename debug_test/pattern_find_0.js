var board;
var hardcoded_chip_arr;

board = {};

board.num_row      = 6;
board.num_column   = 7;
board.chip_arr = new Array(board.num_row);

hardcoded_chip_arr = Array(board.num_row);
hardcoded_chip_arr[0] = "*******";
hardcoded_chip_arr[1] = "******R";
hardcoded_chip_arr[2] = "RR***RR";
hardcoded_chip_arr[3] = "YR***Y*";
hardcoded_chip_arr[4] = "*R***Y*";
hardcoded_chip_arr[5] = "*R***Y*";

hardcoded_pattern = Array(4);
hardcoded_pattern[0] = "OX";
hardcoded_pattern[1] = "XO";
hardcoded_pattern[2] = "OX";
hardcoded_pattern[3] = "OX";

// hardcoded_pattern = Array(2);
// hardcoded_pattern[0] = "XX";
// hardcoded_pattern[1] = "XX";

for (var i = 0; i < board.num_column; i++) {
    board.chip_arr[i] = Array(board.num_row);
    for(var j = 0; j < board.num_row; j++){
	board.chip_arr[i][j] = {};
	board.chip_arr[i][j].color = hardcoded_chip_arr[j][i];
    }
}

for (var i = 0; i < board.num_row; i++) {
    // console.log(chip_arr[i]);
    row_display_string = i + ") ";
    for(var j = 0; j < board.num_column; j++){
	row_display_string += " " + board.chip_arr[j][i].color;
    }
    console.log(row_display_string);
}


var findPattern = function(pattern, board, color){
    var row_display_string;
    var pattern_height;
    var pattern_width;
    var regex;

    pattern_height = pattern.length;
    pattern_width = pattern[0].length;

    chip_string = "";

    for(var i = 0; i < pattern.length; i++){
	pattern[i] = pattern[i].replace(/O/g, ".");
	pattern[i] = pattern[i].replace(/X/g, color);
	console.log("pattern[" + i + "]: " + pattern[i]);
    }

    // Flatten the board into one long string
    for (var i = 0; i < board.num_row; i++){
	// console.log(chip_arr[i]);
	for(var j = 0; j < board.num_column; j++){
	    chip_string += board.chip_arr[j][i].color;
	}
    }

    // Generate a regex

    //Generate the prefix of the regex
    //This is the most important part, because it prevents the regex from matching
    //patterns that aren't aligned to the grid width and height
    regex = "(^.{" + board.num_column * 0 + "," + (board.num_column * 0 + (board.num_column - pattern_width)) + "}" + pattern[0];
    for(var i = 1; i < board.num_row - pattern_height + 1; i++){
	regex += "|^.{" + board.num_column * i + "," + (board.num_column * i + (board.num_column - pattern_width)) + "}" + pattern[0];
    }
    regex += ")";

    for(var i = 1; i < pattern.length; i++){
	regex += ".{" + (board.num_column - pattern_width) + "}";
	regex += pattern[i];
    }

    console.log("final regex char: " + regex[regex.length-1]);
    
    console.log("chip string: " + chip_string);
    console.log("pattern height: " + pattern_height);
    console.log("pattern width: " + pattern_width);
    console.log("regex: " + regex);

    if(chip_string.match(regex)){
	console.log("match!");
	return true;
    }
    console.log("no match...");
    return false;
}

findPattern(hardcoded_pattern, board, "R");

// for (var i = 0; i < board.num_row; i++){
//     chip_string = "";
//     for(var j = 0; j < board.num_column; j++){
//     	chip_string += board.chip_arr[j][i].color;
//     }
//     if(chip_string.match("R{4}|Y{4}") != null){
//     	console.log("its a win!");
//     }
// }

