/**
 * Created by fang on 2017/6/4.
 */
/*userLogin--用户登录*/
angular.module('defenseApp')
    .controller('loginCtrl', LoginController);

LoginController.$inject = ['$scope', '$rootScope', '$state', 'APIService', 'Tools'];

function LoginController($scope, $rootScope, $state, $location, APIService, Tools) {

    $scope.selectUserType=[{'id':'0','name':'系统管理员'},{'id':'1','name':'考核对象'},{'id':'2','name':'组考人员'},{'id':'3','name':'普通用户'}];

    $scope.loginUI = function (param) {
        if(param==1){
            $state.go('home.nav');
        }
    }
}