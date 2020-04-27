import _noop from "lodash/noop";

/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { __awaiter, __generator, __read, __spread } from "tslib";
import { sleep } from '../../utils';
var rawWindowInterval = window.setInterval;
var rawWindowClearInterval = window.clearInterval;
var rawWindowTimeout = window.setTimeout;
var rawWindowClearTimout = window.clearTimeout;
export default function patch() {
  var timers = [];
  var intervals = []; // @ts-ignore

  window.clearInterval = function (intervalId) {
    intervals = intervals.filter(function (id) {
      return id !== intervalId;
    });
    return rawWindowClearInterval(intervalId);
  }; // @ts-ignore


  window.setInterval = function (handler, timeout) {
    var args = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }

    var intervalId = rawWindowInterval.apply(void 0, __spread([handler, timeout], args));
    intervals = __spread(intervals, [intervalId]);
    return intervalId;
  }; // @ts-ignore


  window.clearTimeout = function (timerId) {
    timers = timers.filter(function (id) {
      return id !== timerId;
    });
    return rawWindowClearTimout(timerId);
  }; // @ts-ignore


  window.setTimeout = function (handler, timeout) {
    var args = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }

    var timerId = rawWindowTimeout.apply(void 0, __spread([function () {
      handler.apply(void 0, __spread(args)); // auto clear timeout to make timers length rigth

      window.clearTimeout(timerId);
    }, timeout], args));
    timers = __spread(timers, [timerId]);
    return timerId;
  };

  return function free() {
    var _this = this;

    timers.forEach(function (id) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              // FIXME 延迟 timeout 的清理，因为可能会有动画还没完成
              return [4
              /*yield*/
              , sleep(500)];

            case 1:
              // FIXME 延迟 timeout 的清理，因为可能会有动画还没完成
              _a.sent();

              window.clearTimeout(id);
              return [2
              /*return*/
              ];
          }
        });
      });
    });
    intervals.forEach(function (id) {
      return window.clearInterval(id);
    });
    window.setInterval = rawWindowInterval;
    window.clearInterval = rawWindowClearInterval;
    window.setTimeout = rawWindowTimeout;
    window.clearTimeout = rawWindowClearTimout;
    return _noop;
  };
}