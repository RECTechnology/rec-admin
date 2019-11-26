build: clean
	npm run build:prod

build-docker: build
	docker build . -t rec-admin -f Dockerfile

test: 
	npm run build:prod

install: 
	npm install

lint: 
	npm run lint

deploy: build-docker
	docker tag rallf-admin ${REGISTRY_HOST}/rallf-admin
	docker push ${REGISTRY_HOST}/rallf-admin

clean:
	rm -rf dist