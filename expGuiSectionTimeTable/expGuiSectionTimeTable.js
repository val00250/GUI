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

var expGuiSectionTimeTable = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiSectionTimeTable\.js"));
        if (s.src && s.src.match(/expGuiSectionTimeTable\.js(\?.*)?/)) {
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
    var sectionList;
    var timeTable;
    var type;
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�
    var timeTableClickFunction;

    /*
    * ��H�����\�̐ݒu
    */
    function dispPlaneTimetable(railName, direction, param1, param2) {
        type = "plane";
        var buffer = '';
        buffer += '<div id="' + baseId + ':sectionTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':sectionTimetable').innerHTML = '<div class="expLoading"><div class="expText">�����\�擾��...</div></div>';
        document.getElementById(baseId + ':sectionTimetable').style.display = "block";
        var url = apiURL + "v1/json/plane/timetable?key=" + key + "&railName=" + encodeURIComponent(railName);
        url += "&direction=" + String(direction);
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                // ���t�Ȃ�
                callbackFunction = param1;
            } else {
                // �R�[���o�b�N�Ȃ�
                url += "&date=" + param1;
                callbackFunction = undefined;
            }
        } else {
            url += "&date=" + param1;
            callbackFunction = param2;
        }
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
    * �o�X�̎����\��\��
    */
    function dispBusTimetable(from, to, param1, param2) {
        type = "bus";
        var buffer = '';
        buffer += '<div id="' + baseId + ':sectionTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':sectionTimetable').innerHTML = '<div class="expLoading"><div class="expText">�o�H�擾��...</div></div>';
        document.getElementById(baseId + ':sectionTimetable').style.display = "block";
        var url = apiURL + "v1/json/bus/timetable?key=" + key + "&from=" + encodeURIComponent(from) + "&to=" + encodeURIComponent(to);
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                // ���t�Ȃ�
                callbackFunction = param1;
            } else {
                // �R�[���o�b�N�Ȃ�
                url += "&date=" + param1;
                callbackFunction = undefined;
            }
        } else {
            url += "&date=" + param1;
            callbackFunction = param2;
        }
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
    * �C�H�̎����\��\��
    */
    function dispShipTimetable(railName, direction, param1, param2) {
        type = "ship";
        var buffer = '';
        buffer += '<div id="' + baseId + ':sectionTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':sectionTimetable').innerHTML = '<div class="expLoading"><div class="expText">�o�H�擾��...</div></div>';
        document.getElementById(baseId + ':sectionTimetable').style.display = "block";
        var url = apiURL + "v1/json/ship/timetable?key=" + key + "&railName=" + encodeURIComponent(railName);
        url += "&direction=" + String(direction);
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                // ���t�Ȃ�
                callbackFunction = param1;
            } else {
                // �R�[���o�b�N�Ȃ�
                url += "&date=" + param1;
                callbackFunction = undefined;
            }
        } else {
            url += "&date=" + param1;
            callbackFunction = param2;
        }
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
    * �H���̎����\
    */
    function dispRailTimetable(serializeData, sectionIndex, callback) {
        type = "rail";
        var buffer = '';
        buffer += '<div id="' + baseId + ':sectionTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':sectionTimetable').innerHTML = '<div class="expLoading"><div class="expText">�o�H�擾��...</div></div>';
        document.getElementById(baseId + ':sectionTimetable').style.display = "block";
        var url = apiURL + "v1/json/rail?key=" + key + "&serializeData=" + serializeData;
        url += "&sectionIndex=" + String(sectionIndex);
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
    * �����\�̏o��
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
    * �����\�̕\��
    */
    function outTimeTableObj() {
        var timeTableList = new Array();
        if (typeof timeTable.ResultSet.Line != 'undefined') {
            // �H���̎����\
            if (typeof timeTable.ResultSet.Line.length == 'undefined') {
                // ��ւ���
                timeTableList.push(timeTable.ResultSet.Line);
            } else {
                for (var i = 0; i < timeTable.ResultSet.Line.length; i++) {
                    timeTableList.push(timeTable.ResultSet.Line[i]);
                }
            }
        } else {
            if (typeof timeTable.ResultSet.TimeTable.Line.length == 'undefined') {
                // ��ւ���
                timeTableList.push(timeTable.ResultSet.TimeTable.Line);
            } else {
                for (var i = 0; i < timeTable.ResultSet.TimeTable.Line.length; i++) {
                    timeTableList.push(timeTable.ResultSet.TimeTable.Line[i]);
                }
            }
        }
        // �����\�o��
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiSectionTimeTable expGuiSectionTimeTablePc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiSectionTimeTable expGuiSectionTimeTablePhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiSectionTimeTable expGuiSectionTimeTableTablet">';
        }
        if (typeof timeTable.ResultSet.TimeTable != 'undefined') {
            if (agent == 1) {
                buffer += '<div class="exp_header">';
            } else if (agent == 2 || agent == 3) {
                buffer += '<div class="exp_header exp_clearfix">';
            }
            buffer += '<div class="exp_headerTitle">';
            if (agent == 1) {
                if (type == "plane") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o���n</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">�����n</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                } else if (type == "bus") {
                    buffer += '<div class="exp_name"><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                } else if (type == "ship") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o���n</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">�����n</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                }
            } else if (agent == 2) {
                if (type == "plane") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">��</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                } else if (type == "bus") {
                    buffer += '<div class="exp_name"><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                } else if (type == "ship") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">��</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                }
            } else if (agent == 3) {
                if (type == "plane") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_cursor"></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">��</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                } else if (type == "bus") {
                    buffer += '<div class="exp_name"><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                } else if (type == "ship") {
                    buffer += '<div class="exp_from"><span class="exp_title">�o</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Station.Name + '</span></div>';
                    buffer += '<div class="exp_cursor"></div>';
                    buffer += '<div class="exp_to"><span class="exp_title">��</span><span class="exp_value">' + timeTable.ResultSet.TimeTable.Direction + '</span></div>';
                }
            }
            buffer += '</div>';
            if (agent == 2 || agent == 3) {
                var hour;
                buffer += '<div class="exp_clock">';
                buffer += '<select id="' + baseId + ':clock">';
                for (var i = 0; i < timeTableList.length; i++) {
                    var tmpDepartureTime = convertISOtoTime(timeTableList[i].DepartureState.Datetime.text, timeTableList[i].DepartureState.Datetime.operation).split(':');
                    if (hour != parseInt(tmpDepartureTime[0], 10)) {
                        hour = parseInt(tmpDepartureTime[0], 10);
                        buffer += '<option value="' + hour + '">' + hour + '</option>';
                    }
                }
                buffer += '</select>';
                buffer += '</div>';
            }
            buffer += '</div>';
        }
        // �����\
        var hour;
        var row = 0;
        buffer += '<div class="exp_timeTable">';
        for (var i = 0; i < timeTableList.length; i++) {
            // ���Ԃ��ς��ꍇ�̓w�b�_���o��
            var tmpDepartureTime = convertISOtoTime(timeTableList[i].DepartureState.Datetime.text, timeTableList[i].DepartureState.Datetime.operation).split(':');
            if (hour != parseInt(tmpDepartureTime[0], 10)) {
                hour = parseInt(tmpDepartureTime[0], 10);
                buffer += '<div class="exp_hour">';
                buffer += '<a id="' + baseId + ':timetable:' + String(hour) + '"></a>';
                buffer += '<span class="exp_value">' + String(hour) + '��</span>';
                buffer += '</div>';
                row = 1;
            } else {
                row++;
            }
            buffer += '<div class="exp_line exp_' + (row % 2 == 0 ? "even" : "odd") + '' + (agent == 3 ? " exp_tablet" : "") + '">';
            if (agent == 1 || agent == 3) {
                buffer += outLineTimeTable(timeTableList[i], (i + 1));
            } else if (agent == 2) {
                buffer += outLineTimeTablePhone(timeTableList[i], (i + 1));
            }
            buffer += '</div>';
        }
        buffer += '</div>';
        buffer += '</div>';
        document.getElementById(baseId + ':sectionTimetable').innerHTML = buffer;
        document.getElementById(baseId + ':sectionTimetable').style.display = "block";

        // �C�x���g�̐ݒ�
        for (var i = 0; i < timeTableList.length; i++) {
            addEvent(document.getElementById(baseId + ":table:" + String(i) + ":name"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":table:" + String(i) + ":number"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":table:" + String(i) + ":station"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":table:" + String(i) + ":departure"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":table:" + String(i) + ":arrival"), "click", onEvent);
        }
        // ���Ԃ̃C�x���g
        addEvent(document.getElementById(baseId + ":clock"), "change", onEvent);
    }

    /*
    * ���̂�Z������
    */
    function convertName(stationName) {
        if (stationName.indexOf("�^") == -1) {
            return stationName;
        } else {
            return stationName.substring(0, stationName.lastIndexOf("�^"));
        }
    }

    /*
    * ��Ԃ̃f�[�^���o��
    */
    function outLineTimeTable(lineObject, lineNo) {
        var buffer = '';
        buffer += '<div class="exp_data exp_clearfix">';
        if (type == "plane") {
            buffer += '<div class="exp_icon"><span class="exp_plane"></span></div>';
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineObject.Name.abbreviation + '</a></div>';
        } else if (type == "bus") {
            buffer += '<div class="exp_icon"><span class="exp_bus"></span></div>';
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineObject.Name + '</a></div>';
        } else if (type == "ship") {
            buffer += '<div class="exp_icon"><span class="exp_ship"></span></div>';
        } else if (type == "rail") {
            // ����
            if (lineObject.Type == 'train') {
                buffer += '<div class="exp_icon"><span class="exp_train"></span></div>';
            } else if (lineObject.Type == "plane") {
                buffer += '<div class="exp_icon"><span class="exp_plane"></span></div>';
            } else if (lineObject.Type == "ship") {
                buffer += '<div class="exp_icon"><span class="exp_ship"></span></div>';
            } else if (lineObject.Type == "bus") {
                buffer += '<div class="exp_icon"><span class="exp_bus"></span></div>';
            }
            var lineName = lineObject.Name;
            if (typeof lineObject.Number != 'undefined') {
                if (lineObject.Type == 'train') {
                    lineName += '&nbsp;' + lineObject.Number + '��';
                } else if (lineObject.Type == "plane" || lineObject.Type == "ship") {
                    lineName += '&nbsp;' + lineObject.Number + '��';
                }
            }
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineName + '</a></div>';
        }
        var tmpDepartureTime = convertISOtoTime(lineObject.DepartureState.Datetime.text, lineObject.DepartureState.Datetime.operation).split(':');
        var tmpArrivalTime = convertISOtoTime(lineObject.ArrivalState.Datetime.text, lineObject.ArrivalState.Datetime.operation).split(':');
        if (type == "plane" || type == "ship") {
            if (type == "plane") {
                buffer += '<div class="exp_separator">&nbsp;</div>';
            }
            buffer += '<div class="exp_no"><a id="' + baseId + ':table:' + String(lineNo) + ':number" href="Javascript:void(0);">' + lineObject.Number + '��</a></div>';
        } else if (type == "bus") {
            buffer += '<div class="exp_separator">&nbsp;</div>';
            buffer += '<div class="exp_no"><a id="' + baseId + ':table:' + String(lineNo) + ':station" href="Javascript:void(0);">' + convertName(lineObject.Destination.Station.Name) + '</a></div>';
        }
        buffer += '<div class="exp_time">';
        buffer += '<div class="exp_departure exp_clearfix">';
        buffer += '<span class="exp_caption">�o</span>';
        buffer += '<span class="exp_value">';
        buffer += '<a id="' + baseId + ':table:' + String(lineNo) + ':departure" href="Javascript:void(0);">' + convertISOtoTime(lineObject.DepartureState.Datetime.text) + '</a>';
        buffer += '</span>';
        buffer += '</div>';
        buffer += '<div class="exp_arrival exp_clearfix">';
        buffer += '<span class="exp_caption">��</span>';
        buffer += '<span class="exp_value">';
        buffer += '<a id="' + baseId + ':table:' + String(lineNo) + ':arrival" href="Javascript:void(0);">' + convertISOtoTime(lineObject.ArrivalState.Datetime.text) + '</a>';
        buffer += '</span>';
        buffer += '</div>';
        buffer += '</div>';

        buffer += '<div class="exp_return">&nbsp;</div>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * ��Ԃ̃f�[�^���o��(�X�}�z�p)
    */
    function outLineTimeTablePhone(lineObject, lineNo) {
        var buffer = '';
        buffer += '<div class="exp_data exp_clearfix">';

        buffer += '<div class="exp_time">';
        buffer += '<div class="exp_departure exp_clearfix">';
        buffer += '<span class="exp_caption">�o</span>';
        buffer += '<span class="exp_value">';
        buffer += '<a id="' + baseId + ':table:' + String(lineNo) + ':departure" href="Javascript:void(0);">' + convertISOtoTime(lineObject.DepartureState.Datetime.text) + '</a>';
        buffer += '</span>';
        buffer += '</div>';
        buffer += '<div class="exp_arrival exp_clearfix">';
        buffer += '<span class="exp_caption">��</span>';
        buffer += '<span class="exp_value">';
        buffer += '<a id="' + baseId + ':table:' + String(lineNo) + ':arrival" href="Javascript:void(0);">' + convertISOtoTime(lineObject.ArrivalState.Datetime.text) + '</a>';
        buffer += '</span>';
        buffer += '</div>';
        buffer += '</div>';

        buffer += '<div class="exp_info">';
        if (type == "plane") {
            buffer += '<div class="exp_icon"><span class="exp_plane"></span></div>';
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineObject.Name.abbreviation + '</a></div>';
        } else if (type == "bus") {
            buffer += '<div class="exp_icon"><span class="exp_bus"></span></div>';
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineObject.Name + '</a></div>';
        } else if (type == "ship") {
            buffer += '<div class="exp_icon"><span class="exp_ship"></span></div>';
        } else if (type == "rail") {
            // ����
            if (lineObject.Type == 'train') {
                buffer += '<div class="exp_icon"><span class="exp_train"></span></div>';
            } else if (lineObject.Type == "plane") {
                buffer += '<div class="exp_icon"><span class="exp_plane"></span></div>';
            } else if (lineObject.Type == "ship") {
                buffer += '<div class="exp_icon"><span class="exp_ship"></span></div>';
            } else if (lineObject.Type == "bus") {
                buffer += '<div class="exp_icon"><span class="exp_bus"></span></div>';
            }
            var lineName = lineObject.Name;
            if (typeof lineObject.Number != 'undefined') {
                if (lineObject.Type == 'train') {
                    lineName += '&nbsp;' + lineObject.Number + '��';
                } else if (lineObject.Type == "plane" || lineObject.Type == "ship") {
                    lineName += '&nbsp;' + lineObject.Number + '��';
                }
            }
            buffer += '<div class="exp_name"><a id="' + baseId + ':table:' + String(lineNo) + ':name" href="Javascript:void(0);">' + lineName + '</a></div>';
        }
        var tmpDepartureTime = convertISOtoTime(lineObject.DepartureState.Datetime.text, lineObject.DepartureState.Datetime.operation).split(':');
        var tmpArrivalTime = convertISOtoTime(lineObject.ArrivalState.Datetime.text, lineObject.ArrivalState.Datetime.operation).split(':');
        if (type == "plane" || type == "ship") {
            buffer += '<div class="exp_no"><a id="' + baseId + ':table:' + String(lineNo) + ':number" href="Javascript:void(0);">' + lineObject.Number + '��</a></div>';
        } else if (type == "bus") {
            buffer += '<div class="exp_no"><a id="' + baseId + ':table:' + String(lineNo) + ':station" href="Javascript:void(0);">' + convertName(lineObject.Destination.Station.Name) + '</a></div>';
        }
        buffer += '</div>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "table" && eventIdList.length == 4 && typeof timeTableClickFunction != 'undefined') {
                // �����\���N���b�N
                if (typeof timeTable.ResultSet.Line != 'undefined') {
                    // �T������
                    if (typeof timeTable.ResultSet.Line.length == 'undefined') {
                        timeTableClickFunction(timeTable.ResultSet.Line.code);
                    } else {
                        timeTableClickFunction(timeTable.ResultSet.Line[parseInt(eventIdList[2])].code);
                    }
                } else {
                    if (typeof timeTable.ResultSet.TimeTable.Line.length == 'undefined') {
                        timeTableClickFunction(timeTable.ResultSet.TimeTable.Line.trainID);
                    } else {
                        timeTableClickFunction(timeTable.ResultSet.TimeTable.Line[parseInt(eventIdList[2])].trainID);
                    }
                }
            } else if (eventIdList[1] == "clock" && eventIdList.length == 2) {
                var hour = document.getElementById(baseId + ':clock').options.item(document.getElementById(baseId + ':clock').selectedIndex).value;
                location.href = "#" + baseId + ":timetable:" + String(hour);
            }
        }
    }

    /*
    * line�I�u�W�F�N�g���쐬
    */
    function convertLineObject(lineObject) {
        var tmpLineObject = new Object();
        // �����n
        if (typeof timeTable.ResultSet.TimeTable != 'undefined') {
            if (typeof timeTable.ResultSet.TimeTable.Station != 'undefined') {
                if (typeof timeTable.ResultSet.TimeTable.Station.Name != 'undefined') {
                    tmpLineObject.from = timeTable.ResultSet.TimeTable.Station.Name;
                }
            }
            if (typeof timeTable.ResultSet.TimeTable.Direction != 'undefined') {
                tmpLineObject.to = timeTable.ResultSet.TimeTable.Direction;
            }
        }
        // ����
        if (typeof lineObject.Name != 'undefined') {
            if (typeof lineObject.Name.text != 'undefined') {
                tmpLineObject.name = lineObject.Name.text;
            } else {
                tmpLineObject.name = lineObject.Name;
            }
            // ����
            if (typeof lineObject.Name.abbreviation != 'undefined') {
                tmpLineObject.abbreviation = lineObject.Name.abbreviation;
            }
        }
        // �^�C�v
        if (typeof lineObject.Type != 'undefined') {
            if (typeof lineObject.Type.text != 'undefined') {
                if (typeof lineObject.Type.detail != 'undefined') {
                    tmpLineObject.type = lineObject.Type.text;
                    if (typeof lineObject.Type.detail != 'undefined') {
                        tmpLineObject.type_detail = lineObject.Type.text + "." + lineObject.Type.detail;
                    }
                } else {
                    tmpLineObject.type = lineObject.Type.text;
                }
            } else {
                tmpLineObject.type = lineObject.Type;
            }
        } else {
            if (type == "plane") {
                tmpLineObject.type = "plane";
            } else if (type == "bus") {
                tmpLineObject.type = "bus";
            } else if (type == "ship") {
                tmpLineObject.type = "ship";
            }
        }
        // �ԍ�
        if (typeof lineObject.Number != 'undefined') {
            tmpLineObject.number = Number(lineObject.Number);
        }
        // �F
        if (typeof lineObject.Color != 'undefined') {
            tmpLineObject.color = Number(lineObject.Color);
        }
        // ��������
        tmpLineObject.departureTime = convertISOtoTime(lineObject.DepartureState.Datetime.text, lineObject.DepartureState.Datetime.operation);
        tmpLineObject.arrivalTime = convertISOtoTime(lineObject.ArrivalState.Datetime.text, lineObject.ArrivalState.Datetime.operation);
        // �s����
        if (typeof lineObject.Destination != 'undefined') {
            tmpLineObject.to = lineObject.Destination.Station.Name;
        }
        return tmpLineObject;
    }

    /*
    * �C���f�b�N�X����H���I�u�W�F�N�g���擾
    */
    function getLineObject(code) {
        if (typeof timeTable.ResultSet.Line != 'undefined') {
            // �H���̎����\
            if (typeof timeTable.ResultSet.Line.length == 'undefined') {
                if (timeTable.ResultSet.Line.code == code) {
                    return convertLineObject(timeTable.ResultSet.Line);
                }
            } else {
                for (var i = 0; i < timeTable.ResultSet.Line.length; i++) {
                    if (timeTable.ResultSet.Line[i].code == code) {
                        return convertLineObject(timeTable.ResultSet.Line[i]);
                    }
                }
            }
        } else {
            if (typeof timeTable.ResultSet.TimeTable.Line.length == 'undefined') {
                if (timeTable.ResultSet.Line.trainID == code) {
                    return convertLineObject(timeTable.ResultSet.TimeTable.Line);
                }
            } else {
                for (var i = 0; i < timeTable.ResultSet.TimeTable.Line.length; i++) {
                    if (timeTable.ResultSet.TimeTable.Line[i].trainID == code) {
                        return convertLineObject(timeTable.ResultSet.TimeTable.Line[i]);
                    }
                }
            }
        }
        return;
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
    this.dispPlaneTimetable = dispPlaneTimetable;
    this.dispBusTimetable = dispBusTimetable;
    this.dispShipTimetable = dispShipTimetable;
    this.dispRailTimetable = dispRailTimetable;
    this.getLineObject = getLineObject;
    this.setConfigure = setConfigure;
    this.bind = bind;
    this.unbind = unbind;

    /*
    * ��`
    */
    this.TYPE_TRAIN = "train";
    this.TYPE_PLANE = "plane";
    this.TYPE_SHIP = "ship";
    this.TYPE_BUS = "bus";
    this.TYPE_WALK = "walk";
    this.TYPE_STRANGE = "strange";
    this.TYPE_BUS_LOCAL = "bus.local";
    this.TYPE_BUS_CONNECTION = "bus.connection";
    this.TYPE_BUS_HIGHWAY = "bus.highway";
    this.TYPE_BUS_MIDNIGHT = "bus.midnight";
    this.TYPE_TRAIN_LIMITEDEXPRESS = "train.limitedExpress";
    this.TYPE_TRAIN_SHINKANSEN = "train.shinkansen";
    this.TYPE_TRAIN_SLEEPERTRAIN = "train.sleeperTrain";
    this.TYPE_TRAIN_LINER = "train.liner";

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
