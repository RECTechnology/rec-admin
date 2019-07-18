
[ng-img]: https://img.shields.io/badge/Version-v4.3.3-blue.svg
[node-img]: https://img.shields.io/badge/Version-v6.11.2-blue.svg
[wp-img]: https://img.shields.io/badge/Version-v5.3.0-blue.svg
[npm-img]: https://img.shields.io/badge/Version-v2.2.1-blue.svg

# [<img src="https://rec.barcelona/wp-content/uploads/2018/04/Group-3151.png" width="25" />](https://admin.rec.barcelona) [REC Barcelona (Admin Panel)](https://admin.rec.barcelona)

Panel de administracion para [rec.barcelona](https://rec.barcelona)

## Information
### Build Status
[![CircleCI](https://circleci.com/gh/QbitArtifacts/rec-admin.svg?style=svg&circle-token=de5e8c8c8e7506b96c5c73f933530bb69b6ea988)](https://circleci.com/gh/QbitArtifacts/rec-admin)

### Project Dependencies versions
| Angular                  | Node                       | Npm                        | Webpack                  |
| ------------------------ | -------------------------- | -------------------------- | ------------------------ |
| [![ngVersion][ng-img]]() | [![ngVersion][node-img]]() | [![ngVersion][node-img]]() | [![ngVersion][wp-img]]() |

### Usefull Links
* [Angular](https://angular.io)
* [Angular Material](https://material.angular.io)
* [Theming](https://material.angular.io/guide/theming)
* [Webpack](https://webpack.js.org/)

## Development
Please check [this wiki](https://github.com/QbitArtifacts/bootstrap/wiki/Development) out for internal documentation on how we develop.

### Setting Up
1. Install dependecies `npm install`
2. Run dev server `npm serve` will start a server at `http://127.0.0.1:8080`
3. App starts at `app/main.ts`

### Building App
#### Development
1. Run `npm run build:dev`
2. App is available at: `/prod/index.html`
3. It's ready
   
#### Production
1. Run `npm run build:prod`
2. App is available at: `/prod/index.html`
3. It's ready


### Package Scripts
* `build:dev`  - Build dev app, with dev credentials
* `build:prod` - Build production app, minified and compressed

* `serve` - Serves with current environment

* `last-tag` - Returns the lastest tag
* `e2e` - runs e2e tests with protractor
* `e2e:headless` - runs e2e tests in headless mode with protractor

* `sass:theme` - Compile the theme
* `sass:theme:w` - Compile the theme and watches
  * Compiles: `/resources/css/theme.scss`
  * Outputs to: `/resources/css/theme.css`
