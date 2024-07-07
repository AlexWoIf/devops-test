function EditUserName() {
    $('.edit-user-name span, .edit-user-name a').hide();
    var d = document.createElement("div");
    $(d).addClass("edit").css("display", "none").html("<input type='text' id='txtusername' class='otp-textbox otp-textbox-mini' maxlength='50'/><a onclick='SaveUserName()'><i class='icon-main-check'></i></a><a onclick='CancelEditUserName()'><i class='icon-main-close'></i></a>");
    $('.edit-user-name').append(d);
    $(d).fadeIn();
}
function SaveUserName() {
    if ($('.edit-user-name .edit input').val() == "") {
        CancelEditUserName();
        return;
    }
    $('.edit-user-name .edit').hide();
    var img = document.createElement("img");
    $(img).attr("src", "/images/loaders/line.gif");
    $('.edit-user-name').append(img);
    $.post("/Service/" + $('.edit-user-name').attr('cmppage') + ".aspx?cmd=saveusername&id=" + $('#achangeusername').attr('uid') + "&lng=" + $('#achangeusername').attr('lng'), $('.edit-user-name .edit input').val())
        .done(function (data) {
            if (data == "OK") {
                $('#susername').html($('.edit-user-name .edit input').val());
                $('#scertusername').html($('.edit-user-name .edit input').val());
            }
            CancelEditUserName();
        });
}
function CancelEditUserName() {
    $('.edit-user-name .edit').remove();
    $('.edit-user-name img').remove();
    $('.edit-user-name span, .edit-user-name a').fadeIn();
}

function closeWindow() {
    window.close();
}

function OnClickRadio(rb) {
    var p = $(rb).parent().parent().parent().parent();
    var lastvalue = $(p).attr("lastvalue");
    var curvalue = $(rb).attr("value");
    var arr = $.grep($("input[type=radio]"), function (e) { return $(e).attr("name") == $(rb).attr("name"); });
    $.each(arr, function (i, e) {
        e.checked = false;
        $(e).parent().children(".indicator").removeClass("icon-main-rb-checked").addClass('icon-main-rb');
        SetEnabledTextBoxRadioCheck(e, false);
    });
    if (lastvalue != curvalue) {
        rb.checked = true;
        $(rb).parent().children(".indicator").removeClass("icon-main-rb").addClass('icon-main-rb-checked');
        SetEnabledTextBoxRadioCheck(rb, true);
    }
    else {
        curvalue = "";
    }

    $(p).attr("lastvalue", curvalue);
}
function SetEnabledTextBoxRadioCheck(e, enabled) {
    if ($(e).parent().find("input[type=text]").length !== 0) {
        var txt = $(e).parent().find("input[type=text]")[0];
        if (enabled) {
            $(txt).removeAttr("disabled").focus();
        }
        else
            $(txt).attr("disabled", "disabled");
    }
}
function OnClickCheck(chk) {
    if (chk.checked) {
        var chkContainer = $(chk).parent().parent().parent();
        if (chkContainer.prop('nodeName').toString().toLocaleLowerCase() == 'td')
            chkContainer = $(chk).parent().parent().parent().parent();;
        var chkContainerMaxCnt = parseInt($(chkContainer).attr('maxcnt')) || 0;
        var chkContainerCurCnt = chkContainer.find('input[type=checkbox]:checked').length;
        if (chkContainerCurCnt <= chkContainerMaxCnt || chkContainerMaxCnt === 0) {
            $(chk).parent().children(".indicator").switchClass('icon-main-chk', 'icon-main-chk-checked');
            SetEnabledTextBoxRadioCheck(chk, true);
        } else {
            chk.checked = false;
        }
    }
    else {
        $(chk).parent().children(".indicator").switchClass('icon-main-chk-checked', 'icon-main-chk');
        SetEnabledTextBoxRadioCheck(chk, false);
    }
}
function preventSelectChanges(ctrlId) {
    $.each($('#' + ctrlId).find('select'), function (i, sel) {
        $(sel).attr('curIndex', $(sel).val());
        $(sel).change(function (ev) {
            $(sel).val($(sel).attr('curIndex'));
        });
    })
}
function SetSequencing(id, callback) {
    $('#' + id).sortable({
        placeholer: "sequencing-ul-placeholder",
        stop: function (event, ui) { SortableChanged(event, ui, callback); }
    });
    $('#' + id).disableSelection();
    var arr = $('#' + id).children('li');
    var arrNew = [];
    for (i = 0; i < arr.length; i++) {
        $.each(arr, function (j, e) {
            var s = $(e).find('select')[0];
            if ($(s).val() == i + 1 || i == 0) {
                arrNew.push(e);
                arr.remove(e);
            }
        });
    }
    $('#' + id).empty();
    $.each(arrNew, function (i, e) { $('#' + id).append(e); });
}

function SortableChanged(event, ui, callback) {
    var ul = $(ui.item).parent();
    $.each($(ul).children("li"), function (i, e) {
        var sel = $(e).find("select");
        $.each($(sel).children("option"), function (j, o) {
            $(o).removeAttr('selected');
            if ($(o).attr("value") == (i + 1))
                $(sel).val(i + 1);
        });
    });
    if (callback)
        callback();
}
function SortableSelectIndexChanged(sel) {
    if ($(sel).val() == 0)
        return;
    var li = $(sel).parent().parent().parent().parent().parent();
    var ul = $(li).parent();
    $(li).remove();
    var selectedIndex = parseInt($(sel).val());
    if (selectedIndex == 1)
        $($(ul).children("li")[0]).before(li);
    else if (selectedIndex == $(ul).children("li").length + 1)
        $(ul).append(li);
    else
        $($(ul).children("li")[selectedIndex - 1]).before(li);
    SortableChanged(null, { item: $(sel).parent().parent().parent().parent().parent() });
}
function ShowTextboxOnMinusOneItemValue(ddl) {
    if ($(ddl).val() == "-1")
        $(ddl).parent().children("input[type=text]").fadeIn("200");
    else
        $(ddl).parent().children("input[type=text]").fadeOut("200");
}

function OnInputDigitTextChanged(txt) {
    var str = $(txt).val();
    $(txt).css("border-color", "");
    if (str == "")
        return;
    if (str.endsWith(".") || str.endsWith(",")) {
        str = str.substr(0, str.length - 1);
        $(txt).val(str);
    }
    if (!str.match(/^-?[0-9]+([.,]{0,1}[0-9]*){0,1}$/)) {
        $(txt).css("border-color", "red");
    }
}
function OnInteractiveDictationItemClick(el) {
    CloseInteractiveDictationItems();
    $(document).off("click");
    var p = $(el).parent().position();
    var d = $(el).parent().children("div.container");
    $(d).css("left", (p.left + $(el).parent().width() / 2 - $(d).width() / 2 - 2) + "px");
    $(d).css("top", (p.top + $(el).parent().height()) + "px");
    $(el).parent().children("div").fadeIn(200, function () {
        $(document).one("click", function () {
            CloseInteractiveDictationItems();
        })
        if ($(this).attr("dsbld") == "1") {
            $("#" + $(d).attr("id") + " input[type=radio]").on("click", function () {
                return false;
            })
        }
        else {
            $(d).find("label").off("click").on("click", function () {
                $(d).parent().children(".lbl").html($(this).html());
                $(d).parent().css("background-color", "transparent");
                $(d).parent().css("border", "");
            })
        }
    });
}
function CloseInteractiveDictationItems() {
    $(".otp-inter-dict div.container").hide();
}

function OnConsistentExceptionItemClick(d) {
    var num = parseInt($(d).parent().attr("lastnum")) + 1;
    $("#h" + $(d).attr("id")).val(num);
    $(d).css("display", "none");
    $(d).parent().attr("lastnum", num);
}

function OnNavButtonClick(btn) {
    var clicked = $(btn).attr("clicked");
    if (clicked == "1") {
        return false;
    }
    $("#" + $(btn).attr("spinner")).css("display", "inline-block")
    $(btn).attr("clicked", "1");
    disableNavButtons();
    $(btn).prop('disabled', false);
    return true;
}
function OnMoveButtonClick(btn) {
    var clicked = $(btn).attr("clicked");
    if (clicked == "1") {
        return false;
    }
    $("#" + $(btn).attr("spinner")).css("display", "inline-block")
    $(btn).parent().parent().parent().find("input").attr("clicked", "1");
    disableNavButtons();
    $(btn).prop('disabled', false);
    return true;
}
function disableNavButtons() {
    $('#btnNext, #btnFinish, #btnNextOnTimeLimit, #btnFinishOnTimeLimit').prop('disabled', true);
    $('.otp-t-view-question .popupqlst input').prop('disabled', true);
}

function OnConfirmButtonClick(btn) {
    if ($(btn).attr("action") == "true")
        return true;
    var modal = openModalForm();
    $(modal).removeClass('animated fadeIn');
    $(modal).find('.wnd').addClass("animated-faster zoomIn").css("width", "300px").html(
        '<div class="wnd-text">' +
		'    <span>' + $(btn).attr('conftext') + '</span>' +
	    '</div>' +
	    '<div class="wnd-btn">' +
		'    <input type="button" class="btn btn-link" style="color:#aaa" value="Отмена">' +
		'    <input type="button" class="btn btn-secondary" value="Да">' +
	    '</div>');

    $(modal).find(".wnd-btn .btn-link").on("click", function () {
        closeModalForm();
    });
    $(modal).find(".wnd-btn .btn-secondary").on("click", function () {
        closeModalForm();
        setTimeout(function () {
            $(btn).attr("action", "true").click();
            if ($(btn).attr("spinner") != undefined)
                $("#" + $(btn).attr("spinner")).css("display", "inline-block")
            disableNavButtons();
        }, 200);
    });
    SetComfirmActionPanelPosition();
    return false;   
}
function SetComfirmActionPanelPosition() {
    var winwidth; var winheight; var panel;
    if ('innerHeight' in window) { winheight = window.innerHeight; } else { winheight = document.documentElement.clientHeight; }
    $('.otp-modal .content').css("top", ((winheight - $('.otp-modal .wnd').height()) / 2) + 'px');
}

var sendHeight = function () {
    var target = parent.postMessage ? parent : (parent.document.postMessage ? parent.document : undefined);
    if (typeof target != "undefined" && document.body.scrollHeight) {
        target.postMessage($("body").children("div").height(), "*");
    }
};
function TimerCountUp() {
    if (localbegintime == 0) {
        $("#dtime").html("00:00");
    }
    else {
        if ($("#hLocalBeginTime").length > 0) {
            $("#dtime").html("00:00");
            return;
        }
        var diff = new Date(new Date().getTime() - localbegintime);

        seconds = Math.round((new Date().getTime() - localbegintime) / 1000);
        minutes = Math.floor(seconds / 60);
        seconds = seconds - minutes * 60;
        if (minutes < 10)
            minutes = '0' + minutes;
        if (seconds < 10)
            seconds = '0' + seconds;

        $("#dtime").html(minutes + ":" + seconds);
        setTimeout('TimerCountUp()', 500);
    }
}
function TimerCountDown() {
    var secLeft;
    if (localbegintime == 0) {
        secLeft = timelimitseconds;
    }
    else {
        if ($("#hLocalBeginTime").length > 0) {
            secLeft = timelimitseconds;
        }
        else {
            var secondsPassed = Math.round((new Date().getTime() - localbegintime) / 1000);
            secLeft = timelimitseconds - secondsPassed;
        }
        setTimeout('TimerCountDown()', 500);
    }

    if (secLeft > 0) {
        
        var hours = Math.floor(secLeft / (60 * 60)); var hoursStr = '';
        var minutes = Math.floor((secLeft - 60 * 60 * hours) / 60);
        var seconds = secLeft - minutes * 60 - hours * 60 * 60;

        if (hours < 10)
            hoursStr = '0' + hours;
        else
            hoursStr = hours.toString();
        if (minutes < 10)
            minutes = '0' + minutes;
        if (seconds < 10)
            seconds = '0' + seconds;

        var timeStr = minutes + ":" + seconds;
        if (timelimitseconds >= 60 * 60 || hours > 0)
            timeStr = hoursStr + ':' + timeStr;
        $("#dtime").html(timeStr);
    }
    else {
        if ($('#btnFinishOnTimeLimit').attr("clicked") == "0") {
            $('#btnFinishOnTimeLimit').attr("clicked", "1");
            $('#btnFinishOnTimeLimit').click();
            disableNavButtons();
        }
    }
}
function OnSurveyPollVote(a) {
    setTimeout(function () {
        $('#btnFinish').click();
    }, 50);
}
function TimerQuestionCountDown() {
    var secLeft;
    if (localbeginquestiontime == 0) {
        localbeginquestiontime = new Date().getTime();
    }
 
    var diff = new Date(new Date().getTime() - localbeginquestiontime);
    var secondsPassed = new Date(diff).getMinutes() * 60 + new Date(diff).getSeconds();
    secLeft = timelimitquestionseconds - secondsPassed;

    var minutes = Math.floor(secLeft / 60);
    var seconds = secLeft - minutes * 60;
    if (minutes < 10)
        minutes = '0' + minutes;
    if (seconds < 10)
        seconds = '0' + seconds;

    $("#dqtime").html(minutes + ":" + seconds);
    $("#localbeginquestiontime").val(localbeginquestiontime);

    if (secLeft > 0) {
        setTimeout('TimerQuestionCountDown()', 100);
    }
    else {
        $("#" + $('#btnNextOnTimeLimit').attr("spinner")).css("display", "inline-block")
        $('#btnNextOnTimeLimit').click();
        disableNavButtons();
    }
}

function OnRatingVote() {
    $('.otp-rating-container-view').fadeOut("100", function () {
        $('.otp-rating-container-vote').fadeIn("100");
        $('#dratingprocess, #dcomplexityprocess').mousemove(function (e) {
            var cnt = $(this).attr("cnt");
            var d = e.pageX - $(this).offset().left;
            d = d * 100 / $(this).width();
            d = Math.ceil(d / cnt);
            $(this).find("div").css("width", (d * cnt) + "%");
            $(this).attr("cur", d);
        })
        $('#dratingprocess, #dcomplexityprocess').mouseout(function (e) {
            var sel = $(this).attr("sel");
            if (sel == "") {
                $(this).children().css("width", "0%");
                return;
            }
            $(this).attr("sel", sel);
            $(this).attr("cur", "");
            $(this).find("div").css("width", (parseInt(sel) * parseInt($(this).attr("cnt"))) + "%");
        })
        $('#dratingprocess, #dcomplexityprocess').click(function (e) {
            $(this).attr("sel", $(this).attr("cur"));
            $(this).find("div").addClass("otp-rating-click");
            setTimeout(function () { $('#dratingprocess, #dcomplexityprocess').find("div").removeClass("otp-rating-click"); }, 200);
        })
        $('#dlikeprocess').click(function (e) {
            if ($('#dlikeprocess').attr("sel") == "true") {
                $('#dlikeprocess').attr("sel", "false");
                $('#ilike').css("display", "none");
                $('#idislike').css("display", "");
            }
            else {
                $('#dlikeprocess').attr("sel", "true");
                $('#ilike').css("display", "");
                $('#idislike').css("display", "none");
            }
        })
    })
}
function OnRatingCancelVote() {
    $('.otp-rating-container-vote').fadeOut("100", function () { $('.otp-rating-container-view').fadeIn("100"); })
    $('#dratingprocess').off('mousemove').off('mouseout');
}
function SaveRatingVotes() {
    $('.otp-rating-container-vote').children().css("display", "none");
    $('.otp-rating-saving').fadeIn("200");
    $.post("/Service/" + $('.otp-rating-container').attr("cmdpage") + ".aspx?cmd=addrating&id=" + $('.otp-rating-container-vote').attr('uid1') + "&lng=" + $('.otp-rating-container-vote').attr('lng'),
            { uid: $('.otp-rating-container-vote').attr('uid2'), r: $('#dratingprocess').attr("sel"), c: $('#dcomplexityprocess').attr("sel"), l: $('#dlikeprocess').attr("sel") })
    .done(function (data) {
        var r = JSON.parse(data);
        $('.otp-rating-saving').remove();
        $('.otp-rating-container-vote').remove();
        $('.otp-rating-vote').remove();
        $('#dratingpercent').css("width", r.rp + "%");
        $('#dcomplexitypercent').css("width", r.cp + "%");
        $('#slike').html(r.l);
        $('#sdislike').html(r.dl);
        $('.otp-rating-container-view').fadeIn("200");
    });
}

function AddAlertSuccess(parent, label) {
    return AddAlertType(parent, label, "success", 2500);
}
function AddAlertSuccessNoClose(parent, label) {
    return AddAlertType(parent, label, "success", 0);
}
function AddAlertInfo(parent, label) {
    return AddAlertType(parent, label, "info", 2500);
}
function AddAlertWarning(parent, label) {
    return AddAlertType(parent, label, "warning", 2500);
}
function AddAlertDanger(parent, label) {
    return AddAlertType(parent, label, "danger", 2500);
}
function AddAlertType(parent, label, type, timeout) {
    var d = document.createElement("div");
    var id = "closealert" + Math.random().toString().replace("0.", "");
    $(d).html('<div class="alert alert-' + type + ' alert-dismissible"><button id="' + id + '" class="close" onclick="CloseElement(\'' + id + '\'); return false;" ><span>×</span></button>' + label + '</div>')
    $("#" + parent).append(d);
    if (timeout > 0)
        setTimeout("CloseElement('" + id + "')", timeout);
}
function CloseElement(el) {
    $("#" + el).parent().fadeOut("200", function () {
        $("#" + el).parent().remove();
    });
}

var resstat;
var curpage = 1;
function LoadResultStat() {
    $('.otp-res-stat .content').html('<img src= "/images/loaders/line.gif">')
    $.get('/Service' + '/' + $('.otp-res-stat').attr("cmdpage") + '.aspx?cmd=getresstat&id=' + $('.otp-res-stat .content').attr("uid1") + "&lng=" + $('.otp-res-stat .content').attr('lng'), function (data) {
        resstat = JSON.parse(data);
        $('#ashowresstat').hide();
        $('.otp-res-stat .content').empty();
        ShowUserResStatPage();
    })
}
function ShowUserResStatPage() {
    var index = -1; var stid = $('.otp-res-stat .content').attr("uid2");
    $.each(resstat, function (i, r) {
        if (r.id == stid)
            index = i;
    })
    var p = 1;
    if (index > 10)
        p = Math.ceil(index / 10);
    ShowResStatPage(p)
}
function ShowResStatPage(p) {
    var ispzero = false;
    if (p == "0") {
        var p = parseInt($('#txtresstatpage').val());
        if (isNaN(p))
            return;

        var max = Math.ceil(resstat.length / 10);
        if (p > max)
            p = max;
        ispzero = true;

        if (curpage == p)
            return;
    }
    curpage = p;
    var arr = [];
    var row = (curpage - 1) * 10;
    var count = curpage * 10;
    for (; row < count; row++) {
        if (row < resstat.length) {
            arr.push(resstat[row]);
        }
    }
    ShowResStatTable(arr);
    if (ispzero)
        $('#txtresstatpage').select();
}
function ShowResStatTable(arr) {
    var stid = $('.otp-res-stat .content').attr("uid2");
    var html = "<table>";
    html += "<tr class='h'><td>#</td><td>Пользователь</td><td>Дата<br/>завершения</td><td>Потрачено<br/>времени</td><td>Результ</td></tr>";
    for (var i = 0; i < arr.length; i++) {
        html += "<tr";
        if (arr[i].id == stid)
            html += " class='cur'";
        html += ">";
        html += "<td class='i'>" + arr[i].i + "</td>";
        if (arr[i].id == stid)
            html += "<td><span class='n'>Ваш результат</span></td>";
        else
            html += "<td><span class='n'>" + arr[i].n + "</span></td>";
        html += "<td><span class='et'>" + arr[i].et + "</span></td>";
        html += "<td><span class='pt'>" + arr[i].pt + "</span></td>";
        html += "<td class='p'>" + arr[i].p + "%</td>";
        html += "</tr>";
    }
    html += "</table>";

    var d = document.createElement("div");
    $(d).addClass("tbl").html(html);
    $('.otp-res-stat .content').empty().append(d);
    ShowResStatPager();
}
function ShowResStatPager() {
    var max = Math.ceil(resstat.length / 10);
    var cntL = 0; var cntR = 0;
    var arr = [0, 0, 0, 0, curpage, 0, 0, 0, 0];
    for (var i = 1; i <= 4; i++) {
        if (curpage - i >= 1) {
            arr[5 - i - 1] = curpage - i;
            cntL = cntL + 1;
        }
        if (curpage + i <= max) {
            arr[5 + i - 1] = curpage + i;
            cntR = cntR + 1;
        }
    }
    var maxindex = 0;
    for (var i = 0; i < 5; i++) {
        if (cntL + cntR >= 5) {
            if (cntL >= cntR) {
                arr[5 - cntL - 1] = 0;
                cntL = cntL - 1;
            }
            else {
                arr[5 + cntR - 1] = 0;
                cntR = cntR - 1;
            }
        }
    }
    var html = "<table class='w100'><tr><td class='ta-l'>";
    if ($('.otp-res-stat .content').attr("uid2") != "0")
        html += "<a class='mine' onclick='ShowUserResStatPage()'><i class='icon-main-wizard'></i></a>"
    html += "</td>";
    html += "<td><ul class='pagination-sm pagination-border pagination'>"
    html += GetResStatPagerA(1, '«', false);
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] > 0)
            html += GetResStatPagerA(arr[i], arr[i], arr[i] == curpage);
    }
    html += GetResStatPagerA(max, '»', false);
    html += "</ul></td>";
    html += "<td class='ta-r'>";
    html += "<input type='text' id='txtresstatpage' value='" + curpage + "' onkeyup='ShowResStatPage(0)' />";
    html += "</td></tr></table>"
    var d = document.createElement("div");
    $(d).addClass("pgr").html(html);
    $('.otp-res-stat .content').append(d);
}
function GetResStatPagerA(p, t, cur) {
    var curStr = "";
    if (cur)
        curStr = " active";
    return "<li class='pagination-page" + curStr + "'><a onclick='ShowResStatPage(" + p + ")'>" + t + "</a></li>"
}

function SetWordsSequence(ul) {
    var text = "";
    $.each($(ul).find('li'), function (i, e) {
        if ($(e).html() == "") {
            text = text + " ";
        }
        else {
            text = text + $(e).html();
        }
    })
    $("#hText" + $(ul).attr("wid")).val(text);
    $("#hWordVal_" + $(ul).attr("wid")).val(text);
}
function SetPhrasesSequence(callback) {
    ShiftPositionsOnePhrase();
    $.each($('#dBoxes div'), function (i, d) {
        $(d).draggable();
    });
    $.each($('#dPlaces div'), function (i, d) {
        $(d).droppable({
            activate: function (event, ui) { ui.draggable.attr("posnum", ""); },
            accept: function (boxElem) {
                return IsNeedAcceptOnePhrase(boxElem, $(this));
            },
            drop: function (event, ui) {
                $(this).removeClass("highlight");
                ui.draggable.attr("posnum", $(this).attr("posnum"));
                ShiftPositionsOnePhrase(); ShiftPositionsOnePhrase();
                if (callback) callback();
            },
            over: function (event, ui) {
                $(this).addClass("highlight");
            },
            out: function (event, ui) {
                $(this).css("width", "").css("width", "").removeClass("highlight");
                ui.draggable.attr("posnum", "");
                ShiftPositionsOnePhrase(); ShiftPositionsOnePhrase();
                if (callback) callback();
            }
        });
    });
}
function ShiftPositionsOnePhrase() {
    var m = document.getElementById("dPlaces").getElementsByTagName("div");
    var boxes = document.getElementById("dBoxes").getElementsByTagName("div");
    var sequence = "";
    for (var i = 0; i < m.length ; i++) {
        var b = null;
        for (var j = 0; j < boxes.length ; j++) {
            if ($(boxes[j]).attr("posnum") != "" && $(boxes[j]).attr("posnum") == $(m[i]).attr("posnum")) {
                b = $(boxes[j]);
                break;
            }
        }
        if (b == null) {
            sequence = sequence + ";";
            continue;
        }
        SetPositionOnePhrase($(m[i]), b);
        sequence = sequence + $(b).attr("phid") + ";";
    }
    $("#hSequence").val(sequence);
}
function SetPositionOnePhrase(placeElem, boxElem)  {
    var pos = $(boxElem).css("left").replace("px", "");
    if (isNaN(parseInt(pos)))
        pos = 0;
    var delta = $(placeElem).position().left - boxElem.position().left;
    var left = (parseInt(pos) + parseInt(delta)) + "px";
    $(boxElem).css("left", left);

    pos = $(boxElem).css("top").replace("px", "");
    if (isNaN(parseInt(pos)))
        pos = 0;
    delta = $(placeElem).position().top - boxElem.position().top;
    var top = (parseInt(pos) + parseInt(delta)) + "px";
    $(boxElem).css("top", top);

    placeElem.css("width", boxElem.css("width"));   
}
function IsNeedAcceptOnePhrase(boxElem, posElem) {
    var hasBoxWithPosElemNumber = false;
    var boxes = document.getElementById("dBoxes").getElementsByTagName("div");
    for (var j = 0; j < boxes.length ; j++) {
        if ($(boxes[j]).attr("posnum") == $(posElem).attr("posnum") && $(boxElem).attr("posnum") != $(posElem).attr("posnum")) {
            hasBoxWithPosElemNumber = true;
        }
    }
    return !hasBoxWithPosElemNumber;
}
function OnUserAnswerRiddleTextChanged(txt) {
    document.getElementById("hText" + txt.getAttribute("rid")).value = txt.value;
}
function setupGameSearchInText(id, callback) {
    $('#dgt_' + id).find('span.s').on('click', function () {
        if ($(this).attr('sel') == '1') {
            $(this).attr('sel', '0');
            $(this).removeClass('sel');
        }
        else {
            $(this).attr('sel', '1');
            $(this).addClass('sel');
        }
        var arr = [];
        $.each($('#dgt_' + id).find('span.s[sel=1]'), function (i, e) {
            arr.push($(e).attr("num"));
        })
        $("#hTextVal_" + id).val(arr.join(','));
        if (callback)
            callback();
    })
}

function GetWidgetCode(host, url1, url2, iframeId, autoHeight, width, height) {
    var code = '<iframe id="' + iframeId + '" src="//' + host + '/' + url1 + '/' + url2 + '" frameborder="0" style="width:' + width + ';';
    if (autoHeight) {
        code += '" ';
        code += 'onload="';
        code += "var f = document.getElementById('" + iframeId + "'); var h = 0; var listener = function (event) { h = parseInt(event.data); if (isNaN(h)) h = 400; f.style.height = h + 'px'; }; function addEvent(elem, evnt, func) { if (elem.addEventListener) { elem.addEventListener(evnt, func, false); } else if (elem.attachEvent) { elem.attachEvent('on' + evnt, func); } else { elem['on' + evnt] = func; } }; addEvent(window, 'message', listener);";
        code += '" ';
        code += 'scrolling="no" ';
    }
    else {
        code += 'height:' + height + '" ';
        code += 'scrolling="auto" ';
    }
    code += '></iframe>';

    return code;
}
var feedbackModalLng;
function showFeedbackForm(lngPath) {
    var feedbackModal = openModalForm();
    $(feedbackModal).find('.wnd').html("<img class='loader' src='/images/loaders/intersection.gif' />");
    $(feedbackModal).find('.wnd').load("/common" + "/feedbackform" + "?lng=" + lngPath);
    feedbackModalLng = lngPath;
}
function sentFeedbackMsg() {
    var obj = { name: $('#feedbackUserName').val(), email: $('#feedbackEmail').val(), msg: $('#feedbackMessage').val(), captchaCode: $('#feedbackCaptchaCode').val(), captchaValue: $('#teedbackCaptchaValue').val() };
    if (obj.name.length == 0 || obj.email.length == 0 || obj.msg.length == 0 || obj.captchaValue.length == 0) {
        AddAlertDanger('feedbackError', 'Не все поля заполнены')
        return;
    }
    $('.otp-modal .wnd .btn-gray').parent().empty().html("<img src='/images/loaders/line.gif' />");
    
    $.post("/common" + "/feedback" + "?lng=" + feedbackModalLng, JSON.stringify(obj))
        .done(function (data) {
            $('.otp-modal .wnd').html(data);
        });
}

function openModalForm() {
    var modal = document.createElement("div")
    $(modal).addClass('otp-modal animated fadeIn').html("<div class='bg'></div>");
    $(modal).click(function(e) {
        if ($(e.target).hasClass('bg') || $(e.target).hasClass('content')) {
            closeModalForm();
        }
    });
    var c = document.createElement("div");
    var d = document.createElement("div");
    $(d).addClass('wnd');
    $(c).addClass('content').append(d);

    $(modal).append(c);
    $('body').append(modal).addClass('otp-modal-opened');
    $(modal).show();
    return modal;
}
function closeModalForm() {
    $('.otp-modal').removeClass("animated").removeClass("fadeIn");
    $('.otp-modal').fadeOut(200, function () { $('.otp-modal').remove(); $('body').removeClass('otp-modal-opened'); });
}

function showSolidGaugePercent(ctrlId, smallCoeff) {
    $.each($(ctrlId), function (i, ctrl) {
        var h = parseInt($(ctrl).attr("sgp-height")); if (isNaN(h)) h = 170;
        var w = parseInt($(ctrl).attr("sgp-width")); if (isNaN(w)) w = 260;
        var duration = parseInt($(ctrl).attr("sgp-duration")); if (isNaN(duration)) duration = 2000;

        if (!smallCoeff) smallCoeff = 1;
        
        h = parseInt(h * smallCoeff);
        w = parseInt(w * smallCoeff);
        var fontSize1 = parseInt(35 * smallCoeff);
        var fontSize2 = parseInt(28 * smallCoeff);

        var clr = $(ctrl).attr("sgp-color");
        $(ctrl).highcharts({
            chart: { type: 'solidgauge', backgroundColor: 'transparent', height: h, width: w },
            title: null,
            pane: {
                center: ['50%', '85%'], size: '160%',
                startAngle: -90, endAngle: 90,
                background: { backgroundColor: '#EEE', innerRadius: '60%', outerRadius: '100%', shape: 'arc' }
            },
            tooltip: { enabled: false },
            // the value axis
            yAxis: {
                stops: [
                    [0.0, clr], [1.0, clr]
                ],
                min: 0, max: 100, lineWidth: 0, minorTickInterval: null, tickPixelInterval: 400,
                tickWidth: 0, title: { y: -100 }, labels: { y: 16 }
            },

            plotOptions: {
                series: { animation: { duration: duration } },
                solidgauge: { dataLabels: { y: 5, borderWidth: 0, useHTML: true } }
            },
            credits: { enabled: false },
            series: [{
                name: 'Speed', data: [JSON.parse($(ctrl).attr("sgp-percent"))],
                dataLabels: { format: '<div style="text-align:center;font-family: Arial, Helvetica, sans-serif; "><span style="font-size:' + fontSize1 + 'px; color: #0275d8">{y}<span style="font-size:' + fontSize1 + 'px;">%</span></span></div>' },
            }],
            navigation: { buttonOptions: { enabled: false } }
        });
    });
}

function onChangeLng(lngId) {
    $('#newlanguage').val(lngId);
    $('#chnglngform').submit();
}

function setSpanDate(id) {
    var dt = new Date($(id).attr('utcdate'));
    var format = $(id).attr('formatdate');
    var str = getStringFromDateUtc(dt, format);
    $(id).html(str);
}
function getStringFromDateUtc(dt, format) {
    dt.setMinutes(dt.getMinutes() - new Date().getTimezoneOffset());
    return getStringDate(dt, format);
}
function getStringDate(dt, format) {
    var str = format;
    str = str.replace('dd', dt.getDate().toString().padLeft(2, '0'));
    str = str.replace('MM', (dt.getMonth() + 1).toString().padLeft(2, '0'));
    str = str.replace('yyyy', dt.getFullYear().toString());
    str = str.replace('HH', dt.getHours().toString().padLeft(2, '0'));
    str = str.replace('mm', dt.getMinutes().toString().padLeft(2, '0'));
    str = str.replace('ss', dt.getSeconds().toString().padLeft(2, '0'));
    return str;
}

var showResultReady = true;
function showQuestions(a) {
    if (!showResultReady)
        return;
    showResultReady = false;
    if (a !== undefined) {
        $(a).parent().parent().find('#dResults').fadeOut("200", function () {
            $(a).parent().parent().find('#dQuestions, #dItems').fadeIn("200", function () {
                showResultReady = true; sendHeight();
                autosize.update($('textarea.otp-textbox')); sendHeight();
            });
        });
    } else {
        $('#dResults').fadeOut("200", function () {
            $('#dQuestions, #dItems').fadeIn("200", function () {
                showResultReady = true; sendHeight();
                autosize.update($('textarea.otp-textbox')); sendHeight();
            });
        });
    }
}
function showResults(a) {
    if (!showResultReady)
        return;
    showResultReady = false;
    if (a !== undefined) {
        $(a).parent().parent().find('#dQuestions, #dItems').fadeOut("200", function () {
            $(a).parent().parent().find('#dResults').fadeIn("200", function () { showResultReady = true; sendHeight(); });
        });
    } else {
        $('#dQuestions, #dItems').fadeOut("200", function () {
            $('#dResults').fadeIn("200", function () { showResultReady = true; sendHeight(); });
        });
    }
}
function showItems() {
    if (!showResultReady)
        return;
    showResultReady = false;
    $('#dResults').fadeOut("200", function () {
        $('#dItems').fadeIn("200", function () { showResultReady = true; sendHeight(); });
    });
}

function AddCommentTop() {
    CloseComment();
    $('.otp-comments .main').before(CreateAddCommentForm("0"));
    $('.otp-comment-addform').fadeIn("100");
    $('html, body').animate({
        scrollTop: $(".otp-comment-addform").offset().top - 150
    }, 1000);
}
function ReplyComment(a) {
    CloseComment();
    var id = $(a).parent().parent().parent().attr("id").replace("cmt-", "");
    $(a).parent().parent().parent().append(CreateAddCommentForm(id));
    $('.otp-comment-addform').fadeIn("100");
    $('html, body').animate({
        scrollTop: $(".otp-comment-addform").offset().top - 150
    }, 1000);
}
function CloseComment() {
    $('.otp-comment-addform').remove();
}
function SaveComment() {
    if ($('#addcmtname').val() == "") { return; }
    if ($('#addcmttext').val() == "") { return; }
    $('.otp-comment-addform .otp-spinner').show();
    $('.otp-comment-addform .buttons a').hide();
    var pid = $('.otp-comment-addform').attr('pid');
    $.post("/Service/" + $('.otp-comments .main').attr('cmdpage') + ".aspx?cmd=addcmt&id=" + $('.otp-comments .main').attr('uid') + "&lng=" + $('.otp-comments .main').attr('lng'), { pid: pid, n: $('#addcmtname').val(), t: $('#addcmttext').val() })
    .done(function (dataval) {
        var data = JSON.parse(dataval)
        if (!data.result) {
            AddAlertDanger('addcmdalert', data.text);
            $('.otp-comment-addform .otp-spinner').hide();
            return;
        }
        var d = document.createElement("div");
        var html = $(d).html(JSON.parse(data.text));
        d = $(d).find(".comment");
        if (pid == "0")
            if ($(".otp-comments .main").children().length == 0)
                $(".otp-comments .main").append(d);
            else
                $($(".otp-comments .main").children()[0]).before(d);
        else {
            var d1 = $("#cmt-" + pid).children()[1];
            $(d1).append(d);
        }
        CloseComment();
        $('.otp-comment-addform .otp-spinner').hide();
        $('.otp-comments .nocomments').remove();
        var cnt = parseInt($('.otp-comments .otp-comments-title b').html()) + 1;
        $('.otp-comments .otp-comments-title b').html(cnt);
    });

}
function CreateAddCommentForm(pid) {
    var html =
        '<a class="close" onclick="CloseComment()"><i class="icon-main-close"></i></a>' +
        '<div class="name">' +
            '<span>Ваше имя:</span>' +
            '<input id="addcmtname" type="text" class="otp-textbox otp-textbox-mini" />' +
        '</div>' +
        '<div class="text">' +
            '<textarea id="addcmttext" class="otp-textbox"></textarea>' +
        '</div>' +
        '<div id="addcmdalert"></div>' +
        '<div class="buttons">' +
            '<span class="otp-spinner icon-main-spinner" style="display:none"></span>' +
            '<a onclick="SaveComment()">отправить</a>' +
        '</div>';
    var d = document.createElement("div");
    $(d).addClass('otp-comment-addform').attr("pid", pid).html(html);
    return d;
}
function ShowMoreComments(a) {
    var arr = $('.otp-comments .main').children();
    var arrToShow = []; var add = false; var lastId = 0;
    $.each(arr, function (i, e) {
        if ($(e).hasClass('showmore')) {
            if (add == true) {
                add = false;
                arrToShow.push(e);
            }

            if (arrToShow.length == 0)
                add = true;
        }
        else {
            lastId = parseInt($(e).attr("id").replace('cmt-', ''));
        }
        if (add) {
            arrToShow.push(e);
        }
    })
    if (arrToShow.length > 1) {
        $.each(arrToShow, function (i, e) {
            $(e).fadeIn(200);
        });
        $('html, body').animate({ scrollTop: $(arrToShow[0]).offset().top }, 1000);
    }
    else {
        var d = document.createElement("div");
        $(d).addClass("imgloader ta-c").html('<img src= "/images/loaders/line.gif">')
        $('.otp-comments .main').append(d);
        var d1 = document.createElement("div");
        $(d1).load("/Service/" + $('.otp-comments .main').attr('cmdpage') + ".aspx?cmd=getnextcmt&id=" + $('.otp-comments .main').attr('uid') + "&lng=" + $('.otp-comments .main').attr('lng') + "&lastcmtid=" + lastId + " #dcomments",
            function () {
                $('.otp-comments .main .imgloader').remove();
                var arrNew = $(d1).find('#dcomments').children();
                if (arrNew.length > 0) {
                    $.each(arrNew, function (i, c) {
                        $('.otp-comments .main').append(c);
                    })
                }
            });
    }
    $(a).remove();
}

function onSendHelpVote(vote) {
    $('.otp-help-page .page .voting .btns').html("<img class='loader' src='/images/loaders/fb.gif' />");
    $.post(window.location.href + "?action=vote", { vote: vote })
        .done(function (data) {
            $('.otp-help-page .page .voting .btns').html(data);
        });
}

function expandHelpFaqItem(a) {
    var $d = $(a).parent().find("div.exptextcontent"); var $i = $(a).parent().children("i");
    if ($(a).attr("expanded") == undefined) {
        $d.css("margin-top", "-" + ($d.height() + 25) + "px").show();
        $d.css("margin-top", "10px");
        $(a).attr("expanded", "1"); $i.addClass("rotated");
    }
    else if ($(a).attr("expanded") == "1")
    {
        $d.css("margin-top", "-" + ($d.height() + 25) + "px");
        $(a).attr("expanded", "0"); $i.removeClass("rotated");
    }
    else {
        $d.css("margin-top", "10px");
        $(a).attr("expanded", "1"); $i.addClass("rotated");
    }
}
function setupHelpArticle()
{
    $.each($('.otp-help-page .page .exptext .exptextcontent'), function (i, d) {
        $(d).css("margin-top", "-" + ($(d).height() + 25) + "px").attr("expanded", "0").show();
    })
    $.each($('.otp-help-page .page .img a'), function (i, a) {
        $(a).on('click', function (e) {
            var imgUrl = $(this).parent().find('img').attr("src");
            var dlg = openModalForm();
            $(dlg).find(".bg").css("opacity", "0.8")
            $(dlg).find(".wnd").addClass("p-20 ta-c").css("max-width", "1000px").css("border", "none").css("background-color", "transparent");
            $(dlg).find(".wnd").html('<img src="' + imgUrl + '" style="border:solid 3px #ddd;" /><div class="p-10 ta-c"><button class="btn btn-flat btn-sm btn-dark" onclick="closeModalForm()">Закрыть</button></div>');
        });
    })
}
function showHelpVideo(a) {
    var url = $(a).parent().attr("url");
    var dlg = openModalForm();
    var $wnd = $(dlg).find(".wnd");
    $wnd.addClass("p-5 bgc-f4").css("max-width", "550px");
    var w = $wnd.width(); var h = parseInt(w / 1.77);
    var html = '<iframe width="100%" height="' + h + '" src="' + url + '" frameborder="0" allowfullscreen></iframe><div class="ta-c"><button class="btn btn-link btn-sm" onclick="closeModalForm()">Закрыть</button></div>';
    $wnd.html(html);
}

function onLoginClick() {
    $.getScript("/js/login.js")
      .done(function (script, textStatus) {
          showLoginForm();
      })
}

function checkCtrlEnter(e) {
    if (!e) e = window.event;
    if ((e.ctrlKey) && ((e.keyCode == 10) || (e.keyCode == 13)))
    {
        var sel = mis_get_sel_text();
        if (sel.selected_text.length > 300) {
            alert('Можно выделить не более 300 символов!');
        }
        else if (sel.selected_text.length == 0) {
            return false;
        }
        else {
            // Get selection context.
            mis = mis_get_sel_context(sel);
            
            var errModal = openModalForm();
            $(errModal).find('.wnd').html("<img class='loader' src='/images/loaders/intersection.gif' />");
            $(errModal).find('.wnd').load("/common" + "/texterrorform" + "?lng=" + 'ru', function () {
                $(errModal).find('.wnd').find("#dErrorText").html(mis);
                $(errModal).find('.wnd').find("#txtTextErrorUrl").val(window.location.href);
                autosize($(errModal).find('.wnd').find("#txtTextErrorComment"));
            });
        }
    }
    return true;
}
function mis_get_sel_text() {
    if (window.getSelection) {
        txt = window.getSelection();
        selected_text = txt.toString();
        full_text = txt.anchorNode.textContent;
        selection_start = txt.anchorOffset;
        selection_end = txt.focusOffset;
    }
    else if (document.getSelection) {
        txt = document.getSelection();
        selected_text = txt.toString();
        full_text = txt.anchorNode.textContent;
        selection_start = txt.anchorOffset;
        selection_end = txt.focusOffset;
    }
    else if (document.selection) {
        txt = document.selection.createRange();
        selected_text = txt.text;
        full_text = txt.parentElement().innerText;

        var stored_range = txt.duplicate();
        stored_range.moveToElementText(txt.parentElement());
        stored_range.setEndPoint('EndToEnd', txt);
        selection_start = stored_range.text.length - txt.text.length;
        selection_end = selection_start + selected_text.length;
    }
    else {
        return;
    }
    var txt = {
        selected_text: selected_text,
        full_text: full_text,
        selection_start: selection_start,
        selection_end: selection_end
    };
    return txt;
}
function mis_get_sel_context(sel) {
    selection_start = sel.selection_start;
    selection_end = sel.selection_end;
    if (selection_start > selection_end) {
        tmp = selection_start;
        selection_start = selection_end;
        selection_end = tmp;
    }

    context = sel.full_text;

    context_first = context.substring(0, selection_start);
    context_second = context.substring(selection_start, selection_end);
    context_third = context.substring(selection_end, context.length);
    context = context_first + '<strong>' + context_second + '</strong>' + context_third;

    context_start = selection_start - 60;
    if (context_start < 0) {
        context_start = 0;
    }

    context_end = selection_end + 60;
    if (context_end > context.length) {
        context_end = context.length;
    }

    context = context.substring(context_start, context_end);

    context_start = context.indexOf(' ') + 1;

    if (selection_start + 60 < context.length) {
        context_end = context.lastIndexOf(' ', selection_start + 60);
    }
    else {
        context_end = context.length;
    }

    selection_start = context.indexOf('<strong>');
    if (context_start > selection_start) {
        context_start = 0;
    }

    if (context_start) {
        context = context.substring(context_start, context_end);
    }

    return context;
}
function sendCtrlEnterError() {
    var obj = { url: $('#txtTextErrorUrl').val(), error: $('#dErrorText').html(), comment: $('#txtTextErrorComment').val() };
    $('.otp-modal #derrtextalert').html("<div class='ta-r'><img src='/images/loaders/squares.gif' /></div>");
    $('.otp-modal .wnd .btn-gray').parent().empty();
    obj.error = obj.error.replace(/</g, '[').replace(/>/g, ']')
    $.post("/common" + "/texterror" + "?lng=" + 'ru', JSON.stringify(obj))
        .done(function (data) {
            var d = JSON.parse(data);
            $('#derrtextalert').empty();
            if (d.result) {
                tmrId = AddAlertSuccess('derrtextalert', JSON.parse(d.text));
            }
            else {
                tmrId = AddAlertDanger('derrtextalert', JSON.parse(d.text));
            }
            clearTimeout(tmrId);
        });
}

/* matching module */
(function ($) {
    "use strict";
    $.fn.matching = function (isSavedTest, callback) {

        return this.each(function () {
            var $this = $(this);
            $this.find(".drag-list ul>li").draggable({
                start: function (e, ui) {
                    if (isSavedTest)
                        return;
                    var n = parseInt($(ui.helper).find('div.num').text());
                    var dropElem = findDropElement(n);
                    if (dropElem) {
                        $(ui.helper).removeClass('connected');
                        $(ui.helper).find('div.main').css('height', 'auto');

                        $(dropElem).find('select option').eq(0).prop("selected", true);
                        $(dropElem).removeClass('connected');
                        $(dropElem).find('div.main').css('height', 'auto');

                        adjustHeights(false);
                        adjustHeights(false);

                        if (callback)
                            callback();
                    }
                }
            });
            if (isSavedTest) {
                $this.find(".drag-list ul>li").draggable({ revert: true });
            }
            else {
                $this.find(".drop-list ul>li").droppable({
                    tolerance: "touch",
                    accept: function (ui) {
                        return $(this).find('select option:selected').index() <= 0;
                    },
                    over: function (e, ui) {
                        $(this).addClass("highlight");
                    },
                    out: function (e, ui) {
                        $(this).removeClass("highlight");
                    },
                    drop: function (event, ui) {
                        var n = parseInt($(ui.draggable).find('div.num').text());
                        var dropElem = findDropElement(n);
                        if (dropElem)
                            return;
                        $(this).find('select option').eq(n).prop("selected", true);
                        $(this).removeClass("highlight");

                        $(this).addClass('connected');
                        $(ui.draggable).addClass('connected');

                        adjustHeights(true);
                        adjustHeights(true);
                        if (callback)
                            callback();
                    }
                });

                $this.find(".drop-list select").on('change', function () { adjustHeights(true); })
            }

            function adjustHeights(shiftNotSelectedPositions) {
                if ($(window).width() < 400) {
                    return;
                }
                $.each($this.find(".drop-list ul>li"),
                    function (i, li) {
                        if ($(li).find('select').val() == null || $(li).find('select').val() == '0') {
                            $(li).find('div.main').css('height', 'auto');
                        } else {
                            var dragElem = findDragElement($(li).find('select option:selected').index());
                            
                            $(li).addClass('connected');
                            $(dragElem).addClass('connected');
                            
                            var h = Math.max($(li).find('div.main').height(), $(dragElem).find('div.main').height());
                            $(li).find('div.main').height(h);
                            $(dragElem).find('div.main').height(h);
                            
                            var topDiff = $(li).position().top - $(dragElem).position().top;
                            var top = parseInt($(dragElem).css('top').replace('px', ''));
                            $(dragElem).css('top', (top + topDiff) + 'px');

                            var leftDiff = $(li).position().left + $(li).width() - $(dragElem).position().left - 1;
                            var left = parseInt($(dragElem).css('left').replace('px', ''));
                            $(dragElem).css('left', (left + leftDiff) + 'px');
                        }
                    });
                if (shiftNotSelectedPositions) {
                    var dropEmpty = [];
                    $.each($this.find('.drop-list ul>li'),
                        function (i, li) {
                            if ($(li).find('select option:selected').index() === 0 ||
                                $(li).find('select option:selected').index() === -1) {
                                dropEmpty.push(li);
                            }
                        });
                    var index = 0;
                    $.each($this.find(".drag-list ul>li"),
                        function (i, li) {
                            if ($(li).hasClass('connected') === false) {
                                if (dropEmpty[index]) {
                                    var topDiff = $(dropEmpty[index]).position().top - $(li).position().top;
                                    var top = parseInt($(li).css('top').replace('px', ''));
                                    $(li).css('top', (top + topDiff) + 'px');

                                    $(li).css('left', '0px');
                                }
                                index++;
                            }
                        });
                }
                
            }

            function findDragElement(number) {
                var el = undefined;
                $.each($this.find('.drag-list ul>li'),
                    function (i, li) {
                        console.log(parseInt($(li).find('div.num').text()));
                        if (parseInt($(li).find('div.num').text()) === number) {
                            el = li;
                        } 
                    });
                return el;
            }
            function findDropElement(number) {
                var el = undefined;
                $.each($this.find('.drop-list ul>li'),
                    function (i, li) {
                        if ($(li).find('select option:selected').index() === number) {
                            el = li;
                        }
                    });
                return el;
            }
            
            if (!isSavedTest) {
                adjustHeights(true);
                adjustHeights(true);
            }
        });
    };
})(window.jQuery);

/* rating vote module */
(function ($) {
    "use strict";
    $.fn.odzHeader = function () {
        return this.each(function () {
            var $this = $(this);
            $this.find("#btnShowOdsDllSubjects").on('click', function () {
                $(this).parent().find('ul').slideDown('100', function () {
                    $(document).one('click', function () {
                        $this.find("#btnShowOdsDllSubjects").parent().find('ul').slideUp('100');
                    });
                });
            })
            $this.find("#btnShowOdsDllClasses").on('click', function () {
                $(this).parent().find('ul').slideDown('100', function () {
                    $(document).one('click', function () {
                        $this.find("#btnShowOdsDllClasses").parent().find('ul').slideUp('100');
                    });
                });
            })
        });
    };
})(window.jQuery);

var isDialogPassMood = false;
var dialogPassMood = 0;
var dialogPassMoodMax = 0;
var isDialogPassFinishOnBadMood = false;
var dialogPassFinishOnBadMoodValue = 0;
var dialogPassAchievements = [];
/* rating vote module */
(function ($) {
    "use strict";
    $.fn.dialogScene = function () {
        return this.each(function () {
            var $this = $(this);
            var $thisType = parseInt($this.attr('type'));
            var $thisSceneId = $this.attr('id').replace('dscene_', '');
            setupMood(0);
            $this.find(".answers li").on('click',
                function() {
                    var nextId = $(this).attr('next');
                    var score = parseFloat($(this).attr('score'));
                    var ansId = $(this).attr('ansid');
                    var moodChangeValue = parseInt($(this).attr('mood'));

                    score = parseFloat($('#dialogScoreValue').val()) + score;
                    $('#dialogScoreValue').val(score.toString());
                    $('.otp-dialog-tophead .top-head-score span').html(score.toString());
                    
                    if ($thisType == 20 || $thisType == 30) {
                        nextId = $this.attr('next');
                    }

                    addSec($thisSceneId, ansId, nextId);
                    showNext(nextId, moodChangeValue);
                });
            $this.find(".a-next").on('click',
                function () {
                    var achId = parseInt($this.attr('ach'))
                    if (achId) {
                        dialogPassAchievements.push(achId);
                        $('#dialogPassAchievements').val(JSON.stringify(dialogPassAchievements));
                        $('.otp-dialog-tophead .top-head-achievements span').html(dialogPassAchievements.length.toString());
                    }
                    var nextId = $this.attr('next');
                    addSec($thisSceneId, 0, nextId);
                    showNext(nextId);
                });

            function setupMood(moodChangeValue) {
                if (isDialogPassMood) {
                    dialogPassMood = dialogPassMood + moodChangeValue;
                    if (dialogPassMood < 0) {
                        dialogPassMood = 0;
                    } else if (dialogPassMood > dialogPassMoodMax) {
                        dialogPassMood = dialogPassMoodMax;
                    }
                    var dialogMoodPercent = dialogPassMood * 100 / dialogPassMoodMax;
                    setDialogMoodValue(dialogMoodPercent);
                }
            }
            
            function addSec(sceneId, ansId, nextId) {
                var seq = $('#dialogPassSequence').val();
                if (seq.length > 0) seq += ';';
                seq += sceneId + '-' + ansId + '-' + nextId;
                $('#dialogPassSequence').val(seq);
            }

            function showNext(nextId, moodChangeValue) {
                if (nextId == "0") {
                    $('#ddialogsaving').show();
                    $('#testform').submit();
                } else {
                    $this.hide();
                    $('#dscene_' + nextId).show();
                    setupMood(moodChangeValue);
                    if (isDialogPassFinishOnBadMood) {
                        if (dialogPassMood <= dialogPassFinishOnBadMoodValue) {
                            $('#dialogFinishedOnBadMood').val("1");
                            $('#ddialogsaving').show();
                            $('#testform').submit();
                        }
                    }
                }
            }
        });
    };
})(window.jQuery);
function setDialogMoodValue(percent) {
    var fileName = "";
    if (percent < 5) {
        fileName = "angry.png";
    } else if (percent < 30) {
        fileName = "sad.png";
    } else if (percent < 65) {
        fileName = "none.png";
    } else {
        fileName = "regular.png";
    }
    $('.otp-dialog-scene').find('.mood .val-1').css('height', percent + '%')
    $('.otp-dialog-scene').find('.smile').css('background-image', 'url("/images/dialogues/smily/' + fileName + '")');
}

/* rating vote module */
(function ($) {
    "use strict";
    $.fn.autoLoadItems = function () {
        return this.each(function () {
            var $d = $(this).find('.row');
            var img = document.createElement("div");
            $(img).attr("id", "imgautoloddingtests").html("<img src='/images/loaders/fading-lines.gif' />");
            $(window).scroll(function () {
                
                if ($(window).scrollTop() >= $d .position().top + $d .height() - $(window).height()) {
                    if ($d .attr("loading") == "1")
                        return;
                    $d .attr("loading", "1");
                    var div = document.createElement("div");
                    var url = "/" + $d.attr("lng") + "/" + $d.attr("itemurl") + "/autoload?type=" + $d.attr("type") + "&lastcnt=" + $d.attr("lastcnt") + "&loadcnt=" + $d.attr("loadcnt");

                    $d.append(img);

                    $(div).load(url, function () {
                        $d .attr("lastcnt", parseInt($d .attr("lastcnt")) + parseInt($d .attr("loadcnt")));
                        $d .append($(div).children());
                        $("#imgautoloddingtests").remove();
                        $d .attr("loading", "0");
                    });
                }
            });
        });
    };
})(window.jQuery);

/* rating vote module */
(function ($) {
    "use strict";
    $.fn.ratingVote = function () {
        return this.each(function () {
            var $this = $(this); var $view = $this.find('.otp-rating-container-view'); var $proc = $this.find('.otp-rating-container-vote');
            $view.find("a").on('click', function () {
                $view.fadeOut("100", function () {
                    $proc.fadeIn("100");
                    $('#dratingprocess, #dcomplexityprocess').mousemove(function (e) {
                        var cnt = $(this).attr("cnt");
                        var d = e.pageX - $(this).offset().left;
                        d = d * 100 / $(this).width();
                        d = Math.ceil(d / cnt);
                        $(this).find("div").css("width", (d * cnt) + "%");
                        $(this).attr("cur", d);
                    })
                    $('#dratingprocess, #dcomplexityprocess').mouseout(function (e) {
                        var sel = $(this).attr("sel");
                        if (sel == "") {
                            $(this).children().css("width", "0%");
                            return;
                        }
                        $(this).attr("sel", sel);
                        $(this).attr("cur", "");
                        $(this).find("div").css("width", (parseInt(sel) * parseInt($(this).attr("cnt"))) + "%");
                    })
                    $('#dratingprocess, #dcomplexityprocess').click(function (e) {
                        $(this).attr("sel", $(this).attr("cur"));
                        $(this).find("div").addClass("otp-rating-click");
                        setTimeout(function () { $('#dratingprocess, #dcomplexityprocess').find("div").removeClass("otp-rating-click"); }, 200);
                    })
                    $('#dlikeprocess').click(function (e) {
                        if ($('#dlikeprocess').attr("sel") == "true") {
                            $('#dlikeprocess').attr("sel", "false");
                            $('#ilike').css("display", "none");
                            $('#idislike').css("display", "");
                        }
                        else {
                            $('#dlikeprocess').attr("sel", "true");
                            $('#ilike').css("display", "");
                            $('#idislike').css("display", "none");
                        }
                    })
                })
            })
            $proc.find("a.otp-rating-vote-close").on('click', function () {
                $proc.fadeOut("100", function () { $view.fadeIn("100"); })
                $('#dratingprocess').off('mousemove').off('mouseout');
            })
            $proc.find("a.otp-rating-vote-ok").on('click', function () {
                $proc.children().css("display", "none");
                $('.otp-rating-saving').fadeIn("200");

                var url = "/" + $view.attr("lng") + "/rating/" + $view.attr("action") + "/" + $view.attr("uid1")

                $.post(url, { uid: $view.attr('uid2'), r: $('#dratingprocess').attr("sel"), c: $('#dcomplexityprocess').attr("sel"), l: $('#dlikeprocess').attr("sel") })
                .done(function (data) {
                    var r = JSON.parse(data);
                    $('.otp-rating-saving').remove();
                    $('.otp-rating-container-vote').remove();
                    $('.otp-rating-vote').remove();
                    $('#dratingpercent').css("width", r.rp + "%");
                    $('#dcomplexitypercent').css("width", r.cp + "%");
                    $('#slike').html(r.l);
                    $('#sdislike').html(r.dl);
                    $view.fadeIn("200");
                });
            })
        });
    };
})(window.jQuery);

/* public widget code module */
(function ($) {
    "use strict";
    $.fn.publicWidgetCode = function () {
        return this.each(function () {
            var $this = $(this); var $main = $this.find('.content .params');
            $this.find("button.btnshow").on('click', function () {
                $(this).hide();
                $main.show();
                setWidgetCode();
            })
            $this.find("input[type=text], select").on('change', function () { setWidgetCode(); })
            $this.find("input[type=checkbox]").on('click', function () {
                if ($(this).prop('checked')) {
                    $('#trWidgetHeight').hide();
                }
                else {
                    $('#trWidgetHeight').show();
                }
                setWidgetCode();
            })
            function setWidgetCode() {
                var code = GetWidgetCode(window.location.host,
                                        $main.attr("url"), $main.attr("uid"), $main.attr("wid"),
                                        $this.find("input[type=checkbox]").prop('checked'),
                                        $('#txtWidgetWidth').val() + $('#setWidgetWidth').val(),
                                        $('#txtWidgetHeight').val() + $('#setWidgetHeight').val());
                $main.find("textarea").val(code);
            }
        });
    };
})(window.jQuery);

/* result percent stat module */
(function ($) {
    "use strict";
    $.fn.resultPercentStat = function () {
        return this.each(function () {
            var $this = $(this); var $main = $this.find('.content'); var $handle = $main.find('.pgr .slider .handle');
            var jsonData = []; var curPage = 1; var totalPages = 1; var itemsPerPage = 10; var curResId = parseInt($main.attr("uid2"));
            $this.find("button.btnshow").on('click', function () { $(this).parent().remove(); loadResultStat(); })
            $this.find("button.btnshowprev").on('click', function () {
                if (curPage > 1) {
                    curPage = curPage - 1; pageChanged(); $handle.html(curPage); $main.find('.pgr .slider').slider("option", "value", curPage); sendHeight();
                }
            })
            $this.find("button.btnshownext").on('click', function () {
                if (curPage < totalPages) {
                    curPage = curPage + 1; pageChanged(); $handle.html(curPage); $main.find('.pgr .slider').slider("option", "value", curPage); sendHeight();
                }
            })
            $this.find("button.btnshowmine").on('click', function () {
                showMine(); sendHeight();
            })
            function loadResultStat() {
                var img = document.createElement("img"); $(img).attr("src", "/images/loaders/line.gif").addClass("d-b").css("margin", "10px auto");
                $main.before(img);
                var url = "/" + $main.attr("lng") + "/resultpercent/" + $this.attr("action") + "/" + $main.attr("uid1")
                $.getJSON(url, function (data) {
                    jsonData = data; totalPages = Math.ceil(jsonData.length / itemsPerPage);
                    if (curResId > 0) {
                        showMine();
                    } 
                    else {
                        pageChanged();
                    }
                    $main.show(); $(img).remove();
                    if (totalPages > 1) {
                        $main.find('.pgr .slider').slider({
                            min: 1, max: totalPages, step: 1,
                            create: function () {
                                $handle.html($(this).slider("value"));
                            },
                            slide: function (event, ui) {
                                curPage = parseInt(ui.value);
                                pageChanged();
                                $handle.html(ui.value);
                            }
                        });
                    }
                    else {
                        $main.find('.pgr').remove();
                    }
                    sendHeight();
                })
            }
            function showMine() {
                var index = 1;
                $.each(jsonData, function (i, r) {
                    if (r.id == curResId)
                        index = i;
                })
                curPage = 1;
                if (index > 10) curPage = Math.ceil(index / 10);
                pageChanged();
                $main.find('.pgr .slider').slider({ value: curPage });
                $handle.html(curPage);
                sendHeight();
            }
            function pageChanged() {
                $main.find(".tbl table tr.r").remove();
                var row = (curPage - 1) * itemsPerPage;
                var count = curPage * itemsPerPage;
                for (; row < count; row++) {
                    if (row < jsonData.length) {
                        var d = jsonData[row];
                        var tr = document.createElement("tr");
                        $(tr).addClass("r");
                        if (curResId == d.id)
                            $(tr).addClass("cur");

                        var td = document.createElement("td");
                        $(td).addClass("i").html(d.i);
                        $(tr).append(td);

                        td = document.createElement("td");
                        if (curResId == d.id)
                            $(td).html('<span class="n">' + $main.attr("yourrestext") + '</span>');
                        else
                            $(td).html('<span class="n">' + d.n + '</span>');
                        $(tr).append(td);

                        td = document.createElement("td");
                        $(td).html('<span class="et">' + d.et + '</span>');
                        $(tr).append(td);

                        td = document.createElement("td");
                        $(td).html('<span class="pt">' + d.pt + '</span>');
                        $(tr).append(td);

                        td = document.createElement("td");
                        $(td).addClass("p").html(d.p + "%");
                        $(tr).append(td);

                        $main.find(".tbl table").append(tr);
                    }
                }
                setTimeout(sendHeight(), 100);
            }
        });
    };
})(window.jQuery);

function setComments() {
    $('.otp-comments').comments();
}
/* comments module */
(function ($) {
    "use strict";
    $.fn.comments = function () {
        return this.each(function () {
            var $this = $(this);
            if ($this.attr("setup") == "1")
                return;
            $this.attr("setup", "1");
            var $main = $('.otp-comments .main');
            var $tmpl = $(this).find('#addCommentTemplate'); $tmpl.remove();

            $(this).find('.otp-comments-title a.add').on('click', function () {
                closeComment();
                var d = createAddForm(0);
                $main.before(d);
                $(d).find('.otp-comment-addform').fadeIn("50");
                scroll();
            })
            $main.find('a.reply').on('click', function () { reply(this); })
            $main.find('a.showmore').on('click', function () { showMore(this); })
            function reply(a) {
                closeComment();
                var id = $(a).parent().parent().parent().attr("id").replace("cmt-", "");
                var d = createAddForm(id);
                $('#cmt-' + id).append(d);
                $('.otp-comment-addform').fadeIn("50");
                scroll();
            }
            function closeComment() {
                $('.otp-comment-addform').parent().remove();
            }
            function scroll(id) {
                if (id == undefined)
                    id = ".otp-comment-addform"
                $('html, body').animate({
                    scrollTop: $(id).offset().top - 150
                }, 500);
            }
            function createAddForm(id) {
                var d = document.createElement("div");
                $(d).html($tmpl.html());
                $(d).find(".otp-comment-addform").attr("pid", id);
                $(d).find('a.close').on('click', function (e) {
                    closeComment();
                });
                $(d).find('a.save').on('click', function (e) {
                    if ($('#addcmtname').val() == "" || $('#addcmttext').val() == "") { return; }
                    $('.otp-comment-addform .otp-spinner').show();
                    $('.otp-comment-addform .buttons a').hide();
                    var $f = $('.otp-comment-addform ');
                    var url = "/" + $main.attr('lng') + "/comment/" + $main.attr("action") + "/add/" + $main.attr('uid');
                    var obj = { pid: $f.attr('pid'), n: $f.find('input').val(), t: $f.find('textarea').val() }
                    $.post(url, JSON.stringify(obj))
                        .done(function (dataval) {
                            var data = JSON.parse(dataval)
                            if (!data.result) {
                                AddAlertDanger('addcmtalert', JSON.parse(data.text));
                                $('.otp-comment-addform .otp-spinner').hide();
                                return;
                            }
                            var d = document.createElement("div");
                            $(d).html(JSON.parse(data.text));
                            d = $(d).find(".comment");
                            if (obj.pid == "0")
                                if ($main.children().length == 0)
                                    $main.append(d);
                                else
                                    $($main.children()[0]).before(d);
                            else {
                                var d1 = $("#cmt-" + obj.pid).children()[1];
                                $(d1).append(d);
                            }
                            closeComment();
                            $('.otp-comments .nocomments').remove();
                            var cnt = parseInt($('.otp-comments .otp-comments-title b').html()) + 1;
                            $('.otp-comments .otp-comments-title b').html(cnt);
                            $(d).find('a.reply').on('click',
                                function() {
                                    reply(this);
                                });
                        });
                });
                return d;
            }
            function showMore(a) {
                var arr = $main.children();
                var arrToShow = []; var add = false; var lastId = 0;
                $.each(arr, function (i, e) {
                    if ($(e).hasClass('showmore')) {
                        if (add == true) {
                            add = false; arrToShow.push(e);
                        }
                        if (arrToShow.length == 0) add = true;
                    }
                    else {
                        lastId = parseInt($(e).attr("id").replace('cmt-', ''));
                    }
                    if (add) { arrToShow.push(e); }
                })
                if (arrToShow.length > 1) {
                    $.each(arrToShow, function (i, e) { $(e).fadeIn(200); });
                    scroll('#' + $(arrToShow[1]).attr('id'));
                }
                else {
                    var d = document.createElement("div");
                    $(d).addClass("imgloader ta-c").html('<img src= "/images/loaders/line.gif">');
                    $main.append(d);
                    var url = "/" + $main.attr('lng') + "/comment/" + $main.attr("action") + "/next/" + $main.attr('uid') + "?lastid=" + lastId;
                    $.getJSON(url)
                        .done(function (data) {
                            $.each(data,
                                function(i, html) {
                                    var d = document.createElement("div");
                                    $(d).html(html);
                                    $.each($(d).children(),
                                        function(j, cmt) {
                                            if (i > 0) {
                                                $(cmt).hide();
                                            }
                                            $main.append(cmt);
                                        });
                                });
                            scroll('#cmt-' + lastId);
                            $main.find('.imgloader').remove();
                            $main.find('a.reply').on('click', function () { reply(this); })
                            $main.find('a.showmore').on('click', function () { showMore(this); })
                        });
                }
                $(a).remove();
            }
        });
    };
})(window.jQuery);
/* input only digit */
(function ($) {
    "use strict";
    $.fn.onlyNumber = function () {
        return this.each(function () {
            var curValue = $(this).val();
            $(this).on('input', function (e) {
                if ($(this).val() === '') {
                    curValue = $(this).val();
                    return;
                }
                var r = /^[-]{0,1}\d*[\.\,]{0,1}\d*$/g;
                var str = $(this).val().toString();
                if (r.test(str) === false) {
                    var ss = this.selectionStart;
                    $(this).val(curValue);
                    if (ss) {
                        this.selectionStart = ss - 1;
                        this.selectionEnd = ss - 1;
                    }
                    return;
                }
                curValue = $(this).val();
            });
        });
    };
})(window.jQuery);
/* items slider */
(function ($) {
    "use strict";
    $.fn.itemsSlider = function () {
        return this.each(function () {
            var $this = $(this); var $cont = $this.find('.content');
            var arr = $this.find('.otp-t-box')
            var boxWidth = $(arr[0]).width() + 15;
            var boxScrollWidth = boxWidth * 1;
            if ($this.width() > boxWidth * 4) {
                boxScrollWidth = boxWidth * 3;
            }
            else if ($this.width() > boxWidth * 3) {
                boxScrollWidth = boxWidth * 2;
            }
            $cont.css("width", (boxWidth * arr.length + 10) + "px").css("margin-left", "0px");
            var d = document.createElement("div"); var btnPrev = document.createElement("button"); var btnNext = document.createElement("button");
            $(btnPrev).addClass('btn btn-flat btn-xs btn-dark mr-5').html('<i class="icon-main-left1"></i>').on('click', function () {
                slidePrev();
            })
            $(btnNext).addClass('btn btn-flat btn-xs btn-dark').html('<i class="icon-main-right1"></i>').on('click', function () {
                slideNext();                
            })
            var touched = false; var touchedX = 0; var touchedMl
            this.addEventListener('touchstart', function (event) {
                if (event.targetTouches.length == 1) {
                    var touch = event.targetTouches[0];
                    touchedX = touch.pageX;
                    touchedMl = parseInt($cont.css("margin-left").replace("px", ""));
                }
            }, false);
            this.addEventListener('touchmove', function (event) {
                // Если 1 палец внутри элемента
                if (event.targetTouches.length == 1) {
                    var touch = event.targetTouches[0];
                    var ml = touchedMl + (touch.pageX - touchedX);
                    if (ml <= - $cont.width() + $this.width() - 15)
                        return;
                    if (ml >= 0)
                        ml = 0;
                    $cont.css("margin-left", ml + "px");
                }
            }, false);
            $(d).addClass('mt-5 pl-20').append(btnPrev).append(btnNext);
            $this.append(d);
            var slideInProcess = false;
            function slideNext() {
                if (slideInProcess) return;
                var ml = parseInt($cont.css("margin-left").replace("px", "").replace("-", ""));
                if (ml + $this.width() >= $cont.width()) return;
                ml = -(ml + boxScrollWidth);
                slideInProcess = true;
                $cont.animate({ marginLeft: ml + "px" }, 300, function () { $cont.css("margin-left", ml + "px"); slideInProcess = false; });
            }
            function slidePrev() {
                if (slideInProcess) return;
                var ml = parseInt($cont.css("margin-left").replace("px", ""));
                if (ml >= 0) return;
                ml = ml + boxScrollWidth;
                if (ml > 0) ml = 0;
                slideInProcess = true;
                $cont.animate({ marginLeft: ml + "px" }, 300, function () { $cont.css("margin-left", ml + "px"); slideInProcess = false; });
            }
        });
    };
})(window.jQuery);

/*jQuery Masked Input Plugin Copyright (c) 2007 - 2015 Josh Bush (digitalbush.com) Licensed under the MIT license (http://digitalbush.com/projects/masked-input-plugin/#license) Version: 1.4.1*/
!function (a) { "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : jQuery) }(function (a) { var b, c = navigator.userAgent, d = /iphone/i.test(c), e = /chrome/i.test(c), f = /android/i.test(c); a.mask = { definitions: { 9: "[0-9]", a: "[A-Za-z]", "*": "[A-Za-z0-9]" }, autoclear: !0, dataName: "rawMaskFn", placeholder: "_" }, a.fn.extend({ caret: function (a, b) { var c; if (0 !== this.length && !this.is(":hidden")) return "number" == typeof a ? (b = "number" == typeof b ? b : a, this.each(function () { this.setSelectionRange ? this.setSelectionRange(a, b) : this.createTextRange && (c = this.createTextRange(), c.collapse(!0), c.moveEnd("character", b), c.moveStart("character", a), c.select()) })) : (this[0].setSelectionRange ? (a = this[0].selectionStart, b = this[0].selectionEnd) : document.selection && document.selection.createRange && (c = document.selection.createRange(), a = 0 - c.duplicate().moveStart("character", -1e5), b = a + c.text.length), { begin: a, end: b }) }, unmask: function () { return this.trigger("unmask") }, mask: function (c, g) { var h, i, j, k, l, m, n, o; if (!c && this.length > 0) { h = a(this[0]); var p = h.data(a.mask.dataName); return p ? p() : void 0 } return g = a.extend({ autoclear: a.mask.autoclear, placeholder: a.mask.placeholder, completed: null }, g), i = a.mask.definitions, j = [], k = n = c.length, l = null, a.each(c.split(""), function (a, b) { "?" == b ? (n--, k = a) : i[b] ? (j.push(new RegExp(i[b])), null === l && (l = j.length - 1), k > a && (m = j.length - 1)) : j.push(null) }), this.trigger("unmask").each(function () { function h() { if (g.completed) { for (var a = l; m >= a; a++) if (j[a] && C[a] === p(a)) return; g.completed.call(B) } } function p(a) { return g.placeholder.charAt(a < g.placeholder.length ? a : 0) } function q(a) { for (; ++a < n && !j[a];); return a } function r(a) { for (; --a >= 0 && !j[a];); return a } function s(a, b) { var c, d; if (!(0 > a)) { for (c = a, d = q(b) ; n > c; c++) if (j[c]) { if (!(n > d && j[c].test(C[d]))) break; C[c] = C[d], C[d] = p(d), d = q(d) } z(), B.caret(Math.max(l, a)) } } function t(a) { var b, c, d, e; for (b = a, c = p(a) ; n > b; b++) if (j[b]) { if (d = q(b), e = C[b], C[b] = c, !(n > d && j[d].test(e))) break; c = e } } function u() { var a = B.val(), b = B.caret(); if (o && o.length && o.length > a.length) { for (A(!0) ; b.begin > 0 && !j[b.begin - 1];) b.begin--; if (0 === b.begin) for (; b.begin < l && !j[b.begin];) b.begin++; B.caret(b.begin, b.begin) } else { for (A(!0) ; b.begin < n && !j[b.begin];) b.begin++; B.caret(b.begin, b.begin) } h() } function v() { A(), B.val() != E && B.change() } function w(a) { if (!B.prop("readonly")) { var b, c, e, f = a.which || a.keyCode; o = B.val(), 8 === f || 46 === f || d && 127 === f ? (b = B.caret(), c = b.begin, e = b.end, e - c === 0 && (c = 46 !== f ? r(c) : e = q(c - 1), e = 46 === f ? q(e) : e), y(c, e), s(c, e - 1), a.preventDefault()) : 13 === f ? v.call(this, a) : 27 === f && (B.val(E), B.caret(0, A()), a.preventDefault()) } } function x(b) { if (!B.prop("readonly")) { var c, d, e, g = b.which || b.keyCode, i = B.caret(); if (!(b.ctrlKey || b.altKey || b.metaKey || 32 > g) && g && 13 !== g) { if (i.end - i.begin !== 0 && (y(i.begin, i.end), s(i.begin, i.end - 1)), c = q(i.begin - 1), n > c && (d = String.fromCharCode(g), j[c].test(d))) { if (t(c), C[c] = d, z(), e = q(c), f) { var k = function () { a.proxy(a.fn.caret, B, e)() }; setTimeout(k, 0) } else B.caret(e); i.begin <= m && h() } b.preventDefault() } } } function y(a, b) { var c; for (c = a; b > c && n > c; c++) j[c] && (C[c] = p(c)) } function z() { B.val(C.join("")) } function A(a) { var b, c, d, e = B.val(), f = -1; for (b = 0, d = 0; n > b; b++) if (j[b]) { for (C[b] = p(b) ; d++ < e.length;) if (c = e.charAt(d - 1), j[b].test(c)) { C[b] = c, f = b; break } if (d > e.length) { y(b + 1, n); break } } else C[b] === e.charAt(d) && d++, k > b && (f = b); return a ? z() : k > f + 1 ? g.autoclear || C.join("") === D ? (B.val() && B.val(""), y(0, n)) : z() : (z(), B.val(B.val().substring(0, f + 1))), k ? b : l } var B = a(this), C = a.map(c.split(""), function (a, b) { return "?" != a ? i[a] ? p(b) : a : void 0 }), D = C.join(""), E = B.val(); B.data(a.mask.dataName, function () { return a.map(C, function (a, b) { return j[b] && a != p(b) ? a : null }).join("") }), B.one("unmask", function () { B.off(".mask").removeData(a.mask.dataName) }).on("focus.mask", function () { if (!B.prop("readonly")) { clearTimeout(b); var a; E = B.val(), a = A(), b = setTimeout(function () { B.get(0) === document.activeElement && (z(), a == c.replace("?", "").length ? B.caret(0, a) : B.caret(a)) }, 10) } }).on("blur.mask", v).on("keydown.mask", w).on("keypress.mask", x).on("input.mask paste.mask", function () { B.prop("readonly") || setTimeout(function () { var a = A(!0); B.caret(a), h() }, 0) }), e && f && B.off("input.mask").on("input.mask", u), A() }) } }) });

/*! Autosize 3.0.12 license: MIT http://www.jacklmoore.com/autosize */
!function (e, t) { if ("function" == typeof define && define.amd) define(["exports", "module"], t); else if ("undefined" != typeof exports && "undefined" != typeof module) t(exports, module); else { var n = { exports: {} }; t(n.exports, n), e.autosize = n.exports } }(this, function (e, t) { "use strict"; function n(e) { function t() { var t = window.getComputedStyle(e, null); "vertical" === t.resize ? e.style.resize = "none" : "both" === t.resize && (e.style.resize = "horizontal"), f = "content-box" === t.boxSizing ? -(parseFloat(t.paddingTop) + parseFloat(t.paddingBottom)) : parseFloat(t.borderTopWidth) + parseFloat(t.borderBottomWidth), isNaN(f) && (f = 0), i() } function n(t) { var n = e.style.width; e.style.width = "0px", e.offsetWidth, e.style.width = n, c = t, u && (e.style.overflowY = t), o() } function o() { var t = window.pageYOffset, n = document.body.scrollTop, o = e.style.height; e.style.height = "auto"; var i = e.scrollHeight + f; return 0 === e.scrollHeight ? void (e.style.height = o) : (e.style.height = i + "px", document.documentElement.scrollTop = t, void (document.body.scrollTop = n)) } function i() { var t = e.style.height; o(); var i = window.getComputedStyle(e, null); if (i.height !== e.style.height ? "visible" !== c && n("visible") : "hidden" !== c && n("hidden"), t !== e.style.height) { var r = document.createEvent("Event"); r.initEvent("autosize:resized", !0, !1), e.dispatchEvent(r) } } var d = void 0 === arguments[1] ? {} : arguments[1], s = d.setOverflowX, a = void 0 === s ? !0 : s, l = d.setOverflowY, u = void 0 === l ? !0 : l; if (e && e.nodeName && "TEXTAREA" === e.nodeName && !r.has(e)) { var f = null, c = "hidden", v = function (t) { window.removeEventListener("resize", i), e.removeEventListener("input", i), e.removeEventListener("keyup", i), e.removeEventListener("autosize:destroy", v), r["delete"](e), Object.keys(t).forEach(function (n) { e.style[n] = t[n] }) }.bind(e, { height: e.style.height, resize: e.style.resize, overflowY: e.style.overflowY, overflowX: e.style.overflowX, wordWrap: e.style.wordWrap }); e.addEventListener("autosize:destroy", v), "onpropertychange" in e && "oninput" in e && e.addEventListener("keyup", i), window.addEventListener("resize", i), e.addEventListener("input", i), e.addEventListener("autosize:update", i), r.add(e), u && (e.style.overflowY = "hidden"), a && (e.style.overflowX = "hidden", e.style.wordWrap = "break-word"), t() } } function o(e) { if (e && e.nodeName && "TEXTAREA" === e.nodeName) { var t = document.createEvent("Event"); t.initEvent("autosize:destroy", !0, !1), e.dispatchEvent(t) } } function i(e) { if (e && e.nodeName && "TEXTAREA" === e.nodeName) { var t = document.createEvent("Event"); t.initEvent("autosize:update", !0, !1), e.dispatchEvent(t) } } var r = "function" == typeof Set ? new Set : function () { var e = []; return { has: function (t) { return Boolean(e.indexOf(t) > -1) }, add: function (t) { e.push(t) }, "delete": function (t) { e.splice(e.indexOf(t), 1) } } }(), d = null; "undefined" == typeof window || "function" != typeof window.getComputedStyle ? (d = function (e) { return e }, d.destroy = function (e) { return e }, d.update = function (e) { return e }) : (d = function (e, t) { return e && Array.prototype.forEach.call(e.length ? e : [e], function (e) { return n(e, t) }), e }, d.destroy = function (e) { return e && Array.prototype.forEach.call(e.length ? e : [e], o), e }, d.update = function (e) { return e && Array.prototype.forEach.call(e.length ? e : [e], i), e }), t.exports = d });

String.prototype.padLeft = function (n, pad) { t = ''; if (n > this.length) { for (i = 0; i < n - this.length; i++) { t += pad; } } return t + this; }
String.prototype.padRight = function (n, pad) { t = this; if (n > this.length) { for (i = 0; i < n - this.length; i++) { t += pad; } } return t; }
