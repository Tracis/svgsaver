'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _html5FilesaverJs = require('html5-filesaver.js');

var _html5FilesaverJs2 = _interopRequireDefault(_html5FilesaverJs);

var _collection = require('./collection');

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
  for (var key in _collection.svgStyles) {
    var _default = _collection.svgStyles[key];
    var src = getStyles(source, key);

    var par = getStyles(target.parentNode, key);
    if (src && src !== _default && src !== par) {
      target.style[key] = src;
    }
  }
}

function cleanAttrs(el) {
  forEach.call(el.attributes, function (attr) {
    if (attr.specified && isUndefined(_collection.svgStyles[attr.name]) && _collection.svgAttrs.indexOf(attr.name) < 0) {
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
        return (0, _html5FilesaverJs2['default'])(this.getBlob(el), filename);
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
            (0, _html5FilesaverJs2['default'])(blob, filename);
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

exports.SvgSaver = SvgSaver;
exports['default'] = SvgSaver;
//# sourceMappingURL=svgsaver.js.map