<template>
  <div class="page">
    <Menubar/>
    <router-view class="page-content"/>
  </div>
</template>

<script>
import Menubar from './common/Menubar'
export default {
  name: 'page',
  components: {
    Header: require('./common/Header').default,
    Menubar
  },
  methods: {
    addClick () {
      this.$router.push('/pages/member')
    }
  },
  mounted () {
    if (window.sessionStorage.getItem('session') !== 'valid' || !window.sessionStorage.getItem('branch_id')) {
      console.log('no auth info')
      this.$refs.noAuthModal.openSimplert({
        message: '로그인 정보가 없습니다.',
        disableOverlayClick: true,
        customCloseBtnText: '돌아가기',
        customCloseBtnClass: 'btn btn-primary',
        onClose: () => {
          this.$router.replace('/')
        }
      })
    }
    this.$store.commit('setBranchId', window.sessionStorage.getItem('branch_id'))
    this.$store.commit('setBranchName', window.sessionStorage.getItem('branch_name'))
  },
  computed: {
    fabAction () {
      return this.$store.state.fabAction
    },
    addAction () {
      return this.$store.state.addActionCallback
    },
    editAction () {
      return this.$store.state.editActionCallback
    },
    deleteAction () {
      return this.$store.state.deleteActionCallback
    }
  }
}
</script>
<style scoped>
.page {
  width: 100%;
  min-width: 0px;
}

>>> .simplert__content {
  width: 80%;
  border-radius: 1.3rem;
}
>>> .simplert__footer > button:first-child {
  border: 1px #ff4257 solid;
  background-color: #ff4257;
}
>>> .simplert__footer > button:hover {
  background-color: #ff1630 !important;
  border-color: #ff1630 !important;
}
>>> .simplert__body > div {
  font-size: 0.9rem;
}
@media (min-width: 769px) {
  .fab {
    display: none;
  }
}

</style>
