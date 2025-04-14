/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! gsap */ \"gsap\");\n/* harmony import */ var gsap__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(gsap__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! gsap/dist/ScrollTrigger */ \"gsap/dist/ScrollTrigger\");\n/* harmony import */ var gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4__);\n\n\n\n\n\nfunction MyApp({ Component, pageProps }) {\n    (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(()=>{\n        // Register ScrollTrigger plugin\n        gsap__WEBPACK_IMPORTED_MODULE_3__.gsap.registerPlugin(gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4__.ScrollTrigger);\n        // Initialize reveal animations\n        const revealElements = document.querySelectorAll(\".reveal\");\n        revealElements.forEach((element)=>{\n            gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4__.ScrollTrigger.create({\n                trigger: element,\n                start: \"top 80%\",\n                onEnter: ()=>element.classList.add(\"active\"),\n                onLeave: ()=>element.classList.remove(\"active\"),\n                onEnterBack: ()=>element.classList.add(\"active\"),\n                onLeaveBack: ()=>element.classList.remove(\"active\")\n            });\n        });\n        return ()=>{\n            // Clean up ScrollTrigger instances\n            gsap_dist_ScrollTrigger__WEBPACK_IMPORTED_MODULE_4__.ScrollTrigger.getAll().forEach((trigger)=>trigger.kill());\n        };\n    }, []);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n        ...pageProps\n    }, void 0, false, {\n        fileName: \"C:\\\\Users\\\\vrdik\\\\Desktop\\\\Nebula-Portal\\\\pages\\\\_app.js\",\n        lineNumber: 30,\n        columnNumber: 10\n    }, this);\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUErQjtBQUNHO0FBQ047QUFDNEI7QUFFeEQsU0FBU0csTUFBTSxFQUFFQyxTQUFTLEVBQUVDLFNBQVMsRUFBRTtJQUNyQ0wsZ0RBQVNBLENBQUM7UUFDUixnQ0FBZ0M7UUFDaENDLHNDQUFJQSxDQUFDSyxjQUFjLENBQUNKLGtFQUFhQTtRQUVqQywrQkFBK0I7UUFDL0IsTUFBTUssaUJBQWlCQyxTQUFTQyxnQkFBZ0IsQ0FBQztRQUNqREYsZUFBZUcsT0FBTyxDQUFDLENBQUNDO1lBQ3RCVCxrRUFBYUEsQ0FBQ1UsTUFBTSxDQUFDO2dCQUNuQkMsU0FBU0Y7Z0JBQ1RHLE9BQU87Z0JBQ1BDLFNBQVMsSUFBTUosUUFBUUssU0FBUyxDQUFDQyxHQUFHLENBQUM7Z0JBQ3JDQyxTQUFTLElBQU1QLFFBQVFLLFNBQVMsQ0FBQ0csTUFBTSxDQUFDO2dCQUN4Q0MsYUFBYSxJQUFNVCxRQUFRSyxTQUFTLENBQUNDLEdBQUcsQ0FBQztnQkFDekNJLGFBQWEsSUFBTVYsUUFBUUssU0FBUyxDQUFDRyxNQUFNLENBQUM7WUFDOUM7UUFDRjtRQUVBLE9BQU87WUFDTCxtQ0FBbUM7WUFDbkNqQixrRUFBYUEsQ0FBQ29CLE1BQU0sR0FBR1osT0FBTyxDQUFDRyxDQUFBQSxVQUFXQSxRQUFRVSxJQUFJO1FBQ3hEO0lBQ0YsR0FBRyxFQUFFO0lBRUwscUJBQU8sOERBQUNuQjtRQUFXLEdBQUdDLFNBQVM7Ozs7OztBQUNqQztBQUVBLGlFQUFlRixLQUFLQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vbmVidWxhLWxhbmRpbmctcGFnZS8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBnc2FwIH0gZnJvbSAnZ3NhcCc7XG5pbXBvcnQgeyBTY3JvbGxUcmlnZ2VyIH0gZnJvbSAnZ3NhcC9kaXN0L1Njcm9sbFRyaWdnZXInO1xuXG5mdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBSZWdpc3RlciBTY3JvbGxUcmlnZ2VyIHBsdWdpblxuICAgIGdzYXAucmVnaXN0ZXJQbHVnaW4oU2Nyb2xsVHJpZ2dlcik7XG4gICAgXG4gICAgLy8gSW5pdGlhbGl6ZSByZXZlYWwgYW5pbWF0aW9uc1xuICAgIGNvbnN0IHJldmVhbEVsZW1lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnJldmVhbCcpO1xuICAgIHJldmVhbEVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICAgIFNjcm9sbFRyaWdnZXIuY3JlYXRlKHtcbiAgICAgICAgdHJpZ2dlcjogZWxlbWVudCxcbiAgICAgICAgc3RhcnQ6ICd0b3AgODAlJyxcbiAgICAgICAgb25FbnRlcjogKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKSxcbiAgICAgICAgb25MZWF2ZTogKCkgPT4gZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKSxcbiAgICAgICAgb25FbnRlckJhY2s6ICgpID0+IGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyksXG4gICAgICAgIG9uTGVhdmVCYWNrOiAoKSA9PiBlbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIENsZWFuIHVwIFNjcm9sbFRyaWdnZXIgaW5zdGFuY2VzXG4gICAgICBTY3JvbGxUcmlnZ2VyLmdldEFsbCgpLmZvckVhY2godHJpZ2dlciA9PiB0cmlnZ2VyLmtpbGwoKSk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDtcbiJdLCJuYW1lcyI6WyJ1c2VFZmZlY3QiLCJnc2FwIiwiU2Nyb2xsVHJpZ2dlciIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIiwicmVnaXN0ZXJQbHVnaW4iLCJyZXZlYWxFbGVtZW50cyIsImRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImZvckVhY2giLCJlbGVtZW50IiwiY3JlYXRlIiwidHJpZ2dlciIsInN0YXJ0Iiwib25FbnRlciIsImNsYXNzTGlzdCIsImFkZCIsIm9uTGVhdmUiLCJyZW1vdmUiLCJvbkVudGVyQmFjayIsIm9uTGVhdmVCYWNrIiwiZ2V0QWxsIiwia2lsbCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "gsap":
/*!***********************!*\
  !*** external "gsap" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("gsap");

/***/ }),

/***/ "gsap/dist/ScrollTrigger":
/*!******************************************!*\
  !*** external "gsap/dist/ScrollTrigger" ***!
  \******************************************/
/***/ ((module) => {

"use strict";
module.exports = require("gsap/dist/ScrollTrigger");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();