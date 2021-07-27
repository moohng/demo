import { longRunning } from "./utils";

function run(fn) {
  Promise.resolve().then(() => {
    fn();
    completedCount++;
    console.log(completedCount);
    if (completedCount === 5) {
      console.timeEnd('time');
    }
  });
}

let completedCount = 0;

console.time('time');

run(longRunning);
run(longRunning);
run(longRunning);
run(longRunning);
run(longRunning);

console.log('=========');
