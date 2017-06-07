/**
 * Created by fang on 2017/6/4.
 */
angular.module('defenseApp')
    .controller('testCtrl', testController);

testController.$inject = ['$scope', '$state', '$rootScope', 'APIService', 'Session', 'Tools', '$interval'];

function testController($scope, $state, $rootScope, APIService, Session, Tools, $interval) {
    window.scrollTo(0, 0);
    $scope.testType = localStorage.getItem('testType');
    $scope.praMenuList = [{
        'id': 0,
        'name': '专项练习',
        'type': 'special',
        'icon': '/images/specialPractice.png',
        'link': 'home.test'
    }, {
        'id': 1,
        'name': '随机练习', 'type': 'random',
        'icon': '/images/randomPactice.png', 'link': 'home.test'
    },
        {'id': 2, 'name': '错题练习', 'type': 'error', 'icon': '/images/errorPractice.png', 'link': 'home.test'}, {
            'id': 3,
            'name': '模拟练习', 'type': 'simulate',
            'icon': '/images/simulatePractice.png', 'link': 'home.test'
        }];
    for (var i = 0; i < $scope.praMenuList.length; i++) {
        if ($scope.praMenuList[i].type == $scope.testType) {
            $scope.currentTestType = $scope.praMenuList[i];
        }
    }


    $scope.sureSubmit = 1;
    $scope.RatioExamination = [
        {
            'ind': 0,
            'id': 1,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 1,
            'id': 2,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 2,
            'id': 3,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 3,
            'id': 4,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }];
    $scope.multipleChoice = [
        {
            'ind': 0,
            'id': 1,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 1,
            'id': 2,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 2,
            'id': 3,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }, {
            'ind': 3,
            'id': 4,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}], ['C', '勤学苦练。', {'checked': false}], ['D', '政治过硬。', {'checked': false}]]
        }];
    $scope.judgment = [
        {
            'ind': 0,
            'id': 1,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}]]
        }, {
            'ind': 1,
            'id': 2,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}]]
        }, {
            'ind': 2,
            'id': 3,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}]]
        }, {
            'ind': 3,
            'id': 4,
            'bg': 'testNext',
            'name': '国防要求什么样的人员素质？',
            'choice': [['A', '大学四级英语。', {'checked': false}], ['B', '长像端正。', {'checked': false}]]
        }];
    $scope.chooseRatio = function (ratio, type, testCheck) {
        $scope.currentType = type;
        $scope.currentRatio = ratio;
        if (type == 'RatioExamination') {
            $scope.currentQuestion = $scope.RatioExamination[ratio - 1].name;
            $scope.currentChioce = $scope.RatioExamination[ratio - 1].choice;
            if (testCheck) {
                $scope.RatioExamination[ratio - 1].bg = testCheck;
            } else {
                $scope.RatioExamination[ratio - 1].bg = 'testCurrent';
            }
            for (var i = 0; i < $scope.RatioExamination.length; i++) {
                if ((i != ratio - 1) && ($scope.RatioExamination[i].bg != 'testNext')) {
                    $scope.RatioExamination[i].bg = 'testOld';
                }
            }

        } else if (type == 'multipleChoice') {
            $scope.currentQuestion = $scope.multipleChoice[ratio - 1].name;
            $scope.currentChioce = $scope.multipleChoice[ratio - 1].choice;
            if (testCheck) {
                $scope.multipleChoice[ratio - 1].bg = testCheck;
            } else {
                $scope.multipleChoice[ratio - 1].bg = 'testCurrent';
            }
            for (var j = 0; j < $scope.multipleChoice.length; j++) {
                if ((j != ratio - 1) && ($scope.multipleChoice[j].bg != 'testNext')) {
                    $scope.multipleChoice[j].bg = 'testOld';
                }
            }
        } else if (type == 'judgment') {
            $scope.currentQuestion = $scope.judgment[ratio - 1].name;
            $scope.currentChioce = $scope.judgment[ratio - 1].choice;
            if (testCheck) {
                $scope.judgment[ratio - 1].bg = testCheck;
            } else {
                $scope.judgment[ratio - 1].bg = 'testCurrent';
            }
            for (var k = 0; k < $scope.judgment.length; k++) {
                if ((k != ratio - 1) && ($scope.judgment[k].bg != 'testNext')) {
                    $scope.judgment[k].bg = 'testOld';
                }
            }
        }
    };
    $scope.chooseRatio(1, 'RatioExamination');

    // 交卷

    $scope.submitTest = function () {

        $state.go('home.testQualified');
    };

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

    $scope.selectOnly = function (currentType, choice) {
        if (currentType == 'multipleChoice') {
            for (var i = 0; i < $scope.currentChioce.length; i++) {
                if (choice[0] == $scope.currentChioce[i][0]) {
                    $scope.currentChioce[i][2].checked = choice[2].checked;
                }
            }
        } else {
            for (var i = 0; i < $scope.currentChioce.length; i++) {
                if (choice[0] == $scope.currentChioce[i][0]) {
                    $scope.currentChioce[i][2].checked = choice[2].checked;
                } else if (choice[2].checked == true) {
                    $scope.currentChioce[i][2].checked = false;
                }
            }
        }
    }
}