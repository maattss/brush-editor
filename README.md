# Brush Editor for ABB Paint Robots [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/maattss/brush-editor/blob/master/LICENSE)
Built with [Angular v7.2](https://angular.io/docs) by [Mats Tyldum](https://github.com/maattss) and [Tobias Sætre](https://github.com/Tobiasns). 

## Set up development environment
- Make sure you have Node.js and NPM installed. If not download and install it from [here](https://nodejs.org/en/).
- Clone repository.
- Change directory to the location of the project in your terminal.
- Run `npm install` to install all dependecies.
- Run `ng serve` for a dev server. 
- Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files changes.

*Development setup tested in MacOS Mojave and Windows 10, May 10th 2019*

#### Remark: Some functionality relies on a open connection to [Robot Web Service REST API](http://developercenter.robotstudio.com/blobproxy/devcenter/Robot_Web_Services/html/index.html) and a browser with CORS restrictions disabled.
- For testing purposes, [Robot Studio](https://new.abb.com/products/robotics/robotstudio) can be used for creating an instance of Robot Web Service. 
- See [this post](https://stackoverflow.com/questions/3102819/disable-same-origin-policy-in-chrome) for information on how to run Chrome with disabled web-security (CORS disabled). **Warning: Only use this for development!**

## External dependecies
- bootstrap4
- ng2-charts
- ngx-cookie-service
- filesaver.js
- popper.js
- math.js

## Code scaffolding
Run `ng generate component <component-name>` to generate a new component.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Screenshot
#### Application overview large screen
![Application overview large screen](https://i.imgur.com/6LNMGjg.png)

#### Application overview small screen
<img src="https://i.imgur.com/9S3vUyl.png" alt="Application overview small screen" width="50%"/>
