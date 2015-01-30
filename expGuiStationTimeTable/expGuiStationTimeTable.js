/**
 *  �w���ς��� Web �T�[�r�X
 *  �w�����\�p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiStationTimeTable = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiStationTimeTable\.js"));
        if (s.src && s.src.match(/expGuiStationTimeTable\.js(\?.*)?/)) {
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
    var lineList;
    var httpObj;
    var timeTable;

    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    var timeTableClickFunction;

    /*
    * �w�����\�̐ݒu
    */
    function dispStationTimetable(str, code, param1, param2) {
        var buffer = '';
        buffer += '<div id="' + baseId + ':stationTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':stationTimetable').innerHTML = '<div class="expLoading"><div class="expText">�����\�擾��...</div></div>';
        document.getElementById(baseId + ':stationTimetable').style.display = "block";
        var url = apiURL + "v1/json/station/timetable?key=" + key + "&stationName=" + encodeURIComponent(str);
        url += "&code=" + code;
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
    * �o�H�̎����\�̐ݒu
    */
    function dispCourseTimetable(serializeData, sectionIndex, callback) {
        var buffer = '';
        buffer += '<div id="' + baseId + ':stationTimetable" style="display:none;"></div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �����\�擾�J�n
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        //���[�h���̕\��
        document.getElementById(baseId + ':stationTimetable').innerHTML = '<div class="expLoading"><div class="expText">�����\�擾��...</div></div>';
        document.getElementById(baseId + ':stationTimetable').style.display = "block";
        var url = apiURL + "v1/json/course/timetable?key=" + key + "&serializeData=" + serializeData + "&sectionIndex=" + sectionIndex;
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
    * ISO�̓�����Date�I�u�W�F�N�g�ɕϊ�
    */
    function convertISOtoDate(str) {
        var tmp_date;
        if (str.indexOf("T") != -1) {
            // ���Ԃ���
            tmp_date = new Date(parseInt(str.substring(0, 4), 10), parseInt(str.substring(5, 7), 10) - 1, parseInt(str.substring(8, 10), 10), parseInt(str.substring(11, 13), 10), parseInt(str.substring(14, 16), 10), 0);
        } else {
            // ���t�̂�
            tmp_date = new Date(parseInt(str.substring(0, 4), 10), parseInt(str.substring(5, 7), 10) - 1, parseInt(str.substring(8, 10), 10));
        }
        return tmp_date;
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
    * �����\�̏o��
    */
    function outTimeTableObj() {
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiStationTimeTable expGuiStationTimeTablePc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiStationTimeTable expGuiStationTimeTablePhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiStationTimeTable expGuiStationTimeTableTablet">';
        }
        if (agent == 1) {
            buffer += '<div class="exp_header">';
        } else if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_header exp_clearfix">';
        }
        // �w�b�_�̏o��
        if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_clock">';
            buffer += '<select id="' + baseId + ':clock">';
            if (typeof timeTable.ResultSet.TimeTable.HourTable.length == 'undefined') {
                buffer += '<option value="' + timeTable.ResultSet.TimeTable.HourTable.Hour + '">' + timeTable.ResultSet.TimeTable.HourTable.Hour + '</option>';
            } else {
                for (var i = 0; i < timeTable.ResultSet.TimeTable.HourTable.length; i++) {
                    buffer += '<option value="' + timeTable.ResultSet.TimeTable.HourTable[i].Hour + '">' + timeTable.ResultSet.TimeTable.HourTable[i].Hour + '</option>';
                }
            }
            buffer += '</select>';
            buffer += '</div>';
        }
        buffer += '<div class="exp_title">';
        if (typeof timeTable.ResultSet.TimeTable.Datetime != 'undefined') {
            var timetableDate = convertISOtoDate(timeTable.ResultSet.TimeTable.Datetime.text);
            buffer += timetableDate.getFullYear() + '�N' + (timetableDate.getMonth() + 1) + '��' + timetableDate.getDate() + '��&nbsp;&nbsp;' + timeTable.ResultSet.TimeTable.Station.Name + '�����\<br>';
        }
        buffer += timeTable.ResultSet.TimeTable.Line.Name + "�F" + timeTable.ResultSet.TimeTable.Line.Direction + '����';
        buffer += '</div>';
        buffer += '</div>';

        if (agent == 1) {
            // �}�[�N�̃��X�g
            buffer += '<div class="exp_markInfo" id="' + baseId + ':mark:open">';
            // ���
            buffer += '<div class="exp_kind exp_clearfix">';
            if (typeof timeTable.ResultSet.TimeTable.LineKind.length == 'undefined') {
                buffer += getOutMark(timeTable.ResultSet.TimeTable.LineKind);
            } else {
                for (var i = 0; i < timeTable.ResultSet.TimeTable.LineKind.length; i++) {
                    buffer += getOutMark(timeTable.ResultSet.TimeTable.LineKind[i]);
                }
            }
            buffer += '</div>';
            // ����
            buffer += '<div class="exp_destination exp_clearfix">';
            if (typeof timeTable.ResultSet.TimeTable.LineDestination.length == 'undefined') {
                buffer += getOutMark(timeTable.ResultSet.TimeTable.LineDestination);
            } else {
                for (var i = 0; i < timeTable.ResultSet.TimeTable.LineDestination.length; i++) {
                    buffer += getOutMark(timeTable.ResultSet.TimeTable.LineDestination[i]);
                }
            }
            buffer += '</div>';
            buffer += '<div class="exp_closeButton">';
            buffer += '<span class="exp_link"><a id="' + baseId + ':mark:close:button" href="Javascript:void(0);">��</a></span>';
            buffer += '</div>';
            buffer += '</div>';
            // �J���{�^��
            buffer += '<div class="exp_openButton" id="' + baseId + ':mark:close" style="display:none;">';
            buffer += '<span class="exp_link"><a id="' + baseId + ':mark:open:button" href="Javascript:void(0);">��</a></span>';
            buffer += '</div>';
        }

        // �����\�{��
        buffer += '<table class="exp_timeTable">';
        if (agent == 1) {
            buffer += '<tr class="exp_header">';
            buffer += '<th class="exp_hour">��</th>';
            buffer += '<th class="exp_minute">��</th>';
            buffer += '</tr>';
        }
        // �����\�o��
        if (typeof timeTable.ResultSet.TimeTable.HourTable.length == 'undefined') {
            buffer += getHourTable(timeTable.ResultSet.TimeTable.HourTable, 1);
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.HourTable.length; i++) {
                buffer += getHourTable(timeTable.ResultSet.TimeTable.HourTable[i], (i + 1));
            }
        }
        buffer += '</table>';
        buffer += '</div>';
        document.getElementById(baseId + ':stationTimetable').innerHTML = buffer;
        document.getElementById(baseId + ':stationTimetable').style.display = "block";

        // �}�[�N�̃C�x���g
        addEvent(document.getElementById(baseId + ":mark:open"), "click", onEvent);
        addEvent(document.getElementById(baseId + ":mark:close"), "click", onEvent);
        // ���Ԃ̃C�x���g
        addEvent(document.getElementById(baseId + ":clock"), "change", onEvent);

        // �C�x���g�̐ݒ�
        if (typeof timeTable.ResultSet.TimeTable.HourTable.length == 'undefined') {
            // �����
            if (typeof timeTable.ResultSet.TimeTable.HourTable.MinuteTable != 'undefined') {
                if (typeof timeTable.ResultSet.TimeTable.HourTable.MinuteTable.length == 'undefined') {
                    // �C�x���g�ݒ�
                    addTimeTableEvent(timeTable.ResultSet.TimeTable.HourTable.MinuteTable);
                } else {
                    for (var j = 0; j < timeTable.ResultSet.TimeTable.HourTable.MinuteTable.length; j++) {
                        // �C�x���g�ݒ�
                        addTimeTableEvent(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j]);
                    }
                }
            }
        } else {
            // ����
            for (var i = 0; i < timeTable.ResultSet.TimeTable.HourTable.length; i++) {
                if (typeof timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable != 'undefined') {
                    if (typeof timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.length == 'undefined') {
                        // �C�x���g�ݒ�
                        addTimeTableEvent(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable);
                    } else {
                        for (var j = 0; j < timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.length; j++) {
                            // �C�x���g�ݒ�
                            addTimeTableEvent(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j]);
                        }
                    }
                }
            }
        }
    }

    /*
    * �C�x���g��ݒ肷��
    */
    function addTimeTableEvent(minuteTableObject) {
        // �����̃C�x���g
        addEvent(document.getElementById(baseId + ":table:" + String(minuteTableObject.Stop.lineCode)), "click", onEvent);
        // ��ʂ̃C�x���g
        //  addEvent(document.getElementById(baseId+":kind:"+ String(minuteTableObject.Stop.lineCode)) , "click", onEvent);
        // ���ʂ̃C�x���g
        //  addEvent(document.getElementById(baseId+":destination:"+ String(minuteTableObject.Stop.lineCode)) , "click", onEvent);
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "table" && eventIdList.length == 3) {
                // �����\���N���b�N
                if (typeof timeTableClickFunction != 'undefined') {
                    timeTableClickFunction(eventIdList[2]);
                }
            } else if (eventIdList[1] == "kind" && eventIdList.length == 3) {
                //�C�x���g����
            } else if (eventIdList[1] == "destination" && eventIdList.length == 3) {
                //�C�x���g����
            } else if (eventIdList[1] == "mark" && eventIdList.length == 4) {
                //�}�[�N�̃C�x���g
                if (eventIdList[2] == "open") {
                    document.getElementById(baseId + ':mark:open').style.display = "block";
                    document.getElementById(baseId + ':mark:close').style.display = "none";
                } else if (eventIdList[2] == "close") {
                    document.getElementById(baseId + ':mark:open').style.display = "none";
                    document.getElementById(baseId + ':mark:close').style.display = "block";
                }
            } else if (eventIdList[1] == "clock" && eventIdList.length == 2) {
                var hour = document.getElementById(baseId + ':clock').options.item(document.getElementById(baseId + ':clock').selectedIndex).value;
                location.href = "#" + baseId + ":timetable:" + String(hour);
            }
        }
    }

    /*
    * �}�[�N�̎�ʂ��o��
    */
    function getOutMark(mark) {
        var buffer = '';
        buffer += '<div class="exp_data">';
        if (typeof mark.Mark != 'undefined') {
            buffer += '<span class="exp_name">' + mark.Mark + '</span>';
        } else {
            buffer += '<span class="exp_plain">����:</span>';
        }
        buffer += '<span class="exp_value">' + mark.text + '</span>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * ���Ԃ��Ƃ̎����\���o��
    */
    function getHourTable(hourTableObject, lineNo) {
        var buffer = '';
        var hour = (parseInt(hourTableObject.Hour) >= 24) ? (parseInt(hourTableObject.Hour) - 24) : parseInt(hourTableObject.Hour);
        if (agent == 1) {
            buffer += '<tr class="exp_timeTableBody exp_clearfix">';
            buffer += '<th class="exp_hour_' + (lineNo % 2 == 0 ? "even" : "odd") + '">' + String(hour) + '</th>';
        } else if (agent == 2) {
            buffer += '<tr class="exp_timeTable exp_clearfix">';
            buffer += '<th class="exp_hour exp_clearfix">';
            buffer += '<a id="' + baseId + ':timetable:' + String(hour) + '">' + String(hour) + '��</a></th>';
            buffer += '</tr>';
            buffer += '<tr class="exp_timeTable exp_clearfix">';
        } else if (agent == 3) {
            buffer += '<tr class="exp_timeTable">';
            buffer += '<th class="exp_hour">';
            buffer += '<a id="' + baseId + ':timetable:' + String(hour) + '">' + String(hour) + '��</a></th>';
            buffer += '</tr>';
            buffer += '<tr class="exp_timeTable exp_clearfix">';
        }

        if (typeof hourTableObject.MinuteTable == 'undefined') {
            // �g����
            buffer += '<td class="exp_minuteBody exp_minuteTable_' + (lineNo % 2 == 0 ? "even" : "odd") + '">';
            buffer += '</td>';
        } else if (typeof hourTableObject.MinuteTable.length == 'undefined') {
            // �����
            buffer += '<td class="exp_minuteBody exp_minuteTable_' + (lineNo % 2 == 0 ? "even" : "odd") + '">';
            if (agent == 1) {
                buffer += outMinute(1, getMinuteTable(hourTableObject.MinuteTable), getLineKindMark(hourTableObject.MinuteTable), getLineDestinationMark(hourTableObject.MinuteTable));
            } else if (agent == 2 || agent == 3) {
                buffer += outMinute(1, getMinuteTable(hourTableObject.MinuteTable, hour), getLineDestination(hourTableObject.MinuteTable.Stop.destinationCode), getLineKind(hourTableObject.MinuteTable.Stop.kindCode));
            }
            buffer += '</td>';
        } else {
            buffer += '<td class="exp_minuteBody exp_minuteTable_' + (lineNo % 2 == 0 ? "even" : "odd") + '">';
            for (var i = 0; i < hourTableObject.MinuteTable.length; i++) {
                if (agent == 1) {
                    buffer += outMinute(i + 1, getMinuteTable(hourTableObject.MinuteTable[i]), getLineKindMark(hourTableObject.MinuteTable[i]), getLineDestinationMark(hourTableObject.MinuteTable[i]));
                } else if (agent == 2 || agent == 3) {
                    buffer += outMinute(i + 1, getMinuteTable(hourTableObject.MinuteTable[i], hour), getLineDestination(hourTableObject.MinuteTable[i].Stop.destinationCode), getLineKind(hourTableObject.MinuteTable[i].Stop.kindCode));
                }
            }
            buffer += '</td>';
        }
        buffer += '</tr>';
        return buffer;
    }

    function outMinute(index, minute, direction, kind) {
        var buffer = '';
        buffer += '<div class="exp_minute exp_' + (index % 2 == 0 ? "even" : "odd") + '">';
        if (agent == 1) {
            buffer += '<div class="exp_mark exp_clearfix">';
            if (direction != "") {
                buffer += '<span class="exp_direction">' + direction + '</span>';
            }
            if (kind != "") {
                buffer += '<span class="exp_kind">' + kind + '</span>';
            }
            buffer += '</div>';
            buffer += '<span class="exp_value">' + String(minute) + '</span>';
        } else {
            buffer += '<span class="exp_value">' + String(minute) + '</span>';
            buffer += '<div class="exp_mark">';
            if (direction != "") {
                buffer += '<span class="exp_direction">' + direction + '�s' + '</span>';
            }
            if (kind != "") {
                buffer += '<span class="exp_kind">' + kind + '</span>';
            }
            buffer += '</div>';
        }
        buffer += '</div>';
        return buffer;
    }


    /*
    * ���Ԃ̏o��
    */
    function getMinuteTable(minuteObject, hour) {
        if (typeof hour != 'undefined') {
            return '<span class="exp_link"><a id="' + baseId + ':table:' + String(minuteObject.Stop.lineCode) + '" href="Javascript:void(0);">' + String(hour) + ":" + (parseInt(minuteObject.Minute, 10) < 10 ? "0" : "") + String(minuteObject.Minute) + '</a></span>';
        } else {
            return '<span class="exp_link"><a id="' + baseId + ':table:' + String(minuteObject.Stop.lineCode) + '" href="Javascript:void(0);">' + String(minuteObject.Minute) + '</a></span>';
        }
    }

    /*
    * �H���̎�ʃ}�[�N���擾
    */
    function getLineKindMark(minuteObject) {
        if (typeof timeTable.ResultSet.TimeTable.LineKind.length == 'undefined') {
            if (timeTable.ResultSet.TimeTable.LineKind.code == minuteObject.Stop.kindCode) {
                if (typeof timeTable.ResultSet.TimeTable.LineKind.Mark != 'undefined') {
                    //          var mark = timeTable.ResultSet.TimeTable.LineKind.Mark +"<span style='display:block;border:solid 2px #999;background-color:#eee;color:#000;text-decoration:none;position:absolute;padding:5px;visibility:hidden;'>"+ timeTable.ResultSet.TimeTable.LineKind.text +"</span>";
                    //          return '<a id="'+ baseId +':kind:'+ String(minuteObject.Stop.lineCode) +"\" href=\"Javascript:void(0);\" style=\"text-decoration:none;color:Red;font-size:small;position:relative;\" onmouseover=\"this.childNodes[1].style.visibility='visible';this.childNodes[1].style.top='-30px';\" onmouseout=\"this.childNodes[1].style.visibility='hidden';\">"+ mark +'</a>';
                    return timeTable.ResultSet.TimeTable.LineKind.Mark;
                }
            }
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.LineKind.length; i++) {
                if (timeTable.ResultSet.TimeTable.LineKind[i].code == minuteObject.Stop.kindCode) {
                    if (typeof timeTable.ResultSet.TimeTable.LineKind[i].Mark != 'undefined') {
                        //          var mark = timeTable.ResultSet.TimeTable.LineKind[i].Mark +"<span style='display:block;border:solid 2px #999;background-color:#eee;color:#000;text-decoration:none;position:absolute;padding:5px;visibility:hidden;'>"+ timeTable.ResultSet.TimeTable.LineKind[i].text +"</span>";
                        //          return '<a id="'+ baseId +':kind:'+ String(minuteObject.Stop.lineCode) +"\" href=\"Javascript:void(0);\" style=\"text-decoration:none;color:Red;font-size:small;position:relative;\" onmouseover=\"this.childNodes[1].style.visibility='visible';this.childNodes[1].style.top='-30px';\" onmouseout=\"this.childNodes[1].style.visibility='hidden';\">"+ mark +'</a>';
                        return timeTable.ResultSet.TimeTable.LineKind[i].Mark;
                    }
                }
            }
        }
        return '';
    }

    /*
    * �H���̕����}�[�N���擾
    */
    function getLineDestinationMark(minuteObject) {
        if (typeof timeTable.ResultSet.TimeTable.LineDestination.length == 'undefined') {
            if (timeTable.ResultSet.TimeTable.LineDestination.code == minuteObject.Stop.destinationCode) {
                if (typeof timeTable.ResultSet.TimeTable.LineDestination.Mark != 'undefined') {
                    //        var mark = timeTable.ResultSet.TimeTable.LineDestination.Mark +"<span style='display:block;border:solid 2px #999;background-color:#eee;color:#000;text-decoration:none;position:absolute;padding:5px;visibility:hidden;'>"+ timeTable.ResultSet.TimeTable.LineDestination.text +"�s��</span>";
                    //        return '<a id="'+ baseId +':destination:'+ String(minuteObject.Stop.lineCode) +"\" href=\"Javascript:void(0);\" style=\"text-decoration:none;color:Red;font-size:small;position:relative;\" onmouseover=\"this.childNodes[1].style.visibility='visible';this.childNodes[1].style.top='-30px';\" onmouseout=\"this.childNodes[1].style.visibility='hidden';\">"+ mark +'</a>';
                    return timeTable.ResultSet.TimeTable.LineDestination.Mark;
                }
            }
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.LineDestination.length; i++) {
                if (timeTable.ResultSet.TimeTable.LineDestination[i].code == minuteObject.Stop.destinationCode) {
                    if (typeof timeTable.ResultSet.TimeTable.LineDestination[i].Mark != 'undefined') {
                        //          var mark = timeTable.ResultSet.TimeTable.LineDestination[i].Mark +"<span style='display:block;border:solid 2px #999;background-color:#eee;color:#000;text-decoration:none;position:absolute;padding:5px;visibility:hidden;'>"+ timeTable.ResultSet.TimeTable.LineDestination[i].text +"�s��</span>";
                        //          return '<a id="'+ baseId +':destination:'+ String(minuteObject.Stop.lineCode) +"\" href=\"Javascript:void(0);\" style=\"text-decoration:none;color:Red;font-size:small;position:relative;\" onmouseover=\"this.childNodes[1].style.visibility='visible';this.childNodes[1].style.top='-30px';\" onmouseout=\"this.childNodes[1].style.visibility='hidden';\">"+ mark +'</a>';
                        return timeTable.ResultSet.TimeTable.LineDestination[i].Mark;
                    }
                }
            }
        }
        return '';
    }

    /*
    * �H���̌���
    */
    function searchLine(str, param1, param2) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/station/timetable?key=" + key + "&stationName=" + encodeURIComponent(str);
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
                splitLine(JSON_object);
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
                    splitLine(JSON_object);
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
    * �H���ꗗ�����Z�b�g����
    */
    function splitLine(lineObject) {
        lineList = lineObject;
        if (typeof callbackFunction == 'function') {
            callbackFunction(true);
        }
    }

    /*
    * �H���I�u�W�F�N�g���X�g���擾
    */
    function getLineObjectList() {
        var lineArray = new Array();
        if (typeof lineList != 'undefined') {
            if (typeof lineList.ResultSet.TimeTable.length == 'undefined') {
                lineArray.push(createLineObject(lineList.ResultSet.TimeTable.code, lineList.ResultSet.TimeTable.Line.Name, lineList.ResultSet.TimeTable.Line.Direction));
            } else {
                for (var i = 0; i < lineList.ResultSet.TimeTable.length; i++) {
                    lineArray.push(createLineObject(lineList.ResultSet.TimeTable[i].code, lineList.ResultSet.TimeTable[i].Line.Name, lineList.ResultSet.TimeTable[i].Line.Direction));
                }
            }
        }
        return lineArray;
    }

    /*
    * �H���I�u�W�F�N�g���쐬
    */
    function createLineObject(code, name, direction) {
        var line = new Object();
        line.code = code;
        line.name = name;
        line.direction = direction;
        return line;
    }

    /*
    * �H���̎�ʂ��擾
    */
    function getLineKind(code) {
        if (typeof timeTable.ResultSet.TimeTable.LineKind.length == 'undefined') {
            if (String(timeTable.ResultSet.TimeTable.LineKind.code) == String(code)) {
                return timeTable.ResultSet.TimeTable.LineKind.text;
            }
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.LineKind.length; i++) {
                if (String(timeTable.ResultSet.TimeTable.LineKind[i].code) == String(code)) {
                    return timeTable.ResultSet.TimeTable.LineKind[i].text;
                }
            }
        }
        return;
    }

    /*
    * �H���̕������擾
    */
    function getLineDestination(code) {
        if (typeof timeTable.ResultSet.TimeTable.LineDestination.length == 'undefined') {
            if (String(timeTable.ResultSet.TimeTable.LineDestination.code) == String(code)) {
                return timeTable.ResultSet.TimeTable.LineDestination.text;
            }
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.LineDestination.length; i++) {
                if (String(timeTable.ResultSet.TimeTable.LineDestination[i].code) == String(code)) {
                    return timeTable.ResultSet.TimeTable.LineDestination[i].text;
                }
            }
        }
        return '';
    }

    /*
    * �H�������擾
    */
    function getLineName(code) {
        if (typeof timeTable.ResultSet.TimeTable.LineName.length == 'undefined') {
            if (String(timeTable.ResultSet.TimeTable.LineName.code) == String(code)) {
                return timeTable.ResultSet.TimeTable.LineName.text;
            }
        } else {
            for (var i = 0; i < timeTable.ResultSet.TimeTable.LineName.length; i++) {
                if (String(timeTable.ResultSet.TimeTable.LineName[i].code) == String(code)) {
                    return timeTable.ResultSet.TimeTable.LineName[i].text;
                }
            }
        }
        return '';
    }

    /*
    * line�I�u�W�F�N�g���擾����
    */
    function getTimeTableObject(lineCode) {
        var tmpLineObject = new Object();
        // �C�x���g�̐ݒ�
        if (typeof timeTable.ResultSet.TimeTable.HourTable.length == 'undefined') {
            // �����
            if (typeof timeTable.ResultSet.TimeTable.HourTable.MinuteTable != 'undefined') {
                if (typeof timeTable.ResultSet.TimeTable.HourTable.MinuteTable.length == 'undefined') {
                    // �����
                    if (String(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Stop.lineCode) == String(lineCode)) {
                        tmpLineObject.hour = Number(timeTable.ResultSet.TimeTable.HourTable.Hour);
                        tmpLineObject.minute = Number(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Minute);
                        tmpLineObject.lineCode = Number(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Stop.lineCode);
                        tmpLineObject.lineKind = getLineKind(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Stop.kindCode);
                        tmpLineObject.lineName = getLineName(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Stop.nameCode);
                        tmpLineObject.lineDestination = getLineDestination(timeTable.ResultSet.TimeTable.HourTable.MinuteTable.Stop.destinationCode);
                        return tmpLineObject;
                    }
                } else {
                    for (var j = 0; j < timeTable.ResultSet.TimeTable.HourTable.MinuteTable.length; j++) {
                        // ����
                        if (String(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Stop.lineCode) == String(lineCode)) {
                            tmpLineObject.hour = Number(timeTable.ResultSet.TimeTable.HourTable.Hour);
                            tmpLineObject.minute = Number(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Minute);
                            tmpLineObject.lineCode = Number(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Stop.lineCode);
                            tmpLineObject.lineKind = getLineKind(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Stop.kindCode);
                            tmpLineObject.lineName = getLineName(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Stop.nameCode);
                            tmpLineObject.lineDestination = getLineDestination(timeTable.ResultSet.TimeTable.HourTable.MinuteTable[j].Stop.destinationCode);
                            return tmpLineObject;
                        }
                    }
                }
            }
        } else {
            // ����
            for (var i = 0; i < timeTable.ResultSet.TimeTable.HourTable.length; i++) {
                if (typeof timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable != 'undefined') {
                    if (typeof timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.length == 'undefined') {
                        // �����
                        if (String(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Stop.lineCode) == String(lineCode)) {
                            tmpLineObject.hour = Number(timeTable.ResultSet.TimeTable.HourTable[i].Hour);
                            tmpLineObject.minute = Number(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Minute);
                            tmpLineObject.lineCode = Number(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Stop.lineCode);
                            tmpLineObject.lineKind = getLineKind(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Stop.kindCode);
                            tmpLineObject.lineName = getLineName(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Stop.nameCode);
                            tmpLineObject.lineDestination = getLineDestination(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.Stop.destinationCode);
                            return tmpLineObject;
                        }
                    } else {
                        for (var j = 0; j < timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable.length; j++) {
                            // ����
                            if (String(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Stop.lineCode) == String(lineCode)) {
                                tmpLineObject.hour = Number(timeTable.ResultSet.TimeTable.HourTable[i].Hour);
                                tmpLineObject.minute = Number(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Minute);
                                tmpLineObject.lineCode = Number(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Stop.lineCode);
                                tmpLineObject.lineKind = getLineKind(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Stop.kindCode);
                                tmpLineObject.lineName = getLineName(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Stop.nameCode);
                                tmpLineObject.lineDestination = getLineDestination(timeTable.ResultSet.TimeTable.HourTable[i].MinuteTable[j].Stop.destinationCode);
                                return tmpLineObject;
                            }
                        }
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
    this.dispStationTimetable = dispStationTimetable;
    this.dispCourseTimetable = dispCourseTimetable;
    this.searchLine = searchLine;
    this.getLineObjectList = getLineObjectList;
    this.getTimeTableObject = getTimeTableObject;
    this.setConfigure = setConfigure;
    this.bind = bind;
    this.unbind = unbind;

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
