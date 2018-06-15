/**
 * LS-8 v2.0 emulator skeleton code
 */

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const POP = 0b01001100;
const PUSH = 0b01001101;
const JMP = 0b01010000;
const RET = 0b00001001;
const CALL = 0b01001000;
const CMP = 0b10100000;
const JEQ = 0b01010001;
const JNE = 0b01010010;


const SP = 7


// Flag values, less, greater, or equal to
const FL_L = 0x1 << 2;
const FL_G = 0x1 << 1;
const FL_E = 0x1 << 0;


class CPU {

    /**
     * Initialize the CPU
     */
    constructor(ram) {
        this.ram = ram;

        this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

        this.reg.FL = 0b00000000;
        
        this.reg[SP] = 0xf4; //stack pointer
        // Special-purpose registers
        this.PC = 0; // Program Counter
    }
    
    /**
     * Store value in memory address, useful for program loading
     */
    poke(address, value) {
        this.ram.write(address, value);
    }

    /**
     * Starts the clock ticking on the CPU
     */
    startClock() {
        this.clock = setInterval(() => {
            this.tick();
        }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
    }

    /**
     * Stops the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * ALU functionality
     *
     * The ALU is responsible for math and comparisons.
     *
     * If you have an instruction that does math, i.e. MUL, the CPU would hand
     * it off to it's internal ALU component to do the actual work.
     *
     * op can be: ADD SUB MUL DIV INC DEC CMP
     */
    alu(op, regA, regB) {
        switch (op) {
            case 'MUL':
                // !!! IMPLEMENT ME
                this.reg[regA] *= this.reg[regB];
                break;
        }
    }

    /**
     * Advances the CPU one cycle
     */
    tick() {
        // Load the instruction register (IR--can just be a local variable here)
        // from the memory address pointed to by the PC. (I.e. the PC holds the
        // index into memory of the instruction that's about to be executed
        // right now.)
        
        // !!! IMPLEMENT ME
        const IR = this.ram.read(this.PC);

        // Debugging output
        // console.log(`${this.PC}: ${IR.toString(2)}`);

        // Get the two bytes in memory _after_ the PC in case the instruction
        // needs them.

        // !!! IMPLEMENT ME
        const operandA = this.ram.read(this.PC + 1);
        const operandB = this.ram.read(this.PC + 2);

        // Execute the instruction. Perform the actions for the instruction as
        // outlined in the LS-8 spec.

        //Flag for PC advancment
        this.pcAdvance = true;

        // !!! IMPLEMENT ME

        switch(IR) {
            case LDI:
                // Set the value in a register
                this.reg[operandA] = operandB;
                // this.PC += 3; //Next Instruction
                break;

            case PRN:
                console.log(this.reg[operandA])
                // this.PC += 2;
                break;

            case MUL:
                this.alu('MUL', operandA, operandB);
                break;
                
            case HLT:
                this.stopClock();
                // this.PC += 1;
                break;

            case PUSH:
                this.reg[SP]--;
                this.ram.write(this.reg[SP], this.reg[operandA]);
                break;
                
            case POP:
                this.reg[operandA] = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                break; 
                
            case CALL:
                this.pushValue(this.PC + 2);
                this.reg.PC = this.reg[operandA];
                this.pcAdvance = false;
                break; 
                
            case RET:
                this.PC = this.ram.read(this.reg[SP]);
                this.reg[SP]++;
                this.pcAdvance = false;
                break;

            case JMP:
                this.reg.PC = this.reg[operandA];
                this.pcAdvance = false;
                break;

            case CMP:
                if (this.reg[operandA] === this.reg[operandB]) this.reg.FL |= FL_E;
                else this.reg.FL &= ~FL_E;
                if (this.reg[operandA] < this.reg[operandB]) this.reg.FL |= FL_L;
                else this.reg.FL &= ~FL_L;
                if (this.reg[operandA] > this.reg[operandB]) this.reg.FL |= FL_G;
                else this.reg.FL &= ~FL_G;
                break;

            case JEQ:
                if ((this.reg.FL &= 0b00000001) === 0b1) {
                  this.PCflag = true;
                  this.reg.PC = this.reg[operandA];
                };
                break;

            default:
                console.log('Unknown instruction: ' + IR.toString(2));
                this.stopClock();
                return;    
        }

        // Increment the PC register to go to the next instruction. Instructions
        // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
        // instruction byte tells you how many bytes follow the instruction byte
        // for any particular instruction.
        
        // !!! IMPLEMENT ME
        
        if (this.pcAdvance) {
            const instlen = (IR >> 6) +1;
            this.PC += instlen;
        }
        
    }

    pushValue(v) {
        this.reg[SP]--;
        this.ram.write(this.reg[SP], v);
    };
}

module.exports = CPU;
