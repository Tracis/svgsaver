(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define('SvgSaver', ['exports', 'module', 'html5-filesaver.js'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module, require('html5-filesaver.js'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod, global.saveAs);
    global.SvgSaver = mod.exports;
  }
})(this, function (exports, module, _html5FilesaverJs) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _saveAs = _interopRequireDefault(_html5FilesaverJs);

  var svgStyles = {
    'alignment-baseline': 'auto',
    'baseline-shift': 'baseline',
    'clip': 'auto',
    'clip-path': 'none',
    'clip-rule': 'nonzero',
    'color': 'rgb(51, 51, 51)',
    'color-interpolation': 'srgb',
    'color-interpolation-filters': 'linearrgb',
    'color-profile': 'auto',
    'color-rendering': 'auto',
    'cursor': 'auto',
    'direction': 'ltr',
    'display': 'inline',
    'dominant-baseline': 'auto',
    'enable-background': '',
    'fill': 'rgb(0, 0, 0)',
    'fill-opacity': '1',
    'fill-rule': 'nonzero',
    'filter': 'none',
    'flood-color': 'rgb(0, 0, 0)',
    'flood-opacity': '1',
    'font': '',
    'font-family': 'normal',
    'font-size': 'medium',
    'font-size-adjust': 'auto',
    'font-stretch': 'normal',
    'font-style': 'normal',
    'font-variant': 'normal',
    'font-weight': '400',
    'glyph-orientation-horizontal': '0deg',
    'glyph-orientation-vertical': 'auto',
    'image-rendering': 'auto',
    'kerning': 'auto',
    'letter-spacing': '0',
    'lighting-color': 'rgb(255, 255, 255)',
    'marker': '',
    'marker-end': 'none',
    'marker-mid': 'none',
    'marker-start': 'none',
    'mask': 'none',
    'opacity': '1',
    'overflow': 'visible',
    'paint-order': 'normal',
    'pointer-events': 'auto',
    'shape-rendering': 'auto',
    'stop-color': 'rgb(0, 0, 0)',
    'stop-opacity': '1',
    'stroke': 'none',
    'stroke-dasharray': 'none',
    'stroke-dashoffset': '0',
    'stroke-linecap': 'butt',
    'stroke-linejoin': 'miter',
    'stroke-miterlimit': '4',
    'stroke-opacity': '1',
    'stroke-width': '1',
    'text-anchor': 'start',
    'text-decoration': 'none',
    'text-rendering': 'auto',
    'unicode-bidi': 'normal',
    'visibility': 'visible',
    'word-spacing': '0px',
    'writing-mode': 'lr-tb'
  };

  var svgAttrs = ['id', 'xml:base', 'xml:lang', 'xml:space', 'height', 'result', 'width', 'x', 'y', 'xlink:href', 'style', 'class', 'd', 'pathLength', 'x', 'y', 'dx', 'dy', 'glyphRef', 'format', 'x1', 'y1', 'x2', 'y2', 'rotate', 'textLength', 'cx', 'cy', 'r', 'rx', 'ry', 'fx', 'fy', 'width', 'height', 'refX', 'refY', 'orient', 'markerUnits', 'markerWidth', 'markerHeight', 'maskUnits', 'transform', 'viewBox', 'version', 'preserveAspectRatio', 'xmlns', 'points', 'offset'];

  function isUndefined(value) {
    return typeof value === 'undefined';
  }
  function isDefined(value) {
    return typeof value !== 'undefined';
  }
  var forEach = Array.prototype.forEach;

  function getStyles(node, name) {
    var val;

    if (isDefined(node.currentStyle)) {
      val = node.currentStyle[name];
    } else if (isDefined(window.getComputedStyle)) {
      val = node.ownerDocument.defaultView.getComputedStyle(node, null)[name];
    } else {
      val = node.style[name];
    }
    return val === '' ? undefined : val;
  }

  function copyStyles(source, target) {
    for (var key in svgStyles) {
      var _default = svgStyles[key];
      var src = getStyles(source, key);

      var par = getStyles(target.parentNode, key);
      if (src && src !== _default && src !== par) {
        target.style[key] = src;
      }
    }
  }

  function cleanAttrs(el) {
    forEach.call(el.attributes, function (attr) {
      if (attr.specified && isUndefined(svgStyles[attr.name]) && svgAttrs.indexOf(attr.name) < 0) {
        el.removeAttribute(attr.name);
      }
    });
  }

  function cloneSvg(src) {
    var clonedSvg = src.cloneNode(true);
    var srcChildren = src.querySelectorAll('*');

    forEach.call(clonedSvg.querySelectorAll('*'), function (target, index) {
      copyStyles(srcChildren[index], target);
      cleanAttrs(target);
    });

    return clonedSvg;
  }

  var DownloadAttributeSupport = ('download' in document.createElement('a'));

  function saveUri(url, name) {
    if (DownloadAttributeSupport) {
      var dl = document.createElement('a');
      dl.setAttribute('href', url);
      dl.setAttribute('download', name);
      dl.click();
    } else {
      window.open(url, '_blank', '');
    }
  }

  var SvgSaver = (function () {
    function SvgSaver(opts) {
      _classCallCheck(this, SvgSaver);
    }

    _createClass(SvgSaver, [{
      key: 'getHTML',
      value: function getHTML(el) {
        var svg = cloneSvg(el);

        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('version', 1.1);

        svg.setAttribute('width', svg.getAttribute('width') || '500');
        svg.setAttribute('height', svg.getAttribute('height') || '900');

        return svg.outerHTML || new window.XMLSerializer().serializeToString(svg);
      }
    }, {
      key: 'getBlob',
      value: function getBlob(el) {
        var html = this.getHTML(el);
        return new Blob([html], { type: 'text/xml' });
      }
    }, {
      key: 'getUri',
      value: function getUri(el) {
        var html = this.getHTML(el);
        return 'data:image/svg+xml;base64,' + window.btoa(html);
      }
    }, {
      key: 'asSvg',
      value: function asSvg(el, filename) {
        if (!filename || filename === '') {
          filename = el.getAttribute('title');
          filename = (filename || 'untitled') + '.svg';
        }

        if (isDefined(window.saveAs)) {
          return (0, _saveAs['default'])(this.getBlob(el), filename);
        } else {
          return saveUri(this.getUri(el), filename);
        }
      }
    }, {
      key: 'asPng',
      value: function asPng(el, filename) {
        if (!filename || filename === '') {
          filename = el.getAttribute('title');
          filename = (filename || 'untitled') + '.png';
        }

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        var image = new Image();
        image.onload = function () {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);

          if (isDefined(window.saveAs) && isDefined(canvas.toBlob)) {
            canvas.toBlob(function (blob) {
              (0, _saveAs['default'])(blob, filename);
            });
          } else {
            var uri = canvas.toDataURL('image/png');
            saveUri(uri, filename);
          }
        };
        image.src = this.getUri(el);
      }
    }]);

    return SvgSaver;
  })();

  module.exports = SvgSaver;
});