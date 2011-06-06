TARGET=miroit.dir

all:
	mkdir ${TARGET}
	cp chrome.manifest ${TARGET}
	cp install.rdf ${TARGET}
	cp -r resources ${TARGET}
	mkdir ${TARGET}/chrome
	cp -r content ${TARGET}/chrome
	cp -r skin ${TARGET}/chrome
	(cd ${TARGET}; rm ../miroit.xpi; zip -r ../miroit.xpi *)
	rm -rf ${TARGET}

clean:
	rm -rf ${TARGET}
