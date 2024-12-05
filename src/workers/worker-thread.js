const path = require('path');
const { workerData } = require('worker_threads');

if (process.env.NODE_ENV !== 'production') {
   require('ts-node').register();
}
require(path.resolve(workerData.path));

