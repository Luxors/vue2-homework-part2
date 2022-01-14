import './assets/css/style.css';
import {
  init,
  classModule,
  propsModule,
  attributesModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";
import { reactive, watchEffect } from "./reactive";

// https://github.com/snabbdom/snabbdom#key--string--number

const patch = init([
  classModule,
  propsModule,
  attributesModule,
  styleModule,
  eventListenersModule,
]);

const app = document.getElementById("app");

// eslint-disable-next-line no-unused-vars
const state = reactive({
  count: 0
});

// eslint-disable-next-line no-unused-vars
const stateArray = reactive([
  { id: 1, name: "Guduozi", decsription: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency." },
  { id: 2, name: "Moeuver", decsription: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son." },
  { id: 3, name: "Airen", decsription: "The early life and career of Vito Corleone in 1920s New York is portrayed while his son, Michael, expands and tightens his grip on his crime syndicate stretching from Lake Tahoe, Nevada to pre-revolution 1958 Cuba." },
  { id: 4, name: "Chonter", decsription: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham" },
  { id: 5, name: "Heben", decsription: "The lives of two mob hit men, a boxer, a gangster's wife" },
  { id: 6, name: "Lienger", decsription: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo" }
]);

const defaultUser = stateArray[5];

function getLastId(arr) {
  return arr[arr.length - 1] ? arr[arr.length - 1].id + 1 : 1;
}

let uid = getLastId(stateArray);

function getImage(name) {
  return new URL(`./assets/img/${name}.jpg`, import.meta.url).href
}

function addUser() {
  return e => {
    const randomUser = stateArray[Math.floor(Math.random())] ?? defaultUser;
    stateArray.unshift({
      id: uid++,
      name: randomUser.name,
      decsription: randomUser.decsription,
    });
  }
}

function removeUser(id) {
  return e => {
    const foundUser = stateArray.findIndex(user => user.id === id);
    if (foundUser > -1) {
      stateArray.splice(foundUser, 1);
      uid = getLastId(stateArray);
    }
    return foundUser;
  }
}

function view(data) {
  return h('div.content', [
    h('header.content-header', [
      h('button.btn.btn--add', { attrs: { type: 'button' }, on: { click: addUser() } }, 'Add user'),
    ]),
    h('ul.list', data.map(user => {
      return h('li.list-item', { key: user.id }, [
        h('img.list-item-image', { attrs: { src: `${getImage(user.name)}` } }),
        h('div.list-item-info', [
          h('h3.list-item-title', `${user.name} ${user.id}`),
          h('p.list-item-descriptiion', user.decsription),
        ]),
        h('button.btn.btn--remove', { attrs: { type: 'button' }, on: { click: removeUser(user.id) } }, 'X')
      ])
    }))
  ])
}

function render(data) {
  return view(data);
}

let previousVnode = null;

watchEffect(() => {
  const vnode = render(stateArray);
  patch(previousVnode || app, vnode);
  previousVnode = vnode;
});
