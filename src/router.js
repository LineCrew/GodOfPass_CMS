import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/Login.vue';
import TabContainer from './views/TabContainer';
import Members from './views/tabs/Members';
import Statistics from './views/tabs/Statistics';
import Category from './views/tabs/Category';
import CS from './views/tabs/Customer-Service';
import Etc from './views/tabs/Etc';
import Push from './views/tabs/Push';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Home,
    },
    {
      path: '/management',
      name: 'TabContainer',
      component: TabContainer,
      children: [
        {
          path: 'member',
          name: 'member',
          component: Members
        },
        {
          path: 'statistics',
          name: 'statistics',
          component: Statistics
        },
        {
          path: 'category',
          name: 'category',
          component: Category
        },
        {
          path: 'push',
          name: 'push',
          component: Push
        },
        {
          path: 'customer-service',
          name: 'cs',
          component: CS
        },
        {
          path: 'etc',
          name: 'etc',
          component: Etc
        }
      ]
    }
  ],
});
