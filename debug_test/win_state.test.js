// Run with: node debug_test/win_state.test.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const path = require('path');
function setup(color, direction) {
    const state = {
        num_row: 6, num_column: 7,
        chip_arr: Array.from({length: 7}, () => Array.from({length: 6}, () => ({color: '*'}))),
        phantom_chip: {is_ready: true, visible: true},
        setPhantomChipDrop(ready) { this.phantom_chip.is_ready = ready; this.phantom_chip.visible = ready; },
        dropChip() { throw new Error('No chip may drop after a win'); },
        chipCollide() { this.setPhantomChipDrop(true); }
    };
    if(direction) for(let i = 0; i < 4; i++) {
        state.chip_arr[direction[0] + i * direction[2]][direction[1] + i * direction[3]].color = color;
    }
    const context = vm.createContext({window: {board_g: {getChildAt: () => state}}, console: {log() {}},
        sleep() { throw new Error('No next turn may be scheduled after a win'); }});
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../controller.js'), 'utf8'), context);
    return {controller: vm.runInContext('new Controller()', context), state};
}
assert.strictEqual(setup().controller.checkWin(), false, 'Empty board is not won');
for(const color of ['R', 'Y']) {
    for(const direction of [[0, 5, 1, 0], [2, 2, 0, 1], [0, 0, 1, 1], [0, 5, 1, -1]]) {
        const {controller, state} = setup(color, direction);
        controller.player_turn = color === 'R' ? 'meatbag' : 'geniusai';
        assert.strictEqual(controller.checkWin(), true, 'Detect each winning direction');
        controller.chipCollide({}, {});
        assert.strictEqual(controller.game_over, true);
        assert.strictEqual(state.phantom_chip.is_ready, false);
        assert.strictEqual(state.phantom_chip.visible, false);
        controller.dropClick();
        controller.aiChipCycle(0);
        controller.aiDropChip();
        controller.turn();
    }
}
console.log('Win state checks passed');
