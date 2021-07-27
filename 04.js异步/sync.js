import { longRunning } from "./utils";

console.time('time');

longRunning();
longRunning();
longRunning();
longRunning();
longRunning();

console.timeEnd('time');
