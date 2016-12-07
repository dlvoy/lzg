# LZG Compression

[![license](https://img.shields.io/github/license/dlvoy/lzg.svg)](https://github.com/dlvoy/lzg/blob/master/LICENSE)
[![NPM version](http://img.shields.io/npm/v/lzg.svg?style=flat)](https://www.npmjs.com/package/lzg)
[![Dependencies Status](http://img.shields.io/david/dlvoy/lzg.svg?style=flat)](https://david-dm.org/dlvoy/lzg)

**lzg** is library and command line tool to compress and decompress files and streams using LZG compression algorithm

LZG algorithm is a minimal implementation of an LZ77 class compression. The main characteristic of the algorithm is that the decoding routine is very simple, fast, and requires no memory.

In general, lzg does not compress as well as zlib, for instance. On the other hand the decoder is very simple and very fast - ideal for systems with tight memory limits or limited processing capabilities, including in-browser by pure JavaScript.

Compressed files can be easily decompresed in-browser with very low-footprint lzgmini decompressor:
https://github.com/mbitsnbites/liblzg/tree/master/src/extra/lzgmini.js

This Node.JS module is based on original C implementation of liblzg (ver. 1.0.9) by Marcus Geelnard

## Setup as command line tool

* install [Node.JS](https://nodejs.org) (if not already installed)
* from command line execute:

```sh
$ npm install -g lzg 
``` 

## Usage

Compression 
```sh
$ lzg [options] <originalFile> <compressedFile>
``` 

Decompression 
```sh
$ lzg -d <compressedFile> <decompressedFile>
``` 

For full list of supported options execute:
```sh
$ lzg -h
``` 

## Options

All options are *optional*. When not specified, they are *ignored* or have *default value*.
Boolean options are *true* if flag is present, *false* otherwise.

Option                                     | Type            | Default value
---                                        | :---:           | ---       
[`-d`, `--decompress`](#option-decompress) | `Boolean`       | false
[`-l`, `--level`](#option-level)           | `Integer` [1..9]| 9
[`-v`, `--verbose`](#option-verbose)       | `Boolean`       | false
[`-h`, `--help`](#option-help)             | `Boolean`       |
[`-V`, `--version`](#option-version)       | `Boolean`       |

### Option decompress

When this flag is given, tool decompress input file
otherwise (by default, without flag) tool compresses input file to output file.

### Option level

Specifies compression level, integer between 1 and 9
**1** is the fastest but weakest and **9** is the best but slowest

### Option verbose

When given, additional debug information are displayed on console

### Option help

Displays all options with short description.

### Option version

Displays version of application (match NPM/Git version number).

## Testing

```sh
$ npm test
``` 

## Using as library in Node.JS

### .compressFile(inputFilePath, outputFilePath, compressionlevel = 9, verbose = false)

compress specified input file to output file

```js
var lzg = require('lzg');
lzg.compressFile('big.txt', 'copressed.lzg', 9, true);
```

### .decompressFile(inputFilePath, outputFilePath, verbose = false)

decompress specified lzg file to original output file

```js
var lzg = require('lzg');
lzg.decompressFile('copressed.lzg', 'original.txt', true);
```

### .compress(sourceRawBuffer, compressionlevel = 9, verbose = false)

returns compressed Node.JS buffer object

### .decompress(sourceCompressedBuffer, verbose = false)

returns decompressed Node.JS buffer object

## Rebuilding liblzg from C sources

First, install and configure Emscripten from http://emscripten.org/

Then run command:
```sh
$ npm run build
``` 

or build it directly:

```sh
$ cd ./vendor
$ emmake make clean install
``` 

## Acknowledgements

This project is port of original C implementation of liblzg

Copyright (c) 2010-2015 Marcus Geelnard
http://liblzg.bitsnbites.eu/
https://github.com/mbitsnbites/liblzg

Transpiled to JavaScript using [Emscripten](http://emscripten.org/)

For compression test using text of [Moby Dick by Herman Melville](https://archive.org/details/mobydickorwhale01melvuoft)