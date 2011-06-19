VERSION = $(shell grep Version miroit.spec | awk '{print $$2};' )
TOPDIR=$(PWD)/..

all: deps
	(rm -rf ../SOURCES/miroit-${VERSION})
	(mkdir -p ../SOURCES/miroit-${VERSION})
	(cd ../../../../plugin; git archive master --prefix plugin/ | tar -x -C ../installer/linux/rpm/SOURCES/miroit-${VERSION})
	(cd ../../../../extension; git archive master --prefix extension/ | tar -x -C ../installer/linux/rpm/SOURCES/miroit-${VERSION})
	(cd ../SOURCES; tar -czvf miroit-${VERSION}.tgz miroit-${VERSION})
	(rpmbuild --define '_topdir ${TOPDIR}' -ba miroit.spec)

deps:
	sudo yum-builddep -y miroit.spec
