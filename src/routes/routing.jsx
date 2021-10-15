import About from '../views/starter/about.jsx';
import KlangValley from '../views/starter/klangValley.jsx';
import EastMalaysia from '../views/starter/eastMalaysia.jsx';
import WestMalaysia from '../views/starter/westMalaysia.jsx';
import Starter from '../views/starter/starter.jsx';
import DataMalaysia from '../views/starter/dataMalaysia.jsx';

var ThemeRoutes = [
  { 
    path: '/dashboard', 
    name: 'Malaysia', 
    icon: 'ti-loop', 
    component: Starter 
  },
  {
    path: '/KlangValley',
    name: 'Klang Valley',
    icon: 'mdi mdi-credit-card-multiple',
    component: KlangValley,
  },
  {
    path: '/EastMalaysia',
    name: 'East Malaysia',
    icon: 'mdi mdi-comment-processing-outline',
    component: EastMalaysia,
  },
  {
    path: '/WestMalaysia',
    name: 'West Malaysia',
    icon: 'mdi mdi-apps',
    component: WestMalaysia,
  },
  /*{
    path: '/DataMalaysia',
    name: 'Data Malaysia',
    icon: 'mdi mdi-apps',
    component: DataMalaysia,
  },*/
  {
    path: '/About',
    name: 'About',
    icon: 'mdi mdi-arrange-send-backward',
    component: About,
  },
  { path: '/', pathTo: '/dashboard', name: 'Dashboard', redirect: true }
];
export default ThemeRoutes;
