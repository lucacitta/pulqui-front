# PulquiCustomer

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



## Deploy Dev

```bash
# primero se debe compilar el desarrollo en docker local 
docker build -t pulqui-cutomer-front-dev .   

# Se ejecuta en ambiente local 
docker run -p 443:443 pulqui-cutomer-front-dev

# en caso de que lo quiera hacer con artefact registry:
# se configura la autenticación 
$ https://cloud.google.com/artifact-registry/docs/docker/store-docker-container-images#auth
gcloud auth configure-docker us-central1-docker.pkg.dev

# se tagea el contenedor de docker
docker tag pulqui-cutomer-front-dev us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-dev/pulqui-cutomer-front-dev

# Se crea en GCP :
docker push us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-dev/pulqui-cutomer-front-dev


docker build -t pulqui-cutomer-front-dev .
gcloud auth configure-docker us-central1-docker.pkg.dev
docker tag pulqui-cutomer-front-dev us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-dev/pulqui-cutomer-front-dev
docker push us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-dev/pulqui-cutomer-front-dev






docker build -t pulqui-cutomer-front-prod .
gcloud auth configure-docker us-central1-docker.pkg.dev
docker tag pulqui-cutomer-front-prod us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-prod/pulqui-cutomer-front-prod
docker push us-central1-docker.pkg.dev/pulqui-marketplace/pulqui-prod/pulqui-cutomer-front-prod


git checkout develop
git pull origin develop 
git push origin develop
git checkout dev
git pull origin dev
git merge develop 
git push origin dev
git checkout qa
git pull origin qa
git merge dev
git push origin qa
git checkout prod
git pull origin prod
git merge qa
git push origin prod
