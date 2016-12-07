var lzg = require('../lib/lib.js');
var fs = require('fs');
var sha1 = require('sha1');
var assert = require('assert');
var loremIpsum = require('lorem-ipsum');
var chalk = require('chalk');
var path = require('path');
var thisDir = path.dirname(fs.realpathSync(__filename)) + '/';

var logProgress = chalk.bgYellow.black;
var logSuccess = chalk.bgGreen.black;

console.log(logProgress('Preparing payload'));

var payload = loremIpsum({count: 30, units: 'paragraphs', format: 'plain'});

fs.writeFileSync(thisDir + 'test.txt', new Buffer(payload));

console.log(logProgress('Compressing random...'));
lzg.compressFile(thisDir + 'test.txt', thisDir + 'test.lzg', 9, true);

console.log(logProgress('Decompressing random...'));
lzg.decompressFile(thisDir + 'test.lzg', thisDir + 'decompr.txt', true);

var compressedData = fs.readFileSync(thisDir + 'test.lzg');
var decOut = fs.readFileSync(thisDir + 'decompr.txt').toString();

assert.ok(compressedData.length < payload.length, 'Compressed data should be smaller than payload');
assert.equal(sha1(decOut), sha1(payload), 'Decompresed data should be exact same as paload');

console.log(logSuccess('Test passed'));

fs.unlinkSync(thisDir + 'test.txt');
fs.unlinkSync(thisDir + 'decompr.txt');
fs.unlinkSync(thisDir + 'test.lzg');

console.log(logProgress('Compressing literature...'));
lzg.compressFile(thisDir + 'mobydick.txt', thisDir + 'mobydick-1.lzg', 1, true);
lzg.compressFile(thisDir + 'mobydick.txt', thisDir + 'mobydick-9.lzg', 9, true);
var compressedData1 = fs.readFileSync(thisDir + 'mobydick-1.lzg');
var compressedData9 = fs.readFileSync(thisDir + 'mobydick-9.lzg');

assert.ok(compressedData9.length < compressedData1.length, 'Level 9 should compress better than level 1');
console.log(logSuccess('Test passed'));

fs.unlinkSync(thisDir + 'mobydick-1.lzg');
fs.unlinkSync(thisDir + 'mobydick-9.lzg');

console.log(logSuccess('All tests passed'));
