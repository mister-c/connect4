var board;
var hardcoded_chip_arr;

board = {};

board.num_row      = 6;
board.num_column   = 7;
board.chip_arr = new Array(board.num_row);

hardcoded_chip_arr = Array(board.num_row);
hardcoded_chip_arr[0] = "*******";
hardcoded_chip_arr[1] = "*******";
hardcoded_chip_arr[2] = "*****R*";
hardcoded_chip_arr[3] = "*Y***Y*";
hardcoded_chip_arr[4] = "*R***Y*";
hardcoded_chip_arr[5] = "*R***Y*";

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


// for (var i = 0; i < board.num_row; i++){
//     chip_string = "";
//     for(var j = 0; j < board.num_column; j++){
//     	chip_string += board.chip_arr[j][i].color;
//     }
//     if(chip_string.match("R{4}|Y{4}") != null){
//     	console.log("its a win!");
//     }
// }

