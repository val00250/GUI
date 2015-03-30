/**
 *  �w���ς��� Web �T�[�r�X
 *  �o�H�\���p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2015-03-30
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiCourse = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiCourse\.js"));

        if (s.src && s.src.match(/expGuiCourse\.js(\?.*)?/)) {
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
    var searchObj; // �T�������̃I�u�W�F�N�g
    var resultObj; // �T�����ʂ̃��N�G�X�g�I�u�W�F�N�g
    var result; // �T�����ʃI�u�W�F�N�g
    var selectNo = 0; // �\�����Ă���T���o�HNO
    var resultCount = 0; // �T�����ʐ�
    var viewCourseListFlag = false; // �o�H�ꗗ�\��
    var priceChangeFlag = true; // ���Ȏ�ʂ�ύX�ł��邩�ǂ���
    var priceChangeRefreshFlag = false; // ���Ȏ�ʕύX���Ƀ��N�G�X�g���邩�ǂ���
    var priceViewFlag = "oneway"; // �Г��E�����E����̕\���ؑ�
    var assignDiaFlag = false; // �O��̃_�C�����蓖�Ă̐ݒ�
    var courseListFlag = false; // �T�����ʂ̈ꗗ�����I�[�v��
    var callbackFunction; // �R�[���o�b�N�֐��̐ݒ�
    var callBackFunctionBind = new Object();
    var windowFlag = false; //�E�B���h�E�\���t���O

    /*
    * �œK�o�H�̕ϐ�
    */
    var minTimeSummary;
    var minTransferCount;
    var minPriceSummary;
    var minPriceRoundSummary;
    var minTeikiSummary;
    var minTeiki1Summary;
    var minTeiki3Summary;
    var minTeiki6Summary;
    var minExhaustCO2;

    /*
    * ���j���[�̃R�[���o�b�N
    */
    var callBackObjectStation = new Array;
    var callBackObjectLine = new Array;

    function dispCourseWindow() {
        windowFlag = true;
        dispCourse();
    }

    /*
    * �T�����ʂ̐ݒu
    */
    function dispCourse() {
        var buffer = "";
        // �T�����ʂ̕\��
        if (agent == 1) {
            buffer += '<div class="expGuiCourse expGuiCoursePc" id="' + baseId + ':course" style="display:none;">';
        } else if (agent == 2) {
            buffer += '<div class="expGuiCourse expGuiCoursePhone" id="' + baseId + ':course" style="display:none;">';
        } else if (agent == 3) {
            buffer += '<div class="expGuiCourse expGuiCourseTablet" id="' + baseId + ':course" style="display:none;">';
        }
        if (windowFlag) {
            // �|�b�v�A�b�v��
            buffer += '<div id="' + baseId + ':resultPopup" class="exp_resultPopup">';
            // ���ʖ{��
            buffer += '<div class="exp_resultBody">';
            // ����{�^��
            buffer += '<div class="exp_header">';
            buffer += '<div class="exp_resultClose">';
            buffer += '<a class="exp_resultCloseButton" id="' + baseId + ':resultClose" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':resultClose:text">����</span></a>';
            buffer += '</div>';
            buffer += '</div>';
            // �T�����ʂ̕\��
            buffer += '<div class="exp_result" id="' + baseId + ':result"></div>';
            // �m��{�^��
            if (typeof callBackFunctionBind['select'] == 'function') {
                buffer += '<div class="exp_footer">';
                buffer += '<div class="exp_resultSelect">';
                buffer += '<a class="exp_resultSelectButton" id="' + baseId + ':courseSelect" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':courseSelect:text">�o�H�m��</span></a>';
                buffer += '</div>';
                buffer += '</div>';
            }
            buffer += '</div>';
            buffer += '</div>';
        } else {
            // �T�����ʂ̕\��
            buffer += '<div class="exp_result" id="' + baseId + ':result"></div>';
        }

        buffer += '</div>';
        // HTML�֏o��
        documentObject.innerHTML = buffer;
        if (windowFlag) {
            addEvent(document.getElementById(baseId + ":course"), "click", onEvent);
        }
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
    * �T�����s
    */
    function search(searchObject, param1, param2) {
        // ���̑��p�����[�^
        var etcParam = new Array();
        if (typeof searchObject == "string") {
            // �R�[���o�b�N�֐��̐ݒ�
            callbackFunction = param2;
            // �T���I�u�W�F�N�g�𐶐�
            searchObj = createSearchInterface();
            searchObj.setPriceType(param1);
            // �p�����[�^�����
            var tmpParamList = searchObject.split('&');
            for (var i = 0; i < tmpParamList.length; i++) {
                var tmpParam = tmpParamList[i].split('=');
                if (tmpParam.length == 2) {
                    switch (tmpParam[0].toLowerCase()) {
                        case "vialist":
                            searchObj.setViaList(tmpParam[1]);
                            break;
                        case "fixedraillist":
                            searchObj.setFixedRailList(tmpParam[1]);
                            break;
                        case "fixedraildirectionlist":
                            searchObj.setFixedRailDirectionList(tmpParam[1]);
                            break;
                        case "date":
                            searchObj.setDate(tmpParam[1]);
                            break;
                        case "time":
                            searchObj.setTime(tmpParam[1]);
                            break;
                        case "searchtype":
                            searchObj.setSearchType(tmpParam[1]);
                            break;
                        case "sort":
                            searchObj.setSort(tmpParam[1]);
                            break;
                        case "answercount":
                            searchObj.setAnswerCount(tmpParam[1]);
                            break;
                        case "searchcount":
                            searchObj.setSearchCount(tmpParam[1]);
                            break;
                        case "conditiondetail":
                            searchObj.setConditionDetail(tmpParam[1]);
                            break;
                        case "corporationbind":
                            searchObj.setCorporationBind(tmpParam[1]);
                            break;
                        case "interruptcorporationlist":
                            searchObj.setInterruptCorporationList(tmpParam[1]);
                            break;
                        case "interruptraillist":
                            searchObj.setInterruptRailList(tmpParam[1]);
                            break;
                        case "resultdetail":
                            searchObj.setResultDetail(tmpParam[1]);
                            break;
                        case "assignroute":
                            searchObj.setAssignRoute(tmpParam[1]);
                            break;
                        case "assigndetailroute":
                            searchObj.setAssignDetailRoute(tmpParam[1]);
                            break;
                        case "assignnikukanteikiindex":
                            searchObj.setAssignNikukanteikiIndex(tmpParam[1]);
                            break;
                        case "coupon":
                            searchObj.setCoupon(tmpParam[1]);
                            break;
                        default:
                            etcParam.push(tmpParam[0] + "=" + encodeURIComponent(tmpParam[1]));
                            break;
                    }
                }
            }
        } else {
            // �T���I�u�W�F�N�g���w��
            searchObj = searchObject;
            // �R�[���o�b�N�֐��̐ݒ�
            callbackFunction = param1;
        }
        // �T���I�u�W�F�N�g�𕶎���ɕϊ�
        var searchWord = "";
        if (typeof searchObj.getViaList() != 'undefined') {
            var tmp_stationList = searchObj.getViaList().split(":");
            for (var i = 0; i < tmp_stationList.length; i++) {
                if (isNaN(tmp_stationList[i])) {
                    if (tmp_stationList[i].indexOf("P-") != 0) {
                        tmp_stationList[i] = encodeURIComponent(tmp_stationList[i]);
                    }
                }
            }
            searchWord += "&viaList=" + tmp_stationList.join(":");
        }
        if (typeof searchObj.getFixedRailList() != 'undefined') {
            searchWord += "&fixedRailList=" + encodeURIComponent(searchObj.getFixedRailList());
        }
        if (typeof searchObj.getFixedRailDirectionList() != 'undefined') {
            searchWord += "&fixedRailDirectionList=" + encodeURIComponent(searchObj.getFixedRailDirectionList());
        }
        if (typeof searchObj.getDate() != 'undefined') {
            searchWord += "&date=" + searchObj.getDate();
        }
        if (typeof searchObj.getTime() != 'undefined') {
            searchWord += "&time=" + searchObj.getTime();
        }
        if (typeof searchObj.getSearchType() != 'undefined') {
            searchWord += "&searchType=" + searchObj.getSearchType();
        }
        if (typeof searchObj.getSort() != 'undefined') {
            searchWord += "&sort=" + searchObj.getSort();
        }
        if (typeof searchObj.getAnswerCount() != 'undefined') {
            searchWord += "&answerCount=" + searchObj.getAnswerCount();
        }
        if (typeof searchObj.getSearchCount() != 'undefined') {
            searchWord += "&searchCount=" + searchObj.getSearchCount();
        }
        if (typeof searchObj.getConditionDetail() != 'undefined') {
            searchWord += "&conditionDetail=" + searchObj.getConditionDetail();
        }
        if (typeof searchObj.getCorporationBind() != 'undefined') {
            searchWord += "&corporationBind=" + encodeURIComponent(searchObj.getCorporationBind());
        }
        if (typeof searchObj.getInterruptCorporationList() != 'undefined') {
            searchWord += "&interruptCorporationList=" + encodeURIComponent(searchObj.getInterruptCorporationList());
        }
        if (typeof searchObj.getInterruptRailList() != 'undefined') {
            searchWord += "&interruptRailList=" + encodeURIComponent(searchObj.getInterruptRailList());
        }
        if (typeof searchObj.getResultDetail() != 'undefined') {
            searchWord += "&resultDetail=" + searchObj.getResultDetail();
        }
        if (typeof searchObj.getAssignRoute() != 'undefined') {
            searchWord += "&assignRoute=" + encodeURIComponent(searchObj.getAssignRoute());
        }
        if (typeof searchObj.getAssignDetailRoute() != 'undefined') {
            searchWord += "&assignDetailRoute=" + encodeURIComponent(searchObj.getAssignDetailRoute());
        }
        if (typeof searchObj.getAssignNikukanteikiIndex() != 'undefined') {
            searchWord += "&assignNikukanteikiIndex=" + searchObj.getAssignNikukanteikiIndex();
        }
        if (typeof searchObj.getCoupon() != 'undefined') {
            searchWord += "&coupon=" + encodeURIComponent(searchObj.getCoupon());
        }
        // ���̑��p�����[�^�ǉ�
        if (etcParam.length > 0) {
            searchWord += "&" + etcParam.join("&");
        }
        // �T��������̐���
        var url = apiURL + "v1/json/search/course/extreme?key=" + key + searchWord;
        searchRun(url, searchObj.getPriceType());
    }

    /*
    * �T�����ʂ̕ҏW
    */
    function courseEdit(param, callback) {
        if (resultCount >= 1 && selectNo >= 1) {
            callbackFunction = callback;
            // �T���I�u�W�F�N�g�̓���
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            // �V���A���C�Y�f�[�^��ݒ�
            var url = apiURL + "v1/json/course/edit?key=" + key + "&serializeData=" + tmpResult.SerializeData;
            url += "&" + param;
            // �T�������s
            reSearch(url, selectNo);
        }
    }

    /*
    * �T�����s�{��
    */
    function searchRun(url, tmpPriceFlag) {
        // ���z�w�肳��Ă����ꍇ�̓Z�b�g����
        if (typeof tmpPriceFlag != 'undefined') {
            priceViewFlag = tmpPriceFlag;
        } else {
            priceViewFlag = "oneway";
        }
        //�T�����s���̓L�����Z��
        if (typeof resultObj != 'undefined') {
            resultObj.abort();
        }
        //���[�h���̕\��
        if (!document.getElementById(baseId + ':result')) {
            dispCourse();
        }
        document.getElementById(baseId + ':result').innerHTML = '<div class="expLoading"><div class="expText">�o�H�擾��...</div></div>';
        document.getElementById(baseId + ':course').style.display = "block";
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            resultObj = new XDomainRequest();
            resultObj.onload = function () {
                // OK���̏���
                setResult(resultObj.responseText, callbackFunction);
            };
            resultObj.onerror = function () {
                // �G���[���̏���
                if (typeof callbackFunction == 'function') {
                    callbackFunction(false);
                }
            };
        } else {
            resultObj = new XMLHttpRequest();
            resultObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (resultObj.readyState == done && resultObj.status == ok) {
                    // OK���̏���
                    setResult(resultObj.responseText, callbackFunction);
                } else if (resultObj.readyState == done && resultObj.status != ok) {
                    // �G���[���̏���
                    if (typeof callbackFunction == 'function') {
                        callbackFunction(false);
                    }
                }
            };
        }
        resultObj.open("GET", url, true);
        resultObj.send(null);
    }

    /*
    * �V���A���C�Y�f�[�^��T�����ʂɕ���
    */
    function setSerializeData(serialize, tmpPriceFlag, callback) {
        callbackFunction = callback;
        var url = apiURL + "v1/json/course/edit?key=" + key + "&serializeData=" + serialize;
        searchRun(url, tmpPriceFlag);
    }

    /*
    * �O��̃_�C���T��
    */
    function assignDia(type) {
        // �T���I�u�W�F�N�g�̓���
        var tmpResult;
        if (resultCount == 1) {
            tmpResult = result.ResultSet.Course;
        } else {
            tmpResult = result.ResultSet.Course[(selectNo - 1)];
        }
        // �V���A���C�Y�f�[�^��ݒ肵
        var url = apiURL + "v1/json/course/edit?key=" + key + "&serializeData=" + tmpResult.SerializeData;
        if (type == "prev") {
            // �O�̃_�C��
            url += "&assignInstruction=AutoPrevious";
        } else if (type == "next") {
            // ���̃_�C��
            url += "&assignInstruction=AutoNext";
        }
        // �T�������s
        reSearch(url, selectNo);
    }

    /*
    * JSON����͂��ĒT�����ʂ��o��
    */
    function setResult(resultObject, param1, param2) {
        if (!document.getElementById(baseId + ':result')) {
            dispCourse();
        }
        if (typeof param1 == 'undefined') {
            callbackFunction = undefined;
        } else if (typeof param2 == 'undefined') {
            if (typeof param1 == 'function') {
                callbackFunction = param1;
            } else {
                priceViewFlag = param1;
                callbackFunction = undefined;
            }
        } else {
            priceViewFlag = param1;
            callbackFunction = param2;
        }
        if (typeof resultObject == 'undefined') {
            // �T�����ʂ��擾�ł��Ă��Ȃ��ꍇ
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else if (resultObject == "") {
            // �T�����ʂ��擾�ł��Ă��Ȃ��ꍇ
            if (typeof callbackFunction == 'function') {
                callbackFunction(false);
            }
        } else {
            result = JSON.parse(resultObject);
            // �`��̈��������
            if (!document.getElementById(baseId + ':result')) {
                dispCourse();
            }
            // �o�H�\��
            viewResult();
            // �\������
            document.getElementById(baseId + ':course').style.display = "block";
            // ��x�����R�[���o�b�N����
            if (typeof callbackFunction == 'function') {
                if (typeof result == 'undefined') {
                    // �T�����ʃI�u�W�F�N�g���Ȃ��ꍇ
                    callbackFunction(false);
                } else if (typeof result.ResultSet.Course == 'undefined') {
                    // �T�����ʂ��擾�ł��Ă��Ȃ��ꍇ
                    callbackFunction(false);
                } else {
                    // �T������
                    callbackFunction(true);
                }
                callbackFunction = undefined;
            }
        }
    }

    /*
    * �T�����ʏo�͕���
    */
    function viewResult() {
        if (typeof result == 'undefined') {
            // �T�����ʃI�u�W�F�N�g���Ȃ��ꍇ
            return false;
        } else if (typeof result.ResultSet.Course == 'undefined') {
            // �T�����ʂ��Ȃ��ꍇ
            return false;
        } else {
            // �K�����o�H��\��
            selectNo = 1;
            // �o�H�ꗗ��\���ɐ؂�ւ�
            viewCourseListFlag = courseListFlag;
            if (typeof result.ResultSet.Course.length == 'undefined') {
                // �T�����ʂ��P��̏ꍇ
                resultCount = 1;
            } else {
                // �T�����ʂ������̏ꍇ
                resultCount = result.ResultSet.Course.length;
            }
            // �œK�o�H�̃`�F�b�N
            checkCourseList();

            // �T�����ʂ̕`��
            var buffer = '';
            buffer += '<div id="' + baseId + ':result:header" class="exp_resultHeader exp_clearfix"></div>';
            buffer += '<div id="' + baseId + ':result:body"></div>';
            document.getElementById(baseId + ':result').innerHTML = buffer;

            // �o�H���o��
            viewResultList();
        }
    }

    /*
    * �\�����Ă���o�H��ύX
    */
    function changeCourse(n, callback) {
        selectNo = n;
        if (selectNo <= resultCount) {
            viewCourseListFlag = false;
            // �œK�o�H�̃`�F�b�N
            checkCourseList();
            // �o�H���o��
            viewResultList();
            // �ύX�����o
            if (typeof callback == 'function') {
                callback(true);
            } else if (typeof callBackFunctionBind['change'] == 'function') {
                callBackFunctionBind['change'](true);
            }
        } else {
            // ���s
            if (typeof callback == 'function') {
                callback(false);
            } else if (typeof callBackFunctionBind['change'] == 'function') {
                callBackFunctionBind['change'](false);
            }
        }
    }

    /*
    * �œK�o�H�̃t���O���`�F�b�N����
    */
    function checkCourseList() {
        minTimeSummary = undefined;
        minTransferCount = undefined;
        minPriceSummary = undefined;
        minPriceRoundSummary = undefined;
        minTeikiSummary = undefined;
        minTeiki1Summary = undefined;
        minTeiki3Summary = undefined;
        minTeiki6Summary = undefined;
        minExhaustCO2 = undefined;
        // �T�����ʂ�2�ȏ�̏ꍇ�Ƀ`�F�b�N����
        if (resultCount >= 2) {
            // �œK�o�H�t���O
            for (var i = 0; i < resultCount; i++) {
                var tmpResult;
                tmpResult = result.ResultSet.Course[i];
                // ���v���Ԃ��`�F�b�N
                var TimeSummary = parseInt(tmpResult.Route.timeOnBoard) + parseInt(tmpResult.Route.timeWalk) + parseInt(tmpResult.Route.timeOther);
                if (typeof minTimeSummary == 'undefined') {
                    minTimeSummary = TimeSummary;
                } else if (minTimeSummary > TimeSummary) {
                    minTimeSummary = TimeSummary;
                }
                // ��芷���񐔂��`�F�b�N
                var transferCount = parseInt(tmpResult.Route.transferCount);
                if (typeof minTransferCount == 'undefined') {
                    minTransferCount = transferCount;
                } else if (minTransferCount > transferCount) {
                    minTransferCount = transferCount;
                }
                // CO2�r�o�ʂ��`�F�b�N
                var exhaustCO2 = parseInt(tmpResult.Route.exhaustCO2);
                if (typeof minExhaustCO2 == 'undefined') {
                    minExhaustCO2 = exhaustCO2;
                } else if (minExhaustCO2 > exhaustCO2) {
                    minExhaustCO2 = exhaustCO2;
                }
                // �����̌v�Z
                var FareSummary = 0;
                var FareRoundSummary = 0;
                var ChargeSummary = 0;
                var ChargeRoundSummary = 0;
                var Teiki1Summary;
                var Teiki3Summary;
                var Teiki6Summary;
                if (typeof tmpResult.Price != 'undefined') {
                    for (var j = 0; j < tmpResult.Price.length; j++) {
                        if (tmpResult.Price[j].kind == "FareSummary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                FareSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                            if (typeof tmpResult.Price[j].Round != 'undefined') {
                                FareRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                            }
                        } else if (tmpResult.Price[j].kind == "ChargeSummary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                ChargeSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                            if (typeof tmpResult.Price[j].Round != 'undefined') {
                                ChargeRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki1Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki1Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki3Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki3Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki6Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki6Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        }
                    }
                    // ���z�̃`�F�b�N
                    if (typeof minPriceSummary == 'undefined') {
                        minPriceSummary = FareSummary + ChargeSummary;
                    } else if (minPriceSummary > (FareSummary + ChargeSummary)) {
                        minPriceSummary = FareSummary + ChargeSummary;
                    }
                    // �������z�̃`�F�b�N
                    if (typeof minPriceRoundSummary == 'undefined') {
                        minPriceRoundSummary = FareRoundSummary + ChargeRoundSummary;
                    } else if (minPriceRoundSummary > (FareRoundSummary + ChargeRoundSummary)) {
                        minPriceRoundSummary = FareRoundSummary + ChargeRoundSummary;
                    }
                    // �����1
                    if (typeof Teiki1Summary != 'undefined') {
                        if (typeof minTeiki1Summary == 'undefined') {
                            minTeiki1Summary = Teiki1Summary;
                        } else if (minTeiki1Summary > Teiki1Summary) {
                            minTeiki1Summary = Teiki1Summary;
                        }
                    }
                    // �����3
                    if (typeof Teiki3Summary != 'undefined') {
                        if (typeof minTeiki3Summary == 'undefined') {
                            minTeiki3Summary = Teiki3Summary;
                        } else if (minTeiki3Summary > Teiki3Summary) {
                            minTeiki3Summary = Teiki3Summary;
                        }
                    }
                    // �����6
                    if (typeof Teiki6Summary != 'undefined') {
                        if (typeof minTeiki6Summary == 'undefined') {
                            minTeiki6Summary = Teiki6Summary;
                        } else if (minTeiki6Summary > Teiki6Summary) {
                            minTeiki6Summary = Teiki6Summary;
                        }
                    }
                    //����̍��v
                    if (typeof Teiki6Summary != 'undefined') {
                        if (typeof minTeikiSummary == 'undefined') {
                            minTeikiSummary = Teiki6Summary;
                        } else if (minTeikiSummary > Teiki6Summary) {
                            minTeikiSummary = Teiki6Summary;
                        }
                    } else if (typeof Teiki3Summary != 'undefined') {
                        if (typeof minTeikiSummary == 'undefined') {
                            minTeikiSummary = Teiki3Summary * 2;
                        } else if (minTeikiSummary > Teiki3Summary * 2) {
                            minTeikiSummary = Teiki3Summary * 2;
                        }
                    } else if (typeof Teiki1Summary != 'undefined') {
                        if (typeof minTeikiSummary == 'undefined') {
                            minTeikiSummary = Teiki1Summary * 6;
                        } else if (minTeikiSummary > Teiki1Summary * 6) {
                            minTeikiSummary = Teiki1Summary * 6;
                        }
                    }
                }
            }
        }
    }

    /*
    * �o�H�ꗗ�̕\���E��\���ݒ�
    */
    function changeCourseList() {
        viewCourseListFlag = (viewCourseListFlag ? false : true);
        // �o�H���o��
        viewResultList();
    }

    /*
    * �T�����ʂ̃^�u���o�͂��A�I������Ă���o�H���o��
    */
    function viewResultList() {
        // �o�H����������ꍇ�́A�^�u���o��
        if (resultCount > 1) {
            if (agent == 1 || agent == 3) {
                viewResultTab();
            } else if (agent == 2) {
                if (!viewCourseListFlag) {
                    viewResultTab();
                } else {
                    document.getElementById(baseId + ':result:header').innerHTML = '';
                    document.getElementById(baseId + ':result:header').style.display = "none";
                }
            }
        } else {
            document.getElementById(baseId + ':result:header').style.display = "none";
        }
        if (viewCourseListFlag) {
            // �o�H�ꗗ�̕\��
            var buffer = '';
            buffer += viewCourseList();
            document.getElementById(baseId + ':result:body').innerHTML = buffer;
            // �C�x���g�̐ݒ�(�T�����ʂ̃��X�g)
            if (!windowFlag) {
                for (var i = 0; i < 20; i++) {
                    addEvent(document.getElementById(baseId + ":list:" + String(i + 1)), "click", onEvent);
                }
            }
        } else {
            var buffer = '';
            // �o�H�o�͖{��
            var tmpResult;
            if (resultCount == 1) {
                // �T�����ʂ��P��
                tmpResult = result.ResultSet.Course;
            } else {
                // �T�����ʂ�����
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            // �T�����ʂ��܂Ƃ߂ďo��
            buffer += viewResultRoute(tmpResult, ((resultCount == 1) ? false : true));
            // �\��
            document.getElementById(baseId + ':result:body').innerHTML = buffer;
            // �o�H�̃C�x���g
            if (!windowFlag) {
                if (callBackObjectStation.length > 0) {
                    // �w���j���[
                    for (var i = 0; i < (tmpResult.Route.Point.length); i++) {
                        addEvent(document.getElementById(baseId + ":stationMenu:" + String(i + 1) + ":open"), "click", onEvent);
                        addEvent(document.getElementById(baseId + ":stationMenu:" + String(i + 1) + ":close"), "click", onEvent);
                        for (var j = 0; j < callBackObjectStation.length; j++) {
                            // �w�̃C�x���g��ݒ�
                            addEvent(document.getElementById(baseId + ":stationMenu:" + String(i + 1) + ":" + String(j + 1)), "click", onEvent);
                        }
                    }
                }
                if (callBackObjectLine.length > 0) {
                    // �H�����j���[
                    for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
                        addEvent(document.getElementById(baseId + ":lineMenu:" + String(i + 1) + ":open"), "click", onEvent);
                        addEvent(document.getElementById(baseId + ":lineMenu:" + String(i + 1) + ":close"), "click", onEvent);
                        // �R�[���o�b�N�֐�
                        for (var j = 0; j < callBackObjectLine.length; j++) {
                            // �H���̃C�x���g��ݒ�
                            addEvent(document.getElementById(baseId + ":lineMenu:" + String(i + 1) + ":" + String(j + 1)), "click", onEvent);
                        }
                    }
                }
                // �^�����j���[
                if (priceChangeFlag) {
                    for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
                        addEvent(document.getElementById(baseId + ":fareMenu:" + String(i + 1) + ":open"), "click", onEvent);
                        addEvent(document.getElementById(baseId + ":fareMenu:" + String(i + 1) + ":close"), "click", onEvent);
                        addEvent(document.getElementById(baseId + ":chargeMenu:" + String(i + 1) + ":open"), "click", onEvent);
                        addEvent(document.getElementById(baseId + ":chargeMenu:" + String(i + 1) + ":close"), "click", onEvent);
                        if (priceChangeRefreshFlag) {
                            // ����͍ēǂݍ��ݕK�{
                            addEvent(document.getElementById(baseId + ":teikiMenu:" + String(i + 1) + ":open"), "click", onEvent);
                            addEvent(document.getElementById(baseId + ":teikiMenu:" + String(i + 1) + ":close"), "click", onEvent);
                        }
                    }
                }
                // ���z�̃C�x���g
                if (agent == 1) {
                    if (priceChangeFlag) {
                        if (typeof tmpResult.Price != 'undefined') {
                            for (var i = 0; i < (tmpResult.Price.length); i++) {
                                if (tmpResult.Price[i].kind == "Fare") {
                                    // ��Ԍ��̃C�x���g
                                    addEvent(document.getElementById(baseId + ":fareMenu:" + String(tmpResult.Price[i].fromLineIndex) + ":" + String(tmpResult.Price[i].index)), "click", onEvent);
                                } else if (tmpResult.Price[i].kind == "Charge") {
                                    // ���}���̃C�x���g
                                    addEvent(document.getElementById(baseId + ":chargeMenu:" + String(tmpResult.Price[i].fromLineIndex) + ":" + String(tmpResult.Price[i].index)), "click", onEvent);
                                } else if (tmpResult.Price[i].kind == "Teiki1" && priceChangeRefreshFlag) {
                                    // ������̃C�x���g(�ēǂݍ��݃��[�h�̂�)
                                    if (typeof tmpResult.PassStatus != 'undefined') {
                                        for (var j = 0; j < (tmpResult.PassStatus.length); j++) {
                                            addEvent(document.getElementById(baseId + ":teikiMenu:" + String(tmpResult.Price[i].fromLineIndex) + ":" + String(j + 1)), "click", onEvent);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // �O��̃_�C��
                if (tmpResult.dataType == "onTimetable" && assignDiaFlag) {
                    addEvent(document.getElementById(baseId + ":prevDia"), "click", onEvent);
                    addEvent(document.getElementById(baseId + ":nextDia"), "click", onEvent);
                    // �t�b�^�[�p
                    addEvent(document.getElementById(baseId + ":prevDia2"), "click", onEvent);
                    addEvent(document.getElementById(baseId + ":nextDia2"), "click", onEvent);
                }
            }
            // ���z�̐؂�ւ�
            if (agent == 2 || agent == 3) {
                if (priceChangeFlag) {
                    for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
                        if (document.getElementById(baseId + ':fareSelect:' + (i + 1))) {
                            if (typeof document.getElementById(baseId + ':fareSelect:' + (i + 1)).selectedIndex != 'undefined') {
                                addEvent(document.getElementById(baseId + ':fareSelect:' + (i + 1)), "change", changePrice);
                            }
                        }
                        if (document.getElementById(baseId + ':chargeSelect:' + (i + 1))) {
                            if (typeof document.getElementById(baseId + ':chargeSelect:' + (i + 1)).selectedIndex != 'undefined') {
                                addEvent(document.getElementById(baseId + ':chargeSelect:' + (i + 1)), "change", changePrice);
                            }
                        }
                        if (priceChangeRefreshFlag) {
                            if (document.getElementById(baseId + ':teikiSelect:' + (i + 1))) {
                                if (typeof document.getElementById(baseId + ':teikiSelect:' + (i + 1)).selectedIndex != 'undefined') {
                                    addEvent(document.getElementById(baseId + ':teikiSelect:' + (i + 1)), "change", changePrice);
                                }
                            }
                        }
                    }
                }
            }
        }
        document.getElementById(baseId + ':result:body').style.display = "block";
        document.getElementById(baseId + ':result').style.display = "block";
    }

    /*
    * �T�����ʂ̃^�u���o��
    */
    function viewResultTab() {
        var buffer = '';
        buffer += '<div>';
        buffer += '<div class="exp_resultListButton">';
        if (viewCourseListFlag) {
            buffer += '<div class="exp_on">';
            if (agent == 1) {
                buffer += '<a id="' + baseId + ':tab:list" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':tab:list:text">���ʈꗗ</span></a>';
            } else if (agent == 2 || agent == 3) {
                buffer += '<a class="exp_link" id="' + baseId + ':tab:list" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':tab:list:text">���ʈꗗ</span></a>';
            }
            buffer += '</div>';
        } else {
            buffer += '<div class="exp_off">';
            if (agent == 1) {
                buffer += '<a id="' + baseId + ':tab:list" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':tab:list:text">���ʈꗗ</span></a>';
            } else if (agent == 2 || agent == 3) {
                buffer += '<a class="exp_link" id="' + baseId + ':tab:list" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':tab:list:text">���ʈꗗ</span></a>';
            }

            buffer += '</div>';
        }
        buffer += '</div>';
        if (agent == 1 || agent == 3) {
            buffer += '<ul class="exp_resultTab">';
            for (var n = 1; n <= resultCount; n++) {
                var buttonType = "";
                if (agent == 1) {
                    if (n == resultCount || n == 10) {
                        buttonType = "resultTabButtonRight";
                    }
                } else if (agent == 2 || agent == 3) {
                    if (n == 1) {
                        buttonType = "leftBtn";
                    } else if (n == resultCount) {
                        buttonType = "rightBtn";
                    }
                }
                if (selectNo == (n)) {
                    if (agent == 1) {
                        if (n == 11) {
                            // ���s
                            buffer += '<div class="exp_return"></div>';
                        }
                        buffer += '<li class="exp_resultTabButtonSelect' + (buttonType != "" ? " exp_" + buttonType : "") + '"><span class="exp_text">' + String(n) + '</span></li>';
                    } else if (agent == 2 || agent == 3) {
                        buffer += '<li class="exp_resultTabButtonSelect' + (buttonType != "" ? " exp_" + buttonType : "") + '"><span class="exp_text">' + String(n) + '</span></li>';
                    }
                } else {
                    if (agent == 1) {
                        if (n <= 10) {
                            buffer += '<li class="exp_resultTabButtonNoSelect' + (buttonType != "" ? " exp_" + buttonType : "") + '">';
                        } else {
                            if (n == 11) {
                                // ���s
                                buffer += '<div class="exp_return"></div>';
                            }
                            buffer += '<li class="exp_resultTabButtonNoSelect exp_low ' + (buttonType != "" ? " exp_" + buttonType : "") + '">';
                        }
                        buffer += '<a class="exp_link" id="' + baseId + ':tab:' + String(n) + '" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':tab:' + String(n) + ':text">' + String(n) + '</span></a>';
                        buffer += '</li>';
                    } else if (agent == 2 || agent == 3) {
                        buffer += '<li class="exp_resultTabButtonNoSelect' + (buttonType != "" ? " exp_" + buttonType : "") + '">';
                        buffer += '<a class="exp_link" id="' + baseId + ':tab:' + String(n) + '" href="Javascript:void(0);">' + String(n) + '</a>';
                        buffer += '</li>';
                    }
                }
            }
            buffer += '</ul>';
        } else if (agent == 2) {
            /*
            buffer += '<div class="exp_resultChangeButton">';
            buffer += '<div class="exp_button">';
            buffer += '<span class="exp_text" id="' + baseId + ':result:change:text">���̌o�H</span>';
            //�I��
            buffer += '<select class="exp_selectObj" id="' + baseId + ':resultSelect">';
            for (var n = 1; n <= resultCount; n++) {
            buffer += '<option value="' + String(n) + '"' + (n == selectNo ? " selected" : "") + '>' + String(n) + '</option>';
            }
            buffer += '</select>';
            buffer += '</div>';
            buffer += '</div>';
            */
        }
        buffer += '</div>';

        document.getElementById(baseId + ':result:header').innerHTML = buffer;
        document.getElementById(baseId + ':result:header').style.display = "block";

        // �o�H�ꗗ�̃C�x���g�ݒ�
        if (!windowFlag) {
            addEvent(document.getElementById(baseId + ":tab:list"), "click", onEvent);
            // �O��̃^�u
            addEvent(document.getElementById(baseId + ":tab:prev"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":tab:next"), "click", onEvent);
            // �o�H�ύX�{�^��
            addEvent(document.getElementById(baseId + ":resultSelect"), "change", onEvent);
            // �o�H�̃^�u
            for (var i = 0; i < resultCount; i++) {
                if (selectNo != (i + 1)) {
                    // �I�𒆂̃^�u�ȊO
                    addEvent(document.getElementById(baseId + ":tab:" + String(i + 1)), "click", onEvent);
                }
            }
        }
    }

    /*
    * �o�H�̏o�͕�������쐬
    */
    function viewCourseList() {
        var buffer = "";
        if (resultCount == 1) {
            // �T�����ʂ�1�̏ꍇ�̓��X�g�Ȃ�
            return "";
        } else {
            // ���X�g�̏o��
            buffer += '<div class="exp_resultList">';
            // �^�C�g��
            buffer += '<div class="exp_resultListTitle exp_clearfix">';
            // �o���n
            buffer += '<div class="exp_from">';
            if (typeof result.ResultSet.Course[0].Route.Point[0].Station != 'undefined') {
                buffer += result.ResultSet.Course[0].Route.Point[0].Station.Name;
            } else if (typeof result.ResultSet.Course[0].Route.Point[0].Name != 'undefined') {
                buffer += result.ResultSet.Course[0].Route.Point[0].Name;
            }
            buffer += '</div>';
            buffer += '<div class="exp_cursor"></div>';
            // �ړI�n
            buffer += '<div class="exp_to">';
            if (typeof result.ResultSet.Course[0].Route.Point[result.ResultSet.Course[0].Route.Point.length - 1].Station != 'undefined') {
                buffer += result.ResultSet.Course[0].Route.Point[result.ResultSet.Course[0].Route.Point.length - 1].Station.Name;
            } else if (typeof result.ResultSet.Course[0].Route.Point[result.ResultSet.Course[0].Route.Point.length - 1].Name != 'undefined') {
                buffer += result.ResultSet.Course[0].Route.Point[result.ResultSet.Course[0].Route.Point.length - 1].Name;
            }
            buffer += '</div>';
            var searchDate;
            if (typeof searchObj != 'undefined') {
                if (typeof searchObj.getDate() != 'undefined') {
                    searchDate = new Date(parseInt(searchObj.getDate().substring(0, 4), 10), parseInt(searchObj.getDate().substring(4, 6), 10) - 1, parseInt(searchObj.getDate().substring(6, 8), 10));
                    buffer += '<div class="exp_date">';
                    var week = new Array('��', '��', '��', '��', '��', '��', '�y');
                    buffer += String(searchDate.getFullYear()) + '�N' + String(searchDate.getMonth() + 1) + '��' + String(searchDate.getDate()) + '��';
                    buffer += '(' + week[searchDate.getDay()] + ')';
                    buffer += '</div>';
                }
            }
            buffer += '</div>';
            // �^�����薢�Ή�
            var salesTaxRateIsNotSupported = false;
            for (var i = 0; i < resultCount; i++) {
                if (typeof result.ResultSet.Course[i].Price != 'undefined') {
                    for (var j = 0; j < result.ResultSet.Course[i].Price.length; j++) {
                        if (typeof result.ResultSet.Course[i].Price[j].fareRevisionStatus != 'undefined') {
                            if (result.ResultSet.Course[i].Price[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                                    // �Г��E�����v�Z��
                                    if (result.ResultSet.Course[i].Price[j].kind == "Fare" || result.ResultSet.Course[i].Price[j].kind == "Charge") {
                                        // �^�����薢�Ή�
                                        salesTaxRateIsNotSupported = true;
                                    }
                                } else if (priceViewFlag == "teiki") {
                                    // ����v�Z��
                                    if (result.ResultSet.Course[i].Price[j].kind == "Teiki1" || result.ResultSet.Course[i].Price[j].kind == "Teiki3" || result.ResultSet.Course[i].Price[j].kind == "Teiki6") {
                                        // �^�����薢�Ή�
                                        salesTaxRateIsNotSupported = true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (salesTaxRateIsNotSupported) {
                buffer += '<div class="exp_fareRevisionStatus">';
                buffer += '�ԐF�̋��z�͏���ŗ��ύX�ɖ��Ή��ł�';
                buffer += '</div>';
            }
            // ���z���`�F�b�N
            for (var i = 0; i < resultCount; i++) {
                var tmpResult;
                tmpResult = result.ResultSet.Course[i];
                var time = parseInt(tmpResult.Route.timeOnBoard) + parseInt(tmpResult.Route.timeWalk) + parseInt(tmpResult.Route.timeOther);
                var TransferCount = parseInt(tmpResult.Route.transferCount);
                var FareSummary = 0;
                var FareRoundSummary = 0;
                var ChargeSummary = 0;
                var ChargeRoundSummary = 0;
                var Teiki1Summary = undefined;
                var Teiki3Summary = undefined;
                var Teiki6Summary = undefined;
                // �^�����薢�Ή�
                var FareSummarySalesTaxRateIsNotSupported = false;
                var ChargeSummarySalesTaxRateIsNotSupported = false;
                var Teiki1SummarySalesTaxRateIsNotSupported = false;
                var Teiki3SummarySalesTaxRateIsNotSupported = false;
                var Teiki6SummarySalesTaxRateIsNotSupported = false;
                // �����̌v�Z
                if (typeof tmpResult.Price != 'undefined') {
                    for (var j = 0; j < tmpResult.Price.length; j++) {
                        if (tmpResult.Price[j].kind == "FareSummary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                FareSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                            if (typeof tmpResult.Price[j].Round != 'undefined') {
                                FareRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                            }
                        } else if (tmpResult.Price[j].kind == "ChargeSummary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                ChargeSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                            if (typeof tmpResult.Price[j].Round != 'undefined') {
                                ChargeRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki1Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki1Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki3Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki3Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        } else if (tmpResult.Price[j].kind == "Teiki6Summary") {
                            if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                                Teiki6Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                            }
                        } else {
                            // �^�����薢�Ή��`�F�b�N
                            if (typeof tmpResult.Price[j].fareRevisionStatus != 'undefined') {
                                if (tmpResult.Price[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                    if (tmpResult.Price[j].kind == "Fare") {
                                        FareSummarySalesTaxRateIsNotSupported = true;
                                    } else if (tmpResult.Price[j].kind == "Charge") {
                                        ChargeSummarySalesTaxRateIsNotSupported = true;
                                    } else if (tmpResult.Price[j].kind == "Teiki1") {
                                        Teiki1SummarySalesTaxRateIsNotSupported = true;
                                    } else if (tmpResult.Price[j].kind == "Teiki3") {
                                        Teiki3SummarySalesTaxRateIsNotSupported = true;
                                    } else if (tmpResult.Price[j].kind == "Teiki6") {
                                        Teiki6SummarySalesTaxRateIsNotSupported = true;
                                    }
                                }
                            }
                        }
                    }
                }
                var salesTaxRateIsNotSupported = (FareSummarySalesTaxRateIsNotSupported || ChargeSummarySalesTaxRateIsNotSupported);
                // �T�����ʈꗗ
                buffer += '<a class="exp_link" id="' + baseId + ':list:' + String(i + 1) + '" href="Javascript:void(0);">';
                buffer += '<div class="exp_resultListRow exp_' + (i % 2 == 0 ? 'odd' : 'even') + ' exp_clearfix">';
                // ����NO
                buffer += '<div class="exp_no" id="' + baseId + ':list:' + String(i + 1) + ':no">';
                buffer += '<span class="exp_routeNo" id="' + baseId + ':list:' + String(i + 1) + ':no:text">' + String(i + 1) + '</span>';
                buffer += '</div>';

                // �T�����ʂ̏��
                buffer += '<div class="exp_summary">';

                // ��̒i
                buffer += '<div class="exp_upper" id="' + baseId + ':list:' + String(i + 1) + ':upper">';
                // �A�C�R��
                buffer += '<div class="exp_mark exp_clearfix" id="' + baseId + ':list:' + String(i + 1) + ':icon">';
                if (minTimeSummary == time) {
                    buffer += '<span class="exp_hayai" id="' + baseId + ':list:' + String(i + 1) + ':icon:hayai"></span>';
                }
                if (priceViewFlag == "oneway") {
                    if (minPriceSummary == (FareSummary + ChargeSummary)) {
                        buffer += '<span class="exp_yasui" id="' + baseId + ':list:' + String(i + 1) + ':icon:yasui"></span>';
                    }
                } else if (priceViewFlag == "round") {
                    if (minPriceRoundSummary == (FareRoundSummary + ChargeRoundSummary)) {
                        buffer += '<span class="exp_yasui" id="' + baseId + ':list:' + String(i + 1) + ':icon:yasui"></span>';
                    }
                } else if (priceViewFlag == "teiki") {
                    if (typeof Teiki6Summary != 'undefined') {
                        if (minTeikiSummary == Teiki6Summary) {
                            buffer += '<span class="exp_yasui" id="' + baseId + ':list:' + String(i + 1) + ':icon:yasui"></span>';
                        }
                    } else if (typeof Teiki3Summary != 'undefined') {
                        if (minTeikiSummary == Teiki3Summary * 2) {
                            buffer += '<span class="exp_yasui" id="' + baseId + ':list:' + String(i + 1) + ':icon:yasui"></span>';
                        }
                    } else if (typeof Teiki1Summary != 'undefined') {
                        if (minTeikiSummary == Teiki1Summary * 6) {
                            buffer += '<span class="exp_yasui" id="' + baseId + ':list:' + String(i + 1) + ':icon:yasui"></span>';
                        }
                    }
                }
                if (minTransferCount == TransferCount) {
                    buffer += '<span class="exp_raku" id="' + baseId + ':list:' + String(i + 1) + ':icon:raku"></span>';
                }
                buffer += '</div>';
                // �_�C���T���̂�
                if (tmpResult.dataType == "onTimetable") {
                    buffer += '<div class="exp_time exp_clearfix" id="' + baseId + ':list:' + String(i + 1) + ':time">';
                    // ��������
                    var DepartureTime, ArrivalTime;
                    if (typeof tmpResult.Route.Line.length == 'undefined') {
                        if (typeof tmpResult.Route.Line.DepartureState.Datetime.text != 'undefined') {
                            DepartureTime = convertISOtoDate(tmpResult.Route.Line.DepartureState.Datetime.text);
                        }
                        if (typeof tmpResult.Route.Line.ArrivalState.Datetime.text != 'undefined') {
                            ArrivalTime = convertISOtoDate(tmpResult.Route.Line.ArrivalState.Datetime.text);
                        }
                    } else {
                        if (typeof tmpResult.Route.Line[0].DepartureState.Datetime.text != 'undefined') {
                            DepartureTime = convertISOtoDate(tmpResult.Route.Line[0].DepartureState.Datetime.text);
                        }
                        if (typeof tmpResult.Route.Line[tmpResult.Route.Line.length - 1].ArrivalState.Datetime.text != 'undefined') {
                            ArrivalTime = convertISOtoDate(tmpResult.Route.Line[tmpResult.Route.Line.length - 1].ArrivalState.Datetime.text);
                        }
                    }
                    //buffer += '<span class="exp_departure">�o</span>';
                    buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':time:dep">' + String(DepartureTime.getHours()) + ':' + (DepartureTime.getMinutes() < 10 ? '0' : '') + String(DepartureTime.getMinutes()) + '</span>'; ;
                    buffer += '<span class="exp_cursor" id="' + baseId + ':list:' + String(i + 1) + ':time:cursur"></span>';
                    //buffer += '<span class="exp_arrival">��</span>';
                    buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':time:arr">' + String(ArrivalTime.getHours()) + ':' + (ArrivalTime.getMinutes() < 10 ? '0' : '') + String(ArrivalTime.getMinutes()) + '</span>';
                    buffer += '</div>';
                }
                buffer += '</div>';
                // ���̒i
                buffer += '<div class="exp_lower" id="' + baseId + ':list:' + String(i + 1) + ':lower">';
                if (agent == 1 || agent == 3) {
                    // ���v����
                    buffer += '<span class="exp_title" id="' + baseId + ':list:' + String(i + 1) + ':time">���v����</span>';
                    buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':time:text">' + String(time) + '��</span>';
                    // ��芷����
                    if (priceViewFlag == "teiki") {
                        buffer += '<span class="exp_title" id="' + baseId + ':list:' + String(i + 1) + ':trans">��芷��</span>';
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':trans:text">' + String(TransferCount) + '��</span>';
                    }
                    //�^��
                    if (priceViewFlag == "oneway") {
                        buffer += '<span class="exp_title" id="' + baseId + ':list:' + String(i + 1) + ':price">�Г����z</span>';
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">';
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                        buffer += num2String(FareSummary + ChargeSummary) + '�~';
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</span>';
                    } else if (priceViewFlag == "round") {
                        buffer += '<span class="exp_title" id="' + baseId + ':list:' + String(i + 1) + ':price">�������z</span>';
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">';
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:text2">' : '';
                        buffer += num2String(FareRoundSummary + ChargeRoundSummary) + '�~';
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</span>';
                    } else if (priceViewFlag == "teiki") {
                        // ������̕\��
                        buffer += '<span class="exp_titleTeiki1" id="' + baseId + ':list:' + String(i + 1) + ':price">�����1����</span>';
                        if (typeof Teiki1Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">';
                            buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:support">' : '';
                            buffer += num2String(Teiki1Summary) + '�~';
                            buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------�~</span>';
                        }
                        buffer += '<span class="exp_titleTeiki3">�����3����</span>';
                        if (typeof Teiki3Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">';
                            buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:support">' : '';
                            buffer += num2String(Teiki3Summary) + '�~';
                            buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------�~</span>';
                        }
                        buffer += '<span class="exp_titleTeiki6" id="' + baseId + ':list:' + String(i + 1) + ':price">�����6����</span>';
                        if (typeof Teiki6Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">';
                            buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:support">' : '';
                            buffer += num2String(Teiki6Summary) + '�~';
                            buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------�~</span>';
                        }
                    }
                    // ��芷����
                    if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                        buffer += '<span class="exp_title" id="' + baseId + ':list:' + String(i + 1) + ':trans">��芷��</span>';
                        if (TransferCount > 0) {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':trans:text">' + String(TransferCount) + '��</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':trans:text">�Ȃ�</span>';
                        }
                    }
                } else if (agent == 2) {
                    // ���v����
                    buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':time:text">' + String(time) + '��</span>';
                    //�^��
                    if (priceViewFlag == "oneway") {
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price">';
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                        buffer += '\\' + num2String(FareSummary + ChargeSummary);
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</span>';
                    } else if (priceViewFlag == "round") {
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price">';
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                        buffer += '\\' + num2String(FareRoundSummary + ChargeRoundSummary);
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</span>';
                    } else if (priceViewFlag == "teiki") {
                        // ������̕\��
                        if (typeof Teiki1Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price">';
                            buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:text">' : '';
                            buffer += '\\' + num2String(Teiki1Summary);
                            buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '(1����)</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------</span>';
                        }
                        if (typeof Teiki3Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price">';
                            buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:text">' : '';
                            buffer += '\\' + num2String(Teiki3Summary);
                            buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '(3����)</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------</span>';
                        }
                        if (typeof Teiki6Summary != 'undefined') {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price">';
                            buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':list:' + String(i + 1) + ':price:text">' : '';
                            buffer += '\\' + num2String(Teiki6Summary);
                            buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '</span>' : '';
                            buffer += '(6����)</span>';
                        } else {
                            buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':price:text">------</span>';
                        }
                    }
                    // ��芷����
                    if (TransferCount > 0) {
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':trans">�抷' + String(TransferCount) + '��</span>';
                    } else {
                        buffer += '<span class="exp_value" id="' + baseId + ':list:' + String(i + 1) + ':trans">�抷�Ȃ�</span>';
                    }
                }
                buffer += '</div>';
                buffer += '</div>';
                buffer += '</div>';
                buffer += '</a>';
            }
        }
        buffer += '</div>';
        return buffer;
    }

    /*
    * �C�x���g�̐U�蕪�����s��
    */
    function onEvent(e) {
        var eventIdList;
        if (typeof e == 'string') {
            eventIdList = e.split(":");
        } else {
            eventIdList = (e.srcElement) ? e.srcElement.id.split(":") : e.target.id.split(":");
        }
        if (eventIdList.length >= 2) {
            if (eventIdList[1] == "resultClose") {
                // �E�B���h�E�����
                document.getElementById(baseId + ':course').style.display = "none";
                if (typeof callBackFunctionBind['close'] == 'function') {
                    callBackFunctionBind['close'](true);
                }
            } else if (eventIdList[1] == "resultPopup") {
                // ��ʊO
                document.getElementById(baseId + ':course').style.display = "none";
                if (typeof callBackFunctionBind['close'] == 'function') {
                    callBackFunctionBind['close'](true);
                }
            } else if (eventIdList[1] == "courseSelect") {
                // �o�H�I��
                document.getElementById(baseId + ':course').style.display = "none";
                if (typeof callBackFunctionBind['select'] == 'function') {
                    callBackFunctionBind['select'](true);
                }
            } else if (eventIdList[1] == "tab" && eventIdList.length >= 3) {
                if (eventIdList[2] == "list") {
                    // �ꗗ�̕\��
                    changeCourseList();
                    if (typeof callBackFunctionBind['click'] == 'function') {
                        callBackFunctionBind['click'](true);
                    }
                } else {
                    // �o�H�̐؂�ւ�
                    changeCourse(parseInt(eventIdList[2]));
                }
            } else if (eventIdList[1] == "list" && eventIdList.length >= 3) {
                // �o�H�̐؂�ւ�
                changeCourse(parseInt(eventIdList[2]));
            } else if (eventIdList[1] == "resultSelect" && eventIdList.length >= 2) {
                // �o�H�̐؂�ւ�
                changeCourse(parseInt(document.getElementById(baseId + ':resultSelect').options.item(document.getElementById(baseId + ':resultSelect').selectedIndex).value));
            } else if (eventIdList[1] == "stationMenu" && eventIdList.length >= 4) {
                // �w���j���[
                if (eventIdList[3] == "open") {
                    if (document.getElementById(baseId + ':stationMenu:' + eventIdList[2]).style.display == "none") {
                        document.getElementById(baseId + ':stationMenu:' + eventIdList[2]).style.display = "block";
                    } else {
                        document.getElementById(baseId + ':stationMenu:' + eventIdList[2]).style.display = "none";
                    }
                } else if (eventIdList[3] == "close") {
                    document.getElementById(baseId + ':stationMenu:' + eventIdList[2]).style.display = "none";
                } else {
                    document.getElementById(baseId + ':stationMenu:' + eventIdList[2]).style.display = "none";
                    callBackObjectStation[parseInt(eventIdList[3]) - 1].callBack(parseInt(eventIdList[2]));
                }
            } else if (eventIdList[1] == "lineMenu" && eventIdList.length >= 4) {
                // �H�����j���[
                if (eventIdList[3] == "open") {
                    if (document.getElementById(baseId + ':lineMenu:' + eventIdList[2]).style.display == "none") {
                        document.getElementById(baseId + ':lineMenu:' + eventIdList[2]).style.display = "block";
                    } else {
                        document.getElementById(baseId + ':lineMenu:' + eventIdList[2]).style.display = "none";
                    }
                } else if (eventIdList[3] == "close") {
                    document.getElementById(baseId + ':lineMenu:' + eventIdList[2]).style.display = "none";
                } else {
                    document.getElementById(baseId + ':lineMenu:' + eventIdList[2]).style.display = "none";
                    callBackObjectLine[parseInt(eventIdList[3]) - 1].callBack(parseInt(eventIdList[2]));
                }
            } else if (eventIdList[1] == "fareMenu" && eventIdList.length >= 4) {
                // �^�����j���[
                if (eventIdList[3] == "open") {
                    if (document.getElementById(baseId + ':fareMenu:' + eventIdList[2]).style.display == "none") {
                        document.getElementById(baseId + ':fareMenu:' + eventIdList[2]).style.display = "block";
                    } else {
                        document.getElementById(baseId + ':fareMenu:' + eventIdList[2]).style.display = "none";
                    }
                } else if (eventIdList[3] == "close") {
                    document.getElementById(baseId + ':fareMenu:' + eventIdList[2]).style.display = "none";
                } else {
                    document.getElementById(baseId + ':fare:' + (eventIdList[2])).value = eventIdList[3];
                    changePrice();
                }
            } else if (eventIdList[1] == "chargeMenu" && eventIdList.length >= 4) {
                // ���}�����j���[
                if (eventIdList[3] == "open") {
                    if (document.getElementById(baseId + ':chargeMenu:' + eventIdList[2]).style.display == "none") {
                        document.getElementById(baseId + ':chargeMenu:' + eventIdList[2]).style.display = "block";
                    } else {
                        document.getElementById(baseId + ':chargeMenu:' + eventIdList[2]).style.display = "none";
                    }
                } else if (eventIdList[3] == "close") {
                    document.getElementById(baseId + ':chargeMenu:' + eventIdList[2]).style.display = "none";
                } else {
                    document.getElementById(baseId + ':charge:' + (eventIdList[2])).value = eventIdList[3];
                    changePrice();
                }
            } else if (eventIdList[1] == "teikiMenu" && eventIdList.length >= 4) {
                // ��������j���[
                if (eventIdList[3] == "open") {
                    if (document.getElementById(baseId + ':teikiMenu:' + eventIdList[2]).style.display == "none") {
                        document.getElementById(baseId + ':teikiMenu:' + eventIdList[2]).style.display = "block";
                    } else {
                        document.getElementById(baseId + ':teikiMenu:' + eventIdList[2]).style.display = "none";
                    }
                } else if (eventIdList[3] == "close") {
                    document.getElementById(baseId + ':teikiMenu:' + eventIdList[2]).style.display = "none";
                } else {
                    document.getElementById(baseId + ':teiki:' + (eventIdList[2])).value = eventIdList[3];
                    changePrice();
                }
            } else if ((eventIdList[1] == "prevDia" || eventIdList[1] == "prevDia2") && eventIdList.length >= 2) {
                assignDia("prev");
            } else if ((eventIdList[1] == "nextDia" || eventIdList[1] == "nextDia2") && eventIdList.length >= 2) {
                assignDia("next");
            }
        }
    }

    /*
    * ������+���\�L�ɕύX����
    */
    function fun2ji(num) {
        var hour = Math.floor(num / 60);
        var minute = num % 60;
        if (hour > 0) {
            if (minute == 0) {
                return hour + "����";
            } else {
                return hour + "����" + minute + "��";
            }
        } else {
            return minute + "��";
        }
    }

    /*
    * �w�̃}�[�N��ʂ��擾����
    */
    function getStationType(tmpStationType) {
        for (var i = 0; i < tmpStationType.length; i++) {
            if (tmpStationType[i] == "back") {
                return 3; // �߂�
            } else if (tmpStationType[i] == "extension" || tmpStationType[i] == "pass") {
                return 4; // ������E�ʉ�
            }
        }
        return 2; // �ʏ�
    }

    /*
    * �R�[�X�I�u�W�F�N�g���o�H�ɓW�J
    */
    function viewResultRoute(courseObj, noFlag) {
        var buffer = "";
        buffer += '<div class="exp_route">';
        // �T�}���[
        buffer += outSummary(courseObj, noFlag);
        // �O��̃_�C���ŒT��
        if (courseObj.dataType == "onTimetable" && assignDiaFlag) {
            buffer += '<div class="exp_routeHeader exp_clearfix">';
            if (agent == 1) {
                buffer += '<div class="exp_assignButton exp_left">';
                buffer += '<a id="' + baseId + ':prevDia" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':prevDia:text">�O�̃_�C��</span></a>';
                buffer += '</div>';
                buffer += '<div class="exp_assignButton exp_right">';
                buffer += '<a id="' + baseId + ':nextDia" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':nextDia:text">���̃_�C��</span></a>';
                buffer += '</div>';
            } else if (agent == 2 || agent == 3) {
                buffer += '<span class="exp_assign exp_left"><a class="exp_prev" id="' + baseId + ':prevDia" href="Javascript:void(0);">�O�̃_�C��</a></span>';
                buffer += '<span class="exp_assign exp_right"><a class="exp_next" id="' + baseId + ':nextDia" href="Javascript:void(0);">���̃_�C��</a></span>';
            }
            // �e�L�X�g
            var DepartureTime, ArrivalTime;
            if (typeof courseObj.Route.Line.length == 'undefined') {
                if (typeof courseObj.Route.Line.DepartureState.Datetime.text != 'undefined') {
                    DepartureTime = convertISOtoDate(courseObj.Route.Line.DepartureState.Datetime.text);
                }
                if (typeof courseObj.Route.Line.ArrivalState.Datetime.text != 'undefined') {
                    ArrivalTime = convertISOtoDate(courseObj.Route.Line.ArrivalState.Datetime.text);
                }
            } else {
                if (typeof courseObj.Route.Line[0].DepartureState.Datetime.text != 'undefined') {
                    DepartureTime = convertISOtoDate(courseObj.Route.Line[0].DepartureState.Datetime.text);
                }
                if (typeof courseObj.Route.Line[courseObj.Route.Line.length - 1].ArrivalState.Datetime.text != 'undefined') {
                    ArrivalTime = convertISOtoDate(courseObj.Route.Line[courseObj.Route.Line.length - 1].ArrivalState.Datetime.text);
                }
            }
            if (agent == 2) {
                buffer += '<div class="exp_headerText">' + String(DepartureTime.getHours()) + ':' + (DepartureTime.getMinutes() < 10 ? '0' : '') + String(DepartureTime.getMinutes()) + '��</div>';
            } else if (agent == 3) {
                buffer += '<div class="exp_headerText">' + String(DepartureTime.getHours()) + ':' + (DepartureTime.getMinutes() < 10 ? '0' : '') + String(DepartureTime.getMinutes()) + '���`' + String(ArrivalTime.getHours()) + ':' + (ArrivalTime.getMinutes() < 10 ? '0' : '') + String(ArrivalTime.getMinutes()) + '��' + '</div>';
            }
            buffer += '</div>';
        }

        // �܂��͔z����쐬
        var point = new Array();
        var line = new Array();
        for (var i = 0; i < courseObj.Route.Point.length; i++) {
            point.push(courseObj.Route.Point[i]);
        }
        if (typeof courseObj.Route.Line.length == 'undefined') {
            line.push(courseObj.Route.Line);
        } else {
            for (var i = 0; i < courseObj.Route.Line.length; i++) {
                line.push(courseObj.Route.Line[i]);
            }
        }
        // ���z�̔z��
        var fare = new Array();
        var charge = new Array();
        var teiki1 = new Array();
        var teiki3 = new Array();
        var teiki6 = new Array();
        var teiki = new Array();
        if (typeof courseObj.Price != 'undefined') {
            for (var i = 0; i < courseObj.Price.length; i++) {
                if (courseObj.Price[i].kind == "Fare") {
                    // ��Ԍ��̃��X�g�쐬
                    fare.push(courseObj.Price[i]);
                } else if (courseObj.Price[i].kind == "Charge") {
                    // ���}���̃��X�g�쐬
                    charge.push(courseObj.Price[i]);
                } else if (courseObj.Price[i].kind == "Teiki1") {
                    // ������̃��X�g�쐬
                    teiki1.push(courseObj.Price[i]);
                } else if (courseObj.Price[i].kind == "Teiki3") {
                    // ������̃��X�g�쐬
                    teiki3.push(courseObj.Price[i]);
                } else if (courseObj.Price[i].kind == "Teiki6") {
                    // ������̃��X�g�쐬
                    teiki6.push(courseObj.Price[i]);
                }
            }
        }
        // �����̒��
        if (typeof courseObj.PassStatus != 'undefined') {
            for (var i = 0; i < courseObj.PassStatus.length; i++) {
                teiki.push(courseObj.PassStatus[i]);
            }
        }
        // �o�H�{��
        buffer += '<div class="exp_detail exp_clearfix">';
        for (var i = 0; i < point.length; i++) {
            // ���z��Ԃ̏I��
            if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                // �^���̏I���
                for (var j = 0; j < fare.length; j++) {
                    if (parseInt(fare[j].toLineIndex) == i && fare[j].selected == "true") {
                        buffer += '</div>';
                        break;
                    }
                }
            } else if (priceViewFlag == "teiki") {
                // ������̏I���
                for (var j = 0; j < teiki1.length; j++) {
                    if (parseInt(teiki1[j].toLineIndex) == i && teiki1[j].selected == "true") {
                        buffer += '</div>';
                    }
                }
            }
            // �^���̏o��
            if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                // ��Ԍ�
                var fareList = new Array();
                for (var j = 0; j < fare.length; j++) {
                    // �ΏۂƂȂ��Ԍ����Z�b�g
                    if (parseInt(fare[j].fromLineIndex) == (i + 1)) {
                        fareList.push(fare[j]);
                    }
                }
                if (fareList.length > 0) {
                    // 1�����\��
                    for (var j = 0; j < fareList.length; j++) {
                        if (fareList[j].selected == "true") {
                            // �l���o��
                            if (fareList[j].Type == "WithTeiki") {
                                buffer += '<div class="exp_fareTeikiValue">';
                                //              buffer += '<div class="exp_cost">��������<div class="exp_top"></div></div>';
                                buffer += '<div class="exp_cost">��������</div>';
                                buffer += '</div>';
                            } else {
                                buffer += '<div class="exp_fareValue">';
                                buffer += '<div class="exp_cost">';
                                var fareName = "";
                                if (typeof fareList[j].Name != 'undefined') {
                                    fareName += fareList[j].Name + (agent == 2 ? "<br>" : "&nbsp;");
                                } else if (fareList.length >= 2) {
                                    fareName += "�w��Ȃ�" + (agent == 2 ? "<br>" : "&nbsp;");
                                } else {
                                    fareName += "��Ԍ�" + (agent == 2 ? "<br>" : "&nbsp;");
                                }
                                // �^�����薢�Ή�
                                var salesTaxRateIsNotSupported = false;
                                if (typeof fareList[j].fareRevisionStatus != 'undefined') {
                                    if (fareList[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                        salesTaxRateIsNotSupported = true;
                                    }
                                }
                                fareName += '<span class="' + (salesTaxRateIsNotSupported ? 'exp_taxRateIsNotSupportedLine' : 'exp_linePrice') + '" id="' + baseId + ':fareMenu:' + String(i + 1) + ':open:2">';
                                if (priceViewFlag == "oneway") {
                                    fareName += num2String(parseInt(getTextValue(fareList[j].Oneway))) + '�~';
                                } else if (priceViewFlag == "round") {
                                    fareName += num2String(parseInt(getTextValue(fareList[j].Round))) + '�~';
                                }
                                fareName += '</span>';
                                if (fareList.length >= 2) {
                                    if (agent == 1) {
                                        // �I�����Ă���l
                                        buffer += '<input type="hidden" id="' + baseId + ':fare:' + String(i + 1) + '" value="' + fareList[j].index + '">';
                                        // 2�ȏ゠��ꍇ�̓��j���[�̃����N��ݒu
                                        if (priceChangeFlag) {
                                            buffer += '<span class="exp_priceMenu"><a id="' + baseId + ':fareMenu:' + String(i + 1) + ':open" href="Javascript:void(0);">' + fareName + '��</a></span>';
                                        } else {
                                            buffer += fareName;
                                        }
                                    } else if (agent == 2 || agent == 3) {
                                        // �X�}�z�E�^�u���b�g�p
                                        buffer += '<div class="exp_fareSelect">';
                                        buffer += '<div class="exp_fareSelectText">';
                                        buffer += fareName + (priceChangeFlag ? "��" : "");
                                        buffer += '</div>';
                                        if (priceChangeFlag) {
                                            buffer += '<select id="' + baseId + ':fareSelect:' + fareList[j].fromLineIndex + '">';
                                            for (var k = 0; k < fareList.length; k++) {
                                                buffer += '<option value="' + fareList[k].index + '"' + ((fareList[k].selected == "true") ? "selected" : "") + '>';
                                                if (typeof fareList[k].Name != 'undefined') {
                                                    buffer += fareList[k].Name + ":";
                                                } else {
                                                    buffer += "�w��Ȃ�:";
                                                }
                                                if (priceViewFlag == "oneway") {
                                                    buffer += num2String(parseInt(getTextValue(fareList[k].Oneway))) + '�~';
                                                } else if (priceViewFlag == "round") {
                                                    buffer += num2String(parseInt(getTextValue(fareList[k].Round))) + '�~';
                                                }
                                                buffer += '</option>';
                                            }
                                            buffer += '</select>';
                                        }
                                        buffer += '</div>';
                                    }
                                } else {
                                    buffer += fareName;
                                }
                                //              buffer += '<div class="exp_top"></div>';
                                buffer += '</div>';
                                buffer += '</div>';
                            }
                            // ���j���[�{��
                            if (agent == 1 && fareList.length >= 2) {
                                buffer += '<div class="exp_menu exp_fareWindow" id="' + baseId + ':fareMenu:' + String(i + 1) + '" style="display:none;">';
                                buffer += '<div class="exp_header exp_clearfix">';
                                buffer += '<span class="exp_title">��Ԍ�</span>';
                                buffer += '<span class="exp_close">';
                                buffer += '<a class="exp_link" id="' + baseId + ':fareMenu:' + String(i + 1) + ':close" href="Javascript:void(0);">�~</a>';
                                buffer += '</span>';
                                buffer += '</div>';
                                buffer += '<div class="exp_body">';
                                buffer += '<div class="exp_list">';
                                // ���j���[
                                for (var k = 0; k < fareList.length; k++) {
                                    buffer += '<div class="exp_item' + (fareList[k].selected == "true" ? " exp_checked" : "") + ' exp_' + (k % 2 == 0 ? 'odd' : 'even') + '">';
                                    buffer += '<a href="Javascript:void(0);" id="' + baseId + ':fareMenu:' + String(i + 1) + ':' + String(fareList[k].index) + '">';
                                    // ���z
                                    buffer += '<span class="exp_costList" id="' + baseId + ':fareMenu:' + String(i + 1) + ':' + String(fareList[k].index) + ':cost">';
                                    if (priceViewFlag == "oneway") {
                                        buffer += num2String(parseInt(getTextValue(fareList[k].Oneway))) + '�~';
                                    } else if (priceViewFlag == "round") {
                                        buffer += num2String(parseInt(getTextValue(fareList[k].Round))) + '�~';
                                    }
                                    buffer += '</span>';
                                    buffer += ((typeof fareList[k].Name != 'undefined') ? fareList[k].Name : "�w��Ȃ�") + '&nbsp;</a></div>';
                                }
                                buffer += '</div>';
                                buffer += '</div>';
                                buffer += '</div>';
                            }
                        }
                    }
                }
            } else if (priceViewFlag == "teiki") {
                // ������̏o��
                var teiki1List = new Array();
                var teiki3List = new Array();
                var teiki6List = new Array();
                // �ΏۂƂȂ��������Z�b�g
                for (var j = 0; j < teiki1.length; j++) {
                    if (parseInt(teiki1[j].fromLineIndex) == (i + 1)) {
                        teiki1List.push(teiki1[j]);
                    }
                }
                for (var j = 0; j < teiki3.length; j++) {
                    if (parseInt(teiki3[j].fromLineIndex) == (i + 1)) {
                        teiki3List.push(teiki3[j]);
                    }
                }
                for (var j = 0; j < teiki6.length; j++) {
                    if (parseInt(teiki6[j].fromLineIndex) == (i + 1)) {
                        teiki6List.push(teiki6[j]);
                    }
                }
                if (teiki1List.length > 0 || teiki3List.length > 0 || teiki6List.length > 0) {
                    // 1�����\��
                    for (var j = 0; j < teiki1List.length; j++) {
                        // ����̃`�F�b�N
                        var teikiIndex = 0;
                        var teikiName = "";
                        var teikiKind = "";
                        for (var k = 0; k < teiki.length; k++) {
                            if (teiki[k].teiki1Index == teiki1List[j].index) {
                                // �I�����Ă���l
                                if (teiki[k].selected == "true") {
                                    teikiIndex = k + 1;
                                    teikiName = teiki[k].Name;
                                    teikiKind = teiki[k].kind;
                                }
                            }
                        }
                        // �l���o��
                        buffer += '<div class="exp_teikiValue">';
                        buffer += '<div class="exp_cost">';
                        buffer += '<div class="exp_name">';
                        if (agent == 1) {
                            if (teikiIndex == 0 || !priceChangeFlag || !priceChangeRefreshFlag) {
                                buffer += (teikiName != "" ? teikiName : "���");
                            } else {
                                // 2�ȏ゠��ꍇ�̓��j���[�̃����N��ݒu
                                buffer += '<span class="exp_priceMenu"><a id="' + baseId + ':teikiMenu:' + String(i + 1) + ':open" href="Javascript:void(0);">' + (teikiName != "" ? teikiName : "���") + '��</a></span>';
                            }
                        } else if (agent == 2 || agent == 3) {
                            if (teikiIndex == 0 || !priceChangeFlag || !priceChangeRefreshFlag) {
                                buffer += (teikiName != "" ? teikiName : "���");
                            } else {
                                // ����������������ꍇ�̃t�H�[���o��
                                buffer += '<div class="exp_teikiSelect">';
                                buffer += '<div class="exp_teikiSelectText">' + teikiName + '��</div>';
                                buffer += '<input type="hidden" id="' + baseId + ':teikiKind:' + String(i + 1) + '" value="' + teikiKind + '">';
                                buffer += '<select id="' + baseId + ':teikiSelect:' + String(i + 1) + '" value="' + String(teikiIndex) + '">';
                                for (var k = 0; k < teiki.length; k++) {
                                    if (teiki[k].teiki1Index == teiki1List[j].index) {
                                        buffer += '<option value="' + String(k + 1) + '"' + (teiki[k].selected == "true" ? " selected" : "") + '>';
                                        buffer += String(teiki[k].Name);
                                        buffer += '</option>';
                                    }
                                }
                                buffer += '</select>';
                                buffer += '</div>';
                            }
                        }
                        buffer += '</div>';
                        buffer += '<div class="exp_teiki1">' + (agent != 2 ? '1����' : '');
                        if (typeof teiki1List[j] != 'undefined') {
                            // �^�����薢�Ή�
                            var salesTaxRateIsNotSupported = false;
                            if (typeof teiki1List[j].fareRevisionStatus != 'undefined') {
                                if (teiki1List[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                    salesTaxRateIsNotSupported = true;
                                }
                            }
                            buffer += '<span class="' + (salesTaxRateIsNotSupported ? 'exp_taxRateIsNotSupportedLine' : 'exp_linePrice') + '">';
                            buffer += num2String(parseInt(getTextValue(teiki1List[j].Oneway))) + '�~';
                            buffer += '</span>';
                        } else {
                            buffer += '------�~';
                        }
                        buffer += '</div>';
                        buffer += '<div class="exp_teiki3">' + (agent != 2 ? '3����' : '');
                        if (typeof teiki3List[j] != 'undefined') {
                            // �^�����薢�Ή�
                            var salesTaxRateIsNotSupported = false;
                            if (typeof teiki3List[j].fareRevisionStatus != 'undefined') {
                                if (teiki3List[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                    salesTaxRateIsNotSupported = true;
                                }
                            }
                            buffer += '<span class="' + (salesTaxRateIsNotSupported ? 'exp_taxRateIsNotSupportedLine' : 'exp_linePrice') + '">';
                            buffer += num2String(parseInt(getTextValue(teiki3List[j].Oneway))) + '�~';
                            buffer += '</span>';
                        } else {
                            buffer += '------�~';
                        }
                        buffer += '</div>';
                        buffer += '<div class="exp_teiki6">' + (agent != 2 ? '6����' : '');
                        if (typeof teiki6List[j] != 'undefined') {
                            // �^�����薢�Ή�
                            var salesTaxRateIsNotSupported = false;
                            if (typeof teiki6List[j].fareRevisionStatus != 'undefined') {
                                if (teiki6List[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                    salesTaxRateIsNotSupported = true;
                                }
                            }
                            buffer += '<span class="' + (salesTaxRateIsNotSupported ? 'exp_taxRateIsNotSupportedLine' : 'exp_linePrice') + '">';
                            buffer += num2String(parseInt(getTextValue(teiki6List[j].Oneway))) + '�~';
                            buffer += '</span>';
                        } else {
                            buffer += '------�~';
                        }
                        buffer += '</div>';
                        //          buffer += '<div class="exp_top"></div>';
                        buffer += '</div>';
                        buffer += '</div>';
                        if (teikiIndex > 0) {
                            if (agent == 1) {
                                buffer += '<input type="hidden" id="' + baseId + ':teiki:' + String(i + 1) + '" value="' + String(teikiIndex) + '">';
                                // �^�C�v������
                                buffer += '<input type="hidden" id="' + baseId + ':teikiKind:' + String(i + 1) + '" value="' + teikiKind + '">';
                                // ���j���[�{��
                                buffer += '<div class="exp_menu exp_teikiWindow" id="' + baseId + ':teikiMenu:' + String(i + 1) + '" style="display:none;">';
                                buffer += '<div class="exp_header exp_clearfix">';
                                buffer += '<span class="exp_title">���</span>';
                                buffer += '<span class="exp_close">';
                                buffer += '<a class="exp_link" id="' + baseId + ':teikiMenu:' + String(i + 1) + ':close" href="Javascript:void(0);">�~</a>';
                                buffer += '</span>';
                                buffer += '</div>';
                                buffer += '<div class="exp_body">';
                                buffer += '<div class="exp_list">';
                                // ���j���[
                                var menuCount = 0;
                                for (var k = 0; k < teiki.length; k++) {
                                    if (teiki[k].teiki1Index == teiki1List[j].index) {
                                        buffer += '<div class="exp_item' + (teiki[k].selected == "true" ? " exp_checked" : "") + ' exp_' + (menuCount % 2 == 0 ? 'odd' : 'even') + '"><a href="Javascript:void(0);" id="' + baseId + ':teikiMenu:' + String(i + 1) + ':' + String(k + 1) + '">&nbsp;' + String(teiki[k].Name) + '&nbsp;</a></div>';
                                        menuCount++;
                                    }
                                }
                                buffer += '</div>';
                                buffer += '</div>';
                                buffer += '</div>';
                            }
                        }
                    }
                }
            }

            // �w�̏o��
            var stationType = "transfer";
            if (i == 0) {
                stationType = "start";
            } else if (i == point.length - 1) {
                stationType = "end";
            }
            buffer += outStation(i, point[i], line[i - 1], line[i], courseObj.dataType, stationType);
            // �^���̊J�n
            if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                if (fareList.length > 0) {
                    buffer += '<div class="exp_priceSection">';
                    buffer += '<div class="exp_priceData">';
                    if (fareList[0].Type == "WithTeiki") {
                        buffer += '<div class="exp_teiki">';
                    } else {
                        buffer += '<div class="exp_fare">';
                    }
                    buffer += '<div class="exp_bar"><div class="exp_base"><div class="exp_color"></div></div></div>';
                    //buffer += '<div class="exp_end"></div>';
                    buffer += '</div>';
                    buffer += '</div>';
                }
            } else if (priceViewFlag == "teiki") {
                if (teiki1List.length > 0 || teiki3List.length > 0 || teiki6List.length > 0) {
                    buffer += '<div class="exp_priceSection">';
                    buffer += '<div class="exp_priceData">';
                    buffer += '<div class="exp_teiki">';
                    buffer += '<div class="exp_bar"><div class="exp_base"><div class="exp_color"></div></div></div>';
                    //buffer += '<div class="exp_end"></div>';
                    buffer += '</div>';
                    buffer += '</div>';
                }
            }
            // �H���̏o��
            if (typeof line[i] != 'undefined') {
                var chargeList = new Array();
                // ���}���̐ݒ�
                if (priceViewFlag == "oneway" || priceViewFlag == "round") {
                    for (var j = 0; j < charge.length; j++) {
                        // �ΏۂƂȂ���}�����Z�b�g
                        if (parseInt(charge[j].fromLineIndex) == (i + 1)) {
                            chargeList.push(charge[j]);
                        }
                    }
                }
                // �o��
                buffer += outLine(i, line[i], chargeList);
            }
        }
        buffer += '</div>';

        // �t�b�^�[
        if (agent == 2 || agent == 3) {
            if (courseObj.dataType == "onTimetable" && assignDiaFlag) {
                buffer += '<div class="exp_routeHeader exp_clearfix">';
                buffer += '<span class="exp_assign exp_right"><a class="exp_next" id="' + baseId + ':nextDia2" href="Javascript:void(0);">���̃_�C��</a></span>';
                buffer += '<span class="exp_assign exp_left"><a class="exp_prev" id="' + baseId + ':prevDia2" href="Javascript:void(0);">�O�̃_�C��</a></span>';
                // �e�L�X�g
                var DepartureTime, ArrivalTime;
                if (typeof courseObj.Route.Line.length == 'undefined') {
                    if (typeof courseObj.Route.Line.DepartureState.Datetime.text != 'undefined') {
                        DepartureTime = convertISOtoDate(courseObj.Route.Line.DepartureState.Datetime.text);
                    }
                    if (typeof courseObj.Route.Line.ArrivalState.Datetime.text != 'undefined') {
                        ArrivalTime = convertISOtoDate(courseObj.Route.Line.ArrivalState.Datetime.text);
                    }
                } else {
                    if (typeof courseObj.Route.Line[0].DepartureState.Datetime.text != 'undefined') {
                        DepartureTime = convertISOtoDate(courseObj.Route.Line[0].DepartureState.Datetime.text);
                    }
                    if (typeof courseObj.Route.Line[courseObj.Route.Line.length - 1].ArrivalState.Datetime.text != 'undefined') {
                        ArrivalTime = convertISOtoDate(courseObj.Route.Line[courseObj.Route.Line.length - 1].ArrivalState.Datetime.text);
                    }
                }
                if (agent == 2) {
                    buffer += '<div class="exp_headerText">' + String(ArrivalTime.getHours()) + ':' + (ArrivalTime.getMinutes() < 10 ? '0' : '') + String(ArrivalTime.getMinutes()) + '��' + '</div>';
                } else if (agent == 3) {
                    buffer += '<div class="exp_headerText">' + String(DepartureTime.getHours()) + ':' + (DepartureTime.getMinutes() < 10 ? '0' : '') + String(DepartureTime.getMinutes()) + '���`' + String(ArrivalTime.getHours()) + ':' + (ArrivalTime.getMinutes() < 10 ? '0' : '') + String(ArrivalTime.getMinutes()) + '��' + '</div>';
                }
                buffer += '</div>';
            }
        }

        buffer += '</div>';
        return buffer;
    }

    /*
    * �T�}���[���o��
    */
    function outSummary(courseObj, noFlag) {
        var buffer = "";
        buffer += '<div class="exp_summary exp_clearfix">';
        buffer += '<div class="exp_row">';
        // �o�H�ԍ�
        buffer += '<span class="exp_titleRouteNo">�o�H' + ((noFlag) ? selectNo : "") + '</span>';
        // �o����
        var departureDate;
        var week = new Array('��', '��', '��', '��', '��', '��', '�y');
        if (typeof courseObj.Route.Line.length == 'undefined') {
            departureDate = convertISOtoDate(courseObj.Route.Line.DepartureState.Datetime.text);
        } else {
            departureDate = convertISOtoDate(courseObj.Route.Line[0].DepartureState.Datetime.text);
        }
        buffer += '<span class="exp_date">' + departureDate.getFullYear() + '�N' + (departureDate.getMonth() + 1) + '��' + departureDate.getDate() + '��' + '(' + week[departureDate.getDay()] + ')</span>';
        // �A�C�R��
        var time = parseInt(courseObj.Route.timeOnBoard) + parseInt(courseObj.Route.timeWalk) + parseInt(courseObj.Route.timeOther);
        var TransferCount = parseInt(courseObj.Route.transferCount);
        var FareSummary = 0;
        var FareRoundSummary = 0;
        var ChargeSummary;
        var ChargeRoundSummary;
        var Teiki1Summary;
        var Teiki3Summary;
        var Teiki6Summary;
        // �^�����薢�Ή�
        var FareSummarySalesTaxRateIsNotSupported = false;
        var ChargeSummarySalesTaxRateIsNotSupported = false;
        var Teiki1SummarySalesTaxRateIsNotSupported = false;
        var Teiki3SummarySalesTaxRateIsNotSupported = false;
        var Teiki6SummarySalesTaxRateIsNotSupported = false;
        if (typeof courseObj.Price != 'undefined') {
            for (var j = 0; j < courseObj.Price.length; j++) {
                if (courseObj.Price[j].kind == "FareSummary") {
                    if (typeof courseObj.Price[j].Oneway != 'undefined') {
                        FareSummary = parseInt(getTextValue(courseObj.Price[j].Oneway));
                    }
                    if (typeof courseObj.Price[j].Round != 'undefined') {
                        FareRoundSummary = parseInt(getTextValue(courseObj.Price[j].Round));
                    }
                } else if (courseObj.Price[j].kind == "ChargeSummary") {
                    if (typeof courseObj.Price[j].Oneway != 'undefined') {
                        ChargeSummary = parseInt(getTextValue(courseObj.Price[j].Oneway));
                    }
                    if (typeof courseObj.Price[j].Round != 'undefined') {
                        ChargeRoundSummary = parseInt(getTextValue(courseObj.Price[j].Round));
                    }
                } else if (courseObj.Price[j].kind == "Teiki1Summary") {
                    if (typeof courseObj.Price[j].Oneway != 'undefined') {
                        Teiki1Summary = parseInt(getTextValue(courseObj.Price[j].Oneway));
                    }
                } else if (courseObj.Price[j].kind == "Teiki3Summary") {
                    if (typeof courseObj.Price[j].Oneway != 'undefined') {
                        Teiki3Summary = parseInt(getTextValue(courseObj.Price[j].Oneway));
                    }
                } else if (courseObj.Price[j].kind == "Teiki6Summary") {
                    if (typeof courseObj.Price[j].Oneway != 'undefined') {
                        Teiki6Summary = parseInt(getTextValue(courseObj.Price[j].Oneway));
                    }
                } else {
                    if (typeof courseObj.Price[j].fareRevisionStatus != 'undefined') {
                        if (courseObj.Price[j].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                            if (courseObj.Price[j].kind == "Fare") {
                                FareSummarySalesTaxRateIsNotSupported = true;
                            } else if (courseObj.Price[j].kind == "Charge") {
                                ChargeSummarySalesTaxRateIsNotSupported = true;
                            } else if (courseObj.Price[j].kind == "Teiki1") {
                                Teiki1SummarySalesTaxRateIsNotSupported = true;
                            } else if (courseObj.Price[j].kind == "Teiki3") {
                                Teiki3SummarySalesTaxRateIsNotSupported = true;
                            } else if (courseObj.Price[j].kind == "Teiki6") {
                                Teiki6SummarySalesTaxRateIsNotSupported = true;
                            }
                        }
                    }
                }
            }
        }
        var salesTaxRateIsNotSupported = (FareSummarySalesTaxRateIsNotSupported || ChargeSummarySalesTaxRateIsNotSupported);
        // �A�C�R��
        buffer += '<div class="exp_mark exp_clearfix">';
        if (minTimeSummary == time) {
            buffer += '<span class="exp_hayai"></span>';
        }
        if (priceViewFlag == "oneway") {
            if (typeof ChargeSummary == 'undefined') {
                if (minPriceSummary == FareSummary) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            } else {
                if (minPriceSummary == (FareSummary + ChargeSummary)) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            }
        } else if (priceViewFlag == "round") {
            if (typeof ChargeRoundSummary == 'undefined') {
                if (minPriceRoundSummary == FareRoundSummary) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            } else {
                if (minPriceRoundSummary == (FareRoundSummary + ChargeRoundSummary)) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            }
        } else if (priceViewFlag == "teiki") {
            if (typeof Teiki6Summary != 'undefined') {
                if (minTeikiSummary == Teiki6Summary) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            } else if (typeof Teiki3Summary != 'undefined') {

                if (minTeikiSummary == Teiki3Summary * 2) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            } else if (typeof Teiki1Summary != 'undefined') {
                if (minTeikiSummary == Teiki1Summary * 6) {
                    buffer += '<span class="exp_yasui"></span>';
                }
            }
        }
        if (minTransferCount == TransferCount) {
            buffer += '<span class="exp_raku"></span>';
        }
        buffer += '</div>';
        buffer += '</div>';
        // �Z�p���[�^
        buffer += '<div class="exp_row exp_line">';
        buffer += '<span class="exp_title">���v����</span>';
        buffer += '<span class="exp_value">';
        buffer += fun2ji(parseInt(courseObj.Route.timeOnBoard) + parseInt(courseObj.Route.timeWalk) + parseInt(courseObj.Route.timeOther));
        if (agent == 1 || agent == 3) {
            var tmp_timeStr = "";
            var timeCount = 0;
            // �X�}�[�g�t�H���͔�\��
            if (typeof courseObj.Route.timeOnBoard != 'undefined') {
                if (parseInt(courseObj.Route.timeOnBoard) > 0) {
                    tmp_timeStr += '���&nbsp;' + parseInt(courseObj.Route.timeOnBoard) + '��';
                    timeCount++;
                }
            }
            if (typeof courseObj.Route.timeOther != 'undefined') {
                if (parseInt(courseObj.Route.timeOther) > 0) {
                    if (tmp_timeStr != "") { tmp_timeStr += "�A"; }
                    tmp_timeStr += '��&nbsp;' + parseInt(courseObj.Route.timeOther) + '��';
                    timeCount++;
                }
            }
            if (typeof courseObj.Route.timeWalk != 'undefined') {
                if (parseInt(courseObj.Route.timeWalk) > 0) {
                    if (tmp_timeStr != "") { tmp_timeStr += "�A"; }
                    tmp_timeStr += '�k��&nbsp;' + parseInt(courseObj.Route.timeWalk) + '��';
                    timeCount++;
                }
            }
            if (timeCount >= 2) {
                buffer += '<span class="exp_valueDetail">';
                buffer += "(" + tmp_timeStr + ")";
                buffer += '</span>';
            }
        }
        buffer += '</span>';
        buffer += '<span class="exp_title">����</span>';
        buffer += '<span class="exp_value">';
        if (parseInt(courseObj.Route.distance) >= 10) {
            buffer += (parseInt(courseObj.Route.distance) / 10) + "km";
        } else {
            buffer += parseInt(courseObj.Route.distance) * 100 + "m";
        }
        buffer += '</span>';
        if (priceViewFlag == "teiki") {
            buffer += '<span class="exp_title">��芷��</span>';
            buffer += '<span class="exp_value">';
            if (TransferCount > 0) {
                buffer += String(TransferCount) + '��';
            } else {
                buffer += '�Ȃ�';
            }
            buffer += '</span>';
        }
        buffer += '</div>';
        // ���s
        buffer += '<div class="exp_row">';
        if (priceViewFlag == "oneway") {
            buffer += '<span class="exp_title">�^��</span>';
            buffer += '<span class="exp_value">';
            if (typeof ChargeSummary == 'undefined') {
                buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(FareSummary) + '�~';
                buffer += salesTaxRateIsNotSupported ? '</span>' : '';
            } else {
                buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(FareSummary + ChargeSummary) + '�~';
                buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                if (agent == 1 || agent == 3) {
                    buffer += '<span class="exp_valueDetail">';
                    buffer += '(��Ԍ�&nbsp;' + num2String(FareSummary) + '�~&nbsp;����' + num2String(ChargeSummary) + '�~)';
                    buffer += '</span>';
                }
            }
            buffer += '</span>';
        } else if (priceViewFlag == "round") {
            buffer += '<span class="exp_title">�����^��</span>';
            buffer += '<span class="exp_value">';
            if (typeof ChargeSummary == 'undefined') {
                buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(FareRoundSummary) + '�~';
                buffer += salesTaxRateIsNotSupported ? '</span>' : '';
            } else {
                buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(FareRoundSummary + ChargeRoundSummary) + '�~';
                buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                if (agent == 1 || agent == 3) {
                    buffer += '<span class="exp_detail">';
                    buffer += '(��Ԍ�&nbsp;' + num2String(FareRoundSummary) + '�~&nbsp;����' + num2String(ChargeRoundSummary) + '�~)';
                    buffer += '</span>';
                }
            }
            buffer += '</span>';
        } else if (priceViewFlag == "teiki") {
            buffer += '<span class="exp_titleTeiki1">���1����</span>';
            buffer += '<span class="exp_value">';
            if (typeof Teiki1Summary != 'undefined') {
                buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(Teiki1Summary) + '�~';
                buffer += Teiki1SummarySalesTaxRateIsNotSupported ? '</span>' : '';
            } else {
                buffer += '------�~';
            }
            buffer += '</span>';
            buffer += '<span class="exp_titleTeiki3">���3����</span>';
            buffer += '<span class="exp_value">';
            if (typeof Teiki3Summary != 'undefined') {
                buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(Teiki3Summary) + '�~';
                buffer += Teiki3SummarySalesTaxRateIsNotSupported ? '</span>' : '';
            } else {
                buffer += '------�~';
            }
            buffer += '</span>';
            buffer += '<span class="exp_titleTeiki6">���6����</span>';
            buffer += '<span class="exp_value">';
            if (typeof Teiki6Summary != 'undefined') {
                buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                buffer += num2String(Teiki6Summary) + '�~';
                buffer += Teiki6SummarySalesTaxRateIsNotSupported ? '</span>' : '';
            } else {
                buffer += '------�~';
            }
            buffer += '</span>';
        }
        if (priceViewFlag == "oneway" || priceViewFlag == "round") {
            buffer += '<span class="exp_title">��芷��</span>';
            buffer += '<span class="exp_value">';
            if (TransferCount > 0) {
                buffer += String(TransferCount) + '��';
            } else {
                buffer += '�Ȃ�';
            }
            buffer += '</span>';
        }

        buffer += '</div>';
        buffer += '</div>';
        // �^�����薢�Ή�
        if (priceViewFlag == "oneway" || priceViewFlag == "round") {
            if (salesTaxRateIsNotSupported) {
                buffer += '<div class="exp_fareRevisionStatus exp_clearfix">';
                buffer += '�ԐF�̋��z�͏���ŗ��ύX�ɖ��Ή��ł�';
                buffer += '</div>';
            }
        } else if (priceViewFlag == "teiki") {
            if (Teiki1SummarySalesTaxRateIsNotSupported || Teiki3SummarySalesTaxRateIsNotSupported || Teiki6SummarySalesTaxRateIsNotSupported) {
                buffer += '<div class="exp_fareRevisionStatus exp_clearfix">';
                buffer += '�ԐF�̋��z�͏���ŗ��ύX�ɖ��Ή��ł�';
                buffer += '</div>';
            }
        }
        return buffer;
    }

    /*
    * �w���o��
    */
    function outStation(index, point, arrLine, depLine, dataType, stationType) {
        var buffer = "";
        // �w
        buffer += '<div class="exp_point exp_' + stationType + ' exp_clearfix">';
        // ��������
        var type = "";
        var ArrivalStateFlag = false;
        var ArrivalState;
        if (typeof arrLine != 'undefined') {
            if (typeof arrLine.Type != 'undefined') {
                // �^�C�v������
                type = getTextValue(arrLine.Type);
            }
            if (dataType == "onTimetable" && type != "walk") {
                // �k���ȊO�͏o��
                if (typeof arrLine.ArrivalState != 'undefined') {
                    if (typeof arrLine.ArrivalState.Datetime.text != 'undefined') {
                        ArrivalState = convertISOtoDate(arrLine.ArrivalState.Datetime.text);
                        ArrivalStateFlag = true;
                    }
                }
            }
        }
        // �o������
        var DepartureStateFlag = false;
        var DepartureState;
        if (typeof depLine != 'undefined') {
            if (typeof depLine.Type != 'undefined') {
                // �^�C�v������
                type = getTextValue(depLine.Type);
            }
            if (dataType == "onTimetable" && type != "walk") {
                // �k���ȊO�͏o��
                if (typeof depLine.DepartureState != 'undefined') {
                    if (typeof depLine.DepartureState.Datetime.text != 'undefined') {
                        DepartureState = convertISOtoDate(depLine.DepartureState.Datetime.text);
                        DepartureStateFlag = true;
                    }
                }
            }
        }
        // ��������
        if (ArrivalStateFlag && DepartureStateFlag) {
            buffer += '<div class="exp_time exp_both">';
        } else if (ArrivalStateFlag) {
            buffer += '<div class="exp_time exp_arrivalOnly">';
        } else if (DepartureStateFlag) {
            buffer += '<div class="exp_time exp_departureOnly">';
        } else if (dataType == "onTimetable") {
            buffer += '<div class="exp_time exp_noData">&nbsp;';
        } else {
            buffer += '<div>';
        }
        if (typeof ArrivalState != 'undefined') {
            buffer += '<div class="exp_arrival">' + convertDate2TimeString(ArrivalState, arrLine.TimeReliability) + '</div>';
        }
        if (typeof DepartureState != 'undefined') {
            buffer += '<div class="exp_departure">' + convertDate2TimeString(DepartureState, depLine.TimeReliability) + '</div>';
        }
        buffer += '</div>';
        // �w�A�C�R��
        if (dataType == "onTimetable") {
            buffer += '<div class="exp_stationIcon">';
        } else {
            buffer += '<div class="exp_stationIconPlain">';
        }
        // �w�̃}�[�N
        if (typeof arrLine == 'undefined' || typeof depLine == 'undefined') {
            buffer += '<div class="exp_edge"></div>';
        } else {
            var tmpStationType = new Array();
            if (typeof depLine.DepartureState.Type == 'string') {
                tmpStationType.push(depLine.DepartureState.Type);
            } else {
                for (var stType = 0; stType < depLine.DepartureState.Type.length; stType++) {
                    tmpStationType.push(depLine.DepartureState.Type[stType].text);
                }
            }
            stationType = getStationType(tmpStationType);
            // �w�̃}�[�N���o��
            if (stationType == 2) {
                buffer += '<div class="exp_none"></div>';
            } else if (stationType == 3) {
                buffer += '<div class="exp_back"></div>';
            } else if (stationType == 4) {
                buffer += '<div class="exp_extend"></div>';
            }
        }
        buffer += '</div>';
        // �w��
        buffer += '<div class="exp_station">';
        if (typeof point.Station != 'undefined') {
            buffer += point.Station.Name;
        } else if (typeof point.Name != 'undefined') {
            buffer += point.Name;
        }
        // ���j���[���X�g�쐬
        if (callBackObjectStation.length > 0) {
            buffer += '<span class="exp_stationMenu"><a id="' + baseId + ':stationMenu:' + String(index + 1) + ':open" href="Javascript:void(0);">&nbsp;&nbsp;</a></span>';
        }
        buffer += '</div>';
        buffer += '</div>';
        // ���j���[�{��
        if (callBackObjectStation.length > 0) {
            buffer += '<div class="exp_menu exp_stationWindow" id="' + baseId + ':stationMenu:' + String(index + 1) + '" style="display:none;">';
            buffer += '<div class="exp_header exp_clearfix">';
            buffer += '<span class="exp_title">�w���</span>';
            buffer += '<span class="exp_close">';
            buffer += '<a class="exp_link" id="' + baseId + ':stationMenu:' + String(index + 1) + ':close" href="Javascript:void(0);">�~</a>';
            buffer += '</span>';
            buffer += '</div>';
            buffer += '<div class="exp_body">';
            buffer += '<div class="exp_list">';
            // ���j���[
            for (var i = 0; i < callBackObjectStation.length; i++) {
                buffer += '<div class="exp_item exp_' + (i % 2 == 0 ? 'odd' : 'even') + '"><a href="Javascript:void(0);" id="' + baseId + ':stationMenu:' + String(index + 1) + ':' + String(i + 1) + '">&nbsp;' + String(callBackObjectStation[i].text) + '&nbsp;</a></div>';
            }
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        }
        return buffer;
    }

    /*
    * �H�����o��
    */
    function outLine(index, line, chargeList) {
        var buffer = "";
        var type;
        if (typeof line.Type != 'undefined') {
            // �^�C�v������
            type = getTextValue(line.Type);
        }
        // �H�����j���[�{��
        if (callBackObjectLine.length > 0) {
            buffer += '<div class="exp_menu exp_lineWindow" id="' + baseId + ':lineMenu:' + String(index + 1) + '" style="display:none;">';
            buffer += '<div class="exp_header exp_clearfix">';
            buffer += '<span class="exp_title">�H�����</span>';
            buffer += '<span class="exp_close">';
            buffer += '<a class="exp_link" id="' + baseId + ':lineMenu:' + String(index + 1) + ':close" href="Javascript:void(0);">�~</a>';
            buffer += '</span>';
            buffer += '</div>';
            buffer += '<div class="exp_body">';
            buffer += '<div class="exp_list">';
            // ���j���[
            for (var i = 0; i < callBackObjectLine.length; i++) {
                buffer += '<div class="exp_item exp_' + (i % 2 == 0 ? 'odd' : 'even') + '"><a href="Javascript:void(0);" id="' + baseId + ':lineMenu:' + String(index + 1) + ':' + String(i + 1) + '">&nbsp;' + String(callBackObjectLine[i].text) + '&nbsp;</a></div>';
            }
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        }

        // �H��
        if (chargeList.length > 0) {
            buffer += '<div class="exp_line exp_charge exp_clearfix">';
        } else {
            buffer += '<div class="exp_line exp_normal exp_clearfix">';
        }
        // �c�̐�
        buffer += '<div class="exp_bar">';
        buffer += '<div class="exp_base">';
        var R = Math.floor(parseInt(line.Color, 10) / 1000000).toString(16);
        var G = (Math.floor(parseInt(line.Color, 10) / 1000) % 1000).toString(16);
        var B = (parseInt(line.Color, 10) % 1000).toString(16);
        buffer += '<div class="exp_color" style="background-color:#' + (R.length == 1 ? '0' + R : R) + (G.length == 1 ? '0' + G : G) + (B.length == 1 ? '0' + B : B) + ';"></div>';
        buffer += '</div>';
        buffer += '</div>';

        if (agent == 1) {
            // PC�p�̏��\��
            buffer += '<div class="exp_data">';
            buffer += '<div class="exp_info">';
            buffer += '<div class="exp_cell">';
            if (parseInt(line.timeOnBoard) > 0) {
                buffer += '<div class="exp_timeOnBoard">' + line.timeOnBoard + '��</div>';
            }
            if (parseInt(line.stopStationCount) > 0) {
                buffer += '<div class="exp_stopStationCount">' + line.stopStationCount + '�w</div>';
            }
            if (parseInt(line.distance) > 0) {
                if (parseInt(line.distance) >= 10) {
                    buffer += '<div class="exp_distance">' + (parseInt(line.distance) / 10) + 'km</div>';
                } else {
                    buffer += '<div class="exp_distance">' + parseInt(line.distance) * 100 + 'm</div>';
                }
            }
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        } else if (agent == 2 || agent == 3) {
            // �X�}�z�E�^�u���b�g�p�̃A�C�R��
            buffer += '<div class="exp_iconArea">';
            buffer += '<div class="exp_iconCol">';
            buffer += '<div class="exp_iconCell">';
            if (parseInt(line.stopStationCount) > 0) {
                buffer += '<div class="exp_icon">';
            } else {
                buffer += '<div class="exp_icon exp_direct">';
            }
            if (type == "train") {
                buffer += '<span class="exp_train"></span>';
            } else if (type == "plane") {
                buffer += '<span class="exp_plane"></span>';
            } else if (type == "ship") {
                buffer += '<span class="exp_ship"></span>';
            } else if (type == "bus") {
                buffer += '<span class="exp_bus"></span>';
            } else if (type == "walk") {
                buffer += '<span class="exp_walk"></span>';
            }
            if (parseInt(line.stopStationCount) > 0) {
                buffer += '<div class="exp_stopStationCount">' + line.stopStationCount + '�w</div>';
            }
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
            buffer += '</div>';
        }

        // �H�����
        if (agent == 1) {
            if (typeof type == 'undefined') {
                buffer += '<div class="exp_rail exp_rail_normal">';
            } else if (type == "train") {
                buffer += '<div class="exp_rail exp_rail_normal exp_train">';
            } else if (type == "plane") {
                buffer += '<div class="exp_rail exp_rail_normal exp_plane">';
            } else if (type == "ship") {
                buffer += '<div class="exp_rail exp_rail_normal exp_ship">';
            } else if (type == "bus") {
                buffer += '<div class="exp_rail exp_rail_normal exp_bus">';
            } else if (type == "walk") {
                buffer += '<div class="exp_rail exp_rail_normal exp_walk">';
            } else {
                buffer += '<div class="exp_rail exp_rail_normal">';
            }
        } else if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_rail exp_rail_icon">';
        }
        // �Ԑ��\��
        if (typeof line.DepartureState.no != 'undefined') {
            buffer += '<div class="exp_no">[' + line.DepartureState.no + '�Ԑ�]</div>';
        } else {
            buffer += '<div class="exp_no">&nbsp;</div>';
        }
        // �H����
        var lineName = line.Name;
        // ��Ԕԍ��E�֖����o�͂��邩�ǂ���
        if (typeof line.Number != 'undefined') {
            if (type == "train") {
                lineName += '&nbsp;<span class="exp_trainNo">' + line.Number + '��</span>';
            } else if (type == "plane" || type == "ship") {
                lineName += '&nbsp;<span class="exp_trainNo">' + line.Number + '��</span>';
            } else {
                lineName += '&nbsp;<span class="exp_trainNo">' + line.Number + '</span>';
            }
        }
        buffer += '<div class="exp_name">';
        buffer += lineName;
        // ���j���[�����N
        if (callBackObjectLine.length > 0) {
            buffer += '<span class="exp_lineMenu"><a id="' + baseId + ':lineMenu:' + String(index + 1) + ':open" href="Javascript:void(0);">&nbsp;</a></span>';
        }
        buffer += '</div>';
        // ���s
        buffer += '<div class="exp_separator"></div>';
        // ���̑����
        if (agent == 2 || agent == 3) {
            buffer += '<div class="exp_etcInfo">';
            if (parseInt(line.timeOnBoard) > 0) {
                buffer += '<span class="exp_timeOnBoard">' + line.timeOnBoard + '��</span>';
            }
            if (parseInt(line.distance) > 0) {
                if (parseInt(line.distance) >= 10) {
                    buffer += '/' + '<span class="exp_distance">' + (parseInt(line.distance) / 10) + 'km</span>';
                } else {
                    buffer += '/' + '<span class="exp_distance">' + parseInt(line.distance) * 100 + 'm</span>';
                }
            }
            buffer += '</div>';
            buffer += '<div class="exp_separator"></div>';
        }
        // ���}���̏��
        if (chargeList.length > 0) {
            if (agent == 1) {
                for (var i = 0; i < chargeList.length; i++) {
                    if (chargeList[i].selected == "true") {
                        // 1�����\��
                        buffer += '<input type="hidden" id="' + baseId + ':charge:' + String(index + 1) + '" value="' + chargeList[i].index + '">';
                        buffer += '<div class="exp_chargeDetail">';
                        if (chargeList.length >= 2) {
                            // 2�ȏ゠��ꍇ�̓��j���[�̃����N��ݒu
                            buffer += '<a id="' + baseId + ':chargeMenu:' + String(index + 1) + ':open" href="Javascript:void(0);">';
                        }
                        buffer += '<div class="exp_chargeCost" id="' + baseId + ':chargeMenu:' + String(index + 1) + ':open:2">';
                        buffer += ((typeof chargeList[i].Name != 'undefined') ? chargeList[i].Name : "�w��Ȃ�") + ":";
                        // �^�����薢�Ή�
                        var salesTaxRateIsNotSupported = false;
                        if (typeof chargeList[i].fareRevisionStatus != 'undefined') {
                            if (chargeList[i].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                salesTaxRateIsNotSupported = true;
                            }
                        }
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported" id="' + baseId + ':chargeMenu:' + String(index + 1) + ':open:3">' : '';
                        if (priceViewFlag == "oneway") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Oneway))) + '�~';
                        } else if (priceViewFlag == "round") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Round))) + '�~';
                        }
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</div>';
                        if (chargeList.length >= 2) {
                            // ���j���[�����N�I��
                            buffer += '</a>';
                        }
                        buffer += '</div>';
                    }
                }
                // ���}�����X�g
                if (chargeList.length >= 2) {
                    // ���}�����j���[�{��
                    buffer += '<div class="exp_menu exp_chargeWindow" id="' + baseId + ':chargeMenu:' + String(index + 1) + '" style="display:none;">';
                    buffer += '<div class="exp_header exp_clearfix">';
                    buffer += '<span class="exp_title">���</span>';
                    buffer += '<span class="exp_close">';
                    buffer += '<a class="exp_link" id="' + baseId + ':chargeMenu:' + String(index + 1) + ':close" href="Javascript:void(0);">�~</a>';
                    buffer += '</span>';
                    buffer += '</div>';
                    buffer += '<div class="exp_body">';
                    buffer += '<div class="exp_list">';
                    // ���j���[
                    for (var k = 0; k < chargeList.length; k++) {
                        // �^�����薢�Ή�
                        var salesTaxRateIsNotSupported = false;
                        if (typeof chargeList[k].fareRevisionStatus != 'undefined') {
                            if (chargeList[k].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                salesTaxRateIsNotSupported = true;
                            }
                        }
                        buffer += '<div class="exp_item' + (chargeList[k].selected == "true" ? " exp_checked" : "") + ' exp_' + (k % 2 == 0 ? 'odd' : 'even') + '">';
                        buffer += '<a href="Javascript:void(0);" id="' + baseId + ':chargeMenu:' + String(index + 1) + ':' + String(chargeList[k].index) + '">';
                        // ���z
                        buffer += '<span class="exp_costList" id="' + baseId + ':chargeMenu:' + String(index + 1) + ':' + String(chargeList[k].index) + ':cost">';
                        buffer += '<span class="exp_cost">';
                        if (priceViewFlag == "oneway") {
                            buffer += num2String(parseInt(getTextValue(chargeList[k].Oneway))) + '�~';
                        } else if (priceViewFlag == "round") {
                            buffer += num2String(parseInt(getTextValue(chargeList[k].Round))) + '�~';
                        }
                        buffer += '</span>';
                        buffer += '</span>';
                        buffer += ((typeof chargeList[k].Name != 'undefined') ? chargeList[k].Name : "�w��Ȃ�") + '&nbsp;</a></div>';
                    }
                    buffer += '</div>';
                    buffer += '</div>';
                    buffer += '</div>';
                }
            } else if (agent == 2 || agent == 3) {
                // �^���������������ꍇ�̃t�H�[���o��
                buffer += '<div class="exp_chargeSelect">';
                for (var i = 0; i < chargeList.length; i++) {
                    if (chargeList[i].selected == "true") {
                        buffer += '<div class="exp_chargeSelectText">';
                        if (typeof chargeList[i].Name != 'undefined') {
                            buffer += chargeList[i].Name + ":";
                        } else {
                            buffer += "�w��Ȃ�:";
                        }
                        // �^�����薢�Ή�
                        var salesTaxRateIsNotSupported = false;
                        if (typeof chargeList[i].fareRevisionStatus != 'undefined') {
                            if (chargeList[i].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                salesTaxRateIsNotSupported = true;
                            }
                        }
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                        if (priceViewFlag == "oneway") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Oneway))) + '�~';
                        } else if (priceViewFlag == "round") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Round))) + '�~';
                        }
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</div>';
                    }
                }
                if (priceChangeFlag) {
                    buffer += '<select id="' + baseId + ':chargeSelect:' + chargeList[0].fromLineIndex + '">';
                    for (var i = 0; i < chargeList.length; i++) {
                        buffer += '<option value="' + chargeList[i].index + '"' + ((chargeList[i].selected == "true") ? "selected" : "") + '>';
                        if (typeof chargeList[i].Name != 'undefined') {
                            buffer += chargeList[i].Name + ":";
                        } else {
                            buffer += "�w��Ȃ�:";
                        }
                        var salesTaxRateIsNotSupported = false;
                        if (typeof chargeList[i].fareRevisionStatus != 'undefined') {
                            if (chargeList[i].fareRevisionStatus == 'salesTaxRateIsNotSupported') {
                                salesTaxRateIsNotSupported = true;
                            }
                        }
                        buffer += salesTaxRateIsNotSupported ? '<span class="exp_taxRateIsNotSupported">' : '';
                        if (priceViewFlag == "oneway") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Oneway))) + '�~';
                        } else if (priceViewFlag == "round") {
                            buffer += num2String(parseInt(getTextValue(chargeList[i].Round))) + '�~';
                        }
                        buffer += salesTaxRateIsNotSupported ? '</span>' : '';
                        buffer += '</option>';
                    }
                    buffer += '</select>';
                }
                buffer += '</div>';
            }
        }

        // �Ԑ��\��
        if (typeof line.ArrivalState.no != 'undefined') {
            buffer += '<div class="exp_no">[' + line.ArrivalState.no + '�Ԑ�]</div>';
        } else {
            if (agent == 2 || agent == 3) {
                buffer += '<div class="exp_no">&nbsp;</div>';
            }
        }
        buffer += '</div>';
        buffer += '</div>';
        return buffer;
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
    * ISO�̓����𕶎���ɕϊ�
    */
    function convertISOtoTime(str, type) {
        if (typeof str != 'undefined') {
            var tmp_time = str.split(":");
            var hour = parseInt(tmp_time[0], 10);
            if (typeof type != 'undefined') {
                if (type == "yesterday") { hour += 24; }
            }
            return String(hour) + ":" + tmp_time[1];
        } else {
            return;
        }
    }

    /*
    * �H���̔��������𔻒肵�A�o��
    */
    function convertDate2TimeString(date, type) {
        if (typeof type != 'undefined') {
            var time;
            if (date.getMinutes() >= 10) {
                time = date.getHours() + ":" + date.getMinutes();
            } else {
                time = date.getHours() + ":0" + date.getMinutes();
            }
            if (type == 'onTimetable') {
                return '<span class="exp_onTimetable">' + time + '</span>';
            } else if (type == 'interval') {
                return '<span class="exp_interval">[' + time + ']</span>';
            } else if (type == 'outside') {
                return '<span class="exp_outside">&lt;' + time + '&gt;</span>';
            } else if (type == 'average') {
                return '<span class="exp_average">(' + time + ')</span>';
            }
        } else {
            return "";
        }
    }

    /*
    * �J���}��؂�̐��l���o��
    */
    function num2String(str) {
        var num = new String(str).replace(/,/g, "");
        while (num != (num = num.replace(/^(-?\d+)(\d{3})/, "$1,$2")));
        return num;
    }

    /*
    * �����ύX���̏���
    */
    function changePrice() {
        // �T�����ʃI�u�W�F�N�g�̓���
        var tmpResult;
        if (resultCount == 1) {
            tmpResult = result.ResultSet.Course;
        } else {
            tmpResult = result.ResultSet.Course[(selectNo - 1)];
        }
        // �ύX�ΏۂƂȂ��������̃��X�g�쐬
        var fareList = new Array();
        var chargeList = new Array();
        var vehicleTeikiList = new Array();
        var nikukanTeikiList = new Array();
        for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
            // ��Ԍ��̃��X�g�쐬
            if (document.getElementById(baseId + ':fareSelect:' + (i + 1))) {
                fareList.push(parseInt(document.getElementById(baseId + ':fareSelect:' + (i + 1)).options.item(document.getElementById(baseId + ':fareSelect:' + (i + 1)).selectedIndex).value));
            } else if (document.getElementById(baseId + ':fare:' + (i + 1))) {
                fareList.push(parseInt(document.getElementById(baseId + ':fare:' + (i + 1)).value));
            }
            // ���}���̃��X�g�쐬
            if (document.getElementById(baseId + ':chargeSelect:' + (i + 1))) {
                chargeList.push(parseInt(document.getElementById(baseId + ':chargeSelect:' + (i + 1)).options.item(document.getElementById(baseId + ':chargeSelect:' + (i + 1)).selectedIndex).value));
            } else if (document.getElementById(baseId + ':charge:' + (i + 1))) {
                chargeList.push(parseInt(document.getElementById(baseId + ':charge:' + (i + 1)).value));
            }
            // ����̑I�����X�g�쐬
            if (document.getElementById(baseId + ':teikiSelect:' + (i + 1))) {
                if (document.getElementById(baseId + ':teikiKind:' + (i + 1)).value == "vehicle") {
                    // �ԗ��I��
                    vehicleTeikiList.push(parseInt(document.getElementById(baseId + ':teikiSelect:' + (i + 1)).options.item(document.getElementById(baseId + ':teikiSelect:' + (i + 1)).selectedIndex).value));
                } else if (document.getElementById(baseId + ':teikiKind:' + (i + 1)).value == "nikukanteiki") {
                    // ���Ԓ��
                    nikukanTeikiList.push(parseInt(document.getElementById(baseId + ':teikiSelect:' + (i + 1)).options.item(document.getElementById(baseId + ':teikiSelect:' + (i + 1)).selectedIndex).value));
                }
            } else if (document.getElementById(baseId + ':teiki:' + (i + 1))) {
                if (document.getElementById(baseId + ':teikiKind:' + (i + 1)).value == "vehicle") {
                    // �ԗ��I��
                    vehicleTeikiList.push(parseInt(document.getElementById(baseId + ':teiki:' + (i + 1)).value));
                } else if (document.getElementById(baseId + ':teikiKind:' + (i + 1)).value == "nikukanteiki") {
                    // ���Ԓ��
                    nikukanTeikiList.push(parseInt(document.getElementById(baseId + ':teiki:' + (i + 1)).value));
                }
            }
        }
        // �ĒT�����s�Ȃ��ĉ^�����v�Z����
        if (priceChangeRefreshFlag) {
            var searchWord = "";
            searchWord += "serializeData=" + tmpResult.SerializeData;
            if (fareList.length >= 1) {
                searchWord += "&fareIndex=" + fareList.join(":");
            }
            if (chargeList.length >= 1) {
                searchWord += "&chargeIndex=" + chargeList.join(":");
            }
            if (vehicleTeikiList.length >= 1) {
                searchWord += "&vehicleIndex=" + vehicleTeikiList.join(":");
            }
            if (nikukanTeikiList.length >= 1) {
                searchWord += "&nikukanteikiIndex=" + nikukanTeikiList.join(":");
            }
            searchWord += "&addRouteData=true";
            var url = apiURL + "v1/json/course/recalculate?key=" + key + "&" + searchWord;
            reSearch(url, selectNo);
        } else {
            // �t�H�[������͂��ĉ^�����Čv�Z����
            var fare = 0;
            var fareRound = 0;
            var charge = 0;
            var chargeRound = 0;
            for (var i = 0; i < tmpResult.Price.length; i++) {
                if (tmpResult.Price[i].kind == "Fare") {
                    // ��Ԍ��̉^���Čv�Z
                    if (checkArray(fareList, parseInt(tmpResult.Price[i].index)) != -1) {
                        // �T�����ʃI�u�W�F�N�g�̑I����ς���
                        tmpResult.Price[i].selected = "true";
                        // �I�����Ă��Ȃ������̓I�t�ɂ���
                        for (var j = 0; j < tmpResult.Price.length; j++) {
                            if (tmpResult.Price[i].index != tmpResult.Price[j].index && tmpResult.Price[i].kind == tmpResult.Price[j].kind && tmpResult.Price[i].fromLineIndex == tmpResult.Price[j].fromLineIndex) {
                                tmpResult.Price[j].selected = "false";
                            }
                        }
                    }
                } else if (tmpResult.Price[i].kind == "Charge") {
                    // ���}���̉^���Čv�Z
                    if (checkArray(chargeList, parseInt(tmpResult.Price[i].index)) != -1) {
                        // �T�����ʃI�u�W�F�N�g�̑I����ς���
                        tmpResult.Price[i].selected = "true";
                        // �I�����Ă��Ȃ������̓I�t�ɂ���
                        for (var j = 0; j < tmpResult.Price.length; j++) {
                            if (tmpResult.Price[i].index != tmpResult.Price[j].index && tmpResult.Price[i].kind == tmpResult.Price[j].kind && tmpResult.Price[i].fromLineIndex == tmpResult.Price[j].fromLineIndex) {
                                tmpResult.Price[j].selected = "false";
                            }
                        }
                    }
                }
            }
            // ���v���z�̎Z�o
            for (var i = 0; i < tmpResult.Price.length; i++) {
                if (tmpResult.Price[i].kind == "Fare" && tmpResult.Price[i].selected == "true") {
                    // �Г��^���̍Čv�Z
                    fare += parseInt(getTextValue(tmpResult.Price[i].Oneway));
                    // �����^���̍Čv�Z
                    fareRound += parseInt(getTextValue(tmpResult.Price[i].Round));
                } else if (tmpResult.Price[i].kind == "Charge" && tmpResult.Price[i].selected == "true") {
                    // �Г��^���̍Čv�Z
                    charge += parseInt(getTextValue(tmpResult.Price[i].Oneway));
                    // �����^���̍Čv�Z
                    chargeRound += parseInt(getTextValue(tmpResult.Price[i].Round));
                }
            }
            // ���v���z�̕ύX
            for (var i = 0; i < tmpResult.Price.length; i++) {
                if (tmpResult.Price[i].kind == "FareSummary") {
                    // ��Ԍ��̉^���Čv�Z
                    tmpResult.Price[i].Oneway = String(fare);
                    tmpResult.Price[i].Round = String(fareRound);
                } else if (tmpResult.Price[i].kind == "ChargeSummary") {
                    // ���}���̉^���Čv�Z
                    tmpResult.Price[i].Oneway = String(charge);
                    tmpResult.Price[i].Round = String(chargeRound);
                }
            }
            changeCourse(selectNo);
        }
    }

    /*
    * �^���ύX���̍ŒZ�쏈��
    */
    function reSearch(url, no) {
        if (typeof resultObj != 'undefined') {
            resultObj.abort();
        }
        var JSON_object = {};
        if (window.XDomainRequest) {
            // IE�p
            resultObj = new XDomainRequest();
            resultObj.onload = function () {
                setResultSingle(resultObj.responseText, no);
            };
        } else {
            resultObj = new XMLHttpRequest();
            resultObj.onreadystatechange = function () {
                var done = 4, ok = 200;
                if (resultObj.readyState == done && resultObj.status == ok) {
                    setResultSingle(resultObj.responseText, no);
                }
            };
        }
        resultObj.open("GET", url, true);
        resultObj.send(null);
    }

    /*
    * �T�����ʃI�u�W�F�N�g����1�o�H��������ւ�
    */
    function setResultSingle(resultObject, no) {
        tmpResult = JSON.parse(resultObject);
        if (resultCount == 1) {
            result.ResultSet.Course = tmpResult.ResultSet.Course;
        } else {
            result.ResultSet.Course[(no - 1)] = tmpResult.ResultSet.Course;
        }
        // �T�����ʂ̐؂�ւ�
        changeCourse(no);
    }

    /*
    * �\�����Ă���T�����ʂ̃V���A���C�Y�f�[�^���擾
    */
    function getSerializeData() {
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            return tmpResult.SerializeData;
        } else {
            return;
        }
    }

    /*
    * �\�����Ă���T�����ʂ��ׂĂ̂̃V���A���C�Y�f�[�^���擾
    */
    function getSerializeDataAll() {
        var tmpSerializeList = new Array();
        if (typeof result != 'undefined') {
            if (resultCount == 1) {
                tmpSerializeList.push(result.ResultSet.Course.SerializeData);
            } else {
                for (var i = 0; i < resultCount; i++) {
                    tmpSerializeList.push(result.ResultSet.Course[i].SerializeData);
                }
            }
            return tmpSerializeList;
        } else {
            return tmpSerializeList;
        }
    }

    /*
    * �\�����Ă���T�����ʂ̒���T���̂��߂̕�������擾
    */
    function getTeiki() {
        if (typeof result == 'undefined') {
            return;
        }
        var tmpResult;
        if (resultCount == 1) {
            tmpResult = result.ResultSet.Course;
        } else {
            tmpResult = result.ResultSet.Course[(selectNo - 1)];
        }
        // ���O�`�F�b�N
        var Teiki1Summary;
        var Teiki3Summary;
        var Teiki6Summary;
        if (typeof tmpResult.Price != 'undefined') {
            for (var j = 0; j < tmpResult.Price.length; j++) {
                if (tmpResult.Price[j].kind == "Teiki1Summary") {
                    if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                        Teiki1Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                    }
                } else if (tmpResult.Price[j].kind == "Teiki3Summary") {
                    if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                        Teiki3Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                    }
                } else if (tmpResult.Price[j].kind == "Teiki6Summary") {
                    if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                        Teiki6Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                    }
                }
            }
        }
        if (typeof Teiki1Summary == 'undefined' && typeof Teiki3Summary == 'undefined' && typeof Teiki6Summary == 'undefined') {
            return;
        }
        if (typeof tmpResult.Route.Line.length == 'undefined') {
            if (tmpResult.Route.Line.Type != "train" && tmpResult.Route.Line.Type != "walk") {
                return;
            }
        } else {
            for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
                if (tmpResult.Route.Line[i].Type != "train" && tmpResult.Route.Line[i].Type != "walk") {
                    return;
                }
            }
        }
        if (tmpResult.dataType == "plain") {
            var buffer = "";
            if (typeof tmpResult.Route.Line.length == 'undefined') {
                if (typeof tmpResult.Route.Point[0].Station != 'undefined') {
                    buffer += tmpResult.Route.Point[0].Station.Name;
                } else if (typeof tmpResult.Route.Point[0].Name != 'undefined') {
                    buffer += tmpResult.Route.Point[0].Name;
                }
                buffer += ":" + tmpResult.Route.Line.Name + ":" + tmpResult.Route.Line.direction + ":";
                if (typeof tmpResult.Route.Point[1].Station != 'undefined') {
                    buffer += tmpResult.Route.Point[1].Station.Name;
                } else if (typeof tmpResult.Route.Point[1].Name != 'undefined') {
                    buffer += tmpResult.Route.Point[1].Name;
                }
            } else {
                for (var i = 0; i < (tmpResult.Route.Point.length - 1); i++) {
                    if (typeof tmpResult.Route.Point[i].Station != 'undefined') {
                        buffer += tmpResult.Route.Point[i].Station.Name;
                    } else if (typeof tmpResult.Route.Point[i].Name != 'undefined') {
                        buffer += tmpResult.Route.Point[i].Name;
                    }
                    buffer += ":" + tmpResult.Route.Line[i].Name + ":" + tmpResult.Route.Line[i].direction + ":";
                }
                if (typeof tmpResult.Route.Point[tmpResult.Route.Point.length - 1].Station != 'undefined') {
                    buffer += tmpResult.Route.Point[tmpResult.Route.Point.length - 1].Station.Name;
                } else if (typeof tmpResult.Route.Point[tmpResult.Route.Point.length - 1].Name != 'undefined') {
                    buffer += tmpResult.Route.Point[tmpResult.Route.Point.length - 1].Name;
                }
            }
            return buffer;
        } else {
            return;
        }
    }

    /*
    * ���Ԓ���̍T���p�C���f�b�N�X���X�g�̎擾
    */
    function getNikukanteikiIndex() {
        if (typeof result == 'undefined') {
            return;
        }
        var tmpResult;
        if (resultCount == 1) {
            tmpResult = result.ResultSet.Course;
        } else {
            tmpResult = result.ResultSet.Course[(selectNo - 1)];
        }
        if (typeof tmpResult.PassStatus != 'undefined') {
            var buffer = "";
            if (typeof tmpResult.PassStatus.length == 'undefined') {
                if (tmpResult.PassStatus.selected == "true") {
                    buffer += '1';
                }
            } else {
                for (var i = 0; i < tmpResult.PassStatus.length; i++) {
                    if (tmpResult.PassStatus[i].selected == "true") {
                        if (buffer != "") { buffer += ':'; }
                        buffer += String(i + 1);
                    }
                }
            }
            return buffer;
        } else {
            return;
        }
    }

    /*
    * �T�����ʂ��ׂĂ̌o�H�I�u�W�F�N�g���擾
    */
    function getResultAll() {
        if (typeof result != 'undefined') {
            return JSON.parse(JSON.stringify(result));
        } else {
            return;
        }
    }

    /*
    * �\�����Ă���o�H�I�u�W�F�N�g���擾
    */
    function getResult() {
        if (viewCourseListFlag) {
            // �ꗗ�\�����͕Ԃ��Ȃ�
            return;
        } else if (typeof result != 'undefined') {
            if (resultCount == 1) {
                return JSON.parse(JSON.stringify(result));
            } else {
                // �T�����ʂ���ɂ���
                var tmpResult = JSON.parse(JSON.stringify(result));
                tmpResult.ResultSet.Course = tmpResult.ResultSet.Course[(selectNo - 1)];
                return JSON.parse(JSON.stringify(tmpResult));
            }
        } else {
            return;
        }
    }

    /*
    * �T�����ʂ��ׂĂ̌o�H�I�u�W�F�N�g��JSON�ɕϊ����Ď擾
    */
    function getResultStringAll() {
        if (typeof result != 'undefined') {
            return JSON.stringify(result);
        } else {
            return;
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
    * �\�����Ă���o�H�I�u�W�F�N�g��JSON�ɕϊ����Ď擾
    */
    function getResultString() {
        if (viewCourseListFlag) {
            // �ꗗ�\�����͕Ԃ��Ȃ�
            return;
        } else if (typeof result != 'undefined') {
            if (resultCount == 1) {
                return JSON.stringify(result);
            } else {
                // �T�����ʂ���ɂ���
                var tmpResult = JSON.parse(JSON.stringify(result));
                tmpResult.ResultSet.Course = tmpResult.ResultSet.Course[(selectNo - 1)];
                return JSON.stringify(tmpResult);
            }
        } else {
            return;
        }
    }

    /*
    * �o���������擾
    */
    function getDepartureDate() {
        if (viewCourseListFlag) {
            // �ꗗ�\�����͕Ԃ��Ȃ�
            return;
        } else if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Line.length == 'undefined') {
                return convertISOtoDate(tmpResult.Route.Line.DepartureState.Datetime.text, tmpResult.Route.Line.DepartureState.Datetime.operation);
            } else {
                return convertISOtoDate(tmpResult.Route.Line[0].DepartureState.Datetime.text, tmpResult.Route.Line[0].DepartureState.Datetime.operation);
            }
        } else {
            return;
        }
    }

    /*
    * �����������擾
    */
    function getArrivalDate() {
        if (viewCourseListFlag) {
            // �ꗗ�\�����͕Ԃ��Ȃ�
            return;
        } else if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Line.length == 'undefined') {
                return convertISOtoDate(tmpResult.Route.Line.ArrivalState.Datetime.text, tmpResult.Route.Line.ArrivalState.Datetime.operation);
            } else {
                return convertISOtoDate(tmpResult.Route.Line[tmpResult.Route.Line.length - 1].ArrivalState.Datetime.text, tmpResult.Route.Line[tmpResult.Route.Line.length - 1].ArrivalState.Datetime.operation);
            }
        } else {
            return;
        }
    }

    /*
    * �œK�o�H�̃`�F�b�N
    */
    function checkBestCourse(type) {
        if (viewCourseListFlag) {
            // �ꗗ�\�����͕Ԃ��Ȃ�
            return;
        } else if (typeof result != 'undefined') {
            if (typeof result == 'undefined') {
                return;
            } else {
                var tmpResult;
                //ekispert���w�肵���ꍇ�͑��o�H�̂�true
                if (type == "ekispert") {
                    if (selectNo == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
                if (resultCount == 1) {
                    tmpResult = result.ResultSet.Course;
                } else {
                    tmpResult = result.ResultSet.Course[(selectNo - 1)];
                }
                var time = parseInt(tmpResult.Route.timeOnBoard) + parseInt(tmpResult.Route.timeWalk) + parseInt(tmpResult.Route.timeOther);
                var TransferCount = parseInt(tmpResult.Route.transferCount);
                var exhaustCO2 = parseInt(tmpResult.Route.exhaustCO2);
                if (type == "price") {
                    if (priceViewFlag == "oneway") {
                        //�Г�
                        if (getPriceSummary("total", false) == minPriceSummary) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        //����
                        if (getPriceSummary("total", true) == minPriceRoundSummary) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else if (type == "time") {
                    if (time == minTimeSummary) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == "transfer") {
                    if (TransferCount == minTransferCount) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == "teiki") {
                    if (typeof getPriceSummary("teiki6") != 'undefined') {
                        if (minTeikiSummary == getPriceSummary("teiki6")) {
                            return true;
                        }
                    } else if (typeof getPriceSummary("teiki3") != 'undefined') {
                        if (minTeikiSummary == getPriceSummary("teiki3") * 2) {
                            return true;
                        }
                    } else if (typeof getPriceSummary("teiki1") != 'undefined') {
                        if (minTeikiSummary == getPriceSummary("teiki1") * 6) {
                            return true;
                        }
                    }
                    return false;
                } else if (type == "teiki1") {
                    if (typeof getPriceSummary("teiki1") != 'undefined' && getPriceSummary("teiki1") == minTeiki1Summary) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == "teiki3") {
                    if (typeof getPriceSummary("teiki3") != 'undefined' && getPriceSummary("teiki3") == minTeiki3Summary) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == "teiki6") {
                    if (typeof getPriceSummary("teiki6") != 'undefined' && getPriceSummary("teiki6") == minTeiki6Summary) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == "co2") {
                    if (exhaustCO2 == minExhaustCO2) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        }
    }

    /*
    * ��������p�̃`�F�b�N
    */
    function checkWithTeiki() {
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Price != 'undefined') {
                for (var j = 0; j < tmpResult.Price.length; j++) {
                    if (tmpResult.Price[j].kind == "Fare") {
                        if (typeof tmpResult.Price[j].Type != 'undefined') {
                            if (tmpResult.Price[j].Type == "WithTeiki") {
                                return true;
                            }
                        }
                    }
                }
            }
            return false;
        } else {
            return;
        }
    }

    /*
    * ��Ԗ��̃��X�g���擾
    */
    function getLineList() {
        var buffer = "";
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Line.length == 'undefined') {
                if (typeof tmpResult.Route.Line.Name != 'undefined') {
                    buffer += getTextValue(tmpResult.Route.Line.Name);
                }
            } else {
                for (var i = 0; i < tmpResult.Route.Line.length; i++) {
                    if (i != 0) { buffer += ","; }
                    if (typeof tmpResult.Route.Line[i].Name != 'undefined') {
                        buffer += getTextValue(tmpResult.Route.Line[i].Name);
                    }
                }
            }
        }
        return buffer;
    }

    /*
    * ��ԃI�u�W�F�N�g���擾
    */
    function getLineObject(index) {
        var tmpLineObject;
        if (typeof result != 'undefined') {
            var tmpResult, lineObject;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Line.length == 'undefined') {
                if (index == 1) {
                    lineObject = tmpResult.Route.Line;
                }
            } else {
                if (typeof tmpResult.Route.Line[parseInt(index) - 1] != 'undefined') {
                    lineObject = tmpResult.Route.Line[parseInt(index) - 1];
                }
            }
            if (typeof lineObject != 'undefined') {
                tmpLineObject = new Object();
                // ����
                if (typeof lineObject.Name != 'undefined') {
                    tmpLineObject.name = getTextValue(lineObject.Name);
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
            }
        }
        return tmpLineObject;
    }

    /*
    * �n�_���̃��X�g���擾
    */
    function getPointList() {
        var buffer = "";
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Point.length == 'undefined') {
                if (typeof tmpResult.Route.Point.Station != 'undefined') {
                    buffer += tmpResult.Route.Point.Station.Name;
                } else if (typeof tmpResult.Route.Point.Name != 'undefined') {
                    buffer += tmpResult.Route.Point.Name;
                }
            } else {
                for (var i = 0; i < tmpResult.Route.Point.length; i++) {
                    if (i != 0) { buffer += ","; }
                    if (typeof tmpResult.Route.Point[i].Station != 'undefined') {
                        buffer += tmpResult.Route.Point[i].Station.Name;
                    } else if (typeof tmpResult.Route.Point[i].Name != 'undefined') {
                        buffer += tmpResult.Route.Point[i].Name;
                    }
                }
            }
        }
        return buffer;
    }

    /*
    * �n�_�I�u�W�F�N�g���擾
    */
    function getPointObject(index) {
        var tmp_station;
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            if (typeof tmpResult.Route.Point[parseInt(index) - 1] != 'undefined') {
                var stationObj = tmpResult.Route.Point[parseInt(index) - 1];
                tmp_station = new Object();
                if (typeof stationObj.Station != 'undefined') {
                    tmp_station.name = stationObj.Station.Name;
                    tmp_station.code = stationObj.Station.code;
                    tmp_station.yode = stationObj.Station.Yomi;
                    if (typeof stationObj.Station.Type.text != 'undefined') {
                        tmp_station.type = stationObj.Station.Type.text;
                        if (typeof stationObj.Station.Type.detail != 'undefined') {
                            tmp_station.type_detail = stationObj.Station.Type.text + "." + stationObj.Station.Type.detail;
                        }
                    } else {
                        tmp_station.type = stationObj.Station.Type;
                    }
                } else if (typeof stationObj.Name != 'undefined') {
                    tmp_station.name = stationObj.Name;
                }
                if (typeof stationObj.GeoPoint != 'undefined') {
                    // �ܓx
                    tmp_station.lati = stationObj.GeoPoint.lati;
                    tmp_station.lati_d = stationObj.GeoPoint.lati_d;
                    // �o�x
                    tmp_station.longi = stationObj.GeoPoint.longi;
                    tmp_station.longi_d = stationObj.GeoPoint.longi_d;
                    // gcs
                    tmp_station.gcs = stationObj.GeoPoint.gcs;
                }
                //���R�[�h
                if (typeof stationObj.Prefecture != 'undefined') {
                    tmp_station.kenCode = parseInt(stationObj.Prefecture.code);
                }
            }
        }
        return tmp_station;
    }

    /*
    * �^�����擾
    */
    function getPrice(roundFlag) {
        if (roundFlag == "round") {
            return getPriceSummary("total", true);
        } else {
            return getPriceSummary("total", false);
        }
    }

    /*
    * ��Ԍ����擾
    */
    function getFarePrice(roundFlag) {
        if (roundFlag == "round") {
            return getPriceSummary("fare", true);
        } else {
            return getPriceSummary("fare", false);
        }
    }

    /*
    * ���}�����擾
    */
    function getChargePrice(roundFlag) {
        if (roundFlag == "round") {
            return getPriceSummary("charge", true);
        } else {
            return getPriceSummary("charge", false);
        }
    }

    /*
    * ��������擾
    */
    function getTeikiPrice(month) {
        if (String(month) == "1") {
            return getPriceSummary("teiki1");
        } else if (String(month) == "3") {
            return getPriceSummary("teiki3");
        } else if (String(month) == "6") {
            return getPriceSummary("teiki6");
        }
    }

    /*
    * ���z�̌v�Z
    */
    function getPriceSummary(type, round) {
        if (typeof result != 'undefined') {
            var tmpResult;
            if (resultCount == 1) {
                tmpResult = result.ResultSet.Course;
            } else {
                tmpResult = result.ResultSet.Course[(selectNo - 1)];
            }
            var FareSummary = 0;
            var FareRoundSummary = 0;
            var ChargeSummary = 0;
            var ChargeRoundSummary = 0;
            var Teiki1Summary;
            var Teiki3Summary;
            var Teiki6Summary;
            if (typeof tmpResult.Price != 'undefined') {
                for (var j = 0; j < tmpResult.Price.length; j++) {
                    if (tmpResult.Price[j].kind == "FareSummary") {
                        if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                            FareSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                        }
                        if (typeof tmpResult.Price[j].Round != 'undefined') {
                            FareRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                        }
                    } else if (tmpResult.Price[j].kind == "ChargeSummary") {
                        if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                            ChargeSummary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                        }
                        if (typeof tmpResult.Price[j].Round != 'undefined') {
                            ChargeRoundSummary = parseInt(getTextValue(tmpResult.Price[j].Round));
                        }
                    } else if (tmpResult.Price[j].kind == "Teiki1Summary") {
                        if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                            Teiki1Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                        }
                    } else if (tmpResult.Price[j].kind == "Teiki3Summary") {
                        if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                            Teiki3Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                        }
                    } else if (tmpResult.Price[j].kind == "Teiki6Summary") {
                        if (typeof tmpResult.Price[j].Oneway != 'undefined') {
                            Teiki6Summary = parseInt(getTextValue(tmpResult.Price[j].Oneway));
                        }
                    }
                }
            }
            if (type == "total") {
                return (round ? FareRoundSummary + ChargeRoundSummary : FareSummary + ChargeSummary);
            } else if (type == "fare") {
                return (round ? FareRoundSummary : FareSummary);
            } else if (type == "charge") {
                return (round ? ChargeRoundSummary : ChargeSummary);
            } else if (type == "teiki1") {
                return Teiki1Summary;
            } else if (type == "teiki3") {
                return Teiki3Summary;
            } else if (type == "teiki6") {
                return Teiki6Summary;
            }
        }
    }

    /*
    * �T�����ʐ����擾
    */
    function getResultCount() {
        return resultCount;
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("PriceChangeRefresh").toLowerCase()) {
            priceChangeRefreshFlag = value;
        } else if (name.toLowerCase() == String("PriceChange").toLowerCase()) {
            priceChangeFlag = value;
        } else if (name.toLowerCase() == String("AssignDia").toLowerCase()) {
            assignDiaFlag = value;
        } else if (name.toLowerCase() == String("CourseList").toLowerCase()) {
            courseListFlag = value;
        } else if (name.toLowerCase() == String("Agent").toLowerCase()) {
            agent = value;
        } else if (name.toLowerCase() == String("window").toLowerCase()) {
            windowFlag = value;
        }
    }

    /*
    * �T���I�u�W�F�N�g�̃C���^�[�t�F�[�X��Ԃ�
    */
    function createSearchInterface() {
        return new searchInterface();
    };

    /*
    * �T���C���^�[�t�F�[�X�I�u�W�F�N�g
    */
    function searchInterface() {
        // �f�[�^���X�g
        var viaList;
        var fixedRailList;
        var fixedRailDirectionList;
        var date;
        var time;
        var searchType;
        var sort;
        var answerCount;
        var searchCount;
        var conditionDetail;
        var corporationBind;
        var interruptCorporationList;
        var interruptRailList;
        var resultDetail;
        var assignRoute;
        var assignDetailRoute;
        var assignNikukanteikiIndex;
        var coupon;
        // �֐����X�g
        // ViaList�ݒ�
        function setViaList(value) { viaList = value; };
        function getViaList() { return viaList; };
        this.setViaList = setViaList;
        this.getViaList = getViaList;
        // FixedRailList�ݒ�
        function setFixedRailList(value) { fixedRailList = value; };
        function getFixedRailList() { return fixedRailList; };
        this.setFixedRailList = setFixedRailList;
        this.getFixedRailList = getFixedRailList;
        // FixedRailDirectionList�ݒ�
        function setFixedRailDirectionList(value) { fixedRailDirectionList = value; };
        function getFixedRailDirectionList() { return fixedRailDirectionList; };
        this.setFixedRailDirectionList = setFixedRailDirectionList;
        this.getFixedRailDirectionList = getFixedRailDirectionList;
        // Date�ݒ�
        function setDate(value) { date = value; };
        function getDate() { return date; };
        this.setDate = setDate;
        this.getDate = getDate;
        // Time�ݒ�
        function setTime(value) { time = value; };
        function getTime() { return time; };
        this.setTime = setTime;
        this.getTime = getTime;
        // SearchType�ݒ�
        function setSearchType(value) { searchType = value; };
        function getSearchType() { return searchType; };
        this.setSearchType = setSearchType;
        this.getSearchType = getSearchType;
        // Sort�ݒ�
        function setSort(value) { sort = value; };
        function getSort() { return sort; };
        this.setSort = setSort;
        this.getSort = getSort;
        // AnswerCount�ݒ�
        function setAnswerCount(value) { answerCount = value; };
        function getAnswerCount() { return answerCount; };
        this.setAnswerCount = setAnswerCount;
        this.getAnswerCount = getAnswerCount;
        // SearchCount�ݒ�
        function setSearchCount(value) { searchCount = value; };
        function getSearchCount() { return searchCount; };
        this.setSearchCount = setSearchCount;
        this.getSearchCount = getSearchCount;
        // ConditionDetail�ݒ�
        function setConditionDetail(value) { conditionDetail = value; };
        function getConditionDetail() { return conditionDetail; };
        this.setConditionDetail = setConditionDetail;
        this.getConditionDetail = getConditionDetail;
        // CorporationBind�ݒ�
        function setCorporationBind(value) { corporationBind = value; };
        function getCorporationBind() { return corporationBind; };
        this.setCorporationBind = setCorporationBind;
        this.getCorporationBind = getCorporationBind;
        // InterruptCorporationList�ݒ�
        function setInterruptCorporationList(value) { interruptCorporationList = value; };
        function getInterruptCorporationList() { return interruptCorporationList; };
        this.setInterruptCorporationList = setInterruptCorporationList;
        this.getInterruptCorporationList = getInterruptCorporationList;
        // InterruptRailList�ݒ�
        function setInterruptRailList(value) { interruptRailList = value; };
        function getInterruptRailList() { return interruptRailList; };
        this.setInterruptRailList = setInterruptRailList;
        this.getInterruptRailList = getInterruptRailList;
        // ResultDetail�ݒ�
        function setResultDetail(value) { resultDetail = value; };
        function getResultDetail() { return resultDetail; };
        this.setResultDetail = setResultDetail;
        this.getResultDetail = getResultDetail;
        // AssignRoute�ݒ�
        function setAssignRoute(value) { assignRoute = value; };
        function getAssignRoute() { return assignRoute; };
        this.setAssignRoute = setAssignRoute;
        this.getAssignRoute = getAssignRoute;
        // AssignDetailRoute�ݒ�
        function setAssignDetailRoute(value) { assignDetailRoute = value; };
        function getAssignDetailRoute() { return assignDetailRoute; };
        this.setAssignDetailRoute = setAssignDetailRoute;
        this.getAssignDetailRoute = getAssignDetailRoute;
        // AssignNikukanteikiIndex�ݒ�
        function setAssignNikukanteikiIndex(value) { assignNikukanteikiIndex = value; };
        function getAssignNikukanteikiIndex() { return assignNikukanteikiIndex; };
        this.setAssignNikukanteikiIndex = setAssignNikukanteikiIndex;
        this.getAssignNikukanteikiIndex = getAssignNikukanteikiIndex;
        // Coupon�ݒ�
        function setCoupon(value) { coupon = value; };
        function getCoupon() { return coupon; };
        this.setCoupon = setCoupon;
        this.getCoupon = getCoupon;
        // ���z�ݒ�
        var priceType;
        function setPriceType(value) { priceType = value; };
        function getPriceType() { return priceType; };
        this.setPriceType = setPriceType;
        this.getPriceType = getPriceType;
    };

    /*
    * �R�[���o�b�N�֐��̐ݒ�
    */
    function bind(type, func) {
        if (type == 'change' && typeof func == 'function') {
            callBackFunctionBind[type] = func;
        } else if (type == 'click' && typeof func == 'function') {
            callBackFunctionBind[type] = func;
        } else if (type == 'close' && typeof func == 'function') {
            callBackFunctionBind[type] = func;
        } else if (type == 'select' && typeof func == 'function') {
            callBackFunctionBind[type] = func;
        }
    }

    /*
    * �R�[���o�b�N�֐��̉���
    */
    function unbind(type) {
        if (typeof callBackFunctionBind[type] != undefined) {
            callBackFunctionBind[type] = undefined;
        }
    }

    /*
    * ���j���[�I�u�W�F�N�g�쐬
    */
    var menu = function (p_text, p_callBack, mask) {
        var text = p_text;
        var callBack = p_callBack;
        var type;
        var mask;
        this.text = text;
        this.callBack = callBack;
        this.mask = mask;
    };

    /*
    * �H�����j���[��ǉ�
    */
    function addLineMenu(obj) {
        callBackObjectLine.push(obj);
    };

    /*
    * �w���j���[��ǉ�
    */
    function addPointMenu(obj) {
        callBackObjectStation.push(obj);
    };

    /*
    * ���p�ł���֐����X�g
    */
    this.dispCourse = dispCourse;
    this.search = search;
    this.changeCourse = changeCourse;
    this.getSerializeData = getSerializeData;
    this.getSerializeDataAll = getSerializeDataAll;
    this.getTeiki = getTeiki;
    this.getNikukanteikiIndex = getNikukanteikiIndex;
    this.getResult = getResult;
    this.getResultString = getResultString;
    this.getResultAll = getResultAll;
    this.getResultStringAll = getResultStringAll;
    this.getDepartureDate = getDepartureDate;
    this.getArrivalDate = getArrivalDate;
    this.checkBestCourse = checkBestCourse;
    this.checkWithTeiki = checkWithTeiki;
    this.setResult = setResult;
    this.setSerializeData = setSerializeData;
    this.getLineList = getLineList;
    this.getLineObject = getLineObject;
    this.getPointList = getPointList;
    this.getPointObject = getPointObject;
    this.getPrice = getPrice;
    this.getFarePrice = getFarePrice;
    this.getChargePrice = getChargePrice;
    this.getTeikiPrice = getTeikiPrice;
    this.getResultCount = getResultCount;
    this.createSearchInterface = createSearchInterface;
    this.setConfigure = setConfigure;
    this.courseEdit = courseEdit;
    this.bind = bind;
    this.unbind = unbind;
    this.menu = menu;
    this.addLineMenu = addLineMenu;
    this.addPointMenu = addPointMenu;

    /*
    * �萔���X�g
    */
    this.SORT_EKISPERT = "ekispert";
    this.SORT_PRICE = "price";
    this.SORT_TIME = "time";
    this.SORT_TEIKI = "teiki";
    this.SORT_TRANSFER = "transfer";
    this.SORT_CO2 = "co2";
    this.SORT_TEIKI1 = "teiki1";
    this.SORT_TEIKI3 = "teiki3";
    this.SORT_TEIKI6 = "teiki6";
    this.PRICE_ONEWAY = "oneway";
    this.PRICE_ROUND = "round";
    this.PRICE_TEIKI = "teiki";
    this.SEARCHTYPE_DEPARTURE = "departure";
    this.SEARCHTYPE_ARRIVAL = "arrival";
    this.SEARCHTYPE_FIRSTTRAIN = "firstTrain";
    this.SEARCHTYPE_LASTTRAIN = "lastTrain";
    this.SEARCHTYPE_PLAIN = "plain";
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
