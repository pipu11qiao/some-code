import "@src/css/hello.css";

export function component() {
  const element = document.createElement("div");
  element.className = "hello-box";

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(["Hello", "webpack", ",", "greate"], " ");

  return element;
}
export default function () {
  document.body.appendChild(component());
}
