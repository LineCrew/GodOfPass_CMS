var BASE_URL = 'http://13.125.174.175:3000'
var API_V1 = BASE_URL + '/api/v1'

Vue.component('user-detail-modal', {
    template:
    `<div id="userDetailModal" class="modal fade" role="dialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h6 class="modal-title">회원 상세 정보</h6>
                </div>
                <div class="modal-body">
                    <table v-if="userData !== null" class="table">
                        <tbody>
                            <tr>
                                <td>이름</td>
                                <td>{{ userData.name }}</td>
                            </tr>
                            <tr>
                                <td>별명</td>
                                <td>{{ userData.nickname }}</td>
                            </tr>
                            <tr>
                                <td>이메일</td>
                                <td>{{ userData.email }}</td>
                            </tr>
                            <tr>
                                <td>전화번호</td>
                                <td>{{ userData.phone }}</td>
                            </tr>
                            <tr>
                                <td>가입 유형</td>
                                <td>{{ userData.loginType }}</td>
                            </tr>
                            <tr>
                                <td>캐릭터</td>
                                <td>{{ userData.character }}</td>
                            </tr>
                            <tr>
                                <td>최근 접속 시간</td>
                                <td>{{ new Date().toString() }}</td>
                            </tr>
                            <tr>
                                <td>전적</td>
                                <td>0승 0패</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary m-btn m-btn--custom m-btn--bolder m-btn--uppercase" @click="closeModal">닫기</button>
                </div>
            </div>
        </div>
    </div>`,
    props: {
        'user-id': {
            type: String,
            required: true
        }
    },
    data: function () {
        return {
            userData: null
        }
    },
    methods: {
        closeModal () {
            $('#userDetailModal').modal('hide');
            this.$parent.$emit('user-detail-modal-close')
        }
    },
    created: function () {
        if (this.userId) {
            $.ajax({
                method: 'GET',
                url: API_V1 + `/user/${this.userId}`,
                dataType: 'application/json',
                success: res => {
                    this.userData = res.message
                    this.userData = {
                        name: 'Dummy',
                        nickname: '예시데이터',
                        email: 'abc@def.com',
                        phone: '010-1111-2222',
                        loginType: 'facebook',
                        character: 'ow'
                    }
                    console.log(this.userData)
                },
                error: e => {
                    this.userData = {
                        name: 'Dummy',
                        nickname: '예시데이터',
                        email: 'abc@def.com',
                        phone: '010-1111-2222',
                        loginType: 'facebook',
                        character: 'ow'
                    }
                }
            })
        }
    },
    mounted: function () {
        $('#userDetailModal').modal('show')
    }
})

function getTopics (callback) {
    $.ajax(API_V1 + '/topic', {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        dataType: 'json',
        success: res => {
            if (callback != undefined) {
                callback(res)
            }
        },
        error: (xhr, errStatus, error) => {
            alert('중분류 데이터를 가져오지 못했습니다.')
        }
    })
}