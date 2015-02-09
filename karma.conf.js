module.exports = function(config){
  config.set({

    basePath : '',

    files : [
      'bower_components/angular/angular.min.js',
      'bower_components/angular-cookies/angular-cookies.min.js',
      'bower_components/angular-route/angular-route.min.js',
      'bower_components/ng-lodash/build/ng-lodash.min.js',
      'bower_components/async/lib/async.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'app/**/*.js',
      'test/**/*.js'
    ],

    autoWatch : true,
    frameworks: ['jasmine'],
    browsers : ['Chrome'],
    plugins : [
            'karma-chrome-launcher',
            'karma-jasmine'
            ]
  });
};