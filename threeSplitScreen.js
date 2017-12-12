var p_timer;
var H = 0;
var m = 0;
var s = 0;
var hstr = '';
var HH = 0;
var mm = 0;
var ss = 0;
var str = '';
var etime = 0;
var isLearned;
var seeVideoTime;
var _init = true;
var role = '';
var depts = '';
$(function () {
    isLearned = $("#isLearned").val();
    role = $("#role").val();
    depts = $("#depts").val();
    seeVideoTime = $("#seeVideoTime").val();
    if (!seeVideoTime) {
        seeVideoTime = 0;
    }
    videoTime = $("#videoTime").val();
    if (!videoTime) {
        videoTime = 0;
    }
    var video = document.getElementById("video_");
    var video_ = document.getElementById("video_");
    if ($("#isTime").val() == "Y") {
        video_.addEventListener("timeupdate", function () {
            var durationed = getFormatTime(this.currentTime);
            var durations = durationed.split(':');
            var duration = durations[0] * 3600 + durations[1] * 60 + durations[2];
            var arr = $("#times").val().split(",");
            for (var timess in arr) {
                var paseTimes = arr[timess].split(':');
                var paseTime = paseTimes[0] * 3600 + paseTimes[1] * 60 + paseTimes[2];
                if (duration == paseTime) {
                    window.open(base + '/train/course/timePractice?examID=' + $("#examID").val() + '&questionID=' + $("#questionid").val() + '&times=' + arr[timess], 'newwindow', 'height=500,width=571,top=115,left=438,toolbar=no,menubar=no,scrollbars=no,resizable=no, location=no,status=no');
                }
            }
        });
    }
    video_.currentTime = videoTime;
    function setCurrentTime(seeVideoTime) {
        video_.currentTime = seeVideoTime;
        _init = false;
    }
    video.addEventListener("play", function () {
        getTimer("play");
    }, false);
    video.addEventListener("pause", function () {
        getTimer("pause");
    }, false);
    video_.play();
    var _maxTime = 0;
    video_.ontimeupdate = function () {
        if (isLearned == "Y") {
            return;
        }
        if (role == "超级管理员" && depts == "01") {
            return;
        }
        var preview = $("#preview").val();
        if (preview == "Y") {
            return;
        }
        if (_maxTime == 0 || _maxTime < video_.currentTime && video_.currentTime - _maxTime < 1) {
            _maxTime = video_.currentTime;
            return;
        }
        if (video_.currentTime - _maxTime > 1) {
            video_.currentTime = _maxTime;
        }
    }
        ;
    // setInterval("mouseNotMove()", 300000);
    var _mouse_x = 0
        , _mouse_y = 0;
    var _m_x = 0
        , _m_y = 0;
    mouseNotMove = function () {
        if (_m_x === _mouse_x && _m_y === _mouse_y) {
            video_.pause();
            return;
        }
        _m_x = _mouse_x,
            _m_y = _mouse_y;
    }
    $("#body").mousemove(function (e) {
        _mouse_x = e.pageX;
        _mouse_y = e.pageY;
    });
    var timerss;
    $('#mouseIn').hover(function () {
        if (_init == true) { }
    }, function () { });
    var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = function () {
        if (!document[hiddenProperty]) {
            video_.pause();
        } else {
            video_.play();
        }
    }
    //document.addEventListener(visibilityChangeEvent, onVisibilityChange);
    video_.onended = function () {
        var seeVideoTime = getFormatTime(video_.currentTime);
        var examID = $("#examID").val();
        var coursesID = $("#coursesID").val();
        $.post(base + "/train/course/watchOver", {
            coursesID: $("#coursesID").val(),
            currentTime: $("#timeText").text(),
            seeVideoTime: seeVideoTime
        }, function (data) {
            if (data.success) {
                train.util.alert("播放完成,即将退出,进入练习界面！", function () {
                    window.location.replace(base + '/train/exam/practiceAtions/' + examID + '/' + coursesID);
                });
                isLearned = "Y";
            } else {
                train.util.error("视频未看完，没有学分");
            }
        }, "json");
    }
    $.post(base + "/train/course/information", {
        coursesID: $("#coursesID").val()
    }, function (data) {
        if (data.success) {
            var time = data.obj.learnTime;
            if (time == undefined || time == null || time == "") {
                time = 0;
            }
            var HH = parseInt(time / 3600)
                , mm = parseInt(time % 3600 / 60)
                , ss = parseInt(time % 60)
                , HH = HH < 10 ? +HH : HH;
            mm = mm < 10 ? +mm : mm;
            ss = ss < 10 ? +ss : ss;
            $("#duration").html(HH + '时' + mm + '分' + ss + '秒');
            var times = data.obj.videoTime;
            if (times == undefined || times == null || times == "") {
                times = 0;
            }
            var HH = parseInt(times / 3600)
                , mm = parseInt(times % 3600 / 60)
                , ss = parseInt(times % 60)
                , HH = HH < 10 ? +HH : HH;
            mm = mm < 10 ? +mm : mm;
            ss = ss < 10 ? +ss : ss;
            $("#currentTime").html(HH + '时' + mm + '分' + ss + '秒');
        } else { }
    }, "json");
    var preview = $("#preview").val();
    if (preview == "Y") {
        $("#show").hide();
    }
    setInterval("one()", 1000);
    $("#tagContent0").show();
    $(".lis").click(function () {
        $(".selectTag").hide();
        $("#tagContent" + $(this).attr("showIndex")).show();
    });
});
function one() {
    str = "";
    if (++ss == 60) {
        if (++mm == 60) {
            HH++;
            mm = 0;
        }
        ss = 0;
    }
    str += HH < 10 ? "0" + HH : HH;
    str += ":";
    str += mm < 10 ? "0" + mm : mm;
    str += ":";
    str += ss < 10 ? "0" + ss : ss;
    document.getElementById("timeTexts").innerHTML = str;
}
function getTimer(flag) {
    if (flag == "pause") {
        document.getElementById("isPlay").innerHTML = '暂停';
    } else {
        document.getElementById("isPlay").innerHTML = '已开始';
    }
    if (flag == "play") {
        p_timer = setInterval("aaaaaa()", 1000);
    } else {
        clearInterval(p_timer);
    }
}
function aaaaaa() {
    str = "";
    if (++ss == 60) {
        if (++mm == 60) {
            HH++;
            mm = 0;
        }
        ss = 0;
    }
    str += HH < 10 ? "0" + HH : HH;
    str += ":";
    str += mm < 10 ? "0" + mm : mm;
    str += ":";
    str += ss < 10 ? "0" + ss : ss;
    document.getElementById("timeText").innerHTML = str;
}
function saveNote(a) {
    if (a == "saveNote") {
        $.post(base + "/train/course/saveNote", {
            coursesID: $("#coursesID").val(),
            content: $("#noteContent").val()
        }, function (data) {
            pageCount = data.totalPageCount;
            recordCount = data.success;
            if (recordCount) {
                train.util.alert(data.msg, function () {
                    $("#noteContent").val("");
                });
            } else {
                train.util.alert(data.msg, function () {
                    $("#noteContent").val("");
                });
            }
        }, "json");
    } else if (a == "saveTime") {
        train.util.ask("保存时间后，当前时间重新开始计时。确定保存？", function () {
            var duration = getFormatTime(video_.duration);
            var seeVideoTime = getFormatTime(video_.currentTime);
            $.post(base + "/train/course/saveTime", {
                currentTime: $("#timeText").text(),
                coursesID: $("#coursesID").val(),
                videoTime: $("#timeText").text(),
                durationTime: duration,
                seeVideoTime: seeVideoTime
            }, function (data) {
                pageCount = data.totalPageCount;
                recordCount = data.success;
                if (recordCount) {
                    alert(data.msg);
                    clearInterval(p_timer);
                    ss = 0;
                    mm = 0;
                    HH = 0;
                    document.getElementById("timeText").innerHTML = '00:00:00';
                } else {
                    alert(data.msg);
                }
            }, "json");
        });
    } else if (a == "saveCollection") {
        $.post(base + "/train/course/saveCollection", {
            coursesID: $("#coursesID").val()
        }, function (data) {
            pageCount = data.totalPageCount;
            recordCount = data.success;
            if (recordCount) {
                train.util.alert(data.msg, function () { });
            } else {
                train.util.alert(data.msg, function () { });
            }
        }, "json");
    }
}
function getFormatTime(time) {
    var h = parseInt(time / 3600)
        , m = parseInt(time % 3600 / 60)
        , s = parseInt(time % 60);
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return h + ":" + m + ":" + s;
}
setInterval("times()", 10000);
function times() {
    var duration = getFormatTime(video_.duration);
    var seeVideoTime = getFormatTime(video_.currentTime);
    $.post(base + "/train/course/autoSaveTime", {
        currentTime: $("#timeTexts").text(),
        coursesID: $("#coursesID").val(),
        videoTime: parseInt(document.getElementById("video_").currentTime),
        durationTime: duration + "",
        seeVideoTime: seeVideoTime
    }, function (data) {
        pageCount = data.totalPageCount;
        recordCount = data.success;
        if (recordCount) {
            clearInterval(p_timer);
            ss = 0;
            mm = 0;
            HH = 0;
            document.getElementById("timeTexts").innerHTML = '00:00:00';
        } else { }
    }, "json");
}
;