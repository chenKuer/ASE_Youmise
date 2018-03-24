import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';
import Navbar from '@/components/Navbar';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import Dashboard from '@/components/Dashboard';
import Mycard from '@/components/Mycard';
// import DashboardNav from '@/components/DashboardNav';
import Friends from '@/components/Friends';
import About from '@/components/About';
import Messages from '@/components/Messages';
import FriendsList from '@/components/FriendsList';
import Account from '@/components/Account';

import store from '../store/store';


Vue.use(Router);
// path:"*", redirect(/)

const authToLink =['/', '/login', '/signup', 'dashboard', '/mycard', '/friends', 'about', 'messages'];

const loginGuard = link => async (to, from, next ) => {
  let { authenticated } = store.state.user;
  if(link ==='/mycard'|| link ==='/friends' || link==='/messages') {
      if(authenticated !==1){
        try {
          next('/login');
         
        }catch(e){}
      }else{
        next();
      }
  }else{
    next();
  }
};


export default new Router({
  mode: 'history',
  routes: [{
    path: '/',
    name: 'HelloWorld',
    component: HelloWorld,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    beforeEnter: loginGuard('/'),
  },
  // {
  //   path: '/nav',
  //   name: 'nav',
  //   component: Navbar,
  //   beforeEnter: loginGuard('/'),
  // },
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
    beforeEnter: loginGuard('/signup'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: loginGuard('/dashboard'),
  },
  {
    path: '/mycard',
    name: 'mycard',
    component: Mycard,
    beforeEnter: loginGuard('/mycard'),
  },
  {
    path: '/friends',
    name: 'friends',
    component: Friends,
    beforeEnter: loginGuard('/friends'),
  },
  {
    path: '/about',
    name: 'about',
    component: About,
    beforeEnter: loginGuard('/about'),
  },
  {
    path: '/messages',
    name: 'messages',
    component: Messages,
    beforeEnter: loginGuard('/messages'),
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    beforeEnter: loginGuard('/account'),
  },
  {
    path: '*',
    redirect: '/',
  },
  ],
});
