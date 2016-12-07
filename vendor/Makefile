# -*- mode: Makefile; tab-width: 4; indent-tabs-mode: t; -*-

################################################################################
# JavaSctipt / Node.js LZG port 
#
# Copyright (c) 2016 Dominik Dzienia
################################################################################

# Compiler and linker settings
CC = emcc
CFLAGS = -c -O3 -Os -Oz -funroll-loops -W -Wall
RM = rm -f
OUTLIB = liblzg.js

# Files
OBJS = encode.o \
	   decode.o \
       checksum.o \
	   lzgbridge.o 

# Master rule
all: $(OUTLIB)

# Clean rule
clean:
	$(RM) $(STATIC_LIB) *.o $(OUTLIB)

# Install
install: all
	cp $(OUTLIB) ../lib/$(OUTLIB)
	
# Object files build rules
encode.o: encode.c internal.h lzg.h
	$(CC) $(CFLAGS) $<

decode.o: decode.c internal.h lzg.h
	$(CC) $(CFLAGS) $<

checksum.o: checksum.c internal.h lzg.h
	$(CC) $(CFLAGS) $<

version.o: version.c internal.h lzg.h
	$(CC) $(CFLAGS) $<
	
lzgbridge.o: lzgbridge.c internal.h lzg.h
	$(CC) $(CFLAGS) $<
	
$(OUTLIB): $(OBJS)
	$(CC) $(OBJS) -o $(OUTLIB) -s EXPORTED_FUNCTIONS='["_compress_lzg", "_LZG_MaxEncodedSize", "_LZG_DecodedSize", "_LZG_Decode"]' -s ALLOW_MEMORY_GROWTH=1


