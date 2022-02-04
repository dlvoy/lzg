(function (exports) {
  const fsp = require("fs").promises;
  const createLzgModule = require("./liblzg.js");
  var chalk = require("chalk");

  var compressAsync = async function (inBuffer, levelArg, verboseArg) {
    var verbose = verboseArg || false;
    var level = levelArg || 9;

    const em_module = await createLzgModule();
    em_module.printErr = function (msg) {};

    var inLen = inBuffer.length;
    var inPtr = em_module._malloc(inLen + 1);

    for (i = 0; i < inLen; i++) {
      em_module.setValue(inPtr + i, inBuffer.readInt8(i), "i8");
    }

    var maxEncSize = em_module._LZG_MaxEncodedSize(inLen);
    var outPtr = em_module._malloc(maxEncSize + 1);

    if (verbose) {
      console.log(chalk.yellow("Size: ") + inLen);
      console.log(chalk.yellow("MaxEnc: ") + maxEncSize);
    }

    var compLen = em_module.ccall(
      "compress_lzg",
      "number",
      ["number", "number", "number", "number", "number"],
      [level, inPtr, inLen, maxEncSize, outPtr]
    );
    if (verbose) {
      console.log(chalk.yellow("Compressed: ") + compLen);
    }

    em_module._free(inPtr);

    var outBuffer = new Buffer.alloc(compLen);
    for (i = 0; i < compLen; i++) {
      var value = em_module.getValue(outPtr + i, "i8");
      outBuffer.writeInt8(value, i);
    }
    em_module._free(outPtr);

    return outBuffer;
  };

  var decompressAsync = async function (inBuffer, verboseArg) {
    var verbose = verboseArg || false;

    const em_module = await createLzgModule();
    em_module.printErr = function (msg) {};

    var inLen = inBuffer.length;
    var inPtr = em_module._malloc(inLen + 1);

    for (i = 0; i < inLen; i++) {
      em_module.setValue(inPtr + i, inBuffer.readInt8(i), "i8");
    }

    var decSize = em_module.ccall(
      "LZG_DecodedSize",
      "number",
      ["number", "number"],
      [inPtr, inLen]
    );
    var outPtr = em_module._malloc(decSize + 1);

    if (verbose) {
      console.log(chalk.yellow("Size: ") + inLen);
      console.log(chalk.yellow("DecSize: ") + decSize);
    }

    var decompLen = em_module.ccall(
      "LZG_Decode",
      "number",
      ["number", "number", "number", "number"],
      [inPtr, inLen, outPtr, decSize]
    );
    if (verbose) {
      console.log(chalk.yellow("Decompressed: ") + decompLen);
    }

    em_module._free(inPtr);

    var outBuffer = new Buffer.alloc(decompLen);
    for (i = 0; i < decompLen; i++) {
      var value = em_module.getValue(outPtr + i, "i8");
      outBuffer.writeInt8(value, i);
    }
    em_module._free(outPtr);

    return outBuffer;
  };

  var compressFileAsync = async function (
    filePathPlain,
    filePathCompressed,
    level,
    verbose
  ) {
    var verbose = verbose || false;
    var level = level || 9;

    var inRawBuffer = await fsp.readFile(filePathPlain);

    if (verbose) {
      console.log(chalk.cyan("Compressing: ") + filePathPlain);
    }

    var res = await compressAsync(inRawBuffer, level, verbose);

    await fsp.writeFile(filePathCompressed, res);
    if (verbose) {
      console.log(chalk.green("Done: ") + filePathCompressed);
    }
  };

  var decompressFileAsync = async function (
    filePathCompressed,
    filePathPlain,
    verbose
  ) {
    var verbose = verbose || false;
    var level = level || 9;

    var inRawBuffer = await fsp.readFile(filePathCompressed);

    if (verbose) {
      console.log(chalk.cyan("Decompressing: ") + filePathCompressed);
    }

    var res = await decompressAsync(inRawBuffer, verbose);

    await fsp.writeFile(filePathPlain, res);
    if (verbose) {
      console.log(chalk.green("Done: ") + filePathPlain);
    }
  };

  exports.compressFileAsync = compressFileAsync;
  exports.compressAsync = compressAsync;
  exports.decompressFileAsync = decompressFileAsync;
  exports.decompressAsync = decompressAsync;
})(typeof exports === "undefined" ? (this.lzg = {}) : exports);
