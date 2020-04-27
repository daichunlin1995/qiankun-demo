import _noop from "lodash/noop";
import patchDynamicAppend from './dynamicHeadAppend';
import patchHistoryListener from './historyListener';
import patchTimer from './timer';
import patchWindowListener from './windowListener';
export function patchAtMounting(appName, elementGetter, proxy, singular) {
  return [patchTimer(), patchWindowListener(), patchHistoryListener(), patchDynamicAppend(appName, elementGetter, proxy, true, singular)];
}
export function patchAtBootstrapping(appName, elementGetter, proxy, singular) {
  return [process.env.NODE_ENV === 'development' ? patchDynamicAppend(appName, elementGetter, proxy, false, singular) : function () {
    return function () {
      return _noop;
    };
  }];
}