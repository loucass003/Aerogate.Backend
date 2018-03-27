import path from 'path';
import { spawn } from 'child_process';
import { EventEmitter } from 'events'
import { byteArrayToInt, getBinary } from './utils'

export class Sniffer extends EventEmitter {
  constructor() {
    super();
    const process = spawn('python3', [path.join(__dirname, '../receiver.py')]);
    process.stdout.on('data', (data) => this.onData(data));
    process.stderr.on('data', (data) => this.onError(data));
    process.on('SIGINT', () => {
      if(!!process) process.kill();
      process.exit();
    });
  }
  onError(error) {
    this.emit('error', error);
  }
  onData(buffer) {
    const { data, time } = JSON.parse(buffer.toString('utf8'));
    const id = byteArrayToInt(getBinary(data, 0, 2));
    const command = byteArrayToInt(getBinary(data, 2, 4));
    const value = getBinary(data, 4, data.length)
    this.emit('data', { 
      id, 
      command, 
      value: { binary: value, int: byteArrayToInt(value) }, 
      time 
    });
  }
};