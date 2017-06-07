/**
 * Created by gxu on 5/21/17.
 */
'use strict';

angular
    .module('defenseApp')
    .factory('Tools', ['$uibModal', function ($uibModal) {

        var tools = {};

        tools.popupErrAlert = function (title, message) {
            var templateStr = '<div class="modal-header with-border">' +
                '<h3 class="modal-title" style="color: red">' + title + '</h3>' +
                '</div>' +
                '<div class="modal-body" style="background-color: darkred">' +
                '<span style="color: whitesmoke; font-size: larger">' + message + '</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn" type="button" ng-click="cancel()">关闭</button>' +
                '</div>';

            $uibModal.open({
                template: templateStr,
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl',
                size: 'sm'

            });
        };

        tools.popupMessage = function (title, message) {
            var templateStr = '<div class="modal-header with-border">' +
                '<h3 class="modal-title">' + title + '</h3>' +
                '</div>' +
                '<div class="modal-body">' +
                '<span style="font-size: larger">' + message + '</span>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button class="btn" type="button" ng-click="cancel()">关闭</button>' +
                '</div>';

            $uibModal.open({
                template: templateStr,
                controller: 'ModalInstanceCtrl',
                controllerAs: '$ctrl'

            });
        };




        return tools;
    }]);