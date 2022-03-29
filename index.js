#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const chalk = require('chalk');
const path = require('path');

//MEHTOD #3
//const lstat = util.promisify(fs.lstat);

//METHOD #4
const { lstat } = fs.promises;

const targetDir = process.argv[2] || process.cwd();
fs.readdir(targetDir, async (err, filenames) => {
    if(err){
        console.log(err);
    }
// THE GOOD SOLUTION 
    const statPromises = filenames.map(filename => {
        return lstat(path.join(targetDir, filename));
    });

   const allStats = await Promise.all(statPromises);

   for(let stats of allStats){
    const index = allStats.indexOf(stats);
    if(stats.isFile()){
        console.log(chalk.italic.red(filenames[index]));
    } else {
        console.log(chalk.bold.blue(filenames[index]));
    }
   }
});

// METHOD #2 (WRAP LSTAT INSIDE A PROMISE) is PREETY NICE 
// const lstat = (filename) => {
//     return new Promise((resolve, reject) =>{
//         fs.lstat(filename, (err, stats) =>{
//             if(err) {
//                 reject(err);
//             }
//             resolve(stats);
//         });
//     });
// };
    // NICE BUT NOT GOOD CODE 
    // const allStats = Array(filenames.length).fill(null);

    // for (let filename of filenames){
    //     const index = filenames.indexOf(filename);

    //     fs.lstat(filename, (err, stats) => {
    //         if(err){
    //             console.log(err);
    //         }

    //         allStats[index] = stats;

    //         const ready = allStats.every((stats) =>{
    //             return stats;
    //         });

    //         if(ready) {
    //             allStats.forEach((stats, index) =>{
    //                 console.log(filenames[index], stats.isFile());
    //             });
    //         }
    //     });
    // }


    // BAD CODE HERE!!!!! DON'T CODE LIKE THIS
    // for (let filename of filenames){
    //     fs.lstat(filename, (err, stats) => {
    //         if(err){
    //             console.log(err);
    //         }

    //         console.log(filename, stats.isFile());
    //     });
    // }
    // BAD CODE COMPLETE
    // ITS BAD BECAUSE IT DOES NOT RUN THE CALLBACK INSTANTLY WHICH CAUSE TO TREAT THE FILES WITHOUT CONCERN THE ORDER OF THE RESULTS OR THE CALLBACK INVOKED
