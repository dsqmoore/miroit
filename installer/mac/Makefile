all: clean build pack deploy

clean:
	rm -rf dmg

build:
	make -C ../../extension clean all
	make -C ../../plugin clean all

pack:
	mkdir -p dmg
	cp -r ../../plugin/miroit.plugin dmg/
	cp ../../extension/miroit.xpi dmg/{79287D2F-D399-471A-A95E-BCBED9AEDB3B}.xpi

deploy:
	/Developer/usr/bin/packagemaker --verbose --doc MiroItPlugin.pmdoc --out MiroItPlugin.pkg

install:
	sudo installer -pkg MiroItPlugin.pkg  -target /
