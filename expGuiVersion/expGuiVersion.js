/**
 *  �w���ς��� Web �T�[�r�X
 *  �o�[�W�������p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiVersion = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiVersion\.js"));
        if (s.src && s.src.match(/expGuiVersion\.js(\?.*)?/)) {
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
    var versionObj;
    var httpObj;
    // �ݒ�
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    /*
    * �f�[�^�o�[�W�����̎擾
    */
    function getVersion(callback) {
        var url = apiURL + "v1/json/dataversion?key=" + key;
        callbackFunction = callback;
        versionObj = new Object();
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        // �ʐM
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setVersion(JSON_object);
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
                    setVersion(JSON_object);
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
    * �o�[�W�������̉��
    */
    function setVersion(json) {
        var tmp_version = json;
        if (typeof tmp_version.ResultSet.Version == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            versionObj = tmp_version.ResultSet;
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * API�o�[�W����
    */
    function getApiVersion() {
        if (typeof versionObj != 'undefined') {
            return versionObj.apiVersion;
        }
        return;
    }

    /*
    * �G���W���o�[�W����
    */
    function getEngineVersion() {
        if (typeof versionObj != 'undefined') {
            return versionObj.engineVersion;
        }
        return;
    }

    /*
    * �o�[�W�������X�g
    */
    function getVersionList() {
        var versionList = new Array();
        if (typeof versionObj != 'undefined') {
            for (var i = 0; i < versionObj.Version.length; i++) {
                versionList.push(setVersionObject(versionObj.Version[i]));
            }
        }
        return versionList;
    }

    /*
    *�o�[�W�����I�u�W�F�N�g�̍쐬
    */
    function setVersionObject(ver) {
        var tmp_version = new Object();
        tmp_version.caption = ver.caption;
        if (ver.createType == "Date") {
            tmp_version.version = ver.create.substr(0, 4) + "/" + ver.create.substr(4, 2) + "/" + ver.create.substr(6, 2);
        } else if (ver.createType == "Edition") {
            tmp_version.version = ver.create.substr(0, 4) + "/" + ver.create.substr(4, 2) + " ��" + parseInt(ver.create.substr(6, 2), 10) + "��";
        } else if (ver.createType == "HideDay") {
            tmp_version.version = ver.create.substr(0, 4) + "/" + ver.create.substr(4, 2);
        }
        if (typeof tmp_version.version != 'undefined') {
            if (typeof ver.createComment != 'undefined') {
                if (ver.createComment.indexOf("!") == 0) {
                    tmp_version.version += " " + ver.createComment.substr(1);
                } else if (ver.createComment == "Now") {
                    tmp_version.version += " ����";
                }
            }
        }
        if (typeof ver.rangeCaption != 'undefined') {
            tmp_version.rangeCaption = ver.rangeCaption;
        }
        if (typeof ver.rangeFrom != 'undefined') {
            tmp_version.rangeFrom = ver.rangeFrom.substr(0, 4) + "/" + ver.rangeFrom.substr(4, 2) + "/" + ver.rangeFrom.substr(6, 2);
        }
        if (typeof ver.rangeTo != 'undefined') {
            tmp_version.rangeTo = ver.rangeTo.substr(0, 4) + "/" + ver.rangeTo.substr(4, 2) + "/" + ver.rangeTo.substr(6, 2);
        }
        return tmp_version;
    }

    /*
    * �����c�̖̂��̂��擾
    * �����݂�id=2�̂ݑΉ�
    */
    function getCompanyName(id) {
        var versionList = new Array();
        if (typeof versionObj != 'undefined') {
            if (versionObj.Copyrights.companyId == String(id)) {
                return versionObj.Copyrights.company;
            }
        }
        return;
    }

    /*
    * ���쌠���擾
    * �����݂�id=2�̂ݑΉ�
    */
    function getCopyrights(id) {
        var versionList = new Array();
        if (typeof versionObj != 'undefined') {
            if (versionObj.Copyrights.companyId == String(id)) {
                return versionObj.Copyrights.text;
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
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.getVersion = getVersion;
    this.getApiVersion = getApiVersion;
    this.getEngineVersion = getEngineVersion;
    this.getVersionList = getVersionList;
    this.getCompanyName = getCompanyName;
    this.getCopyrights = getCopyrights;
    this.setConfigure = setConfigure;
};
