all: test 

build: clean
		npm run build --prod

build-docker: build
	docker build . -t rec-admin -f Dockerfile

test: 
	npm test

deploy: build-docker
	docker tag rallf-admin ${REGISTRY_HOST}/rallf-admin
	docker push ${REGISTRY_HOST}/rallf-admin

clean:
	rm -rf dist