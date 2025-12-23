# evm-asm
This is a simple, minimal, and experimental Ethereum/EVM assembler in TypeScript/JavaScript. 

## Why?
I think it's important to know how smart contracts actually work. However, writing bytecode by hand can suck a bit. Reading handwritten bytecode can be very difficult.
An assembler makes it so more readable files can be produced and it takes a lot of guesswork and trial-and-error out of handwriting bytecode and chasing down program counters and addresses.

# Notes
**This is highly untested, unstable, and incomplete.**<br>
We wrote an assembler before, this is a more recent rewriting. The new rewriting uses a lexer-parser style of intake rather than a fixed-width style of intake, allowing for more flexible formatting.
We also allowed dangling references and a mapping parameter so that such references can be converted into literals, allowing shorthand references to be written as if we were referring to labels, but we can substitute in
entire addresses or bytecode strings.
The below usage example uses a very mildly adapted version of EVM assembly we wrote a while ago (handwritten) for a CREATE2 contract.

## Installation
```sh
npm i @bradthomasbrown/evm-asm
```

## Usage
- `instructions` or `opcodes` are just the matching string from any EVM opcode reference, like `RETURNDATASIZE`, `CALLER`, `PUSH1`, etc.
- labels are anything else which end in a colon (`:`)
- hex literals are anything else which consist of an even amount of hexidecimal characters
- identifiers are anything else, which default to being references to a label, but can be "dangling" and used to substitute a hex string in via a mapping parameter
- **NOTE**: the `RUN:` label is a special label. For contract deployment, this is required in order to resolve and differentiate between labels and references in the `init` or `make` section of contract deployment and those in the `run` section of contract execution.
```js
import { _228529_ } from "@bradthomasbrown/evm-asm.js";

const code = `
#-MAKE----------# copy runcode to mem, trickle runcode size
PUSH1 RUNSIZE   # 00    # 60?r  #       ret size, trickle, ?r=57
DUP1            # 02    # 80    #       cc size
PUSH1 09        # 03    # 6009  #       cc offset
RETURNDATASIZE  # 05    # 3d    #       cc destOffset
CODECOPY        # 06    # 39    #   cc m00,?r=runcode
#---------------# return runcode from mem
RETURNDATASIZE  # 07    # 3d    #       ret offset
RETURN          # 08    # f3    #   ret
RUN: #----------# if (calldatasize) goto ?c else goto ?l
CALLDATASIZE    # 00    # 36    #       ji b [b]
PUSH1 ?c        # 01    # 60?c  #       ji counter [counter, b] ?c=0b
JUMPI           # 03    # 57    #   ji []
?l: #-----------# load slot 0 to mem at 00
RETURNDATASIZE  # 04    # 3d    #           sl key
SLOAD           # 05    # 54    #       ms value, sl
RETURNDATASIZE  # 06    # 3d    #       ms offset
MSTORE          # 07    # 52    #   ms m00,20=address
#---------------# return slot 0
MSIZE           # 08    # 59    #       ret size
RETURNDATASIZE  # 09    # 3d    #       ret offset
RETURN          # 0a    # f3    #   ret
?c: #-----------# if (caller == deployer) goto ?d else goto ?s
JUMPDEST        # 0b    # 5b    #
CALLER          # 0c    # 33    #           eq b
PUSH20 ?D       # 0d    # 73?D  #           eq a, ?D=?D??????????????????????????????????????
EQ              # 22    # 14    #       ji b, eq
PUSH1 ?d        # 23    # 60?d  #       ji counter ?d=27
JUMPI           # 25    # 57    #   ji []
?s: #-----------# halt
STOP            # 26    # 00    #   stop
?d: #-----------# copy code to mem, trickle code size
JUMPDEST        # 27    # 5b    #
PUSH1 20        # 28    # 6020  #           sub b [b]
CALLDATASIZE    # 2a    # 36    #           sub a [a, b]
SUB             # 2b    # 03    #       cdc size, sub [size]
PUSH1 20        # 2c    # 6020  #       cdc offset [offset, size]
RETURNDATASIZE  # 2e    # 3d    #       cdc destOffset [destOffset, offset, size]
CALLDATACOPY    # 2f    # 37    #   cdc m00,size=code []
#---------------# deploy first implementation, store address in slot 0
MSIZE           # 30    # 59    #           c size [size]
RETURNDATASIZE  # 31    # 3d    #           c offset [offset, size]
RETURNDATASIZE  # 32    # 3d    #           c value [value, offset, size]
CREATE          # 33    # f0    #       ss value, c [address]
RETURNDATASIZE  # 34    # 3d    #       ss key [key, address]
SSTORE          # 35    # 55    #   ss [] s0=address
#---------------# save generic init to mem
PUSH19 ?x       # 36    # 72?x  #       ms value, x=6020343434335afa3451803b343482933c34f3 [value, offset]
RETURNDATASIZE  # 4a    # 3d    #       ms offset [offset, value]
MSTORE          # 4b    # 52    #   ms 0d,20=init []
#---------------# deploy generic init
RETURNDATASIZE  # 4c    # 3d    #           cdl i
CALLDATALOAD    # 4d    # 35    #       cdl [salt]
PUSH1 13        # 4e    # 6013  #       [size, salt]
PUSH1 0d        # 50    # 600d  #       [offset, size, salt]
CALLVALUE       # 52    # 34    #       c2 value [value, offset, size, salt]
CREATE2         # 53    # f5    #   c2 [_address]
#---------------# clear slot 0
RETURNDATASIZE  # 54    # 3d    #       ss value
RETURNDATASIZE  # 55    # 3d    #       ss key
SSTORE          # 56    # 55    #   ss s0=0
`;

console.log(assemble(code, {
    "?D": "0102030401020304010203040102030401020304",
    "?x": "6020343434335afa3451803b343482933c34f3"
}));
// 60578060093d393df336600b573d543d52593df35b3373010203040102030401020304010203040102030414602757005b6020360360203d37593d3df03d55726020343434335afa3451803b343482933c34f33d523d356013600d34f53d3d55
```