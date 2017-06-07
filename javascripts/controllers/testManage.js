/**
 * Created by fang on 2017/6/6.
 */
angular.module('defenseApp')
    .controller('testManageCtrl', testManageController);

testManageController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function testManageController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);

    $scope.praMenuList = [{'id': 0, 'name': '受考单位', 'icon': '/images/AssessmentUnit.png', 'link': 'home.personResult'}, {
        'id': 1,
        'name': '随机抽考',
        'icon': '/images/AssessmentRandom.png', 'link': 'home.firmResult'
    }, {
        'id': 2,
        'name': '考核条件',
        'icon': '/images/AssessmentCondition.png', 'link': 'home.firmResult'
    }, {
        'id': 3,
        'name': '开始考核',
        'icon': '/images/startTest.png', 'link': 'home.startTest'
    }];
}