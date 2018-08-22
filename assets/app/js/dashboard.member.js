$(document).ready(function () {
    var app = new Vue({
        el: '#app',
        data: {
            memberData: [],
            selectedRow: -1
        },
        methods: {
            loadMemberData () {
                $.ajax({
                    methods: 'GET',
                    url: 'http://52.230.5.59:3000/api/v1/user',
                    dataType: 'application/json',
                    success: (res) => {
                        this.memberData = res.message
                    }
                })
            },
            memberClick (idx) {
                if (this.selectedRow !== idx) {
                    this.selectedRow = idx
                } else {
                    this.selectedRow = -1
                }
            }
        },
        created: function () {
            this.loadMemberData()
            this.$on('user-detail-modal-close', function () {
                this.selectedRow = -1
            })
        }
    });
    initRangeSelect()
})

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