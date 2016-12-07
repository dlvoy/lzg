/*

Copyright (c) 2016 Dominik Dzienia
Under MIT license

 */
#include "lzg.h"

lzg_uint32_t compress_lzg(int compLevel, unsigned char *decBuf, lzg_uint32_t decSize, lzg_uint32_t maxEncSize, unsigned char *encBuf) {
    lzg_encoder_config_t config;

    LZG_InitEncoderConfig(&config);
    config.fast = LZG_FALSE;

    switch (compLevel) {
        case 1: config.level = LZG_LEVEL_1;
            break;
        case 2: config.level = LZG_LEVEL_2;
            break;
        case 3: config.level = LZG_LEVEL_3;
            break;
        case 4: config.level = LZG_LEVEL_4;
            break;
        case 5: config.level = LZG_LEVEL_5;
            break;
        case 6: config.level = LZG_LEVEL_6;
            break;
        case 7: config.level = LZG_LEVEL_7;
            break;
        case 8: config.level = LZG_LEVEL_8;
            break;
        case 9:
        default:
            config.level = LZG_LEVEL_9;
            break;
    }

    return LZG_Encode(decBuf, decSize, encBuf, maxEncSize, &config);

}
