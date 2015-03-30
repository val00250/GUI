/**
 *  �w���ς��� Web �T�[�r�X
 *  �w�����̓p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2015-03-30
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiStation = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiStation\.js"));
        if (s.src && s.src.match(/expGuiStation\.js(\?.*)?/)) {
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

    //�Â��[�������̃t���O
    if (/Android\s2\.[0|1|2|3]/.test(navigator.userAgent)) {
        agent = 3;
    }

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
    var stationList = new Array(); // �C���N�������^���T�[�`����

    var httpObj; // �C���N�������^���T�[�`�̃��N�G�X�g�I�u�W�F�N�g
    var oldvalue = ""; // �L�[�Ď��p�̕�����

    var stationType;
    var stationPrefectureCode;

    var callBackFunction = new Object();

    var maxStation = 30; //�ő�w��

    var selectStation = 0;

    var stationSort = new Array(createSortObject("�w", "train"), createSortObject("��`", "plane"), createSortObject("�D", "ship"), createSortObject("�o�X", "bus"));
    function createSortObject(name, type, sList) {
        var tmpObj = new Object();
        tmpObj.name = name;
        tmpObj.type = type;
        tmpObj.visible = true;
        tmpObj.stationList = new Array();
        return tmpObj;
    }

    /*
    * �w�����͂̐ݒu
    */
    function dispStation() {
        // �w������
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiStation expGuiStationPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiStation expGuiStationPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiStation expGuiStationTablet">';
        }
        if (agent == 1 || agent == 3) {
            buffer += '<div><input class="exp_station" type="text" id="' + baseId + ':stationInput" autocomplete="off"></div>';
            buffer += '<div class="exp_stationList" id="' + baseId + ':stationList" style="display:none;">';
            if (agent == 3) {
                buffer += '<div class="exp_stationTabList exp_clearfix">';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(1) + '" value="1"><label class="exp_stationTabTextLeft" for="' + baseId + ':stationView:' + String(1) + '">�w</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(2) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(2) + '">��`</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(3) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(3) + '">�D</label></span>';
                buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(4) + '" value="1"><label class="exp_stationTabTextRight" for="' + baseId + ':stationView:' + String(4) + '">�o�X</label></span>';
                buffer += '</div>';
            }
            buffer += '<div class="exp_stationSelect" id="' + baseId + ':stationSelect"></div>';
            buffer += '</div>';
        } else if (agent == 2) {
            buffer += '<input class="exp_station" type="text" id="' + baseId + ':stationOutput">';
            buffer += '<div class="exp_stationPopupBack" id="' + baseId + ':stationPopupBack"style="display:none;">';
            buffer += '<div class="exp_stationPopup" id="' + baseId + ':stationPopup" style="display:none;">';
            buffer += '<div class="exp_stationInputHeader exp_clearfix">';
            buffer += '<div class="exp_stationInputBack"><a id="' + baseId + ':stationBack" href="Javascript:void(0);"></a></div>';
            buffer += '<div class="exp_stationInputText"><input type="text" id="' + baseId + ':stationInput" autocomplete="off"></div>';
            buffer += '</div>';
            buffer += '<div class="exp_stationTabList exp_clearfix">';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(1) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(1) + '">�w</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(2) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(2) + '">��`</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(3) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(3) + '">�D</label></span>';
            buffer += '<span class="exp_stationTab"><input type="checkbox" class="exp_stationTabCheck" id="' + baseId + ':stationView:' + String(4) + '" value="1"><label class="exp_stationTabText" for="' + baseId + ':stationView:' + String(4) + '">�o�X</label></span>';
            buffer += '</div>';
            buffer += '<div class="exp_stationSPListBase" id="' + baseId + ':stationList" style="display:none;">';
            buffer += '<div class="exp_stationSPList exp_clearfix" id="' + baseId + ':stationSelect"></div>';
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        }
        buffer += '</div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        // �C�x���g�̐ݒ�
        addEvent(document.getElementById(baseId + ":stationInput"), "keyup", inputStation);
        addEvent(document.getElementById(baseId + ":stationInput"), "keydown", selectStationChange);
        if (agent == 1 || agent == 3) {
            addEvent(document.getElementById(baseId + ":stationInput"), "blur", onblurEvent);
            addEvent(document.getElementById(baseId + ":stationInput"), "focus", onFocusEvent);
        } else if (agent == 2) {
            addEvent(document.getElementById(baseId + ":stationOutput"), "keyup", openStationInput);
            addEvent(document.getElementById(baseId + ":stationOutput"), "click", openStationInput);
            addEvent(document.getElementById(baseId + ":stationBack"), "click", closeStationInput);
        }
        // ��ʂ̃`�F�b�N�^�u
        if (agent == 2 || agent == 3) {
            document.getElementById(baseId + ':stationView:1').checked = true;
            document.getElementById(baseId + ':stationView:2').checked = true;
            document.getElementById(baseId + ':stationView:3').checked = true;
            document.getElementById(baseId + ':stationView:4').checked = true;
        }

        // �L�[�̊Ď�
        if (agent == 1 || agent == 3) {
            inputCheck();
        }
    }

    /*
    * �X�}�[�g�t�H���p���͉�ʂ��J��
    */
    function openStationInput() {
        document.getElementById(baseId + ':stationPopupBack').style.display = "block";
        document.getElementById(baseId + ':stationPopup').style.display = "block";
        document.getElementById(baseId + ':stationInput').value = document.getElementById(baseId + ':stationOutput').value;
        document.getElementById(baseId + ':stationInput').focus();
        document.getElementById(baseId + ':stationPopup').style.top = 0;
        document.getElementById(baseId + ':stationPopup').style.left = 0;
        //�L�[�Ď�
        inputCheck();
    }

    /*
    * �X�}�[�g�t�H���p���͉�ʂ����
    */
    function closeStationInput() {
        if (document.getElementById(baseId + ':stationOutput').value != "" && document.getElementById(baseId + ':stationInput').value == "") {
            // ��ɂ���
            document.getElementById(baseId + ':stationOutput').value = "";
            if (typeof callBackFunction['change'] == 'function') {
                callBackFunction['change']();
            }
        } else {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == document.getElementById(baseId + ':stationInput').value) {
                    if (document.getElementById(baseId + ':stationOutput').value != stationList[i].name) {
                        // �ς���Ă�����ύX
                        document.getElementById(baseId + ':stationOutput').value = stationList[i].name;
                        if (typeof callBackFunction['change'] == 'function') {
                            callBackFunction['change']();
                        }
                    }
                }
            }
        }
        document.getElementById(baseId + ':stationPopupBack').style.display = "none";
        document.getElementById(baseId + ':stationPopup').style.display = "none";
        document.getElementById(baseId + ':stationOutput').focus();
    }

    /*
    * �t�H�[�J�X���O�ꂽ���ɃC�x���g
    */
    function onblurEvent() {
        setTimeout(onblurEventCallBack, 100);
    }
    function onblurEventCallBack() {
        if (typeof callBackFunction['blur'] == 'function') {
            callBackFunction['blur']();
        }
    }

    /*
    * �t�H�[�J�X�����������ɃC�x���g
    */
    function onFocusEvent() {
        if (typeof callBackFunction['focus'] == 'function') {
            callBackFunction['focus']();
        }
        if (agent == 1 || agent == 3) {
            if (document.getElementById(baseId + ':stationInput').value != "") {
                if (document.getElementById(baseId + ':stationList').style.display == "none") {
                    document.getElementById(baseId + ':stationList').style.display = "block";
                    // �R�[���o�b�N
                    if (typeof callBackFunction['open'] == 'function') {
                        callBackFunction['open']();
                    }
                }
            }
        }
    }

    /*
    * �����̓��͒��ł��`�F�b�N����
    */
    var inputCheck = function () {
        if (document.getElementById(baseId + ':stationInput')) {
            if (oldvalue != document.getElementById(baseId + ':stationInput').value) {
                oldvalue = document.getElementById(baseId + ':stationInput').value;
                searchStation(true, oldvalue);
            };
            setTimeout(inputCheck, 100);
        }
    };

    /*
    * �t�H�[���̃C�x���g����
    */
    function inputStation(event) {
        var iStation = document.getElementById(baseId + ':stationInput').value;
        if (iStation == "") {
            document.getElementById(baseId + ':stationList').style.display = "none";
        }
        if (event.keyCode == 13) {
            // �G���^�[�L�[
            if (selectStation > 0) {
                // �J�[�\���ňړ��ς�
                setStationNo(selectStation);
            } else {
                // �G���^�[�L�[�̂�
                var tmp_stationList = new Array();
                for (var n = 0; n < stationSort.length; n++) {
                    if (stationSort[n].visible) {
                        for (var i = 0; i < stationSort[n].stationList.length; i++) {
                            tmp_stationList.push(stationSort[n].stationList[i] + 1);
                        }
                    }
                }
                setStationNo(tmp_stationList[0]);
            }
            // �G���^�[�L�[
            if (typeof callBackFunction['enter'] == 'function') {
                callBackFunction['enter']();
            }
        }
    }

    /*
    * �J�[�\���ɂ��w�w��
    */
    function selectStationChange(event) {
        if (event.keyCode == 38 || event.keyCode == 40) {
            var tmp_stationList = new Array();
            for (var n = 0; n < stationSort.length; n++) {
                if (stationSort[n].visible) {
                    for (var i = 0; i < stationSort[n].stationList.length; i++) {
                        tmp_stationList.push(stationSort[n].stationList[i] + 1);
                    }
                }
            }
            //�}�[�N������
            if (document.getElementById(baseId + ":stationRow:" + String(selectStation))) {
                document.getElementById(baseId + ":stationRow:" + String(selectStation)).className = "exp_stationName";
            }
            if (tmp_stationList.length == 0) {
                selectStation = 0;
            } else {
                var pos = checkArray(tmp_stationList, selectStation);
                if (pos == -1) {
                    selectStation = tmp_stationList[0];
                } else if (event.keyCode == 38) {
                    if (pos > 0) {
                        selectStation = tmp_stationList[pos - 1];
                    }
                } else if (event.keyCode == 40) {
                    if (pos < tmp_stationList.length - 1) {
                        selectStation = tmp_stationList[pos + 1];
                    }
                }
            }
            if (selectStation > 0) {
                if (document.getElementById(baseId + ":stationRow:" + String(selectStation))) {
                    document.getElementById(baseId + ":stationRow:" + String(selectStation)).className = "exp_stationName exp_stationNameCursor";
                }
                if (document.getElementById(baseId + ':stationList').style.display == "none") {
                    document.getElementById(baseId + ':stationList').style.display = "block";
                    // �R�[���o�b�N
                    if (typeof callBackFunction['open'] == 'function') {
                        callBackFunction['open']();
                    }
                }
            }
        }
    }

    /*
    * �w���̌���
    */
    function searchStation(openFlag, str) {
        resetCursor();
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        if (str.length == "") {
            closeStationList();
            return;
        }
        var url = apiURL + "v1/json/station/light?key=" + key + "&name=" + encodeURIComponent(str);
        if (typeof stationType != 'undefined') {
            url += "&type=" + stationType;
        } else {
            var tmp_type = new Array();
            for (var n = 0; n < stationSort.length; n++) {
                if (stationSort[n].visible) {
                    tmp_type.push(stationSort[n].type);
                }
            }
            // ���ׂăI�t�̏ꍇ�͖₢���킹�Ȃ�
            if (tmp_type.length == 0) {
                return;
            }
            url += "&type=" + tmp_type.join(":");
        }
        if (typeof stationPrefectureCode != 'undefined') {
            url += "&prefectureCode=" + stationPrefectureCode;
        }

        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                outStationList(openFlag, JSON_object);
            };
        } else {
            httpObj = new XMLHttpRequest();
            httpObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (httpObj.readyState == done && httpObj.status == ok) {
                    JSON_object = JSON.parse(httpObj.responseText);
                    outStationList(openFlag, JSON_object);
                }
            };
        }
        httpObj.open("GET", url, true);
        httpObj.send(null);
    }

    /*
    * �w�����Z�b�g����
    */
    function setStationNo(n) {
        resetCursor();
        if (typeof stationList[n - 1] != 'undefined') {
            if (agent == 1 || agent == 3) {
                if (stationList[(n - 1)].name != document.getElementById(baseId + ':stationInput').value) {
                    setStation(stationList[(n - 1)].name);
                    if (typeof callBackFunction['change'] == 'function') {
                        callBackFunction['change']();
                    }
                } else {
                    setStation(stationList[(n - 1)].name);
                }
            } else if (agent == 2) {
                if (stationList[(n - 1)].name != document.getElementById(baseId + ':stationOutput').value) {
                    setStation(stationList[(n - 1)].name);
                    if (typeof callBackFunction['change'] == 'function') {
                        callBackFunction['change']();
                    }
                } else {
                    setStation(stationList[(n - 1)].name);
                }
            }
        }
    }

    /*
    * �w�̃A�C�R����ݒ�
    */
    function getStationIconType(type) {
        if (typeof type != 'object') {
            // �P��̏ꍇ
            return '<span class="exp_' + type + '"></span>';
        } else if (typeof type.text != 'undefined') {
            return '<span class="exp_' + type.text + '"></span>';
        } else if (type.length > 0) {
            // �����̏ꍇ
            var buffer = "";
            for (var i = 0; i < type.length; i++) {
                if (typeof type[i].text != 'undefined') {
                    buffer += '<span class="exp_' + type[i].text + '"></span>';
                } else {
                    buffer += '<span class="exp_' + type[i] + '"></span>';
                }
            }
            return buffer;
        }
        return '';
    }

    /*
    * ���������w���X�g�̏o��
    */
    function outStationList(openFlag, tmp_stationList) {
        if (typeof tmp_stationList != 'undefined') {
            if (typeof tmp_stationList.ResultSet.Point != 'undefined') {
                stationList = new Array();
                if (typeof tmp_stationList.ResultSet.Point.length != 'undefined') {
                    // ����
                    for (var i = 0; i < tmp_stationList.ResultSet.Point.length; i++) {
                        stationList.push(setStationObject(tmp_stationList.ResultSet.Point[i]));
                    }
                } else {
                    // �����
                    stationList.push(setStationObject(tmp_stationList.ResultSet.Point));
                }
            }
        }
        // �w�����o��
        if (stationList.length > 0) {
            // ���X�g���o��
            var buffer = "";
            buffer += '<ul class="exp_stationTable">';
            for (var n = 0; n < stationSort.length; n++) {
                stationSort[n].stationList = new Array();
                for (var i = 0; i < stationList.length; i++) {
                    if (stationList[i].type.split(":")[0] == stationSort[n].type) {
                        stationSort[n].stationList.push(i);
                    }
                }
                if (agent == 1) {
                    buffer += '<li>';
                    if (stationSort[n].visible) {
                        buffer += '<a class="exp_stationTitle" id="' + baseId + ':stationView:' + String(n + 1) + '" href="Javascript:void(0);">';
                    } else {
                        buffer += '<a class="exp_stationTitleClose" id="' + baseId + ':stationView:' + String(n + 1) + '" href="Javascript:void(0);">';
                    }
                    buffer += '<div class="exp_stationCount">' + stationSort[n].stationList.length + '��</div>';
                    buffer += '<div class="exp_stationIcon">';
                    buffer += '<span class="exp_' + stationSort[n].type + '" id="' + baseId + ':stationView:' + String(n + 1) + ':icon"></span>';
                    buffer += '</div>';
                    buffer += '<div class="exp_stationType" id="' + baseId + ':stationView:' + String(n + 1) + ':type">';
                    buffer += stationSort[n].name;
                    buffer += '</div>';
                    buffer += '</a>';
                    buffer += '</li>';
                }
                if (stationSort[n].visible) {
                    // ���X�g�̏o��
                    for (var i = 0; i < stationList.length; i++) {
                        if (stationList[i].type.split(":")[0] == stationSort[n].type) {
                            buffer += getStationListItem(i + 1, stationList[i]);
                        }
                    }
                }
            }
            buffer += '</ul>';
            document.getElementById(baseId + ':stationSelect').innerHTML = buffer;
            // �C�x���g��ݒ�
            for (var i = 0; i < stationList.length; i++) {
                addEvent(document.getElementById(baseId + ":stationRow:" + String(i + 1)), "click", onEvent);
            }
            for (var i = 0; i < stationSort.length; i++) {
                addEvent(document.getElementById(baseId + ":stationView:" + String(i + 1)), "click", onEvent);
            }
            if (document.getElementById(baseId + ':stationList').style.display == "none" && openFlag) {
                document.getElementById(baseId + ':stationList').style.display = "block";
                // �R�[���o�b�N
                if (typeof callBackFunction['open'] == 'function') {
                    callBackFunction['open']();
                }
            }
        }
    }

    /*
    * �\���ؑ�
    */
    function stationView(n) {
        stationSort[n].visible = !stationSort[n].visible;
        outStationList(true);
    }

    /*
    * �n�_�I�u�W�F�N�g�̍쐬
    */
    function setStationObject(stationObj) {
        var tmp_station = new Object();
        tmp_station.name = stationObj.Station.Name;
        tmp_station.code = stationObj.Station.code;
        tmp_station.yomi = stationObj.Station.Yomi;

        if (typeof stationObj.Station.Type == 'string') {
            // 1�̃^�C�v��������
            tmp_station.type = stationObj.Station.Type;
        } else {
            if (typeof stationObj.Station.Type.length == 'undefined') {
                // �P��̃^�C�v
                if (typeof stationObj.Station.Type.text != 'undefined') {
                    tmp_station.type = stationObj.Station.Type.text;
                    if (typeof stationObj.Station.Type.detail != 'undefined') {
                        tmp_station.type_detail = stationObj.Station.Type.text + "." + stationObj.Station.Type.detail;
                    }
                } else {
                    tmp_station.type = stationObj.Station.Type;
                }
            } else {
                // �w�̃^�C�v������
                var temp_type = "";
                var temp_type_detail = "";
                for (var i = 0; i < stationObj.Station.Type.length; i++) {
                    if (typeof stationObj.Station.Type[i].text != 'undefined') {
                        if (temp_type != "") { temp_type += ":"; }
                        temp_type += stationObj.Station.Type[i].text;
                        if (typeof stationObj.Station.Type[i].detail != 'undefined') {
                            if (temp_type_detail != "") { temp_type_detail += ":"; }
                            temp_type_detail += stationObj.Station.Type[i].text + "." + stationObj.Station.Type[i].detail;
                        }
                    } else {
                        if (temp_type != "") { temp_type += ":"; }
                        temp_type += stationObj.Station.Type[i];
                    }
                    tmp_station.type = temp_type;
                    tmp_station.type_detail = temp_type_detail;
                }
            }
        }
        //���R�[�h
        if (typeof stationObj.Prefecture != 'undefined') {
            tmp_station.kenCode = parseInt(stationObj.Prefecture.code);
        }
        return tmp_station;
    }

    /*
    * �w�̃��X�g���o��
    */
    function getStationListItem(n, stationItem) {
        var buffer = "";
        buffer += '<li>';
        if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_stationIcon">';
            buffer += getStationIconType(stationItem.type);
            buffer += '</div>';
        }
        buffer += '<div>';
        buffer += '<a class="exp_stationName" id="' + baseId + ':stationRow:' + String(n) + '" href="Javascript:void(0);" title="' + stationItem.yomi + '">' + stationItem.name + '</a>';
        buffer += '</div>';
        buffer += '</li>';
        return buffer;
    }

    /*
    * IE�p�ɔz��̌����@�\������
    */
    function checkArray(arr, target) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === target) { return i; }
        }
        return -1;
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "stationRow" && eventIdList.length == 3) {
                // �w�̑I��
                setStationNo(parseInt(eventIdList[2]));
            } else if (eventIdList[1] == "stationView" && eventIdList.length >= 3) {
                // �\���ؑ�
                stationView(parseInt(eventIdList[2]) - 1);
                // �w��������
                searchStation(true, oldvalue);
            }
        }
    }

    /*
    * �t�H�[���̉w����Ԃ�
    */
    function getStation() {
        if (agent == 1 || agent == 3) {
            return document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            return document.getElementById(baseId + ':stationOutput').value;
        }
    }

    /*
    * ���������w�����X�g��Ԃ�
    */
    function getStationList() {
        var stationArray = new Array();
        for (var i = 0; i < stationList.length; i++) {
            stationArray.push(stationList[i].name);
        }
        return stationArray.join(",");
    }

    /*
    * �I�𒆂̉w����Ԃ�
    */
    function getStationName() {
        var tmp_station;
        if (agent == 1 || agent == 3) {
            tmp_station = document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            tmp_station = document.getElementById(baseId + ':stationOutput').value;
        }
        if (stationList.length > 0) {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == tmp_station) {
                    return stationList[i].name;
                }
            }
        }
        return "";
    }

    /*
    * �I�𒆂̉w�R�[�h��Ԃ�
    */
    function getStationCode() {
        var tmp_station;
        if (agent == 1 || agent == 3) {
            tmp_station = document.getElementById(baseId + ':stationInput').value;
        } else if (agent == 2) {
            tmp_station = document.getElementById(baseId + ':stationOutput').value;
        }
        if (stationList.length > 0) {
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].name == tmp_station) {
                    return stationList[i].code;
                }
            }
        }
        return "";
    }


    /*
    * �w���̎擾
    */
    function getPointObject(station) {
        // �I�u�W�F�N�g�R�s�[�p�C�����C���֐�
        function clone(obj) {
            var f = function () { };
            f.prototype = obj;
            return new f;
        }
        for (var i = 0; i < stationList.length; i++) {
            if (isNaN(station)) {
                if (stationList[i].name == station) {
                    return clone(stationList[i]);
                }
            } else if (stationList[i].code == station) {
                return clone(stationList[i]);
            }
        }
    }

    /*
    * ���������w�����X�g�����
    */
    function closeStationList() {
        resetCursor();
        if (agent == 1 || agent == 3) {
            document.getElementById(baseId + ':stationList').style.display = "none";
            // �R�[���o�b�N
            if (typeof callBackFunction['close'] == 'function') {
                callBackFunction['close']();
            }
        }
    }

    /*
    * �w���X�g���J���Ă��邩�ǂ����̃`�F�b�N
    */
    function checkStationList() {
        if (document.getElementById(baseId + ':stationList').style.display == "block") {
            return true;
        } else {
            return false;
        }
    }

    function resetCursor() {
        if (document.getElementById(baseId + ":stationRow:" + String(selectStation))) {
            document.getElementById(baseId + ":stationRow:" + String(selectStation)).className = "exp_stationName";
        }
        selectStation = 0;
    }

    /*
    * �t�H�[���ɉw�����Z�b�g���ă��X�g�����
    */
    function setStation(str) {
        if (agent == 1 || agent == 3) {
            document.getElementById(baseId + ':stationInput').value = str;
            // �`�F�b�N�͂��Ȃ�
            oldvalue = document.getElementById(baseId + ':stationInput').value;
            closeStationList();
        } else if (agent == 2) {
            document.getElementById(baseId + ':stationOutput').value = str;
            //���X�g�����
            document.getElementById(baseId + ':stationPopup').style.display = "none";
            document.getElementById(baseId + ':stationPopupBack').style.display = "none";
        }
        if (str != "") {
            //�w���X�g�������`�F�b�N���A���������ꍇ�͖₢���킹
            if (stationList.length > 0) {
                for (var i = 0; i < stationList.length; i++) {
                    if (stationList[i].name == str) {
                        return;
                    }
                }
            }
            //��v����w���������߁A�₢���킹
            searchStation(false, str);
        }
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == "type") {
            if (typeof value == "object") {
                stationType = value.join(":");
            } else {
                stationType = value;
            }
        } else if (name.toLowerCase() == String("prefectureCode").toLowerCase()) {
            if (typeof value == "object") {
                stationPrefectureCode = value.join(":");
            } else {
                stationPrefectureCode = value;
            }
        } else if (name.toLowerCase() == String("maxStation").toLowerCase()) {
            maxStation = value;
        } else if (name.toLowerCase() == String("agent").toLowerCase()) {
            agent = value;
        }
    }

    /*
    * �R�[���o�b�N�֐��̒�`
    */
    function bind(type, func) {
        if (type == 'open' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'close' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'change' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'blur' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'enter' && typeof func == 'function') {
            callBackFunction[type] = func;
        } else if (type == 'focus' && typeof func == 'function') {
            callBackFunction[type] = func;
        }
    }

    /*
    * �R�[���o�b�N�֐��̉���
    */
    function unbind(type) {
        if (typeof callBackFunction[type] == 'function') {
            callBackFunction[type] = undefined;
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.dispStation = dispStation;
    this.getStation = getStation;
    this.setStation = setStation;
    this.getStationList = getStationList;
    this.getStationName = getStationName;
    this.getStationCode = getStationCode;
    this.getPointObject = getPointObject;
    this.closeStationList = closeStationList;
    this.checkStationList = checkStationList;
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
    this.TDFK_HOKKAIDO = 1;
    this.TDFK_AOMORI = 2;
    this.TDFK_IWATE = 3;
    this.TDFK_MIYAGI = 4;
    this.TDFK_AKITA = 5;
    this.TDFK_YAMAGATA = 6;
    this.TDFK_FUKUSHIMA = 7;
    this.TDFK_IBARAKI = 8;
    this.TDFK_TOCHIGI = 9;
    this.TDFK_GUNMA = 10;
    this.TDFK_SAITAMA = 11;
    this.TDFK_CHIBA = 12;
    this.TDFK_TOKYO = 13;
    this.TDFK_KANAGAWA = 14;
    this.TDFK_NIIGATA = 15;
    this.TDFK_TOYAMA = 16;
    this.TDFK_ISHIKAWA = 17;
    this.TDFK_FUKUI = 18;
    this.TDFK_YAMANASHI = 19;
    this.TDFK_NAGANO = 20;
    this.TDFK_GIFU = 21;
    this.TDFK_SHIZUOKA = 22;
    this.TDFK_AICHI = 23;
    this.TDFK_MIE = 24;
    this.TDFK_SHIGA = 25;
    this.TDFK_KYOTO = 26;
    this.TDFK_OSAKA = 27;
    this.TDFK_HYOGO = 28;
    this.TDFK_NARA = 29;
    this.TDFK_WAKAYAMA = 30;
    this.TDFK_TOTTORI = 31;
    this.TDFK_SHIMANE = 32;
    this.TDFK_OKAYAMA = 33;
    this.TDFK_HIROSHIMA = 34;
    this.TDFK_YAMAGUCHI = 35;
    this.TDFK_TOKUSHIMA = 36;
    this.TDFK_KAGAWA = 37;
    this.TDFK_EHIME = 38;
    this.TDFK_KOCHI = 39;
    this.TDFK_FUKUOKA = 40;
    this.TDFK_SAGA = 41;
    this.TDFK_NAGASAKI = 42;
    this.TDFK_KUMAMOTO = 43;
    this.TDFK_OITA = 44;
    this.TDFK_MIYAZAKI = 45;
    this.TDFK_KAGOSHIMA = 46;
    this.TDFK_OKINAWA = 47;

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
