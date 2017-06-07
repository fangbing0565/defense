/**
 * Created by fang on 2017/6/4.
 */

'use strict';

angular
    .module('defenseApp')
    .factory('APIService', APIService);

APIService.$inject = ['$http', '$state', 'Session'];

function APIService($http, $state, Session) {
    var service = {};

    service.deviceTest = false;

    $http.getData = function (url, onSuccess, onError) {
        console.log("send http GET " + url);
        $http.get(url).then(function (response) {
            onSuccess(response);
        }, function (response) {
            console.log("http request failed");
            console.log(response);
            if (response.status == "403") {
                console.log("您还未登录，请先登录！");

                //清楚session 数据和 登录状态cookie， 注意， 这里没有调用 clearAll(). 保留了用户credential的cookie，
                // 当回到login之后, 如果用户当初选择了保持登录状态， 依然可以用其来实现自动登录。
                Session.clearData();
                Session.clearLoginCookies();

                $state.go('login');
            }
            if (onError) {
                onError(response);
            }
            //   layer.msg(status);

        });
    };

    $http.postData = function (url, onSuccess, onError, data) {
        console.log("Send http POST " + url);
        if (!data) {
            $http.post(url).then(function (response) {
                onSuccess(response);
            }, function (response) {
                if (response.status == "403") {
                    //layer.msg(url);
                    console.log("您还未登录，请先登录！");

                    Session.clearData();
                    Session.clearLoginCookies();

                    $state.go('login');
                } else {
                    if (onError) {
                        onError(response);
                    }
                    //   layer.msg(status);
                }

            });
        } else {
            $http.post(url, data).then(function (response) {
                onSuccess(response);
            }, function (response) {
                if (response.status == "403") {
                    //layer.msg(url);
                    console.log("您还未登录，请先登录！");

                    Session.clearData();

                    $state.go('login');
                } else {
                    if (onError) {
                        onError(response);
                    }
                    //   layer.msg(status);
                }

            });
        }

    };

    service.uploadFile = function (apiUrl, uploadFile, onSuccess, onError) {

        if (service.deviceTest) {
            onSuccess();
            return;
        }

        console.log("upload url:" + apiUrl);
        console.log("upload file: " + uploadFile);

        var fd = new FormData();
        fd.append('file', uploadFile);
        $http.post(apiUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function (res) {
                if (onSuccess) {
                    onSuccess(res);
                }
            })
            .error(function (res, status, e) {
                console.log("failed to upload file " + status + ", err: " + e);
                if (onError) {
                    onError(res);
                }

            });


    };


    // ---------------------------- login API -----------------------------
    service.getCompanyInfo = function (companyName, onSuccess) {
        if (service.deviceTest) {
            onSuccess(TestTools.getCompanyInfoSample());
            return;
        }

        var queryStr = 'api/rest/firm/query/login/company?companyId=' + companyName.toUpperCase();
        console.log(queryStr);

        var processSuccess = function (response) {
            console.log(response);

            // TODO: the return value is not statndard, need to change but require backend change first
            onSuccess(response.data.data);
        };

        $http.getData(queryStr, processSuccess);
    };

    return service;
}