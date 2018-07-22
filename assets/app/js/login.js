'use strict';
$(document).ready(_ => {
    new Vue({
        el: '#app',
        data: {
            id: '',
            pw: ''
        },
        methods: {
            login() {
                console.log(this.id, this.pw)
                if (!this.id || !this.pw) {
                    alert('아이디와 비밀번호를 확인해주세요.')
                    return
                }
                $.ajax({
                    type: 'POST',
                    url: 'http://52.230.5.59:3000/api/v1/admin/login',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        account: this.id,
                        password: this.pw,
                        type: 'admin'
                    }),
                    success: res => {
                        location.href = 'index.html'
                    },
                    error: (request, status, e) => {
                        console.error(e)
                        alert('로그인에 실패했습니다.')
                    }
                })
            }
        }
    })
})