/**
 *  �w���ς��� Web �T�[�r�X
 *  �񐔌����p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiCoupon = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiCoupon\.js"));
        if (s.src && s.src.match(/expGuiCoupon\.js(\?.*)?/)) {
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
    var couponList = new Array();
    var couponDetailList = new Object();
    var httpObj;
    // �ݒ�
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�

    /*
    * �񐔌��̌���
    */
    function searchCoupon(param1, param2) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/coupon/list?key=" + key;
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                callbackFunction = param1;
            } else {
                // �R�[���o�b�N�Ȃ�
                url += "&name=" + encodeURIComponent(param1);
                callbackFunction = undefined;
            }
        } else {
            url += "&name=" + encodeURIComponent(param1);
            callbackFunction = param2;
        }
        couponList = new Array();
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setCoupon(JSON_object);
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
                    setCoupon(JSON_object);
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
    * �񐔌��ꗗ�����
    */
    function setCoupon(json) {
        var tmp_couponList = json;
        if (typeof tmp_couponList.ResultSet.Coupon == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else if (typeof tmp_couponList.ResultSet.Coupon.length == 'undefined') {
            couponList.push(tmp_couponList.ResultSet.Coupon.Name);
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        } else {
            for (var i = 0; i < tmp_couponList.ResultSet.Coupon.length; i++) {
                couponList.push(tmp_couponList.ResultSet.Coupon[i].Name);
            }
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * �񐔌��̈ꗗ���擾
    */
    function getCouponList() {
        return couponList.join(",");
    }

    /*
    * �񐔌����̏ڍׂ��擾
    */
    function searchCouponDetail(name, callback) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/coupon/detail?key=" + key;
        url += "&name=" + encodeURIComponent(name);
        callbackFunction = callback;
        couponDetailList = new Array();
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setCouponDetail(JSON_object);
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
                    setCouponDetail(JSON_object);
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
    * �T�����ʂ𗘗p���ĉ񐔌����擾
    */
    function searchCourseCoupon(serializeData, callback) {
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        var url = apiURL + "v1/json/coupon/detail?key=" + key;
        url += "&serializeData=" + serializeData;
        callbackFunction = callback;
        couponDetailList = new Array();
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setCouponDetail(JSON_object);
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
                    setCouponDetail(JSON_object);
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
    * �񐔌��̏ڍ׏��
    */
    function setCouponDetail(json) {
        var tmp_couponDetail = json;
        if (typeof tmp_couponDetail.ResultSet.Coupon == 'undefined') {
            // ���s
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else if (typeof tmp_couponDetail.ResultSet.Coupon.length == 'undefined') {
            couponDetailList.push(setCouponObject(tmp_couponDetail.ResultSet.Coupon));
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        } else {
            for (var i = 0; i < tmp_couponDetail.ResultSet.Coupon.length; i++) {
                couponDetailList.push(setCouponObject(tmp_couponDetail.ResultSet.Coupon[i]));
            }
            // ����
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * �񐔌��I�u�W�F�N�g�̍쐬
    */
    function setCouponObject(couponObject) {
        var tmp_coupon = new Object();
        tmp_coupon.name = couponObject.Name;
        if (typeof couponObject.Detail != 'undefined') {
            // �񐔌��ڍ�
            tmp_coupon.count = couponObject.Detail.Count;
            tmp_coupon.validPeriod = couponObject.Detail.ValidPeriod;
            tmp_coupon.direction = couponObject.Detail.Direction;
            tmp_coupon.price = couponObject.Detail.Price.Amount;
        }
        return tmp_coupon;
    }

    /*
    * �񐔌��̏ڍ׈ꗗ�擾
    */
    function getCouponDetailList() {
        var buffer = "";
        for (var i = 0; i < couponDetailList.length; i++) {
            if (i != 0) { buffer += ","; }
            buffer += couponDetailList[i].name;
        }
        return buffer;
    }

    /*
    * �񐔌����̎擾
    */
    function getCouponObject(name) {
        for (var i = 0; i < couponDetailList.length; i++) {
            if (couponDetailList[i].name == name) {
                function clone(obj) {
                    var f = function () { };
                    f.prototype = obj;
                    return new f;
                }
                return clone(couponDetailList[i]);
            }
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
    this.searchCoupon = searchCoupon;
    this.getCouponList = getCouponList;
    this.searchCouponDetail = searchCouponDetail;
    this.getCouponDetailList = getCouponDetailList;
    this.getCouponObject = getCouponObject;
    this.searchCourseCoupon = searchCourseCoupon;
    this.setConfigure = setConfigure;

    /*
    * �萔���X�g
    */
    this.DIRECTION_BOTH = "Both";
    this.DIRECTION_DEFINE = "Define";
};
