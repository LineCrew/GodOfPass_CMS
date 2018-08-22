$(document).ready(function() {
    initRangeSelect()
})

function initQuestionTable() {
    $('#question-table').mDatatable({
        data: {
            type: 'remote',
            source: {
                read: {
                    url: BASE_URL + '/api/v1/',
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    map: function(raw) {
                        return raw.message
                    }
                }
            },
            serverPaging: false,
            serverFiltering: false,
            serverSorting: false,
            autoColumns: true
        },
        layout: {
            scroll: false,
            footer: true
        },
        column: [

        ],
        sortable: true,
        pagination: true,
        search: $('.table-search'),
        translate: {
            records: {
                processing: '잠시 기다려 주세요..',
                noRecords: '표시할 데이터가 없습니다.'
            }
        }
    })
}

var start = moment()
var end = moment()

function initRangeSelect() {
    console.log('init range select component')
    $('#date-range-select').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
            '오늘': [moment(), moment()],
            '어재': [moment().subtract(1, 'days', moment().subtract(1, 'days'))],
            '이번 주': [moment().subtract(6, 'days'), moment()],
            '지난 주': [moment().subtract(13, 'days'), moment().subtract(7, 'days')],
            '이번 달': [moment().startOf('month'), moment().endOf('month')],
            '지난 달': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, function(start, end) {
        $('#date-range-select span').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'))
    })
    $('#date-range-select span').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'))
}