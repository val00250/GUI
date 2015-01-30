/**
 *  �w���ς��� Web �T�[�r�X
 *  �g���c�[��
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiTools = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiTools\.js"));
        if (s.src && s.src.match(/expGuiTools\.js(\?.*)?/)) {
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
    // �ݒ�
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    /*
    * XML���I�u�W�F�N�g�ɕϊ�
    */
    function xml2object(xml) {
        var tmp_object = new Object();
        var dom;
        if (window.ActiveXObject) {
            dom = new ActiveXObject("Microsoft.XMLDOM");
            dom.loadXML(xml);
        } else {
            var parser = new DOMParser();
            dom = parser.parseFromString(xml, "text/xml");
        }
        return dom2object(dom);
    }

    /*
    * XML���I�u�W�F�N�g�ɕϊ�(�����p)
    */
    function dom2object(xml) {
        var indexTag = "<Route>,<Point>,<Line>";
        var tmp_object = new Object();
        var value;
        var count = 0;
        if (xml.attributes != null) {
            for (var i = 0; i < xml.attributes.length; i++) {
                if (!(xml.attributes[i].name == "index" && indexTag.indexOf('<' + xml.nodeName + '>') != -1)) {
                    tmp_object[xml.attributes[i].name] = xml.attributes[i].value;
                    count++;
                }
            }
        }
        for (var i = 0; i < xml.childNodes.length; i++) {
            if (typeof xml.childNodes[i].nodeValue == "string") {
                value = xml.childNodes[i].nodeValue;
            } else {
                if (typeof tmp_object[xml.childNodes[i].nodeName] != 'undefined') {
                    if (typeof tmp_object[xml.childNodes[i].nodeName] == 'string' || typeof tmp_object[xml.childNodes[i].nodeName].length == 'undefined') {
                        var tmp_obj = tmp_object[xml.childNodes[i].nodeName];
                        tmp_object[xml.childNodes[i].nodeName] = new Array();
                        tmp_object[xml.childNodes[i].nodeName].push(tmp_obj);
                    }
                    tmp_object[xml.childNodes[i].nodeName].push(dom2object(xml.childNodes[i]));
                    count++;
                } else {
                    tmp_object[xml.childNodes[i].nodeName] = dom2object(xml.childNodes[i]);
                    count++;
                }
            }
        }
        if (typeof value != 'undefined') {
            if (count == 0) {
                tmp_object = value;
            } else {
                tmp_object["text"] = value;
            }
        }
        return tmp_object;
    }

    /*
    * �I�u�W�F�N�g��XML�ɕϊ�
    */
    function object2xml(obj, key, index) {
        var indexTag = "<Route>,<Point>,<Line>";
        var buffer = "";
        var attribute = new Array();
        var value = "";
        if (indexTag.indexOf('<' + key + '>') != -1) {
            attribute.push(' index=\"' + String(index + 1) + '\"');
        }
        for (var name in obj) {
            if (typeof obj[name] == "string") {
                if (name == "text") {
                    value = obj[name];
                } else {
                    if (name.match(/^[A-Z]/) != null) {
                        value += '<' + name + '>' + obj[name] + '</' + name + '>';
                    } else {
                        attribute.push(' ' + name + '=\"' + obj[name] + '\"');
                    }
                }
            } else if (typeof obj[name] == "object") {
                if (typeof obj[name].length != "undefined") {
                    for (var i = 0; i < obj[name].length; i++) {
                        value += object2xml(obj[name][i], name, i);
                    }
                } else {
                    value += object2xml(obj[name], name, 0);
                }
            }
        }
        if (typeof key == "undefined") {
            return '<?xml version="1.0" encoding="UTF-8"?>' + value;
        } else if (value == "") {
            return '<' + key + attribute.join("") + ' />';
        } else {
            return '<' + key + attribute.join("") + '>' + value + '</' + key + '>';
        }
    }

    /*
    * �I�u�W�F�N�g��JSON�̕�����ɕϊ�
    */
    /*
    function object2json(obj) {
        var n = 0, buffer = "";
        for (var name in obj) {
            if (n != 0) { buffer += ","; }
            if (typeof obj[name] == "string") {
                buffer += '"' + name + '":"' + obj[name] + '"';
            } else if (typeof obj[name] == "object") {
                if (typeof obj[name].length != "undefined") {
                    buffer += '"' + name + '":[';
                    for (var i = 0; i < obj[name].length; i++) {
                        if (i != 0) { buffer += ","; }
                        buffer += object2json(obj[name][i]);
                    }
                    buffer += "]";
                } else {
                    buffer += '"' + name + '":' + object2json(obj[name]);
                }
            }
            n++;
        }
        return "{" + buffer + "}";
    }
    */

    function xml2json(xml) {
        return JSON.stringify(xml2object(xml));
    }

    function json2xml(json) {
        return object2xml(JSON.parse(json));
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
    //this.object2xml = object2xml;
    //this.xml2object = xml2object;
    this.xml2json = xml2json;
    this.json2xml = json2xml;
    //this.object2json = object2json;
    this.setConfigure = setConfigure;
};
