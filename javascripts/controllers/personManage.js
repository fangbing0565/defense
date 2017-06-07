/**
 * Created by fang on 2017/6/6.
 */



angular.module('defenseApp')
    .controller('personManageCtrl', personManageController);

personManageController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function personManageController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [{'id': 0, 'name': '导入', 'icon': '/images/input.png', 'link': 'home.practice'}, {
        'id': 1,
        'name': '导出',
        'icon': '/images/output.png', 'link': '.test'
    }, {
        'id': 2,
        'name': '查看',
        'icon': '/images/lookup.png', 'link': '.test'
    }];
}