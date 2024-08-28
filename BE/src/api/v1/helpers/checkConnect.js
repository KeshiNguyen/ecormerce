import mongoose from "mongoose";
import os from 'os';
import process from 'process';

'use strict'

const _SECONDES= 5000
//count connect 
const countConnect = () => {
    const numConnection = mongoose.connections.length;
    console.log(`Number of connections: ${numConnection}`);
}

//check over load
const checkOverLoad = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCore = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        const maxConnections = numCore * 10;
        console.log(`Active connections: ${numConnection}`);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
        if (numConnection > maxConnections) {
            console.log(`Connection overload dectected: ${numConnection}`);
        }
    }, _SECONDES)
}

export { checkOverLoad, countConnect };
