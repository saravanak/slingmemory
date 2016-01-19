import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import App from './slingshot/containers/App';
import configureStore from './slingshot/store/configureStore';
import './slingshot/styles/styles.scss'; //Yep, that's right. You can import SASS/CSS files too! Webpack will run the associated loader and plug this into the page.
import * as dir from 'director';
var FluxGameApp = require('./flux_memory/js/components/GameApp.js');
var NormalGameApp = require('./normal_memory/components/GameApp.js');
var TileStore = require('./flux_memory/js/stores/TileStore.js');
var MessageStore = require('./flux_memory/js/stores/MessageStore.js');

const store = configureStore();

const routes = {
  '/fuel':{
    on: function(){
      render(
        <Provider store={store}>
        <App />
        </Provider>, document.getElementById('app')
      );
    }
  },
  '/flux_memory':{
    on: function(){

      React.render(
        <FluxGameApp />,
        document.getElementById('app')
      );
    }
  },
  '/normal_memory':{
    on: function(){
      var props = {
        allTiles: TileStore.getAll(),
        message: MessageStore.getMessage(),
        isWaiting: false
      };

      React.render(
        <NormalGameApp {...props}/>,
        document.getElementById('app')
      );
    }
  }
};
window.router = dir.Router(routes);
window.router.init('/fuel');

