import assert from 'node:assert/strict';
import test from 'node:test';
import { assemble } from '../src/evm-asm.ts';

function readPush(code, offset) {
    const width = code[offset] - 0x5f;
    assert.ok(width >= 1 && width <= 2, 'label uses PUSH1 or PUSH2');
    const value = code.subarray(offset + 1, offset + 1 + width).reduce((n, b) => n * 256 + b, 0);
    return { value, next: offset + width + 1 };
}

test('forward jump beyond 0xff retains a two-byte operand', () => {
    const code = assemble(`PUSH2 finish JUMP\n${'STOP\n'.repeat(253)}finish: JUMPDEST STOP\n`);
    assert.equal(code.slice(0, 8), '61010156');
});

test('forward jumps on both sides of the PUSH1 boundary target JUMPDEST', () => {
    for (const instruction of ['PUSH1', 'PUSH2']) {
        for (let padding = 240; padding <= 270; padding++) {
            const code = Buffer.from(assemble(`${instruction} finish JUMP\n${'STOP\n'.repeat(padding)}finish: JUMPDEST STOP\n`), 'hex');
            const { value, next } = readPush(code, 0);
            assert.equal(code[next], 0x56, `${instruction}, padding ${padding}: operand must not consume JUMP`);
            assert.equal(value, next + 1 + padding);
            assert.equal(code[value], 0x5b);
            assert.equal(code.length, value + 2);
        }
    }
});

test('multiple references converge to the same forward target', () => {
    const code = Buffer.from(assemble(`PUSH2 finish POP PUSH2 finish JUMP\n${'STOP\n'.repeat(250)}finish: JUMPDEST STOP\n`), 'hex');
    const first = readPush(code, 0);
    assert.equal(code[first.next], 0x50);
    const second = readPush(code, first.next + 1);
    assert.equal(code[second.next], 0x56);
    assert.equal(first.value, second.value);
    assert.equal(code[first.value], 0x5b);
    assert.equal(first.value, second.next + 1 + 250);
});

test('short and backward references retain their compact encoding', () => {
    assert.equal(assemble('PUSH2 finish JUMP finish: JUMPDEST STOP'), '6003565b00');
    assert.equal(assemble('start: JUMPDEST PUSH2 start JUMP'), '5b600056');
});

test('RUN offset, RUNSIZE and runtime-relative jumps remain consistent', () => {
    for (const padding of [0, 250, 253, 270]) {
        const code = Buffer.from(assemble(`PUSH2 RUNSIZE PUSH2 RUN PUSH0 CODECOPY PUSH2 RUNSIZE PUSH0 RETURN\nRUN: PUSH2 finish JUMP\n${'STOP\n'.repeat(padding)}finish: JUMPDEST STOP\n`), 'hex');
        const size = readPush(code, 0);
        const start = readPush(code, size.next);
        assert.equal(size.value, code.length - start.value);
        const target = readPush(code, start.value);
        assert.equal(code[target.next], 0x56);
        assert.equal(code[start.value + target.value], 0x5b);
        assert.equal(start.value + target.value, code.length - 2);
    }
});
