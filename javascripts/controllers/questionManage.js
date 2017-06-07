/**
 * Created by fang on 2017/6/5.
 */


angular.module('defenseApp')
    .controller('questionManageCtrl', questionManageController);

questionManageController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function questionManageController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [{'id': 0, 'name': '综合题库', 'icon': '/images/conprehensiveManage.png', 'link': 'home.practice'}, {
        'id': 1,
        'name': '公共试题库',
        'icon': '/images/publicQuestion.png', 'link': '.test'
    },
        {'id': 2, 'name': '专项题库', 'icon': '/images/specialQuestion.png', 'link': '.test'}];


}