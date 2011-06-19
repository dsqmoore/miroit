# npsimple version
VERSION = 0.3

# Customize below to fit your system

ifeq (${shell uname}, Darwin)
CPPFLAGS = -DVERSION=\"${VERSION}\" -DWEBKIT_DARWIN_SDK
LDFLAGS = -dynamiclib #-framework Carbon -framework CoreFoundation -framework WebKit
else
INCS = $(shell pkg-config --cflags-only-I libxul)
CPPFLAGS = -fPIC -DVERSION=\"${VERSION}\" -DXULRUNNER_SDK
#LDFLAGS = $(shell pkg-config --libs libc)
endif
CFLAGS = -g -pedantic -Wall -O2 ${INCS} ${CPPFLAGS}

# compiler and linker
CC = cc
