import ComponentLibrary from "./../../src/main.js";
import vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

export default ({ Vue }) => {
  Vue.use(vuetify);
  Vue.use(ComponentLibrary);
};
