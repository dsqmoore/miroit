TARGET=miroit.dir

all:
	mkdir ${TARGET}
	cp chrome.manifest ${TARGET}
	cp install.rdf ${TARGET}
	mkdir ${TARGET}/chrome
	cp -r content ${TARGET}/chrome
	cp -r skin ${TARGET}/chrome
	(cd ${TARGET}; zip -r ../miroit.xpi *)
	rm -rf ${TARGET}

clean:
	rm -rf ${TARGET}
