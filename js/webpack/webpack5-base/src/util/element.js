export class Element {
  name = "";
  text = "";
  el = null;
  constructor(name) {
    this.name = name;
    this.text = name;
  }
  set text(value) {
    this.text = value;
  }
  getHtml() {
    return "";
  }
  getNode() {
    return null;
  }
  addEventListener(eName, handler) {
    this.el.addEventListener(eName, handler);
  }
  static add(domElementObj, elementObj) {
    const node = elementObj.getNode();
    domElementObj.appendChild(node);
  }
}


export class Button extends Element {
  constructor(name) {
    super(name);
    const el = document.createElement("Button");
    el.innerHTML = this.text;
    el.className = "el-button";
    this.el = el;
  }
  getNode() {
    return this.el;
  }

  getHtml() {
    return `<button>${this.text}</button>`;
  }
  destroy() {
    this.el = null;
  }
}
