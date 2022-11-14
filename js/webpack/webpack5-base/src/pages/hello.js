import "@src/css/hello.css";

import { Button, Element } from "@src/util/element";

export function component() {
  const element = document.createElement("div");
  const btn1 = new Button("btn1");
  element.className = "hello-box";

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(["Hello", "webpack", ",", "greate"], " ");
  btn1.addEventListener("click", () => {
    console.log("btn1");
  });

  Element.add(element, btn1);
  return element;
}
export default function () {
  document.body.appendChild(component());
}
