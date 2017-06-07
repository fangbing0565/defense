/**
 * Created by gxu on 1/30/17.
 */
'use strict';

angular
    .module('defenseApp')
    .factory('Menus', ['Session', function(Session){
        return {
            firm_manager: [
                {
                    name: 'DASHBOARD',
                    type: 'link',
                    url: '.dashboard',
                    icon: 'fa-dashboard',
                    menuId: 'lou-Distribute'

                },
                {
                    name: 'PROPERTY_MANAGEMENT',
                    type: 'tree',
                    icon: 'fa-building-o',
                    menuId: 'plate-set',
                    childMenu: [
                        {
                            name: 'DEVICE_TYPES',
                            type: 'link',
                            url: '.settingsDeviceType',
                            icon: 'fa-building-o',
                            menuId: 'plate-set-type'

                        },
                        {
                            name: 'LOCATION_MANAGEMENT',
                            type: 'link',
                            url: '.settingsLocationManagement',
                            icon: 'fa-building-o',
                            menuId: 'plate-set-location-mgt'

                        }
                        /* 暂时让楼层恢复下线。 重新设计。
                        ,
                        {
                            name: 'LOCATION_RECOVERY',
                            type: 'link',
                            url: '.settingsLocationRecovery',
                            icon: 'fa-building-o',
                            menuId: 'plate-set-location-recovery'

                        }
                        */
                    ]
                },

                {
                    name: 'USER_LIST',
                    type: 'link',
                    url: '.userList',
                    icon: 'fa-user',
                    menuId: 'user-List',
                    photobg: 'image/user-bg.png',
                    photoselect: 'image/user-select.png'
                },
                {
                    name: 'DEVICE_LIST',
                    type: 'link',
                    url: '.deviceList',
                    icon: 'fa-flask',
                    menuId: 'user-Unit',
                    photobg: 'image/userunit-bg.png',
                    photoselect: 'image/userunit-select.png'
                },
                {
                    name: 'STAT_REPORTS',
                    type: 'link',
                    url: '.report',
                    icon: 'fa-bar-chart',
                    menuId: 'chart-Report',
                    photobg: 'image/tjbg-bg.png',
                    photoselect: 'image/tjbg-select.png'
                }
            ],
            service_business: [
                {
                    name: 'COMPANY_LIST',
                    type: 'link',
                    url: '.companyList',
                    icon: 'fa-institution',
                    menuId: 'company-List',
                    photobg: 'image/index-bg.png',
                    photoselect: 'image/index-select.png'
                },
                {
                    name: 'MAP_SHOW',
                    type: 'link',
                    url: '.mapView',
                    icon: 'fa-map',
                    photobg: 'image/index-bgmap.png',
                    photoselect: 'image/index-selectmap.png'
                },
                {
                    name: 'DEVICE_TYPES',
                    type: 'link',
                    url: '.settingsDeviceType',
                    icon: 'fa-building-o',
                    menuId: 'plate-set-type'

                }
            ],
            service_manager: [
                {
                    name: 'COMPANY_LIST',
                    type: 'link',
                    url: '.companyList',
                    icon: 'fa-institution',
                    menuId: 'company-List',
                    photobg: 'image/index-bg.png',
                    photoselect: 'image/index-select.png'
                },
                {
                    name: 'USER_LIST',
                    type: 'link',
                    url: '.userList',
                    icon: 'fa-user',
                    menuId: 'user-List',
                    photobg: 'image/user-bg.png',
                    photoselect: 'image/user-select.png'
                },
                {
                    name: 'MAP_SHOW',
                    type: 'link',
                    url: '.mapView',
                    icon: 'fa-map',
                    menuId: 'map-Show',
                    photobg: 'image/index-bgmap.png',
                    photoselect: 'image/index-selectmap.png'
                },
                {
                    name: 'DEVICE_TYPES',
                    type: 'link',
                    url: '.settingsDeviceType',
                    icon: 'fa-building-o',
                    menuId: 'plate-set-type'

                }, {
                    name: 'DEVICE_LIST',
                    type: 'link',
                    url: '.manageDeviceList',
                    icon: 'fa-flask',
                    photobg: 'image/userunit-bg.png',
                    photoselect: 'image/userunit-select.png'
                }, {
                    name: 'HARDWARE_VERSION',
                    type: 'link',
                    url: '.hardwareVersion',
                    icon: 'fa-archive',
                    menuId: 'version',
                    photobg: 'image/version-bg.png',
                    photoselect: 'image/version-select.png'
                }
            ],
            default_user: [
                {
                    name: 'DASHBOARD',
                    type: 'link',
                    url: '.dashboard',
                    icon: 'fa-dashboard',
                    menuId: 'lou-Distribute',
                    photobg: 'image/index-bg.png',
                    photoselect: 'image/index-select.png'
                },
                {
                    name: 'DEVICE_LIST',
                    type: 'link',
                    url: '.deviceList',
                    icon: 'fa-flask',
                    menuId: 'user-Unit',
                    photobg: 'image/userunit-bg.png',
                    photoselect: 'image/userunit-select.png'
                },
                {
                    name: 'STAT_REPORTS',
                    type: 'link',
                    url: '.report',
                    icon: 'fa-bar-chart',
                    menuId: 'chart-Report',
                    photobg: 'image/tjbg-bg.png',
                    photoselect: 'image/tjbg-select.png'
                }
            ]


        }
    }]);
