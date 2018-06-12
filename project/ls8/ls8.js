const RAM = require('./ram');
const CPU = require('./cpu');
const fs = require('fs');

const args = process.argv;
console.log(args);

if (args.length != 3) {
    if (args.length < 3) console.error(' Missing arguments: \n\n     provide a file to run')
    if (args.length > 3) console.error(' Too many arguments: \n\n     can only handle one file')
    process.exit();
}

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {

    // Hardcoded program to print the number 8 on the console

    // const program = [ // print8.ls8
    //     "10011001", // LDI R0,8  Store 8 into R0
    //     "00000000",
    //     "00001000",
    //     "10011001", // LDI R1,9
    //     "00000001",
    //     "00001001",
    //     "10101010", // MUL R0,R1 <---
    //     "00000000",
    //     "00000001",
    //     "01000011", // PRN R0    Print the value in R0
    //     "00000000",
    //     "00000001"  // HLT       Halt and quit
    // ];

    // Load the program into the CPU's memory a byte at a time
    // for (let i = 0; i < program.length; i++) {
    //     cpu.poke(i, parseInt(program[i], 2));
    // }
    try {
        const regexp = /[0-9]{8}/gi;
        const program = fs.readFileSync(`${args[2]}`, "utf-8").match(regexp);

        //Load the program into the CPU's memory a byte at a time
        for (let i = 0; i < program.length; i++) {
            cpu.poke(i, parseInt(program[i], 2));
        }
    }
    catch (err) {
        console.log('invalid file, try again');
        process.exit();
    }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();