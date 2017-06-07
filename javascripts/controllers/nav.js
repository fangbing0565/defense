/**
 * Created by fang on 2017/6/4.
 */
angular.module('defenseApp')
    .controller('navigationCtrl', navigationController);

navigationController.$inject = ['$rootScope', '$scope', '$state', '$cookies', 'APIService', 'Menus', 'AuthService', 'Session', 'Tools'];
function navigationController($rootScope, $scope, $state, $cookies, APIService, Menus, AuthService, Session, Tools) {
    window.scrollTo(0, 0);
    $scope.menuList = [];
/*    var setupMenu = function () {

        if (Session.user.role.roleAuthority.name == 'FIRM_MANAGER') {
            $scope.menuList = Menus.firm_manager;
        }  else {
            $scope.menuList = Menus.default_user;
        }

    };*/
    // setupMenu();

    $scope.meauList = [{'id': 0, 'name': '个人练习', 'icon': '/images/practice.png','link':'home.practice'}, {
        'id': 1,
        'name': '题库管理',
        'icon': '/images/questionManage.png','link':'home.questionManage'
    },
        {'id': 2, 'name': '组织考核', 'icon': '/images/originiz.png','link':'home.startTest'}, {
            'id': 3,
            'name': '软件日志',
            'icon': '/images/softLog.png','link':'.test'
        }, {'id': 4, 'name': '人员信息管理', 'icon': '/images/personManage.png','link':'home.personManage'},
        {'id': 5, 'name': '查询统计', 'icon': '/images/searchResult.png','link':'home.searchResult'}, {
            'id': 6,
            'name': '系统设置',
            'icon': '/images/systemSet.png','link':'.test'
        }, {'id': 7, 'name': '进入考试', 'icon': '/images/test.png','link':'home.test','type':'official'}];

    $scope.gotoTest = function (type) {
        localStorage.setItem('testType', type);
        $state.go('home.test', {type: type});
    };

    $scope.newsList=[{'id':'0','name':'国产航母成功下水，我国取得历史性突破'},
        {'id':'1','name':'国产航母成功下水，我国取得历史性突破'},
        {'id':'2','name':'国产航母成功下水，我国取得历史性突破'},{'id':'3','name':'国产航母成功下水，我国取得历史性突破'},
        {'id':'4','name':'国产航母成功下水，我国取得历史性突破'},
        {'id':'5','name':'国产航母成功下水，我国取得历史性突破'}];
}