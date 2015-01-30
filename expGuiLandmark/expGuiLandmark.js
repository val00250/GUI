/**
 *  �w���ς��� Web �T�[�r�X
 *  �����h�}�[�N�p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiLandmark = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiLandmark\.js"));
        if (s.src && s.src.match(/expGuiLandmark\.js(\?.*)?/)) {
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
    * �ϐ��S
    */
    var httpObj;
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�
    var serializeData;

    /*
    * �n�_�̐���
    */
    function createLandmark(landmarkObject, callBack) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/toolbox/course/point?key=" + key;
        callbackFunction = callBack;
        if (typeof landmarkObject.getParam() != 'undefined') {
            url += "&" + landmarkObject.getParam();
        } else {
            callbackFunction(false);
            return;
        }
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setLandmarkData(JSON_object);
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
                    setLandmarkData(JSON_object);
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
    * �����h�}�[�N����ԋp
    */
    function setLandmarkData(json) {
        var tmp_point = json;
        if (typeof tmp_point.ResultSet.Point == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            serializeData = tmp_point.ResultSet.Point.SerializeData;
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * �n�_�C���^�[�t�F�[�X�̐���
    */
    function createLandmarkInterface(name) {
        return new landmarkInterface(name);
    }

    /*
    * �n�_�C���^�[�t�F�[�X
    */
    function landmarkInterface(tmp_name) {
        // �ϐ����X�g
        var name = tmp_name;
        var stationList = new Array();
        // �֐����X�g
        // name�ݒ�
        function setName(value) { name = value; };
        function getName() { return name; };
        this.setName = setName;
        this.getName = getName;
        // �w�̒ǉ�
        function addStation(obj) {
            if (stationList.length == 5) { return false; }
            var checkStation = "";
            for (var i = 0; i < stationList.length; i++) {
                if (stationList[i].getStation() == obj.getStation()) {
                    // �����w�͎w��ł��Ȃ�
                    return false;
                }
                checkStation += stationList[i].getStation();
            }
            // �ȑO�ǉ������w���R�[�h�ł��邩�ǂ������`�F�b�N
            if (checkStation != "") {
                if (isNaN(checkStation) != isNaN(obj.getStation())) {
                    return false;
                }
            }
            stationList.push(obj);
            return true;
        };
        this.addStation = addStation;
        // �w�̍폜
        function removeStation(obj) {
            for (var i = 0; i < stationList.length; i++) {
                if (typeof obj == 'object') {
                    if (stationList[i].getStation() == obj.getStation()) {
                        stationList.splice(i, 1);
                        return true;
                    }
                } else {
                    if (stationList[i].getStation() == obj) {
                        stationList.splice(i, 1);
                        return true;
                    }
                }
            }
            return false;
        };
        this.removeStation = removeStation;
        // �p�����[�^�쐬
        function getParam() {
            var url = "";
            if (typeof name != 'undefined') {
                url += "name=" + encodeURIComponent(name);
            } else {
                return;
            }
            // �Ŋ��w�̐ݒ�
            if (stationList.length == 0) { return; }
            var tmpStationCode = "";
            var tmpStation = "";
            var tmpTime = "";
            var tmpFare = "";
            var tmpTraffic = "";
            var tmpDistance = "";
            var tmpTeiki1 = "";
            var tmpTeiki3 = "";
            var tmpTeiki6 = "";
            for (var i = 0; i < stationList.length; i++) {
                if (typeof stationList[i] != 'undefined') {
                    if (tmpStation != "") {
                        tmpStation += ":";
                        tmpTime += ":";
                        tmpFare += ":";
                        tmpTraffic += ":";
                        tmpDistance += ":";
                        tmpTeiki1 += ":";
                        tmpTeiki3 += ":";
                        tmpTeiki6 += ":";
                    }
                    if (typeof stationList[i].getStation() != 'undefined') {
                        tmpStation += encodeURIComponent(stationList[i].getStation());
                    }
                    if (typeof stationList[i].getTime() != 'undefined') {
                        tmpTime += stationList[i].getTime();
                    }
                    if (typeof stationList[i].getFare() != 'undefined') {
                        tmpFare += stationList[i].getFare();
                    }
                    if (typeof stationList[i].getTraffic() != 'undefined') {
                        tmpTraffic += encodeURIComponent(stationList[i].getTraffic());
                    }
                    if (typeof stationList[i].getDistance() != 'undefined') {
                        tmpDistance += stationList[i].getDistance();
                    }
                    if (typeof stationList[i].getTeiki1() != 'undefined') {
                        tmpTeiki1 += stationList[i].getTeiki1();
                    }
                    if (typeof stationList[i].getTeiki3() != 'undefined') {
                        tmpTeiki3 += stationList[i].getTeiki3();
                    }
                    if (typeof stationList[i].getTeiki6() != 'undefined') {
                        tmpTeiki6 += stationList[i].getTeiki6();
                    }
                }
            }
            if (tmpStation.replace(/:/g, "") == "") {
                return;
            } else if (isNaN(tmpStation.replace(/:/g, ""))) {
                // �w��
                url += "&station=" + tmpStation;
            } else {
                // �w�R�[�h
                url += "&stationCode=" + tmpStation;
            }
            // �p�����[�^�̐���
            if (tmpTime.replace(/:/g, "") != "") {
                url += "&time=" + tmpTime;
            }
            if (tmpFare.replace(/:/g, "") != "") {
                url += "&fare=" + tmpFare;
            }
            if (tmpTraffic.replace(/:/g, "") != "") {
                url += "&traffic=" + tmpTraffic;
            }
            if (tmpDistance.replace(/:/g, "") != "") {
                url += "&distance=" + tmpDistance;
            }
            if (tmpTeiki1.replace(/:/g, "") != "") {
                url += "&teiki1=" + tmpTeiki1;
            }
            if (tmpTeiki3.replace(/:/g, "") != "") {
                url += "&teiki3=" + tmpTeiki3;
            }
            if (tmpTeiki6.replace(/:/g, "") != "") {
                url += "&teiki6=" + tmpTeiki6;
            }
            return url;
        }
        this.getParam = getParam;
    }

    /*
    * �w�C���^�[�t�F�[�X�̐���
    */
    function createLandmarkStationInterface(station) {
        return new landmarkStationInterface(station);
    }

    /*
    * �w�C���^�[�t�F�[�X
    */
    function landmarkStationInterface(tmp_station) {
        // �ϐ����X�g
        var station = tmp_station;
        var time;
        var fare;
        var traffic;
        var distance;
        var teiki1;
        var teiki3;
        var teiki6;
        // �֐����X�g
        // station�ݒ�
        function getStation() { return station; };
        this.getStation = getStation;
        // time�ݒ�
        function setTime(value) { time = value; };
        function getTime() { return time; };
        this.setTime = setTime;
        this.getTime = getTime;
        // fare�ݒ�
        function setFare(value) { fare = value; };
        function getFare() { return fare; };
        this.setFare = setFare;
        this.getFare = getFare;
        // traffic�ݒ�
        function setTraffic(value) { traffic = value; };
        function getTraffic() { return traffic; };
        this.setTraffic = setTraffic;
        this.getTraffic = getTraffic;
        // distance�ݒ�
        function setDistance(value) { distance = value; };
        function getDistance() { return distance; };
        this.setDistance = setDistance;
        this.getDistance = getDistance;
        // teiki1�ݒ�
        function setTeiki1(value) { teiki1 = value; };
        function getTeiki1() { return teiki1; };
        this.setTeiki1 = setTeiki1;
        this.getTeiki1 = getTeiki1;
        // teiki3�ݒ�
        function setTeiki3(value) { teiki3 = value; };
        function getTeiki3() { return teiki3; };
        this.setTeiki3 = setTeiki3;
        this.getTeiki3 = getTeiki3;
        // teiki6�ݒ�
        function setTeiki6(value) { teiki6 = value; };
        function getTeiki6() { return teiki6; };
        this.setTeiki6 = setTeiki6;
        this.getTeiki6 = getTeiki6;
    }

    /*
    * �n�_�̃V���A���C�Y�f�[�^���擾
    */
    function getSerializeData() {
        if (typeof serializeData != 'undefined') {
            return serializeData;
        } else {
            return;
        }
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.createLandmark = createLandmark;
    this.createLandmarkInterface = createLandmarkInterface;
    this.createLandmarkStationInterface = createLandmarkStationInterface;
    this.getSerializeData = getSerializeData;
    this.setConfigure = setConfigure;
};
