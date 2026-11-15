// Run with: node debug_test/draw_state.test.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
function setup(rows) {
    const messages = [];
    const board = {
        num_row: 6, num_column: 7,
        chip_arr: Array.from({length: 7}, (_, c) => rows.map(row => ({color: row[c]}))),
        phantom_chip: {is_ready: true, visible: true},
        setPhantomChipDrop(ready) { this.phantom_chip.is_ready = ready; this.phantom_chip.visible = ready; },
        chipCollide() { this.setPhantomChipDrop(true); },
        dropChip() { throw new Error('No chip may drop after a draw'); }
    };
    const context = vm.createContext({window: {board_g: {getChildAt: () => board}},
        console: {log(message) { messages.push(message); }},
        sleep() { throw new Error('No next turn may be scheduled after a draw'); }});
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../controller.js'), 'utf8'), context);
    return {controller: vm.runInContext('new Controller()', context), board, messages};
}
const draw = ['RRYYRRY', 'YYRRYYR', 'RRYYRRY', 'YYRRYYR', 'RRYYRRY', 'YYRRYYR'];
for(const player of ['meatbag', 'geniusai']) {
    const {controller, board, messages} = setup(draw);
    controller.player_turn = player;
    assert.strictEqual(controller.checkWin(), false);
    assert.strictEqual(controller.checkDraw(), true);
    controller.chipCollide({}, {});
    assert.strictEqual(controller.game_over, true);
    assert.strictEqual(board.phantom_chip.is_ready, false);
    assert.strictEqual(board.phantom_chip.visible, false);
    controller.dropClick();
    controller.aiChipCycle(0);
    controller.aiDropChip();
    controller.turn();
    assert.deepStrictEqual(messages, ['its a draw!']);
}
const incomplete = setup(draw);
incomplete.board.chip_arr[0][0].color = '*';
assert.strictEqual(incomplete.controller.checkDraw(), false, 'One empty cell is not a draw');
assert.strictEqual(setup(Array(6).fill('*******')).controller.checkDraw(), false);
const win = setup(['RRRRRRY', ...draw.slice(1)]);
assert.strictEqual(win.controller.checkDraw(), false, 'Full winning board is not a draw');
win.controller.turn();
assert.deepStrictEqual(win.messages, ['its a win!']);
assert.strictEqual(win.controller.game_over, true);
console.log('Draw state checks passed');
