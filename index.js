const hooks = require("async_hooks");
const fs = require("fs");

function log(asyncId, type, triggerAsyncId) {
  fs.writeSync(
    1,
    `FROM RESOURCE: ${triggerAsyncId} - RESOURCE_ID: ${asyncId} - ${type}\n`
  );
}

/**
 * Every async call is a resource in async_hooks' point of view.
 *
 * This function in particular will call setTimeout four times: the first three do not create another resource, so they have the same triggerAsyncId;
 * the last call, however, does schedule another async process, 'secondIteration', which means another async resouce being created.
 * This resource has triggerAsyncId equals to the asyncId of the last setTimeout call.
 *
 */
function firstIteration() {
  setTimeout(() => {}, 5e3); // Supose asyncId 2
  setTimeout(() => {}, 5e3); // Supose asyncId 3
  setTimeout(() => {}, 5e3); // Supose asyncId 4

  setTimeout(secondIteration, 5e3); // Supose asyncId 5
}

function secondIteration() {
  setTimeout(() => {}, 5e3); // This triggerAsyncId will be 5.
}

function main() {
  const logHook = hooks.createHook({ init: log });
  logHook.enable();

  firstIteration();
}

main();
