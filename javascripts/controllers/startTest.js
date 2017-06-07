/**
 * Created by fang on 2017/6/6.
 */
angular.module('defenseApp')
    .controller('startTestCtrl', startTestController);

startTestController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools','$interval'];
function startTestController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools,$interval) {
    window.scrollTo(0, 0);
    // 倒计时
    $scope.minuteTime = 60;
    $scope.secondTime = 0;
    $scope.interval = $interval(function () {
        if ($scope.secondTime == 0) {
            $scope.secondTime = 60;
            $scope.minuteTime--;
            if ($scope.minuteTime == 0) {
                $scope.submitTest();
            }
        }
        $scope.secondTime--;
    }, 1000);

}