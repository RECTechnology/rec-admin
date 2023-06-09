
[ng-img]: https://img.shields.io/badge/Version-v13.3.4-blue.svg
[node-img]: https://img.shields.io/badge/Version-v16.10.0-blue.svg
[npm-img]: https://img.shields.io/badge/Version-v6.13.2-blue.svg
[test-img]: https://github.com/QbitArtifacts/rec-admin/workflows/Test/badge.svg
[stage-img]: https://github.com/QbitArtifacts/rec-admin/workflows/Test,%20Build%20and%20Deploy%20%5BSTAGE%5D/badge.svg
[prod-img]: https://github.com/QbitArtifacts/rec-admin/workflows/Test,%20Build%20and%20Deploy%20%5BPROD%5D/badge.svg
[link-stage]: https://admin.rec.qbitartifacts.com
[link-prod]: https://admin.rec.barcelona

# [<img src="https://rec.barcelona/wp-content/uploads/2018/04/Group-3151.png" width="25" />](https://admin.rec.barcelona) [REC Barcelona (Admin Panel)](https://admin.rec.barcelona)

Panel de administracion para [rec.barcelona](https://rec.barcelona).

## Information

### Status
| Test                       | [Stage][link-stage]         | [Prod][link-prod]          |
| -------------------------- | --------------------------- | -------------------------- |
| [![ngVersion][test-img]]() | [![ngVersion][stage-img]]() | [![ngVersion][prod-img]]() |


### Project Dependencies versions
| Angular                  | Node                       | Npm                        |
| ------------------------ | -------------------------- | -------------------------- |
| [![ngVersion][ng-img]]() | [![ngVersion][node-img]]() | [![ngVersion][node-img]]() |

### Usefull Links
* [Angular](https://angular.io)
* [Angular Material](https://material.angular.io)
* [Theming](https://material.angular.io/guide/theming)
* [Webpack](https://webpack.js.org/)

## Development
Please check [this wiki](https://github.com/QbitArtifacts/bootstrap/wiki/Development) out for internal documentation on how we develop.

### Setting Up
1. Install dependecies `npm install`  
    1.2. Install ng cli globaly `[sudo] npm install @angular/cli -g`  
2. Copy `src/environments/environment.ts.dist` to `src/environments/environment.ts`  
    2.1 Replace placeholders with real credentials and values (ask @nombrekeff if you are missing any values)  
3. Run dev server `ng serve` will start a server at `http://localhost:4200`  
4. App starts at `app/main.ts`  

### Building App
#### Development
1. Run `ng build`
2. App is available at: `/dist/index.html`
3. It's ready
   
#### Production
1. Run `ng build --prod`
2. App is available at: `/dist/index.html`
3. It's ready

### Pull request process
1. Create new branch from most recent branch: `master`  
   1. Example:  `nombrekeff-patch-user-profile`
   2. Format: `{username}-{type}-{name}`
2. `Commit` your changes
3. `Push` changes
4. Open `PR`
5. If passes tests and is validated it will be merged

### Commiting  
Project uses [conventional-commits](https://www.conventionalcommits.org/en/v1.0.0/) for commit messages to autogenerate automatic CHANGELOG and auto increment version.

### Package Scripts
```json
{
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "build:pre": "ng build",
    "build:prod": "ng build --prod",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
}
```
