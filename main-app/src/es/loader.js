import _concat from "lodash/concat";
import _mergeWith from "lodash/mergeWith";
import _typeof from "@babel/runtime/helpers/esm/typeof";

/**
 * @author Kuitos
 * @since 2020-04-01
 */
import { __assign, __awaiter, __generator, __rest } from "tslib";
import { importEntry } from 'import-html-entry';
import getAddOns from './addons';
import { createSandbox } from './sandbox';
import { Deferred, getDefaultTplWrapper, getWrapperId, validateExportLifecycle } from './utils';
import { getMicroAppStateActions } from './globalState';

function assertElementExist(element, id, msg) {
  if (!element) {
    if (msg) {
      throw new Error(msg);
    }

    throw new Error("[qiankun] container element with " + id + " is not existed!");
  }
}

function toArray(array) {
  return Array.isArray(array) ? array : [array];
}

function execHooksChain(hooks, app) {
  if (hooks.length) {
    return hooks.reduce(function (chain, hook) {
      return chain.then(function () {
        return hook(app);
      });
    }, Promise.resolve());
  }

  return Promise.resolve();
}

function validateSingularMode(validate, app) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2
      /*return*/
      , typeof validate === 'function' ? validate(app) : !!validate];
    });
  });
}

function createElement(appContent, strictStyleIsolation) {
  var containerElement = document.createElement('div');
  containerElement.innerHTML = appContent; // appContent always wrapped with a singular div

  var appElement = containerElement.firstChild;

  if (strictStyleIsolation) {
    var innerHTML = appElement.innerHTML;
    appElement.innerHTML = '';
    var shadow = appElement.attachShadow({
      mode: 'open'
    });
    shadow.innerHTML = innerHTML;
  }

  return appElement;
}
/** generate app wrapper dom getter */


function getAppWrapperGetter(appInstanceId, useLegacyRender, strictStyleIsolation, elementGetter) {
  return function () {
    if (useLegacyRender) {
      if (strictStyleIsolation) throw new Error('[qiankun]: cssIsolation must not be used with legacyRender');
      var appWrapper = document.getElementById(getWrapperId(appInstanceId));
      assertElementExist(appWrapper, appInstanceId);
      return appWrapper;
    }

    var element = elementGetter();
    assertElementExist(element, appInstanceId);

    if (strictStyleIsolation) {
      return element.shadowRoot;
    }

    return element;
  };
}

var rawAppendChild = HTMLElement.prototype.appendChild;
var rawRemoveChild = HTMLElement.prototype.removeChild;
/**
 * Get the render function
 * If the legacy render function is provide, used as it, otherwise we will insert the app element to target container by qiankun
 * @param appContent
 * @param container
 * @param legacyRender
 */

function getRender(appContent, container, legacyRender) {
  var render = function render(_a) {
    var element = _a.element,
        loading = _a.loading;

    if (legacyRender) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[qiankun] Custom rendering function is deprecated, you can use the container element setting instead!');
      }

      return legacyRender({
        loading: loading,
        appContent: element ? appContent : ''
      });
    }

    var containerElement = typeof container === 'string' ? document.querySelector(container) : container;
    assertElementExist(containerElement, '', "[qiankun] target container with " + container + " not existed while rendering!");

    if (!containerElement.contains(element)) {
      // clear the container
      while (containerElement.firstChild) {
        rawRemoveChild.call(containerElement, containerElement.firstChild);
      } // append the element to container if it exist


      if (element) {
        rawAppendChild.call(containerElement, element);
      }
    }

    return undefined;
  };

  return render;
}

var appExportPromiseCaches = {};
var appInstanceCounts = {};
var prevAppUnmountedDeferred;
export function loadApp(app, configuration, lifeCycles) {
  if (configuration === void 0) {
    configuration = {};
  }

  var _a;

  return __awaiter(this, void 0, void 0, function () {
    var entry, appName, _b, singular, _c, sandbox, importEntryOpts, _d, template, execScripts, assetPublicPath, appInstanceId, strictStyleIsolation, appContent, element, container, legacyRender, render, containerGetter, global, mountSandbox, unmountSandbox, sandboxInstance, _e, _f, beforeUnmount, _g, afterUnmount, _h, afterMount, _j, beforeMount, _k, beforeLoad, scriptExports, bootstrap, mount, unmount, globalVariableExports, _l, onGlobalStateChange, setGlobalState, offGlobalStateChange;

    var _this = this;

    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          entry = app.entry, appName = app.name;
          _b = configuration.singular, singular = _b === void 0 ? false : _b, _c = configuration.sandbox, sandbox = _c === void 0 ? true : _c, importEntryOpts = __rest(configuration, ["singular", "sandbox"]);
          return [4
          /*yield*/
          , importEntry(entry, importEntryOpts)];

        case 1:
          _d = _m.sent(), template = _d.template, execScripts = _d.execScripts, assetPublicPath = _d.assetPublicPath;
          return [4
          /*yield*/
          , validateSingularMode(singular, app)];

        case 2:
          if (!_m.sent()) return [3
          /*break*/
          , 4];
          return [4
          /*yield*/
          , prevAppUnmountedDeferred && prevAppUnmountedDeferred.promise];

        case 3:
          _m.sent();

          _m.label = 4;

        case 4:
          appInstanceId = appName + "_" + (appInstanceCounts.hasOwnProperty(appName) ? ((_a = appInstanceCounts[appName]) !== null && _a !== void 0 ? _a : 0) + 1 : 0);
          strictStyleIsolation = _typeof(sandbox) === 'object' && !!sandbox.strictStyleIsolation;
          appContent = getDefaultTplWrapper(appInstanceId)(template);
          element = createElement(appContent, strictStyleIsolation);
          container = 'container' in app ? app.container : undefined;
          legacyRender = 'render' in app ? app.render : undefined;
          render = getRender(appContent, container, legacyRender); // 第一次加载设置应用可见区域 dom 结构
          // 确保每次应用加载前容器 dom 结构已经设置完毕

          render({
            element: element,
            loading: true
          });
          containerGetter = getAppWrapperGetter(appInstanceId, !!legacyRender, strictStyleIsolation, function () {
            return element;
          });
          global = window;

          mountSandbox = function mountSandbox() {
            return Promise.resolve();
          };

          unmountSandbox = function unmountSandbox() {
            return Promise.resolve();
          };

          if (sandbox) {
            sandboxInstance = createSandbox(appName, containerGetter, Boolean(singular)); // 用沙箱的代理对象作为接下来使用的全局对象

            global = sandboxInstance.proxy;
            mountSandbox = sandboxInstance.mount;
            unmountSandbox = sandboxInstance.unmount;
          }

          _e = _mergeWith({}, getAddOns(global, assetPublicPath), lifeCycles, function (v1, v2) {
            return _concat(v1 !== null && v1 !== void 0 ? v1 : [], v2 !== null && v2 !== void 0 ? v2 : []);
          }), _f = _e.beforeUnmount, beforeUnmount = _f === void 0 ? [] : _f, _g = _e.afterUnmount, afterUnmount = _g === void 0 ? [] : _g, _h = _e.afterMount, afterMount = _h === void 0 ? [] : _h, _j = _e.beforeMount, beforeMount = _j === void 0 ? [] : _j, _k = _e.beforeLoad, beforeLoad = _k === void 0 ? [] : _k;
          return [4
          /*yield*/
          , execHooksChain(toArray(beforeLoad), app)];

        case 5:
          _m.sent(); // cache the execScripts returned promise


          if (!appExportPromiseCaches[appName]) {
            appExportPromiseCaches[appName] = execScripts(global, !singular);
          }

          return [4
          /*yield*/
          , appExportPromiseCaches[appName]];

        case 6:
          scriptExports = _m.sent();

          if (validateExportLifecycle(scriptExports)) {
            // eslint-disable-next-line prefer-destructuring
            bootstrap = scriptExports.bootstrap; // eslint-disable-next-line prefer-destructuring

            mount = scriptExports.mount; // eslint-disable-next-line prefer-destructuring

            unmount = scriptExports.unmount;
          } else {
            if (process.env.NODE_ENV === 'development') {
              console.warn("[qiankun] lifecycle not found from " + appName + " entry exports, fallback to get from window['" + appName + "']");
            }

            globalVariableExports = global[appName];

            if (validateExportLifecycle(globalVariableExports)) {
              // eslint-disable-next-line prefer-destructuring
              bootstrap = globalVariableExports.bootstrap; // eslint-disable-next-line prefer-destructuring

              mount = globalVariableExports.mount; // eslint-disable-next-line prefer-destructuring

              unmount = globalVariableExports.unmount;
            } else {
              delete appExportPromiseCaches[appName];
              throw new Error("[qiankun] You need to export lifecycle functions in " + appName + " entry");
            }
          }

          _l = getMicroAppStateActions(appInstanceId), onGlobalStateChange = _l.onGlobalStateChange, setGlobalState = _l.setGlobalState, offGlobalStateChange = _l.offGlobalStateChange;
          return [2
          /*return*/
          , {
            name: appInstanceId,
            bootstrap: [bootstrap],
            mount: [function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent() && prevAppUnmountedDeferred) {
                        return [2
                        /*return*/
                        , prevAppUnmountedDeferred.promise];
                      }

                      return [2
                      /*return*/
                      , undefined];
                  }
                });
              });
            }, // 添加 mount hook, 确保每次应用加载前容器 dom 结构已经设置完毕
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  // element would be destroyed after unmounted, we need to recreate it if it not exist
                  element = element || createElement(appContent, strictStyleIsolation);
                  render({
                    element: element,
                    loading: true
                  });
                  return [2
                  /*return*/
                  ];
                });
              });
            }, // exec the chain after rendering to keep the behavior with beforeLoad
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(beforeMount), app)];
                });
              });
            }, mountSandbox, function (props) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , mount(__assign(__assign({}, props), {
                    container: containerGetter(),
                    setGlobalState: setGlobalState,
                    onGlobalStateChange: onGlobalStateChange
                  }))];
                });
              });
            }, // 应用 mount 完成后结束 loading
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , render({
                    element: element,
                    loading: false
                  })];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(afterMount), app)];
                });
              });
            }, // initialize the unmount defer after app mounted and resolve the defer after it unmounted
            function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent()) {
                        prevAppUnmountedDeferred = new Deferred();
                      }

                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }],
            unmount: [function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(beforeUnmount), app)];
                });
              });
            }, function (props) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , unmount(__assign(__assign({}, props), {
                    container: containerGetter()
                  }))];
                });
              });
            }, unmountSandbox, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  return [2
                  /*return*/
                  , execHooksChain(toArray(afterUnmount), app)];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  render({
                    element: null,
                    loading: false
                  });
                  offGlobalStateChange(appInstanceId); // for gc

                  element = null;
                  return [2
                  /*return*/
                  ];
                });
              });
            }, function () {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      return [4
                      /*yield*/
                      , validateSingularMode(singular, app)];

                    case 1:
                      if (_a.sent() && prevAppUnmountedDeferred) {
                        prevAppUnmountedDeferred.resolve();
                      }

                      return [2
                      /*return*/
                      ];
                  }
                });
              });
            }]
          }];
      }
    });
  });
}