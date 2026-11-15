// Run with: node debug_test/ai_strategy.test.js
const assert = require('assert');
const fs = require('fs');
const vm = require('vm');
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(require('path').join(__dirname, '../controller.js'), 'utf8'), context);
const controller = vm.runInContext('new Controller()', context);
function board(stacks = []) {
    return { num_row: 6, chip_arr: Array.from({length: 7}, (_, c) =>
        Array.from({length: 6}, (_, r) => ({color: (stacks[c] || '')[5 - r] || '*'}))) };
}
function choose(stacks, expected, label) {
    const state = board(stacks);
    const before = JSON.stringify(state);
    assert.strictEqual(controller.selectAiColumn(state), expected, label);
    assert.strictEqual(JSON.stringify(state), before, 'Search must preserve board');
}
choose([], 3, 'Open in the center');
choose(['YYY', '', '', '', 'RRR'], 0, 'Take a win before blocking');
choose(['RRR'], 0, 'Block a vertical win');
choose(['Y', 'Y', 'Y'], 3, 'Complete a horizontal win');
choose(['R', 'R', 'R'], 3, 'Block a horizontal win');
choose(['Y', 'RY', 'RRY'], 3, 'Complete a rising diagonal');
choose(['RRRY', 'RRY', 'RY'], 3, 'Complete a falling diagonal');
choose(['R', 'YR', 'YYR'], 3, 'Block a diagonal win');
choose(Array(7).fill('RYRYRY'), null, 'Full board has no move');
const crowded = board(['RYRYRY', 'YRYRYR', 'RYRYRY', 'YRYRYR', 'RYRYRY', 'YRYRYR', 'RYRYR']);
assert.strictEqual(controller.selectAiColumn(crowded), 6, 'Use the only legal column');
let dropped;
context.window = {board_g: {getChildAt: () => board(['RRR'])}};
controller.movePhantomChip = c => { assert.strictEqual(c, 0); };
context.window.board_g.getChildAt = () => {
    const state = board(['RRR']);
    state.dropChip = (column, color) => { dropped = [column, color]; };
    return state;
};
controller.aiDropChip();
assert.deepStrictEqual(dropped, [0, 'Y'], 'Drop the selected move');
console.log('AI strategy checks passed');
