/**
 * Created by gxu on 3/12/17.
 */
angular.module('defenseApp')
    .factory('AuthService', ['$state', '$cookies', '$rootScope', 'Session', 'APIService',
        function ($state, $cookies, $rootScope, Session, APIService) {
            var service = {};

            // 定义按照用户角色的路由限制
            var routeRestrictionByRole = {
                'SERVICE_MANAGER': [
                    'home.companyList',
                    'home.userList',
                    'home.manageDeviceList',
                    'home.profile',
                    // 'home.deviceType',
                    'home.settingsDeviceType',
                    'home.hardwareVersion',
                    'home.mapView'
                ],
                'SERVICE_BUSINESS': [
                    'home.companyList',
                    'home.systemSettings',
                    'home.profile',
                    'home.mapView'
                ],
                'FIRM_MANAGER': [
                    'home.dashboard',
                    'home.hierarchy',
                    'home.userList',
                    'home.deviceDetail',
                    'home.deviceList',
                    'home.profile',
                    //'home.settings',
                    'home.settingsDeviceType',
                    //'home.settingsLocationRecovery',
                    'home.settingsLocationManagement',
                    'home.report'
                ],
                'DEFAULT': [
                    'home.dashboard',
                    'home.hierarchy',
                    'home.deviceDetail',
                    'home.deviceList',
                    'home.profile',
                    'home.report'
                ]

            };


            // 定义按照平台的路由限制
            // 之后， 如果login接口可以返回用户信息， 这个就不需要了
            var routeRestrictionByPlatform = {
                'COMPANY': [
                    'home.dashboard'

                ],
                'MANAGEMENT': [
                    'home.companyList'
                ]
            };

            service.authenticateRoute = function(toState){

                if(!Session.user){
                    Session.getUserFromCookie();
                }

                console.log("validate router");
                console.log(toState);
                console.log(Session.user);
                if(!Session.user || !toState || !toState.name){
                    return false;
                }

                var whiteList = [];

                //判断是否有用户信息, 有就用角色来判断， 没有就用平台来判断
                if(Session.user.role){
                    whiteList = routeRestrictionByRole[Session.user.role.authority] || routeRestrictionByRole['DEFAULT'];

                }else{
                    console.log(Session.user.company);
                    if(Session.user.company != undefined && Session.user.company.toLowerCase()!=="management"){
                        whiteList = routeRestrictionByPlatform['COMPANY'];
                    }else{
                        whiteList = routeRestrictionByPlatform['MANAGEMENT'];
                    }
                }

                console.log("whitelist");
                console.log(whiteList);


                return whiteList.indexOf(toState.name)>=0;
            };

            service.logoutUser = function () {

                APIService.logoutUser(function (res) {
                    console.log("clearData user info");
                    Session.clearAll();

                    console.log("goto login page");
                    $state.go("login");

                }, function (res) {
                    console.log(res);
                    console.log("清除sessionid不成功")

                    console.log("clearData user info");
                    Session.clearAll();
                    console.log("goto login page");
                    $state.go("login");
                });
            };

            return service;
        }]
    );