<template>
  <div id="container-login">
    <h1>{{ info_label }}</h1>
      <b-form id="login-form"
              @submit.prevent="login">
        <h2>계정을 입력하세요</h2>
        <b-form-group>
          <b-form-input v-model.trim="id"
                        type="text"
                        placeholder="아이디"/>
          <b-form-input v-model.trim="pw"
                        type="password"
                        placeholder="비밀번호"/>
        </b-form-group>
        <span v-if="error_message" class="text-danger">{{ error_message }}</span>
        <button class="btn btn-primary" :class="{ 'mt-3': error_message }" type="submit">
          로그인
        </button>
        <router-link tag="p" to="/password">비밀번호 변경</router-link>
      </b-form>
      <md-snackbar :md-active.sync="isSnackbarVisible">
        <span>{{ snackbarTitle }}</span>
      </md-snackbar>
  </div>
</template>
<script>
export default {
  name: 'Login',
  data() {
    return {
      info_label: '합격의 新',
      id: '',
      pw: '',
      failtureText: '',
      error_message: null,
      snackbarTitle: '',
      isSnackbarVisible: false
    };
  },
};
</script>
<style scoped>
#container-login {
  /* min-width: 480px;
  min-height: 100%;
  padding-bottom: 10rem; */
  min-height: 100vh;
  display: flex;
  flex: 1;
  -ms-flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #ccc;
  background-size: cover;
}

h1 img {
  height: 3rem;
  margin: 0 0.7rem 0.7rem 0;
}

h1 {
  font-size: 1.7rem;
  font-weight: 500;
  color: #fff;
  margin: 0.5rem 0;
}
h2 {
  margin: 0.5rem 0 1.5rem 0;
  font-size: 1.3rem;
  color: #484848;
  text-align: center;
}

p {
  margin: 0.5rem 0 1.3rem 0;
  font-size: 0.9rem;
  color: #818181;
}

p:last-child {
  margin: 1rem 0;
}

#login-form {
  width: 24rem;
  margin-top: 1rem;
  padding: 2.1em 1.8em;
  border-radius: 20px;
  background: white;
  text-align: center;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  #login-form {
    width: 86%;
    min-width: 20em;
  }
}

.form-group input {
  width: 100%;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 0.7em;
  margin-bottom: 0.5em;
  background: #f6f6f6;
  border-color: #eee;
}
#login-form > button {
  width: 70%;
  margin: 0 auto;
  border-radius: 20px;
  background-color: #ff4257;
  border-color: #ff4257;
}
#login-form > button:hover {
  background-color: #ff1630;
  border-color: #ff1630;
}

.md-snackbar {
  background-color: #323232;
}
.md-snackbar >>> span {
  color: #fff;
}
</style>
