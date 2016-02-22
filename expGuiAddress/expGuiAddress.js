/**
 *  駅すぱあと Web サービス
 *  住所検索パーツ
 *  サンプルコード
 *  https://github.com/EkispertWebService/GUI
 *  
 *  Version:2016-02-22
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiAddress = function (pObject, config) {
    /*
    * Webサービスの設定
    */
    var apiURL = "http://api.ekispert.jp/";

    /*
    * GETパラメータからキーの設定
    */
    var key;
    var scripts = document.getElementsByTagName("script");
    var imagePath;
    for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        imagePath = s.src.substring(0, s.src.indexOf("expGuiAddress\.js"));
        if (s.src && s.src.match(/expGuiAddress\.js(\?.*)?/)) {
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
    * 変数郡
    */
    var addressList;
    var httpObj;
    // 設定
    var corporationBind;
    var type;
    var prefectureCode;
    var callbackFunction; // コールバック関数の設定
    //住所引き継ぎ用文字列
    var prefectureName;
    var cityName;
    var districtName;
    var streetName;
    //最寄駅検索用
    var stationList = new Array();

    /*
    * 地域コードから住所の検索
    */
    function searchAreaCode(areaCode, callback) {
        //文字列を初期化
        prefectureName = undefined;
        cityName = undefined;
        districtName = undefined;
        streetName = undefined;
        var url;
        url = apiURL + "v1/json/address?key=" + key;
        if(areaCode > 0){
            url += "&areaCode=" + areaCode;
        }
        search(url, callback);
    }

    /*
    * 住所検索
    */
    function searchAddress(address1, address2, address3, address4, callback) {
        //文字列を初期化
        prefectureName = undefined;
        cityName = undefined;
        districtName = undefined;
        streetName = undefined;
        var url;
        //住所を組み立てる
        var address = "";
        if (typeof address1 == 'function') {
            callback = address1;
        } else if (typeof address1 == 'string') {
            address += address1;
            if (typeof address2 == 'function') {
                callback = address2;
            } else if (typeof address2 == 'string') {
                address += ":" + address2;
                if (typeof address3 == 'function') {
                    callback = address3;
                } else if (typeof address3 == 'string') {
                    address += ":" + address3;
                    if (typeof address4 == 'function') {
                        callback = address4;
                    } else if (typeof address4 == 'string') {
                        address += ":" + address4;
                    }
                }
            }
        }
        //検索実行
        if (isNaN(address) || address == "") {
            url = apiURL + "v1/json/address?key=" + key;
            if (address != "") {
                var tmp_addressParam = address.split(":");
                tmp_addressParam
                prefectureName = tmp_addressParam[0];
                url += "&prefectureName=" + encodeURIComponent(prefectureName);
                if (tmp_addressParam.length >= 2) {
                    cityName = tmp_addressParam[1];
                    url += "&cityName=" + encodeURIComponent(cityName);
                }
                if (tmp_addressParam.length >= 3) {
                    districtName = tmp_addressParam[2];
                    url += "&districtName=" + encodeURIComponent(districtName);
                }
                if (tmp_addressParam.length >= 4) {
                    streetName = tmp_addressParam[3];
                    url += "&streetName=" + encodeURIComponent(streetName);
                }
            }
        } else {
            url = apiURL + "v1/json/zipcode/address?key=" + key;
            url += "&zipCode=" + address;
        }
        search(url, callback);
    }

    /**
    * 住所検索汎用関数
    */
    function search(url, callback) {
        //コールバック関数
        callbackFunction = callback;
        addressList = new Array();
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        // 通信
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE用
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setAddress(JSON_object);
            };
            httpObj.onerror = function () {
                // エラー時の処理
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
                    setAddress(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // エラー時の処理
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
    * 最寄駅検索
    */
    function searchStation(address, param1, param2) {
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                callbackFunction = param1;
            } else {
                address += "," + param1;
                callbackFunction = undefined;
            }
        } else {
            // 半径
            address += "," + param1;
            callbackFunction = param2;
        }
        stationList = new Array();
        var url;
        url = apiURL + "v1/json/address/station?key=" + key;
        url += "&address=" + encodeURIComponent(address);
        if (typeof type != 'undefined') {
            url += "&type=" + type;
        }
        if (typeof corporationBind != 'undefined') {
            url += "&corporationBind=" + encodeURIComponent(corporationBind);
        }
        stationList = new Array();
        if (typeof httpObj != 'undefined') {
            httpObj.abort();
        }
        // 通信
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE用
            httpObj = new XDomainRequest();
            httpObj.onload = function () {
                JSON_object = JSON.parse(httpObj.responseText);
                setStation(JSON_object);
            };
            httpObj.onerror = function () {
                // エラー時の処理
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
                    setStation(JSON_object);
                } else if (httpObj.readyState == done && httpObj.status != ok) {
                    // エラー時の処理
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
    * 駅リスト
    */
    function setStation(tmp_stationList) {
        if (typeof tmp_stationList.ResultSet.Point == 'undefined') {
            // 失敗
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            if (typeof tmp_stationList.ResultSet.Point.length == 'undefined') {
                stationList.push(setStationObject(tmp_stationList.ResultSet.Point));
            } else {
                for (var i = 0; i < tmp_stationList.ResultSet.Point.length; i++) {
                    stationList.push(setStationObject(tmp_stationList.ResultSet.Point[i]));
                }
            }
            // 成功
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * 地点オブジェクトの作成
    */
    function setStationObject(stationObj) {
        var tmp_station = new Object();
        tmp_station.name = stationObj.Station.Name;
        tmp_station.code = stationObj.Station.code;
        tmp_station.yomi = stationObj.Station.Yomi;
        if (typeof stationObj.Station.Type.text != 'undefined') {
            tmp_station.type = stationObj.Station.Type.text;
            if (typeof stationObj.Station.Type.detail != 'undefined') {
                tmp_station.type_detail = stationObj.Station.Type.text + "." + stationObj.Station.Type.detail;
            }
        } else {
            tmp_station.type = stationObj.Station.Type;
        }
        if (typeof stationObj.GeoPoint != 'undefined') {
            // 緯度
            tmp_station.lati = stationObj.GeoPoint.lati;
            tmp_station.lati_d = stationObj.GeoPoint.lati_d;
            // 経度
            tmp_station.longi = stationObj.GeoPoint.longi;
            tmp_station.longi_d = stationObj.GeoPoint.longi_d;
            // gcs
            tmp_station.gcs = stationObj.GeoPoint.gcs;
        }
        //県コード
        if (typeof stationObj.Prefecture != 'undefined') {
            tmp_station.kenCode = parseInt(stationObj.Prefecture.code);
        }
        //距離
        if (typeof stationObj.Distance != 'undefined') {
            tmp_station.distance = parseInt(stationObj.Distance);
        }
        return tmp_station;
    }

    /*
    * 検索した駅名リストを返す
    */
    function getStationList() {
        var stationArray = new Array();
        for (var i = 0; i < stationList.length; i++) {
            stationArray.push(stationList[i].name);
        }
        return stationArray.join(",");
    }

    /*
    * 駅情報の取得
    */
    function getPointObject(station) {
        // オブジェクトコピー用インライン関数
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
    * 住所一覧
    */
    function setAddress(tmp_address) {
        if (typeof tmp_address.ResultSet.Address == 'undefined') {
            // 失敗
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            if (typeof tmp_address.ResultSet.Address.length == 'undefined') {
                addressList.push(setAddressObject(tmp_address.ResultSet.Address));
            } else {
                for (var i = 0; i < tmp_address.ResultSet.Address.length; i++) {
                    addressList.push(setAddressObject(tmp_address.ResultSet.Address[i]));
                }
            }
            // 成功
            if (typeof callbackFunction == 'function') {
                callbackFunction(true);
            }
        }
    }

    /*
    * 地点オブジェクトの作成
    */
    function setAddressObject(addressObj) {
        var tmp_address = new Object();
        if (typeof addressObj.Prefecture != 'undefined') {
            tmp_address.prefectureName = addressObj.Prefecture.Name;
        } else if (typeof prefectureName != 'undefined') {
            tmp_address.prefectureName = prefectureName;
        }
        if (typeof addressObj.City != 'undefined') {
            tmp_address.cityName = addressObj.City.Name;
        } else if (typeof cityName != 'undefined') {
            tmp_address.cityName = cityName;
        }
        if (typeof addressObj.District != 'undefined') {
            tmp_address.districtName = addressObj.District.Name;

        } else if (typeof districtName != 'undefined') {
            tmp_address.districtName = districtName;
        }
        if (typeof addressObj.Street != 'undefined') {
            if (typeof addressObj.Street.Name != 'undefined') {
                tmp_address.streetName = addressObj.Street.Name;
            } else {
                tmp_address.streetName = "";
            }
        } else if (typeof streetName != 'undefined') {
            tmp_address.streetName = streetName;
        }
        if (typeof addressObj.GeoPoint != 'undefined') {
            // 緯度
            tmp_address.lati = addressObj.GeoPoint.lati;
            tmp_address.lati_d = addressObj.GeoPoint.lati_d;
            // 経度
            tmp_address.longi = addressObj.GeoPoint.longi;
            tmp_address.longi_d = addressObj.GeoPoint.longi_d;
            // gcs
            tmp_address.gcs = addressObj.GeoPoint.gcs;
        }
        //距離
        if (typeof addressObj.zipCode != 'undefined') {
            tmp_address.zipCode = addressObj.zipCode;
        }
        return tmp_address;
    }

    /*
    * 住所の取得
    */
    function getAddressList() {
        var addressArray = new Array();
        for (var i = 0; i < addressList.length; i++) {
            addressArray.push(getAddresString(addressList[i]));
        }
        return addressArray.join(",");
    }

    /*
    * 住所の文字列を結合
    */
    function getAddresString(addressObj) {
        var buffer = "";
        if (typeof addressObj.prefectureName != 'undefined') {
            buffer += addressObj.prefectureName;
            if (typeof addressObj.cityName != 'undefined') {
                buffer += addressObj.cityName;
                if (typeof addressObj.districtName != 'undefined') {
                    buffer += addressObj.districtName;
                    if (typeof addressObj.streetName != 'undefined') {
                        buffer += addressObj.streetName;
                    }
                }
            }
        }
        return buffer;
    }

    /*
    * 住所情報の取得
    */
    function getAddressObject(address) {
        // オブジェクトコピー用インライン関数
        function clone(obj) {
            var f = function () { };
            f.prototype = obj;
            return new f;
        }
        for (var i = 0; i < addressList.length; i++) {
            if (getAddresString(addressList[i]) == address) {
                return clone(addressList[i]);
            }
        }
    }

    /*
    * 環境設定
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("key").toLowerCase()) {
            key = value;
        } else if (name == "corporationBind") {
            if (typeof value == "object") {
                corporationBind = value.join(":");
            } else {
                corporationBind = value;
            }
        } else if (name == "type") {
            if (typeof value == "object") {
                type = value.join(":");
            } else {
                type = value;
            }
        } else if (name == "prefectureCode") {
            if (typeof value == "object") {
                prefectureCode = value.join(":");
            } else {
                prefectureCode = value;
            }
        } else if (String(name).toLowerCase() == String("ssl").toLowerCase()) {
            if (String(value).toLowerCase() == "true" || String(value).toLowerCase() == "enable" || String(value).toLowerCase() == "enabled") {
                apiURL = apiURL.replace('http://', 'https://');
            } else {
                apiURL = apiURL.replace('https://', 'http://');
            }
        }
    }

    /*
    * 利用できる関数リスト
    */
    this.searchAddress = searchAddress;
    this.searchAreaCode = searchAreaCode;
    this.getAddressList = getAddressList;
    this.getAddressObject = getAddressObject;
    this.searchStation = searchStation;
    this.getStationList = getStationList;
    this.getPointObject = getPointObject;
    this.setConfigure = setConfigure;

    /*
    * 定数リスト
    */
    this.DIRECTION_UP = "up";
    this.DIRECTION_DOWN = "down";
    this.DIRECTION_NONE = "none";
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
    this.AREA_TYPE_JAPAN = 0;
    this.AREA_TYPE_HOKKAIDO = 1;
    this.AREA_TYPE_TOHOKU = 2;
    this.AREA_TYPE_KANTO = 3;
    this.AREA_TYPE_CHUBU = 4;
    this.AREA_TYPE_KINKI = 5;
    this.AREA_TYPE_CHUGOKU = 6;
    this.AREA_TYPE_SHIKOKU = 7;
    this.AREA_TYPE_KYUSHU = 8;
};
