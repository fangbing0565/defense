/**
 * Created by fang on 2017/6/6.
 */
angular.module('defenseApp')
    .controller('firmResultCtrl', firmResultController);

firmResultController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools', 'constantService'];
function firmResultController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools, constantService) {
    window.scrollTo(0, 0);
    $scope.selectCurrentPro = 1;
    $scope.selectCurrentCity = 1;
    // $scope.selectCurrentCounty=0;
    $scope.province = constantService.province;
    $scope.city=[];
    $scope.county=[];
    $scope.selCity=function () {
        var k=0;
        for (var i = 0; i < constantService.city.length; i++) {
            if (constantService.city[i].ProID == $scope.selectCurrentPro) {
                $scope.city[k] = constantService.city[i];
                k++;
            }
        }
    };
  $scope.selCounty= function () {
      var k=0;
      for (var i = 0; i < constantService.county.length; i++) {
            if (constantService.county[i].CityID == $scope.selectCurrentCity) {
                $scope.county[k] = constantService.county[i];
                k++;
            }
        }
    };


}