/**
 * Created by fang on 2017/6/4.
 */
var app = angular.module('defenseApp', ['ui.router', 'oc.lazyLoad', 'angularFileUpload', 'ngCookies', 'ui.bootstrap']);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
        var _lazyLoad = function (loaded) {
            return function ($ocLazyLoad) {
                return $ocLazyLoad.load(loaded, {serie: true})
            }
        };
        $stateProvider
            .state('login', {
                name: 'login',
                url: '/login',
                templateUrl: 'views/login.html',
                controller: 'loginCtrl',
                resolve: {
                    login_file: _lazyLoad([
                        'javascripts/controllers/login.js',
                        'javascripts/services/api.js'
                    ])
                }
            })
            .state('recoverPwd', {
                name: 'recoverPwd',
                url: '/recoverPwd',
                templateUrl: 'views/password.html',
                controller: 'recoverPwdCtrl',
                resolve: {
                    recoverPwd_file: _lazyLoad([
                        'javascripts/controllers/password.js',
                        'javascripts/services/api.js'
                    ])
                }
            })
            .state('home', {
                url: '/home',
                name: 'home',
                abstract: true,
                //templateUrl: 'views/home.html',
                data: {authRequired: true},
                views: {
                    '': {
                        templateUrl: 'views/home.html'
                    },

                    'footer@home': {
                        templateUrl: 'views/home/footer.html'
                    }
                }
            })
            .state('home.nav', {
                url: '/nav',
                name: 'nav',
                templateUrl: 'views/home/nav.html',
                controller: 'navigationCtrl',
                resolve: {
                    home_file: _lazyLoad([
                        'javascripts/services/api.js',
                        'javascripts/controllers/nav.js',
                        'javascripts/services/menu.js'
                    ])
                }
            })
            .state('home.test', {
                url: '/test/:type',
                name: 'test',
                templateUrl: 'views/home/test.html',
                controller: 'testCtrl',
                resolve: {
                    home_file: _lazyLoad([
                        'javascripts/controllers/test.js'
                    ])
                }
            }).state('home.practice', {
            url: '/practice',
            name: 'practice',
            templateUrl: 'views/home/practice.html',
            controller: 'practiceCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/practice.js'
                ])
            }
        }).state('home.questionManage', {
            url: '/questionManage',
            name: 'questionManage',
            templateUrl: 'views/home/questionManage.html',
            controller: 'questionManageCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/questionManage.js'
                ])
            }
        }).state('home.searchResult', {
            url: '/searchResult',
            name: 'searchResult',
            templateUrl: 'views/home/searchResult.html',
            controller: 'searchResultCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/searchResult.js'
                ])
            }
        }).state('home.personResult', {
            url: '/personResult',
            name: 'personResult',
            templateUrl: 'views/home/personResult.html',
            controller: 'personResultCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/personResult.js'
                ])
            }
        }).state('home.firmResult', {
            url: '/firmResult',
            name: 'firmResult',
            templateUrl: 'views/home/firmResult.html',
            controller: 'firmResultCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/firmResult.js'
                ])
            }
        }).state('home.personManage', {
            url: '/personManage',
            name: 'personManage',
            templateUrl: 'views/home/personManage.html',
            controller: 'personManageCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/personManage.js'
                ])
            }
        }).state('home.startTest', {
            url: '/startTest',
            name: 'startTest',
            templateUrl: 'views/home/startTest.html',
            controller: 'startTestCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/startTest.js'
                ])
            }
        }).state('home.testManage', {
            url: '/testManage',
            name: 'testManage',
            templateUrl: 'views/home/testManage.html',
            controller: 'testManageCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/testManage.js'
                ])
            }
        }).state('home.peopleCount', {
            url: '/peopleCount',
            name: 'peopleCount',
            templateUrl: 'views/home/peopleCount.html',
            controller: 'peopleCountCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/peopleCount.js'
                ])
            }
        }).state('home.firmCount', {
            url: '/firmCount',
            name: 'firmCount',
            templateUrl: 'views/home/firmCount.html',
            controller: 'firmCountCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/firmCount.js'
                ])
            }
        }).state('home.testQualified', {
            url: '/testQualified',
            name: 'testQualified',
            templateUrl: 'views/home/testQualified.html',
            controller: 'testQualifiedCtrl',
            resolve: {
                home_file: _lazyLoad([
                    'javascripts/controllers/testQualified.js'
                ])
            }
        });
        $urlRouterProvider.when('/home', '/home/nav');
        $urlRouterProvider.otherwise('/login');
    }]);

/*
 //登录状态保持
 app.run(function ($rootScope, $http, $state, $cookies, AuthService) {
 $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

 console.log("state transiting to " + toState.name);

 console.log("check if login needed for state " + toState.name);

 console.log(toState.data);
 if(toState.data) {
 console.log(toState.data.authRequired);
 }
 console.log($rootScope.session);
 //要求登陆状态判断
 var shouldLogin = toState.data !== undefined && toState.data.authRequired && !$rootScope.session.isLogin;

 //开发使用 /////////
 // for debug
 //shouldLogin = false;
 //////////////////////

 if (shouldLogin) {
 console.log("go to login");
 $state.go('login');
 event.preventDefault();
 return;
 }

 //路由限制

 if (toState.data && toState.data.authRequired && !AuthService.authenticateRoute(toState)) {
 //todo: show alert message
 //window.alert("not authorized, cannot go to " + toState.name);
 console.log("not authorized, cannot go to " + toState.name + " , goto login");
 $state.go('login');
 event.preventDefault();

 }


 });

 $rootScope.$on('$translateChangeSuccess', function (event, data) {
 console.log("language changed to " + data.language);
 $rootScope.lang = data.language;

 });

 });*/
