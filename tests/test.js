var lzg = require("../lib/lib.js");
var fs = require("fs");
var sha1 = require("sha1");
var assert = require("assert");
var loremIpsum = require("lorem-ipsum").loremIpsum;
var chalk = require("chalk");
var path = require("path");
const { execFileSync } = require("child_process");
var thisDir = path.dirname(fs.realpathSync(__filename)) + "/";

var logProgress = chalk.bgYellow.black;
var logSuccess = chalk.bgGreen.black;

(async () => {
  console.log(logProgress("Preparing payload"));

  var payload = loremIpsum({ count: 30, units: "paragraphs", format: "plain" });

  fs.writeFileSync(thisDir + "test.txt", new Buffer.from(payload));

  console.log(logProgress("Compressing random..."));
  await lzg.compressFileAsync(
    thisDir + "test.txt",
    thisDir + "test.lzg",
    9,
    true
  );

  console.log(logProgress("Decompressing random..."));
  await lzg.decompressFileAsync(
    thisDir + "test.lzg",
    thisDir + "decompr.txt",
    true
  );

  var compressedData = fs.readFileSync(thisDir + "test.lzg");
  var decOut = fs.readFileSync(thisDir + "decompr.txt").toString();

  assert.ok(
    compressedData.length < payload.length,
    "Compressed data should be smaller than payload"
  );
  assert.equal(
    sha1(decOut),
    sha1(payload),
    "Decompresed data should be exact same as paload"
  );

  console.log(logSuccess("Test passed"));

  fs.unlinkSync(thisDir + "test.txt");
  fs.unlinkSync(thisDir + "decompr.txt");
  fs.unlinkSync(thisDir + "test.lzg");

  console.log(logProgress("Compressing literature..."));
  await lzg.compressFileAsync(
    thisDir + "mobydick.txt",
    thisDir + "mobydick-1.lzg",
    1,
    true
  );
  await lzg.compressFileAsync(
    thisDir + "mobydick.txt",
    thisDir + "mobydick-9.lzg",
    9,
    true
  );
  var compressedData1 = fs.readFileSync(thisDir + "mobydick-1.lzg");
  var compressedData9 = fs.readFileSync(thisDir + "mobydick-9.lzg");

  assert.ok(
    compressedData9.length < compressedData1.length,
    "Level 9 should compress better than level 1"
  );
  console.log(logSuccess("Test passed"));

  console.log(logProgress("Compressing via app..."));
  const callResult = execFileSync("node", [
    fs.realpathSync(`${thisDir}../bin/lzg`),
    "-v",
    "-l",
    "9",
    thisDir + "mobydick.txt",
    thisDir + "mobydick-9-app.lzg",
  ]).toString();
  console.log(callResult.toString());

  var compressedData9app = fs.readFileSync(thisDir + "mobydick-9-app.lzg");

  assert.ok(
    sha1(compressedData9app) == sha1(compressedData9),
    "App works same as lib"
  );
  console.log(logSuccess("Test passed"));

  fs.unlinkSync(thisDir + "mobydick-1.lzg");
  fs.unlinkSync(thisDir + "mobydick-9.lzg");
  fs.unlinkSync(thisDir + "mobydick-9-app.lzg");

  console.log(logSuccess("All tests passed"));
})();
