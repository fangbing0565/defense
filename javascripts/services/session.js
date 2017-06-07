/**
 * Created by gxu on 3/12/17.
 */
/**
 * Created by gxu on 1/30/17.存储用户当前状态
 */

'use strict';

angular
    .module('defenseApp')
    .factory('Session', ['$cookies', function ($cookies) {

        var userKey = 'sessionUser';
        var companyKey = 'sessionCompany';
        // 当用户选择'保持登录' 时， 保存用户credential到cookie， 之后自动登录。
        var userCredKey = 'userCred';

        // 保存用户登录状态。 当页面刷新或者重新打开时， session的initialize函数读取该cookie判断用户是否登录， 以及token等信息
        var loginKey = 'userLogin';

        // session DATA: session should save all kinds of status of current session,
        // 例如， 目前所在的公司， 楼， 层， 室
        var session = {
            user: undefined,
            company: undefined,
            dashboardData: undefined,
            hierarchyStack: [undefined, undefined, undefined],//存访问路径
            currentHierarchyLevel: -1,
            utilizationData: {},
            currentDevice: undefined//控制设备详情页
        };


        session.setUser = function(u){
            session.user = u;

        };

        session.setCompany = function (c) {
            session.company = c;
        };

        session.clearStack = function(level){
            for(var i=level; i<session.hierarchyStack.length; i++){
                session.hierarchyStack[i] = undefined;
            }
        };



        session.saveCompanyInfoToCookies = function (companyInfo) {
            session.setCompany(companyInfo);

            var expireDate = new Date();
            expireDate = new Date(expireDate.getTime() + 24 * 3600 * 1000);
            $cookies.putObject(companyKey, companyInfo, {expires: expireDate});
        };

        session.saveUserInfoToCookies = function (userInfo) {

            var expireDate = new Date();
            expireDate = new Date(expireDate.getTime() + 24 * 3600 * 1000);
            $cookies.putObject(userKey, userInfo, {expires: expireDate});
        };

        session.getUserFromCookie = function () {
            var userCookie = $cookies.getObject(userKey);
            console.log("authservice got cookie intelabUser");
            console.log(userCookie);

            if (userCookie) {
                session.user = userCookie;

            }
        };

        session.getCompanyFromCookie = function () {
            var companyCookie = $cookies.getObject(companyKey);
            console.log("authservice got cookie intelabCompany");
            console.log(companyCookie);

            if (companyCookie) {
                session.company = companyCookie;

            }
        };

        // Set session user, and creates a cookie if remember login flag is set
        session.saveCredentialsToCookies = function (userCredentials) {

            // set cookie expires one week later
            var expireDate = new Date();
            expireDate = new Date(expireDate.getTime() + 7 * 24 * 3600 * 1000);
            $cookies.putObject(userCredKey, userCredentials, {expires: expireDate});

        };

        session.getCredentialsFromCookies = function(){
            return $cookies.getObject(userCredKey);
        };

        session.saveLoginToCookies = function(loginStatus){
            var expireDate = new Date();
            expireDate = new Date(expireDate.getTime() +  24 * 3600 * 1000);
            $cookies.putObject(loginKey, loginStatus, {expires: expireDate});

            session.isLogin = loginStatus && loginStatus.loggedin;
        };

        session.clearLoginCookies = function(){
            $cookies.remove(loginKey);
        };

        session.getLoginFromCookie = function(){
            return $cookies.getObject(loginKey);
        };

        // Clear credentials when logout
        session.clearCredentialCookie = function () {
            $cookies.remove(userCredKey);

        };

        session.initialize = function () {
            session.getUserFromCookie();
            session.getCompanyFromCookie();
            var loginStatus = session.getLoginFromCookie();

            if(loginStatus && loginStatus.loggedin){
                session.isLogin = true;
            }else{
                session.isLogin = false;
            }
        };


        session.clearData = function(){
            session.user = undefined;
            session.company = undefined;
            session.dashboardData = null;
            session.hierarchyStack = [undefined, undefined, undefined];
            session.currentHierarchyLevel = -1;
            session.utilizationData = {};
            session.currentDevice = undefined;

        };

        session.clearAll = function () {
            session.clearData();
            session.clearCredentialCookie();
            session.clearLoginCookies();
        }


        return session;
    }]);
