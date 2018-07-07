import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import TabContainer from './views/TabContainer.vue';
import Members from './views/tabs/Members.vue';
import Statistics from './views/tabs/Statistics.vue';
import Category from './views/tabs/Category.vue';
import CS from './views/tabs/Customer-Service.vue';
import Etc from './views/tabs/Etc.vue';
import Push from './views/tabs/Push.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/management',
      name: 'TabContainer',
      component: TabContainer,
      children: [
        {
          path: 'member',
          name: 'member',
          component: Members,
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: Statistics,
        },
        {
          path: 'category',
          name: 'category',
          component: Category,
        },
        {
          path: 'push',
          name: 'push',
          component: Push,
        },
        {
          path: 'customer-service',
          name: 'cs',
          component: CS,
        },
        {
          path: 'etc',
          name: 'etc',
          component: Etc,
        },
      ],
    },
  ],
});
