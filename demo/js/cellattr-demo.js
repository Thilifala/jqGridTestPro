
const colModel = [ //jqGrid每一列的配置信息。包括名字，索引，宽度,对齐方式.....
    { name: 'id', index: 'id', width: 55 },
    { name: 'invdate', index: 'invdate', width: 90 },
    { name: 'name', index: 'name asc, invdate', width: 100 },
    { name: 'amount', index: 'amount', width: 80, align: "right" },
    { name: 'tax', index: 'tax', width: 80, align: "right" },
    { name: 'total', index: 'total', width: 80, align: "right" },
    { name: 'note', index: 'note', width: 150, sortable: false }
];

const colModel3 = [
    { name: 'id', index: 'id', width: 20 },
    {
        name: 'invdate', index: 'invdate', width: 90,
        cellattr: function (rowId, value, rowObject, colModel, arrData) {
            return 'id=\'invdate' + rowId + "\'";
        }
    },
    {
        name: 'name', index: 'name asc, invdate', width: 100,
        cellattr: function (rowId, value, rowObject, colModel, arrData) {
            return 'id=\'name' + rowId + "\'";
        }
    },
    {
        name: 'amount', index: 'amount', width: 80, align: "right",
        // cellattr: function (rowId, value, rowObject, colModel, arrData) {
        //     return " style=display:none; ";
        // }
    },
    { name: 'tax', index: 'tax', width: 80, align: "right" },
    { name: 'total', index: 'total', width: 80, align: "right" },
    { name: 'note', index: 'note', width: 150, sortable: false }
];

function pageInit() {
    jQuery("#list2").jqGrid({
        url: 'data/JSONData.json',
        datatype: "json",
        colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
        colModel: colModel3,
        rowNum: 10,
        width: 700,
        rowList: [10, 20, 30],
        pager: '#pcolspan',
        sortname: 'invdate',
        viewrecords: true,
        sortorder: "desc",
        // jsonReader: { repeatitems: false },
        caption: "Data colspan", height: '100%',
        onCellSelect: function (rowId, iCol, cellcontent, e) {
            console.log('cellcontent:' + cellcontent);
            // $("#list2 td").css('background','white');
            // $(e.target).css('background','#fbec88');
            // $(e.target).parent('tr').css('border','1px solid #a6c9e2');
        },
        gridComplete: function () {
            var gridName = 'list2';
            Merger(gridName, 'name');
            Merger(gridName, 'invdate');
            bindEvent();
        }
    });
    jQuery("#list2").jqGrid('navGrid', '#pcolspan', { edit: false, add: false, del: false });
    jQuery("#list2").jqGrid('bindKeys', { "onEnter": function (rowid) { alert("你enter了一行， id为:" + rowid) } });
}


//公共调用方法
function Merger(gridName, CellName) {
    //得到显示到界面的id集合
    var mya = $("#" + gridName + "").getDataIDs();
    //当前显示多少条
    var length = mya.length;
    for (var i = 0; i < length; i++) {
        //从上到下获取一条信息
        var before = $("#" + gridName + "").jqGrid('getRowData', mya[i]);
        //定义合并行数
        var rowSpanTaxCount = 1;
        for (j = i + 1; j <= length; j++) {
            //和上边的信息对比 如果值一样就合并行数+1 然后设置rowspan 让当前单元格隐藏
            var end = $("#" + gridName + "").jqGrid('getRowData', mya[j]);
            if (before[CellName] == end[CellName]) {
                rowSpanTaxCount++;
                $("#" + gridName + "").setCell(mya[j], CellName, '', { display: 'none' });
            } else {
                rowSpanTaxCount = 1;
                break;
            }
            $("#" + CellName + "" + mya[i] + "").attr("rowspan", rowSpanTaxCount);
        }
    }
}

let isMutSelectCell = false;
let selectedCol = {};
let mdEvent;
let selectedCell = [];
function setCellSelected($cell) {
    $("#list2 td").css('background', 'white');
    $cell.css('background', '#fbec88');
    $cell.parent('tr').css('border', '1px solid #a6c9e2');
}
function bindEvent() {
    $('#list2 tr').on('click', function () {
        console.log('tr click');
        $(this).removeClass('ui-state-highlight');
    })

    $('#list2 td[role="gridcell"]').on('mousedown', function () {
        let $cell = $(this);
        selectedCol = $cell.attr('aria-describedby');
        setCellSelected($cell);
        isMutSelectCell = true;
        return false;
        // obj.capature&&obj.capature();//低版本IE
    })

    $('#list2 td[role="gridcell"]').on('mousemove', function () {
        let $cell = $(this);
        if (isMutSelectCell) {
            var currSelectedCol = $cell.attr('aria-describedby');
            if(currSelectedCol != selectedCol){
                selectedCol = currSelectedCol;
                setCellSelected($cell);
            }
            else{
                $cell.css('background', '#fbec88');
            }
        }
    })
    $('#list2 td[role="gridcell"]').on('mouseup', function () {
        isMutSelectCell = false;
    })
}

$(function () {
    pageInit();
});