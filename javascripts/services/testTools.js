/**
 * Created by gxu on 4/9/17.
 */
'use strict';

angular
    .module('defenseApp')
    .factory('TestTools', TestTools);

TestTools.$inject = ['Session'];

function TestTools(Session) {


    var tools = {};

    ///////////////////---------------利用率热图模拟数据生成------------------///////////////
    var generateHeatMapData = function (startDate, endDate) {

        var sd = new Date(startDate);
        var ed = new Date(endDate);

        console.log("simulate weekly util data");
        console.log(sd);
        console.log(ed);

        var curTime = startDate;
        var utiliaztionData = [];
        while (curTime - endDate <= 0) {
            var curTimeObj = new Date(curTime);
            var dayOfWeek = curTimeObj.getDay();
            var hourOfDay = curTimeObj.getHours();
            var runningPercentile = 0;
            if (dayOfWeek == 0 || dayOfWeek == 6) {
                runningPercentile = Math.floor(Math.random() * 10 + 5);

            } else {
                if (hourOfDay >= 0 && hourOfDay < 6) {
                    runningPercentile = Math.floor(Math.random() * 5 + 10);
                } else if (hourOfDay >= 6 && hourOfDay < 8) {
                    runningPercentile = Math.floor(Math.random() * 10 + 15);
                }
                else if (hourOfDay >= 7 && hourOfDay < 14) {
                    runningPercentile = Math.floor(Math.random() * 35 + 30);
                } else if (hourOfDay >= 14 && hourOfDay < 20) {
                    runningPercentile = Math.floor(Math.random() * 25 + 25);

                } else {
                    runningPercentile = Math.floor(Math.random() * 15 + 5);
                }

            }
            //var runningPercentile = Math.floor(Math.random() * (100 - idlePercentile));
            // 目前要求无停机时间
            var idlePercentile = 100 - runningPercentile;

            utiliaztionData.push({
                hourlyTime: curTime,
                runningPercentile: runningPercentile / 100,
                idlePercentile: idlePercentile / 100
            });

            curTime += 3600 * 1000; // plus 1 hour
        }

        return utiliaztionData;

    };

    tools.getUtilizationLatestWeek = function (testCurrTime) {
        var todayDate = new Date(testCurrTime.getFullYear(), testCurrTime.getMonth(), testCurrTime.getDate(), 0, 0, 0, 0);
        console.log(todayDate);
        todayDate = todayDate.getTime();
        var oneWeekBeforeToday = todayDate - 7 * 24 * 3600 * 1000;
        var yesterdayNight23 = todayDate - 3600 * 1000; // tonight is at 23:00:00pm


        var testUtilizationData = generateHeatMapData(oneWeekBeforeToday, yesterdayNight23);

        // test data for yesterday
        var yesterdayBusyHourValue = 0;
        var yesterdayBusyHour = 0;
        var yesterdayIdleHourValue = 100;
        var yesterdayIdleHour = 0;
        var yesterdayTotalHour = 0.0;
        var yesterdayOffTimeHours = 0.0;

        // 用weeklydata 得出昨日的一些数据， 最高使用时段， 等等
        var testOffset = testUtilizationData.length - 1 - 23;
        for (var i = 0; i < 24; i++) {
            var testHourlyData = testUtilizationData[testOffset + i];
            if (testHourlyData.runningPercentile > yesterdayBusyHourValue) {
                yesterdayBusyHour = i;
                yesterdayBusyHourValue = testHourlyData.runningPercentile;
            }

            if (testHourlyData.runningPercentile < yesterdayIdleHourValue) {
                yesterdayIdleHour = i;
                yesterdayIdleHourValue = testHourlyData.runningPercentile;
            }

            yesterdayTotalHour += testHourlyData.runningPercentile;
            if (i < 9 || i > 19) {
                yesterdayOffTimeHours += testHourlyData.runningPercentile;
            }
        }


        return {
            weeklyUtil: {
                succeed: true,
                data: {
                    deviceId: 101,
                    hourlyUtilizations: testUtilizationData
                }
            },
            yesterdayUtil: {
                succeed: true,
                data: {
                    deviceId: 101,
                    totalRunningHours: yesterdayTotalHour,
                    powerLowerBound: 4.5,
                    powerUpperBound: 100.02,
                    totalConsumedEnergy: 1.1 * 3600 * 1000,
                    totalIdleHours: 24 - yesterdayTotalHour,
                    mostOftenUsedHour: yesterdayNight23 - (23 - yesterdayBusyHour) * 3600 * 1000,  //3pm
                    leastOftenUsedHour: yesterdayNight23 - (23 - yesterdayIdleHour) * 3600 * 1000, //3am
                    offTimeHours: yesterdayOffTimeHours
                }
            }

        };

    };


    var deviceInspectList = [
        {
            correctionValue: -29.7719,
            end: "57.0",
            highDown: -35,
            highUp: -10,
            id: 299,
            inspectPurpose: 0,
            lowAlter: 10,
            lowDown: -33,
            lowUp: -15,
            name: "温度（PT100）",
            originalValue: -29.7719,
            standard: -24,
            start: "-93.0",
            value: "25.0",
            zero: 0,
            inspectType: {
                code: "00",
                id: 1,
                name: "温度（PT100）",
                unit: "度"
            }
        },
        {
            correctionValue: 2,
            end: "1.0",
            highDown: 5,
            highUp: 5,
            id: 300,
            inspectPurpose: 0,
            inspectType: {
                code: "05",
                id: 8,
                name: "设备门状态",
                unit: "开/关"
            },
            lowAlter: 10,
            lowDown: 1.5,
            lowUp: 1.5,
            name: "设备门状态",
            originalValue: 2,
            standard: 1,
            start: "1.0",
            value: "0.0",
            zero: 0
        },
        {
            correctionValue: 0.062,
            end: "3.3",
            highDown: 0,
            highUp: 1,
            id: 303,
            inspectPurpose: 1,
            lowAlter: 10,
            lowDown: 0,
            lowUp: 0.8,
            name: "电流",
            originalValue: 0.062,
            standard: 0.3,
            start: "-2.7",
            value: "1.0",
            zero: 0,
            inspectType: {
                code: "0b",
                id: 13,
                name: "电流",
                unit: "A"
            },
            runningStatus: [
                {
                    deviceInspectId: 303,
                    deviceRunningStatus: {
                        id: 1,
                        description: "",
                        level: 0,
                        name: "poweroff"
                    },
                    id: 1,
                    threshold: 0
                },
                {
                    deviceInspectId: 303,
                    deviceRunningStatus: {
                        id: 2,
                        description: "",
                        level: 10,
                        name: "standby"
                    },
                    id: 2,
                    threshold: 0.01
                },
                {
                    deviceInspectId: 303,
                    deviceRunningStatus: {
                        id: 3,
                        description: "",
                        level: 20,
                        name: "running"

                    },
                    id: 3,
                    threshold: 0.3
                }
            ]
        },
        {
            correctionValue: 73.5,
            end: "365.0",
            highDown: 0,
            highUp: 120,
            id: 304,
            inspectPurpose: 0,
            inspectType: {
                code: "0c",
                id: 14,
                name: "有功功率",
                unit: "W"
            },
            lowAlter: 10,
            lowDown: 0,
            lowUp: 115,
            name: "有功功率",
            originalValue: 73.5,
            standard: 5,
            start: "-355.5",
            value: "120.0",
            zero: 0
        }
    ];

    // ------------------------- 设备详情页 监控数据 生成------------

    var deviceSample = {
        alterNum: 0,
        code: "fk-冰箱",
        photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/217/a1e6ebcc-7180-4040-bda1-e6167dc4830d",
        createDate: 1488967935000,
        creator: "iLabService",
        deviceInspects: deviceInspectList,
        deviceType: {
            id: 138,
            logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/138/142f0018-ef0f-43e0-baf2-4f2ababec1c6",
            name: "冰箱",
            type: false
        },
        monitorDevice: {
            battery: '59.9',
            id: 113,
            number: "086021060342000027",
            online: 0
        },
        manager: {
            bindEmail: 1,
            bindMobile: 1,
            companyId: "AM",
            companyLogo: "https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440",
            companyName: "ilabservice",
            createDate: 1489072884000,
            department: "运营",
            email: "zy.li@ilabservice.com",
            id: 136,
            job: "管理员",
            jobNum: "000",
            mobile: "15900751966",
            name: "ils",
            password: "123",
            removeAlert: "2",
            role: {
                authority: "FIRM_MANAGER",
                id: 148,
                roleAuthority: {
                    id: 3,
                    name: "FIRM_MANAGER"
                }
            },
            roleNames: "企业管理员 ",
            userName: "ils",
        },
        days: 27,
        enable: 1,
        id: 217,
        name: "低温冰箱",
        maintain: "180",
        model: "iLabService",
        purchase: 1488700800000,
        pushInterval: 30,
        pushType: "禁止推送",
        roomName: "科海大楼7层iLabService",
        roomId: 232,
        score: "47.5",
        xpoint: 400,
        ypoint: 140
    };


    var generateInspectData = function (beginTime, count) {
        var data = [];
        deviceInspectList.forEach(function (inspect) {
            var inspectData = [];
            for (var i = 0; i < count; i++) {
                var picResult = "";
                var realValue = "";
                var result = "";
                if (inspect.id == 300) {
                    // 设备门
                    picResult = "2";
                    realValue = "2000";
                    result = "关";

                }
                else if (inspect.id == 303) {
                    picResult = (Math.random() * (inspect.lowUp - inspect.standard) * 0.2 + inspect.standard).toFixed(2).toString();
                    realValue = picResult;
                    result = picResult + "A";
                } else if (inspect.id == 304) {
                    var mid = (inspect.lowUp + inspect.lowDown) / 2;
                    picResult = (Math.random() * (inspect.lowUp - mid) * 0.2 + mid).toFixed(2).toString();
                    realValue = picResult;
                    result = picResult + "W";
                } else if (inspect.id == 299) {
                    picResult = (Math.random() * (inspect.lowUp - inspect.standard) * 0.2 + inspect.standard).toFixed(2).toString();
                    realValue = picResult;
                    result = picResult + "度";
                }


                var monitorTime = beginTime + i * 30 * 1000;
                if (monitorTime > Date.now()) {
                    monitorTime = Date.now();


                }
                inspectData.push({
                    createDate: monitorTime,
                    deviceInspect: inspect,
                    judge: 0,
                    picResult: picResult,
                    realValue: realValue,
                    result: result
                });
            }

            inspectData.reverse();

            data.push(inspectData);
        });

        return data;
    };


    tools.getDeviceInspectDataSample = function (beginTime) {
        var curTime = new Date();
        var count = Math.ceil((curTime.getTime() - beginTime) / 30 / 1000);
        console.log("new data " + count);
        return {
            runningStatus: 20,
            score: 20.2,
            list: generateInspectData(beginTime, count)
        };

    };


    // ----------------------------------------测试 数据----------------------------

    var companyInfoSample = {
        address: "上海纳贤路800号",
        background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/0beb2f42-5719-4f3c-b594-24da14c966c5",
        companyId: "AM",
        createDate: 1488652660000,
        email: "zy.li@ilabservice.com",
        enable: 1,
        highAlert: 0,
        id: 59,
        lat: 31.1894,
        lng: 121.611,
        location: "121.611,31.1894",
        login: "http://ilabservice.chinaeast.cloudapp.chinacloudapi.cn/Lab_login.html?company=AM",
        logo: "https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440",
        lowAlert: 0,
        name: "ilabservice",
        offline: 5,
        online: 0,
        score: 30.8444,
        total: 5
    };


    var user_firm_manager = {
        bindEmail: 1,
        bindMobile: 1,
        companyId: "AM",
        companyLogo: "https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440",
        companyName: "ilabservice",
        createDate: 1489072884000,
        department: "运营",
        email: "zy.li@ilabservice.com",
        id: 136,
        job: "管理员",
        jobNum: "000",
        mobile: "15900751966",
        name: "ils",
        password: "123",
        removeAlert: "2",
        role: {
            authority: "FIRM_MANAGER",
            id: 148,
            roleAuthority: {
                id: 3,
                name: "FIRM_MANAGER"
            }
        },
        roleNames: "企业管理员 ",
        userName: "ils",
        verify: "6012"
    };

    var user_service_manager = {
        department: "ilabservice",
        email: "gxu@ilabservice.com",
        id: 1,
        job: "系统管理员",
        jobNum: "000",
        mobile: "15900751966",
        name: "intelab",
        password: "123456",
        role: {
            authority: "SERVICE_MANAGER",
            id: 148,
            roleAuthority: {
                id: 1,
                name: "SERVICE_MANAGER"
            }
        },
        roleNames: "系统管理员 ",
        userName: "intelab"

    };

    var deviceScientistsSample = [
        {
            companyId: "AM",
            companyLogo: 'https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440',
            companyName: "ilabservice",
            createDate: 1489072884000,
            department: "devops",
            email: "gxu@ilabservice.com",
            id: 153,
            job: "devlead",
            jobNum: "1234",
            mobile: "13258198510",
            name: "tobyxu",
            password: "123",
            removeAlert: "0",
            role: {
                authority: "FIRM_WORKER",
                id: 165,
                roleAuthority: {
                    id: 4,
                    name: "FIRM_WORKER"
                }
            },
            roleNames: "企业业务员 试验品管理员 ",
            userName: "Toby"

        },
        {
            companyId: "AM",
            companyLogo: 'https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440',
            companyName: "ilabservice",
            createDate: 1489072884000,
            department: "研发",
            id: 137,
            job: "devlead",
            jobNum: "1234",
            mobile: "13258198510",
            name: "k.li",
            password: "ilabservice123",
            removeAlert: "0",
            role: {
                authority: "FIRM_SCIENTIST",
                id: 149,
                roleAuthority: {
                    id: 5,
                    name: "FIRM_SCIENTIST"
                }
            },
            roleNames: "试验品管理员 ",
            userName: "李康"

        }
    ];


    var deviceManagersSample = [
        {
            bindEmail: 1,
            bindMobile: 1,
            companyId: "AM",
            companyLogo: 'https://ilsgxuresource.blob.core.windows.net/company60/company/4e16ef24-e842-425e-a269-3178a36a5440',
            companyName: "ilabservice",
            createDate: 1489072884000,
            department: "运营",
            email: "zy.li@ilabservice.com",
            id: 136,
            job: "管理员",
            jobNum: "000",
            mobile: "15900751966",
            name: "ils",
            password: "123",
            removeAlert: "2",
            role: {
                authority: "FIRM_MANAGER",
                id: 148,
                roleAuthority: {
                    id: 3,
                    name: "FIRM_MANAGER"
                }
            },
            roleNames: "企业管理员 ",
            userName: "ils",
            verify: "6012"
        }
    ];


    var runningStatusSample = [
        {
            description: "",
            id: 1,
            level: 0,
            localizedName: "停机",
            name: "poweroff"
        },
        {
            description: "",
            id: 2,
            level: 10,
            localizedName: "待机",
            name: "standby"
        },
        {
            description: "",
            id: 3,
            level: 20,
            localizedName: "运行",
            name: "running"
        }

    ];

    var deviceParametersSample = {
        id: 214,
        name: "all",
        list: [
            {
                chosed: true,
                highDown: "0.0",
                highUp: "40.0",
                id: 1,
                inspectPurpose: 0,
                lowDown: "0.0",
                lowUp: "30.0",
                name: "温度（PT100）",
                standard: "20.0"
            },
            {
                chosed: true,
                highDown: "5.0",
                highUp: "5.0",
                id: 8,
                inspectPurpose: 0,
                lowDown: "0.0",
                lowUp: "0.0",
                name: "设备门状态",
                standard: "1.0"
            },
            {
                chosed: true,
                highDown: "0.0",
                highUp: "60.0",
                id: 13,
                inspectPurpose: 1,
                lowDown: "0.0",
                lowUp: "60.0",
                name: "电流",
                runningStatus: [
                    {
                        deviceTypeInspectId: 303,

                        id: 1,
                        description: "",
                        level: 0,
                        name: "poweroff",
                        runningStatusId: 1,

                        threshold: 0
                    },
                    {
                        deviceTypeInspectId: 303,

                        id: 2,
                        description: "",
                        level: 10,
                        name: "standby",
                        runningStatusId: 2,

                        threshold: 0.01
                    },
                    {
                        deviceTypeInspectId: 303,

                        id: 3,
                        description: "",
                        level: 20,
                        name: "poweroff",
                        runningStatusId: 3,

                        threshold: 0.3
                    }
                ],
                standard: "20.0"
            },

            {
                chosed: true,
                highDown: "0.0",
                highUp: "120.0",
                id: 14,
                inspectPurpose: 0,
                lowDown: "0.0",
                lowUp: "115.0",
                name: "有功功率",
                standard: "5.0"
            }
        ]
    };

    var roomListSample = [
        {
            error: 0,
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
            days: 30,
            buildId: 1,
            buildName: "科海大楼",
            floorId: 1,
            floorName: "1-1floor",
            highAlert: 0,
            id: 1,
            lowAlert: 1,
            name: "1-1-1room",
            offline: 2,
            online: 1,
            score: 23.2333,
            total: 3,
            roomId: 1,
            deviceList: [
                {
                    alterNum: 0,
                    code: "001",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/215/ffd64b95-56cc-4def-8615-745c2aa1c985",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 126,
                        logo: "https://tobypictures.blob.core.windows.net/devicetypes/126/35b518b0-8f32-4eb1-b7e3-2c65f4809a31",
                        name: "温度+ 门+压差+电表",
                        type: false
                    },
                    monitorDevice: {
                        battery: '97.3',
                        id: 1,
                        number: "086021060342000041",
                        online: 0
                    },
                    days: 29,
                    enable: 1,
                    highAlert: 0,
                    id: 1,
                    name: "INTELAB演示1",
                    maintain: "365",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "1-1-1room",
                    score: "0",
                    xpoint: 270,
                    ypoint: 160
                },
                {
                    alterNum: 0,
                    code: "002",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/216/b36de11c-d42d-47f2-a678-32f080263d9a",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 127,
                        logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
                        name: "温湿度+甲烷+门",
                        type: false
                    },
                    monitorDevice: {
                        battery: '95.9',
                        id: 2,
                        number: "086021060342000018",
                        online: 0
                    },

                    days: 29,
                    enable: 1,
                    id: 2,
                    name: "INTELAB演示2",
                    maintain: "180",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "1-1-1room",
                    score: "22.2",
                    xpoint: 270,
                    ypoint: 160
                },
                {
                    alterNum: 0,
                    code: "003",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/217/a1e6ebcc-7180-4040-bda1-e6167dc4830d",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 128,
                        logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/128/2edad111-3039-401e-9616-67d6ca47e885",
                        name: "pt100+温湿度+门",
                        type: false
                    },
                    monitorDevice: {
                        battery: '59.9',
                        id: 3,
                        number: "086021060342000027",
                        online: 0
                    },
                    days: 26,
                    enable: 1,
                    id: 3,
                    name: "INTELAB DEMO 3",
                    maintain: "180",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "邮箱",
                    roomName: "1-1-1room",
                    score: "47.5",
                    xpoint: 400,
                    ypoint: 140
                }
            ]
        },
        {
            error: 0,
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
            days: 30,
            buildId: 2,
            buildName: "Milburn",
            floorId: 2,
            floorName: "2-1floor",
            highAlert: 0,
            id: 2,
            lowAlert: 1,
            name: "2-1-1room",
            offline: 1,
            online: 1,
            score: 23.2333,
            total: 2,
            roomId: 2,
            deviceList: [
                {
                    alterNum: 0,
                    code: "001",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/215/ffd64b95-56cc-4def-8615-745c2aa1c985",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 126,
                        logo: "https://tobypictures.blob.core.windows.net/devicetypes/126/35b518b0-8f32-4eb1-b7e3-2c65f4809a31",
                        name: "温度+ 门+压差+电表",
                        type: false
                    },
                    monitorDevice: {
                        battery: '97.3',
                        id: 4,
                        number: "086021060342000041",
                        online: 0
                    },
                    days: 29,
                    enable: 1,
                    highAlert: 0,
                    id: 4,
                    name: "INTELAB演示-4",
                    maintain: "365",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "2-1-1room",
                    score: "0",
                    xpoint: 770,
                    ypoint: 260
                },
                {
                    alterNum: 0,
                    code: "002",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/216/b36de11c-d42d-47f2-a678-32f080263d9a",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 127,
                        logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
                        name: "温湿度+甲烷+门",
                        type: false
                    },
                    monitorDevice: {
                        battery: '95.9',
                        id: 5,
                        number: "086021060342000018",
                        online: 0
                    },

                    days: 29,
                    enable: 1,
                    id: 5,
                    name: "INTELAB演示-5",
                    maintain: "180",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "2-1-1room",
                    score: "22.2",
                    xpoint: 270,
                    ypoint: 560
                }
            ]
        },
        {
            error: 0,
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
            days: 30,
            buildId: 2,
            buildName: "Milburn",
            floorId: 3,
            floorName: "2-2floor",
            highAlert: 0,
            id: 3,
            lowAlert: 1,
            name: "2-2-1room",
            offline: 1,
            online: 1,
            score: 23.2333,
            total: 2,
            roomId: 3,
            deviceList: [
                {
                    alterNum: 0,
                    code: "001",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/215/ffd64b95-56cc-4def-8615-745c2aa1c985",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 126,
                        logo: "https://tobypictures.blob.core.windows.net/devicetypes/126/35b518b0-8f32-4eb1-b7e3-2c65f4809a31",
                        name: "温度+ 门+压差+电表",
                        type: false
                    },
                    monitorDevice: {
                        battery: '97.3',
                        id: 6,
                        number: "086021060342000041",
                        online: 0
                    },
                    days: 29,
                    enable: 1,
                    highAlert: 0,
                    id: 6,
                    name: "INTELAB演示-6",
                    maintain: "365",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "2-2-1room",
                    score: "0",
                    xpoint: 270,
                    ypoint: 160
                },
                {
                    alterNum: 0,
                    code: "002",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/216/b36de11c-d42d-47f2-a678-32f080263d9a",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 127,
                        logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
                        name: "温湿度+甲烷+门",
                        type: false
                    },
                    monitorDevice: {
                        battery: '95.9',
                        id: 7,
                        number: "086021060342000018",
                        online: 0
                    },

                    days: 29,
                    enable: 1,
                    id: 7,
                    name: "INTELAB演示-7",
                    maintain: "180",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "2-2-1room",
                    score: "22.2",
                    xpoint: 270,
                    ypoint: 160
                }
            ]
        },
        {
            error: 0,
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
            days: 30,
            buildId: 3,
            buildName: "科海大楼",
            floorId: 4,
            floorName: "3-1floor",
            highAlert: 0,
            id: 4,
            lowAlert: 1,
            name: "3-1-1room",
            offline: 1,
            online: 0,
            score: 23.2333,
            total: 1,
            roomId: 4,
            deviceList: [
                {
                    alterNum: 0,
                    code: "001",
                    photo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/215/ffd64b95-56cc-4def-8615-745c2aa1c985",
                    createDate: 1488713590000,
                    creator: "iLabService",
                    deviceInspects: [],
                    deviceType: {
                        id: 126,
                        logo: "https://tobypictures.blob.core.windows.net/devicetypes/126/35b518b0-8f32-4eb1-b7e3-2c65f4809a31",
                        name: "温度+ 门+压差+电表",
                        type: false
                    },
                    monitorDevice: {
                        battery: '97.3',
                        id: 8,
                        number: "086021060342000041",
                        online: 0
                    },
                    days: 29,
                    enable: 1,
                    highAlert: 0,
                    id: 8,
                    name: "INTELAB演示-8",
                    maintain: "365",
                    model: "iLabService",
                    purchase: 1488700800000,
                    pushInterval: 30,
                    pushType: "禁止推送",
                    roomName: "3-1-1room",
                    score: "0",
                    xpoint: 370,
                    ypoint: 760
                }
            ]
        }
    ];

    var floorListSample = [
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            days: 30,
            buildId: 1,
            buildName: "科海大楼",
            floorId: 1,
            highAlert: 0,
            id: 1,
            lowAlert: 0,
            name: "1-1floor",
            offline: 3,
            online: 1,
            score: 23.2333,
            total: 4,
            roomList: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
                    createDate: 1488652889000,
                    days: 30,
                    deviceNum: 3,
                    enable: 1,
                    highAlert: 0,
                    id: 1,
                    lowAlert: 1,
                    name: "1-1-1room",
                    offline: 2,
                    online: 1,
                    score: 23.2333,
                    total: 3,
                    xpoint: 500,
                    ypoint: 300
                }

            ]
        },
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            days: 30,
            buildId: 2,
            buildName: "Milburn",
            floorId: 2,
            highAlert: 0,
            id: 2,
            lowAlert: 0,
            name: "2-1floor",
            offline: 1,
            online: 0,
            score: 23.2333,
            total: 1,
            roomList: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
                    createDate: 1488652889000,
                    days: 30,
                    deviceNum: 2,
                    enable: 1,
                    highAlert: 0,
                    id: 2,
                    lowAlert: 1,
                    name: "2-1-1room",
                    offline: 1,
                    online: 1,
                    score: 23.2333,
                    total: 2,
                    xpoint: 500,
                    ypoint: 300
                }

            ]
        },
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            days: 30,
            buildId: 2,
            buildName: "Milburn",
            floorId: 3,
            highAlert: 0,
            id: 3,
            lowAlert: 0,
            name: "2-2floor",
            offline: 1,
            online: 0,
            score: 23.2333,
            total: 1,
            roomList: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
                    createDate: 1488652889000,
                    days: 30,
                    deviceNum: 2,
                    enable: 1,
                    highAlert: 0,
                    id: 3,
                    lowAlert: 1,
                    name: "2-2-1room",
                    offline: 1,
                    online: 1,
                    score: 23.2333,
                    total: 2,
                    xpoint: 500,
                    ypoint: 300
                }

            ]
        },
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            days: 30,
            buildId: 3,
            buildName: "碧云公馆",
            floorId: 4,
            highAlert: 0,
            id: 4,
            lowAlert: 0,
            name: "3-1floor",
            offline: 1,
            online: 0,
            score: 23.2333,
            total: 1,
            roomList: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/rooms/232/bde85aa9-1cf9-4366-87ce-fc96ecd18507",
                    createDate: 1488652889000,
                    days: 30,
                    deviceNum: 1,
                    enable: 1,
                    highAlert: 0,
                    id: 4,
                    lowAlert: 1,
                    name: "3-1-1room",
                    offline: 1,
                    online: 0,
                    score: 23.2333,
                    total: 1,
                    xpoint: 500,
                    ypoint: 300
                }

            ]
        }

    ];

    var buildingListSample = [
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
            days: 30,
            buildId: 1,
            highAlert: 2,
            id: 1,
            lowAlert: 2,
            name: "科海大楼",
            offline: 2,
            online: 1,
            score: 23.2333,
            total: 3,
            floors: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
                    createDate: 1488652879000,
                    days: 30,
                    deviceNum: 3,
                    enable: 1,
                    highAlert: 0,
                    id: 1,
                    lowAlert: 1,
                    name: "1-1floor",
                    offline: 2,
                    online: 1,
                    score: 23.2333,
                    total: 3,
                    xpoint: 610,
                    ypoint: 255
                }

            ]
        },
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
            days: 25,
            deviceNum: 4,
            enable: 1,
            highAlert: 1,
            id: 2,
            buildId: 2,
            lowAlert: 0,
            name: "Millburn",
            offline: 2,
            online: 2,
            score: 23.95,
            total: 4,

            floors: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
                    createDate: 1488652879000,
                    days: 30,
                    deviceNum: 2,
                    enable: 1,
                    highAlert: 0,
                    id: 2,
                    lowAlert: 1,
                    name: "2-1floor",
                    offline: 1,
                    online: 1,
                    score: 23.2333,
                    total: 2,
                    xpoint: 610,
                    ypoint: 255
                },
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
                    createDate: 1488652879000,
                    days: 30,
                    deviceNum: 2,
                    enable: 1,
                    highAlert: 0,
                    id: 3,
                    lowAlert: 1,
                    name: "2-2floor",
                    offline: 1,
                    online: 1,
                    score: 23.2333,
                    total: 2,
                    xpoint: 210,
                    ypoint: 555
                }

            ]

        },
        {
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
            createDate: 1488652868000,
            days: 22,
            deviceNum: 1,
            enable: 1,
            highAlert: 0,
            id: 3,
            buildId: 3,
            lowAlert: 3,
            name: "碧云公馆",
            offline: 1,
            online: 0,
            score: 45,
            total: 1,
            floors: [
                {
                    background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
                    createDate: 1488652879000,
                    days: 30,
                    deviceNum: 1,
                    enable: 1,
                    highAlert: 0,
                    id: 4,
                    lowAlert: 1,
                    name: "3-1floor",
                    offline: 1,
                    online: 0,
                    score: 23.2333,
                    total: 1,
                    xpoint: 710,
                    ypoint: 555
                }

            ]

        }

    ];

    var campusSample = {
        background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/0beb2f42-5719-4f3c-b594-24da14c966c5",
        days: 29,
        highAlert: 3,
        id: 1,
        logo: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
        lowAlert: 6,
        name: "ilabservice",
        offline: 7,
        online: 1,
        score: 30.8444,
        total: 8,
        list: [
            {
                background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
                createDate: 1488652868000,
                days: 29,
                deviceNum: 3,
                enable: 1,
                highAlert: 1,
                id: 1,
                lowAlert: 2,
                name: "科海大楼",
                offline: 2,
                online: 1,
                score: 23.2333,
                total: 3,
                xpoint: 116.491167,
                ypoint: 39.877355
            },


            {
                background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
                createDate: 1489028870000,
                days: 25,
                deviceNum: 4,
                enable: 1,
                highAlert: 0,
                id: 2,
                lowAlert: 0,
                name: "Millburn",
                offline: 2,
                online: 2,
                score: 23.95,
                total: 4,
                xpoint: 116.512152,
                ypoint: 39.857419
            },
            {
                background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002",
                createDate: 1488652868000,
                days: 22,
                deviceNum: 1,
                enable: 1,
                highAlert: 0,
                id: 3,
                lowAlert: 0,
                name: "碧云公馆",
                offline: 1,
                online: 0,
                score: 45,
                total: 1,
                xpoint: 116.428789,
                ypoint: 39.896622
            }
        ]

    };


    var deleteUserInitSample = [
        {
            "id": 136,
            "name": "ils",
            "password": "iLabService@123",
            "userName": "ils",
            "mobile": "15900751966",
            "createDate": 1489044084000,
            "email": "k.li@ilabservice.com",
            "department": "运营",
            "job": "ils",
            "jobNum": "000",
            "role": {"id": 148, "authority": "FIRM_MANAGER", "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}},
            "companyName": "ilabservice",
            "verify": "7106",
            "bindMobile": 1,
            "bindEmail": 1,
            "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业管理员 ",
            "companyId": "AM",
            "removeAlert": "2"
        }, {
            "id": 138,
            "name": "zy.li",
            "password": "iLabService@123",
            "userName": "栗志云",
            "createDate": 1488643943000,
            "department": "工程",
            "job": "工程师",
            "jobNum": "002",
            "role": {"id": 150, "authority": "FIRM_WORKER", "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}},
            "companyName": "ilabservice",
            "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业业务员 ",
            "companyId": "AM",
            "removeAlert": "2"
        }, {
            "id": 153,
            "name": "tobyxu",
            "password": "123",
            "userName": "Toby",
            "createDate": 1491889850000,
            "department": "devops",
            "job": "devlead",
            "jobNum": "1234",
            "role": {"id": 165, "authority": "FIRM_WORKER", "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}},
            "companyName": "ilabservice",
            "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业业务员 试验品管理员 ",
            "companyId": "AM",
            "removeAlert": "2"
        }];
    var userListSample = {
        "total": "4",
        "pages": "1",
        "userList": {
            "userId": 136,
            "userList": [{
                "id": 143,
                "name": "1234",
                "password": "123",
                "userName": "小芳",
                "createDate": 1490607669000,
                "department": "测试",
                "job": "测试",
                "jobNum": "2423",
                "role": {
                    "id": 155,
                    "authority": "FIRM_WORKER",
                    "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}
                },
                "companyName": "ilabservice",
                "companyLogo": "https://ilstestresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业业务员 ",
                "companyId": "AM",
                "removeAlert": "0"
            }, {
                "id": 140,
                "name": "yc.zheng",
                "password": "123",
                "userName": "郑一村",
                "createDate": 1488806529000,
                "department": "研发",
                "job": "实习生",
                "jobNum": "003",
                "role": {
                    "id": 152,
                    "authority": "FIRM_WORKER",
                    "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}
                },
                "companyName": "ilabservice",
                "companyLogo": "https://ilstestresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业业务员 ",
                "companyId": "AM",
                "removeAlert": "0"
            }, {
                "id": 138,
                "name": "zy.li",
                "password": "123",
                "userName": "栗志云",
                "createDate": 1488643943000,
                "department": "工程",
                "job": "工程师",
                "jobNum": "002",
                "role": {
                    "id": 150,
                    "authority": "FIRM_WORKER",
                    "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}
                },
                "companyName": "ilabservice",
                "companyLogo": "https://ilstestresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业业务员 ",
                "companyId": "AM",
                "removeAlert": "0"
            }, {
                "id": 137,
                "name": "k.li",
                "password": "123",
                "userName": "李康",
                "createDate": 1488643917000,
                "department": "研发",
                "job": "经理",
                "jobNum": "001",
                "role": {
                    "id": 149,
                    "authority": "FIRM_SCIENTIST",
                    "roleAuthority": {"id": 5, "name": "FIRM_SCIENTIST"}
                },
                "companyName": "ilabservice",
                "companyLogo": "https://ilstestresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "试验品管理员 ",
                "companyId": "AM",
                "removeAlert": "0"
            }]
        },
        "thisNum": "4"
    };
    var userCompanySample = {
        "error": 0,
        "message": "OK",
        "data": {
            "id": 136,
            "name": "ils",
            "password": "123",
            "userName": "ils",
            "mobile": "15900751966",
            "createDate": 1489044084000,
            "email": "zy.li@ilabtools.com",
            "department": "运营",
            "job": "管理员",
            "jobNum": "000",
            "role": {
                "id": 148,
                "authority": "FIRM_MANAGER",
                "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
            },
            "companyName": "ilabservice",
            "verify": "6012",
            "bindMobile": 1,
            "bindEmail": 1,
            "companyLogo": "https://ilstestresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业管理员 ",
            "companyId": "AM",
            "removeAlert": "1"
        }
    };
    var companyUserListSample = [
        {
            "id": 136,
            "name": "ils",
            "password": "iLabService@123",
            "userName": "ils",
            "mobile": "15900751966",
            "createDate": 1489044084000,
            "email": "k.li@ilabservice.com",
            "department": "运营",
            "job": "ils",
            "jobNum": "000",
            "role": {
                "id": 148,
                "authority": "FIRM_MANAGER",
                "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
            },
            "companyName": "ilabservice",
            "verify": "7106",
            "bindMobile": 1,
            "bindEmail": 1,
            "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业管理员 ",
            "companyId": "AM",
            "removeAlert": "2"
        }, {
            "id": 138,
            "name": "zy.li",
            "password": "iLabService@123",
            "userName": "栗志云",
            "createDate": 1488643943000,
            "department": "工程",
            "job": "工程师",
            "jobNum": "002",
            "role": {
                "id": 150,
                "authority": "FIRM_WORKER",
                "roleAuthority": {"id": 4, "name": "FIRM_WORKER"}
            },
            "companyName": "ilabservice",
            "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
            "roleNames": "企业业务员 ",
            "companyId": "AM",
            "removeAlert": "0"
        }];
    var deviceTypeSample = [
        {
            "id": 64,
            "name": "环境温度",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/64/7607d45c-7a86-41b2-a0b7-77feeb59087d",
            "inspectTypes": [{"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"}],
            "type": true
        }, {
            "id": 120,
            "name": "pt100+开关",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/120/fcdc009a-4d47-4dd5-bb70-b7c6c29c90cd",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": true
        }, {
            "id": 125,
            "name": "all",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/125/fbcac7c5-6caf-4a7f-ac57-8dfb3bc3ffb5",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 6, "name": "房间压差", "code": "06", "unit": "pa"}, {
                "id": 7,
                "name": "甲烷含量",
                "code": "07",
                "unit": "LEL%"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                "id": 10,
                "name": "有功电能",
                "code": "08",
                "unit": "KWH"
            }, {"id": 11, "name": "无功电能", "code": "09", "unit": "KWH"}, {
                "id": 12,
                "name": "电压",
                "code": "0a",
                "unit": "V"
            }, {"id": 13, "name": "电流", "code": "0b", "unit": "A"}, {
                "id": 14,
                "name": "有功功率",
                "code": "0c",
                "unit": "W"
            }, {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"}, {
                "id": 18,
                "name": "TVOC",
                "code": "10",
                "unit": "mg/m3"
            }],
            "type": false
        }, {
            "id": 126,
            "name": "温度+ 门+压差+电表",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/126/550ff778-0ebe-41f6-b3d6-78913d3f55fa",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 6,
                "name": "房间压差",
                "code": "06",
                "unit": "pa"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                "id": 10,
                "name": "有功电能",
                "code": "08",
                "unit": "KWH"
            }, {"id": 12, "name": "电压", "code": "0a", "unit": "V"}, {
                "id": 13,
                "name": "电流",
                "code": "0b",
                "unit": "A"
            }, {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"}],
            "type": false
        }, {
            "id": 127,
            "name": "温湿度+甲烷+门",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
            "inspectTypes": [{"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 7, "name": "甲烷含量", "code": "07", "unit": "LEL%"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": false
        }, {
            "id": 128,
            "name": "pt100+温湿度+门",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/128/2edad111-3039-401e-9616-67d6ca47e885",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": false
        }, {
            "id": 129,
            "name": "pt100+温湿度+门开关+co2",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/129/66321523-8e4e-47bb-9432-5a36fa86aa25",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}],
            "type": false
        }, {
            "id": 132,
            "name": "家用冰箱",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/132/8be094e6-eb3b-4410-9bdb-edf8ddde92ff",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }, {"id": 10, "name": "有功电能", "code": "08", "unit": "KWH"}, {
                "id": 11,
                "name": "无功电能",
                "code": "09",
                "unit": "KWH"
            }, {"id": 12, "name": "电压", "code": "0a", "unit": "V"}, {
                "id": 13,
                "name": "电流",
                "code": "0b",
                "unit": "A"
            }, {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"}, {
                "id": 15,
                "name": "无功功率",
                "code": "0d",
                "unit": "Q"
            }],
            "type": false
        }];
    var deviceListSample = {
        "id": 236,
        "name": "休息室",
        "days": 37,
        "deviceList": [{
            "id": 227,
            "code": "fk-冰箱",
            "name": "低温冰箱",
            "deviceType": {
                "id": 138,
                "name": "冰箱",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/138/142f0018-ef0f-43e0-baf2-4f2ababec1c6",
                "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                    "id": 8,
                    "name": "设备门状态",
                    "code": "05",
                    "unit": "开/关"
                }, {"id": 10, "name": "有功电能", "code": "08", "unit": "KWH"}, {
                    "id": 12,
                    "name": "电压",
                    "code": "0a",
                    "unit": "V"
                }, {"id": 13, "name": "电流", "code": "0b", "unit": "A"}, {
                    "id": 14,
                    "name": "有功功率",
                    "code": "0c",
                    "unit": "W"
                }, {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"}],
                "type": false
            },
            "createDate": 1489577876000,
            "creator": "iLabService",
            "purchase": 1475020800000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company60/devices/227/540666c7-b99d-40b9-9096-f0427bc1d7a8",
            "manager": {
                "id": 141,
                "name": "kungfu",
                "password": "iLabService@123",
                "userName": "李康",
                "mobile": "15900751966",
                "createDate": 1490018889000,
                "email": "zycltl@163.com",
                "department": "开发",
                "job": "kungfu",
                "jobNum": "0001",
                "role": {
                    "id": 153,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "kungfu",
                "verify": "4350",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company60/company/8e8df3f5-1c74-44c1-9a36-2691a9a6a6c4",
                "roleNames": "企业管理员 ",
                "companyId": "BD",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "365",
            "model": "iLabService",
            "xPoint": 255.0,
            "yPoint": 125.0,
            "monitorDevice": {"id": 123, "number": "086021060342000023", "battery": "99.4", "online": 1},
            "deviceInspects": [{
                "id": 305,
                "inspectType": {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"},
                "standard": 30.0,
                "lowUp": 50.0,
                "lowDown": 0.0,
                "highUp": 70.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "无功功率",
                "start": "-180.0",
                "value": "70.0",
                "end": "240.0",
                "zero": 0.0,
                "originalValue": 80000.0,
                "correctionValue": 80000.0,
                "inspectPurpose": 0
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "Kungfu孵化器7层休息室",
            "score": "6.3",
            "enable": 1,
            "days": 35
        }],
        "roomId": 236,
        "floorId": 443,
        "floorName": "7层",
        "buildId": 53,
        "buildName": "Kungfu孵化器",
        "lowAlert": 0,
        "highAlert": 1,
        "online": 1,
        "offline": 0,
        "total": 1,
        "score": 6.3,
        "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company60/rooms/236/d0616b8e-f7d4-4313-a451-c249df59b108"
    };
    var deviceTypeListSample = [{
        "id": 141,
        "name": "kungfu",
        "password": "iLabService@123",
        "userName": "李康",
        "mobile": "15900751966",
        "createDate": 1490018889000,
        "email": "zycltl@163.com",
        "department": "开发",
        "job": "kungfu",
        "jobNum": "0001",
        "role": {"id": 153, "authority": "FIRM_MANAGER", "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}},
        "companyName": "kungfu",
        "verify": "4350",
        "bindMobile": 1,
        "bindEmail": 1,
        "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company60/company/8e8df3f5-1c74-44c1-9a36-2691a9a6a6c4",
        "roleNames": "企业管理员 ",
        "companyId": "BD",
        "removeAlert": "2"
    }];
    var userDeviceListSample = {
        "total": "5",
        "devices": [{
            "id": 218,
            "code": "004",
            "name": "INTELAB DEMO - Jing",
            "deviceType": {
                "id": 129,
                "name": "pt100+温湿度+门开关+co2",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/129/66321523-8e4e-47bb-9432-5a36fa86aa25",
                "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                    "id": 2,
                    "name": "温湿度(湿度)",
                    "code": "01",
                    "unit": "%"
                }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                    "id": 4,
                    "name": "温湿度(温度)",
                    "code": "04",
                    "unit": "度"
                }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}],
                "type": false
            },
            "createDate": 1489030620000,
            "creator": "iLabService",
            "purchase": 1489017600000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/218/c73f9ef5-93da-4ece-b919-d696fbb7d2cb",
            "manager": {
                "id": 136,
                "name": "ils",
                "password": "iLabService@123",
                "userName": "ils",
                "mobile": "15900751966",
                "createDate": 1489044084000,
                "email": "k.li@ilabservice.com",
                "department": "运营",
                "job": "ils",
                "jobNum": "000",
                "role": {
                    "id": 148,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "ilabservice",
                "verify": "7106",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业管理员 ",
                "companyId": "AM",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "180",
            "maintainDate": 1489017600000,
            "model": "iLabService",
            "xPoint": 90.0,
            "yPoint": 100.0,
            "monitorDevice": {
                "id": 114,
                "number": "086021060342000022",
                "battery": "97.0",
                "online": 0
            },
            "deviceInspects": [{
                "id": 256,
                "inspectType": {"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"},
                "standard": 20.0,
                "lowUp": 40.0,
                "lowDown": 0.0,
                "highUp": 40.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温度（PT100）",
                "start": "-100.0",
                "value": "40.0",
                "end": "140.0",
                "zero": 0.0,
                "originalValue": 19.5116,
                "correctionValue": 19.5116,
                "inspectPurpose": 0
            }, {
                "id": 257,
                "inspectType": {"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"},
                "standard": 30.0,
                "lowUp": 40.0,
                "lowDown": 10.0,
                "highUp": 70.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温湿度(湿度)",
                "start": "-180.0",
                "value": "70.0",
                "end": "240.0",
                "zero": 0.0,
                "originalValue": 23.418,
                "correctionValue": 23.418,
                "inspectPurpose": 0
            }, {
                "id": 258,
                "inspectType": {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"},
                "standard": 40.0,
                "lowUp": 200.0,
                "lowDown": 30.0,
                "highUp": 300.0,
                "highDown": 10.0,
                "lowAlter": 10,
                "name": "二氧化碳",
                "start": "-830.0",
                "value": "290.0",
                "end": "910.0",
                "zero": 0.0,
                "originalValue": 126.0,
                "correctionValue": 126.0,
                "inspectPurpose": 0
            }, {
                "id": 259,
                "inspectType": {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"},
                "standard": 20.0,
                "lowUp": 30.0,
                "lowDown": 15.0,
                "highUp": 40.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "温湿度(温度)",
                "start": "-85.0",
                "value": "35.0",
                "end": "125.0",
                "zero": 0.0,
                "originalValue": 23.699,
                "correctionValue": 23.699,
                "inspectPurpose": 0
            }, {
                "id": 260,
                "inspectType": {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"},
                "standard": 1.0,
                "lowUp": 0.0,
                "lowDown": 0.0,
                "highUp": 5.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "设备门状态",
                "start": "1.0",
                "value": "0.0",
                "end": "1.0",
                "zero": 0.0,
                "originalValue": 1.0,
                "correctionValue": 1.0,
                "inspectPurpose": 0
            }],
            "files": [{
                "id": 31,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_4.jpg",
                "createDate": 1489045172000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_4.jpg"
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "Millburn1309",
            "score": "23.95",
            "enable": 1,
            "days": 32
        }, {
            "id": 217,
            "code": "003",
            "name": "INTELAB DEMO - Kenny",
            "deviceType": {
                "id": 128,
                "name": "pt100+温湿度+门",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/128/2edad111-3039-401e-9616-67d6ca47e885",
                "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                    "id": 2,
                    "name": "温湿度(湿度)",
                    "code": "01",
                    "unit": "%"
                }, {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"}, {
                    "id": 8,
                    "name": "设备门状态",
                    "code": "05",
                    "unit": "开/关"
                }],
                "type": false
            },
            "createDate": 1488939135000,
            "creator": "iLabService",
            "purchase": 1488931200000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/217/a1e6ebcc-7180-4040-bda1-e6167dc4830d",
            "manager": {
                "id": 136,
                "name": "ils",
                "password": "iLabService@123",
                "userName": "ils",
                "mobile": "15900751966",
                "createDate": 1489044084000,
                "email": "k.li@ilabservice.com",
                "department": "运营",
                "job": "ils",
                "jobNum": "000",
                "role": {
                    "id": 148,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "ilabservice",
                "verify": "7106",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业管理员 ",
                "companyId": "AM",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "180",
            "model": "iLabService",
            "xPoint": 400.0,
            "yPoint": 140.0,
            "monitorDevice": {
                "id": 113,
                "number": "086021060342000027",
                "battery": "59.9",
                "online": 0
            },
            "deviceInspects": [{
                "id": 252,
                "inspectType": {"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"},
                "standard": 25.0,
                "lowUp": 35.0,
                "lowDown": 15.0,
                "highUp": 40.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温度（PT100）",
                "start": "-95.0",
                "value": "40.0",
                "end": "145.0",
                "zero": 0.0,
                "originalValue": 34.5219,
                "correctionValue": 34.5219,
                "inspectPurpose": 0
            }, {
                "id": 253,
                "inspectType": {"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"},
                "standard": 35.0,
                "lowUp": 50.0,
                "lowDown": 20.0,
                "highUp": 80.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "温湿度(湿度)",
                "start": "-190.0",
                "value": "75.0",
                "end": "260.0",
                "zero": 0.0,
                "originalValue": 35.015,
                "correctionValue": 35.015,
                "inspectPurpose": 0
            }, {
                "id": 254,
                "inspectType": {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"},
                "standard": 20.0,
                "lowUp": 30.0,
                "lowDown": 0.0,
                "highUp": 35.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温湿度(温度)",
                "start": "-85.0",
                "value": "35.0",
                "end": "125.0",
                "zero": 0.0,
                "originalValue": 28.483,
                "correctionValue": 28.483,
                "inspectPurpose": 0
            }, {
                "id": 255,
                "inspectType": {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"},
                "standard": 1.0,
                "lowUp": 0.0,
                "lowDown": 0.0,
                "highUp": 5.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "设备门状态",
                "start": "1.0",
                "value": "0.0",
                "end": "1.0",
                "zero": 0.0,
                "originalValue": 1.0,
                "correctionValue": 1.0,
                "inspectPurpose": 0
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "科海大楼7层iLabService",
            "score": "47.5",
            "enable": 1,
            "days": 33
        }, {
            "id": 216,
            "code": "002",
            "name": "INTELAB演示2",
            "deviceType": {
                "id": 127,
                "name": "温湿度+甲烷+门",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
                "inspectTypes": [{"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"}, {
                    "id": 4,
                    "name": "温湿度(温度)",
                    "code": "04",
                    "unit": "度"
                }, {"id": 7, "name": "甲烷含量", "code": "07", "unit": "LEL%"}, {
                    "id": 8,
                    "name": "设备门状态",
                    "code": "05",
                    "unit": "开/关"
                }],
                "type": false
            },
            "createDate": 1488686235000,
            "creator": "iLabService",
            "purchase": 1488585600000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/216/b36de11c-d42d-47f2-a678-32f080263d9a",
            "manager": {
                "id": 136,
                "name": "ils",
                "password": "iLabService@123",
                "userName": "ils",
                "mobile": "15900751966",
                "createDate": 1489044084000,
                "email": "k.li@ilabservice.com",
                "department": "运营",
                "job": "ils",
                "jobNum": "000",
                "role": {
                    "id": 148,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "ilabservice",
                "verify": "7106",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业管理员 ",
                "companyId": "AM",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "180",
            "model": "iLabService",
            "xPoint": 240.0,
            "yPoint": 165.0,
            "monitorDevice": {
                "id": 112,
                "number": "086021060342000018",
                "battery": "95.1",
                "online": 1
            },
            "deviceInspects": [{
                "id": 248,
                "inspectType": {"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"},
                "standard": 40.0,
                "lowUp": 60.0,
                "lowDown": 20.0,
                "highUp": 80.0,
                "highDown": 10.0,
                "lowAlter": 10,
                "name": "温湿度(湿度)",
                "start": "-170.0",
                "value": "70.0",
                "end": "250.0",
                "zero": 0.0,
                "originalValue": 69.897,
                "correctionValue": 69.897,
                "inspectPurpose": 0
            }, {
                "id": 249,
                "inspectType": {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"},
                "standard": 20.0,
                "lowUp": 28.0,
                "lowDown": 10.0,
                "highUp": 35.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "温湿度(温度)",
                "start": "-70.0",
                "value": "30.0",
                "end": "110.0",
                "zero": 0.0,
                "originalValue": 18.272,
                "correctionValue": 18.272,
                "inspectPurpose": 0
            }, {
                "id": 250,
                "inspectType": {"id": 7, "name": "甲烷含量", "code": "07", "unit": "LEL%"},
                "standard": 0.0,
                "lowUp": 15.0,
                "lowDown": -1.0,
                "highUp": 30.0,
                "highDown": -5.0,
                "lowAlter": 10,
                "name": "甲烷含量",
                "start": "-105.0",
                "value": "35.0",
                "end": "105.0",
                "zero": 0.0,
                "originalValue": 0.150953,
                "correctionValue": 0.150953,
                "inspectPurpose": 0
            }, {
                "id": 251,
                "inspectType": {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"},
                "standard": 1.0,
                "lowUp": 0.0,
                "lowDown": 0.0,
                "highUp": 5.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "设备门状态",
                "start": "1.0",
                "value": "0.0",
                "end": "1.0",
                "zero": 0.0,
                "originalValue": 2.0,
                "correctionValue": 2.0,
                "inspectPurpose": 0
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "科海大楼7层iLabService",
            "score": "0",
            "enable": 1,
            "days": 36
        }, {
            "id": 215,
            "code": "001",
            "name": "INTELAB演示1",
            "deviceType": {
                "id": 126,
                "name": "温度+ 门+压差+电表",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/126/550ff778-0ebe-41f6-b3d6-78913d3f55fa",
                "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                    "id": 6,
                    "name": "房间压差",
                    "code": "06",
                    "unit": "pa"
                }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                    "id": 10,
                    "name": "有功电能",
                    "code": "08",
                    "unit": "KWH"
                }, {"id": 12, "name": "电压", "code": "0a", "unit": "V"}, {
                    "id": 13,
                    "name": "电流",
                    "code": "0b",
                    "unit": "A"
                }, {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"}],
                "type": false
            },
            "createDate": 1488684790000,
            "creator": "iLabService",
            "purchase": 1488672000000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/215/ffd64b95-56cc-4def-8615-745c2aa1c985",
            "manager": {
                "id": 136,
                "name": "ils",
                "password": "iLabService@123",
                "userName": "ils",
                "mobile": "15900751966",
                "createDate": 1489044084000,
                "email": "k.li@ilabservice.com",
                "department": "运营",
                "job": "ils",
                "jobNum": "000",
                "role": {
                    "id": 148,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "ilabservice",
                "verify": "7106",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业管理员 ",
                "companyId": "AM",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "365",
            "model": "iLabService",
            "xPoint": 270.0,
            "yPoint": 160.0,
            "monitorDevice": {
                "id": 111,
                "number": "086021060342000041",
                "battery": "99.0",
                "online": 1
            },
            "deviceInspects": [{
                "id": 241,
                "inspectType": {"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"},
                "standard": 20.0,
                "lowUp": 30.0,
                "lowDown": 10.0,
                "highUp": 40.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温度（PT100）",
                "start": "-100.0",
                "value": "40.0",
                "end": "140.0",
                "zero": 0.0,
                "originalValue": 16.581,
                "correctionValue": 16.581,
                "inspectPurpose": 0
            }, {
                "id": 242,
                "inspectType": {"id": 6, "name": "房间压差", "code": "06", "unit": "pa"},
                "standard": 10.0,
                "lowUp": 10.0,
                "lowDown": -10.0,
                "highUp": 10.0,
                "highDown": -10.0,
                "lowAlter": 10,
                "name": "房间压差",
                "start": "-50.0",
                "value": "20.0",
                "end": "70.0",
                "zero": 0.0,
                "originalValue": -0.133333,
                "correctionValue": -0.138667,
                "inspectPurpose": 0
            }, {
                "id": 243,
                "inspectType": {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"},
                "standard": 1.0,
                "lowUp": 0.0,
                "lowDown": 0.0,
                "highUp": 5.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "设备门状态",
                "start": "1.0",
                "value": "0.0",
                "end": "1.0",
                "zero": 0.0,
                "originalValue": 2.0,
                "correctionValue": 2.0,
                "inspectPurpose": 0
            }, {
                "id": 244,
                "inspectType": {"id": 10, "name": "有功电能", "code": "08", "unit": "KWH"},
                "standard": 10.0,
                "lowUp": 20.0,
                "lowDown": 0.0,
                "highUp": 20.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "有功电能",
                "start": "-50.0",
                "value": "20.0",
                "end": "70.0",
                "zero": 0.0,
                "originalValue": 5.5925,
                "correctionValue": 5.5925,
                "inspectPurpose": 1
            }, {
                "id": 245,
                "inspectType": {"id": 12, "name": "电压", "code": "0a", "unit": "V"},
                "standard": 220.0,
                "lowUp": 250.0,
                "lowDown": 200.0,
                "highUp": 260.0,
                "highDown": 190.0,
                "lowAlter": 10,
                "name": "电压",
                "start": "10.0",
                "value": "70.0",
                "end": "430.0",
                "zero": 0.0,
                "originalValue": 224.575,
                "correctionValue": 224.575,
                "inspectPurpose": 1
            }, {
                "id": 246,
                "inspectType": {"id": 13, "name": "电流", "code": "0b", "unit": "A"},
                "standard": 0.0,
                "lowUp": 3.0,
                "lowDown": 0.0,
                "highUp": 3.0,
                "highDown": -1.0,
                "lowAlter": 10,
                "name": "电流",
                "start": "-12.0",
                "value": "4.0",
                "end": "12.0",
                "zero": 0.0,
                "originalValue": 0.062,
                "correctionValue": 0.062,
                "inspectPurpose": 1
            }, {
                "id": 247,
                "inspectType": {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"},
                "standard": 5.0,
                "lowUp": 10.0,
                "lowDown": 2.0,
                "highUp": 50.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "有功功率",
                "start": "-145.0",
                "value": "50.0",
                "end": "155.0",
                "zero": 0.0,
                "originalValue": 7.0,
                "correctionValue": 7.0,
                "inspectPurpose": 0
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "科海大楼7层iLabService",
            "score": "0",
            "enable": 1,
            "days": 36
        }, {
            "id": 214,
            "code": "001",
            "name": "INTELAB演示机",
            "deviceType": {
                "id": 125,
                "name": "all",
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/125/fbcac7c5-6caf-4a7f-ac57-8dfb3bc3ffb5",
                "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                    "id": 2,
                    "name": "温湿度(湿度)",
                    "code": "01",
                    "unit": "%"
                }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                    "id": 4,
                    "name": "温湿度(温度)",
                    "code": "04",
                    "unit": "度"
                }, {"id": 6, "name": "房间压差", "code": "06", "unit": "pa"}, {
                    "id": 7,
                    "name": "甲烷含量",
                    "code": "07",
                    "unit": "LEL%"
                }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                    "id": 10,
                    "name": "有功电能",
                    "code": "08",
                    "unit": "KWH"
                }, {"id": 11, "name": "无功电能", "code": "09", "unit": "KWH"}, {
                    "id": 12,
                    "name": "电压",
                    "code": "0a",
                    "unit": "V"
                }, {"id": 13, "name": "电流", "code": "0b", "unit": "A"}, {
                    "id": 14,
                    "name": "有功功率",
                    "code": "0c",
                    "unit": "W"
                }, {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"}, {
                    "id": 18,
                    "name": "TVOC",
                    "code": "10",
                    "unit": "mg/m3"
                }],
                "type": false
            },
            "createDate": 1488624231000,
            "creator": "iLabService",
            "purchase": 1488326400000,
            "photo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/214/b6cc30e8-7502-4fe8-bf01-f9ac936c1b77",
            "manager": {
                "id": 136,
                "name": "ils",
                "password": "iLabService@123",
                "userName": "ils",
                "mobile": "15900751966",
                "createDate": 1489044084000,
                "email": "k.li@ilabservice.com",
                "department": "运营",
                "job": "ils",
                "jobNum": "000",
                "role": {
                    "id": 148,
                    "authority": "FIRM_MANAGER",
                    "roleAuthority": {"id": 3, "name": "FIRM_MANAGER"}
                },
                "companyName": "ilabservice",
                "verify": "7106",
                "bindMobile": 1,
                "bindEmail": 1,
                "companyLogo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b",
                "roleNames": "企业管理员 ",
                "companyId": "AM",
                "removeAlert": "2"
            },
            "alterNum": 0,
            "maintain": "365",
            "model": "iLabService",
            "xPoint": 260.0,
            "yPoint": 165.0,
            "monitorDevice": {"id": 110, "number": "修改41", "battery": "99.4", "online": 0},
            "deviceInspects": [{
                "id": 227,
                "inspectType": {"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"},
                "standard": 20.0,
                "lowUp": 30.0,
                "lowDown": 0.0,
                "highUp": 40.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温度（PT100）",
                "start": "-100.0",
                "value": "40.0",
                "end": "140.0",
                "zero": 0.0,
                "originalValue": 20.2578,
                "correctionValue": 20.2578,
                "inspectPurpose": 0
            }, {
                "id": 228,
                "inspectType": {"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"},
                "standard": 50.0,
                "lowUp": 70.0,
                "lowDown": 0.0,
                "highUp": 90.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温湿度(湿度)",
                "start": "-220.0",
                "value": "90.0",
                "end": "320.0",
                "zero": 0.0,
                "originalValue": 80.151,
                "correctionValue": 80.151,
                "inspectPurpose": 0
            }, {
                "id": 229,
                "inspectType": {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"},
                "standard": 10.0,
                "lowUp": 20.0,
                "lowDown": 0.0,
                "highUp": 20.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "二氧化碳",
                "start": "-50.0",
                "value": "20.0",
                "end": "70.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 230,
                "inspectType": {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"},
                "standard": 20.0,
                "lowUp": 40.0,
                "lowDown": 0.0,
                "highUp": 40.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "温湿度(温度)",
                "start": "-100.0",
                "value": "40.0",
                "end": "140.0",
                "zero": 0.0,
                "originalValue": -46.85,
                "correctionValue": -46.85,
                "inspectPurpose": 0
            }, {
                "id": 231,
                "inspectType": {"id": 6, "name": "房间压差", "code": "06", "unit": "pa"},
                "standard": 40.0,
                "lowUp": 100.0,
                "lowDown": 0.0,
                "highUp": 100.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "房间压差",
                "start": "-260.0",
                "value": "100.0",
                "end": "340.0",
                "zero": 0.0,
                "originalValue": -0.016667,
                "correctionValue": -0.017333,
                "inspectPurpose": 0
            }, {
                "id": 232,
                "inspectType": {"id": 7, "name": "甲烷含量", "code": "07", "unit": "LEL%"},
                "standard": 5.0,
                "lowUp": 10.0,
                "lowDown": 0.0,
                "highUp": 10.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "甲烷含量",
                "start": "-25.0",
                "value": "10.0",
                "end": "35.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 233,
                "inspectType": {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"},
                "standard": 1.0,
                "lowUp": 0.0,
                "lowDown": 0.0,
                "highUp": 5.0,
                "highDown": 5.0,
                "lowAlter": 10,
                "name": "设备门状态",
                "start": "1.0",
                "value": "0.0",
                "end": "1.0",
                "zero": 0.0,
                "originalValue": 1.0,
                "correctionValue": 1.0,
                "inspectPurpose": 0
            }, {
                "id": 234,
                "inspectType": {"id": 10, "name": "有功电能", "code": "08", "unit": "KWH"},
                "standard": 10.0,
                "lowUp": 50.0,
                "lowDown": 0.0,
                "highUp": 50.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "有功电能",
                "start": "-140.0",
                "value": "50.0",
                "end": "160.0",
                "zero": 0.0,
                "originalValue": 4.55889,
                "correctionValue": 4.55889,
                "inspectPurpose": 0
            }, {
                "id": 235,
                "inspectType": {"id": 11, "name": "无功电能", "code": "09", "unit": "KWH"},
                "standard": 10.0,
                "lowUp": 50.0,
                "lowDown": 0.0,
                "highUp": 50.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "无功电能",
                "start": "-140.0",
                "value": "50.0",
                "end": "160.0",
                "zero": 0.0,
                "originalValue": 6.90306,
                "correctionValue": 6.90306,
                "inspectPurpose": 0
            }, {
                "id": 236,
                "inspectType": {"id": 12, "name": "电压", "code": "0a", "unit": "V"},
                "standard": 20.0,
                "lowUp": 500.0,
                "lowDown": 0.0,
                "highUp": 500.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "电压",
                "start": "-1480.0",
                "value": "500.0",
                "end": "1520.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 237,
                "inspectType": {"id": 13, "name": "电流", "code": "0b", "unit": "A"},
                "standard": 40.0,
                "lowUp": 60.0,
                "lowDown": 0.0,
                "highUp": 60.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "电流",
                "start": "-140.0",
                "value": "60.0",
                "end": "220.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 238,
                "inspectType": {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"},
                "standard": 40.0,
                "lowUp": 70.0,
                "lowDown": 0.0,
                "highUp": 70.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "有功功率",
                "start": "-170.0",
                "value": "70.0",
                "end": "250.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 239,
                "inspectType": {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"},
                "standard": 40.0,
                "lowUp": 70.0,
                "lowDown": 0.0,
                "highUp": 70.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "无功功率",
                "start": "-170.0",
                "value": "70.0",
                "end": "250.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }, {
                "id": 240,
                "inspectType": {"id": 18, "name": "TVOC", "code": "10", "unit": "mg/m3"},
                "standard": 1.0,
                "lowUp": 2.0,
                "lowDown": 0.0,
                "highUp": 2.0,
                "highDown": 0.0,
                "lowAlter": 10,
                "name": "TVOC",
                "start": "-5.0",
                "value": "2.0",
                "end": "7.0",
                "zero": 0.0,
                "originalValue": 0.0,
                "correctionValue": 0.0,
                "inspectPurpose": 0
            }],
            "files": [{
                "id": 25,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_1.jpg",
                "createDate": 1488643848000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_1.jpg"
            }, {
                "id": 26,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_2.jpg",
                "createDate": 1488643858000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_2.jpg"
            }, {
                "id": 27,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_3.jpg",
                "createDate": 1488643864000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_3.jpg"
            }, {
                "id": 28,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_4.jpg",
                "createDate": 1488643868000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_4.jpg"
            }, {
                "id": 29,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_5.jpg",
                "createDate": 1488643873000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_5.jpg"
            }, {
                "id": 30,
                "url": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/devices/iLabService INTELAB物联网云监控解决方案_页面_6.jpg",
                "createDate": 1488643878000,
                "name": "iLabService INTELAB物联网云监控解决方案_页面_6.jpg"
            }],
            "pushType": "禁止推送",
            "pushInterval": 30,
            "roomName": "科海大楼7层iLabService",
            "score": "83.8",
            "enable": 1,
            "days": 37
        }],
        "thisNum": "5"
    };
    var deviceTypesSample = [
        {
            "id": 64,
            "name": "环境温度",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/64/7607d45c-7a86-41b2-a0b7-77feeb59087d",
            "inspectTypes": [{"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"}],
            "type": true
        }, {
            "id": 120,
            "name": "pt100+开关",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/120/fcdc009a-4d47-4dd5-bb70-b7c6c29c90cd",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": true
        }, {
            "id": 125,
            "name": "all",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/125/fbcac7c5-6caf-4a7f-ac57-8dfb3bc3ffb5",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 6, "name": "房间压差", "code": "06", "unit": "pa"}, {
                "id": 7,
                "name": "甲烷含量",
                "code": "07",
                "unit": "LEL%"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                "id": 10,
                "name": "有功电能",
                "code": "08",
                "unit": "KWH"
            }, {"id": 11, "name": "无功电能", "code": "09", "unit": "KWH"}, {
                "id": 12,
                "name": "电压",
                "code": "0a",
                "unit": "V"
            }, {"id": 13, "name": "电流", "code": "0b", "unit": "A"}, {
                "id": 14,
                "name": "有功功率",
                "code": "0c",
                "unit": "W"
            }, {"id": 15, "name": "无功功率", "code": "0d", "unit": "Q"}, {
                "id": 18,
                "name": "TVOC",
                "code": "10",
                "unit": "mg/m3"
            }],
            "type": false
        }, {
            "id": 126,
            "name": "温度+ 门+压差+电表",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/126/550ff778-0ebe-41f6-b3d6-78913d3f55fa",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 6,
                "name": "房间压差",
                "code": "06",
                "unit": "pa"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}, {
                "id": 10,
                "name": "有功电能",
                "code": "08",
                "unit": "KWH"
            }, {"id": 12, "name": "电压", "code": "0a", "unit": "V"}, {
                "id": 13,
                "name": "电流",
                "code": "0b",
                "unit": "A"
            }, {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"}],
            "type": false
        }, {
            "id": 127,
            "name": "温湿度+甲烷+门",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/127/f38c124a-af01-4659-8747-93a94d0b37a8",
            "inspectTypes": [{"id": 2, "name": "温湿度(湿度)", "code": "01", "unit": "%"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 7, "name": "甲烷含量", "code": "07", "unit": "LEL%"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": false
        }, {
            "id": 128,
            "name": "pt100+温湿度+门",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/128/2edad111-3039-401e-9616-67d6ca47e885",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 4, "name": "温湿度(温度)", "code": "04", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }],
            "type": false
        }, {
            "id": 129,
            "name": "pt100+温湿度+门开关+co2",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/129/66321523-8e4e-47bb-9432-5a36fa86aa25",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 2,
                "name": "温湿度(湿度)",
                "code": "01",
                "unit": "%"
            }, {"id": 3, "name": "二氧化碳", "code": "02", "unit": "ppm"}, {
                "id": 4,
                "name": "温湿度(温度)",
                "code": "04",
                "unit": "度"
            }, {"id": 8, "name": "设备门状态", "code": "05", "unit": "开/关"}],
            "type": false
        }, {
            "id": 132,
            "name": "家用冰箱",
            "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/devicetypes/132/8be094e6-eb3b-4410-9bdb-edf8ddde92ff",
            "inspectTypes": [{"id": 1, "name": "温度（PT100）", "code": "00", "unit": "度"}, {
                "id": 8,
                "name": "设备门状态",
                "code": "05",
                "unit": "开/关"
            }, {"id": 10, "name": "有功电能", "code": "08", "unit": "KWH"}, {
                "id": 11,
                "name": "无功电能",
                "code": "09",
                "unit": "KWH"
            }, {"id": 12, "name": "电压", "code": "0a", "unit": "V"}, {
                "id": 13,
                "name": "电流",
                "code": "0b",
                "unit": "A"
            }, {"id": 14, "name": "有功功率", "code": "0c", "unit": "W"}, {
                "id": 15,
                "name": "无功功率",
                "code": "0d",
                "unit": "Q"
            }],
            "type": false
        }];
    var inspectDeviceTypeSample = {
        "list": [{"id": 1, "name": "温度（PT100）", "chosed": false, "runningStatus": []}, {
            "id": 2,
            "name": "温湿度(湿度)",
            "chosed": false,
            "runningStatus": []
        }, {"id": 3, "name": "二氧化碳", "chosed": false, "runningStatus": []}, {
            "id": 4,
            "name": "温湿度(温度)",
            "chosed": false,
            "runningStatus": []
        }, {"id": 6, "name": "房间压差", "chosed": false, "runningStatus": []}, {
            "id": 7,
            "name": "甲烷含量",
            "chosed": false,
            "runningStatus": []
        }, {"id": 8, "name": "设备门状态", "chosed": false, "runningStatus": []}, {
            "id": 9,
            "name": "电池电量",
            "chosed": false,
            "runningStatus": []
        }, {"id": 10, "name": "有功电能", "chosed": false, "runningStatus": []}, {
            "id": 11,
            "name": "无功电能",
            "chosed": false,
            "runningStatus": []
        }, {"id": 12, "name": "电压", "chosed": false, "runningStatus": []}, {
            "id": 13,
            "name": "电流",
            "chosed": false,
            "runningStatus": []
        }, {"id": 14, "name": "有功功率", "chosed": false, "runningStatus": []}, {
            "id": 15,
            "name": "无功功率",
            "chosed": false,
            "runningStatus": []
        }, {"id": 16, "name": "温度", "chosed": false, "runningStatus": []}, {
            "id": 17,
            "name": "湿度",
            "chosed": false,
            "runningStatus": []
        }, {"id": 18, "name": "TVOC", "chosed": false, "runningStatus": []}, {
            "id": 19,
            "name": "烟雾监控",
            "chosed": false,
            "runningStatus": []
        }, {"id": 20, "name": "pm2.5", "chosed": false, "runningStatus": []}, {
            "id": 21,
            "name": "pm10",
            "chosed": false,
            "runningStatus": []
        }, {"id": 22, "name": "电能", "chosed": false, "runningStatus": []}, {
            "id": 23,
            "name": "电压",
            "chosed": false,
            "runningStatus": []
        }, {"id": 24, "name": "电流", "chosed": false, "runningStatus": []}, {
            "id": 25,
            "name": "功率",
            "chosed": false,
            "runningStatus": []
        }]
    };
    var currentDeviceTypeSample = {
        "id": 129,
        "name": "pt100+温湿度+门开关+co2",
        "list": [{
            "id": 1,
            "name": "温度（PT100）",
            "lowUp": "40.0",
            "lowDown": "0.0",
            "highUp": "40.0",
            "highDown": "0.0",
            "standard": "20.0",
            "chosed": true,
            "runningStatus": [],
            "inspectPurpose": 0
        }, {
            "id": 2,
            "name": "温湿度(湿度)",
            "lowUp": "40.0",
            "lowDown": "0.0",
            "highUp": "40.0",
            "highDown": "0.0",
            "standard": "30.0",
            "chosed": true,
            "runningStatus": [],
            "inspectPurpose": 0
        }, {
            "id": 3,
            "name": "二氧化碳",
            "lowUp": "60.0",
            "lowDown": "0.0",
            "highUp": "60.0",
            "highDown": "0.0",
            "standard": "40.0",
            "chosed": true,
            "runningStatus": [],
            "inspectPurpose": 0
        }, {
            "id": 4,
            "name": "温湿度(温度)",
            "lowUp": "40.0",
            "lowDown": "0.0",
            "highUp": "40.0",
            "highDown": "0.0",
            "standard": "30.0",
            "chosed": true,
            "runningStatus": [],
            "inspectPurpose": 0
        }, {
            "id": 8,
            "name": "设备门状态",
            "lowUp": "0.0",
            "lowDown": "0.0",
            "highUp": "5.0",
            "highDown": "5.0",
            "standard": "1.0",
            "chosed": true,
            "runningStatus": [],
            "inspectPurpose": 0
        }]
    };

    //------------------------- 测试 函数 api 调用， 返回|修改 以上测试数据 -------------


    tools.getUserInfoSample = function () {


        if (!Session.user) {
            return user_firm_manager;
        }

        if (!Session.company) {
            return user_service_manager;
        } else {
            return user_firm_manager;
        }
    };
    tools.getCompanyInfoSample = function () {
        return companyInfoSample;
    };


    tools.getDeviceSample = function () {
        return deviceSample;
    };


    tools.getDeviceScientistsSample = function () {
        return deviceScientistsSample;
    };

    tools.getDeviceManagerListSample = function () {
        return deviceManagersSample;
    };

    tools.getDeviceRunningStatusSample = function () {
        return runningStatusSample;
    };


    tools.getDeviceParametersSample = function () {
        return deviceParametersSample;
    };
//因为这个地方是返回一个交接的用户列表，再删除的时候需要选择
    tools.getDeleteUserInitSample = function () {
        return deleteUserInitSample;
    };


    tools.getRoomSample = function (roomId) {
        for (var i = 0; i < roomListSample.length; i++) {
            if (roomListSample[i].id == roomId) {
                return roomListSample[i];
            }
        }
    };


    tools.getFloorSample = function (floorId) {
        for (var i = 0; i < floorListSample.length; i++) {
            if (floorListSample[i].id == floorId) {
                return floorListSample[i];
            }
        }
    };


    tools.getBuildingSample = function (buildingId) {

        for (var i = 0; i < buildingListSample.length; i++) {
            if (buildingListSample[i].id == buildingId) {
                return buildingListSample[i];
            }
        }

    };


    tools.getCampusSample = function () {
        return campusSample;
    };
// ----------------------------------------dashboard APISample end----------------------------


// ----------------------------------------userList APISample start----------------------------
    //这个userlist应该存在一个变量里。 所有相关user的操作都在这个list变量上， 不要再创建其他的， 可以和上面的那个user merge起来
    tools.getUserListSample = function () {
        return userListSample;
    };

    // 上面已经有company的sample data了， 这里就不要重复了。
    tools.getUserCompanySample = function () {
        return userCompanySample;
    };
    //同上， 只要一个userlist
    tools.getCompanyUserListSample = function () {
        return companyUserListSample;

    };
    tools.createUserSample = function () {
        return {"error": 0, "message": "创建成功！"}
    };
    tools.saveDeleteUserHandSample = function () {
        return {"error": 0, "message": "创建成功！"}
    };


    // ----------------------------------------userList APISample end----------------------------


// ----------------------------------------userdevice APISample start----------------------------

    tools.getDeviceTypeSample = function () {
        return deviceTypeSample;
    };
    tools.getDeviceListSample = function () {
        return deviceListSample;

    };
    tools.getDeviceTypeListSample = function () {
        return deviceTypeListSample;

    };
    tools.getScientistListSample = function () {
        return [{'id': 1, 'name': 'xuge'}, {'id': 2, 'name': 'xieanhuan'}];
    };

    tools.getUserDeviceListSample = function () {
        return userDeviceListSample;
    };
    tools.saveDeleteDeviceInfoSample = function () {
        return {"error": 0, "message": "删除成功！"}
    };

    // ----------------------------------------settings APISample start----------------------------


    tools.updateFloorInfo = function (name, data) {
        if (data.floorId) {
            //修改
            for (var i = 0; i < buildingListSample.length; i++) {
                if (buildingListSample.id != data.buildId) {
                    continue;
                }
                for (var j = 0; j < buildingListSample[i].floors.length; j++) {
                    if (buildingListSample[i].floors[j].id == data.floorId) {
                        buildingListSample[i].floors[j].xpoint = data.ceng_xpoint;
                        buildingListSample[i].floors[j].ypoint = data.ceng_ypoint;
                        buildingListSample[i].floors[j].name = name;

                        return;
                    }
                }
            }
        } else {
            //新增
            for (var i = 0; i < buildingListSample.length; i++) {
                if (buildingListSample[i].id == data.buildId) {

                    var newFloor = JSON.parse(JSON.stringify(buildingListSample[i].floors[0]));

                    newFloor.name = name;
                    newFloor.xpoint = data.ceng_xpoint;
                    newFloor.ypoint = data.ceng_ypoint;

                    buildingListSample.push(newFloor);
                }
            }
        }
    };


    tools.getDeviceTypesSample = function () {
        return deviceTypesSample;
    };

    tools.getInspectDeviceTypeSample = function () {
        return inspectDeviceTypeSample;
    };

    tools.getCurrentDeviceTypeSample = function () {
        return currentDeviceTypeSample;
    };
    tools.postDeviceTypeSample = function () {
        return ''
    };
    tools.getBuildListSample = function (data) {
        /*  var xp,yp;
         if(build_xpoint){xp=build_xpoint}else{xp=575.0}
         if(build_ypoint){yp=build_ypoint}else{yp=575.0}*/
        if (data) {
            var build_name = data.build_name;
            var build_xpoint = data.build_xpoint;
            var build_ypoint = data.build_ypoint;
            var type = data.type;
        }
        var listData = [{
            "name": "科海大楼",
            "xpoint": 116,
            "ypoint": 39,
            "deviceNum": 4,
            "createDate": 1488624068000,
            "lowAlert": 0,
            "highAlert": 2,
            "online": 2,
            "offline": 2,
            "total": 4,
            "score": 32.825,
            "enable": 0,
            "days": 38
        }, {
            "name": "科海大楼",
            "xpoint": 116,
            "ypoint": 39,
            "deviceNum": 4,
            "createDate": 1488624068000,
            "lowAlert": 0,
            "highAlert": 2,
            "online": 2,
            "offline": 2,
            "total": 4,
            "score": 32.825,
            "enable": 1,
            "days": 38
        }];
        var flag = 0;
        if (build_name) {
            var newBuild = {
                "name": build_name,
                "xpoint": build_xpoint,
                "ypoint": build_ypoint
            };
            for (var i = 0; i < listData.length; i++) {
                if ((listData[i].name == build_name) && build_name) {
                    listData[i] = newBuild;
                }
            }
            if (type == 0) {
                listData.push(newBuild);
            }

        }
        return {
            "data": {
                "id": 59,
                "name": "ilabservice",
                "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/0beb2f42-5719-4f3c-b594-24da14c966c5",
                "days": 38,
                "list": listData,
                "lowAlert": 0,
                "highAlert": 3,
                "online": 2,
                "offline": 3,
                "total": 5,
                "score": 18.925,
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b"
            }
        }
    };


    tools.deleteBuildSample = function () {
        return {"error": 0, "message": "删除成功！"}
    };
    tools.getFloorsSample = function (data) {
        if (data) {
            var floor_name = data.floor_name;
            var floor_xpoint = data.floor_xpoint;
            var floor_ypoint = data.floor_ypoint;
            var type = data.type;
        }

        var listData = [{
            "id": 439,
            "name": "7层",
            "deviceNum": 4,
            "createDate": 1488624079000,
            "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            "xpoint": 610.0,
            "ypoint": 255.0,
            "lowAlert": 0,
            "highAlert": 2,
            "online": 2,
            "offline": 2,
            "total": 4,
            "score": 32.825,
            "enable": 1,
            "days": 38
        }, {
            "id": 439,
            "name": "11层",
            "deviceNum": 4,
            "createDate": 1488624079000,
            "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
            "xpoint": 610.0,
            "ypoint": 255.0,
            "lowAlert": 0,
            "highAlert": 2,
            "online": 2,
            "offline": 2,
            "total": 4,
            "score": 32.825,
            "enable": 1,
            "days": 38
        }];
        var flag = 0;
        if (floor_name) {
            var newBuild = {
                "name": floor_name,
                "xpoint": floor_xpoint,
                "ypoint": floor_ypoint
            };
            for (var i = 0; i < listData.length; i++) {
                if ((listData[i].name == floor_name) && floor_name) {
                    listData[i] = newBuild;
                }
            }
            if (type == 0) {
                listData.push(newBuild);
            }
            localStorage.jsonFloor = JSON.stringify(listData);
        }
        return {
            "error": 0,
            "message": "OK",
            "data": {
                "id": 50,
                "name": "科海大楼",
                "alertNum": 0,
                "days": 38,
                "floors": listData,
                "buildId": 50,
                "lowAlert": 0,
                "highAlert": 2,
                "online": 2,
                "offline": 2,
                "total": 4,
                "score": 32.825,
                "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002"
            }
        }
    };
    tools.addFloorSample = function () {
        return {
            "error": 0,
            "message": "OK",
            "data": {
                "id": 50,
                "name": "科海大楼",
                "alertNum": 0,
                "days": 38,
                "floors": [{
                    "id": 439,
                    "name": "7层",
                    "deviceNum": 4,
                    "createDate": 1488624079000,
                    "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/floors/439/d959481a-78ab-4c7a-91a9-3e7926c70783",
                    "xpoint": 610.0,
                    "ypoint": 255.0,
                    "lowAlert": 0,
                    "highAlert": 2,
                    "online": 2,
                    "offline": 2,
                    "total": 4,
                    "score": 32.825,
                    "enable": 1,
                    "days": 38
                }],
                "buildId": 50,
                "lowAlert": 0,
                "highAlert": 2,
                "online": 2,
                "offline": 2,
                "total": 4,
                "score": 32.825,
                "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/buildings/50/0d5f4363-24a5-43e8-a598-bc447fdb6002"
            }
        }
    };

    tools.getRoomListSample = function (xpoint, ypoint) {
        var xp, yp;
        if (xpoint) {
            xp = xpoint
        } else {
            xp = 575.0
        }
        if (ypoint) {
            yp = ypoint
        } else {
            yp = 575.0
        }

        return {
            "error": 0,
            "message": "OK",
            "data": {
                "id": 59,
                "name": "ilabservice",
                "background": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/0beb2f42-5719-4f3c-b594-24da14c966c5",
                "days": 38,
                "roomList": [{
                    "id": 50,
                    "name": "科海大楼",
                    "xpoint": xp,
                    "ypoint": yp,
                    "deviceNum": 4,
                    "createDate": 1488624068000,
                    "lowAlert": 0,
                    "highAlert": 2,
                    "online": 2,
                    "offline": 2,
                    "total": 4,
                    "score": 32.825,
                    "enable": 1,
                    "days": 38
                }],
                "lowAlert": 0,
                "highAlert": 3,
                "online": 2,
                "offline": 3,
                "total": 5,
                "score": 18.925,
                "logo": "https://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/beb937d0-3378-48c7-bf87-16abe3fee25b"
            }
        }
    };

// ----------------------------------------settings APISample end----------------------------


// ----------------------------------------userDevice APISample end----------------------------
    var companyListSample = [
        {
            address: "上海张江",
            background: "https://ilsdevresource.blob.core.chinacloudapi.cn/company60/company/65c511ad-1418-4191-847a-72d2b9b9628f",
            companyId: "BD",
            createDate: 1489367283000,
            email: "107699621@qq.com",
            enable: 1,
            highAlert: 0,
            id: 60,
            lat: 31.2108,
            lng: 121.592,
            location: "121.592,31.2108",
            login: "http://bd.intelab.cloud",
            lowAlert: 0,
            name: "kungfu",
            offline: 4,
            online: 0,
            score: 57.9375,
            telephone: "",
            total: 4,
            manager: {
                companyId: "BD",
                companyName: "kungfu",
                id: 141,
                name: "kungfu",
                password: "123",
                roleNames: "企业管理员 ",
                userName: "李",
                mobile: "127847264"
            }
        },
        {
            address: "上海纳贤路800号",
            background: "hhttps://ilsdevresource.blob.core.chinacloudapi.cn/company59/company/0beb2f42-5719-4f3c-b594-24da14c966c5",
            companyId: "AM",
            createDate: 1489367283000,
            email: "zy.li@ilabservice.com",
            enable: 1,
            highAlert: 0,
            id: 59,
            lat: 31.1894,
            lng: 121.611,
            location: "121.592,31.2108",
            login: "http://am.intelab.cloud",
            lowAlert: 0,
            name: "ilabservice",
            offline: 4,
            online: 0,
            score: 57.9375,
            telephone: "",
            total: 4,
            manager: {
                companyId: "AM",
                companyName: "ilabservice",
                id: 136,
                name: "ilabservice",
                password: "123",
                roleNames: "企业管理员 ",
                userName: "ils",
                mobile: '13787268472'
            }
        }
    ];
    tools.getCompanyListSample = function () {
        return companyListSample;
    };


    var versionListSample = [{
        "id": 20,
        "name": "1",
        "url": "https://ilsresources.blob.core.chinacloudapi.cn/version/version/20/0_weixiu_5900_20160319134553.jpg",
        "firstCode": "1",
        "secondCode": "1",
        "thirdCode": "11",
        "forthCode": "1",
        "type": "01",
        "createDate": 1482426381000
    }];
    tools.getVersionListSample = function () {
        return versionListSample;
    };

    return tools;
}
