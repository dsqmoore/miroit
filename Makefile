# npsimple - simple NPAPI plugin test case

include config.mk

TEST = test.html
SRC = npsimple.c
OBJ = ${SRC:.c=.o}

all: options miroit.so ${shell uname}

options:
	@echo npsimple build options:
	@echo "CFLAGS   = ${CFLAGS}"
	@echo "LDFLAGS  = ${LDFLAGS}"
	@echo "CC       = ${CC}"

.c.o:
	@echo CC $<
	@${CC} -c ${CFLAGS} $<

${OBJ}: config.mk

miroit.so: ${OBJ}
	@echo LD $@
	@${CC} -v -shared -o $@ ${OBJ} ${LDFLAGS}

clean:
	@echo cleaning
	@rm -f miroit.so ${OBJ} Localized.rsrc
	@rm -rf miroit.plugin

Linux:
	@chmod 755 npsimple.so
	@echo Setup: sudo ln -s ${shell pwd}/npsimple.so /usr/lib/mozilla/plugins/npsimple.so
	@echo Test: /usr/lib/webkit-1.0/libexec/GtkLauncher file://`pwd`/${TEST} # apt-get install libwebkit-1.0-1

Darwin:
	/Developer/Tools/Rez -o Localized.rsrc -useDF Localized.r
	mkdir -p miroit.plugin/Contents/MacOS
	mkdir -p miroit.plugin/Contents/Resources/English.lproj
	cp -r Localized.rsrc miroit.plugin/Contents/Resources/English.lproj
	cp -f Info.plist miroit.plugin/Contents
	cp -f miroit.so miroit.plugin/Contents/MacOS/miroit

.PHONY: all options clean Darwin Linux
