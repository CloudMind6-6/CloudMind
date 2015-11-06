'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams',
      function ($rootScope,   $state,   $stateParams) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG',
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
          var layout = "tpl/app.html";

          $urlRouterProvider
              .otherwise('/app/list');

          $stateProvider
              .state('app', {
                  abstract: true,
                  url: '/app',
                  templateUrl: layout
              })
              //project list
              .state('app.list', {
                  url: '/list',
                  templateUrl: 'tpl/app_projectlist.html',
                  resolve: load(['js/controllers/rootList.js'])
              })

              .state('access', {
                  url: '/access',
                  template: '<div ui-view class="fade-in-right-big smooth"></div>'
              })

              .state('access.signin', {
                  url: '/signin',
                  templateUrl: 'tpl/page_signin.html',
                  resolve: load( ['js/controllers/signin.js'] )
              })

              // table
              .state('app.table', {
                  url: '/table',
                  templateUrl: 'tpl/app_table.html'
              })

              // fullCalendar
              .state('app.calendar', {
                  url: '/calendar',
                  templateUrl: 'tpl/app_calendar.html',
                  // use resolve to load other dependences
                  resolve: load(['moment','fullcalendar','ui.calendar','js/app/calendar/calendar.js'])
              })

              // Mindmap
              .state('app.mindmap', {
                  url: '/mindmap',
                  templateUrl: 'tpl/app_mindmap.html',
                  // use resolve to load other dependences
                  resolve: load([   'js/app/mindmap/mindmap_model.js',
                                    'js/app/mindmap/mindmap_controller.js',
                                    'js/app/mindmap/mindmap_view.js'])
              })

              .state('app.form.fileupload', {
                  url: '/fileupload',
                  templateUrl: 'tpl/form_fileupload.html',
                  resolve: load(['angularFileUpload','js/controllers/file-upload.js'])
              })

              // others
              .state('access.404', {
                  url: '/404',
                  templateUrl: 'tpl/page_404.html'
              });

          function load(srcs, callback) {
            return {
                deps: ['$ocLazyLoad', '$q',
                  function( $ocLazyLoad, $q ){
                    var deferred = $q.defer();
                    var promise  = false;
                    srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                    if(!promise){
                      promise = deferred.promise;
                    }
                    angular.forEach(srcs, function(src) {
                      promise = promise.then( function(){
                        if(JQ_CONFIG[src]){
                          return $ocLazyLoad.load(JQ_CONFIG[src]);
                        }
                        angular.forEach(MODULE_CONFIG, function(module) {
                          if( module.name == src){
                            name = module.name;
                          }else{
                            name = src;
                          }
                        });
                        return $ocLazyLoad.load(name);
                      } );
                    });
                    deferred.resolve();
                    return callback ? promise.then(function(){ return callback(); }) : promise;
                }]
            }
          }


      }
    ]
  );
