ORAN = \033[0;33m
RED = \033[0;31m
NC = \033[0m

compile_static:
	# clear out existing dist folder
	rm -rf ./dist
	mkdir ./dist

	# compile l10n files
	for f in src/l10n/*.ini; do (cat "$${f}"; echo) >> dist/data.ini; done
	
	# copy over static assets
	cp ./node_modules/jakecache/dist/jakecache.js ./node_modules/jakecache/dist/jakecache-sw.js dist/

build_dev:
	$(MAKE) compile_static

	# empty manifest
	cp src/manifest-dev.appcache dist/manifest.appcache
	echo "# Updated $(shell date +%x_%H:%M:%S:%N)" >> dist/manifest.appcache
	
	# run webpack
	npx webpack --watch

build_prod:
	$(MAKE) compile_static

	# manifest
	cp -r src/manifest.appcache dist/
	echo "# Updated $(shell date +%x_%H:%M:%S:%N)" >> dist/manifest.appcache
	
	# run webpack
	npx webpack
	printf `date +%y%m%d`.`git rev-parse --short HEAD` > dist/version

    ifdef BASEURL
    npx sscli -b https://$(BASEURL) -r dist/ -f xml -o > dist/sitemap.xml
    else
	echo "${ORAN}BASEURL not defined, sitemap.xml file was not generated${NC}"
    endif

build_app:
	$(MAKE) compile_static
	rm ./dist/jakecache.js ./dist/jakecache-sw.js

	# manifest
	cp src/manifest-dev.appcache dist/manifest.appcache
	echo "# Updated $(shell date +%x_%H:%M:%S:%N)" >> dist/manifest.appcache

	# run webpack
    ifdef MODELSPREFIX
	npx webpack --env APPLICATION=true --env MODELSPREFIX=$(MODELSPREFIX)
	printf `date +%y%m%d`.`git rev-parse --short HEAD` > dist/version
	rm -Rf dist/models
    else
	echo "${RED}You need to specify MODELSPREFIX, example: make build_app MODELSPREFIX=https://otranscribe.bsc.es${NC}"
    endif
	
