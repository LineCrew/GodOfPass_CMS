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
})
