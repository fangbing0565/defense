/**
 * Created by fang on 2017/6/6.
 */
angular.module('defenseApp')
    .controller('personResultCtrl', personResultController);

personResultController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'AuthService', 'Session', 'Tools'];
function personResultController($rootScope, $scope, $state, $cookies, APIService, AuthService, Session, Tools) {
    window.scrollTo(0, 0);



}