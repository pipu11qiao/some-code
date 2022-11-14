import _ from "lodash";
import "./css/reset.css";
import printMe from "./print";

import helloPage, { update } from "./pages/hello";

helloPage();
printMe();

if (module.hot) {
  module.hot.accept("./print.js", function () {
    console.log("Accepting the updated printMe module!");
    printMe();
  });

  module.hot.accept("./pages/hello.js", function () {
    console.log("Accepting the updated hello module!");
    update();
  });
}
