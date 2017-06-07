/**
 * Created by fang on 2017/6/6.
 */

angular.module('defenseApp')
    .controller('testQualifiedCtrl', testQualifiedController);

testQualifiedController.$inject = ['$scope', '$state', '$rootScope', 'APIService', 'Session', 'Tools', '$interval'];

function testQualifiedController($scope, $state, $rootScope, APIService, Session, Tools, $interval) {
    window.scrollTo(0, 0);
    $scope.praMenuList = [
        {'id': 0, 'name': '补考', 'icon': '/images/errorPractice.png', 'link': 'home.test'}];
}