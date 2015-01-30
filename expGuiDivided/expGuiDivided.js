/**
 *  �w���ς��� Web �T�[�r�X
 *  �����v�Z�p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiDivided = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiDivided\.js"));
        if (s.src && s.src.match(/expGuiDivided\.js(\?.*)?/)) {
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
    var ticketList;
    var PriceType;
    var httpObj;
    // �ݒ�
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    /*
    * ������̕����v�Z
    */
    function searchTeikiDivided(serializeData, callback) {
        PriceType = "teiki";
        searchDivided(serializeData, callback);
    }

    /*
    * ������̕����v�Z
    */
    function searchFareDivided(serializeData, callback) {
        PriceType = "fare";
        searchDivided(serializeData, callback);
    }

    /*
    * �����v�Z�̎��s
    */
    function searchDivided(serializeData, callback) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/course/" + PriceType + "/divided?key=" + key;
        url += "&serializeData=" + serializeData;
        callbackFunction = callback;
        couponDetailList = new Array();
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setDivided(JSON_object);
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
                    setDivided(JSON_object);
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
    * �����v�Z�ꗗ�����
    */
    function setDivided(json) {
        ticketList = new Array();
        var tmp_dividedList = json;
        if (typeof tmp_dividedList.ResultSet.Ticket == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else if (typeof tmp_dividedList.ResultSet.Ticket.length == 'undefined') {
            ticketList = setTicket(tmp_dividedList.ResultSet.Ticket);
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        } else {
            for (var i = 0; i < tmp_dividedList.ResultSet.Ticket.length; i++) {
                ticketList = ticketList.concat(setTicket(tmp_dividedList.ResultSet.Ticket[i]));
            }
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * �I�u�W�F�N�g�̒l���擾
    */
    function getTextValue(obj) {
        if (typeof obj.text != "undefined") {
            return obj.text;
        } else {
            return obj;
        }
    }

    /*
    * �`�P�b�g�v�f
    */
    function setTicket(tmpTicketPart) {
        tmp_partList = new Array();
        if (typeof tmpTicketPart.Part != 'undefined') {
            if (typeof tmpTicketPart.Part.length == 'undefined') {
                tmp_partList.push(setTicketPart(tmpTicketPart.Part, tmpTicketPart.type));
            } else {
                for (var i = 0; i < tmpTicketPart.Part.length; i++) {
                    tmp_partList.push(setTicketPart(tmpTicketPart.Part[i], tmpTicketPart.type));
                }
            }
        }
        return tmp_partList;
    }

    /*
    * ���������v�f
    */
    function setTicketPart(tmpTicketPart, type) {
        var tmp_ticket = new Object();
        tmp_ticket.type = String(type).toLowerCase();
        tmp_ticket.price = parseInt(getTextValue(tmpTicketPart.Price.Oneway));
        tmp_ticket.from = setPointObject(tmpTicketPart.Point[0]);
        tmp_ticket.to = setPointObject(tmpTicketPart.Point[1]);
        return tmp_ticket;
    }

    /*
    * �n�_�I�u�W�F�N�g���擾
    */
    function setPointObject(tmpPoint) {
        var tmp_station = new Object();
        tmp_station.name = tmpPoint.Station.Name;
        tmp_station.code = tmpPoint.Station.code;
        tmp_station.yomi = tmpPoint.Station.Yomi;
        if (typeof tmpPoint.Station.Type.text != 'undefined') {
            tmp_station.type = tmpPoint.Station.Type.text;
            if (typeof tmpPoint.Station.Type.detail != 'undefined') {
                tmp_station.type_detail = tmpPoint.Station.Type.text + "." + tmpPoint.Station.Type.detail;
            }
        } else {
            tmp_station.type = tmpPoint.Station.Type;
        }
        //���R�[�h
        if (typeof tmpPoint.Prefecture != 'undefined') {
            tmp_station.kenCode = parseInt(tmpPoint.Prefecture.code);
        }
        return tmp_station;
    }

    /*
    * �����v�Z�̏ڍ׈ꗗ�擾
    */
    function getDividedObject(index) {
        var tmp_dividedObject = new Object();
        if (typeof ticketList != 'undefined') {
            if (typeof ticketList[parseInt(index) - 1] != 'undefined') {
                tmp_dividedObject.type = ticketList[parseInt(index) - 1].type;
                tmp_dividedObject.from = ticketList[parseInt(index) - 1].from.name;
                tmp_dividedObject.to = ticketList[parseInt(index) - 1].to.name;
                tmp_dividedObject.price = ticketList[parseInt(index) - 1].price;
                return tmp_dividedObject;
            }
        }
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
        if (typeof ticketList != 'undefined') {
            for (var i = 0; i < ticketList.length; i++) {
                if (isNaN(station)) {
                    if (ticketList[i].from.name == station) {
                        return clone(ticketList[i].from);
                    } else if (ticketList[i].to.name == station) {
                        return clone(ticketList[i].to);
                    }
                } else {
                    if (ticketList[i].from.code == station) {
                        return clone(ticketList[i].from);
                    } else if (ticketList[i].to.code == station) {
                        return clone(ticketList[i].to);
                    }
                }
            }
        }
    }

    /*
    * �����v�Z���z�擾
    */
    function getPrice(type) {
        if (typeof ticketList != 'undefined') {
            var total = 0;
            if (PriceType == "fare") {
                for (var i = 0; i < ticketList.length; i++) {
                    total += ticketList[i].price;
                }
                return total;
            } else {
                for (var i = 0; i < ticketList.length; i++) {
                    if (ticketList[i].type == type) {
                        total += ticketList[i].price;
                    }
                }
                return total;
            }
        }
    }

    /*
    * ����������int�Ŏ擾
    */
    function getDividedCount() {
        if (typeof ticketList != 'undefined') {
            return ticketList.length;
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
    this.searchTeikiDivided = searchTeikiDivided;
    this.searchFareDivided = searchFareDivided;
    this.getPrice = getPrice;
    this.getDividedCount = getDividedCount;
    this.getDividedObject = getDividedObject;
    this.getPointObject = getPointObject;
    this.setConfigure = setConfigure;

    /*
    * �萔���X�g
    */
    this.PRICE_ONEWAY = "oneway";
    this.PRICE_ROUND = "round";
    this.PRICE_TEIKI = "teiki";
    this.TEIKI1 = 1;
    this.TEIKI3 = 3;
    this.TEIKI6 = 6;
    this.TYPE_TEIKI1 = "teiki1";
    this.TYPE_TEIKI3 = "teiki3";
    this.TYPE_TEIKI6 = "teiki6";
    this.TYPE_FARE = "fare";
};
