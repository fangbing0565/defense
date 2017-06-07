/**
 * Created by fang on 2017/6/5.
 */


angular.module('defenseApp')
    .controller('firmCountCtrl', firmCountController);

firmCountController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function firmCountController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [{'id': 0, 'name': '成绩查询', 'icon': '/images/personResult.png', 'link': 'home.personResult'}, {
        'id': 1,
        'name': '人员统计',
        'icon': '/images/peopleCount.png', 'link': 'home.peopleCount'
    }, {
        'id': 2,
        'name': '结果统计',
        'icon': '/images/resultCount.png', 'link': 'home.firmResult'
    }];


}