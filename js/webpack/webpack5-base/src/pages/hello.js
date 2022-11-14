import "@src/css/hello.css";

import { Button, Element } from "@src/util/element";


export function component() {
  const element = document.createElement("div");
  const btn1Name = "btn2";
  const btn1 = new Button(btn1Name);
  element.className = "hello-box";

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(["Hello", "webpack", ",", "greate"], " ");
  btn1.addEventListener("click", function (e) {
    console.log(e.target.innerHTML);
  });

  Element.add(element, btn1);
  return element;
}
export function update() {
  let helloEl = document.querySelector('.hello-box')
  helloEl && document.body.removeChild(helloEl);
  helloEl = component();
  document.body.appendChild(helloEl);
}
export default function init() {
  document.body.appendChild(component());
}
