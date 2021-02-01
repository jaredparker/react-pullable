'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _templateObject = _taggedTemplateLiteralLoose(['\n  display: flex;\n  overflow: hidden;\n  justify-content: center;\n  pointer-events: none;\n'], ['\n  display: flex;\n  overflow: hidden;\n  justify-content: center;\n  pointer-events: none;\n']),
    _templateObject2 = _taggedTemplateLiteralLoose(['\n  transform-origin: center;\n'], ['\n  transform-origin: center;\n']),
    _templateObject3 = _taggedTemplateLiteralLoose([''], ['']),
    _templateObject4 = _taggedTemplateLiteralLoose(['\n  0% { transform: scale(1.3); }\n  100% { transform: scale(1); }\n'], ['\n  0% { transform: scale(1.3); }\n  100% { transform: scale(1); }\n']),
    _templateObject5 = _taggedTemplateLiteralLoose(['\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n'], ['\n  from { transform: rotate(0deg); }\n  to { transform: rotate(360deg); }\n']);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _styledComponents = require('styled-components');

var _styledComponents2 = _interopRequireDefault(_styledComponents);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteralLoose(strings, raw) { strings.raw = raw; return strings; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Pullable = function (_React$Component) {
  _inherits(Pullable, _React$Component);

  function Pullable(props) {
    var _this2 = this;

    _classCallCheck(this, Pullable);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this, props));

    _this.clearTouchStatus = function () {
      _this.pullStartY = null;
      _this.pullMoveY = null;
      _this.dist = 0;
      _this.distResisted = 0;
      _this.ignoreTouches = false;
    };

    _this.onTouchStart = function (e) {
      if (_this.props.disabled || _this.ignoreTouches) return;

      if (_this.state.status === 'ready' && _this.props.shouldPullToRefresh()) {
        _this.pullStartY = e.touches[0].screenY;
      } else {
        _this.pullStartY = null;
      }
    };

    _this.onTouchMove = function (e) {
      if (_this.props.disabled || _this.ignoreTouches || _this.pullStartY === null) return;

      _this.pullMoveY = e.touches[0].screenY;
      _this.dist = _this.pullMoveY - _this.pullStartY;

      if (_this.dist > 0) {
        e.preventDefault();

        _this.distResisted = Math.min(_this.dist / _this.props.resistance, _this.props.distThreshold);

        _this.setState({ status: 'pulling', height: _this.distResisted }, function () {
          if (_this.distResisted === _this.props.distThreshold) _this.refresh();
        });
      }
    };

    _this.onTouchEnd = function (e) {
      if (_this.props.disabled || _this.ignoreTouches) return;

      if (_this.state.status === 'pulling') {
        _this.ignoreTouches = true;
        _this.setState({ status: 'pullAborted', height: 0 }, function () {
          _this.reset(_this.props.resetDuration);
        });
      } else {
        _this.reset();
      }
    };

    _this.refresh = function () {
      _this.ignoreTouches = true;
      _this.setState({ status: 'pulling', height: _this.props.distThreshold });
      _this.setState({ status: 'refreshing' }, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.props.onRefresh();

              case 2:

                _this.setState({ status: 'refreshCompleted', height: 0 }, function () {
                  _this.reset(_this.props.resetDuration);
                });

              case 3:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2);
      })));
    };

    _this.reset = function () {
      var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      _this.resetTimeout = setTimeout(function () {
        _this.clearTouchStatus();
        _this.setState({ status: 'ready' });
      }, delay);
    };

    _this.clearTouchStatus();

    _this.state = {
      status: 'ready',
      height: 0
    };
    return _this;
  }

  Pullable.prototype.componentDidMount = function componentDidMount() {
    window.addEventListener('touchstart', this.onTouchStart);
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);

    if (this.props.refreshOnMount) {
      this.refresh();
    }
  };

  Pullable.prototype.componentWillUnmount = function componentWillUnmount() {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove, { passive: false });
    window.removeEventListener('touchend', this.onTouchEnd);

    clearTimeout(this.refreshCompletedTimeout);
    clearTimeout(this.resetTimeout);
  };

  Pullable.prototype.render = function render() {
    var status = this.state.status;
    var shouldSpin = status === 'refreshing' || status === 'refreshCompleted';
    var shouldReset = status === 'pullAborted' || status === 'refreshCompleted';
    var pctPulled = this.state.height / this.props.distThreshold;

    return _react2.default.createElement(
      _react2.default.Fragment,
      null,
      _react2.default.createElement(
        Container,
        {
          className: this.props.className,
          height: this.state.height,
          centerSpinner: this.props.centerSpinner,
          resetDuration: this.props.resetDuration,
          resetEase: this.props.resetEase,
          shouldReset: shouldReset
        },
        _react2.default.createElement(
          Spinner,
          {
            pctPulled: pctPulled,
            fadeSpinner: this.props.fadeSpinner,
            rotateSpinner: this.props.rotateSpinner,
            spinnerSize: this.props.spinnerSize,
            spinnerOffset: this.props.spinnerOffset,
            resetDuration: this.props.resetDuration,
            resetEase: this.props.resetEase,
            shouldReset: shouldReset,
            shouldSpin: shouldSpin
          },
          _react2.default.createElement(
            SpinnerSVG,
            {
              spinnerSize: this.props.spinnerSize,
              spinnerColor: this.props.spinnerColor,
              popDuration: this.props.popDuration,
              spinSpeed: this.props.spinSpeed,
              shouldSpin: shouldSpin
            },
            _react2.default.createElement('line', { x1: '12', y1: '2', x2: '12', y2: '6' }),
            _react2.default.createElement('line', { x1: '12', y1: '18', x2: '12', y2: '22' }),
            _react2.default.createElement('line', { x1: '4.93', y1: '4.93', x2: '7.76', y2: '7.76' }),
            _react2.default.createElement('line', { x1: '16.24', y1: '16.24', x2: '19.07', y2: '19.07' }),
            _react2.default.createElement('line', { x1: '2', y1: '12', x2: '6', y2: '12' }),
            _react2.default.createElement('line', { x1: '18', y1: '12', x2: '22', y2: '12' }),
            _react2.default.createElement('line', { x1: '4.93', y1: '19.07', x2: '7.76', y2: '16.24' }),
            _react2.default.createElement('line', { x1: '16.24', y1: '7.76', x2: '19.07', y2: '4.93' })
          )
        )
      ),
      this.props.children
    );
  };

  return Pullable;
}(_react2.default.Component);

Pullable.defaultProps = {
  className: 'pullable',
  refreshOnMount: false,
  centerSpinner: true,
  fadeSpinner: true,
  rotateSpinner: true,
  spinnerSize: 24,
  spinnerOffset: 0,
  spinnerColor: '#000000',
  spinSpeed: 1200,
  popDuration: 200,
  distThreshold: 72,
  resistance: 2.5,
  resetDuration: 400,
  resetEase: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  shouldPullToRefresh: function shouldPullToRefresh() {
    return window.scrollY <= 0;
  },
  disabled: false
};

Pullable.propTypes = process.env.NODE_ENV !== "production" ? {
  onRefresh: _propTypes2.default.func.isRequired,
  refreshOnMount: _propTypes2.default.bool,
  className: _propTypes2.default.string,
  centerSpinner: _propTypes2.default.bool,
  fadeSpinner: _propTypes2.default.bool,
  rotateSpinner: _propTypes2.default.bool,
  spinnerSize: _propTypes2.default.number,
  spinnerOffset: _propTypes2.default.number,
  spinnerColor: _propTypes2.default.string,
  spinSpeed: _propTypes2.default.number,
  popDuration: _propTypes2.default.number,
  distThreshold: _propTypes2.default.number,
  resistance: _propTypes2.default.number,
  resetDuration: _propTypes2.default.number,
  resetEase: _propTypes2.default.string,
  shouldPullToRefresh: _propTypes2.default.func,
  disabled: _propTypes2.default.bool
} : {};

// Styled Components

var Container = _styledComponents2.default.div.attrs({
  style: function style(props) {
    return {
      height: props.height,
      alignItems: props.centerSpinner ? 'center' : 'flex-start',
      transition: props.shouldReset ? 'height ' + props.resetDuration + 'ms ' + props.resetEase : 'none'
    };
  }
})(_templateObject);

var Spinner = _styledComponents2.default.div.attrs({
  style: function style(props) {
    return {
      opacity: props.fadeSpinner ? props.pctPulled : 1,
      transform: props.shouldReset ? 'translateY(' + (props.pctPulled * (props.spinnerSize + props.spinnerOffset) - props.spinnerSize) + 'px) rotate(' + (props.rotateSpinner && props.shouldSpin ? 90 : 0) + 'deg)' : 'translateY(' + (props.pctPulled * (props.spinnerSize + props.spinnerOffset) - props.spinnerSize) + 'px) rotate(' + (props.rotateSpinner ? props.pctPulled * 90 : 0) + 'deg)',
      transition: props.shouldReset ? 'opacity ' + props.resetDuration + 'ms ' + props.resetEase + ', transform ' + props.resetDuration + 'ms ' + props.resetEase : 'none'
    };
  }
})(_templateObject2);

var SpinnerSVG = _styledComponents2.default.svg.attrs({
  viewBox: '0 0 24 24',
  fill: 'none',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: function style(props) {
    return {
      width: props.spinnerSize,
      height: props.spinnerSize,
      stroke: props.spinnerColor,
      animation: props.shouldSpin ? scale + ' ' + props.popDuration + 'ms cubic-bezier(0.55, 0.055, 0.675, 0.19), ' + rotate360 + ' ' + props.spinSpeed + 'ms linear ' + props.popDuration + 'ms infinite' : 'none'
    };
  }
})(_templateObject3);

var scale = (0, _styledComponents.keyframes)(_templateObject4);

var rotate360 = (0, _styledComponents.keyframes)(_templateObject5);

exports.default = Pullable;
module.exports = exports['default'];