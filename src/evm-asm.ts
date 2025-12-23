const opcodes = {

    "STOP"  :"00",  "ADD"   :"01",  "MUL" :"02",  "SUB"       :"03",
    "DIV"   :"04",  "SDIV"  :"05",  "MOD" :"06",  "SMOD"      :"07",
    "ADDMOD":"08",  "MULMOD":"09",  "EXP" :"0a",  "SIGNEXTEND":"0b",

    "LT"    :"10",  "GT"    :"11",  "SLT" :"12",  "SGT"       :"13",
    "EQ"    :"14",  "ISZERO":"15",  "AND" :"16",  "OR"        :"17",
    "XOR"   :"18",  "NOT"   :"19",  "BYTE":"1a",  "SHL"       :"1b",
    "SHR"   :"1c",  "SAR"   :"1d",  "CLZ" :"1e",

    "SHA3"  :"20",

    "ADDRESS"    :"30",  "BALANCE"       :"31",  "ORIGIN"        :"32",  "CALLER"      :"33",
    "CALLVALUE"  :"34",  "CALLDATALOAD"  :"35",  "CALLDATASIZE"  :"36",  "CALLDATACOPY":"37",
    "CODESIZE"   :"38",  "CODECOPY"      :"39",  "GASPRICE"      :"3a",  "EXTCODESIZE" :"3b",
    "EXTCODECOPY":"3c",  "RETURNDATASIZE":"3d",  "RETURNDATACOPY":"3e",  "EXTCODEHASH" :"3f",
    "BLOCKHASH"  :"40",  "COINBASE"      :"41",  "TIMESTAMP"     :"42",  "NUMBER"      :"43",
    "PREVRANDAO" :"44",  "GASLIMIT"      :"45",  "CHAINID"       :"46",  "SELFBALANCE" :"47",
    "BASEFEE"    :"48",  "BLOBHASH"      :"49",  "BLOBBASEFEE"   :"4a",

    "POP"   :"50",  "MLOAD" :"51",  "MSTORE":"52",  "MSTORE8" :"53",
    "SLOAD" :"54",  "SSTORE":"55",  "JUMP"  :"56",  "JUMPI"   :"57",
    "PC"    :"58",  "MSIZE" :"59",  "GAS"   :"5a",  "JUMPDEST":"5b",
    "TLOAD" :"5c",  "TSTORE":"5d",  "MCOPY" :"5e",  "PUSH0"   :"5f",
    "PUSH1" :"60",  "PUSH2" :"61",  "PUSH3" :"62",  "PUSH4"   :"63",
    "PUSH5" :"64",  "PUSH6" :"65",  "PUSH7" :"66",  "PUSH8"   :"67",
    "PUSH9" :"68",  "PUSH10":"69",  "PUSH11":"6a",  "PUSH12"  :"6b",
    "PUSH13":"6c",  "PUSH14":"6d",  "PUSH15":"6e",  "PUSH16"  :"6f",
    "PUSH17":"70",  "PUSH18":"71",  "PUSH19":"72",  "PUSH20"  :"73",
    "PUSH21":"74",  "PUSH22":"75",  "PUSH23":"76",  "PUSH24"  :"77",
    "PUSH25":"78",  "PUSH26":"79",  "PUSH27":"7a",  "PUSH28"  :"7b",
    "PUSH29":"7c",  "PUSH30":"7d",  "PUSH31":"7e",  "PUSH32"  :"7f",
    "DUP1"  :"80",  "DUP2"  :"81",  "DUP3"  :"82",  "DUP4"    :"83",
    "DUP5"  :"84",  "DUP6"  :"85",  "DUP7"  :"86",  "DUP8"    :"87",
    "DUP9"  :"88",  "DUP10" :"89",  "DUP11" :"8a",  "DUP12"   :"8b",
    "DUP13" :"8c",  "DUP14" :"8d",  "DUP15" :"8e",  "DUP16"   :"8f",
    "SWAP1" :"90",  "SWAP2" :"91",  "SWAP3" :"92",  "SWAP4"   :"93",
    "SWAP5" :"94",  "SWAP6" :"95",  "SWAP7" :"96",  "SWAP8"   :"97",
    "SWAP9" :"98",  "SWAP10":"99",  "SWAP11":"9a",  "SWAP12"  :"9b",
    "SWAP13":"9c",  "SWAP14":"9d",  "SWAP15":"9e",  "SWAP16"  :"9f",
    "LOG0"  :"a0",  "LOG1"  :"a1",  "LOG2"  :"a2",  "LOG3"    :"a3",
    "LOG4"  :"a4",

    "CREATE"      :"f0",  "CALL"   :"f1",  "CALLCODE"  :"f2",  "RETURN"      :"f3",
    "DELEGATECALL":"f4",  "CREATE2":"f5",
                                           "STATICCALL":"fa",
                          "REVERT" :"fd",  "INVALID"   :"fe",  "SELFDESTRUCT":"ff"

};

function _5e8904_(_3e_:string, _92_:number) {
    const delimiters = [' ', '\n', '\t'];
    let _f3_ = _92_; // end of token pointer
    let _f4_ = _92_; // end of consumption chunk pointer (or start of next token pointer)
    let _5c_ = false; // signal marking "delimiter consumption mode"
    let _73_ = false; // signal marking end of token
    let _bd_ = false; // signal marking "comment mode"
    while (true) {
        if (_73_ == true) {
            _5c_ = true;
            _f3_ = _f4_ - 1;
            _73_ = false;
        }
        if (_f4_ >= _3e_.length) {
            if (_5c_ == false) _f3_ = _f4_;
            break;
        };
        const _55_ = _3e_.charAt(_f4_);
        if (_5c_ == false) {
            if (_55_ == "#") {
                _73_ = true;
                _bd_ = true;
                _f4_++;
                continue;
            }
            for (const delimiter of delimiters)
                if (_55_ == delimiter) _73_ = true;
            _f4_++;
            continue;
        }
        let _1d_ = true; // assume we found a new token/non-delimiter char
        if (_55_ == "#") _bd_ = true; // potentially enter comment mode
        if (_bd_ == true) { // if in comment mode, we never find a new token. exit comment mode on newline
            if (_55_ == '\n') {
                _bd_ = false;
            }
            _1d_ = false;
        } else { // if not in comment mode, we do not find a new token if we have a delimiter
            for (const delimiter of delimiters)
                if (_55_ == delimiter) _1d_ = false;
        }
        if (_1d_ == true) break; // if we found a new token we can exit this consumption chunk
        _f4_++;
    }
    let token = _3e_.slice(_92_, _f3_);
    let type = undefined;
    if (token.length == 0) type = -1; // should catch starting "delimiter" spaces if they exist
    if (token.charAt(token.length - 1) == ':') { type = 0; token = token.slice(0, token.length - 1); } // label
    if (opcodes[token as keyof typeof opcodes] !== undefined) type = 1; // instruction
    if (type === undefined && (token.length & 1) == 0) {
        if (token.match(/^[0-9a-f]+$/g)) type = 2; // hex literal
    }
    if (type === undefined) type = 3; // identifier
    return [_f4_, { token, type }] as [number, { token:string, type:number }];
}

function _992d55_(_79_:ReturnType<typeof _95f73e_>, _09_?:{ [k:string]:string }) {
    const labels = new Map<string,number>();
    const references = new Map<string,number|string>();
    const addresses = new Map<typeof _79_[number],number>();
    let unresolved:number, changes:number, pc:number;
    do {
        unresolved = 0, changes = 0, pc = 0;
        for (let i = 0; i < _79_.length; i++) {
            const _87_ = _79_[i]!;
            if (_09_ && _09_[_87_.token] != undefined) {
                _87_.token = _09_[_87_.token]!;
                _87_.type = 2;
            }
            const { token, type } = _87_;
            if (type == 0) {
                if (labels.get(token) != pc) {
                    changes++;
                    labels.set(token, pc);
                    addresses.set(_87_, pc);
                }
                if (token == "RUN") pc = 0;
            }
            if (type == 1) {
                addresses.set(_87_, pc);
                pc++;
            }
            if (type == 2) {
                addresses.set(_87_, pc);
                pc += token.length >> 1;
            }
            if (type == 3) {
                addresses.set(_87_, pc);
                let _77_ = labels.get(token);
                if (_77_ == undefined) unresolved++;
                if (_77_ != undefined && references.get(token) != _77_) {
                    references.set(token, _77_);
                    changes++;
                }
                if (_77_ != undefined && _77_ < 256 && _79_[i - 1]!.token == "PUSH2") {
                    _79_[i - 1]!.token = "PUSH1";
                    changes++;
                }
                if (_77_ != undefined && _77_ <= 0xff) pc++;
                if (_77_ != undefined && _77_ > 0xff && _77_ <= 0xffff) pc += 2;
                if (_77_ != undefined && _77_ > 0xffff) throw new Error(`unexpectedly large program counter (${pc})`);
            }
        }
        if (labels.get("RUNSIZE") != pc) {
            labels.set("RUNSIZE", pc);
            changes++;
        }
        // await new Promise(r => setTimeout(r, 100));
        if (changes == 0) break;
    } while (unresolved > 0 || changes > 0);
    for (const foo of _79_) {
        if (foo.type == 3 && !references.has(foo.token)) {
            throw new Error(`identifier missing reference: ${JSON.stringify(foo)}`);
        }
    }
    const _6a_ = pc + (labels.get("RUN") ?? 0);
    const _e3_ = new Array(_6a_);
    for (let i = 0, j = 0; i < _79_.length; i++){
        const _43_ = _79_[i]!;
        if (_43_.type == 0) continue;
        if (_43_.type == 1) {
            _e3_[j] = opcodes[_43_.token as keyof typeof opcodes];
            j++;
        }
        if (_43_.type == 2) {
            _e3_[j] = _43_.token;
            j += _43_.token.length >> 1;
        }
        if (_43_.type == 3) {
            const _20_ = references.get(_43_.token)!.toString(16);
            _e3_[j] = _20_.padStart(_20_.length + 1 & ~1, '0');
            j += _e3_[j].length >> 1;
        }
    }
    return _e3_.join('');
}

function _95f73e_(code:string) {
    const _0d_:Array<typeof _3a_> = [];
    let _00_ = 0;
    let _3a_:ReturnType<typeof _5e8904_>[1];
    while (true) {
        if (_00_ == code.length) break;
        [_00_, _3a_] = _5e8904_(code, _00_);
        if (_3a_.type == -1) continue; 
        _0d_.push(_3a_);
    }
    return _0d_;
}

/**
 * @param {object} _1b_ - A mapping of identifier literals to hex literals.
 * Any identifier type token in the assembly code which matches a key in this mapping will be converted to a hex literal type, with the token value replaced by the mapping value.
 */
function assemble(code:Parameters<typeof _95f73e_>[0], _1b_?:Parameters<typeof _992d55_>[1]) {
    return _992d55_(_95f73e_(code), _1b_);
}

export { assemble };