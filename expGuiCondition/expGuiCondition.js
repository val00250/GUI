/**
 *  �w���ς��� Web �T�[�r�X
 *  �T�������p�[�c
 *  �T���v���R�[�h
 *  http://webui.ekispert.com/doc/
 *  
 *  Version:2014-12-25
 *  
 *  Copyright (C) Val Laboratory Corporation. All rights reserved.
 **/

var expGuiCondition = function (pObject, config) {
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
        imagePath = s.src.substring(0, s.src.indexOf("expGuiCondition\.js"));
        if (s.src && s.src.match(/expGuiCondition\.js(\?.*)?/)) {
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
    // �f�t�H���g�T������
    var def_condition_t = "T3221233232319";
    var def_condition_f = "F3321122120";
    var def_condition_a = "A23121141";
    var def_sortType = "ekispert"; // �f�t�H���g�\�[�g
    var def_priceType = "oneway"; // �Г��^�����f�t�H���g
    var def_answerCount = "5"; // �T�����ʐ��̃f�t�H���g

    var checkboxItem = new Array();
    var conditionObject = initCondition();

    function initCondition() {
        // �T�������̃I�u�W�F�N�g���쐬
        var tmp_conditionObject = new Object();
        // �񓚐�
        var conditionId = "answerCount";
        var conditionLabel = "�񓚐�";
        var tmpOption = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20);
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption);
        // �T�����̕\�����ݒ�
        var conditionId = "sortType";
        var conditionLabel = "�\�����ݒ�";
        //  var conditionLabel = "�T�����̕\�����ݒ�";
        //  var tmpOption = new Array("�w���ς��ƒT����","������","���ԏ�","������̗�����","�抷�񐔏�","CO2�r�o�ʏ�","1����������̗�����","3����������̗�����","6����������̗�����");
        var tmpOption = new Array("�T����", "������", "���ԏ�", "�������", "�抷�񐔏�", "CO2�r�o�ʏ�", "1���������", "3���������", "6���������");
        var tmpValue = new Array("ekispert", "price", "time", "teiki", "transfer", "co2", "teiki1", "teiki3", "teiki6");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �T�����̗����ݒ�
        var conditionId = "priceType";
        //  var conditionLabel = "�T�����̗����ݒ�";
        var conditionLabel = "�����ݒ�";
        var tmpOption = new Array("�Г�", "����", "���");
        var tmpValue = new Array("oneway", "round", "teiki");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // ��s�@
        var conditionId = "plane";
        var conditionLabel = "��s�@";
        var tmpOption = new Array("�C�y�ɗ��p", "���ʂɗ��p", "�ɗ͗��p���Ȃ�", "���p���Ȃ�");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �V����
        var conditionId = "shinkansen";
        var conditionLabel = "�V����";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �V�����̂���
        var conditionId = "shinkansenNozomi";
        var conditionLabel = "�V�����̂���";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �Q����
        var conditionId = "sleeperTrain";
        var conditionLabel = "�Q����";
        var tmpOption = new Array("�ɗ͗��p����", "���ʂɗ��p", "���p���Ȃ�");
        var tmpValue = new Array("possible", "normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �L�����}
        var conditionId = "limitedExpress";
        var conditionLabel = "�L�����}";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �����o�X
        var conditionId = "highwayBus";
        var conditionLabel = "�����o�X";
        var tmpOption = new Array("�C�y�ɗ��p", "���ʂɗ��p", "�ɗ͗��p���Ȃ�", "���p���Ȃ�");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �A���o�X
        var conditionId = "connectionBus";
        var conditionLabel = "�A���o�X";
        var tmpOption = new Array("�C�y�ɗ��p", "���ʂɗ��p", "�ɗ͗��p���Ȃ�", "���p���Ȃ�");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �H���o�X
        var conditionId = "localBus";
        var conditionLabel = "�H���o�X";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �D
        var conditionId = "ship";
        var conditionLabel = "�D";
        var tmpOption = new Array("�C�y�ɗ��p", "���ʂɗ��p", "�ɗ͗��p���Ȃ�", "���p���Ȃ�");
        var tmpValue = new Array("light", "normal", "bit", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �L�����ʗ��
        var conditionId = "liner";
        var conditionLabel = "�L�����ʗ��";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �w�ԓk��
        var conditionId = "walk";
        var conditionLabel = "�w�ԓk��";
        var tmpOption = new Array("�C�ɂȂ�Ȃ�", "�����C�ɂȂ�", "���p���Ȃ�");
        var tmpValue = new Array("normal", "little", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �[��}�s�o�X
        var conditionId = "midnightBus";
        var conditionLabel = "�[��}�s�o�X";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("normal", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // ���}���������l
        var conditionId = "surchargeKind";
        var conditionLabel = "���}���������l";
        var tmpOption = new Array("���R��", "�w���", "�O���[��");
        var tmpValue = new Array("free", "reserved", "green");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �����ʏ����l
        var conditionId = "teikiKind";
        var conditionLabel = "�����ʏ����l";
        var tmpOption = new Array("�ʋ�", "�w���i���Z�j", "�w��");
        var tmpValue = new Array("bussiness", "highSchool", "university");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // JR�G�ߗ���
        var conditionId = "JRSeasonalRate";
        var conditionLabel = "JR�G�ߗ���";
        //  var tmpOption = new Array("�ɖZ���E�ՎU���̋G�ߗ������l������","��������");
        var tmpOption = new Array("�ɖZ���E�ՎU�����l��", "��������");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �w����Ԍ�
        var conditionId = "studentDiscount";
        var conditionLabel = "�w����Ԍ�";
        var tmpOption = new Array("�v�Z����", "�v�Z���Ȃ�");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �q��^���̎w��
        //var conditionId = "airFare";
        //var conditionLabel = "�q��^���̎w��";
        //var tmpOption = new Array("��ɕ��ʉ^�����̗p","����֊������ɗ͍̗p");
        //var tmpValue  = new Array("normal","tokuwari");
        //tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        // �q��ی����ʗ���
        var conditionId = "includeInsurance";
        var conditionLabel = "�q��ی����ʗ���";
        var tmpOption = new Array("�^���Ɋ܂�", "�^���Ɋ܂܂Ȃ�");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // ��Ԍ��v�Z�̃V�X�e��
        var conditionId = "ticketSystemType";
        //  var conditionLabel = "��Ԍ��v�Z�̃V�X�e��";
        var conditionLabel = "��Ԍ��v�Z";
        //  var tmpOption = new Array("���ʏ�Ԍ��Ƃ��Čv�Z","IC�J�[�h��Ԍ��Ƃ��Čv�Z");
        var tmpOption = new Array("���ʏ�Ԍ�", "IC�J�[�h��Ԍ�");
        var tmpValue = new Array("normal", "ic");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �Q��Ԓ���̗��p
        var conditionId = "nikukanteiki";
        var conditionLabel = "�Q��Ԓ���̗��p";
        var tmpOption = new Array("���p����", "���p���Ȃ�");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // JR�H��
        var conditionId = "useJR";
        var conditionLabel = "JR�H��";
        var tmpOption = new Array("�C�y�ɗ��p", "���ʂɗ��p", "�ɗ͗��p���Ȃ�");
        var tmpValue = new Array("light", "normal", "bit");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �抷��
        var conditionId = "transfer";
        var conditionLabel = "�抷��";
        var tmpOption = new Array("�C�ɂȂ�Ȃ�", "�����C�ɂȂ�", "���p���Ȃ�");
        var tmpValue = new Array("normal", "little", "never");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // ���}�n���w
        var conditionId = "expressStartingStation";
        var conditionLabel = "���}�n���w";
        var tmpOption = new Array("�Ȃ�ׂ����p", "���ʂɗ��p");
        var tmpValue = new Array("possible", "normal");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �o���w���
        var conditionId = "waitAverageTime";
        var conditionLabel = "�o���w���";
        //  var tmpOption = new Array("���ϑ҂����Ԃ𗘗p����","�҂����ԂȂ�");
        var tmpOption = new Array("���ϑ҂�����", "�҂����ԂȂ�");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �H���o�X�̂ݒT��
        var conditionId = "localBusOnly";
        var conditionLabel = "�H���o�X�̂ݒT��";
        var tmpOption = new Array("����", "���Ȃ�");
        var tmpValue = new Array("true", "false");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �H���������܂��w��
        //  var conditionId = "fuzzyLine";
        //  var conditionLabel = "�H���������܂��w��";
        //  var tmpOption = new Array("�����܂��ɍs��","���i�ɍs��");
        //  var tmpValue  = new Array("true","false");
        //  tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        // �抷������
        var conditionId = "transferTime";
        var conditionLabel = "�抷������";
        //  var tmpOption = new Array("�w���ς��Ƃ̊���l","����l��菭���]�T���݂�","����l���]�T���݂�","����l���Z�����Ԃɂ���");
        var tmpOption = new Array("����l", "�����]�T���݂�", "�]�T���݂�", "�Z������");
        var tmpValue = new Array("normal", "moreMargin", "mostMargin", "lessMargin");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        // �o�R�w�w��̌p��
        //  var conditionId = "entryPathBehavior";
        //  var conditionLabel = "�o�R�w�w��̌p��";
        //  var tmpOption = new Array("����","���Ȃ�");
        //  var tmpValue  = new Array("true","false");
        //  tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel,tmpOption,tmpValue);
        // �D�悷���Ԍ��̏���
        var conditionId = "preferredTicketOrder";
        //  var conditionLabel = "�D�悷���Ԍ��̏���";
        var conditionLabel = "�D�悷���Ԍ�";
        //var tmpOption = new Array("�w��Ȃ�", "���ʏ�Ԍ���D�悷��", "�h�b�J�[�h��Ԍ���D�悷��", "������Ԍ���D�悷��");
        var tmpOption = new Array("�w��Ȃ�", "������Ԍ�", "�h�b�J�[�h��Ԍ�", "���ʏ�Ԍ�");
        var tmpValue = new Array("none", "cheap", "ic", "normal");
        tmp_conditionObject[conditionId.toLowerCase()] = addCondition(conditionLabel, tmpOption, tmpValue);
        return tmp_conditionObject;
    }

    /*
    * �T�������I�u�W�F�N�g
    */
    function addCondition(name, option, value) {
        var tmpCondition = new Object();
        tmpCondition.name = name;
        tmpCondition.option = option;
        if (typeof value != 'undefined') {
            tmpCondition.value = value;
        } else {
            tmpCondition.value = option;
        }
        // �f�t�H���g�͕\��
        tmpCondition.visible = true;
        return tmpCondition;
    }

    /*
    * �T�������̐ݒu
    */
    function dispCondition() {
        // HTML�{��
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }
        if (agent == 1 || agent == 3) {
            // �`�F�b�N�{�b�N�X�̐ݒ�ƃf�t�H���g
            buffer += '<div class="exp_clearfix">';
            buffer += viewConditionSimple(true);
            buffer += viewConditionDetail();
            buffer += "</div>";
        } else if (agent == 2) {
            // �Z���N�g�{�b�N�X
            buffer += viewConditionPhone();
        }
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // �C�x���g��ݒ�
        addEvent(document.getElementById(baseId + ":conditionOpen"), "click", onEvent);
        var tabCount = 1;
        while (document.getElementById(baseId + ":conditionTab:" + String(tabCount))) {
            addEvent(document.getElementById(baseId + ":conditionTab:" + String(tabCount)), "click", onEvent);
            tabCount++;
        }
        var tabCount = 1;
        while (document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":open")) {
            addEvent(document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":open"), "click", onEvent);
            addEvent(document.getElementById(baseId + ":conditionSection:" + String(tabCount) + ":close"), "click", onEvent);
            tabCount++;
        }
        addEvent(document.getElementById(baseId + ":conditionClose"), "click", onEvent);
        // �`�F�b�N�{�b�N�X�̐ݒ�
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // �A���@�\�̒ǉ�
        setEvent("ticketSystemType");
        setEvent("preferredTicketOrder");
        // �f�t�H���g�ݒ�
        resetCondition();
        // �ȈՐݒ�̃f�t�H���g���ݒ�
        setSimpleCondition();
    }

    /*
    * �T�������̐ݒu
    */
    function setEvent(id) {
        id = id.toLowerCase();
        if (agent == 1 || agent == 3) {
            for (var i = 0; i < conditionObject[id].option.length; i++) {
                addEvent(document.getElementById(baseId + ':' + id + ':' + String(i + 1)), "click", onEvent);
            }
        } else if (agent == 2) {
            addEvent(document.getElementById(baseId + ':' + id), "change", onEvent);
        }
    }

    /*
    * �T�������̐ݒu
    */
    function dispConditionSimple() {
        // HTML�{��
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }
        buffer += viewConditionSimple(false);
        buffer += viewConditionDetail();
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // �`�F�b�N�{�b�N�X�̐ݒ�
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // �f�t�H���g�ݒ�
        resetCondition();
        // �ȈՐݒ�̃f�t�H���g���ݒ�
        setSimpleCondition();
    }

    function dispConditionLight() {
        // HTML�{��
        var buffer;
        if (agent == 1) {
            buffer = '<div class="expGuiCondition expGuiConditionPc">';
        } else if (agent == 2) {
            buffer = '<div class="expGuiCondition expGuiConditionPhone">';
        } else if (agent == 3) {
            buffer = '<div class="expGuiCondition expGuiConditionTablet">';
        }

        buffer += '<div class="exp_conditionSimple exp_clearfix">';
        buffer += '<div class="exp_title">��ʎ�i</div>';
        buffer += outConditionCheckbox("plane", "normal", "never");
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never", "���}");
        buffer += outConditionCheckbox("localBus", "normal", "never", "�o�X");
        buffer += viewConditionDetail();
        buffer += '</div>';
        documentObject.innerHTML = buffer;

        // �`�F�b�N�{�b�N�X�̐ݒ�
        for (var i = 0; i < checkboxItem.length; i++) {
            addEvent(document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox'), "change", onEvent);
        }
        // �f�t�H���g�ݒ�
        resetCondition();
        // �ȈՐݒ�̃f�t�H���g���ݒ�
        setSimpleCondition();
    }
    /*
    * �ȈՐݒ�̃f�t�H���g�ݒ�
    */
    function setSimpleCondition() {
        for (var i = 0; i < checkboxItem.length; i++) {
            document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox').checked = (getValue(checkboxItem[i]) == document.getElementById(baseId + ':' + checkboxItem[i] + ':checkbox').value ? true : false);
        }
    }

    /*
    * �T�������Ȉ�
    */
    function viewConditionSimple(detail) {
        var buffer = "";
        buffer += '<div class="exp_conditionSimple exp_clearfix">';
        buffer += '<div class="exp_title">��ʎ�i</div>';
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("shinkansenNozomi", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never");
        buffer += outConditionCheckbox("localBus", "normal", "never");
        buffer += outConditionCheckbox("liner", "normal", "never");
        buffer += outConditionCheckbox("midnightBus", "normal", "never");
        buffer += '</div>';
        if (detail) {
            buffer += '<div class="exp_conditionOpen">';
            if (agent == 1) {
                buffer += '<a class="exp_conditionOpenButton" id="' + baseId + ':conditionOpen" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':conditionOpen:text">�T���ڍ׏�����ݒ�</span></a>';
            } else if (agent == 3) {
                buffer += '<a class="exp_conditionOpenButton" id="' + baseId + ':conditionOpen" href="Javascript:void(0);">�T���ڍ׏�����ݒ�</a>';
            }
            buffer += '</div>';
        }
        return buffer;
    }

    /*
    * �T�������ڍ�
    */
    function viewConditionDetail() {
        var buffer = "";
        buffer += '<div id="' + baseId + ':conditionDetail" class="exp_conditionDetail" style="display:none;">';
        buffer += '<div class="exp_conditionTable exp_clearfix">';
        if (agent == 3) {
            // �^�u���b�g�p����{�^��
            buffer += '<div class="exp_titlebar exp_clearfix">';
            buffer += '�T������';
            buffer += '<span class="exp_button">';
            buffer += '<a class="exp_conditionClose" id="' + baseId + ':conditionClose" href="Javascript:void(0);">����</a>';
            buffer += '</span>';
            buffer += '</div>';
        }
        // �^�u
        buffer += '<div class="exp_header exp_clearfix">';
        var groupList = new Array("�\��", "�^��", "��ʎ�i", "�_�C���o�H", "���όo�H");
        buffer += '<div class="exp_conditionLeft"></div>';
        for (var i = 0; i < groupList.length; i++) {
            var tabType = "conditionTab";
            if (agent == 3) {
                if (i == 0) { tabType = "conditionTabLeft"; }
                if (i == (groupList.length - 1)) { tabType = "conditionTabRight"; }
            }
            buffer += '<div class="exp_' + tabType + ' exp_conditionTabSelected" id="' + baseId + ':conditionTab:' + String(i + 1) + ':active" style="display:' + (i == 0 ? "block" : "none") + ';">';
            buffer += '<span class="exp_text">' + groupList[i] + '</span>';
            buffer += '</div>';
            buffer += '<div class="exp_' + tabType + ' exp_conditionTabNoSelect" id="' + baseId + ':conditionTab:' + String(i + 1) + ':none" style="display:' + (i != 0 ? "block" : "none") + ';">';
            buffer += '<a id="' + baseId + ':conditionTab:' + String(i + 1) + '" href="Javascript:void(0);">';
            buffer += groupList[i];
            buffer += '</a>';
            buffer += '</div>';
        }
        buffer += '<div class="exp_conditionRight"></div>';
        buffer += '</div>';

        // �T������
        buffer += '<div class="exp_conditionList">';
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(1) + '" class="exp_clearfix">';
        // �񓚐�
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("answerCount");
        } else if (agent == 3) {
            buffer += outConditionRadio("answerCount");
        }
        buffer += outSeparator("answerCount");
        // �T�����̕\�����ݒ�
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("sortType", "whiteSelect");
        } else if (agent == 3) {
            buffer += outConditionRadio("sortType", "whiteSelect");
        }
        buffer += outSeparator("sortType");
        // �T�����̗����ݒ�
        buffer += outConditionRadio("priceType", "greenSelect");
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(2) + '" class="exp_clearfix" style="display:none;">';
        // ���}���������l
        buffer += outConditionRadio("surchargeKind");
        buffer += outSeparator("surchargeKind");
        // �w����Ԍ�
        buffer += outConditionRadio("studentDiscount", "whiteSelect");
        buffer += outSeparator("studentDiscount");
        // �����ʏ����l
        buffer += outConditionRadio("teikiKind", "greenSelect");
        buffer += outSeparator("teikiKind");
        // JR�G�ߗ���
        buffer += outConditionRadio("JRSeasonalRate", "whiteSelect");
        buffer += outSeparator("JRSeasonalRate");
        // ��Ԍ��v�Z�̃V�X�e��
        buffer += outConditionRadio("ticketSystemType", "greenSelect");
        buffer += outSeparator("ticketSystemType");
        // �D�悷���Ԍ��̏���
        buffer += outConditionRadio("preferredTicketOrder", "whiteSelect");
        buffer += outSeparator("preferredTicketOrder");
        // �Q��Ԓ���̗��p
        buffer += outConditionRadio("nikukanteiki", "greenSelect");
        buffer += outSeparator("nikukanteiki");
        // �q��ی����ʗ���
        buffer += outConditionRadio("includeInsurance", "whiteSelect");
        // �q��^���̎w��
        //  buffer += outConditionRadio("airFare");
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(3) + '" class="exp_clearfix" style="display:none;">';
        // ��s�@
        buffer += outConditionRadio("plane");
        buffer += outSeparator("plane");
        // �Q����
        buffer += outConditionRadio("sleeperTrain");
        buffer += outSeparator("sleeperTrain");
        // �����o�X
        buffer += outConditionRadio("highwayBus");
        buffer += outSeparator("highwayBus");
        // �A���o�X
        buffer += outConditionRadio("connectionBus");
        buffer += outSeparator("connectionBus");
        // �D
        buffer += outConditionRadio("ship");
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(4) + '" class="exp_clearfix" style="display:none;">';
        // �抷������
        if (agent == 1 || agent == 2) {
            buffer += outConditionSelect("transferTime", "whiteSelect");
        } else if (agent == 3) {
            buffer += outConditionRadio("transferTime", "whiteSelect");
        }
        buffer += '</div>';

        buffer += '<div id="' + baseId + ':conditionGroup:' + String(5) + '" class="exp_clearfix" style="display:none;">';
        // �w�ԓk��
        buffer += outConditionRadio("walk", "whiteSelect");
        buffer += outSeparator("walk");
        // JR�H��
        buffer += outConditionRadio("useJR", "greenSelect");
        buffer += outSeparator("useJR");
        // ���}�n���w
        buffer += outConditionRadio("expressStartingStation", "whiteSelect");
        buffer += outSeparator("expressStartingStation");
        // �o���w���
        buffer += outConditionRadio("waitAverageTime", "greenSelect");
        buffer += outSeparator("waitAverageTime");
        // �H���o�X�̂ݒT��
        buffer += outConditionRadio("localBusOnly", "whiteSelect");
        buffer += outSeparator("localBusOnly");
        // �抷��
        buffer += outConditionRadio("transfer", "greenSelect");
        buffer += '</div>';
        // �B���^�u
        buffer += '<div style="display:none;">';
        // �V����
        buffer += outConditionRadio("shinkansen");
        buffer += outSeparator("shinkansen");
        // �V�����̂���
        buffer += outConditionRadio("shinkansenNozomi");
        buffer += outSeparator("shinkansenNozomi");
        // �L�����}
        buffer += outConditionRadio("limitedExpress");
        buffer += outSeparator("limitedExpress");
        // �H���o�X
        buffer += outConditionRadio("localBus");
        // �L�����ʗ��
        buffer += outConditionRadio("liner");
        buffer += outSeparator("liner");
        // �[��}�s�o�X
        buffer += outConditionRadio("midnightBus");
        // �H���������܂��w��
        //  buffer += outConditionRadio("fuzzyLine");
        // �o�R�w�w��̌p��
        //  buffer += outConditionRadio("entryPathBehavior");
        buffer += '</div>';

        if (agent == 1) {
            // PC�p����{�^��
            buffer += '<div class="exp_conditionFooter">';
            buffer += '<div class="exp_conditionClose">';
            buffer += '<a class="exp_conditionCloseButton" id="' + baseId + ':conditionClose" href="Javascript:void(0);"><span class="exp_text" id="' + baseId + ':conditionClose:text">����</span></a>';
            buffer += '</div>';
            buffer += '</div>';
        }
        buffer += '</div>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * �X�}�[�g�t�H���p�T������
    */
    function viewConditionPhone() {
        var buffer = "";
        buffer += '<div id="' + baseId + ':conditionDetail" class="exp_conditionDetail">';
        // ��ʎ�i
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">��ʎ�i</div>';
        buffer += '<div class="exp_conditionCheckList exp_clearfix">';
        buffer += outConditionCheckbox("shinkansen", "normal", "never");
        buffer += outConditionCheckbox("shinkansenNozomi", "normal", "never");
        buffer += outConditionCheckbox("limitedExpress", "normal", "never");
        buffer += outConditionCheckbox("localBus", "normal", "never");
        buffer += outConditionCheckbox("liner", "normal", "never");
        buffer += outConditionCheckbox("midnightBus", "normal", "never");
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(1) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(1) + ':open" href="Javascript:void(0);">';
        buffer += '�ڍ׏������J��';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(1) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(1) + ':close" href="Javascript:void(0);">';
        buffer += '�ڍ׏��������';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // �ڍ�
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(1) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("plane", "whiteSelect"); // ��s�@
        buffer += outConditionSelect("sleeperTrain", "greenSelect"); // �Q����
        buffer += outConditionSelect("highwayBus", "whiteSelect"); // �����o�X
        buffer += outConditionSelect("connectionBus", "greenSelect"); // �A���o�X
        buffer += outConditionSelect("ship", "whiteSelect"); // �D
        buffer += '</div>';
        buffer += '</div>';

        // �^��
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">�^��</div>';
        buffer += '<div class="exp_conditionGroup exp_clearfix">';
        buffer += outConditionSelect("surchargeKind"); // ���}���������l
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(2) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(2) + ':open" href="Javascript:void(0);">';
        buffer += '�ڍ׏������J��';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(2) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(2) + ':close" href="Javascript:void(0);">';
        buffer += '�ڍ׏��������';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // �ڍ�
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(2) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("studentDiscount", "whiteSelect"); // �w����Ԍ�
        buffer += outConditionSelect("teikiKind", "greenSelect"); // �����ʏ����l
        buffer += outConditionSelect("JRSeasonalRate", "whiteSelect"); // JR�G�ߗ���
        buffer += outConditionSelect("ticketSystemType", "greenSelect"); // ��Ԍ��v�Z�̃V�X�e��
        buffer += outConditionSelect("preferredTicketOrder", "whiteSelect"); // �D�悷���Ԍ��̏���
        buffer += outConditionSelect("nikukanteiki", "greenSelect"); // �Q��Ԓ���̗��p
        buffer += outConditionSelect("includeInsurance", "whiteSelect"); // �q��ی����ʗ���
        //  buffer += outConditionSelect("airFare");// �q��^���̎w��
        buffer += '</div>';
        buffer += '</div>';

        //�\��
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">�\��</div>';
        // �񓚐�
        buffer += '<div class="exp_conditionGroup exp_clearfix">';
        buffer += outConditionSelect("answerCount");
        buffer += '</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(3) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(3) + ':open" href="Javascript:void(0);">';
        buffer += '�ڍ׏������J��';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(3) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(3) + ':close" href="Javascript:void(0);">';
        buffer += '�ڍ׏��������';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // �ڍ�
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(3) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("sortType", "whiteSelect"); // �T�����̕\�����ݒ�
        buffer += outConditionSelect("priceType", "greenSelect"); // �T�����̗����ݒ�
        buffer += '</div>';
        buffer += '</div>';

        // �_�C���o�H
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">�_�C���o�H</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(4) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(4) + ':open" href="Javascript:void(0);">';
        buffer += '�ڍ׏������J��';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(4) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(4) + ':close" href="Javascript:void(0);">';
        buffer += '�ڍ׏��������';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // �ڍ�
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(4) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("transferTime", "whiteSelect"); // �抷������
        buffer += '</div>';
        buffer += '</div>';

        // ���όo�H
        buffer += '<div class="exp_conditionSection">';
        buffer += '<div class="exp_title">���όo�H</div>';
        buffer += '<div class="exp_detailButton exp_clearfix">';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(5) + ':active">';
        buffer += '<a class="exp_visible" id="' + baseId + ':conditionSection:' + String(5) + ':open" href="Javascript:void(0);">';
        buffer += '�ڍ׏������J��';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '<div id="' + baseId + ':conditionSection:' + String(5) + ':none" style="display:none;">';
        buffer += '<a class="exp_hidden" id="' + baseId + ':conditionSection:' + String(5) + ':close" href="Javascript:void(0);">';
        buffer += '�ڍ׏��������';
        buffer += '</a>';
        buffer += '</div>';
        buffer += '</div>';
        // �ڍ�
        buffer += '<div id="' + baseId + ':conditionGroup:' + String(5) + '" class="exp_conditionGroup exp_clearfix" style="display:none;">';
        buffer += '<div class="exp_line exp_clearfix">';
        buffer += '<div class="exp_left"></div><div class="exp_right"></div>';
        buffer += '</div>';
        buffer += outConditionSelect("walk", "whiteSelect"); // �w�ԓk��
        buffer += outConditionSelect("useJR", "greenSelect"); // JR�H��
        buffer += outConditionSelect("expressStartingStation", "whiteSelect"); // ���}�n���w
        buffer += outConditionSelect("waitAverageTime", "greenSelect"); // �o���w���
        buffer += outConditionSelect("localBusOnly", "whiteSelect"); // �H���o�X�̂ݒT��
        buffer += outConditionSelect("transfer", "greenSelect"); // �抷��
        buffer += '</div>';
        buffer += '</div>';

        // �B���^�u
        buffer += '<div style="display:none;">';
        // �V����
        buffer += outConditionSelect("shinkansen");
        // �V�����̂���
        buffer += outConditionSelect("shinkansenNozomi");
        // �L�����}
        buffer += outConditionSelect("limitedExpress");
        // �H���o�X
        buffer += outConditionSelect("localBus");
        // �L�����ʗ��
        buffer += outConditionSelect("liner");
        // �[��}�s�o�X
        buffer += outConditionSelect("midnightBus");
        // �H���������܂��w��
        //  buffer += outConditionSelect("fuzzyLine");
        // �o�R�w�w��̌p��
        //  buffer += outConditionSelect("entryPathBehavior");
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
            if (eventIdList[1] == "conditionTab" && eventIdList.length == 3) {
                // �^�u�̑I��
                var tabCount = 1;
                while (document.getElementById(baseId + ":conditionTab:" + String(tabCount))) {
                    if (tabCount == parseInt(eventIdList[2])) {
                        document.getElementById(baseId + ':conditionGroup:' + String(tabCount)).style.display = "block";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':active').style.display = "block";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':none').style.display = "none";
                    } else {
                        document.getElementById(baseId + ':conditionGroup:' + String(tabCount)).style.display = "none";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':active').style.display = "none";
                        document.getElementById(baseId + ':conditionTab:' + String(tabCount) + ':none').style.display = "block";
                    }
                    tabCount++;
                }
            } else if (eventIdList[1] == "conditionOpen") {
                // �T���������J��
                document.getElementById(baseId + ':conditionDetail').style.display = "block";
            } else if (eventIdList[1] == "conditionClose") {
                document.getElementById(baseId + ':conditionDetail').style.display = "none";
                // �ȈՐݒ�̃f�t�H���g���ݒ�
                setSimpleCondition();
            } else if (eventIdList[2] == "checkbox" && eventIdList.length == 3) {
                if (document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox').checked) {
                    // �I���̎�
                    setValue(eventIdList[1], document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox').value);
                    // �ǉ��A������
                    if (eventIdList[1].toLowerCase() == String("shinkansenNozomi").toLowerCase()) {
                        setValue("shinkansen", document.getElementById(baseId + ':' + 'shinkansen:checkbox').value);
                        setSimpleCondition();
                    }
                } else {
                    // �I�t�̎�
                    setValue(eventIdList[1], document.getElementById(baseId + ':' + eventIdList[1] + ':checkbox:none').value);
                    // �ǉ��A������
                    if (eventIdList[1] == "shinkansen") {
                        setValue("shinkansenNozomi", document.getElementById(baseId + ':' + String('shinkansenNozomi').toLowerCase() + ':checkbox:none').value);
                        setSimpleCondition();
                    }
                }
            } else if (eventIdList[1] == "conditionSection" && eventIdList.length == 4) {
                // �X�}�[�g�t�H���p�̑I��
                if (eventIdList[3] == "open") {
                    // �^�u���J��
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':active').style.display = "none";
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':none').style.display = "block";
                    document.getElementById(baseId + ':conditionGroup:' + eventIdList[2]).style.display = "block";
                } else if (eventIdList[3] == "close") {
                    // �^�u�����
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':active').style.display = "block";
                    document.getElementById(baseId + ':conditionSection:' + eventIdList[2] + ':none').style.display = "none";
                    document.getElementById(baseId + ':conditionGroup:' + eventIdList[2]).style.display = "none";
                }
            } else {
                // �T�������̕ύX
                if (eventIdList[1].toLowerCase() == String("ticketSystemType").toLowerCase()) {
                    // ��Ԍ��v�Z�̃V�X�e��
                    if (getValue("ticketSystemType") == "normal") {
                        setValue("preferredTicketOrder", "none");
                    }
                } else if (eventIdList[1].toLowerCase() == String("preferredTicketOrder").toLowerCase()) {
                    // �D�悷���Ԍ��̏���
                    if (getValue("preferredTicketOrder") != "none") {
                        setValue("ticketSystemType", "ic");
                    }
                }
            }
        }
    }

    /*
    * �Z�p���[�^���o��
    */
    function outSeparator(id) {
        id = id.toLowerCase();
        var buffer = "";
        buffer += '<div class="exp_separator" id="' + baseId + ':' + id + ':separator"></div>';
        return buffer;
    }

    /*
    * �T�������̍��ڏo��
    */
    function outConditionSelect(id, classType) {
        id = id.toLowerCase();
        var buffer = "";
        buffer = '<div id="' + baseId + ':' + id + ':condition" style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        if (typeof classType == 'undefined') {
            buffer += '<dl class="exp_conditionItemList">';
        } else {
            buffer += '<dl class="exp_conditionItemList exp_' + classType + '">';
        }
        buffer += '<dt class="exp_conditionHeader" id="' + baseId + ':' + id + ':title">' + conditionObject[id].name + '</dt>';
        buffer += '<dd class="exp_conditionValue" id="' + baseId + ':' + id + ':value">';
        buffer += '<select id="' + baseId + ':' + id + '">';
        for (var i = 0; i < conditionObject[id].option.length; i++) {
            buffer += '<option value="' + conditionObject[id].value[i] + '">' + conditionObject[id].option[i] + '</option>';
        }
        buffer += '</select>';
        buffer += '</dd>';
        buffer += '</dl>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * �T�������̍��ڏo��
    */
    function outConditionRadio(id, classType) {
        id = id.toLowerCase();
        var buffer = "";
        buffer = '<div id="' + baseId + ':' + id + ':condition" style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        if (typeof classType == 'undefined') {
            buffer += '<dl class="exp_conditionItemList">';
        } else {
            buffer += '<dl class="exp_conditionItemList exp_' + classType + '">';
        }
        buffer += '<dt class="exp_conditionHeader" id="' + baseId + ':' + id + ':title">' + conditionObject[id].name + '</dt>';
        if (id == "answercount" || id == "sorttype") {
            buffer += '<dd class="exp_conditionValueMulti" id="' + baseId + ':' + id + ':value">';
        } else {
            buffer += '<dd class="exp_conditionValue" id="' + baseId + ':' + id + ':value">';
        }
        buffer += '<div>';
        for (var i = 0; i < conditionObject[id].option.length; i++) {
            // ���s����
            if (i > 0) {
                if (id == "answerCount" && i % 10 == 0) { buffer += '</div><span class="exp_separator"></span><div>'; }
                if (id == "sortType" && i % 5 == 0) { buffer += '</div><span class="exp_separator"></span><div>'; }
            }
            if (i == 0) {
                buffer += '<span class="exp_conditionItemLeft">';
            } else if ((i + 1) == conditionObject[id].option.length) {
                buffer += '<span class="exp_conditionItemRight">';
            } else {
                buffer += '<span class="exp_conditionItem">';
            }
            buffer += '<input type="radio" id="' + baseId + ':' + id + ':' + String(i + 1) + '" name="' + baseId + ':' + id + '" value="' + conditionObject[id].value[i] + '"><label for="' + baseId + ':' + id + ':' + String(i + 1) + '">' + conditionObject[id].option[i] + '</label></span>';
        }
        buffer += '</div>';
        buffer += '</dd>';
        buffer += '</dl>';
        buffer += '</div>';
        return buffer;
    }

    /*
    * �T�������̍��ڏo��
    */
    function outConditionCheckbox(id, value, none, label) {
        // �ȈՏ����̃��X�g�ɓ����
        id = id.toLowerCase();
        checkboxItem.push(id);
        var buffer = "";
        buffer += '<div id="' + baseId + ':' + id + ':simple" class="exp_item" style="display:' + (conditionObject[id].visible ? 'block;' : 'none;') + '">';
        buffer += '<input type="checkbox" id="' + baseId + ':' + id + ':checkbox" value="' + value + '"><label for="' + baseId + ':' + id + ':checkbox">' + ((typeof label != 'undefined') ? label : conditionObject[id].name) + '</label>';
        if (typeof none != 'undefined') {
            buffer += '<input type="hidden" id="' + baseId + ':' + id + ':checkbox:none" value="' + none + '">';
        }
        buffer += '</div>';
        return buffer;
    }

    /*
    * �\�[�g���̎擾
    */
    function getSortType() {
        return getValue("sortType");
    }

    /*
    * �T�����ʐ��̎擾
    */
    function getAnswerCount() {
        return getValue("answerCount");
    }

    /*
    * �T������������̎擾
    */
    function getConditionDetail() {
        return fixCondition();
    }

    /*
    * �Г��E�����E����̃t���O�擾
    */
    function getPriceType() {
        return getValue("priceType");
    }

    /*
    * �T���������t�H�[���ɃZ�b�g����
    */
    function setCondition(param1, param2, priceType, condition) {
        if (isNaN(param1)) {
            // �P�ƂŎw��
            setValue(param1, String(param2));
        } else {
            // �S���w��
            // �w�b�_����
            setValue("answerCount", String(param1));
            setValue("sortType", String(param2));
            setValue("priceType", String(priceType));
            var conditionList_t, conditionList_f, conditionList_a;
            var condition_split = condition.split(':');
            for (var i = 0; i < condition_split.length; i++) {
                if (condition_split[i].length > 0) {
                    if (condition_split[i].substring(0, 1) == "T") {
                        conditionList_t = condition_split[i].split('');
                    } else if (condition_split[i].substring(0, 1) == "F") {
                        conditionList_f = condition_split[i].split('');
                    } else if (condition_split[i].substring(0, 1) == "A") {
                        conditionList_a = condition_split[i].split('');
                    }
                }
            }
            // �T������(T)
            setValue("plane", parseInt(conditionList_t[1]));
            setValue("shinkansen", parseInt(conditionList_t[2]));
            setValue("shinkansenNozomi", parseInt(conditionList_t[3]));
            setValue("sleeperTrain", parseInt(conditionList_t[4]));
            setValue("limitedExpress", parseInt(conditionList_t[5]));
            setValue("highwayBus", parseInt(conditionList_t[6]));
            setValue("connectionBus", parseInt(conditionList_t[7]));
            setValue("localBus", parseInt(conditionList_t[8]));
            setValue("ship", parseInt(conditionList_t[9]));
            setValue("liner", parseInt(conditionList_t[10]));
            setValue("walk", parseInt(conditionList_t[11]));
            setValue("midnightBus", parseInt(conditionList_t[12]));
            // 13:�Œ�
            // �T������(F)
            setValue("surchargeKind", parseInt(conditionList_f[1]));
            setValue("teikiKind", parseInt(conditionList_f[2]));
            setValue("JRSeasonalRate", parseInt(conditionList_f[3]));
            setValue("studentDiscount", parseInt(conditionList_f[4]));
            //  setValue("airFare",parseInt(conditionList_f[5]));(�Œ�)
            setValue("includeInsurance", parseInt(conditionList_f[6]));
            setValue("ticketSystemType", parseInt(conditionList_f[7]));
            setValue("nikukanteiki", parseInt(conditionList_f[8]));
            // 9:�Œ�
            setValue("preferredTicketOrder", parseInt(conditionList_f[10]));
            // �T������(A)
            setValue("useJR", parseInt(conditionList_a[1]));
            setValue("transfer", parseInt(conditionList_a[2]));
            setValue("expressStartingStation", parseInt(conditionList_a[3]));
            setValue("waitAverageTime", parseInt(conditionList_a[4]));
            setValue("localBusOnly", parseInt(conditionList_a[5]));
            //  setValue("fuzzyLine",parseInt(conditionList_a[6]));(�Œ�)
            setValue("transferTime", parseInt(conditionList_a[7]));
            //  setValue("entryPathBehavior",parseInt(conditionList_a[8]));(�Œ�)
        }
        setSimpleCondition();
    }

    /*
    * �t�H�[���ɒl���Z�b�g����
    */
    function setValue(id, value) {
        var name = id.toLowerCase();
        if (document.getElementById(baseId + ':' + name)) {
            if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                // �Z���N�g�{�b�N�X
                if (value == "0") {
                    setSelect(name, "none");
                } else if (typeof value == 'number') {
                    setSelectIndex(name, value);
                } else {
                    setSelect(name, value);
                }
                return;
            }
        }
        // ���W�I�{�^��
        if (value == "0") {
            setRadio(name, "none");
        } else if (typeof value == 'number') {
            setRadioIndex(name, value);
        } else {
            setRadio(name, value);
        }
    }

    /*
    * ���W�I�{�^�����C���f�b�N�X�Ŏw�肷��
    */
    function setRadioIndex(name, value) {
        document.getElementsByName(baseId + ':' + name)[(document.getElementsByName(baseId + ':' + name).length - value)].checked = true;
    }
    /*
    * ���W�I�{�^����l�Ŏw�肷��
    */
    function setRadio(name, value) {
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {
            if (document.getElementsByName(baseId + ':' + name)[i].value == String(value)) {
                document.getElementsByName(baseId + ':' + name)[i].checked = true;
            }
        }
    }

    /*
    * �Z���N�g�{�b�N�X���C���f�b�N�X�Ŏw�肷��
    */
    function setSelectIndex(name, value) {
        document.getElementById(baseId + ':' + name).selectedIndex = (document.getElementById(baseId + ':' + name).options.length - value);
    }

    /*
    * �Z���N�g�{�b�N�X��l�Ŏw�肷��
    */
    function setSelect(name, value) {
        for (var i = 0; i < document.getElementById(baseId + ':' + name).options.length; i++) {
            if (document.getElementById(baseId + ':' + name)[i].value == String(value)) {
                document.getElementById(baseId + ':' + name).selectedIndex = i;
                return;
            }
        }
    }
    /*
    * �T�������̊m��
    */
    function fixCondition() {
        var conditionList_t = def_condition_t.split('');
        // �T������(T)
        conditionList_t[1] = getValueIndex("plane", parseInt(conditionList_t[1]));
        conditionList_t[2] = getValueIndex("shinkansen", parseInt(conditionList_t[2]));
        conditionList_t[3] = getValueIndex("shinkansenNozomi", parseInt(conditionList_t[3]));
        conditionList_t[4] = getValueIndex("sleeperTrain", parseInt(conditionList_t[4]));
        conditionList_t[5] = getValueIndex("limitedExpress", parseInt(conditionList_t[5]));
        conditionList_t[6] = getValueIndex("highwayBus", parseInt(conditionList_t[6]));
        conditionList_t[7] = getValueIndex("connectionBus", parseInt(conditionList_t[7]));
        conditionList_t[8] = getValueIndex("localBus", parseInt(conditionList_t[8]));
        conditionList_t[9] = getValueIndex("ship", parseInt(conditionList_t[9]));
        conditionList_t[10] = getValueIndex("liner", parseInt(conditionList_t[10]));
        conditionList_t[11] = getValueIndex("walk", parseInt(conditionList_t[11]));
        conditionList_t[12] = getValueIndex("midnightBus", parseInt(conditionList_t[12]));
        // 13:�Œ�
        // �T������(F)
        var conditionList_f = def_condition_f.split('');
        conditionList_f[1] = getValueIndex("surchargeKind", parseInt(conditionList_f[1]));
        conditionList_f[2] = getValueIndex("teikiKind", parseInt(conditionList_f[2]));
        conditionList_f[3] = getValueIndex("JRSeasonalRate", parseInt(conditionList_f[3]));
        conditionList_f[4] = getValueIndex("studentDiscount", parseInt(conditionList_f[4]));
        //  conditionList_f[5] = getValueIndex("airFare",parseInt(conditionList_f[5]));
        conditionList_f[6] = getValueIndex("includeInsurance", parseInt(conditionList_f[6]));
        conditionList_f[7] = getValueIndex("ticketSystemType", parseInt(conditionList_f[7]));
        conditionList_f[8] = getValueIndex("nikukanteiki", parseInt(conditionList_f[8]));
        // 9:�Œ�
        conditionList_f[10] = getValueIndex("preferredTicketOrder", parseInt(conditionList_f[10]));
        // �T������(A)
        var conditionList_a = def_condition_a.split('');
        conditionList_a[1] = getValueIndex("useJR", parseInt(conditionList_a[1]));
        conditionList_a[2] = getValueIndex("transfer", parseInt(conditionList_a[2]));
        conditionList_a[3] = getValueIndex("expressStartingStation", parseInt(conditionList_a[3]));
        conditionList_a[4] = getValueIndex("waitAverageTime", parseInt(conditionList_a[4]));
        conditionList_a[5] = getValueIndex("localBusOnly", parseInt(conditionList_a[5]));
        //  conditionList_a[6] = getValueIndex("fuzzyLine",parseInt(conditionList_a[6]));
        conditionList_a[7] = getValueIndex("transferTime", parseInt(conditionList_a[7]));
        //  conditionList_a[8] = getValueIndex("entryPathBehavior",parseInt(conditionList_a[8]));

        // �ݒ�l
        var tmpCondition = conditionList_t.join('') + ":" + conditionList_f.join('') + ":" + conditionList_a.join('') + ":";
        return tmpCondition;
    }

    /*
    * �t�H�[���̒l���擾����
    */
    function getValue(id) {
        var name = id.toLowerCase();
        if (document.getElementById(baseId + ':' + name)) {
            if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                // �Z���N�g�{�b�N�X
                return getSelect(name);
            } else {
                // ���W�I�{�^��
                return getRadio(name);
            }
        } else {
            // ���W�I�{�^��
            return getRadio(name);
        }
    }
    /*
    * ���W�I�{�^���̒l���擾
    */
    function getRadio(name) {
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {
            if (document.getElementsByName(baseId + ':' + name)[i].checked == true) {
                return document.getElementsByName(baseId + ':' + name)[i].value;
            }
        }
        return null;
    }
    /*
    * �Z���N�g�{�b�N�X�̒l���擾
    */
    function getSelect(name) {
        return document.getElementById(baseId + ':' + name).options.item(document.getElementById(baseId + ':' + name).selectedIndex).value;
    }

    /*
    * �t�H�[���̃C���f�b�N�X���擾����
    */
    function getValueIndex(id) {
        var name = id.toLowerCase();
        if (getValue(id) == "none") {
            return 0;
        } else {
            if (document.getElementById(baseId + ':' + name)) {
                if (typeof document.getElementById(baseId + ':' + name).length != 'undefined') {
                    // �Z���N�g�{�b�N�X
                    return getSelectIndex(name);
                }
            }
            // ���W�I�{�^��
            return getRadioIndex(name);
        }
    }
    /*
    * ���W�I�{�^���̃C���f�b�N�X���擾
    */
    function getRadioIndex(name) {
        var index = document.getElementsByName(baseId + ':' + name).length;
        for (var i = 0; i < document.getElementsByName(baseId + ':' + name).length; i++) {
            if (document.getElementsByName(baseId + ':' + name)[i].checked) {
                return (index - i);
            }
        }
    }
    /*
    * �Z���N�g�{�b�N�X�̃C���f�b�N�X���擾
    */
    function getSelectIndex(name) {
        return (document.getElementById(baseId + ':' + name).options.length - document.getElementById(baseId + ':' + name).selectedIndex)
    }

    /*
    * �f�t�H���g��ݒ�
    */
    function resetCondition() {
        var def_condition = def_condition_t + ":" + def_condition_f + ":" + def_condition_a + ":";
        setCondition(def_answerCount, def_sortType, def_priceType, def_condition);
    }

    /*
    * ���ݒ�
    */
    function setConfigure(name, value) {
        if (name.toLowerCase() == String("apiURL").toLowerCase()) {
            apiURL = value;
        } else if (name.toLowerCase() == String("agent").toLowerCase()) {
            agent = value;
        } else if (value.toLowerCase() == "visible") {
            conditionObject[name.toLowerCase()].visible = true;
            // �T�������̕\��
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':separator')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':separator').style.display = "block";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':condition')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':condition').style.display = "block";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':simple')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':simple').style.display = "block";
            }
        } else if (value.toLowerCase() == "hidden") {
            conditionObject[name.toLowerCase()].visible = false;
            // �T�������̔�\��
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':separator')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':separator').style.display = "none";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':condition')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':condition').style.display = "none";
            }
            if (document.getElementById(baseId + ':' + name.toLowerCase() + ':simple')) {
                document.getElementById(baseId + ':' + name.toLowerCase() + ':simple').style.display = "none";
            }
        }
    }

    /*
    * �T���������擾
    */
    function getCondition(id) {
        return getValue(id.toLowerCase());
    }

    /*
    * �ȈՒT���������擾
    */
    function getConditionLight(id) {
        if (getValue(id.toLowerCase()) == "normal") {
            return true;
        } else {
            return false;
        }
    }

    /*
    * ���p�ł���֐����X�g
    */
    this.dispCondition = dispCondition;
    this.dispConditionSimple = dispConditionSimple;
    this.dispConditionLight = dispConditionLight;
    this.getPriceType = getPriceType;
    this.getConditionDetail = getConditionDetail;
    this.getAnswerCount = getAnswerCount;
    this.getSortType = getSortType;
    this.getCondition = getCondition;
    this.getConditionLight = getConditionLight;
    this.setCondition = setCondition;
    this.resetCondition = resetCondition; ;
    this.setConfigure = setConfigure;

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

    this.CONDITON_ANSWERCOUNT = "answerCount";
    this.CONDITON_SORTTYPE = "sortType";
    this.CONDITON_PRICETYPE = "priceType";
    this.CONDITON_PLANE = "plane";
    this.CONDITON_SHINKANSEN = "shinkansen";
    this.CONDITON_SHINKANSENNOZOMI = "shinkansenNozomi";
    this.CONDITON_SLEEPERTRAIN = "sleeperTrain";
    this.CONDITON_LIMITEDEXPRESS = "limitedExpress";
    this.CONDITON_HIGHWAYBUS = "highwayBus";
    this.CONDITON_CONNECTIONBUS = "connectionBus";
    this.CONDITON_LOCALBUS = "localBus";
    this.CONDITON_SHIP = "ship";
    this.CONDITON_LINER = "liner";
    this.CONDITON_WALK = "walk";
    this.CONDITON_MIDNIGHTBUS = "midnightBus";
    this.CONDITON_SURCHARGEKIND = "surchargeKind";
    this.CONDITON_TEIKIKIND = "teikiKind";
    this.CONDITON_JRSEASONALRATE = "JRSeasonalRate";
    this.CONDITON_STUDENTDISCOUNT = "studentDiscount";
    //this.CONDITON_AIRFARE = "airFare";
    this.CONDITON_INCLUDEINSURANCE = "includeInsurance";
    this.CONDITON_TICKETSYSTEMTYPE = "ticketSystemType";
    this.CONDITON_NIKUKANTEIKI = "nikukanteiki";
    this.CONDITON_USEJR = "useJR";
    this.CONDITON_TRANSFER = "transfer";
    this.CONDITON_EXPRESSSTARTINGSTATION = "expressStartingStation";
    this.CONDITON_WAITAVERAGETIME = "waitAverageTime";
    this.CONDITON_LOCALBUSONLY = "localBusOnly";
    //this.CONDITON_FUZZYLINE = "fuzzyLine";
    this.CONDITON_TRANSFERTIME = "transferTime";
    //this.CONDITON_ENTRYPATHBEHAVIOR = "entryPathBehavior";
    this.CONDITON_PREFERREDTICKETORDER = "preferredTicketOrder";

    // �[������
    this.AGENT_PC = 1;
    this.AGENT_PHONE = 2;
    this.AGENT_TABLET = 3;
};
