<p align="center">
  <a href="https://fileswap.eliotatlani.fr/" target="blank"><img src="https://fileswap.eliotatlani.fr/assets/logo-B9jXNGHb.png" width="200" alt="Nest Logo" /></a>
</p>

## Description - FileSwap Backend

FileSwap is a versatile file converter that allows you to easily convert, compress, and resize your files across various formats.

The FileSwap server is built on the [NestJS](https://github.com/nestjs/nest) framework, utilizing the [sharp](https://sharp.pixelplumbing.com/) module for image processing. It is deployed in a Docker container running on a virtual machine, with Nginx serving as the web server.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
## With Docker

Build the image 

```bash
docker build -t <image-name> .
```

Run the container

```bash
docker run -d -p 3000:3000 <image-name>
```
