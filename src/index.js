import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/index';
import * as serviceWorker from './serviceWorker';
ReactDOM.render(<App />, document.getElementById('root'));

//阻止浏览器默认事件
// document.getElementsByTagName("body")[0].addEventListener('touchstart', function (e) {
//     if (e.target.nodeName == 'INPUT' || e.target.nodeName == 'SELECT' || e.target.classList[0] == 'keyboard-item' || e.target.classList[0] == 'list-head' || e.target.classList[0] == 'list-count' || e.target.classList[0] == 'trade-list-li') {
//         return;
//     }
//     e.preventDefault();
// });
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
