const {
  withNativeFederation,
  shareAll,
} = require("@angular-architects/native-federation/config");

module.exports = withNativeFederation({
  name: "factura-pendiente",

  exposes: {
     "./FacturaPendienteComponent": "./src/app/features/factura-pendiente/pages/factura-pendiente/factura-pendiente.component.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },

  skip: [
    "rxjs/ajax",
    "rxjs/fetch",
    "rxjs/testing",
    "rxjs/webSocket",
    "d3-shape",
    "d3-drag",
    "d3-selection",
    "d3-zoom",
    "cron-parser",
    "d3",
    "d3-array",
    "d3-color",
    "d3-ease",
    "d3-interpolate",
    "d3-scale",
    "d3-time",
    "d3-timer",
    "d3-transition",
    "d3-format",
    "d3-path",
    "d3-polygon",
    "d3-quadtree",
    "d3-random",
    "d3-svg",
    "d3-voronoi",
    "ng-zorro-antd/graph",
    "ng-zorro-antd/cron-expression",
    "ng-zorro-antd",
  ],

  features: {
    ignoreUnusedDeps: true,
  },
});
