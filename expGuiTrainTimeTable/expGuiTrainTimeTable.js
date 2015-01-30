/**
 *  �w���ς��� Web �T�[�r�X
 *  ��Ԏ����\�p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiTrainTimeTable = function (pObject, config) {
    /*
    * �h�L�������g�̃I�u�W�F�N�g���i�[
    */
    var documentObject = pObject;
    var baseId = pObject.id;

    /*
    * Web�T�[�r�X�̐ݒ�
    */
    // var apiURL="http://test-asp.ekispert.jp/";
    var apiURL = "http://api.ekispert.jp/";

    /*
    * GET�p�����[�^����L�[�̐ݒ�
    */
    var key;
    var scripts = document.getElementsByTagName("script");
    var imagePath;
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        imagePath = s.src.substring(0, s.src.indexOf("expGuiTrainTimeTable\.js"));
        if (s.src && s.src.match(/expGuiTrainTimeTable\.js(\?.*)?/)) {
            var params = s.src.replace(/.+\?/, '');
            params = params.split("&");
            for (var i = 0; i < params.length; i++) {
                var tmp = params[i].split("=");
                if (tmp[0] == "key") {
                    key = unescape(tmp[1]);
                }
            }
            break;
        }
    }

    /*
    * AGENT�̃`�F�b�N
    */
    var agent = 1;
    var isiPad = navigator.userAgent.match(/iPad/i) != null;
    var isiPhone = navigator.userAgent.match(/iPhone/i) != null;
    var isAndroid_phone = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) != null);
    var isAndroid_tablet = (navigator.userAgent.match(/Android/i) != null && navigator.userAgent.match(/Mobile/i) == null);
    if (isiPhone || isAndroid_phone) { agent = 2; }
    if (isiPad || isAndroid_tablet) { agent = 3; }

    /*
    * �C�x���g�̐ݒ�(IE�Ή���)
    */
    function addEvent(element, eventName, func) {
        if (element) {
            if (typeof eventName == 'string' && typeof func == 'function') {
                if (element.addEventListener) {
                    element.addEventListener(eventName, func, false);
                } else if (element.attachEvent) {
                    element.attachEvent("on" + eventName, func);
                }
            }
        }
    }

    /*
    * �ϐ��S
    */
    var httpObj;
    var timeTable;
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�
    var timeTableClickFunction;

    /*
    * ��Ԏ����\�̐ݒu
    */
    function dispStationTrainTimetable(code, callback) {
        var buffer = '';
        buffer += '<div id="' + baseId + ':trainTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':trainTimetable').innerHTML = '<div class="expLoading"><div class="expText">���擾��...</div></div>';
        document.getElementById(baseId + ':trainTimetable').style.display = "block";
        var url = apiURL + "v1/json/station/timetable/train?key=" + key + "&code=" + code;
        callbackFunction = callback;
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                outTimeTable(JSON_object);
            };
            httpObj.onerror = function () {
                // �G���[���̏���
                if (typeof callbackFunction == 'function') {
                    callbackFunction(false);
                }
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    outTimeTable(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // �G���[���̏���
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(false);
                    }
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * ��Ԏ����\�̐ݒu
    */
    function dispCourseTrainTimetable(code, callback) {
        var buffer = '';
        buffer += '<div id="' + baseId + ':trainTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/course/timetable/train?key=" + key + "&code=" + code;
        callbackFunction = callback;

        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                outTimeTable(JSON_object);
            };
            httpObj.onerror = function () {
                // �G���[���̏���
                if (typeof callbackFunction == 'function') {
                    callbackFunction(false);
                }
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    outTimeTable(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // �G���[���̏���
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(false);
                    }
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * ISO�̓����𕶎���ɕϊ�
    */
    function convertISOtoTime(str, type) {
        var tmp_time = str.split(":");
        var hour = parseInt(tmp_time[0], 10);
        if (typeof type != 'undefined') {
            if (type == "yesterday") { hour += 24; }
        }
        return String(hour) + ":" + tmp_time[1];
    }

    /*
    * �����\�̏o�͊J�n
    */
    function outTimeTable(timeTableObject) {
        timeTable = timeTableObject;

        // �����\�̏o��
        outTimeTableObj();

        if (typeof callbackFunction == 'function') {
            callbackFunction(true);
        }
    }

    /*
    * �����\���̎��ԏo��
    */
    function getTimeString(timeObject) {
        var linkTimeList = convertISOtoTime(timeObject.text, timeObject.operation).split(':');
        return '<a id="' + baseId + ':table:' + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10)) + '" href="Javascript:void(0);" style="text-decoration:none;color:Black;font-weight:bold;">' + convertISOtoTime(timeObject.text) + '</a>';
    }

    /*
    * �����\�̏o��
    */
    function outTimeTableObj() {
        // �����\�̕\��
        var buffer = '';
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiTrainTimeTable expGuiTrainTimeTablePc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiTrainTimeTable expGuiTrainTimeTablePhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiTrainTimeTable expGuiTrainTimeTableTablet">';
        }
        buffer += '<div class="exp_header">';
        buffer += '<div class="exp_name"><span class="exp_value">' + timeTable.ResultSet.Line.Name + '</span></div>';
        buffer += '<div class="exp_comment"><span class="exp_value">' + timeTable.ResultSet.Line.DriveComment + '</span></div>';
        buffer += '</div>';

        buffer += '<div class="exp_timeTable">';
        buffer += '<table>';
        buffer += '<tr><th class="exp_tableHeader">�w��</th><th class="exp_tableHeader" colspan="2">����</th></tr>';
        for (var i = 0; i < timeTable.ResultSet.Line.Stop.length; i++) {
            buffer += '<tr class="exp_' + ((i % 2 == 0) ? "odd" : "even") + '">';
            // ���������̎擾
            var dateTimeObject = (typeof timeTable.ResultSet.Line.Stop[i].DepartureState != 'undefined') ? timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime : timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime;
            var linkTimeList = convertISOtoTime(dateTimeObject.text, dateTimeObject.operation).split(':');
            if (typeof timeTable.ResultSet.Line.Stop[i].DepartureState == 'undefined' || typeof timeTable.ResultSet.Line.Stop[i].ArrivalState == 'undefined') {
                // �ǂ��炩���
                buffer += '<td class="exp_name"><a id="' + baseId + ':point:' + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10)) + '" href="Javascript:void(0);">' + timeTable.ResultSet.Line.Stop[i].Point.Station.Name + '</a></td>';
                buffer += '<td class="exp_minute" colspan="2"><a id="' + baseId + ':table:' + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10)) + '" href="Javascript:void(0);">' + linkTimeList.join(":") + '</a></td>';
            } else {
                // ��������
                if (timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.text == timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text) {
                    // ��������
                    buffer += '<td class="exp_name"><a id="' + baseId + ':point:' + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10)) + '" href="Javascript:void(0);">' + timeTable.ResultSet.Line.Stop[i].Point.Station.Name + '</a></td>';
                    buffer += '<td class="exp_minute" colspan="2"><a id="' + baseId + ':table:' + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10)) + '" href="Javascript:void(0);">' + linkTimeList.join(":") + '</a></td>';
                } else {
                    // �قȂ鎞��
                    var arrTimeList = convertISOtoTime(timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text, timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.operation).split(':');
                    var depTimeList = convertISOtoTime(timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.text, timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.operation).split(':');
                    buffer += '<td class="exp_name" rowspan="2"><a id="' + baseId + ':point:' + String(parseInt(depTimeList[0], 10)) + ':' + String(parseInt(depTimeList[1], 10)) + '" href="Javascript:void(0);">' + timeTable.ResultSet.Line.Stop[i].Point.Station.Name + '</a></td>';
                    buffer += '<td class="exp_arrival"><span class="exp_caption">��</span></td>';
                    buffer += '<td class="exp_arrivalMinute"><b><a id="' + baseId + ':table:' + String(parseInt(arrTimeList[0], 10)) + ':' + String(parseInt(arrTimeList[1], 10)) + '" href="Javascript:void(0);">' + arrTimeList.join(":") + '</a></td>';
                    buffer += '</tr>';
                    buffer += '<tr class="exp_' + ((i % 2 == 0) ? "odd" : "even") + '">';
                    buffer += '<td class="exp_departure"><span class="exp_caption">��</span></td>';
                    buffer += '<td class="exp_departureMinute"><a id="' + baseId + ':table:' + String(parseInt(depTimeList[0], 10)) + ':' + String(parseInt(depTimeList[1], 10)) + '" href="Javascript:void(0);">' + depTimeList.join(":") + '</a></td>';
                }
            }
            buffer += '</tr>';
        }
        buffer += '</div>';
        buffer += '</div>';
        document.getElementById(baseId + ':trainTimetable').innerHTML = buffer;
        document.getElementById(baseId + ':trainTimetable').style.display = "block";

        // �C�x���g�̐ݒu
        for (var i = 0; i < timeTable.ResultSet.Line.Stop.length; i++) {
            // ���������̎擾
            var dateTimeObject = (typeof timeTable.ResultSet.Line.Stop[i].DepartureState != 'undefined') ? timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime : timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime;
            var linkTimeList = convertISOtoTime(dateTimeObject.text, dateTimeObject.operation).split(':');
            // �w�͕Е������ݒ肵�Ȃ�
            addEvent(document.getElementById(baseId + ":point:" + String(parseInt(linkTimeList[0], 10)) + ':' + String(parseInt(linkTimeList[1], 10))), "click", onEvent);
            if (typeof timeTable.ResultSet.Line.Stop[i].DepartureState != 'undefined') {
                // �����Ԃ̃C�x���g��ݒ�
                var depTimeList = convertISOtoTime(timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.text, timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.operation).split(':');
                addEvent(document.getElementById(baseId + ":table:" + String(parseInt(depTimeList[0], 10)) + ':' + String(parseInt(depTimeList[1], 10))), "click", onEvent);
                if (typeof timeTable.ResultSet.Line.Stop[i].ArrivalState != 'undefined') {
                    // ���������`�F�b�N
                    if (timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.text != timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text) {
                        // �Ⴄ�ꍇ�̂݃C�x���g��ݒu
                        var arrTimeList = convertISOtoTime(timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text, timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.operation).split(':');
                        addEvent(document.getElementById(baseId + ":table:" + String(parseInt(arrTimeList[0], 10)) + ':' + String(parseInt(arrTimeList[1], 10))), "click", onEvent);
                    }
                }
            } else {
                // �����Ԃ̃C�x���g��ݒ�
                var arrTimeList = convertISOtoTime(timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text, timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.operation).split(':');
                addEvent(document.getElementById(baseId + ":table:" + String(parseInt(arrTimeList[0], 10)) + ':' + String(parseInt(arrTimeList[1], 10))), "click", onEvent);
            }
        }
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "point" && eventIdList.length == 4) {
                // �w�����N���b�N
                if (typeof timeTableClickFunction != 'undefined') {
                    timeTableClickFunction(((eventIdList[2].length == 1) ? "0" : "") + eventIdList[2] + ((eventIdList[3].length == 1) ? "0" : "") + eventIdList[3]);
                }
            } else if (eventIdList[1] == "table" && eventIdList.length == 4) {
                // �����\���N���b�N
                if (typeof timeTableClickFunction != 'undefined') {
                    timeTableClickFunction(((eventIdList[2].length == 1) ? "0" : "") + eventIdList[2] + ((eventIdList[3].length == 1) ? "0" : "") + eventIdList[3]);
                }
            }
        }
    }

    /*
    * ���Ԃ���n�_�I�u�W�F�N�g���擾
    */
    function getPointObject(time) {
        var checkTime = String(Number(String(time).substr(0, 2), 10)) + ":" + String(time).substr(2);
        if (typeof timeTable.ResultSet.Line != 'undefined') {
            for (var i = 0; i < timeTable.ResultSet.Line.Stop.length; i++) {
                //�����Ԃ��`�F�b�N
                if (typeof timeTable.ResultSet.Line.Stop[i].ArrivalState != 'undefined') {
                    if (convertISOtoTime(timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.text, timeTable.ResultSet.Line.Stop[i].ArrivalState.Datetime.operation) == checkTime) {
                        return convertPointObject(timeTable.ResultSet.Line.Stop[i]);
                    }
                }
                //�����Ԃ��`�F�b�N
                if (typeof timeTable.ResultSet.Line.Stop[i].DepartureState != 'undefined') {
                    if (convertISOtoTime(timeTable.ResultSet.Line.Stop[i].DepartureState.Datetime.text, timeTable.ResultSet.Line.Stop[i].DepartureState.operation) == checkTime) {
                        return convertPointObject(timeTable.ResultSet.Line.Stop[i]);
                    }
                }
            }
        }
        return;
    }

    /*
    * point�I�u�W�F�N�g���쐬
    */
    function convertPointObject(stopObject) {
        var tmpPointObject = new Object();
        tmpPointObject.name = stopObject.Point.Station.Name;
        tmpPointObject.code = stopObject.Point.Station.code;
        tmpPointObject.getOn = (stopObject.Point.getOn == "True") ? true : false;
        tmpPointObject.getOff = (stopObject.Point.getOff == "True") ? true : false;
        // ������
        if (typeof stopObject.DepartureState != 'undefined') {
            tmpPointObject.departureTime = convertISOtoTime(stopObject.DepartureState.Datetime.text, stopObject.DepartureState.Datetime.operation);
        }
        // ������
        if (typeof stopObject.ArrivalState != 'undefined') {
            tmpPointObject.arrivalTime = convertISOtoTime(stopObject.ArrivalState.Datetime.text, stopObject.ArrivalState.Datetime.operation);
        }
        return tmpPointObject;
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("Agent").toLowerCase()) {
            agent = value;
        }
    }

    /*
    * �R�[���o�b�N�֐��̒�`
    */
    function bind(type, func) {
        if (type == 'click' && typeof func == 'function') {
            timeTableClickFunction = func;
        }
    }

    /*
    * �R�[���o�b�N�֐��̉���
    */
    function unbind(type) {
        if (type == 'click') {
            timeTableClickFunction = undefined;
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.dispStationTrainTimetable = dispStationTrainTimetable;
    this.dispCourseTrainTimetable = dispCourseTrainTimetable;
    this.getPointObject = getPointObject;
    this.setConfigure = setConfigure;
    this.bind = bind;
    this.unbind = unbind;

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
