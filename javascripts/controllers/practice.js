/**
 * Created by fang on 2017/6/5.
 */
angular.module('defenseApp')
    .controller('practiceCtrl', practiceController);

practiceController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService',  'AuthService', 'Session', 'Tools'];
function practiceController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [{'id': 0, 'name': '专项练习','type':'special', 'icon': '/images/specialPractice.png','link':'home.test'}, {
        'id': 1,
        'name': '随机练习','type':'random',
        'icon': '/images/randomPactice.png','link':'home.test'
    },
        {'id': 2, 'name': '错题练习','type':'error', 'icon': '/images/errorPractice.png','link':'home.test'}, {
            'id': 3,
            'name': '模拟练习','type':'simulate',
            'icon': '/images/simulatePractice.png','link':'home.test'
        }];



    $scope.gotoTest = function (type) {
        localStorage.setItem('testType', type);
        $state.go('home.test', {type: type});
    };
}