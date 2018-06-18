<template>
  <header>
    <b-container class="py-3">
      <router-link to="/pages/beverage" tag="div">
        <img src="../../assets/logo.png" />
        <span>&nbsp;메뉴보드 지점용</span>
      </router-link>
      <span>
        released on {{ releaseDate }}
      </span>
    </b-container>
    <b-navbar id="menubar" variant="dark">
      <router-link to="beverage" tag="div"
                    class="nav-item nav-link">
        <span><icon name="beer" scale="0.8"/> 음료</span>
      </router-link>
      <router-link to="bread" tag="div"
                    class="nav-item nav-link">
        <span><icon name="bell" scale="0.8"/> 빵알림</span>
      </router-link>
      <router-link to="pop" tag="div"
                    class="nav-item nav-link">
        <span><icon name="images" scale="0.8"/> POP</span>
      </router-link>
      <div class="nav-item nav-link" @click="logout">
        <icon class="icon" name="cog" scale="0.8"/> 로그아웃
      </div>
    </b-navbar>
  </header>
</template>
<script>
export default {
  name: 'Menubar',
  data () {
    return {
      releaseDate: '18.06.09'
    }
  },
  methods: {
    logout () {
      this.$router.replace('/')
      window.sessionStorage.clear()
      window.$localStorage.clear()
    }
  }
}
</script>
<style scoped>
header {
  background-color: #fff;
}
.container {
  background-color: #fff;
}
.container span {
  height: 100%;
  vertical-align: middle;
  text-decoration: none;
  color: #000;
}
.container > div {
  display: inline-block;
  vertical-align: middle;
  font-size: 0.9rem;
  font-weight: 600;
  font-size: 1.4em;
}
.container img {
  height: 2.2em;
}
.container > span {
  font-size: 0.7em;
  vertical-align: sub;
  color: #888;
}
.navbar {
  padding: 0 1.1em;
}
nav > div {
  color: #fff;
  font-weight: 300;
}
nav > div > .icon {
  vertical-align: baseline;
}

@media (min-width: 768px) {
  .navbar {
    width: 100%;
    padding-left: 15%;
    padding-right: 15%;
  }
}

</style>
