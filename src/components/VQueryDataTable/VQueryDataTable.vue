<template lang="pug">
v-card(flat, color="transparent", v-if="loading.firstTime && loading.active")
  v-skeleton-loader(type="table")
v-card.VQueryDataTable(
  flat,
  color="transparent",
  v-else,
  :style="{ '--x-color': options.toolbarFieldsBackground }"
)
  v-form(:disabled="loading.active")
    slot(name="header")
      TableHeader(:options="options", v-on="$listeners")

    slot(name="body")
      p.px-5.py-3.mb-10.grey--text.text--darken-1(v-if="options.description") {{ options.description }}

    DataTable.px-5(
      :options="options",
      v-model="selected",
      :query.sync="iQuery"
    )

    slot(name="footer")
      TableFooter(:options="options", :query="query")

    v-tooltip(left, v-if="fab")
      span {{ fab[1].text }}
      template(#activator="{ attrs, on }")
        v-fab-transition
          v-btn(
            fab,
            right,
            fixed,
            bottom,
            v-bind="attrs",
            v-on="on",
            :color="fab ? fab[1].color : ''",
            :disabled="loading.active",
            v-show="!hideTableFAB && !hideAllActions",
            @click="$emit(`action-table-${fab[0]}`)"
          )
            v-icon {{ fab[1].icon }}
    template(v-if="showDebug")
      .text-h6 Debug
      pre {{ options }}
</template>

<script>
/*
  TODO List:
  - filtros
  - componentes customizaveis
    - chips
    - avatar
    - toggle
    - editable field
  - bulk actions
 */

import TableHeader from "./TableHeader";
import TableFooter from "./TableFooter";
import DataTable from "./DataTable";

const delay = (duration) =>
  new Promise((resolve) => setTimeout(resolve, duration));

export default {
  name: "VQueryDataTable",
  components: { TableHeader, TableFooter, DataTable },
  inheritAttrs: false,
  props: {
    showDebug: { type: Boolean, default: false },

    title: { type: String, default: "" },
    description: { type: String, default: "" },

    toolbarFieldsBackground: { type: String, default: "grey" },
    toolbarFieldsColor: { type: String, default: "primary" },

    hideHeader: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    hideFilter: { type: Boolean, default: false },
    hideMenu: { type: Boolean, default: false },
    hideTableQuickActions: { type: Boolean, default: false },
    hideTableActions: { type: Boolean, default: false },
    hideTableFAB: { type: Boolean, default: false },
    hideSingleActions: { type: Boolean, default: false },
    hideAllActions: { type: Boolean, default: false },

    disablePagination: { type: Boolean, default: false },
    disableSorting: { type: Boolean, default: false },

    tableActions: { type: Object, default: () => ({}) },
    singleActions: { type: Object, default: () => ({}) },
    bulkActions: { type: Object, default: () => ({}) },
    actions: { type: Object, default: () => ({}) },

    headers: { type: Array, required: true },
    items: { type: Array, default: () => null },
    datatable: { type: Object, default: () => ({}) },

    multiSort: { type: Boolean, default: false },
    mustSort: { type: Boolean, default: false },

    disallowDense: { type: Boolean, default: false },

    fetch: { type: Function, default: null },
    query: { type: Object, default: null },
  },
  data: () => ({
    loading: {
      active: true,
      firstTime: true,
    },

    dense: localStorage?.getItem("v-query-data-table:dense") === "true",

    fetchedItems: [],
    totalCount: 0,
    resultCount: 0,
    cache: new Map(),
    iQuery: {
      page: 1,
      itemsPerPage: parseInt(
        localStorage?.getItem("v-query-data-table:itemsPerPage") ?? 10,
        10
      ),
      sortBy: [],
      sortDesc: [],
      groupBy: [],
      groupDesc: [],
      multiSort: false,
      mustSort: false,
    },

    selected: [],

    filtersDrawer: false,

    // Options
    defaultOptions: {
      title: "",
      description: "",

      toolbarFieldsBackground: "grey",
      toolbarFieldsColor: "primary",

      hideSearch: false,
      hideFilter: false,
      hideMenu: false,

      hideTableQuickActions: false,
      hideTableActions: false,
      hideTableFAB: false,
      hideSingleActions: false,
      hideAllActions: false,

      disablePagination: false,
      disableSorting: false,

      datatable: {},

      tableActions: {},
      singleActions: {},
      bulkActions: {},
    },
  }),
  computed: {
    queryJSON() {
      return JSON.stringify(this.iQuery);
    },
    fab() {
      return Object.entries(this.options.tableActions).find(
        ([value, item]) => item.fab
      );
    },
    oldActions() {
      const { single, table, bulk } = this.actions;
      return {
        singleActions: single || {},
        tableActions: table || {},
        bulkActions: bulk || {},
      };
    },
    computedHeaders() {
      const { disableSorting, headers } = this;
      return headers.map((header) => ({
        ...header,
      }));
    },
    options() {
      const { iQuery } = this;
      return {
        ...this.defaultOptions,
        ...this.oldActions,
        ...this.$props,
        loading: this.loading,
        headers: this.computedHeaders,
        query: iQuery,
        clearCache: () => this.clearCache(),
        refresh: () => this.refresh(),
        cleanRefresh: () => this.cleanRefresh(),
        toggleDense: () => this.toggleDense(),
        pagination: {
          pagesCount: Math.ceil(this.totalCount / this.iQuery.itemsPerPage),
          resultCount: this.resultCount,
          totalCount: this.totalCount,
        },
        datatable: {
          ...this.defaultOptions.datatable,
          disableSort: this.disableSort,
          disablePagination: this.disablePagination,
          dense: this.disallowDense ? false : this.dense,
          ...this.datatable,
          items: this.items || this.fetchedItems,
          loading: this.loading.active,
          options: {
            ...this.iQuery,
            ...this.datatable.options,
            multiSort: this.multiSort,
            mustSort: this.mustSort,
          },
        },
      };
    },
  },
  watch: {
    queryJSON: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        this.refresh();
        this.$emit("update:query", JSON.parse(newValue) || {});
      },
    },
    query: {
      deep: true,
      handler(newValue) {
        this.iQuery = JSON.parse(JSON.stringify(newValue)) || {
          page: 1,
          itemsPerPage: 10,
          sortBy: [],
          sortDesc: [],
          groupBy: [],
          groupDesc: [],
          multiSort: false,
          mustSort: false,
        };
      },
    },
  },
  mounted() {
    this.refresh();
  },
  methods: {
    toggleDense() {
      const dense = !this.dense;
      localStorage?.setItem("v-query-data-table:dense", dense);
      this.dense = dense;
    },
    clearCache() {
      this.cache = new Map();
    },
    async getItems() {
      const { queryJSON } = this;
      const fromCache = this.cache.get(queryJSON);
      if (fromCache) return fromCache;
      const response = await this.fetch(JSON.parse(queryJSON));
      this.cache.set(queryJSON, response);
      return response;
    },
    cleanRefresh() {
      this.clearCache();
      this.refresh();
    },
    async refresh() {
      this.loading.active = true;
      if (typeof this.fetch === "function") {
        try {
          const response = await this.getItems();

          if (!response.data) throw new Error("Invalid fetch result");

          this.resultCount = response.resultCount ?? response.data.length;
          this.totalCount = response.totalCount ?? response.data.length;
          this.fetchedItems = response.data;
        } catch (e) {
          console.error(e);

          this.fetchedItems = [];
          this.resultCount = 0;
          this.totalCount = 0;
        }
      }
      this.loading.firstTime = false;
      this.loading.active = false;
    },
  },
};
</script>
