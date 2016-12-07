(function () {

    var path = require('path');
    var fs = require('fs');
    var chalk = require('chalk');
    var program = require('commander');
    var filepath = require('filepath');
    var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');
    var lzg = require(lib + '/lib.js');

    require('pkginfo')(module, 'version');
    var inFilePath = false;
    var outFilePath = false;
    exports.run = function () {
        program
                .version(module.exports.version)
                .usage('[options] <inputFile> [outputFile]')
                .option('-l, --level [value]', 'Compression level', /^[1..9]{1}$/i)
                .option('-v, --verbose', 'Display debug output', false)
                .option('-c, --compress', 'Compress (default action)', true)
                .option('-d, --decompress', 'Decompress', false)
                .action(function (inputFile, outputFile, other) {

                    if (typeof outputFile !== 'object') {
                        outFilePath = outputFile;
                    }

                    inFilePath = inputFile;

                })
                .parse(process.argv);


        //----------------------------------------------------------------------

        if (!inFilePath) {
            console.log(chalk.underline.yellow("Please specify file to compress"));
            program.outputHelp();
            process.exit();
        } else {

            program.level = program.level || 9;
            program.verbose = program.verbose || false;

            var fileIn = filepath.create(inFilePath);
            if (!fileIn.exists()) {
                console.log(chalk.underline.red("Specified input file does not exists! ") + chalk.white(inFilePath));
                process.exit();
            }

            if (!outFilePath) {
                if (program.decompress) {
                    outFilePath = inFilePath + '.decompressed';
                } else {
                    outFilePath = inFilePath + '.lzx';
                }
            }

            var fileOut = filepath.create(outFilePath);

            if (program.decompress) {
                lzg.decompressFile(fileIn.toString(), fileOut.toString(), program.verbose);
            } else {
                lzg.compressFile(fileIn.toString(), fileOut.toString(), program.level, program.verbose);
            }

        }
    }

}).call(this);