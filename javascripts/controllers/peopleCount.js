/**
 * Created by fang on 2017/6/5.
 */


angular.module('defenseApp')
    .controller('peopleCountCtrl', peopleCountController);

peopleCountController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function peopleCountController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [{'id': 0, 'name': '人员总数', 'icon': '/images/personResult.png', 'num': '260'}, {
        'id': 1,
        'name': '现役军人',
        'icon': '/images/peopleCount.png', 'num': '120'
    }, {
        'id': 2,
        'name': '军队文职人员',
        'icon': '/images/resultCount.png', 'num': '50'
    }, {
        'id': 3,
        'name': '地方人员',
        'icon': '/images/resultCount.png', 'num': '90'
    }];


}