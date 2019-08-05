import CustomSearch from './self-cearch.vue';
import CustomDict from './self-dict.vue';
import CustomFeedback from './self-feedback.vue';
import CustomFileUpload from './self-fileupload.vue';
import CustomFooter from './self-footer.vue';
import CustomHeard from './self-pagerheard.vue';
import CustomDrawer from './self-pageright.vue';
import CustomPagination from './self-pagination.vue';
import CustomPermRole from './self-roletagperm.vue';
import CustomPerm from './self-perm.vue';
import CustomSelect from './self-select.vue';

let components = [
  CustomDict,
  CustomFeedback,
  CustomFileUpload,
  CustomFooter,
  CustomHeard,
  CustomDrawer,
  CustomPagination,
  CustomPermRole,
  CustomPerm,
  CustomSearch,
  CustomSelect
];

const install = function(Vue) {
  components.map(value => {
    Vue.component(value.name, value);
  });
};

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}
export default Object.assign(components, {install});
