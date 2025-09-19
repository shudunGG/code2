/**
 * jQuery MiniUI v3.0
 * 
 * Web Site : http://www.miniui.com
 *
 * Commercial License : http://www.miniui.com/license
 *
 * Copyright(c) 2012 All Rights Reserved. Shanghai PusSoft Co., Ltd (上海普加软件有限公司) [ services@plusoft.com.cn ]. 
 * 
 */


mini.locale = "en-US";


/* Date
-----------------------------------------------------------------------------*/

mini.dateInfo = {
    monthsLong: ["January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    daysLong: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    quarterLong: ['Q1', 'Q2', 'Q3', 'Q4'],
    quarterShort: ['Q1', 'Q2', 'Q3', 'Q4'],
    halfYearLong: ['first half', 'second half'],
    patterns: {
        "d": "M/d/yyyy",
        "D": "dddd, MMMM dd, yyyy",
        "f": "dddd, MMMM dd, yyyy H:mm tt",
        "F": "dddd, MMMM dd, yyyy H:mm:ss tt",
        "g": "M/d/yyyy H:mm tt",
        "G": "M/d/yyyy H:mm:ss tt",
        "m": "MMMM dd",
        "o": "yyyy-MM-ddTHH:mm:ss.fff",
        "s": "yyyy-MM-ddTHH:mm:ss",
        "t": "H:mm tt",
        "T": "H:mm:ss tt",
        "U": "dddd, MMMM dd, yyyy HH:mm:ss tt",
        "y": "MMM, yyyy"
    },
    tt: {
        "AM": "AM",
        "PM": "PM"
    },
    ten: {
        "Early": "Early",
        "Mid": "Mid",
        "Late": "Late"
    },
    today: 'Today',
    clockType: 24
};

/* Number
-----------------------------------------------------------------------------*/
mini.cultures["en"] = {
    name: "en",
    numberFormat: {
        number: {
            pattern: ["n", "-n"],
            decimals: 2,
            decimalsSeparator: ".",
            groupSeparator: ",",
            groupSize: [3]
        },
        percent: {
            pattern: ["n %", "-n %"],
            decimals: 2,
            decimalsSeparator: ".",
            groupSeparator: ",",
            groupSize: [3],
            symbol: "%"
        },
        currency: {
            pattern: ["$n", "($n)"],
            decimals: 2,
            decimalsSeparator: ".",
            groupSeparator: ",",
            groupSize: [3],
            symbol: "$"
        }
    }
}
mini.culture("en");

/* MessageBox
-----------------------------------------------------------------------------*/
if (mini.MessageBox) {
    mini.copyTo(mini.MessageBox, {
        alertTitle: "Alert",
        confirmTitle: "Confirm",
        prompTitle: "Prompt",
        prompMessage: "Input content: ",
        buttonText: {
            ok: "Ok", //"OK",
            cancel: "Cancel", //"Cancel",
            yes: "Yes", //"Yes",
            no: "No" //"No"
        }
    });
}

/* Calendar
-----------------------------------------------------------------------------*/

if (mini.Calendar) {
    mini.copyTo(mini.Calendar.prototype, {
        firstDayOfWeek: 0,
        yesterdayText: "Yesterday",
        todayText: "Today",
        clearText: "Clear",
        okText: "OK",
        cancelText: "Cancel",
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        format: "MMM, yyyy",

        timeFormat: 'H:mm'
    });
}


/* required | loadingMsg
-----------------------------------------------------------------------------*/
for (var id in mini) {
    var clazz = mini[id];
    if (clazz && clazz.prototype && clazz.prototype.isControl) {
        clazz.prototype.requiredErrorText = "不能为空";
        clazz.prototype.loadingMsg = "Loading...";
    }

}

/* VTypes
-----------------------------------------------------------------------------*/
mini.copyTo(mini.VTypes, {
    minDateErrorText: 'Date can not be less than {0}',
    maxDateErrorText: 'Date can not be greater than {0}',

    uniqueErrorText: "This field is unique.",
    requiredErrorText: "This field is required.",
    emailErrorText: "Please enter a valid email address.",
    urlErrorText: "Please enter a valid URL.",
    floatErrorText: "Please enter a valid number.",
    intErrorText: "Please enter only digits",
    dateErrorText: "Please enter a valid date. Date format is {0}",
    maxLengthErrorText: "Please enter no more than {0} characters.",
    minLengthErrorText: "Please enter at least {0} characters.",
    maxErrorText: "Please enter a value less than or equal to {0}.",
    minErrorText: "Please enter a value greater than or equal to {0}.",
    rangeLengthErrorText: "Please enter a value between {0} and {1} characters long.",
    rangeCharErrorText: "Please enter a value between {0} and {1} characters long.",
    rangeErrorText: "Please enter a value between {0} and {1}.",

    mobileErrorText: "The mobile number entered is not in the correct format.",
    telErrorText: "The fixed phone number entered is not in the correct format",
    phoneErrorText: "The phone number entered is not in the correct format",
    phoneWithShortNumErrorText: "The phone number entered is not in the correct format",
    postCodeErrorText: "The zip code entered is not in the correct format",
    orgCodeErrorText: "The organization code entered is not in the correct format",
    idCardErrorText: "The ID number entered is not in the correct format",
    decimalLengthErrorText: "Please enter a decimal, and you can only enter {0} decimal places at most",
    projectCodeErrorText: "The unified code entered is not in the correct format"
});

/* Pager
-----------------------------------------------------------------------------*/

if (mini.Pager) {
    mini.copyTo(mini.Pager.prototype, {
        firstText: "First",
        prevText: "Prev",
        nextText: "Next",
        lastText: "Last",
        pageInfoText: "Pre page {0} records , all {1} records."
    });
}

/* DataGrid
-----------------------------------------------------------------------------*/
if (mini.DataGrid) {
    mini.copyTo(mini.DataGrid.prototype, {
        emptyText: "No data returned."
    });
}

/* WebUploader
-----------------------------------------------------------------------------*/
if (mini.WebUploader) {
    mini.copyTo(mini.WebUploader.prototype, {
        pickerText: 'choose files',
        startText: 'start uploading',
        pauseText: 'pause uploading',
        numLimitErrorText: 'too many files！</br>should be less then {0} files',
        sizeLimitErrorText: 'total size too big！</br>accepted total size: {0}KB',
        typeDeniedErrorText: 'file type error！</br>accepted types：{0}',
        sizeErrorText: 'file size too big！</br>accepted single file size: {0}KB'
    });
}

/* DataExport
-----------------------------------------------------------------------------*/
if (mini.DataExport) {
    mini.copyTo(mini.DataExport.prototype, {
        expandText: 'close panel',
        collapseText: 'open panel',
        exportText: 'export',
        panelTitle: 'config export column',
        leftListTitle: 'to be selected columns',
        rightListTitle: 'the selected columns',
        tipInfo: "Don't fill the page number or export the current page",
        pageNumInfo: 'Export from the current page to page',
        pageText: ''
    });
}



/**
 * Epoint F9
 * 
 */

/* condition search button
-----------------------------------------------------------------------------*/
var epoint_search_text = 'search';
var epoint_search_title = 'more conditions';
var epoint_reset_text = 'reset';
var epoint_close_text = 'close';

var epoint_local = {
    search_text: 'search',
    search_title: 'more conditions',
    reset_text: 'reset',
    close_text: 'close',
    selected_text: 'selected',
    error_tip: 'error tip',
    validate_failed: 'validate failed',
    default_error_message: 'Some fields are not verified, please check again!',
    empty_beginning_text: 'Please enter '
};