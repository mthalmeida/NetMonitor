import Mt, { ipcMain as vt, app as sr, BrowserWindow as kl, Notification as xa, nativeImage as Ml, Tray as pd, dialog as La, Menu as md } from "electron";
import { fileURLToPath as gd } from "node:url";
import ht from "node:path";
import { spawn as $o } from "node:child_process";
import Bl from "node:https";
import Hl from "node:http";
import Ed from "node:crypto";
import _t from "fs";
import yd from "constants";
import Kr from "stream";
import Fo from "util";
import jl from "assert";
import oe from "path";
import ei from "child_process";
import ql from "events";
import Jr from "crypto";
import Gl from "tty";
import ti from "os";
import Tt from "url";
import Wl from "zlib";
import wd from "http";
var be = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, qe = {}, Ht = {}, Ie = {};
Ie.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((r, n) => {
        t.push((i, o) => i != null ? n(i) : r(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ie.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const r = t[t.length - 1];
    if (typeof r != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((n) => r(null, n), r);
  }, "name", { value: e.name });
};
var lt = yd, vd = process.cwd, Un = null, _d = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Un || (Un = vd.call(process)), Un;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Ua = process.chdir;
  process.chdir = function(e) {
    Un = null, Ua.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Ua);
}
var Td = Ad;
function Ad(e) {
  lt.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = n(e.chmod), e.fchmod = n(e.fchmod), e.lchmod = n(e.lchmod), e.chownSync = a(e.chownSync), e.fchownSync = a(e.fchownSync), e.lchownSync = a(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = s(e.stat), e.fstat = s(e.fstat), e.lstat = s(e.lstat), e.statSync = l(e.statSync), e.fstatSync = l(e.fstatSync), e.lstatSync = l(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(c, f, d) {
    d && process.nextTick(d);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(c, f, d, m) {
    m && process.nextTick(m);
  }, e.lchownSync = function() {
  }), _d === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(c) {
    function f(d, m, w) {
      var E = Date.now(), T = 0;
      c(d, m, function A(S) {
        if (S && (S.code === "EACCES" || S.code === "EPERM" || S.code === "EBUSY") && Date.now() - E < 6e4) {
          setTimeout(function() {
            e.stat(m, function(F, x) {
              F && F.code === "ENOENT" ? c(d, m, A) : w(S);
            });
          }, T), T < 100 && (T += 10);
          return;
        }
        w && w(S);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(c) {
    function f(d, m, w, E, T, A) {
      var S;
      if (A && typeof A == "function") {
        var F = 0;
        S = function(x, J, re) {
          if (x && x.code === "EAGAIN" && F < 10)
            return F++, c.call(e, d, m, w, E, T, S);
          A.apply(this, arguments);
        };
      }
      return c.call(e, d, m, w, E, T, S);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, c), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(c) {
    return function(f, d, m, w, E) {
      for (var T = 0; ; )
        try {
          return c.call(e, f, d, m, w, E);
        } catch (A) {
          if (A.code === "EAGAIN" && T < 10) {
            T++;
            continue;
          }
          throw A;
        }
    };
  }(e.readSync);
  function t(c) {
    c.lchmod = function(f, d, m) {
      c.open(
        f,
        lt.O_WRONLY | lt.O_SYMLINK,
        d,
        function(w, E) {
          if (w) {
            m && m(w);
            return;
          }
          c.fchmod(E, d, function(T) {
            c.close(E, function(A) {
              m && m(T || A);
            });
          });
        }
      );
    }, c.lchmodSync = function(f, d) {
      var m = c.openSync(f, lt.O_WRONLY | lt.O_SYMLINK, d), w = !0, E;
      try {
        E = c.fchmodSync(m, d), w = !1;
      } finally {
        if (w)
          try {
            c.closeSync(m);
          } catch {
          }
        else
          c.closeSync(m);
      }
      return E;
    };
  }
  function r(c) {
    lt.hasOwnProperty("O_SYMLINK") && c.futimes ? (c.lutimes = function(f, d, m, w) {
      c.open(f, lt.O_SYMLINK, function(E, T) {
        if (E) {
          w && w(E);
          return;
        }
        c.futimes(T, d, m, function(A) {
          c.close(T, function(S) {
            w && w(A || S);
          });
        });
      });
    }, c.lutimesSync = function(f, d, m) {
      var w = c.openSync(f, lt.O_SYMLINK), E, T = !0;
      try {
        E = c.futimesSync(w, d, m), T = !1;
      } finally {
        if (T)
          try {
            c.closeSync(w);
          } catch {
          }
        else
          c.closeSync(w);
      }
      return E;
    }) : c.futimes && (c.lutimes = function(f, d, m, w) {
      w && process.nextTick(w);
    }, c.lutimesSync = function() {
    });
  }
  function n(c) {
    return c && function(f, d, m) {
      return c.call(e, f, d, function(w) {
        h(w) && (w = null), m && m.apply(this, arguments);
      });
    };
  }
  function i(c) {
    return c && function(f, d) {
      try {
        return c.call(e, f, d);
      } catch (m) {
        if (!h(m)) throw m;
      }
    };
  }
  function o(c) {
    return c && function(f, d, m, w) {
      return c.call(e, f, d, m, function(E) {
        h(E) && (E = null), w && w.apply(this, arguments);
      });
    };
  }
  function a(c) {
    return c && function(f, d, m) {
      try {
        return c.call(e, f, d, m);
      } catch (w) {
        if (!h(w)) throw w;
      }
    };
  }
  function s(c) {
    return c && function(f, d, m) {
      typeof d == "function" && (m = d, d = null);
      function w(E, T) {
        T && (T.uid < 0 && (T.uid += 4294967296), T.gid < 0 && (T.gid += 4294967296)), m && m.apply(this, arguments);
      }
      return d ? c.call(e, f, d, w) : c.call(e, f, w);
    };
  }
  function l(c) {
    return c && function(f, d) {
      var m = d ? c.call(e, f, d) : c.call(e, f);
      return m && (m.uid < 0 && (m.uid += 4294967296), m.gid < 0 && (m.gid += 4294967296)), m;
    };
  }
  function h(c) {
    if (!c || c.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (c.code === "EINVAL" || c.code === "EPERM"));
  }
}
var ka = Kr.Stream, Sd = Cd;
function Cd(e) {
  return {
    ReadStream: t,
    WriteStream: r
  };
  function t(n, i) {
    if (!(this instanceof t)) return new t(n, i);
    ka.call(this);
    var o = this;
    this.path = n, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var a = Object.keys(i), s = 0, l = a.length; s < l; s++) {
      var h = a[s];
      this[h] = i[h];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(c, f) {
      if (c) {
        o.emit("error", c), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function r(n, i) {
    if (!(this instanceof r)) return new r(n, i);
    ka.call(this), this.path = n, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), a = 0, s = o.length; a < s; a++) {
      var l = o[a];
      this[l] = i[l];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var bd = Rd, Od = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function Rd(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: Od(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(r) {
    Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(e, r));
  }), t;
}
var ie = _t, Id = Td, Nd = Sd, Pd = bd, vn = Fo, ye, Hn;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ye = Symbol.for("graceful-fs.queue"), Hn = Symbol.for("graceful-fs.previous")) : (ye = "___graceful-fs.queue", Hn = "___graceful-fs.previous");
function Dd() {
}
function Vl(e, t) {
  Object.defineProperty(e, ye, {
    get: function() {
      return t;
    }
  });
}
var Lt = Dd;
vn.debuglog ? Lt = vn.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Lt = function() {
  var e = vn.format.apply(vn, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!ie[ye]) {
  var $d = be[ye] || [];
  Vl(ie, $d), ie.close = function(e) {
    function t(r, n) {
      return e.call(ie, r, function(i) {
        i || Ma(), typeof n == "function" && n.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Hn, {
      value: e
    }), t;
  }(ie.close), ie.closeSync = function(e) {
    function t(r) {
      e.apply(ie, arguments), Ma();
    }
    return Object.defineProperty(t, Hn, {
      value: e
    }), t;
  }(ie.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Lt(ie[ye]), jl.equal(ie[ye].length, 0);
  });
}
be[ye] || Vl(be, ie[ye]);
var Ne = xo(Pd(ie));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !ie.__patched && (Ne = xo(ie), ie.__patched = !0);
function xo(e) {
  Id(e), e.gracefulify = xo, e.createReadStream = J, e.createWriteStream = re;
  var t = e.readFile;
  e.readFile = r;
  function r(y, j, G) {
    return typeof j == "function" && (G = j, j = null), H(y, j, G);
    function H(Q, O, b, P) {
      return t(Q, O, function(C) {
        C && (C.code === "EMFILE" || C.code === "ENFILE") ? Vt([H, [Q, O, b], C, P || Date.now(), Date.now()]) : typeof b == "function" && b.apply(this, arguments);
      });
    }
  }
  var n = e.writeFile;
  e.writeFile = i;
  function i(y, j, G, H) {
    return typeof G == "function" && (H = G, G = null), Q(y, j, G, H);
    function Q(O, b, P, C, $) {
      return n(O, b, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Vt([Q, [O, b, P, C], D, $ || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = a);
  function a(y, j, G, H) {
    return typeof G == "function" && (H = G, G = null), Q(y, j, G, H);
    function Q(O, b, P, C, $) {
      return o(O, b, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Vt([Q, [O, b, P, C], D, $ || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var s = e.copyFile;
  s && (e.copyFile = l);
  function l(y, j, G, H) {
    return typeof G == "function" && (H = G, G = 0), Q(y, j, G, H);
    function Q(O, b, P, C, $) {
      return s(O, b, P, function(D) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Vt([Q, [O, b, P, C], D, $ || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  var h = e.readdir;
  e.readdir = f;
  var c = /^v[0-5]\./;
  function f(y, j, G) {
    typeof j == "function" && (G = j, j = null);
    var H = c.test(process.version) ? function(b, P, C, $) {
      return h(b, Q(
        b,
        P,
        C,
        $
      ));
    } : function(b, P, C, $) {
      return h(b, P, Q(
        b,
        P,
        C,
        $
      ));
    };
    return H(y, j, G);
    function Q(O, b, P, C) {
      return function($, D) {
        $ && ($.code === "EMFILE" || $.code === "ENFILE") ? Vt([
          H,
          [O, b, P],
          $,
          C || Date.now(),
          Date.now()
        ]) : (D && D.sort && D.sort(), typeof P == "function" && P.call(this, $, D));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var d = Nd(e);
    A = d.ReadStream, F = d.WriteStream;
  }
  var m = e.ReadStream;
  m && (A.prototype = Object.create(m.prototype), A.prototype.open = S);
  var w = e.WriteStream;
  w && (F.prototype = Object.create(w.prototype), F.prototype.open = x), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return A;
    },
    set: function(y) {
      A = y;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return F;
    },
    set: function(y) {
      F = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var E = A;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return E;
    },
    set: function(y) {
      E = y;
    },
    enumerable: !0,
    configurable: !0
  });
  var T = F;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return T;
    },
    set: function(y) {
      T = y;
    },
    enumerable: !0,
    configurable: !0
  });
  function A(y, j) {
    return this instanceof A ? (m.apply(this, arguments), this) : A.apply(Object.create(A.prototype), arguments);
  }
  function S() {
    var y = this;
    me(y.path, y.flags, y.mode, function(j, G) {
      j ? (y.autoClose && y.destroy(), y.emit("error", j)) : (y.fd = G, y.emit("open", G), y.read());
    });
  }
  function F(y, j) {
    return this instanceof F ? (w.apply(this, arguments), this) : F.apply(Object.create(F.prototype), arguments);
  }
  function x() {
    var y = this;
    me(y.path, y.flags, y.mode, function(j, G) {
      j ? (y.destroy(), y.emit("error", j)) : (y.fd = G, y.emit("open", G));
    });
  }
  function J(y, j) {
    return new e.ReadStream(y, j);
  }
  function re(y, j) {
    return new e.WriteStream(y, j);
  }
  var V = e.open;
  e.open = me;
  function me(y, j, G, H) {
    return typeof G == "function" && (H = G, G = null), Q(y, j, G, H);
    function Q(O, b, P, C, $) {
      return V(O, b, P, function(D, k) {
        D && (D.code === "EMFILE" || D.code === "ENFILE") ? Vt([Q, [O, b, P, C], D, $ || Date.now(), Date.now()]) : typeof C == "function" && C.apply(this, arguments);
      });
    }
  }
  return e;
}
function Vt(e) {
  Lt("ENQUEUE", e[0].name, e[1]), ie[ye].push(e), Lo();
}
var _n;
function Ma() {
  for (var e = Date.now(), t = 0; t < ie[ye].length; ++t)
    ie[ye][t].length > 2 && (ie[ye][t][3] = e, ie[ye][t][4] = e);
  Lo();
}
function Lo() {
  if (clearTimeout(_n), _n = void 0, ie[ye].length !== 0) {
    var e = ie[ye].shift(), t = e[0], r = e[1], n = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Lt("RETRY", t.name, r), t.apply(null, r);
    else if (Date.now() - i >= 6e4) {
      Lt("TIMEOUT", t.name, r);
      var a = r.pop();
      typeof a == "function" && a.call(null, n);
    } else {
      var s = Date.now() - o, l = Math.max(o - i, 1), h = Math.min(l * 1.2, 100);
      s >= h ? (Lt("RETRY", t.name, r), t.apply(null, r.concat([i]))) : ie[ye].push(e);
    }
    _n === void 0 && (_n = setTimeout(Lo, 0));
  }
}
(function(e) {
  const t = Ie.fromCallback, r = Ne, n = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof r[i] == "function");
  Object.assign(e, r), n.forEach((i) => {
    e[i] = t(r[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? r.exists(i, o) : new Promise((a) => r.exists(i, a));
  }, e.read = function(i, o, a, s, l, h) {
    return typeof h == "function" ? r.read(i, o, a, s, l, h) : new Promise((c, f) => {
      r.read(i, o, a, s, l, (d, m, w) => {
        if (d) return f(d);
        c({ bytesRead: m, buffer: w });
      });
    });
  }, e.write = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.write(i, o, ...a) : new Promise((s, l) => {
      r.write(i, o, ...a, (h, c, f) => {
        if (h) return l(h);
        s({ bytesWritten: c, buffer: f });
      });
    });
  }, typeof r.writev == "function" && (e.writev = function(i, o, ...a) {
    return typeof a[a.length - 1] == "function" ? r.writev(i, o, ...a) : new Promise((s, l) => {
      r.writev(i, o, ...a, (h, c, f) => {
        if (h) return l(h);
        s({ bytesWritten: c, buffers: f });
      });
    });
  }), typeof r.realpath.native == "function" ? e.realpath.native = t(r.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Ht);
var Uo = {}, zl = {};
const Fd = oe;
zl.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(Fd.parse(t).root, ""))) {
    const n = new Error(`Path contains invalid characters: ${t}`);
    throw n.code = "EINVAL", n;
  }
};
const Yl = Ht, { checkPath: Xl } = zl, Kl = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Uo.makeDir = async (e, t) => (Xl(e), Yl.mkdir(e, {
  mode: Kl(t),
  recursive: !0
}));
Uo.makeDirSync = (e, t) => (Xl(e), Yl.mkdirSync(e, {
  mode: Kl(t),
  recursive: !0
}));
const xd = Ie.fromPromise, { makeDir: Ld, makeDirSync: Di } = Uo, $i = xd(Ld);
var Ze = {
  mkdirs: $i,
  mkdirsSync: Di,
  // alias
  mkdirp: $i,
  mkdirpSync: Di,
  ensureDir: $i,
  ensureDirSync: Di
};
const Ud = Ie.fromPromise, Jl = Ht;
function kd(e) {
  return Jl.access(e).then(() => !0).catch(() => !1);
}
var jt = {
  pathExists: Ud(kd),
  pathExistsSync: Jl.existsSync
};
const ir = Ne;
function Md(e, t, r, n) {
  ir.open(e, "r+", (i, o) => {
    if (i) return n(i);
    ir.futimes(o, t, r, (a) => {
      ir.close(o, (s) => {
        n && n(a || s);
      });
    });
  });
}
function Bd(e, t, r) {
  const n = ir.openSync(e, "r+");
  return ir.futimesSync(n, t, r), ir.closeSync(n);
}
var Ql = {
  utimesMillis: Md,
  utimesMillisSync: Bd
};
const lr = Ht, pe = oe, Hd = Fo;
function jd(e, t, r) {
  const n = r.dereference ? (i) => lr.stat(i, { bigint: !0 }) : (i) => lr.lstat(i, { bigint: !0 });
  return Promise.all([
    n(e),
    n(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function qd(e, t, r) {
  let n;
  const i = r.dereference ? (a) => lr.statSync(a, { bigint: !0 }) : (a) => lr.lstatSync(a, { bigint: !0 }), o = i(e);
  try {
    n = i(t);
  } catch (a) {
    if (a.code === "ENOENT") return { srcStat: o, destStat: null };
    throw a;
  }
  return { srcStat: o, destStat: n };
}
function Gd(e, t, r, n, i) {
  Hd.callbackify(jd)(e, t, n, (o, a) => {
    if (o) return i(o);
    const { srcStat: s, destStat: l } = a;
    if (l) {
      if (Qr(s, l)) {
        const h = pe.basename(e), c = pe.basename(t);
        return r === "move" && h !== c && h.toLowerCase() === c.toLowerCase() ? i(null, { srcStat: s, destStat: l, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (s.isDirectory() && !l.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!s.isDirectory() && l.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return s.isDirectory() && ko(e, t) ? i(new Error(ri(e, t, r))) : i(null, { srcStat: s, destStat: l });
  });
}
function Wd(e, t, r, n) {
  const { srcStat: i, destStat: o } = qd(e, t, n);
  if (o) {
    if (Qr(i, o)) {
      const a = pe.basename(e), s = pe.basename(t);
      if (r === "move" && a !== s && a.toLowerCase() === s.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ko(e, t))
    throw new Error(ri(e, t, r));
  return { srcStat: i, destStat: o };
}
function Zl(e, t, r, n, i) {
  const o = pe.resolve(pe.dirname(e)), a = pe.resolve(pe.dirname(r));
  if (a === o || a === pe.parse(a).root) return i();
  lr.stat(a, { bigint: !0 }, (s, l) => s ? s.code === "ENOENT" ? i() : i(s) : Qr(t, l) ? i(new Error(ri(e, r, n))) : Zl(e, t, a, n, i));
}
function ec(e, t, r, n) {
  const i = pe.resolve(pe.dirname(e)), o = pe.resolve(pe.dirname(r));
  if (o === i || o === pe.parse(o).root) return;
  let a;
  try {
    a = lr.statSync(o, { bigint: !0 });
  } catch (s) {
    if (s.code === "ENOENT") return;
    throw s;
  }
  if (Qr(t, a))
    throw new Error(ri(e, r, n));
  return ec(e, t, o, n);
}
function Qr(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ko(e, t) {
  const r = pe.resolve(e).split(pe.sep).filter((i) => i), n = pe.resolve(t).split(pe.sep).filter((i) => i);
  return r.reduce((i, o, a) => i && n[a] === o, !0);
}
function ri(e, t, r) {
  return `Cannot ${r} '${e}' to a subdirectory of itself, '${t}'.`;
}
var hr = {
  checkPaths: Gd,
  checkPathsSync: Wd,
  checkParentPaths: Zl,
  checkParentPathsSync: ec,
  isSrcSubdir: ko,
  areIdentical: Qr
};
const Fe = Ne, Fr = oe, Vd = Ze.mkdirs, zd = jt.pathExists, Yd = Ql.utimesMillis, xr = hr;
function Xd(e, t, r, n) {
  typeof r == "function" && !n ? (n = r, r = {}) : typeof r == "function" && (r = { filter: r }), n = n || function() {
  }, r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), xr.checkPaths(e, t, "copy", r, (i, o) => {
    if (i) return n(i);
    const { srcStat: a, destStat: s } = o;
    xr.checkParentPaths(e, a, t, "copy", (l) => l ? n(l) : r.filter ? tc(Ba, s, e, t, r, n) : Ba(s, e, t, r, n));
  });
}
function Ba(e, t, r, n, i) {
  const o = Fr.dirname(r);
  zd(o, (a, s) => {
    if (a) return i(a);
    if (s) return jn(e, t, r, n, i);
    Vd(o, (l) => l ? i(l) : jn(e, t, r, n, i));
  });
}
function tc(e, t, r, n, i, o) {
  Promise.resolve(i.filter(r, n)).then((a) => a ? e(t, r, n, i, o) : o(), (a) => o(a));
}
function Kd(e, t, r, n, i) {
  return n.filter ? tc(jn, e, t, r, n, i) : jn(e, t, r, n, i);
}
function jn(e, t, r, n, i) {
  (n.dereference ? Fe.stat : Fe.lstat)(t, (a, s) => a ? i(a) : s.isDirectory() ? nh(s, e, t, r, n, i) : s.isFile() || s.isCharacterDevice() || s.isBlockDevice() ? Jd(s, e, t, r, n, i) : s.isSymbolicLink() ? ah(e, t, r, n, i) : s.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : s.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function Jd(e, t, r, n, i, o) {
  return t ? Qd(e, r, n, i, o) : rc(e, r, n, i, o);
}
function Qd(e, t, r, n, i) {
  if (n.overwrite)
    Fe.unlink(r, (o) => o ? i(o) : rc(e, t, r, n, i));
  else return n.errorOnExist ? i(new Error(`'${r}' already exists`)) : i();
}
function rc(e, t, r, n, i) {
  Fe.copyFile(t, r, (o) => o ? i(o) : n.preserveTimestamps ? Zd(e.mode, t, r, i) : ni(r, e.mode, i));
}
function Zd(e, t, r, n) {
  return eh(e) ? th(r, e, (i) => i ? n(i) : Ha(e, t, r, n)) : Ha(e, t, r, n);
}
function eh(e) {
  return (e & 128) === 0;
}
function th(e, t, r) {
  return ni(e, t | 128, r);
}
function Ha(e, t, r, n) {
  rh(t, r, (i) => i ? n(i) : ni(r, e, n));
}
function ni(e, t, r) {
  return Fe.chmod(e, t, r);
}
function rh(e, t, r) {
  Fe.stat(e, (n, i) => n ? r(n) : Yd(t, i.atime, i.mtime, r));
}
function nh(e, t, r, n, i, o) {
  return t ? nc(r, n, i, o) : ih(e.mode, r, n, i, o);
}
function ih(e, t, r, n, i) {
  Fe.mkdir(r, (o) => {
    if (o) return i(o);
    nc(t, r, n, (a) => a ? i(a) : ni(r, e, i));
  });
}
function nc(e, t, r, n) {
  Fe.readdir(e, (i, o) => i ? n(i) : ic(o, e, t, r, n));
}
function ic(e, t, r, n, i) {
  const o = e.pop();
  return o ? oh(e, o, t, r, n, i) : i();
}
function oh(e, t, r, n, i, o) {
  const a = Fr.join(r, t), s = Fr.join(n, t);
  xr.checkPaths(a, s, "copy", i, (l, h) => {
    if (l) return o(l);
    const { destStat: c } = h;
    Kd(c, a, s, i, (f) => f ? o(f) : ic(e, r, n, i, o));
  });
}
function ah(e, t, r, n, i) {
  Fe.readlink(t, (o, a) => {
    if (o) return i(o);
    if (n.dereference && (a = Fr.resolve(process.cwd(), a)), e)
      Fe.readlink(r, (s, l) => s ? s.code === "EINVAL" || s.code === "UNKNOWN" ? Fe.symlink(a, r, i) : i(s) : (n.dereference && (l = Fr.resolve(process.cwd(), l)), xr.isSrcSubdir(a, l) ? i(new Error(`Cannot copy '${a}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && xr.isSrcSubdir(l, a) ? i(new Error(`Cannot overwrite '${l}' with '${a}'.`)) : sh(a, r, i)));
    else
      return Fe.symlink(a, r, i);
  });
}
function sh(e, t, r) {
  Fe.unlink(t, (n) => n ? r(n) : Fe.symlink(e, t, r));
}
var lh = Xd;
const Te = Ne, Lr = oe, ch = Ze.mkdirsSync, uh = Ql.utimesMillisSync, Ur = hr;
function fh(e, t, r) {
  typeof r == "function" && (r = { filter: r }), r = r || {}, r.clobber = "clobber" in r ? !!r.clobber : !0, r.overwrite = "overwrite" in r ? !!r.overwrite : r.clobber, r.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: n, destStat: i } = Ur.checkPathsSync(e, t, "copy", r);
  return Ur.checkParentPathsSync(e, n, t, "copy"), dh(i, e, t, r);
}
function dh(e, t, r, n) {
  if (n.filter && !n.filter(t, r)) return;
  const i = Lr.dirname(r);
  return Te.existsSync(i) || ch(i), oc(e, t, r, n);
}
function hh(e, t, r, n) {
  if (!(n.filter && !n.filter(t, r)))
    return oc(e, t, r, n);
}
function oc(e, t, r, n) {
  const o = (n.dereference ? Te.statSync : Te.lstatSync)(t);
  if (o.isDirectory()) return vh(o, e, t, r, n);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return ph(o, e, t, r, n);
  if (o.isSymbolicLink()) return Ah(e, t, r, n);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function ph(e, t, r, n, i) {
  return t ? mh(e, r, n, i) : ac(e, r, n, i);
}
function mh(e, t, r, n) {
  if (n.overwrite)
    return Te.unlinkSync(r), ac(e, t, r, n);
  if (n.errorOnExist)
    throw new Error(`'${r}' already exists`);
}
function ac(e, t, r, n) {
  return Te.copyFileSync(t, r), n.preserveTimestamps && gh(e.mode, t, r), Mo(r, e.mode);
}
function gh(e, t, r) {
  return Eh(e) && yh(r, e), wh(t, r);
}
function Eh(e) {
  return (e & 128) === 0;
}
function yh(e, t) {
  return Mo(e, t | 128);
}
function Mo(e, t) {
  return Te.chmodSync(e, t);
}
function wh(e, t) {
  const r = Te.statSync(e);
  return uh(t, r.atime, r.mtime);
}
function vh(e, t, r, n, i) {
  return t ? sc(r, n, i) : _h(e.mode, r, n, i);
}
function _h(e, t, r, n) {
  return Te.mkdirSync(r), sc(t, r, n), Mo(r, e);
}
function sc(e, t, r) {
  Te.readdirSync(e).forEach((n) => Th(n, e, t, r));
}
function Th(e, t, r, n) {
  const i = Lr.join(t, e), o = Lr.join(r, e), { destStat: a } = Ur.checkPathsSync(i, o, "copy", n);
  return hh(a, i, o, n);
}
function Ah(e, t, r, n) {
  let i = Te.readlinkSync(t);
  if (n.dereference && (i = Lr.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Te.readlinkSync(r);
    } catch (a) {
      if (a.code === "EINVAL" || a.code === "UNKNOWN") return Te.symlinkSync(i, r);
      throw a;
    }
    if (n.dereference && (o = Lr.resolve(process.cwd(), o)), Ur.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Te.statSync(r).isDirectory() && Ur.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return Sh(i, r);
  } else
    return Te.symlinkSync(i, r);
}
function Sh(e, t) {
  return Te.unlinkSync(t), Te.symlinkSync(e, t);
}
var Ch = fh;
const bh = Ie.fromCallback;
var Bo = {
  copy: bh(lh),
  copySync: Ch
};
const ja = Ne, lc = oe, Z = jl, kr = process.platform === "win32";
function cc(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((r) => {
    e[r] = e[r] || ja[r], r = r + "Sync", e[r] = e[r] || ja[r];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Ho(e, t, r) {
  let n = 0;
  typeof t == "function" && (r = t, t = {}), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z.strictEqual(typeof r, "function", "rimraf: callback function required"), Z(t, "rimraf: invalid options argument provided"), Z.strictEqual(typeof t, "object", "rimraf: options should be object"), cc(t), qa(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && n < t.maxBusyTries) {
        n++;
        const a = n * 100;
        return setTimeout(() => qa(e, t, i), a);
      }
      o.code === "ENOENT" && (o = null);
    }
    r(o);
  });
}
function qa(e, t, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.lstat(e, (n, i) => {
    if (n && n.code === "ENOENT")
      return r(null);
    if (n && n.code === "EPERM" && kr)
      return Ga(e, t, n, r);
    if (i && i.isDirectory())
      return kn(e, t, n, r);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return r(null);
        if (o.code === "EPERM")
          return kr ? Ga(e, t, o, r) : kn(e, t, o, r);
        if (o.code === "EISDIR")
          return kn(e, t, o, r);
      }
      return r(o);
    });
  });
}
function Ga(e, t, r, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.chmod(e, 438, (i) => {
    i ? n(i.code === "ENOENT" ? null : r) : t.stat(e, (o, a) => {
      o ? n(o.code === "ENOENT" ? null : r) : a.isDirectory() ? kn(e, t, r, n) : t.unlink(e, n);
    });
  });
}
function Wa(e, t, r) {
  let n;
  Z(e), Z(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  try {
    n = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw r;
  }
  n.isDirectory() ? Mn(e, t, r) : t.unlinkSync(e);
}
function kn(e, t, r, n) {
  Z(e), Z(t), Z(typeof n == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? Oh(e, t, n) : i && i.code === "ENOTDIR" ? n(r) : n(i);
  });
}
function Oh(e, t, r) {
  Z(e), Z(t), Z(typeof r == "function"), t.readdir(e, (n, i) => {
    if (n) return r(n);
    let o = i.length, a;
    if (o === 0) return t.rmdir(e, r);
    i.forEach((s) => {
      Ho(lc.join(e, s), t, (l) => {
        if (!a) {
          if (l) return r(a = l);
          --o === 0 && t.rmdir(e, r);
        }
      });
    });
  });
}
function uc(e, t) {
  let r;
  t = t || {}, cc(t), Z(e, "rimraf: missing path"), Z.strictEqual(typeof e, "string", "rimraf: path should be a string"), Z(t, "rimraf: missing options"), Z.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    r = t.lstatSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    n.code === "EPERM" && kr && Wa(e, t, n);
  }
  try {
    r && r.isDirectory() ? Mn(e, t, null) : t.unlinkSync(e);
  } catch (n) {
    if (n.code === "ENOENT")
      return;
    if (n.code === "EPERM")
      return kr ? Wa(e, t, n) : Mn(e, t, n);
    if (n.code !== "EISDIR")
      throw n;
    Mn(e, t, n);
  }
}
function Mn(e, t, r) {
  Z(e), Z(t);
  try {
    t.rmdirSync(e);
  } catch (n) {
    if (n.code === "ENOTDIR")
      throw r;
    if (n.code === "ENOTEMPTY" || n.code === "EEXIST" || n.code === "EPERM")
      Rh(e, t);
    else if (n.code !== "ENOENT")
      throw n;
  }
}
function Rh(e, t) {
  if (Z(e), Z(t), t.readdirSync(e).forEach((r) => uc(lc.join(e, r), t)), kr) {
    const r = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - r < 500);
  } else
    return t.rmdirSync(e, t);
}
var Ih = Ho;
Ho.sync = uc;
const qn = Ne, Nh = Ie.fromCallback, fc = Ih;
function Ph(e, t) {
  if (qn.rm) return qn.rm(e, { recursive: !0, force: !0 }, t);
  fc(e, t);
}
function Dh(e) {
  if (qn.rmSync) return qn.rmSync(e, { recursive: !0, force: !0 });
  fc.sync(e);
}
var ii = {
  remove: Nh(Ph),
  removeSync: Dh
};
const $h = Ie.fromPromise, dc = Ht, hc = oe, pc = Ze, mc = ii, Va = $h(async function(t) {
  let r;
  try {
    r = await dc.readdir(t);
  } catch {
    return pc.mkdirs(t);
  }
  return Promise.all(r.map((n) => mc.remove(hc.join(t, n))));
});
function za(e) {
  let t;
  try {
    t = dc.readdirSync(e);
  } catch {
    return pc.mkdirsSync(e);
  }
  t.forEach((r) => {
    r = hc.join(e, r), mc.removeSync(r);
  });
}
var Fh = {
  emptyDirSync: za,
  emptydirSync: za,
  emptyDir: Va,
  emptydir: Va
};
const xh = Ie.fromCallback, gc = oe, ft = Ne, Ec = Ze;
function Lh(e, t) {
  function r() {
    ft.writeFile(e, "", (n) => {
      if (n) return t(n);
      t();
    });
  }
  ft.stat(e, (n, i) => {
    if (!n && i.isFile()) return t();
    const o = gc.dirname(e);
    ft.stat(o, (a, s) => {
      if (a)
        return a.code === "ENOENT" ? Ec.mkdirs(o, (l) => {
          if (l) return t(l);
          r();
        }) : t(a);
      s.isDirectory() ? r() : ft.readdir(o, (l) => {
        if (l) return t(l);
      });
    });
  });
}
function Uh(e) {
  let t;
  try {
    t = ft.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const r = gc.dirname(e);
  try {
    ft.statSync(r).isDirectory() || ft.readdirSync(r);
  } catch (n) {
    if (n && n.code === "ENOENT") Ec.mkdirsSync(r);
    else throw n;
  }
  ft.writeFileSync(e, "");
}
var kh = {
  createFile: xh(Lh),
  createFileSync: Uh
};
const Mh = Ie.fromCallback, yc = oe, ut = Ne, wc = Ze, Bh = jt.pathExists, { areIdentical: vc } = hr;
function Hh(e, t, r) {
  function n(i, o) {
    ut.link(i, o, (a) => {
      if (a) return r(a);
      r(null);
    });
  }
  ut.lstat(t, (i, o) => {
    ut.lstat(e, (a, s) => {
      if (a)
        return a.message = a.message.replace("lstat", "ensureLink"), r(a);
      if (o && vc(s, o)) return r(null);
      const l = yc.dirname(t);
      Bh(l, (h, c) => {
        if (h) return r(h);
        if (c) return n(e, t);
        wc.mkdirs(l, (f) => {
          if (f) return r(f);
          n(e, t);
        });
      });
    });
  });
}
function jh(e, t) {
  let r;
  try {
    r = ut.lstatSync(t);
  } catch {
  }
  try {
    const o = ut.lstatSync(e);
    if (r && vc(o, r)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const n = yc.dirname(t);
  return ut.existsSync(n) || wc.mkdirsSync(n), ut.linkSync(e, t);
}
var qh = {
  createLink: Mh(Hh),
  createLinkSync: jh
};
const dt = oe, Ir = Ne, Gh = jt.pathExists;
function Wh(e, t, r) {
  if (dt.isAbsolute(e))
    return Ir.lstat(e, (n) => n ? (n.message = n.message.replace("lstat", "ensureSymlink"), r(n)) : r(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const n = dt.dirname(t), i = dt.join(n, e);
    return Gh(i, (o, a) => o ? r(o) : a ? r(null, {
      toCwd: i,
      toDst: e
    }) : Ir.lstat(e, (s) => s ? (s.message = s.message.replace("lstat", "ensureSymlink"), r(s)) : r(null, {
      toCwd: e,
      toDst: dt.relative(n, e)
    })));
  }
}
function Vh(e, t) {
  let r;
  if (dt.isAbsolute(e)) {
    if (r = Ir.existsSync(e), !r) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const n = dt.dirname(t), i = dt.join(n, e);
    if (r = Ir.existsSync(i), r)
      return {
        toCwd: i,
        toDst: e
      };
    if (r = Ir.existsSync(e), !r) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: dt.relative(n, e)
    };
  }
}
var zh = {
  symlinkPaths: Wh,
  symlinkPathsSync: Vh
};
const _c = Ne;
function Yh(e, t, r) {
  if (r = typeof t == "function" ? t : r, t = typeof t == "function" ? !1 : t, t) return r(null, t);
  _c.lstat(e, (n, i) => {
    if (n) return r(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", r(null, t);
  });
}
function Xh(e, t) {
  let r;
  if (t) return t;
  try {
    r = _c.lstatSync(e);
  } catch {
    return "file";
  }
  return r && r.isDirectory() ? "dir" : "file";
}
var Kh = {
  symlinkType: Yh,
  symlinkTypeSync: Xh
};
const Jh = Ie.fromCallback, Tc = oe, Ge = Ht, Ac = Ze, Qh = Ac.mkdirs, Zh = Ac.mkdirsSync, Sc = zh, ep = Sc.symlinkPaths, tp = Sc.symlinkPathsSync, Cc = Kh, rp = Cc.symlinkType, np = Cc.symlinkTypeSync, ip = jt.pathExists, { areIdentical: bc } = hr;
function op(e, t, r, n) {
  n = typeof r == "function" ? r : n, r = typeof r == "function" ? !1 : r, Ge.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      Ge.stat(e),
      Ge.stat(t)
    ]).then(([a, s]) => {
      if (bc(a, s)) return n(null);
      Ya(e, t, r, n);
    }) : Ya(e, t, r, n);
  });
}
function Ya(e, t, r, n) {
  ep(e, t, (i, o) => {
    if (i) return n(i);
    e = o.toDst, rp(o.toCwd, r, (a, s) => {
      if (a) return n(a);
      const l = Tc.dirname(t);
      ip(l, (h, c) => {
        if (h) return n(h);
        if (c) return Ge.symlink(e, t, s, n);
        Qh(l, (f) => {
          if (f) return n(f);
          Ge.symlink(e, t, s, n);
        });
      });
    });
  });
}
function ap(e, t, r) {
  let n;
  try {
    n = Ge.lstatSync(t);
  } catch {
  }
  if (n && n.isSymbolicLink()) {
    const s = Ge.statSync(e), l = Ge.statSync(t);
    if (bc(s, l)) return;
  }
  const i = tp(e, t);
  e = i.toDst, r = np(i.toCwd, r);
  const o = Tc.dirname(t);
  return Ge.existsSync(o) || Zh(o), Ge.symlinkSync(e, t, r);
}
var sp = {
  createSymlink: Jh(op),
  createSymlinkSync: ap
};
const { createFile: Xa, createFileSync: Ka } = kh, { createLink: Ja, createLinkSync: Qa } = qh, { createSymlink: Za, createSymlinkSync: es } = sp;
var lp = {
  // file
  createFile: Xa,
  createFileSync: Ka,
  ensureFile: Xa,
  ensureFileSync: Ka,
  // link
  createLink: Ja,
  createLinkSync: Qa,
  ensureLink: Ja,
  ensureLinkSync: Qa,
  // symlink
  createSymlink: Za,
  createSymlinkSync: es,
  ensureSymlink: Za,
  ensureSymlinkSync: es
};
function cp(e, { EOL: t = `
`, finalEOL: r = !0, replacer: n = null, spaces: i } = {}) {
  const o = r ? t : "", a = JSON.stringify(e, n, i);
  if (a === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return a.replace(/\n/g, t) + o;
}
function up(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var jo = { stringify: cp, stripBom: up };
let cr;
try {
  cr = Ne;
} catch {
  cr = _t;
}
const oi = Ie, { stringify: Oc, stripBom: Rc } = jo;
async function fp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || cr, n = "throws" in t ? t.throws : !0;
  let i = await oi.fromCallback(r.readFile)(e, t);
  i = Rc(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (a) {
    if (n)
      throw a.message = `${e}: ${a.message}`, a;
    return null;
  }
  return o;
}
const dp = oi.fromPromise(fp);
function hp(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const r = t.fs || cr, n = "throws" in t ? t.throws : !0;
  try {
    let i = r.readFileSync(e, t);
    return i = Rc(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (n)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function pp(e, t, r = {}) {
  const n = r.fs || cr, i = Oc(t, r);
  await oi.fromCallback(n.writeFile)(e, i, r);
}
const mp = oi.fromPromise(pp);
function gp(e, t, r = {}) {
  const n = r.fs || cr, i = Oc(t, r);
  return n.writeFileSync(e, i, r);
}
var Ep = {
  readFile: dp,
  readFileSync: hp,
  writeFile: mp,
  writeFileSync: gp
};
const Tn = Ep;
var yp = {
  // jsonfile exports
  readJson: Tn.readFile,
  readJsonSync: Tn.readFileSync,
  writeJson: Tn.writeFile,
  writeJsonSync: Tn.writeFileSync
};
const wp = Ie.fromCallback, Nr = Ne, Ic = oe, Nc = Ze, vp = jt.pathExists;
function _p(e, t, r, n) {
  typeof r == "function" && (n = r, r = "utf8");
  const i = Ic.dirname(e);
  vp(i, (o, a) => {
    if (o) return n(o);
    if (a) return Nr.writeFile(e, t, r, n);
    Nc.mkdirs(i, (s) => {
      if (s) return n(s);
      Nr.writeFile(e, t, r, n);
    });
  });
}
function Tp(e, ...t) {
  const r = Ic.dirname(e);
  if (Nr.existsSync(r))
    return Nr.writeFileSync(e, ...t);
  Nc.mkdirsSync(r), Nr.writeFileSync(e, ...t);
}
var qo = {
  outputFile: wp(_p),
  outputFileSync: Tp
};
const { stringify: Ap } = jo, { outputFile: Sp } = qo;
async function Cp(e, t, r = {}) {
  const n = Ap(t, r);
  await Sp(e, n, r);
}
var bp = Cp;
const { stringify: Op } = jo, { outputFileSync: Rp } = qo;
function Ip(e, t, r) {
  const n = Op(t, r);
  Rp(e, n, r);
}
var Np = Ip;
const Pp = Ie.fromPromise, Re = yp;
Re.outputJson = Pp(bp);
Re.outputJsonSync = Np;
Re.outputJSON = Re.outputJson;
Re.outputJSONSync = Re.outputJsonSync;
Re.writeJSON = Re.writeJson;
Re.writeJSONSync = Re.writeJsonSync;
Re.readJSON = Re.readJson;
Re.readJSONSync = Re.readJsonSync;
var Dp = Re;
const $p = Ne, mo = oe, Fp = Bo.copy, Pc = ii.remove, xp = Ze.mkdirp, Lp = jt.pathExists, ts = hr;
function Up(e, t, r, n) {
  typeof r == "function" && (n = r, r = {}), r = r || {};
  const i = r.overwrite || r.clobber || !1;
  ts.checkPaths(e, t, "move", r, (o, a) => {
    if (o) return n(o);
    const { srcStat: s, isChangingCase: l = !1 } = a;
    ts.checkParentPaths(e, s, t, "move", (h) => {
      if (h) return n(h);
      if (kp(t)) return rs(e, t, i, l, n);
      xp(mo.dirname(t), (c) => c ? n(c) : rs(e, t, i, l, n));
    });
  });
}
function kp(e) {
  const t = mo.dirname(e);
  return mo.parse(t).root === t;
}
function rs(e, t, r, n, i) {
  if (n) return Fi(e, t, r, i);
  if (r)
    return Pc(t, (o) => o ? i(o) : Fi(e, t, r, i));
  Lp(t, (o, a) => o ? i(o) : a ? i(new Error("dest already exists.")) : Fi(e, t, r, i));
}
function Fi(e, t, r, n) {
  $p.rename(e, t, (i) => i ? i.code !== "EXDEV" ? n(i) : Mp(e, t, r, n) : n());
}
function Mp(e, t, r, n) {
  Fp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }, (o) => o ? n(o) : Pc(e, n));
}
var Bp = Up;
const Dc = Ne, go = oe, Hp = Bo.copySync, $c = ii.removeSync, jp = Ze.mkdirpSync, ns = hr;
function qp(e, t, r) {
  r = r || {};
  const n = r.overwrite || r.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ns.checkPathsSync(e, t, "move", r);
  return ns.checkParentPathsSync(e, i, t, "move"), Gp(t) || jp(go.dirname(t)), Wp(e, t, n, o);
}
function Gp(e) {
  const t = go.dirname(e);
  return go.parse(t).root === t;
}
function Wp(e, t, r, n) {
  if (n) return xi(e, t, r);
  if (r)
    return $c(t), xi(e, t, r);
  if (Dc.existsSync(t)) throw new Error("dest already exists.");
  return xi(e, t, r);
}
function xi(e, t, r) {
  try {
    Dc.renameSync(e, t);
  } catch (n) {
    if (n.code !== "EXDEV") throw n;
    return Vp(e, t, r);
  }
}
function Vp(e, t, r) {
  return Hp(e, t, {
    overwrite: r,
    errorOnExist: !0
  }), $c(e);
}
var zp = qp;
const Yp = Ie.fromCallback;
var Xp = {
  move: Yp(Bp),
  moveSync: zp
}, At = {
  // Export promiseified graceful-fs:
  ...Ht,
  // Export extra methods:
  ...Bo,
  ...Fh,
  ...lp,
  ...Dp,
  ...Ze,
  ...Xp,
  ...qo,
  ...jt,
  ...ii
}, qt = {}, mt = {}, fe = {}, gt = {};
Object.defineProperty(gt, "__esModule", { value: !0 });
gt.CancellationError = gt.CancellationToken = void 0;
const Kp = ql;
class Jp extends Kp.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new Eo());
    const r = () => {
      if (n != null)
        try {
          this.removeListener("cancel", n), n = null;
        } catch {
        }
    };
    let n = null;
    return new Promise((i, o) => {
      let a = null;
      if (n = () => {
        try {
          a != null && (a(), a = null);
        } finally {
          o(new Eo());
        }
      }, this.cancelled) {
        n();
        return;
      }
      this.onCancel(n), t(i, o, (s) => {
        a = s;
      });
    }).then((i) => (r(), i)).catch((i) => {
      throw r(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
gt.CancellationToken = Jp;
class Eo extends Error {
  constructor() {
    super("cancelled");
  }
}
gt.CancellationError = Eo;
var pr = {};
Object.defineProperty(pr, "__esModule", { value: !0 });
pr.newError = Qp;
function Qp(e, t) {
  const r = new Error(e);
  return r.code = t, r;
}
var Oe = {}, yo = { exports: {} }, An = { exports: {} }, Li, is;
function Zp() {
  if (is) return Li;
  is = 1;
  var e = 1e3, t = e * 60, r = t * 60, n = r * 24, i = n * 7, o = n * 365.25;
  Li = function(c, f) {
    f = f || {};
    var d = typeof c;
    if (d === "string" && c.length > 0)
      return a(c);
    if (d === "number" && isFinite(c))
      return f.long ? l(c) : s(c);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(c)
    );
  };
  function a(c) {
    if (c = String(c), !(c.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        c
      );
      if (f) {
        var d = parseFloat(f[1]), m = (f[2] || "ms").toLowerCase();
        switch (m) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return d * o;
          case "weeks":
          case "week":
          case "w":
            return d * i;
          case "days":
          case "day":
          case "d":
            return d * n;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return d * r;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return d * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return d * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return d;
          default:
            return;
        }
      }
    }
  }
  function s(c) {
    var f = Math.abs(c);
    return f >= n ? Math.round(c / n) + "d" : f >= r ? Math.round(c / r) + "h" : f >= t ? Math.round(c / t) + "m" : f >= e ? Math.round(c / e) + "s" : c + "ms";
  }
  function l(c) {
    var f = Math.abs(c);
    return f >= n ? h(c, f, n, "day") : f >= r ? h(c, f, r, "hour") : f >= t ? h(c, f, t, "minute") : f >= e ? h(c, f, e, "second") : c + " ms";
  }
  function h(c, f, d, m) {
    var w = f >= d * 1.5;
    return Math.round(c / d) + " " + m + (w ? "s" : "");
  }
  return Li;
}
var Ui, os;
function Fc() {
  if (os) return Ui;
  os = 1;
  function e(t) {
    n.debug = n, n.default = n, n.coerce = h, n.disable = s, n.enable = o, n.enabled = l, n.humanize = Zp(), n.destroy = c, Object.keys(t).forEach((f) => {
      n[f] = t[f];
    }), n.names = [], n.skips = [], n.formatters = {};
    function r(f) {
      let d = 0;
      for (let m = 0; m < f.length; m++)
        d = (d << 5) - d + f.charCodeAt(m), d |= 0;
      return n.colors[Math.abs(d) % n.colors.length];
    }
    n.selectColor = r;
    function n(f) {
      let d, m = null, w, E;
      function T(...A) {
        if (!T.enabled)
          return;
        const S = T, F = Number(/* @__PURE__ */ new Date()), x = F - (d || F);
        S.diff = x, S.prev = d, S.curr = F, d = F, A[0] = n.coerce(A[0]), typeof A[0] != "string" && A.unshift("%O");
        let J = 0;
        A[0] = A[0].replace(/%([a-zA-Z%])/g, (V, me) => {
          if (V === "%%")
            return "%";
          J++;
          const y = n.formatters[me];
          if (typeof y == "function") {
            const j = A[J];
            V = y.call(S, j), A.splice(J, 1), J--;
          }
          return V;
        }), n.formatArgs.call(S, A), (S.log || n.log).apply(S, A);
      }
      return T.namespace = f, T.useColors = n.useColors(), T.color = n.selectColor(f), T.extend = i, T.destroy = n.destroy, Object.defineProperty(T, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => m !== null ? m : (w !== n.namespaces && (w = n.namespaces, E = n.enabled(f)), E),
        set: (A) => {
          m = A;
        }
      }), typeof n.init == "function" && n.init(T), T;
    }
    function i(f, d) {
      const m = n(this.namespace + (typeof d > "u" ? ":" : d) + f);
      return m.log = this.log, m;
    }
    function o(f) {
      n.save(f), n.namespaces = f, n.names = [], n.skips = [];
      const d = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const m of d)
        m[0] === "-" ? n.skips.push(m.slice(1)) : n.names.push(m);
    }
    function a(f, d) {
      let m = 0, w = 0, E = -1, T = 0;
      for (; m < f.length; )
        if (w < d.length && (d[w] === f[m] || d[w] === "*"))
          d[w] === "*" ? (E = w, T = m, w++) : (m++, w++);
        else if (E !== -1)
          w = E + 1, T++, m = T;
        else
          return !1;
      for (; w < d.length && d[w] === "*"; )
        w++;
      return w === d.length;
    }
    function s() {
      const f = [
        ...n.names,
        ...n.skips.map((d) => "-" + d)
      ].join(",");
      return n.enable(""), f;
    }
    function l(f) {
      for (const d of n.skips)
        if (a(f, d))
          return !1;
      for (const d of n.names)
        if (a(f, d))
          return !0;
      return !1;
    }
    function h(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function c() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return n.enable(n.load()), n;
  }
  return Ui = e, Ui;
}
var as;
function em() {
  return as || (as = 1, function(e, t) {
    t.formatArgs = n, t.save = i, t.load = o, t.useColors = r, t.storage = a(), t.destroy = /* @__PURE__ */ (() => {
      let l = !1;
      return () => {
        l || (l = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function r() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let l;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (l = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(l[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function n(l) {
      if (l[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + l[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const h = "color: " + this.color;
      l.splice(1, 0, h, "color: inherit");
      let c = 0, f = 0;
      l[0].replace(/%[a-zA-Z%]/g, (d) => {
        d !== "%%" && (c++, d === "%c" && (f = c));
      }), l.splice(f, 0, h);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(l) {
      try {
        l ? t.storage.setItem("debug", l) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let l;
      try {
        l = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !l && typeof process < "u" && "env" in process && (l = process.env.DEBUG), l;
    }
    function a() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = Fc()(t);
    const { formatters: s } = e.exports;
    s.j = function(l) {
      try {
        return JSON.stringify(l);
      } catch (h) {
        return "[UnexpectedJSONParseError]: " + h.message;
      }
    };
  }(An, An.exports)), An.exports;
}
var Sn = { exports: {} }, ki, ss;
function tm() {
  return ss || (ss = 1, ki = (e, t = process.argv) => {
    const r = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = t.indexOf(r + e), i = t.indexOf("--");
    return n !== -1 && (i === -1 || n < i);
  }), ki;
}
var Mi, ls;
function rm() {
  if (ls) return Mi;
  ls = 1;
  const e = ti, t = Gl, r = tm(), { env: n } = process;
  let i;
  r("no-color") || r("no-colors") || r("color=false") || r("color=never") ? i = 0 : (r("color") || r("colors") || r("color=true") || r("color=always")) && (i = 1), "FORCE_COLOR" in n && (n.FORCE_COLOR === "true" ? i = 1 : n.FORCE_COLOR === "false" ? i = 0 : i = n.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(n.FORCE_COLOR, 10), 3));
  function o(l) {
    return l === 0 ? !1 : {
      level: l,
      hasBasic: !0,
      has256: l >= 2,
      has16m: l >= 3
    };
  }
  function a(l, h) {
    if (i === 0)
      return 0;
    if (r("color=16m") || r("color=full") || r("color=truecolor"))
      return 3;
    if (r("color=256"))
      return 2;
    if (l && !h && i === void 0)
      return 0;
    const c = i || 0;
    if (n.TERM === "dumb")
      return c;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in n)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in n) || n.CI_NAME === "codeship" ? 1 : c;
    if ("TEAMCITY_VERSION" in n)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(n.TEAMCITY_VERSION) ? 1 : 0;
    if (n.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in n) {
      const f = parseInt((n.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (n.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(n.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(n.TERM) || "COLORTERM" in n ? 1 : c;
  }
  function s(l) {
    const h = a(l, l && l.isTTY);
    return o(h);
  }
  return Mi = {
    supportsColor: s,
    stdout: o(a(!0, t.isatty(1))),
    stderr: o(a(!0, t.isatty(2)))
  }, Mi;
}
var cs;
function nm() {
  return cs || (cs = 1, function(e, t) {
    const r = Gl, n = Fo;
    t.init = c, t.log = s, t.formatArgs = o, t.save = l, t.load = h, t.useColors = i, t.destroy = n.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const d = rm();
      d && (d.stderr || d).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((d) => /^debug_/i.test(d)).reduce((d, m) => {
      const w = m.substring(6).toLowerCase().replace(/_([a-z])/g, (T, A) => A.toUpperCase());
      let E = process.env[m];
      return /^(yes|on|true|enabled)$/i.test(E) ? E = !0 : /^(no|off|false|disabled)$/i.test(E) ? E = !1 : E === "null" ? E = null : E = Number(E), d[w] = E, d;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : r.isatty(process.stderr.fd);
    }
    function o(d) {
      const { namespace: m, useColors: w } = this;
      if (w) {
        const E = this.color, T = "\x1B[3" + (E < 8 ? E : "8;5;" + E), A = `  ${T};1m${m} \x1B[0m`;
        d[0] = A + d[0].split(`
`).join(`
` + A), d.push(T + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        d[0] = a() + m + " " + d[0];
    }
    function a() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function s(...d) {
      return process.stderr.write(n.formatWithOptions(t.inspectOpts, ...d) + `
`);
    }
    function l(d) {
      d ? process.env.DEBUG = d : delete process.env.DEBUG;
    }
    function h() {
      return process.env.DEBUG;
    }
    function c(d) {
      d.inspectOpts = {};
      const m = Object.keys(t.inspectOpts);
      for (let w = 0; w < m.length; w++)
        d.inspectOpts[m[w]] = t.inspectOpts[m[w]];
    }
    e.exports = Fc()(t);
    const { formatters: f } = e.exports;
    f.o = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts).split(`
`).map((m) => m.trim()).join(" ");
    }, f.O = function(d) {
      return this.inspectOpts.colors = this.useColors, n.inspect(d, this.inspectOpts);
    };
  }(Sn, Sn.exports)), Sn.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? yo.exports = em() : yo.exports = nm();
var im = yo.exports, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.ProgressCallbackTransform = void 0;
const om = Kr;
class am extends om.Transform {
  constructor(t, r, n) {
    super(), this.total = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Zr.ProgressCallbackTransform = am;
Object.defineProperty(Oe, "__esModule", { value: !0 });
Oe.DigestTransform = Oe.HttpExecutor = Oe.HttpError = void 0;
Oe.createHttpError = vo;
Oe.parseJson = pm;
Oe.configureRequestOptionsFromUrl = Lc;
Oe.configureRequestUrl = Wo;
Oe.safeGetHeader = or;
Oe.configureRequestOptions = Gn;
Oe.safeStringifyJson = Wn;
const sm = Jr, lm = im, cm = _t, um = Kr, wo = Tt, fm = gt, us = pr, dm = Zr, Nt = (0, lm.default)("electron-builder");
function vo(e, t = null) {
  return new Go(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Wn(e.headers), t);
}
const hm = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class Go extends Error {
  constructor(t, r = `HTTP error: ${hm.get(t) || t}`, n = null) {
    super(r), this.statusCode = t, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Oe.HttpError = Go;
function pm(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class Qt {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, r = new fm.CancellationToken(), n) {
    Gn(t);
    const i = n == null ? void 0 : JSON.stringify(n), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Nt(i);
      const { headers: a, ...s } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...a
        },
        ...s
      };
    }
    return this.doApiRequest(t, r, (a) => a.end(o));
  }
  doApiRequest(t, r, n, i = 0) {
    return Nt.enabled && Nt(`Request: ${Wn(t)}`), r.createPromise((o, a, s) => {
      const l = this.createRequest(t, (h) => {
        try {
          this.handleResponse(h, t, r, o, a, i, n);
        } catch (c) {
          a(c);
        }
      });
      this.addErrorAndTimeoutHandlers(l, a, t.timeout), this.addRedirectHandlers(l, t, a, i, (h) => {
        this.doApiRequest(h, r, n, i).then(o).catch(a);
      }), n(l, a), s(() => l.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, r, n, i, o) {
  }
  addErrorAndTimeoutHandlers(t, r, n = 60 * 1e3) {
    this.addTimeOutHandler(t, r, n), t.on("error", r), t.on("aborted", () => {
      r(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, r, n, i, o, a, s) {
    var l;
    if (Nt.enabled && Nt(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Wn(r)}`), t.statusCode === 404) {
      o(vo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const h = (l = t.statusCode) !== null && l !== void 0 ? l : 0, c = h >= 300 && h < 400, f = or(t, "location");
    if (c && f != null) {
      if (a > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(Qt.prepareRedirectUrlOptions(f, r), n, s, a).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let d = "";
    t.on("error", o), t.on("data", (m) => d += m), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const m = or(t, "content-type"), w = m != null && (Array.isArray(m) ? m.find((E) => E.includes("json")) != null : m.includes("json"));
          o(vo(t, `method: ${r.method || "GET"} url: ${r.protocol || "https:"}//${r.hostname}${r.port ? `:${r.port}` : ""}${r.path}

          Data:
          ${w ? JSON.stringify(JSON.parse(d)) : d}
          `));
        } else
          i(d.length === 0 ? null : d);
      } catch (m) {
        o(m);
      }
    });
  }
  async downloadToBuffer(t, r) {
    return await r.cancellationToken.createPromise((n, i, o) => {
      const a = [], s = {
        headers: r.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      Wo(t, s), Gn(s), this.doDownload(s, {
        destination: null,
        options: r,
        onCancel: o,
        callback: (l) => {
          l == null ? n(Buffer.concat(a)) : i(l);
        },
        responseHandler: (l, h) => {
          let c = 0;
          l.on("data", (f) => {
            if (c += f.length, c > 524288e3) {
              h(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            a.push(f);
          }), l.on("end", () => {
            h(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, r, n) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        r.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", r.callback);
      const a = or(o, "location");
      if (a != null) {
        n < this.maxRedirects ? this.doDownload(Qt.prepareRedirectUrlOptions(a, t), r, n++) : r.callback(this.createMaxRedirectError());
        return;
      }
      r.responseHandler == null ? gm(r, o) : r.responseHandler(o, r.callback);
    });
    this.addErrorAndTimeoutHandlers(i, r.callback, t.timeout), this.addRedirectHandlers(i, t, r.callback, n, (o) => {
      this.doDownload(o, r, n++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, r, n) {
    t.on("socket", (i) => {
      i.setTimeout(n, () => {
        t.abort(), r(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, r) {
    const n = Lc(t, { ...r }), i = n.headers;
    if (i != null && i.authorization) {
      const o = Qt.reconstructOriginalUrl(r), a = xc(t, r);
      Qt.isCrossOriginRedirect(o, a) && (Nt.enabled && Nt(`Given the cross-origin redirect (from ${o.host} to ${a.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return n;
  }
  static reconstructOriginalUrl(t) {
    const r = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const n = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new wo.URL(`${r}//${n}${i}${o}`);
  }
  static isCrossOriginRedirect(t, r) {
    if (t.hostname.toLowerCase() !== r.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && r.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(r.port))
      return !1;
    if (t.protocol !== r.protocol)
      return !0;
    const n = t.port, i = r.port;
    return n !== i;
  }
  static retryOnServerError(t, r = 3) {
    for (let n = 0; ; n++)
      try {
        return t();
      } catch (i) {
        if (n < r && (i instanceof Go && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Oe.HttpExecutor = Qt;
function xc(e, t) {
  try {
    return new wo.URL(e);
  } catch {
    const r = t.hostname, n = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${n}//${r}${i}`;
    return new wo.URL(e, o);
  }
}
function Lc(e, t) {
  const r = Gn(t), n = xc(e, t);
  return Wo(n, r), r;
}
function Wo(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class _o extends um.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, r = "sha512", n = "base64") {
    super(), this.expected = t, this.algorithm = r, this.encoding = n, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, sm.createHash)(r);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, r, n) {
    this.digester.update(t), n(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (r) {
        t(r);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, us.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, us.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Oe.DigestTransform = _o;
function mm(e, t, r) {
  return e != null && t != null && e !== t ? (r(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function or(e, t) {
  const r = e.headers[t];
  return r == null ? null : Array.isArray(r) ? r.length === 0 ? null : r[r.length - 1] : r;
}
function gm(e, t) {
  if (!mm(or(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const r = [];
  if (e.options.onProgress != null) {
    const a = or(t, "content-length");
    a != null && r.push(new dm.ProgressCallbackTransform(parseInt(a, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const n = e.options.sha512;
  n != null ? r.push(new _o(n, "sha512", n.length === 128 && !n.includes("+") && !n.includes("Z") && !n.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && r.push(new _o(e.options.sha2, "sha256", "hex"));
  const i = (0, cm.createWriteStream)(e.destination);
  r.push(i);
  let o = t;
  for (const a of r)
    a.on("error", (s) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(s);
    }), o = o.pipe(a);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function Gn(e, t, r) {
  r != null && (e.method = r), e.headers = { ...e.headers };
  const n = e.headers;
  return t != null && (n.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), n["User-Agent"] == null && (n["User-Agent"] = "electron-builder"), (r == null || r === "GET" || n["Cache-Control"] == null) && (n["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Wn(e, t) {
  return JSON.stringify(e, (r, n) => r.endsWith("Authorization") || r.endsWith("authorization") || r.endsWith("Password") || r.endsWith("PASSWORD") || r.endsWith("Token") || r.includes("password") || r.includes("token") || t != null && t.has(r) ? "<stripped sensitive data>" : n, 2);
}
var ai = {};
Object.defineProperty(ai, "__esModule", { value: !0 });
ai.MemoLazy = void 0;
class Em {
  constructor(t, r) {
    this.selector = t, this.creator = r, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Uc(this.selected, t))
      return this._value;
    this.selected = t;
    const r = this.creator(t);
    return this.value = r, r;
  }
  set value(t) {
    this._value = t;
  }
}
ai.MemoLazy = Em;
function Uc(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((a) => Uc(e[a], t[a]));
  }
  return e === t;
}
var en = {};
Object.defineProperty(en, "__esModule", { value: !0 });
en.githubUrl = ym;
en.githubTagPrefix = wm;
en.getS3LikeProviderBaseUrl = vm;
function ym(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function wm(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function vm(e) {
  const t = e.provider;
  if (t === "s3")
    return _m(e);
  if (t === "spaces")
    return Tm(e);
  throw new Error(`Not supported provider: ${t}`);
}
function _m(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return kc(t, e.path);
}
function kc(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function Tm(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return kc(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Vo = {};
Object.defineProperty(Vo, "__esModule", { value: !0 });
Vo.retry = Mc;
const Am = gt;
async function Mc(e, t) {
  var r;
  const { retries: n, interval: i, backoff: o = 0, attempt: a = 0, shouldRetry: s, cancellationToken: l = new Am.CancellationToken() } = t;
  try {
    return await e();
  } catch (h) {
    if (await Promise.resolve((r = s == null ? void 0 : s(h)) !== null && r !== void 0 ? r : !0) && n > 0 && !l.cancelled)
      return await new Promise((c) => setTimeout(c, i + o * a)), await Mc(e, { ...t, retries: n - 1, attempt: a + 1 });
    throw h;
  }
}
var zo = {};
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.parseDn = Sm;
function Sm(e) {
  let t = !1, r = null, n = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let a = 0; a <= e.length; a++) {
    if (a === e.length) {
      r !== null && o.set(r, n);
      break;
    }
    const s = e[a];
    if (t) {
      if (s === '"') {
        t = !1;
        continue;
      }
    } else {
      if (s === '"') {
        t = !0;
        continue;
      }
      if (s === "\\") {
        a++;
        const l = parseInt(e.slice(a, a + 2), 16);
        Number.isNaN(l) ? n += e[a] : (a++, n += String.fromCharCode(l));
        continue;
      }
      if (r === null && s === "=") {
        r = n, n = "";
        continue;
      }
      if (s === "," || s === ";" || s === "+") {
        r !== null && o.set(r, n), r = null, n = "";
        continue;
      }
    }
    if (s === " " && !t) {
      if (n.length === 0)
        continue;
      if (a > i) {
        let l = a;
        for (; e[l] === " "; )
          l++;
        i = l;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || r === null && e[i] === "=" || r !== null && e[i] === "+") {
        a = i - 1;
        continue;
      }
    }
    n += s;
  }
  return o;
}
var ur = {};
Object.defineProperty(ur, "__esModule", { value: !0 });
ur.nil = ur.UUID = void 0;
const Bc = Jr, Hc = pr, Cm = "options.name must be either a string or a Buffer", fs = (0, Bc.randomBytes)(16);
fs[0] = fs[0] | 1;
const Bn = {}, z = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Bn[t] = e, z[e] = t;
}
class Bt {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const r = Bt.check(t);
    if (!r)
      throw new Error("not a UUID");
    this.version = r.version, r.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, r) {
    return bm(t, "sha1", 80, r);
  }
  toString() {
    return this.ascii == null && (this.ascii = Om(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, r = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Bn[t[14] + t[15]] & 240) >> 4,
        variant: ds((Bn[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < r + 16)
        return !1;
      let n = 0;
      for (; n < 16 && t[r + n] === 0; n++)
        ;
      return n === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[r + 6] & 240) >> 4,
        variant: ds((t[r + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, Hc.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const r = Buffer.allocUnsafe(16);
    let n = 0;
    for (let i = 0; i < 16; i++)
      r[i] = Bn[t[n++] + t[n++]], (i === 3 || i === 5 || i === 7 || i === 9) && (n += 1);
    return r;
  }
}
ur.UUID = Bt;
Bt.OID = Bt.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function ds(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var Pr;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(Pr || (Pr = {}));
function bm(e, t, r, n, i = Pr.ASCII) {
  const o = (0, Bc.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, Hc.newError)(Cm, "ERR_INVALID_UUID_NAME");
  o.update(n), o.update(e);
  const s = o.digest();
  let l;
  switch (i) {
    case Pr.BINARY:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = s;
      break;
    case Pr.OBJECT:
      s[6] = s[6] & 15 | r, s[8] = s[8] & 63 | 128, l = new Bt(s);
      break;
    default:
      l = z[s[0]] + z[s[1]] + z[s[2]] + z[s[3]] + "-" + z[s[4]] + z[s[5]] + "-" + z[s[6] & 15 | r] + z[s[7]] + "-" + z[s[8] & 63 | 128] + z[s[9]] + "-" + z[s[10]] + z[s[11]] + z[s[12]] + z[s[13]] + z[s[14]] + z[s[15]];
      break;
  }
  return l;
}
function Om(e) {
  return z[e[0]] + z[e[1]] + z[e[2]] + z[e[3]] + "-" + z[e[4]] + z[e[5]] + "-" + z[e[6]] + z[e[7]] + "-" + z[e[8]] + z[e[9]] + "-" + z[e[10]] + z[e[11]] + z[e[12]] + z[e[13]] + z[e[14]] + z[e[15]];
}
ur.nil = new Bt("00000000-0000-0000-0000-000000000000");
var tn = {}, jc = {};
(function(e) {
  (function(t) {
    t.parser = function(p, u) {
      return new n(p, u);
    }, t.SAXParser = n, t.SAXStream = c, t.createStream = h, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var r = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function n(p, u) {
      if (!(this instanceof n))
        return new n(p, u);
      var R = this;
      o(R), R.q = R.c = "", R.bufferCheckPosition = t.MAX_BUFFER_LENGTH, R.opt = u || {}, R.opt.lowercase = R.opt.lowercase || R.opt.lowercasetags, R.looseCase = R.opt.lowercase ? "toLowerCase" : "toUpperCase", R.tags = [], R.closed = R.closedRoot = R.sawRoot = !1, R.tag = R.error = null, R.strict = !!p, R.noscript = !!(p || R.opt.noscript), R.state = y.BEGIN, R.strictEntities = R.opt.strictEntities, R.ENTITIES = R.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), R.attribList = [], R.opt.xmlns && (R.ns = Object.create(E)), R.opt.unquotedAttributeValues === void 0 && (R.opt.unquotedAttributeValues = !p), R.trackPosition = R.opt.position !== !1, R.trackPosition && (R.position = R.line = R.column = 0), G(R, "onready");
    }
    Object.create || (Object.create = function(p) {
      function u() {
      }
      u.prototype = p;
      var R = new u();
      return R;
    }), Object.keys || (Object.keys = function(p) {
      var u = [];
      for (var R in p) p.hasOwnProperty(R) && u.push(R);
      return u;
    });
    function i(p) {
      for (var u = Math.max(t.MAX_BUFFER_LENGTH, 10), R = 0, _ = 0, Y = r.length; _ < Y; _++) {
        var ee = p[r[_]].length;
        if (ee > u)
          switch (r[_]) {
            case "textNode":
              Q(p);
              break;
            case "cdata":
              H(p, "oncdata", p.cdata), p.cdata = "";
              break;
            case "script":
              H(p, "onscript", p.script), p.script = "";
              break;
            default:
              b(p, "Max buffer length exceeded: " + r[_]);
          }
        R = Math.max(R, ee);
      }
      var ae = t.MAX_BUFFER_LENGTH - R;
      p.bufferCheckPosition = ae + p.position;
    }
    function o(p) {
      for (var u = 0, R = r.length; u < R; u++)
        p[r[u]] = "";
    }
    function a(p) {
      Q(p), p.cdata !== "" && (H(p, "oncdata", p.cdata), p.cdata = ""), p.script !== "" && (H(p, "onscript", p.script), p.script = "");
    }
    n.prototype = {
      end: function() {
        P(this);
      },
      write: Xe,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        a(this);
      }
    };
    var s;
    try {
      s = require("stream").Stream;
    } catch {
      s = function() {
      };
    }
    s || (s = function() {
    });
    var l = t.EVENTS.filter(function(p) {
      return p !== "error" && p !== "end";
    });
    function h(p, u) {
      return new c(p, u);
    }
    function c(p, u) {
      if (!(this instanceof c))
        return new c(p, u);
      s.apply(this), this._parser = new n(p, u), this.writable = !0, this.readable = !0;
      var R = this;
      this._parser.onend = function() {
        R.emit("end");
      }, this._parser.onerror = function(_) {
        R.emit("error", _), R._parser.error = null;
      }, this._decoder = null, l.forEach(function(_) {
        Object.defineProperty(R, "on" + _, {
          get: function() {
            return R._parser["on" + _];
          },
          set: function(Y) {
            if (!Y)
              return R.removeAllListeners(_), R._parser["on" + _] = Y, Y;
            R.on(_, Y);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    c.prototype = Object.create(s.prototype, {
      constructor: {
        value: c
      }
    }), c.prototype.write = function(p) {
      return typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(p) && (this._decoder || (this._decoder = new TextDecoder("utf8")), p = this._decoder.decode(p, { stream: !0 })), this._parser.write(p.toString()), this.emit("data", p), !0;
    }, c.prototype.end = function(p) {
      if (p && p.length && this.write(p), this._decoder) {
        var u = this._decoder.decode();
        u && (this._parser.write(u), this.emit("data", u));
      }
      return this._parser.end(), !0;
    }, c.prototype.on = function(p, u) {
      var R = this;
      return !R._parser["on" + p] && l.indexOf(p) !== -1 && (R._parser["on" + p] = function() {
        var _ = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        _.splice(0, 0, p), R.emit.apply(R, _);
      }), s.prototype.on.call(R, p, u);
    };
    var f = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", w = "http://www.w3.org/2000/xmlns/", E = { xml: m, xmlns: w }, T = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, F = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function x(p) {
      return p === " " || p === `
` || p === "\r" || p === "	";
    }
    function J(p) {
      return p === '"' || p === "'";
    }
    function re(p) {
      return p === ">" || x(p);
    }
    function V(p, u) {
      return p.test(u);
    }
    function me(p, u) {
      return !V(p, u);
    }
    var y = 0;
    t.STATE = {
      BEGIN: y++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: y++,
      // leading whitespace
      TEXT: y++,
      // general stuff
      TEXT_ENTITY: y++,
      // &amp and such.
      OPEN_WAKA: y++,
      // <
      SGML_DECL: y++,
      // <!BLARG
      SGML_DECL_QUOTED: y++,
      // <!BLARG foo "bar
      DOCTYPE: y++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: y++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: y++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: y++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: y++,
      // <!-
      COMMENT: y++,
      // <!--
      COMMENT_ENDING: y++,
      // <!-- blah -
      COMMENT_ENDED: y++,
      // <!-- blah --
      CDATA: y++,
      // <![CDATA[ something
      CDATA_ENDING: y++,
      // ]
      CDATA_ENDING_2: y++,
      // ]]
      PROC_INST: y++,
      // <?hi
      PROC_INST_BODY: y++,
      // <?hi there
      PROC_INST_ENDING: y++,
      // <?hi "there" ?
      OPEN_TAG: y++,
      // <strong
      OPEN_TAG_SLASH: y++,
      // <strong /
      ATTRIB: y++,
      // <a
      ATTRIB_NAME: y++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: y++,
      // <a foo _
      ATTRIB_VALUE: y++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: y++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: y++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: y++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: y++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: y++,
      // <foo bar=&quot
      CLOSE_TAG: y++,
      // </a
      CLOSE_TAG_SAW_WHITE: y++,
      // </a   >
      SCRIPT: y++,
      // <script> ...
      SCRIPT_ENDING: y++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(p) {
      var u = t.ENTITIES[p], R = typeof u == "number" ? String.fromCharCode(u) : u;
      t.ENTITIES[p] = R;
    });
    for (var j in t.STATE)
      t.STATE[t.STATE[j]] = j;
    y = t.STATE;
    function G(p, u, R) {
      p[u] && p[u](R);
    }
    function H(p, u, R) {
      p.textNode && Q(p), G(p, u, R);
    }
    function Q(p) {
      p.textNode = O(p.opt, p.textNode), p.textNode && G(p, "ontext", p.textNode), p.textNode = "";
    }
    function O(p, u) {
      return p.trim && (u = u.trim()), p.normalize && (u = u.replace(/\s+/g, " ")), u;
    }
    function b(p, u) {
      return Q(p), p.trackPosition && (u += `
Line: ` + p.line + `
Column: ` + p.column + `
Char: ` + p.c), u = new Error(u), p.error = u, G(p, "onerror", u), p;
    }
    function P(p) {
      return p.sawRoot && !p.closedRoot && C(p, "Unclosed root tag"), p.state !== y.BEGIN && p.state !== y.BEGIN_WHITESPACE && p.state !== y.TEXT && b(p, "Unexpected end"), Q(p), p.c = "", p.closed = !0, G(p, "onend"), n.call(p, p.strict, p.opt), p;
    }
    function C(p, u) {
      if (typeof p != "object" || !(p instanceof n))
        throw new Error("bad call to strictFail");
      p.strict && b(p, u);
    }
    function $(p) {
      p.strict || (p.tagName = p.tagName[p.looseCase]());
      var u = p.tags[p.tags.length - 1] || p, R = p.tag = { name: p.tagName, attributes: {} };
      p.opt.xmlns && (R.ns = u.ns), p.attribList.length = 0, H(p, "onopentagstart", R);
    }
    function D(p, u) {
      var R = p.indexOf(":"), _ = R < 0 ? ["", p] : p.split(":"), Y = _[0], ee = _[1];
      return u && p === "xmlns" && (Y = "xmlns", ee = ""), { prefix: Y, local: ee };
    }
    function k(p) {
      if (p.strict || (p.attribName = p.attribName[p.looseCase]()), p.attribList.indexOf(p.attribName) !== -1 || p.tag.attributes.hasOwnProperty(p.attribName)) {
        p.attribName = p.attribValue = "";
        return;
      }
      if (p.opt.xmlns) {
        var u = D(p.attribName, !0), R = u.prefix, _ = u.local;
        if (R === "xmlns")
          if (_ === "xml" && p.attribValue !== m)
            C(
              p,
              "xml: prefix must be bound to " + m + `
Actual: ` + p.attribValue
            );
          else if (_ === "xmlns" && p.attribValue !== w)
            C(
              p,
              "xmlns: prefix must be bound to " + w + `
Actual: ` + p.attribValue
            );
          else {
            var Y = p.tag, ee = p.tags[p.tags.length - 1] || p;
            Y.ns === ee.ns && (Y.ns = Object.create(ee.ns)), Y.ns[_] = p.attribValue;
          }
        p.attribList.push([p.attribName, p.attribValue]);
      } else
        p.tag.attributes[p.attribName] = p.attribValue, H(p, "onattribute", {
          name: p.attribName,
          value: p.attribValue
        });
      p.attribName = p.attribValue = "";
    }
    function B(p, u) {
      if (p.opt.xmlns) {
        var R = p.tag, _ = D(p.tagName);
        R.prefix = _.prefix, R.local = _.local, R.uri = R.ns[_.prefix] || "", R.prefix && !R.uri && (C(
          p,
          "Unbound namespace prefix: " + JSON.stringify(p.tagName)
        ), R.uri = _.prefix);
        var Y = p.tags[p.tags.length - 1] || p;
        R.ns && Y.ns !== R.ns && Object.keys(R.ns).forEach(function(fn) {
          H(p, "onopennamespace", {
            prefix: fn,
            uri: R.ns[fn]
          });
        });
        for (var ee = 0, ae = p.attribList.length; ee < ae; ee++) {
          var ge = p.attribList[ee], ve = ge[0], it = ge[1], ue = D(ve, !0), Me = ue.prefix, Si = ue.local, un = Me === "" ? "" : R.ns[Me] || "", yr = {
            name: ve,
            value: it,
            prefix: Me,
            local: Si,
            uri: un
          };
          Me && Me !== "xmlns" && !un && (C(
            p,
            "Unbound namespace prefix: " + JSON.stringify(Me)
          ), yr.uri = Me), p.tag.attributes[ve] = yr, H(p, "onattribute", yr);
        }
        p.attribList.length = 0;
      }
      p.tag.isSelfClosing = !!u, p.sawRoot = !0, p.tags.push(p.tag), H(p, "onopentag", p.tag), u || (!p.noscript && p.tagName.toLowerCase() === "script" ? p.state = y.SCRIPT : p.state = y.TEXT, p.tag = null, p.tagName = ""), p.attribName = p.attribValue = "", p.attribList.length = 0;
    }
    function q(p) {
      if (!p.tagName) {
        C(p, "Weird empty close tag."), p.textNode += "</>", p.state = y.TEXT;
        return;
      }
      if (p.script) {
        if (p.tagName !== "script") {
          p.script += "</" + p.tagName + ">", p.tagName = "", p.state = y.SCRIPT;
          return;
        }
        H(p, "onscript", p.script), p.script = "";
      }
      var u = p.tags.length, R = p.tagName;
      p.strict || (R = R[p.looseCase]());
      for (var _ = R; u--; ) {
        var Y = p.tags[u];
        if (Y.name !== _)
          C(p, "Unexpected close tag");
        else
          break;
      }
      if (u < 0) {
        C(p, "Unmatched closing tag: " + p.tagName), p.textNode += "</" + p.tagName + ">", p.state = y.TEXT;
        return;
      }
      p.tagName = R;
      for (var ee = p.tags.length; ee-- > u; ) {
        var ae = p.tag = p.tags.pop();
        p.tagName = p.tag.name, H(p, "onclosetag", p.tagName);
        var ge = {};
        for (var ve in ae.ns)
          ge[ve] = ae.ns[ve];
        var it = p.tags[p.tags.length - 1] || p;
        p.opt.xmlns && ae.ns !== it.ns && Object.keys(ae.ns).forEach(function(ue) {
          var Me = ae.ns[ue];
          H(p, "onclosenamespace", { prefix: ue, uri: Me });
        });
      }
      u === 0 && (p.closedRoot = !0), p.tagName = p.attribValue = p.attribName = "", p.attribList.length = 0, p.state = y.TEXT;
    }
    function X(p) {
      var u = p.entity, R = u.toLowerCase(), _, Y = "";
      return p.ENTITIES[u] ? p.ENTITIES[u] : p.ENTITIES[R] ? p.ENTITIES[R] : (u = R, u.charAt(0) === "#" && (u.charAt(1) === "x" ? (u = u.slice(2), _ = parseInt(u, 16), Y = _.toString(16)) : (u = u.slice(1), _ = parseInt(u, 10), Y = _.toString(10))), u = u.replace(/^0+/, ""), isNaN(_) || Y.toLowerCase() !== u || _ < 0 || _ > 1114111 ? (C(p, "Invalid character entity"), "&" + p.entity + ";") : String.fromCodePoint(_));
    }
    function de(p, u) {
      u === "<" ? (p.state = y.OPEN_WAKA, p.startTagPosition = p.position) : x(u) || (C(p, "Non-whitespace before first tag."), p.textNode = u, p.state = y.TEXT);
    }
    function M(p, u) {
      var R = "";
      return u < p.length && (R = p.charAt(u)), R;
    }
    function Xe(p) {
      var u = this;
      if (this.error)
        throw this.error;
      if (u.closed)
        return b(
          u,
          "Cannot write after close. Assign an onready handler."
        );
      if (p === null)
        return P(u);
      typeof p == "object" && (p = p.toString());
      for (var R = 0, _ = ""; _ = M(p, R++), u.c = _, !!_; )
        switch (u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++), u.state) {
          case y.BEGIN:
            if (u.state = y.BEGIN_WHITESPACE, _ === "\uFEFF")
              continue;
            de(u, _);
            continue;
          case y.BEGIN_WHITESPACE:
            de(u, _);
            continue;
          case y.TEXT:
            if (u.sawRoot && !u.closedRoot) {
              for (var ee = R - 1; _ && _ !== "<" && _ !== "&"; )
                _ = M(p, R++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
              u.textNode += p.substring(ee, R - 1);
            }
            _ === "<" && !(u.sawRoot && u.closedRoot && !u.strict) ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : (!x(_) && (!u.sawRoot || u.closedRoot) && C(u, "Text data outside of root node."), _ === "&" ? u.state = y.TEXT_ENTITY : u.textNode += _);
            continue;
          case y.SCRIPT:
            _ === "<" ? u.state = y.SCRIPT_ENDING : u.script += _;
            continue;
          case y.SCRIPT_ENDING:
            _ === "/" ? u.state = y.CLOSE_TAG : (u.script += "<" + _, u.state = y.SCRIPT);
            continue;
          case y.OPEN_WAKA:
            if (_ === "!")
              u.state = y.SGML_DECL, u.sgmlDecl = "";
            else if (!x(_)) if (V(T, _))
              u.state = y.OPEN_TAG, u.tagName = _;
            else if (_ === "/")
              u.state = y.CLOSE_TAG, u.tagName = "";
            else if (_ === "?")
              u.state = y.PROC_INST, u.procInstName = u.procInstBody = "";
            else {
              if (C(u, "Unencoded <"), u.startTagPosition + 1 < u.position) {
                var Y = u.position - u.startTagPosition;
                _ = new Array(Y).join(" ") + _;
              }
              u.textNode += "<" + _, u.state = y.TEXT;
            }
            continue;
          case y.SGML_DECL:
            if (u.sgmlDecl + _ === "--") {
              u.state = y.COMMENT, u.comment = "", u.sgmlDecl = "";
              continue;
            }
            u.doctype && u.doctype !== !0 && u.sgmlDecl ? (u.state = y.DOCTYPE_DTD, u.doctype += "<!" + u.sgmlDecl + _, u.sgmlDecl = "") : (u.sgmlDecl + _).toUpperCase() === f ? (H(u, "onopencdata"), u.state = y.CDATA, u.sgmlDecl = "", u.cdata = "") : (u.sgmlDecl + _).toUpperCase() === d ? (u.state = y.DOCTYPE, (u.doctype || u.sawRoot) && C(
              u,
              "Inappropriately located doctype declaration"
            ), u.doctype = "", u.sgmlDecl = "") : _ === ">" ? (H(u, "onsgmldeclaration", u.sgmlDecl), u.sgmlDecl = "", u.state = y.TEXT) : (J(_) && (u.state = y.SGML_DECL_QUOTED), u.sgmlDecl += _);
            continue;
          case y.SGML_DECL_QUOTED:
            _ === u.q && (u.state = y.SGML_DECL, u.q = ""), u.sgmlDecl += _;
            continue;
          case y.DOCTYPE:
            _ === ">" ? (u.state = y.TEXT, H(u, "ondoctype", u.doctype), u.doctype = !0) : (u.doctype += _, _ === "[" ? u.state = y.DOCTYPE_DTD : J(_) && (u.state = y.DOCTYPE_QUOTED, u.q = _));
            continue;
          case y.DOCTYPE_QUOTED:
            u.doctype += _, _ === u.q && (u.q = "", u.state = y.DOCTYPE);
            continue;
          case y.DOCTYPE_DTD:
            _ === "]" ? (u.doctype += _, u.state = y.DOCTYPE) : _ === "<" ? (u.state = y.OPEN_WAKA, u.startTagPosition = u.position) : J(_) ? (u.doctype += _, u.state = y.DOCTYPE_DTD_QUOTED, u.q = _) : u.doctype += _;
            continue;
          case y.DOCTYPE_DTD_QUOTED:
            u.doctype += _, _ === u.q && (u.state = y.DOCTYPE_DTD, u.q = "");
            continue;
          case y.COMMENT:
            _ === "-" ? u.state = y.COMMENT_ENDING : u.comment += _;
            continue;
          case y.COMMENT_ENDING:
            _ === "-" ? (u.state = y.COMMENT_ENDED, u.comment = O(u.opt, u.comment), u.comment && H(u, "oncomment", u.comment), u.comment = "") : (u.comment += "-" + _, u.state = y.COMMENT);
            continue;
          case y.COMMENT_ENDED:
            _ !== ">" ? (C(u, "Malformed comment"), u.comment += "--" + _, u.state = y.COMMENT) : u.doctype && u.doctype !== !0 ? u.state = y.DOCTYPE_DTD : u.state = y.TEXT;
            continue;
          case y.CDATA:
            for (var ee = R - 1; _ && _ !== "]"; )
              _ = M(p, R++), _ && u.trackPosition && (u.position++, _ === `
` ? (u.line++, u.column = 0) : u.column++);
            u.cdata += p.substring(ee, R - 1), _ === "]" && (u.state = y.CDATA_ENDING);
            continue;
          case y.CDATA_ENDING:
            _ === "]" ? u.state = y.CDATA_ENDING_2 : (u.cdata += "]" + _, u.state = y.CDATA);
            continue;
          case y.CDATA_ENDING_2:
            _ === ">" ? (u.cdata && H(u, "oncdata", u.cdata), H(u, "onclosecdata"), u.cdata = "", u.state = y.TEXT) : _ === "]" ? u.cdata += "]" : (u.cdata += "]]" + _, u.state = y.CDATA);
            continue;
          case y.PROC_INST:
            _ === "?" ? u.state = y.PROC_INST_ENDING : x(_) ? u.state = y.PROC_INST_BODY : u.procInstName += _;
            continue;
          case y.PROC_INST_BODY:
            if (!u.procInstBody && x(_))
              continue;
            _ === "?" ? u.state = y.PROC_INST_ENDING : u.procInstBody += _;
            continue;
          case y.PROC_INST_ENDING:
            _ === ">" ? (H(u, "onprocessinginstruction", {
              name: u.procInstName,
              body: u.procInstBody
            }), u.procInstName = u.procInstBody = "", u.state = y.TEXT) : (u.procInstBody += "?" + _, u.state = y.PROC_INST_BODY);
            continue;
          case y.OPEN_TAG:
            V(A, _) ? u.tagName += _ : ($(u), _ === ">" ? B(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : (x(_) || C(u, "Invalid character in tag name"), u.state = y.ATTRIB));
            continue;
          case y.OPEN_TAG_SLASH:
            _ === ">" ? (B(u, !0), q(u)) : (C(
              u,
              "Forward-slash in opening tag not followed by >"
            ), u.state = y.ATTRIB);
            continue;
          case y.ATTRIB:
            if (x(_))
              continue;
            _ === ">" ? B(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(T, _) ? (u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME:
            _ === "=" ? u.state = y.ATTRIB_VALUE : _ === ">" ? (C(u, "Attribute without value"), u.attribValue = u.attribName, k(u), B(u)) : x(_) ? u.state = y.ATTRIB_NAME_SAW_WHITE : V(A, _) ? u.attribName += _ : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_NAME_SAW_WHITE:
            if (_ === "=")
              u.state = y.ATTRIB_VALUE;
            else {
              if (x(_))
                continue;
              C(u, "Attribute without value"), u.tag.attributes[u.attribName] = "", u.attribValue = "", H(u, "onattribute", {
                name: u.attribName,
                value: ""
              }), u.attribName = "", _ === ">" ? B(u) : V(T, _) ? (u.attribName = _, u.state = y.ATTRIB_NAME) : (C(u, "Invalid attribute name"), u.state = y.ATTRIB);
            }
            continue;
          case y.ATTRIB_VALUE:
            if (x(_))
              continue;
            J(_) ? (u.q = _, u.state = y.ATTRIB_VALUE_QUOTED) : (u.opt.unquotedAttributeValues || b(u, "Unquoted attribute value"), u.state = y.ATTRIB_VALUE_UNQUOTED, u.attribValue = _);
            continue;
          case y.ATTRIB_VALUE_QUOTED:
            if (_ !== u.q) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_Q : u.attribValue += _;
              continue;
            }
            k(u), u.q = "", u.state = y.ATTRIB_VALUE_CLOSED;
            continue;
          case y.ATTRIB_VALUE_CLOSED:
            x(_) ? u.state = y.ATTRIB : _ === ">" ? B(u) : _ === "/" ? u.state = y.OPEN_TAG_SLASH : V(T, _) ? (C(u, "No whitespace between attributes"), u.attribName = _, u.attribValue = "", u.state = y.ATTRIB_NAME) : C(u, "Invalid attribute name");
            continue;
          case y.ATTRIB_VALUE_UNQUOTED:
            if (!re(_)) {
              _ === "&" ? u.state = y.ATTRIB_VALUE_ENTITY_U : u.attribValue += _;
              continue;
            }
            k(u), _ === ">" ? B(u) : u.state = y.ATTRIB;
            continue;
          case y.CLOSE_TAG:
            if (u.tagName)
              _ === ">" ? q(u) : V(A, _) ? u.tagName += _ : u.script ? (u.script += "</" + u.tagName + _, u.tagName = "", u.state = y.SCRIPT) : (x(_) || C(u, "Invalid tagname in closing tag"), u.state = y.CLOSE_TAG_SAW_WHITE);
            else {
              if (x(_))
                continue;
              me(T, _) ? u.script ? (u.script += "</" + _, u.state = y.SCRIPT) : C(u, "Invalid tagname in closing tag.") : u.tagName = _;
            }
            continue;
          case y.CLOSE_TAG_SAW_WHITE:
            if (x(_))
              continue;
            _ === ">" ? q(u) : C(u, "Invalid characters in closing tag");
            continue;
          case y.TEXT_ENTITY:
          case y.ATTRIB_VALUE_ENTITY_Q:
          case y.ATTRIB_VALUE_ENTITY_U:
            var ae, ge;
            switch (u.state) {
              case y.TEXT_ENTITY:
                ae = y.TEXT, ge = "textNode";
                break;
              case y.ATTRIB_VALUE_ENTITY_Q:
                ae = y.ATTRIB_VALUE_QUOTED, ge = "attribValue";
                break;
              case y.ATTRIB_VALUE_ENTITY_U:
                ae = y.ATTRIB_VALUE_UNQUOTED, ge = "attribValue";
                break;
            }
            if (_ === ";") {
              var ve = X(u);
              u.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? (u.entity = "", u.state = ae, u.write(ve)) : (u[ge] += ve, u.entity = "", u.state = ae);
            } else V(u.entity.length ? F : S, _) ? u.entity += _ : (C(u, "Invalid character in entity name"), u[ge] += "&" + u.entity + _, u.entity = "", u.state = ae);
            continue;
          default:
            throw new Error(u, "Unknown state: " + u.state);
        }
      return u.position >= u.bufferCheckPosition && i(u), u;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var p = String.fromCharCode, u = Math.floor, R = function() {
        var _ = 16384, Y = [], ee, ae, ge = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var it = ""; ++ge < ve; ) {
          var ue = Number(arguments[ge]);
          if (!isFinite(ue) || // `NaN`, `+Infinity`, or `-Infinity`
          ue < 0 || // not a valid Unicode code point
          ue > 1114111 || // not a valid Unicode code point
          u(ue) !== ue)
            throw RangeError("Invalid code point: " + ue);
          ue <= 65535 ? Y.push(ue) : (ue -= 65536, ee = (ue >> 10) + 55296, ae = ue % 1024 + 56320, Y.push(ee, ae)), (ge + 1 === ve || Y.length > _) && (it += p.apply(null, Y), Y.length = 0);
        }
        return it;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: R,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = R;
    }();
  })(e);
})(jc);
Object.defineProperty(tn, "__esModule", { value: !0 });
tn.XElement = void 0;
tn.parseXml = Pm;
const Rm = jc, Cn = pr;
class qc {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Cn.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!Nm(t))
      throw (0, Cn.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const r = this.attributes === null ? null : this.attributes[t];
    if (r == null)
      throw (0, Cn.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return r;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, r = !1, n = null) {
    const i = this.elementOrNull(t, r);
    if (i === null)
      throw (0, Cn.newError)(n || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, r = !1) {
    if (this.elements === null)
      return null;
    for (const n of this.elements)
      if (hs(n, t, r))
        return n;
    return null;
  }
  getElements(t, r = !1) {
    return this.elements === null ? [] : this.elements.filter((n) => hs(n, t, r));
  }
  elementValueOrEmpty(t, r = !1) {
    const n = this.elementOrNull(t, r);
    return n === null ? "" : n.value;
  }
}
tn.XElement = qc;
const Im = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function Nm(e) {
  return Im.test(e);
}
function hs(e, t, r) {
  const n = e.name;
  return n === t || r === !0 && n.length === t.length && n.toLowerCase() === t.toLowerCase();
}
function Pm(e) {
  let t = null;
  const r = Rm.parser(!0, {}), n = [];
  return r.onopentag = (i) => {
    const o = new qc(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const a = n[n.length - 1];
      a.elements == null && (a.elements = []), a.elements.push(o);
    }
    n.push(o);
  }, r.onclosetag = () => {
    n.pop();
  }, r.ontext = (i) => {
    n.length > 0 && (n[n.length - 1].value = i);
  }, r.oncdata = (i) => {
    const o = n[n.length - 1];
    o.value = i, o.isCData = !0;
  }, r.onerror = (i) => {
    throw i;
  }, r.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = gt;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var r = pr;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return r.newError;
  } });
  var n = Oe;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return n.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return n.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return n.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return n.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return n.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return n.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return n.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return n.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return n.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return n.safeStringifyJson;
  } });
  var i = ai;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Zr;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var a = en;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return a.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return a.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return a.githubTagPrefix;
  } });
  var s = Vo;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return s.retry;
  } });
  var l = zo;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return l.parseDn;
  } });
  var h = ur;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return h.UUID;
  } });
  var c = tn;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return c.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return c.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(d) {
    return d == null ? [] : Array.isArray(d) ? d : [d];
  }
})(fe);
var we = {}, Yo = {}, We = {};
function Gc(e) {
  return typeof e > "u" || e === null;
}
function Dm(e) {
  return typeof e == "object" && e !== null;
}
function $m(e) {
  return Array.isArray(e) ? e : Gc(e) ? [] : [e];
}
function Fm(e, t) {
  var r, n, i, o;
  if (t)
    for (o = Object.keys(t), r = 0, n = o.length; r < n; r += 1)
      i = o[r], e[i] = t[i];
  return e;
}
function xm(e, t) {
  var r = "", n;
  for (n = 0; n < t; n += 1)
    r += e;
  return r;
}
function Lm(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
We.isNothing = Gc;
We.isObject = Dm;
We.toArray = $m;
We.repeat = xm;
We.isNegativeZero = Lm;
We.extend = Fm;
function Wc(e, t) {
  var r = "", n = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (r += 'in "' + e.mark.name + '" '), r += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (r += `

` + e.mark.snippet), n + " " + r) : n;
}
function Mr(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Wc(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Mr.prototype = Object.create(Error.prototype);
Mr.prototype.constructor = Mr;
Mr.prototype.toString = function(t) {
  return this.name + ": " + Wc(this, t);
};
var rn = Mr, Or = We;
function Bi(e, t, r, n, i) {
  var o = "", a = "", s = Math.floor(i / 2) - 1;
  return n - t > s && (o = " ... ", t = n - s + o.length), r - n > s && (a = " ...", r = n + s - a.length), {
    str: o + e.slice(t, r).replace(/\t/g, "→") + a,
    pos: n - t + o.length
    // relative position
  };
}
function Hi(e, t) {
  return Or.repeat(" ", t - e.length) + e;
}
function Um(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var r = /\r?\n|\r|\0/g, n = [0], i = [], o, a = -1; o = r.exec(e.buffer); )
    i.push(o.index), n.push(o.index + o[0].length), e.position <= o.index && a < 0 && (a = n.length - 2);
  a < 0 && (a = n.length - 1);
  var s = "", l, h, c = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + c + 3);
  for (l = 1; l <= t.linesBefore && !(a - l < 0); l++)
    h = Bi(
      e.buffer,
      n[a - l],
      i[a - l],
      e.position - (n[a] - n[a - l]),
      f
    ), s = Or.repeat(" ", t.indent) + Hi((e.line - l + 1).toString(), c) + " | " + h.str + `
` + s;
  for (h = Bi(e.buffer, n[a], i[a], e.position, f), s += Or.repeat(" ", t.indent) + Hi((e.line + 1).toString(), c) + " | " + h.str + `
`, s += Or.repeat("-", t.indent + c + 3 + h.pos) + `^
`, l = 1; l <= t.linesAfter && !(a + l >= i.length); l++)
    h = Bi(
      e.buffer,
      n[a + l],
      i[a + l],
      e.position - (n[a] - n[a + l]),
      f
    ), s += Or.repeat(" ", t.indent) + Hi((e.line + l + 1).toString(), c) + " | " + h.str + `
`;
  return s.replace(/\n$/, "");
}
var km = Um, ps = rn, Mm = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], Bm = [
  "scalar",
  "sequence",
  "mapping"
];
function Hm(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(r) {
    e[r].forEach(function(n) {
      t[String(n)] = r;
    });
  }), t;
}
function jm(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(r) {
    if (Mm.indexOf(r) === -1)
      throw new ps('Unknown option "' + r + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(r) {
    return r;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = Hm(t.styleAliases || null), Bm.indexOf(this.kind) === -1)
    throw new ps('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Pe = jm, Ar = rn, ji = Pe;
function ms(e, t) {
  var r = [];
  return e[t].forEach(function(n) {
    var i = r.length;
    r.forEach(function(o, a) {
      o.tag === n.tag && o.kind === n.kind && o.multi === n.multi && (i = a);
    }), r[i] = n;
  }), r;
}
function qm() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, r;
  function n(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, r = arguments.length; t < r; t += 1)
    arguments[t].forEach(n);
  return e;
}
function To(e) {
  return this.extend(e);
}
To.prototype.extend = function(t) {
  var r = [], n = [];
  if (t instanceof ji)
    n.push(t);
  else if (Array.isArray(t))
    n = n.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (r = r.concat(t.implicit)), t.explicit && (n = n.concat(t.explicit));
  else
    throw new Ar("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  r.forEach(function(o) {
    if (!(o instanceof ji))
      throw new Ar("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Ar("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Ar("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), n.forEach(function(o) {
    if (!(o instanceof ji))
      throw new Ar("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(To.prototype);
  return i.implicit = (this.implicit || []).concat(r), i.explicit = (this.explicit || []).concat(n), i.compiledImplicit = ms(i, "implicit"), i.compiledExplicit = ms(i, "explicit"), i.compiledTypeMap = qm(i.compiledImplicit, i.compiledExplicit), i;
};
var Vc = To, Gm = Pe, zc = new Gm("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), Wm = Pe, Yc = new Wm("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), Vm = Pe, Xc = new Vm("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), zm = Vc, Kc = new zm({
  explicit: [
    zc,
    Yc,
    Xc
  ]
}), Ym = Pe;
function Xm(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Km() {
  return null;
}
function Jm(e) {
  return e === null;
}
var Jc = new Ym("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: Xm,
  construct: Km,
  predicate: Jm,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), Qm = Pe;
function Zm(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function eg(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function tg(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Qc = new Qm("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: Zm,
  construct: eg,
  predicate: tg,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), rg = We, ng = Pe;
function ig(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function og(e) {
  return 48 <= e && e <= 55;
}
function ag(e) {
  return 48 <= e && e <= 57;
}
function sg(e) {
  if (e === null) return !1;
  var t = e.length, r = 0, n = !1, i;
  if (!t) return !1;
  if (i = e[r], (i === "-" || i === "+") && (i = e[++r]), i === "0") {
    if (r + 1 === t) return !0;
    if (i = e[++r], i === "b") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "x") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!ig(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
    if (i === "o") {
      for (r++; r < t; r++)
        if (i = e[r], i !== "_") {
          if (!og(e.charCodeAt(r))) return !1;
          n = !0;
        }
      return n && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; r < t; r++)
    if (i = e[r], i !== "_") {
      if (!ag(e.charCodeAt(r)))
        return !1;
      n = !0;
    }
  return !(!n || i === "_");
}
function lg(e) {
  var t = e, r = 1, n;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), n = t[0], (n === "-" || n === "+") && (n === "-" && (r = -1), t = t.slice(1), n = t[0]), t === "0") return 0;
  if (n === "0") {
    if (t[1] === "b") return r * parseInt(t.slice(2), 2);
    if (t[1] === "x") return r * parseInt(t.slice(2), 16);
    if (t[1] === "o") return r * parseInt(t.slice(2), 8);
  }
  return r * parseInt(t, 10);
}
function cg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !rg.isNegativeZero(e);
}
var Zc = new ng("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: sg,
  construct: lg,
  predicate: cg,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), eu = We, ug = Pe, fg = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function dg(e) {
  return !(e === null || !fg.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function hg(e) {
  var t, r;
  return t = e.replace(/_/g, "").toLowerCase(), r = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? r === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : r * parseFloat(t, 10);
}
var pg = /^[-+]?[0-9]+e/;
function mg(e, t) {
  var r;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (eu.isNegativeZero(e))
    return "-0.0";
  return r = e.toString(10), pg.test(r) ? r.replace("e", ".e") : r;
}
function gg(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || eu.isNegativeZero(e));
}
var tu = new ug("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: dg,
  construct: hg,
  predicate: gg,
  represent: mg,
  defaultStyle: "lowercase"
}), ru = Kc.extend({
  implicit: [
    Jc,
    Qc,
    Zc,
    tu
  ]
}), nu = ru, Eg = Pe, iu = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ou = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function yg(e) {
  return e === null ? !1 : iu.exec(e) !== null || ou.exec(e) !== null;
}
function wg(e) {
  var t, r, n, i, o, a, s, l = 0, h = null, c, f, d;
  if (t = iu.exec(e), t === null && (t = ou.exec(e)), t === null) throw new Error("Date resolve error");
  if (r = +t[1], n = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(r, n, i));
  if (o = +t[4], a = +t[5], s = +t[6], t[7]) {
    for (l = t[7].slice(0, 3); l.length < 3; )
      l += "0";
    l = +l;
  }
  return t[9] && (c = +t[10], f = +(t[11] || 0), h = (c * 60 + f) * 6e4, t[9] === "-" && (h = -h)), d = new Date(Date.UTC(r, n, i, o, a, s, l)), h && d.setTime(d.getTime() - h), d;
}
function vg(e) {
  return e.toISOString();
}
var au = new Eg("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: yg,
  construct: wg,
  instanceOf: Date,
  represent: vg
}), _g = Pe;
function Tg(e) {
  return e === "<<" || e === null;
}
var su = new _g("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: Tg
}), Ag = Pe, Xo = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function Sg(e) {
  if (e === null) return !1;
  var t, r, n = 0, i = e.length, o = Xo;
  for (r = 0; r < i; r++)
    if (t = o.indexOf(e.charAt(r)), !(t > 64)) {
      if (t < 0) return !1;
      n += 6;
    }
  return n % 8 === 0;
}
function Cg(e) {
  var t, r, n = e.replace(/[\r\n=]/g, ""), i = n.length, o = Xo, a = 0, s = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)), a = a << 6 | o.indexOf(n.charAt(t));
  return r = i % 4 * 6, r === 0 ? (s.push(a >> 16 & 255), s.push(a >> 8 & 255), s.push(a & 255)) : r === 18 ? (s.push(a >> 10 & 255), s.push(a >> 2 & 255)) : r === 12 && s.push(a >> 4 & 255), new Uint8Array(s);
}
function bg(e) {
  var t = "", r = 0, n, i, o = e.length, a = Xo;
  for (n = 0; n < o; n++)
    n % 3 === 0 && n && (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]), r = (r << 8) + e[n];
  return i = o % 3, i === 0 ? (t += a[r >> 18 & 63], t += a[r >> 12 & 63], t += a[r >> 6 & 63], t += a[r & 63]) : i === 2 ? (t += a[r >> 10 & 63], t += a[r >> 4 & 63], t += a[r << 2 & 63], t += a[64]) : i === 1 && (t += a[r >> 2 & 63], t += a[r << 4 & 63], t += a[64], t += a[64]), t;
}
function Og(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var lu = new Ag("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: Sg,
  construct: Cg,
  predicate: Og,
  represent: bg
}), Rg = Pe, Ig = Object.prototype.hasOwnProperty, Ng = Object.prototype.toString;
function Pg(e) {
  if (e === null) return !0;
  var t = [], r, n, i, o, a, s = e;
  for (r = 0, n = s.length; r < n; r += 1) {
    if (i = s[r], a = !1, Ng.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (Ig.call(i, o))
        if (!a) a = !0;
        else return !1;
    if (!a) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function Dg(e) {
  return e !== null ? e : [];
}
var cu = new Rg("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: Pg,
  construct: Dg
}), $g = Pe, Fg = Object.prototype.toString;
function xg(e) {
  if (e === null) return !0;
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1) {
    if (n = a[t], Fg.call(n) !== "[object Object]" || (i = Object.keys(n), i.length !== 1)) return !1;
    o[t] = [i[0], n[i[0]]];
  }
  return !0;
}
function Lg(e) {
  if (e === null) return [];
  var t, r, n, i, o, a = e;
  for (o = new Array(a.length), t = 0, r = a.length; t < r; t += 1)
    n = a[t], i = Object.keys(n), o[t] = [i[0], n[i[0]]];
  return o;
}
var uu = new $g("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: xg,
  construct: Lg
}), Ug = Pe, kg = Object.prototype.hasOwnProperty;
function Mg(e) {
  if (e === null) return !0;
  var t, r = e;
  for (t in r)
    if (kg.call(r, t) && r[t] !== null)
      return !1;
  return !0;
}
function Bg(e) {
  return e !== null ? e : {};
}
var fu = new Ug("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: Mg,
  construct: Bg
}), Ko = nu.extend({
  implicit: [
    au,
    su
  ],
  explicit: [
    lu,
    cu,
    uu,
    fu
  ]
}), $t = We, du = rn, Hg = km, jg = Ko, Et = Object.prototype.hasOwnProperty, Vn = 1, hu = 2, pu = 3, zn = 4, qi = 1, qg = 2, gs = 3, Gg = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Wg = /[\x85\u2028\u2029]/, Vg = /[,\[\]\{\}]/, mu = /^(?:!|!!|![a-z\-]+!)$/i, gu = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Es(e) {
  return Object.prototype.toString.call(e);
}
function Qe(e) {
  return e === 10 || e === 13;
}
function Ut(e) {
  return e === 9 || e === 32;
}
function xe(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function Zt(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function zg(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Yg(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Xg(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function ys(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Kg(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Eu(e, t, r) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: r
  }) : e[t] = r;
}
var yu = new Array(256), wu = new Array(256);
for (var zt = 0; zt < 256; zt++)
  yu[zt] = ys(zt) ? 1 : 0, wu[zt] = ys(zt);
function Jg(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || jg, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function vu(e, t) {
  var r = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return r.snippet = Hg(r), new du(t, r);
}
function U(e, t) {
  throw vu(e, t);
}
function Yn(e, t) {
  e.onWarning && e.onWarning.call(null, vu(e, t));
}
var ws = {
  YAML: function(t, r, n) {
    var i, o, a;
    t.version !== null && U(t, "duplication of %YAML directive"), n.length !== 1 && U(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), i === null && U(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), a = parseInt(i[2], 10), o !== 1 && U(t, "unacceptable YAML version of the document"), t.version = n[0], t.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Yn(t, "unsupported YAML version of the document");
  },
  TAG: function(t, r, n) {
    var i, o;
    n.length !== 2 && U(t, "TAG directive accepts exactly two arguments"), i = n[0], o = n[1], mu.test(i) || U(t, "ill-formed tag handle (first argument) of the TAG directive"), Et.call(t.tagMap, i) && U(t, 'there is a previously declared suffix for "' + i + '" tag handle'), gu.test(o) || U(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      U(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function pt(e, t, r, n) {
  var i, o, a, s;
  if (t < r) {
    if (s = e.input.slice(t, r), n)
      for (i = 0, o = s.length; i < o; i += 1)
        a = s.charCodeAt(i), a === 9 || 32 <= a && a <= 1114111 || U(e, "expected valid JSON character");
    else Gg.test(s) && U(e, "the stream contains non-printable characters");
    e.result += s;
  }
}
function vs(e, t, r, n) {
  var i, o, a, s;
  for ($t.isObject(r) || U(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(r), a = 0, s = i.length; a < s; a += 1)
    o = i[a], Et.call(t, o) || (Eu(t, o, r[o]), n[o] = !0);
}
function er(e, t, r, n, i, o, a, s, l) {
  var h, c;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), h = 0, c = i.length; h < c; h += 1)
      Array.isArray(i[h]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && Es(i[h]) === "[object Object]" && (i[h] = "[object Object]");
  if (typeof i == "object" && Es(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), n === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (h = 0, c = o.length; h < c; h += 1)
        vs(e, t, o[h], r);
    else
      vs(e, t, o, r);
  else
    !e.json && !Et.call(r, i) && Et.call(t, i) && (e.line = a || e.line, e.lineStart = s || e.lineStart, e.position = l || e.position, U(e, "duplicated mapping key")), Eu(t, i, o), delete r[i];
  return t;
}
function Jo(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : U(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function le(e, t, r) {
  for (var n = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Ut(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (Qe(i))
      for (Jo(e), i = e.input.charCodeAt(e.position), n++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return r !== -1 && n !== 0 && e.lineIndent < r && Yn(e, "deficient indentation"), n;
}
function si(e) {
  var t = e.position, r;
  return r = e.input.charCodeAt(t), !!((r === 45 || r === 46) && r === e.input.charCodeAt(t + 1) && r === e.input.charCodeAt(t + 2) && (t += 3, r = e.input.charCodeAt(t), r === 0 || xe(r)));
}
function Qo(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += $t.repeat(`
`, t - 1));
}
function Qg(e, t, r) {
  var n, i, o, a, s, l, h, c, f = e.kind, d = e.result, m;
  if (m = e.input.charCodeAt(e.position), xe(m) || Zt(m) || m === 35 || m === 38 || m === 42 || m === 33 || m === 124 || m === 62 || m === 39 || m === 34 || m === 37 || m === 64 || m === 96 || (m === 63 || m === 45) && (i = e.input.charCodeAt(e.position + 1), xe(i) || r && Zt(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = a = e.position, s = !1; m !== 0; ) {
    if (m === 58) {
      if (i = e.input.charCodeAt(e.position + 1), xe(i) || r && Zt(i))
        break;
    } else if (m === 35) {
      if (n = e.input.charCodeAt(e.position - 1), xe(n))
        break;
    } else {
      if (e.position === e.lineStart && si(e) || r && Zt(m))
        break;
      if (Qe(m))
        if (l = e.line, h = e.lineStart, c = e.lineIndent, le(e, !1, -1), e.lineIndent >= t) {
          s = !0, m = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = a, e.line = l, e.lineStart = h, e.lineIndent = c;
          break;
        }
    }
    s && (pt(e, o, a, !1), Qo(e, e.line - l), o = a = e.position, s = !1), Ut(m) || (a = e.position + 1), m = e.input.charCodeAt(++e.position);
  }
  return pt(e, o, a, !1), e.result ? !0 : (e.kind = f, e.result = d, !1);
}
function Zg(e, t) {
  var r, n, i;
  if (r = e.input.charCodeAt(e.position), r !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = i = e.position; (r = e.input.charCodeAt(e.position)) !== 0; )
    if (r === 39)
      if (pt(e, n, e.position, !0), r = e.input.charCodeAt(++e.position), r === 39)
        n = e.position, e.position++, i = e.position;
      else
        return !0;
    else Qe(r) ? (pt(e, n, i, !0), Qo(e, le(e, !1, t)), n = i = e.position) : e.position === e.lineStart && si(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  U(e, "unexpected end of the stream within a single quoted scalar");
}
function e0(e, t) {
  var r, n, i, o, a, s;
  if (s = e.input.charCodeAt(e.position), s !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = n = e.position; (s = e.input.charCodeAt(e.position)) !== 0; ) {
    if (s === 34)
      return pt(e, r, e.position, !0), e.position++, !0;
    if (s === 92) {
      if (pt(e, r, e.position, !0), s = e.input.charCodeAt(++e.position), Qe(s))
        le(e, !1, t);
      else if (s < 256 && yu[s])
        e.result += wu[s], e.position++;
      else if ((a = Yg(s)) > 0) {
        for (i = a, o = 0; i > 0; i--)
          s = e.input.charCodeAt(++e.position), (a = zg(s)) >= 0 ? o = (o << 4) + a : U(e, "expected hexadecimal character");
        e.result += Kg(o), e.position++;
      } else
        U(e, "unknown escape sequence");
      r = n = e.position;
    } else Qe(s) ? (pt(e, r, n, !0), Qo(e, le(e, !1, t)), r = n = e.position) : e.position === e.lineStart && si(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, n = e.position);
  }
  U(e, "unexpected end of the stream within a double quoted scalar");
}
function t0(e, t) {
  var r = !0, n, i, o, a = e.tag, s, l = e.anchor, h, c, f, d, m, w = /* @__PURE__ */ Object.create(null), E, T, A, S;
  if (S = e.input.charCodeAt(e.position), S === 91)
    c = 93, m = !1, s = [];
  else if (S === 123)
    c = 125, m = !0, s = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = s), S = e.input.charCodeAt(++e.position); S !== 0; ) {
    if (le(e, !0, t), S = e.input.charCodeAt(e.position), S === c)
      return e.position++, e.tag = a, e.anchor = l, e.kind = m ? "mapping" : "sequence", e.result = s, !0;
    r ? S === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), T = E = A = null, f = d = !1, S === 63 && (h = e.input.charCodeAt(e.position + 1), xe(h) && (f = d = !0, e.position++, le(e, !0, t))), n = e.line, i = e.lineStart, o = e.position, fr(e, t, Vn, !1, !0), T = e.tag, E = e.result, le(e, !0, t), S = e.input.charCodeAt(e.position), (d || e.line === n) && S === 58 && (f = !0, S = e.input.charCodeAt(++e.position), le(e, !0, t), fr(e, t, Vn, !1, !0), A = e.result), m ? er(e, s, w, T, E, A, n, i, o) : f ? s.push(er(e, null, w, T, E, A, n, i, o)) : s.push(E), le(e, !0, t), S = e.input.charCodeAt(e.position), S === 44 ? (r = !0, S = e.input.charCodeAt(++e.position)) : r = !1;
  }
  U(e, "unexpected end of the stream within a flow collection");
}
function r0(e, t) {
  var r, n, i = qi, o = !1, a = !1, s = t, l = 0, h = !1, c, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    n = !1;
  else if (f === 62)
    n = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      qi === i ? i = f === 43 ? gs : qg : U(e, "repeat of a chomping mode identifier");
    else if ((c = Xg(f)) >= 0)
      c === 0 ? U(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : a ? U(e, "repeat of an indentation width identifier") : (s = t + c - 1, a = !0);
    else
      break;
  if (Ut(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Ut(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!Qe(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Jo(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!a || e.lineIndent < s) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!a && e.lineIndent > s && (s = e.lineIndent), Qe(f)) {
      l++;
      continue;
    }
    if (e.lineIndent < s) {
      i === gs ? e.result += $t.repeat(`
`, o ? 1 + l : l) : i === qi && o && (e.result += `
`);
      break;
    }
    for (n ? Ut(f) ? (h = !0, e.result += $t.repeat(`
`, o ? 1 + l : l)) : h ? (h = !1, e.result += $t.repeat(`
`, l + 1)) : l === 0 ? o && (e.result += " ") : e.result += $t.repeat(`
`, l) : e.result += $t.repeat(`
`, o ? 1 + l : l), o = !0, a = !0, l = 0, r = e.position; !Qe(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    pt(e, r, e.position, !1);
  }
  return !0;
}
function _s(e, t) {
  var r, n = e.tag, i = e.anchor, o = [], a, s = !1, l;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), l = e.input.charCodeAt(e.position); l !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), !(l !== 45 || (a = e.input.charCodeAt(e.position + 1), !xe(a)))); ) {
    if (s = !0, e.position++, le(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), l = e.input.charCodeAt(e.position);
      continue;
    }
    if (r = e.line, fr(e, t, pu, !1, !0), o.push(e.result), le(e, !0, -1), l = e.input.charCodeAt(e.position), (e.line === r || e.lineIndent > t) && l !== 0)
      U(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return s ? (e.tag = n, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function n0(e, t, r) {
  var n, i, o, a, s, l, h = e.tag, c = e.anchor, f = {}, d = /* @__PURE__ */ Object.create(null), m = null, w = null, E = null, T = !1, A = !1, S;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), S = e.input.charCodeAt(e.position); S !== 0; ) {
    if (!T && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), n = e.input.charCodeAt(e.position + 1), o = e.line, (S === 63 || S === 58) && xe(n))
      S === 63 ? (T && (er(e, f, d, m, w, null, a, s, l), m = w = E = null), A = !0, T = !0, i = !0) : T ? (T = !1, i = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, S = n;
    else {
      if (a = e.line, s = e.lineStart, l = e.position, !fr(e, r, hu, !1, !0))
        break;
      if (e.line === o) {
        for (S = e.input.charCodeAt(e.position); Ut(S); )
          S = e.input.charCodeAt(++e.position);
        if (S === 58)
          S = e.input.charCodeAt(++e.position), xe(S) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), T && (er(e, f, d, m, w, null, a, s, l), m = w = E = null), A = !0, T = !1, i = !1, m = e.tag, w = e.result;
        else if (A)
          U(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = h, e.anchor = c, !0;
      } else if (A)
        U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = h, e.anchor = c, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (T && (a = e.line, s = e.lineStart, l = e.position), fr(e, t, zn, !0, i) && (T ? w = e.result : E = e.result), T || (er(e, f, d, m, w, E, a, s, l), m = w = E = null), le(e, !0, -1), S = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && S !== 0)
      U(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return T && er(e, f, d, m, w, null, a, s, l), A && (e.tag = h, e.anchor = c, e.kind = "mapping", e.result = f), A;
}
function i0(e) {
  var t, r = !1, n = !1, i, o, a;
  if (a = e.input.charCodeAt(e.position), a !== 33) return !1;
  if (e.tag !== null && U(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (r = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, i = "!!", a = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, r) {
    do
      a = e.input.charCodeAt(++e.position);
    while (a !== 0 && a !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), a = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; a !== 0 && !xe(a); )
      a === 33 && (n ? U(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), mu.test(i) || U(e, "named tag handle cannot contain such characters"), n = !0, t = e.position + 1)), a = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), Vg.test(o) && U(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !gu.test(o) && U(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    U(e, "tag name is malformed: " + o);
  }
  return r ? e.tag = o : Et.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : U(e, 'undeclared tag handle "' + i + '"'), !0;
}
function o0(e) {
  var t, r;
  if (r = e.input.charCodeAt(e.position), r !== 38) return !1;
  for (e.anchor !== null && U(e, "duplication of an anchor property"), r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !xe(r) && !Zt(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function a0(e) {
  var t, r, n;
  if (n = e.input.charCodeAt(e.position), n !== 42) return !1;
  for (n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !xe(n) && !Zt(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && U(e, "name of an alias node must contain at least one character"), r = e.input.slice(t, e.position), Et.call(e.anchorMap, r) || U(e, 'unidentified alias "' + r + '"'), e.result = e.anchorMap[r], le(e, !0, -1), !0;
}
function fr(e, t, r, n, i) {
  var o, a, s, l = 1, h = !1, c = !1, f, d, m, w, E, T;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = a = s = zn === r || pu === r, n && le(e, !0, -1) && (h = !0, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)), l === 1)
    for (; i0(e) || o0(e); )
      le(e, !0, -1) ? (h = !0, s = o, e.lineIndent > t ? l = 1 : e.lineIndent === t ? l = 0 : e.lineIndent < t && (l = -1)) : s = !1;
  if (s && (s = h || i), (l === 1 || zn === r) && (Vn === r || hu === r ? E = t : E = t + 1, T = e.position - e.lineStart, l === 1 ? s && (_s(e, T) || n0(e, T, E)) || t0(e, E) ? c = !0 : (a && r0(e, E) || Zg(e, E) || e0(e, E) ? c = !0 : a0(e) ? (c = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : Qg(e, E, Vn === r) && (c = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : l === 0 && (c = s && _s(e, T))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && U(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, d = e.implicitTypes.length; f < d; f += 1)
      if (w = e.implicitTypes[f], w.resolve(e.result)) {
        e.result = w.construct(e.result), e.tag = w.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (Et.call(e.typeMap[e.kind || "fallback"], e.tag))
      w = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (w = null, m = e.typeMap.multi[e.kind || "fallback"], f = 0, d = m.length; f < d; f += 1)
        if (e.tag.slice(0, m[f].tag.length) === m[f].tag) {
          w = m[f];
          break;
        }
    w || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && w.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + w.kind + '", not "' + e.kind + '"'), w.resolve(e.result, e.tag) ? (e.result = w.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || c;
}
function s0(e) {
  var t = e.position, r, n, i, o = !1, a;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (a = e.input.charCodeAt(e.position)) !== 0 && (le(e, !0, -1), a = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || a !== 37)); ) {
    for (o = !0, a = e.input.charCodeAt(++e.position), r = e.position; a !== 0 && !xe(a); )
      a = e.input.charCodeAt(++e.position);
    for (n = e.input.slice(r, e.position), i = [], n.length < 1 && U(e, "directive name must not be less than one character in length"); a !== 0; ) {
      for (; Ut(a); )
        a = e.input.charCodeAt(++e.position);
      if (a === 35) {
        do
          a = e.input.charCodeAt(++e.position);
        while (a !== 0 && !Qe(a));
        break;
      }
      if (Qe(a)) break;
      for (r = e.position; a !== 0 && !xe(a); )
        a = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(r, e.position));
    }
    a !== 0 && Jo(e), Et.call(ws, n) ? ws[n](e, n, i) : Yn(e, 'unknown document directive "' + n + '"');
  }
  if (le(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, le(e, !0, -1)) : o && U(e, "directives end mark is expected"), fr(e, e.lineIndent - 1, zn, !1, !0), le(e, !0, -1), e.checkLineBreaks && Wg.test(e.input.slice(t, e.position)) && Yn(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && si(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, le(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    U(e, "end of the stream or a document separator is expected");
  else
    return;
}
function _u(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var r = new Jg(e, t), n = e.indexOf("\0");
  for (n !== -1 && (r.position = n, U(r, "null byte is not allowed in input")), r.input += "\0"; r.input.charCodeAt(r.position) === 32; )
    r.lineIndent += 1, r.position += 1;
  for (; r.position < r.length - 1; )
    s0(r);
  return r.documents;
}
function l0(e, t, r) {
  t !== null && typeof t == "object" && typeof r > "u" && (r = t, t = null);
  var n = _u(e, r);
  if (typeof t != "function")
    return n;
  for (var i = 0, o = n.length; i < o; i += 1)
    t(n[i]);
}
function c0(e, t) {
  var r = _u(e, t);
  if (r.length !== 0) {
    if (r.length === 1)
      return r[0];
    throw new du("expected a single document in the stream, but found more");
  }
}
Yo.loadAll = l0;
Yo.load = c0;
var Tu = {}, li = We, nn = rn, u0 = Ko, Au = Object.prototype.toString, Su = Object.prototype.hasOwnProperty, Zo = 65279, f0 = 9, Br = 10, d0 = 13, h0 = 32, p0 = 33, m0 = 34, Ao = 35, g0 = 37, E0 = 38, y0 = 39, w0 = 42, Cu = 44, v0 = 45, Xn = 58, _0 = 61, T0 = 62, A0 = 63, S0 = 64, bu = 91, Ou = 93, C0 = 96, Ru = 123, b0 = 124, Iu = 125, Ae = {};
Ae[0] = "\\0";
Ae[7] = "\\a";
Ae[8] = "\\b";
Ae[9] = "\\t";
Ae[10] = "\\n";
Ae[11] = "\\v";
Ae[12] = "\\f";
Ae[13] = "\\r";
Ae[27] = "\\e";
Ae[34] = '\\"';
Ae[92] = "\\\\";
Ae[133] = "\\N";
Ae[160] = "\\_";
Ae[8232] = "\\L";
Ae[8233] = "\\P";
var O0 = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], R0 = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function I0(e, t) {
  var r, n, i, o, a, s, l;
  if (t === null) return {};
  for (r = {}, n = Object.keys(t), i = 0, o = n.length; i < o; i += 1)
    a = n[i], s = String(t[a]), a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2)), l = e.compiledTypeMap.fallback[a], l && Su.call(l.styleAliases, s) && (s = l.styleAliases[s]), r[a] = s;
  return r;
}
function N0(e) {
  var t, r, n;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    r = "x", n = 2;
  else if (e <= 65535)
    r = "u", n = 4;
  else if (e <= 4294967295)
    r = "U", n = 8;
  else
    throw new nn("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + r + li.repeat("0", n - t.length) + t;
}
var P0 = 1, Hr = 2;
function D0(e) {
  this.schema = e.schema || u0, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = li.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = I0(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Hr : P0, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ts(e, t) {
  for (var r = li.repeat(" ", t), n = 0, i = -1, o = "", a, s = e.length; n < s; )
    i = e.indexOf(`
`, n), i === -1 ? (a = e.slice(n), n = s) : (a = e.slice(n, i + 1), n = i + 1), a.length && a !== `
` && (o += r), o += a;
  return o;
}
function So(e, t) {
  return `
` + li.repeat(" ", e.indent * t);
}
function $0(e, t) {
  var r, n, i;
  for (r = 0, n = e.implicitTypes.length; r < n; r += 1)
    if (i = e.implicitTypes[r], i.resolve(t))
      return !0;
  return !1;
}
function Kn(e) {
  return e === h0 || e === f0;
}
function jr(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== Zo || 65536 <= e && e <= 1114111;
}
function As(e) {
  return jr(e) && e !== Zo && e !== d0 && e !== Br;
}
function Ss(e, t, r) {
  var n = As(e), i = n && !Kn(e);
  return (
    // ns-plain-safe
    (r ? (
      // c = flow-in
      n
    ) : n && e !== Cu && e !== bu && e !== Ou && e !== Ru && e !== Iu) && e !== Ao && !(t === Xn && !i) || As(t) && !Kn(t) && e === Ao || t === Xn && i
  );
}
function F0(e) {
  return jr(e) && e !== Zo && !Kn(e) && e !== v0 && e !== A0 && e !== Xn && e !== Cu && e !== bu && e !== Ou && e !== Ru && e !== Iu && e !== Ao && e !== E0 && e !== w0 && e !== p0 && e !== b0 && e !== _0 && e !== T0 && e !== y0 && e !== m0 && e !== g0 && e !== S0 && e !== C0;
}
function x0(e) {
  return !Kn(e) && e !== Xn;
}
function Rr(e, t) {
  var r = e.charCodeAt(t), n;
  return r >= 55296 && r <= 56319 && t + 1 < e.length && (n = e.charCodeAt(t + 1), n >= 56320 && n <= 57343) ? (r - 55296) * 1024 + n - 56320 + 65536 : r;
}
function Nu(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Pu = 1, Co = 2, Du = 3, $u = 4, Jt = 5;
function L0(e, t, r, n, i, o, a, s) {
  var l, h = 0, c = null, f = !1, d = !1, m = n !== -1, w = -1, E = F0(Rr(e, 0)) && x0(Rr(e, e.length - 1));
  if (t || a)
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Rr(e, l), !jr(h))
        return Jt;
      E = E && Ss(h, c, s), c = h;
    }
  else {
    for (l = 0; l < e.length; h >= 65536 ? l += 2 : l++) {
      if (h = Rr(e, l), h === Br)
        f = !0, m && (d = d || // Foldable line = too long, and not more-indented.
        l - w - 1 > n && e[w + 1] !== " ", w = l);
      else if (!jr(h))
        return Jt;
      E = E && Ss(h, c, s), c = h;
    }
    d = d || m && l - w - 1 > n && e[w + 1] !== " ";
  }
  return !f && !d ? E && !a && !i(e) ? Pu : o === Hr ? Jt : Co : r > 9 && Nu(e) ? Jt : a ? o === Hr ? Jt : Co : d ? $u : Du;
}
function U0(e, t, r, n, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Hr ? '""' : "''";
    if (!e.noCompatMode && (O0.indexOf(t) !== -1 || R0.test(t)))
      return e.quotingType === Hr ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, r), a = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), s = n || e.flowLevel > -1 && r >= e.flowLevel;
    function l(h) {
      return $0(e, h);
    }
    switch (L0(
      t,
      s,
      e.indent,
      a,
      l,
      e.quotingType,
      e.forceQuotes && !n,
      i
    )) {
      case Pu:
        return t;
      case Co:
        return "'" + t.replace(/'/g, "''") + "'";
      case Du:
        return "|" + Cs(t, e.indent) + bs(Ts(t, o));
      case $u:
        return ">" + Cs(t, e.indent) + bs(Ts(k0(t, a), o));
      case Jt:
        return '"' + M0(t) + '"';
      default:
        throw new nn("impossible error: invalid scalar style");
    }
  }();
}
function Cs(e, t) {
  var r = Nu(e) ? String(t) : "", n = e[e.length - 1] === `
`, i = n && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : n ? "" : "-";
  return r + o + `
`;
}
function bs(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function k0(e, t) {
  for (var r = /(\n+)([^\n]*)/g, n = function() {
    var h = e.indexOf(`
`);
    return h = h !== -1 ? h : e.length, r.lastIndex = h, Os(e.slice(0, h), t);
  }(), i = e[0] === `
` || e[0] === " ", o, a; a = r.exec(e); ) {
    var s = a[1], l = a[2];
    o = l[0] === " ", n += s + (!i && !o && l !== "" ? `
` : "") + Os(l, t), i = o;
  }
  return n;
}
function Os(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var r = / [^ ]/g, n, i = 0, o, a = 0, s = 0, l = ""; n = r.exec(e); )
    s = n.index, s - i > t && (o = a > i ? a : s, l += `
` + e.slice(i, o), i = o + 1), a = s;
  return l += `
`, e.length - i > t && a > i ? l += e.slice(i, a) + `
` + e.slice(a + 1) : l += e.slice(i), l.slice(1);
}
function M0(e) {
  for (var t = "", r = 0, n, i = 0; i < e.length; r >= 65536 ? i += 2 : i++)
    r = Rr(e, i), n = Ae[r], !n && jr(r) ? (t += e[i], r >= 65536 && (t += e[i + 1])) : t += n || N0(r);
  return t;
}
function B0(e, t, r) {
  var n = "", i = e.tag, o, a, s;
  for (o = 0, a = r.length; o < a; o += 1)
    s = r[o], e.replacer && (s = e.replacer.call(r, String(o), s)), (nt(e, t, s, !1, !1) || typeof s > "u" && nt(e, t, null, !1, !1)) && (n !== "" && (n += "," + (e.condenseFlow ? "" : " ")), n += e.dump);
  e.tag = i, e.dump = "[" + n + "]";
}
function Rs(e, t, r, n) {
  var i = "", o = e.tag, a, s, l;
  for (a = 0, s = r.length; a < s; a += 1)
    l = r[a], e.replacer && (l = e.replacer.call(r, String(a), l)), (nt(e, t + 1, l, !0, !0, !1, !0) || typeof l > "u" && nt(e, t + 1, null, !0, !0, !1, !0)) && ((!n || i !== "") && (i += So(e, t)), e.dump && Br === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function H0(e, t, r) {
  var n = "", i = e.tag, o = Object.keys(r), a, s, l, h, c;
  for (a = 0, s = o.length; a < s; a += 1)
    c = "", n !== "" && (c += ", "), e.condenseFlow && (c += '"'), l = o[a], h = r[l], e.replacer && (h = e.replacer.call(r, l, h)), nt(e, t, l, !1, !1) && (e.dump.length > 1024 && (c += "? "), c += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), nt(e, t, h, !1, !1) && (c += e.dump, n += c));
  e.tag = i, e.dump = "{" + n + "}";
}
function j0(e, t, r, n) {
  var i = "", o = e.tag, a = Object.keys(r), s, l, h, c, f, d;
  if (e.sortKeys === !0)
    a.sort();
  else if (typeof e.sortKeys == "function")
    a.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new nn("sortKeys must be a boolean or a function");
  for (s = 0, l = a.length; s < l; s += 1)
    d = "", (!n || i !== "") && (d += So(e, t)), h = a[s], c = r[h], e.replacer && (c = e.replacer.call(r, h, c)), nt(e, t + 1, h, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Br === e.dump.charCodeAt(0) ? d += "?" : d += "? "), d += e.dump, f && (d += So(e, t)), nt(e, t + 1, c, !0, f) && (e.dump && Br === e.dump.charCodeAt(0) ? d += ":" : d += ": ", d += e.dump, i += d));
  e.tag = o, e.dump = i || "{}";
}
function Is(e, t, r) {
  var n, i, o, a, s, l;
  for (i = r ? e.explicitTypes : e.implicitTypes, o = 0, a = i.length; o < a; o += 1)
    if (s = i[o], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
      if (r ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
        if (l = e.styleMap[s.tag] || s.defaultStyle, Au.call(s.represent) === "[object Function]")
          n = s.represent(t, l);
        else if (Su.call(s.represent, l))
          n = s.represent[l](t, l);
        else
          throw new nn("!<" + s.tag + '> tag resolver accepts not "' + l + '" style');
        e.dump = n;
      }
      return !0;
    }
  return !1;
}
function nt(e, t, r, n, i, o, a) {
  e.tag = null, e.dump = r, Is(e, r, !1) || Is(e, r, !0);
  var s = Au.call(e.dump), l = n, h;
  n && (n = e.flowLevel < 0 || e.flowLevel > t);
  var c = s === "[object Object]" || s === "[object Array]", f, d;
  if (c && (f = e.duplicates.indexOf(r), d = f !== -1), (e.tag !== null && e.tag !== "?" || d || e.indent !== 2 && t > 0) && (i = !1), d && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (c && d && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), s === "[object Object]")
      n && Object.keys(e.dump).length !== 0 ? (j0(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (H0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object Array]")
      n && e.dump.length !== 0 ? (e.noArrayIndent && !a && t > 0 ? Rs(e, t - 1, e.dump, i) : Rs(e, t, e.dump, i), d && (e.dump = "&ref_" + f + e.dump)) : (B0(e, t, e.dump), d && (e.dump = "&ref_" + f + " " + e.dump));
    else if (s === "[object String]")
      e.tag !== "?" && U0(e, e.dump, t, o, l);
    else {
      if (s === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new nn("unacceptable kind of an object to dump " + s);
    }
    e.tag !== null && e.tag !== "?" && (h = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? h = "!" + h : h.slice(0, 18) === "tag:yaml.org,2002:" ? h = "!!" + h.slice(18) : h = "!<" + h + ">", e.dump = h + " " + e.dump);
  }
  return !0;
}
function q0(e, t) {
  var r = [], n = [], i, o;
  for (bo(e, r, n), i = 0, o = n.length; i < o; i += 1)
    t.duplicates.push(r[n[i]]);
  t.usedDuplicates = new Array(o);
}
function bo(e, t, r) {
  var n, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      r.indexOf(i) === -1 && r.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        bo(e[i], t, r);
    else
      for (n = Object.keys(e), i = 0, o = n.length; i < o; i += 1)
        bo(e[n[i]], t, r);
}
function G0(e, t) {
  t = t || {};
  var r = new D0(t);
  r.noRefs || q0(e, r);
  var n = e;
  return r.replacer && (n = r.replacer.call({ "": n }, "", n)), nt(r, 0, n, !0, !0) ? r.dump + `
` : "";
}
Tu.dump = G0;
var Fu = Yo, W0 = Tu;
function ea(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
we.Type = Pe;
we.Schema = Vc;
we.FAILSAFE_SCHEMA = Kc;
we.JSON_SCHEMA = ru;
we.CORE_SCHEMA = nu;
we.DEFAULT_SCHEMA = Ko;
we.load = Fu.load;
we.loadAll = Fu.loadAll;
we.dump = W0.dump;
we.YAMLException = rn;
we.types = {
  binary: lu,
  float: tu,
  map: Xc,
  null: Jc,
  pairs: uu,
  set: fu,
  timestamp: au,
  bool: Qc,
  int: Zc,
  merge: su,
  omap: cu,
  seq: Yc,
  str: zc
};
we.safeLoad = ea("safeLoad", "load");
we.safeLoadAll = ea("safeLoadAll", "loadAll");
we.safeDump = ea("safeDump", "dump");
var ci = {};
Object.defineProperty(ci, "__esModule", { value: !0 });
ci.Lazy = void 0;
class V0 {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
ci.Lazy = V0;
var Oo = { exports: {} };
const z0 = "2.0.0", xu = 256, Y0 = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, X0 = 16, K0 = xu - 6, J0 = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var ui = {
  MAX_LENGTH: xu,
  MAX_SAFE_COMPONENT_LENGTH: X0,
  MAX_SAFE_BUILD_LENGTH: K0,
  MAX_SAFE_INTEGER: Y0,
  RELEASE_TYPES: J0,
  SEMVER_SPEC_VERSION: z0,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Q0 = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var fi = Q0;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: r,
    MAX_SAFE_BUILD_LENGTH: n,
    MAX_LENGTH: i
  } = ui, o = fi;
  t = e.exports = {};
  const a = t.re = [], s = t.safeRe = [], l = t.src = [], h = t.safeSrc = [], c = t.t = {};
  let f = 0;
  const d = "[a-zA-Z0-9-]", m = [
    ["\\s", 1],
    ["\\d", i],
    [d, n]
  ], w = (T) => {
    for (const [A, S] of m)
      T = T.split(`${A}*`).join(`${A}{0,${S}}`).split(`${A}+`).join(`${A}{1,${S}}`);
    return T;
  }, E = (T, A, S) => {
    const F = w(A), x = f++;
    o(T, x, A), c[T] = x, l[x] = A, h[x] = F, a[x] = new RegExp(A, S ? "g" : void 0), s[x] = new RegExp(F, S ? "g" : void 0);
  };
  E("NUMERICIDENTIFIER", "0|[1-9]\\d*"), E("NUMERICIDENTIFIERLOOSE", "\\d+"), E("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${d}*`), E("MAINVERSION", `(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})\\.(${l[c.NUMERICIDENTIFIER]})`), E("MAINVERSIONLOOSE", `(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})\\.(${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASEIDENTIFIER", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIER]})`), E("PRERELEASEIDENTIFIERLOOSE", `(?:${l[c.NONNUMERICIDENTIFIER]}|${l[c.NUMERICIDENTIFIERLOOSE]})`), E("PRERELEASE", `(?:-(${l[c.PRERELEASEIDENTIFIER]}(?:\\.${l[c.PRERELEASEIDENTIFIER]})*))`), E("PRERELEASELOOSE", `(?:-?(${l[c.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${l[c.PRERELEASEIDENTIFIERLOOSE]})*))`), E("BUILDIDENTIFIER", `${d}+`), E("BUILD", `(?:\\+(${l[c.BUILDIDENTIFIER]}(?:\\.${l[c.BUILDIDENTIFIER]})*))`), E("FULLPLAIN", `v?${l[c.MAINVERSION]}${l[c.PRERELEASE]}?${l[c.BUILD]}?`), E("FULL", `^${l[c.FULLPLAIN]}$`), E("LOOSEPLAIN", `[v=\\s]*${l[c.MAINVERSIONLOOSE]}${l[c.PRERELEASELOOSE]}?${l[c.BUILD]}?`), E("LOOSE", `^${l[c.LOOSEPLAIN]}$`), E("GTLT", "((?:<|>)?=?)"), E("XRANGEIDENTIFIERLOOSE", `${l[c.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), E("XRANGEIDENTIFIER", `${l[c.NUMERICIDENTIFIER]}|x|X|\\*`), E("XRANGEPLAIN", `[v=\\s]*(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:\\.(${l[c.XRANGEIDENTIFIER]})(?:${l[c.PRERELEASE]})?${l[c.BUILD]}?)?)?`), E("XRANGEPLAINLOOSE", `[v=\\s]*(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:\\.(${l[c.XRANGEIDENTIFIERLOOSE]})(?:${l[c.PRERELEASELOOSE]})?${l[c.BUILD]}?)?)?`), E("XRANGE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAIN]}$`), E("XRANGELOOSE", `^${l[c.GTLT]}\\s*${l[c.XRANGEPLAINLOOSE]}$`), E("COERCEPLAIN", `(^|[^\\d])(\\d{1,${r}})(?:\\.(\\d{1,${r}}))?(?:\\.(\\d{1,${r}}))?`), E("COERCE", `${l[c.COERCEPLAIN]}(?:$|[^\\d])`), E("COERCEFULL", l[c.COERCEPLAIN] + `(?:${l[c.PRERELEASE]})?(?:${l[c.BUILD]})?(?:$|[^\\d])`), E("COERCERTL", l[c.COERCE], !0), E("COERCERTLFULL", l[c.COERCEFULL], !0), E("LONETILDE", "(?:~>?)"), E("TILDETRIM", `(\\s*)${l[c.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", E("TILDE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAIN]}$`), E("TILDELOOSE", `^${l[c.LONETILDE]}${l[c.XRANGEPLAINLOOSE]}$`), E("LONECARET", "(?:\\^)"), E("CARETTRIM", `(\\s*)${l[c.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", E("CARET", `^${l[c.LONECARET]}${l[c.XRANGEPLAIN]}$`), E("CARETLOOSE", `^${l[c.LONECARET]}${l[c.XRANGEPLAINLOOSE]}$`), E("COMPARATORLOOSE", `^${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]})$|^$`), E("COMPARATOR", `^${l[c.GTLT]}\\s*(${l[c.FULLPLAIN]})$|^$`), E("COMPARATORTRIM", `(\\s*)${l[c.GTLT]}\\s*(${l[c.LOOSEPLAIN]}|${l[c.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", E("HYPHENRANGE", `^\\s*(${l[c.XRANGEPLAIN]})\\s+-\\s+(${l[c.XRANGEPLAIN]})\\s*$`), E("HYPHENRANGELOOSE", `^\\s*(${l[c.XRANGEPLAINLOOSE]})\\s+-\\s+(${l[c.XRANGEPLAINLOOSE]})\\s*$`), E("STAR", "(<|>)?=?\\s*\\*"), E("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), E("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(Oo, Oo.exports);
var on = Oo.exports;
const Z0 = Object.freeze({ loose: !0 }), eE = Object.freeze({}), tE = (e) => e ? typeof e != "object" ? Z0 : e : eE;
var ta = tE;
const Ns = /^[0-9]+$/, Lu = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const r = Ns.test(e), n = Ns.test(t);
  return r && n && (e = +e, t = +t), e === t ? 0 : r && !n ? -1 : n && !r ? 1 : e < t ? -1 : 1;
}, rE = (e, t) => Lu(t, e);
var Uu = {
  compareIdentifiers: Lu,
  rcompareIdentifiers: rE
};
const bn = fi, { MAX_LENGTH: Ps, MAX_SAFE_INTEGER: On } = ui, { safeRe: Rn, t: In } = on, nE = ta, { compareIdentifiers: Gi } = Uu;
let iE = class Je {
  constructor(t, r) {
    if (r = nE(r), t instanceof Je) {
      if (t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > Ps)
      throw new TypeError(
        `version is longer than ${Ps} characters`
      );
    bn("SemVer", t, r), this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease;
    const n = t.trim().match(r.loose ? Rn[In.LOOSE] : Rn[In.FULL]);
    if (!n)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +n[1], this.minor = +n[2], this.patch = +n[3], this.major > On || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > On || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > On || this.patch < 0)
      throw new TypeError("Invalid patch version");
    n[4] ? this.prerelease = n[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < On)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = n[5] ? n[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (bn("SemVer.compare", this.version, this.options, t), !(t instanceof Je)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new Je(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof Je || (t = new Je(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof Je || (t = new Je(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let r = 0;
    do {
      const n = this.prerelease[r], i = t.prerelease[r];
      if (bn("prerelease compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Gi(n, i);
    } while (++r);
  }
  compareBuild(t) {
    t instanceof Je || (t = new Je(t, this.options));
    let r = 0;
    do {
      const n = this.build[r], i = t.build[r];
      if (bn("build compare", r, n, i), n === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (n === void 0)
        return -1;
      if (n === i)
        continue;
      return Gi(n, i);
    } while (++r);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, r, n) {
    if (t.startsWith("pre")) {
      if (!r && n === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (r) {
        const i = `-${r}`.match(this.options.loose ? Rn[In.PRERELEASELOOSE] : Rn[In.PRERELEASE]);
        if (!i || i[1] !== r)
          throw new Error(`invalid identifier: ${r}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", r, n);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", r, n);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", r, n), this.inc("pre", r, n);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(n) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (r === this.prerelease.join(".") && n === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (r) {
          let o = [r, i];
          n === !1 && (o = [r]), Gi(this.prerelease[0], r) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var De = iE;
const Ds = De, oE = (e, t, r = !1) => {
  if (e instanceof Ds)
    return e;
  try {
    return new Ds(e, t);
  } catch (n) {
    if (!r)
      return null;
    throw n;
  }
};
var mr = oE;
const aE = mr, sE = (e, t) => {
  const r = aE(e, t);
  return r ? r.version : null;
};
var lE = sE;
const cE = mr, uE = (e, t) => {
  const r = cE(e.trim().replace(/^[=v]+/, ""), t);
  return r ? r.version : null;
};
var fE = uE;
const $s = De, dE = (e, t, r, n, i) => {
  typeof r == "string" && (i = n, n = r, r = void 0);
  try {
    return new $s(
      e instanceof $s ? e.version : e,
      r
    ).inc(t, n, i).version;
  } catch {
    return null;
  }
};
var hE = dE;
const Fs = mr, pE = (e, t) => {
  const r = Fs(e, null, !0), n = Fs(t, null, !0), i = r.compare(n);
  if (i === 0)
    return null;
  const o = i > 0, a = o ? r : n, s = o ? n : r, l = !!a.prerelease.length;
  if (!!s.prerelease.length && !l) {
    if (!s.patch && !s.minor)
      return "major";
    if (s.compareMain(a) === 0)
      return s.minor && !s.patch ? "minor" : "patch";
  }
  const c = l ? "pre" : "";
  return r.major !== n.major ? c + "major" : r.minor !== n.minor ? c + "minor" : r.patch !== n.patch ? c + "patch" : "prerelease";
};
var mE = pE;
const gE = De, EE = (e, t) => new gE(e, t).major;
var yE = EE;
const wE = De, vE = (e, t) => new wE(e, t).minor;
var _E = vE;
const TE = De, AE = (e, t) => new TE(e, t).patch;
var SE = AE;
const CE = mr, bE = (e, t) => {
  const r = CE(e, t);
  return r && r.prerelease.length ? r.prerelease : null;
};
var OE = bE;
const xs = De, RE = (e, t, r) => new xs(e, r).compare(new xs(t, r));
var Ve = RE;
const IE = Ve, NE = (e, t, r) => IE(t, e, r);
var PE = NE;
const DE = Ve, $E = (e, t) => DE(e, t, !0);
var FE = $E;
const Ls = De, xE = (e, t, r) => {
  const n = new Ls(e, r), i = new Ls(t, r);
  return n.compare(i) || n.compareBuild(i);
};
var ra = xE;
const LE = ra, UE = (e, t) => e.sort((r, n) => LE(r, n, t));
var kE = UE;
const ME = ra, BE = (e, t) => e.sort((r, n) => ME(n, r, t));
var HE = BE;
const jE = Ve, qE = (e, t, r) => jE(e, t, r) > 0;
var di = qE;
const GE = Ve, WE = (e, t, r) => GE(e, t, r) < 0;
var na = WE;
const VE = Ve, zE = (e, t, r) => VE(e, t, r) === 0;
var ku = zE;
const YE = Ve, XE = (e, t, r) => YE(e, t, r) !== 0;
var Mu = XE;
const KE = Ve, JE = (e, t, r) => KE(e, t, r) >= 0;
var ia = JE;
const QE = Ve, ZE = (e, t, r) => QE(e, t, r) <= 0;
var oa = ZE;
const ey = ku, ty = Mu, ry = di, ny = ia, iy = na, oy = oa, ay = (e, t, r, n) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e === r;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof r == "object" && (r = r.version), e !== r;
    case "":
    case "=":
    case "==":
      return ey(e, r, n);
    case "!=":
      return ty(e, r, n);
    case ">":
      return ry(e, r, n);
    case ">=":
      return ny(e, r, n);
    case "<":
      return iy(e, r, n);
    case "<=":
      return oy(e, r, n);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var Bu = ay;
const sy = De, ly = mr, { safeRe: Nn, t: Pn } = on, cy = (e, t) => {
  if (e instanceof sy)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let r = null;
  if (!t.rtl)
    r = e.match(t.includePrerelease ? Nn[Pn.COERCEFULL] : Nn[Pn.COERCE]);
  else {
    const l = t.includePrerelease ? Nn[Pn.COERCERTLFULL] : Nn[Pn.COERCERTL];
    let h;
    for (; (h = l.exec(e)) && (!r || r.index + r[0].length !== e.length); )
      (!r || h.index + h[0].length !== r.index + r[0].length) && (r = h), l.lastIndex = h.index + h[1].length + h[2].length;
    l.lastIndex = -1;
  }
  if (r === null)
    return null;
  const n = r[2], i = r[3] || "0", o = r[4] || "0", a = t.includePrerelease && r[5] ? `-${r[5]}` : "", s = t.includePrerelease && r[6] ? `+${r[6]}` : "";
  return ly(`${n}.${i}.${o}${a}${s}`, t);
};
var uy = cy;
class fy {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const r = this.map.get(t);
    if (r !== void 0)
      return this.map.delete(t), this.map.set(t, r), r;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, r) {
    if (!this.delete(t) && r !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, r);
    }
    return this;
  }
}
var dy = fy, Wi, Us;
function ze() {
  if (Us) return Wi;
  Us = 1;
  const e = /\s+/g;
  class t {
    constructor(b, P) {
      if (P = i(P), b instanceof t)
        return b.loose === !!P.loose && b.includePrerelease === !!P.includePrerelease ? b : new t(b.raw, P);
      if (b instanceof o)
        return this.raw = b.value, this.set = [[b]], this.formatted = void 0, this;
      if (this.options = P, this.loose = !!P.loose, this.includePrerelease = !!P.includePrerelease, this.raw = b.trim().replace(e, " "), this.set = this.raw.split("||").map((C) => this.parseRange(C.trim())).filter((C) => C.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const C = this.set[0];
        if (this.set = this.set.filter(($) => !E($[0])), this.set.length === 0)
          this.set = [C];
        else if (this.set.length > 1) {
          for (const $ of this.set)
            if ($.length === 1 && T($[0])) {
              this.set = [$];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let b = 0; b < this.set.length; b++) {
          b > 0 && (this.formatted += "||");
          const P = this.set[b];
          for (let C = 0; C < P.length; C++)
            C > 0 && (this.formatted += " "), this.formatted += P[C].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(b) {
      const C = ((this.options.includePrerelease && m) | (this.options.loose && w)) + ":" + b, $ = n.get(C);
      if ($)
        return $;
      const D = this.options.loose, k = D ? l[h.HYPHENRANGELOOSE] : l[h.HYPHENRANGE];
      b = b.replace(k, H(this.options.includePrerelease)), a("hyphen replace", b), b = b.replace(l[h.COMPARATORTRIM], c), a("comparator trim", b), b = b.replace(l[h.TILDETRIM], f), a("tilde trim", b), b = b.replace(l[h.CARETTRIM], d), a("caret trim", b);
      let B = b.split(" ").map((M) => S(M, this.options)).join(" ").split(/\s+/).map((M) => G(M, this.options));
      D && (B = B.filter((M) => (a("loose invalid filter", M, this.options), !!M.match(l[h.COMPARATORLOOSE])))), a("range list", B);
      const q = /* @__PURE__ */ new Map(), X = B.map((M) => new o(M, this.options));
      for (const M of X) {
        if (E(M))
          return [M];
        q.set(M.value, M);
      }
      q.size > 1 && q.has("") && q.delete("");
      const de = [...q.values()];
      return n.set(C, de), de;
    }
    intersects(b, P) {
      if (!(b instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((C) => A(C, P) && b.set.some(($) => A($, P) && C.every((D) => $.every((k) => D.intersects(k, P)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(b) {
      if (!b)
        return !1;
      if (typeof b == "string")
        try {
          b = new s(b, this.options);
        } catch {
          return !1;
        }
      for (let P = 0; P < this.set.length; P++)
        if (Q(this.set[P], b, this.options))
          return !0;
      return !1;
    }
  }
  Wi = t;
  const r = dy, n = new r(), i = ta, o = hi(), a = fi, s = De, {
    safeRe: l,
    t: h,
    comparatorTrimReplace: c,
    tildeTrimReplace: f,
    caretTrimReplace: d
  } = on, { FLAG_INCLUDE_PRERELEASE: m, FLAG_LOOSE: w } = ui, E = (O) => O.value === "<0.0.0-0", T = (O) => O.value === "", A = (O, b) => {
    let P = !0;
    const C = O.slice();
    let $ = C.pop();
    for (; P && C.length; )
      P = C.every((D) => $.intersects(D, b)), $ = C.pop();
    return P;
  }, S = (O, b) => (O = O.replace(l[h.BUILD], ""), a("comp", O, b), O = re(O, b), a("caret", O), O = x(O, b), a("tildes", O), O = me(O, b), a("xrange", O), O = j(O, b), a("stars", O), O), F = (O) => !O || O.toLowerCase() === "x" || O === "*", x = (O, b) => O.trim().split(/\s+/).map((P) => J(P, b)).join(" "), J = (O, b) => {
    const P = b.loose ? l[h.TILDELOOSE] : l[h.TILDE];
    return O.replace(P, (C, $, D, k, B) => {
      a("tilde", O, C, $, D, k, B);
      let q;
      return F($) ? q = "" : F(D) ? q = `>=${$}.0.0 <${+$ + 1}.0.0-0` : F(k) ? q = `>=${$}.${D}.0 <${$}.${+D + 1}.0-0` : B ? (a("replaceTilde pr", B), q = `>=${$}.${D}.${k}-${B} <${$}.${+D + 1}.0-0`) : q = `>=${$}.${D}.${k} <${$}.${+D + 1}.0-0`, a("tilde return", q), q;
    });
  }, re = (O, b) => O.trim().split(/\s+/).map((P) => V(P, b)).join(" "), V = (O, b) => {
    a("caret", O, b);
    const P = b.loose ? l[h.CARETLOOSE] : l[h.CARET], C = b.includePrerelease ? "-0" : "";
    return O.replace(P, ($, D, k, B, q) => {
      a("caret", O, $, D, k, B, q);
      let X;
      return F(D) ? X = "" : F(k) ? X = `>=${D}.0.0${C} <${+D + 1}.0.0-0` : F(B) ? D === "0" ? X = `>=${D}.${k}.0${C} <${D}.${+k + 1}.0-0` : X = `>=${D}.${k}.0${C} <${+D + 1}.0.0-0` : q ? (a("replaceCaret pr", q), D === "0" ? k === "0" ? X = `>=${D}.${k}.${B}-${q} <${D}.${k}.${+B + 1}-0` : X = `>=${D}.${k}.${B}-${q} <${D}.${+k + 1}.0-0` : X = `>=${D}.${k}.${B}-${q} <${+D + 1}.0.0-0`) : (a("no pr"), D === "0" ? k === "0" ? X = `>=${D}.${k}.${B}${C} <${D}.${k}.${+B + 1}-0` : X = `>=${D}.${k}.${B}${C} <${D}.${+k + 1}.0-0` : X = `>=${D}.${k}.${B} <${+D + 1}.0.0-0`), a("caret return", X), X;
    });
  }, me = (O, b) => (a("replaceXRanges", O, b), O.split(/\s+/).map((P) => y(P, b)).join(" ")), y = (O, b) => {
    O = O.trim();
    const P = b.loose ? l[h.XRANGELOOSE] : l[h.XRANGE];
    return O.replace(P, (C, $, D, k, B, q) => {
      a("xRange", O, C, $, D, k, B, q);
      const X = F(D), de = X || F(k), M = de || F(B), Xe = M;
      return $ === "=" && Xe && ($ = ""), q = b.includePrerelease ? "-0" : "", X ? $ === ">" || $ === "<" ? C = "<0.0.0-0" : C = "*" : $ && Xe ? (de && (k = 0), B = 0, $ === ">" ? ($ = ">=", de ? (D = +D + 1, k = 0, B = 0) : (k = +k + 1, B = 0)) : $ === "<=" && ($ = "<", de ? D = +D + 1 : k = +k + 1), $ === "<" && (q = "-0"), C = `${$ + D}.${k}.${B}${q}`) : de ? C = `>=${D}.0.0${q} <${+D + 1}.0.0-0` : M && (C = `>=${D}.${k}.0${q} <${D}.${+k + 1}.0-0`), a("xRange return", C), C;
    });
  }, j = (O, b) => (a("replaceStars", O, b), O.trim().replace(l[h.STAR], "")), G = (O, b) => (a("replaceGTE0", O, b), O.trim().replace(l[b.includePrerelease ? h.GTE0PRE : h.GTE0], "")), H = (O) => (b, P, C, $, D, k, B, q, X, de, M, Xe) => (F(C) ? P = "" : F($) ? P = `>=${C}.0.0${O ? "-0" : ""}` : F(D) ? P = `>=${C}.${$}.0${O ? "-0" : ""}` : k ? P = `>=${P}` : P = `>=${P}${O ? "-0" : ""}`, F(X) ? q = "" : F(de) ? q = `<${+X + 1}.0.0-0` : F(M) ? q = `<${X}.${+de + 1}.0-0` : Xe ? q = `<=${X}.${de}.${M}-${Xe}` : O ? q = `<${X}.${de}.${+M + 1}-0` : q = `<=${q}`, `${P} ${q}`.trim()), Q = (O, b, P) => {
    for (let C = 0; C < O.length; C++)
      if (!O[C].test(b))
        return !1;
    if (b.prerelease.length && !P.includePrerelease) {
      for (let C = 0; C < O.length; C++)
        if (a(O[C].semver), O[C].semver !== o.ANY && O[C].semver.prerelease.length > 0) {
          const $ = O[C].semver;
          if ($.major === b.major && $.minor === b.minor && $.patch === b.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Wi;
}
var Vi, ks;
function hi() {
  if (ks) return Vi;
  ks = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(c, f) {
      if (f = r(f), c instanceof t) {
        if (c.loose === !!f.loose)
          return c;
        c = c.value;
      }
      c = c.trim().split(/\s+/).join(" "), a("comparator", c, f), this.options = f, this.loose = !!f.loose, this.parse(c), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, a("comp", this);
    }
    parse(c) {
      const f = this.options.loose ? n[i.COMPARATORLOOSE] : n[i.COMPARATOR], d = c.match(f);
      if (!d)
        throw new TypeError(`Invalid comparator: ${c}`);
      this.operator = d[1] !== void 0 ? d[1] : "", this.operator === "=" && (this.operator = ""), d[2] ? this.semver = new s(d[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(c) {
      if (a("Comparator.test", c, this.options.loose), this.semver === e || c === e)
        return !0;
      if (typeof c == "string")
        try {
          c = new s(c, this.options);
        } catch {
          return !1;
        }
      return o(c, this.operator, this.semver, this.options);
    }
    intersects(c, f) {
      if (!(c instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new l(c.value, f).test(this.value) : c.operator === "" ? c.value === "" ? !0 : new l(this.value, f).test(c.semver) : (f = r(f), f.includePrerelease && (this.value === "<0.0.0-0" || c.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || c.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && c.operator.startsWith(">") || this.operator.startsWith("<") && c.operator.startsWith("<") || this.semver.version === c.semver.version && this.operator.includes("=") && c.operator.includes("=") || o(this.semver, "<", c.semver, f) && this.operator.startsWith(">") && c.operator.startsWith("<") || o(this.semver, ">", c.semver, f) && this.operator.startsWith("<") && c.operator.startsWith(">")));
    }
  }
  Vi = t;
  const r = ta, { safeRe: n, t: i } = on, o = Bu, a = fi, s = De, l = ze();
  return Vi;
}
const hy = ze(), py = (e, t, r) => {
  try {
    t = new hy(t, r);
  } catch {
    return !1;
  }
  return t.test(e);
};
var pi = py;
const my = ze(), gy = (e, t) => new my(e, t).set.map((r) => r.map((n) => n.value).join(" ").trim().split(" "));
var Ey = gy;
const yy = De, wy = ze(), vy = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new wy(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === -1) && (n = a, i = new yy(n, r));
  }), n;
};
var _y = vy;
const Ty = De, Ay = ze(), Sy = (e, t, r) => {
  let n = null, i = null, o = null;
  try {
    o = new Ay(t, r);
  } catch {
    return null;
  }
  return e.forEach((a) => {
    o.test(a) && (!n || i.compare(a) === 1) && (n = a, i = new Ty(n, r));
  }), n;
};
var Cy = Sy;
const zi = De, by = ze(), Ms = di, Oy = (e, t) => {
  e = new by(e, t);
  let r = new zi("0.0.0");
  if (e.test(r) || (r = new zi("0.0.0-0"), e.test(r)))
    return r;
  r = null;
  for (let n = 0; n < e.set.length; ++n) {
    const i = e.set[n];
    let o = null;
    i.forEach((a) => {
      const s = new zi(a.semver.version);
      switch (a.operator) {
        case ">":
          s.prerelease.length === 0 ? s.patch++ : s.prerelease.push(0), s.raw = s.format();
        case "":
        case ">=":
          (!o || Ms(s, o)) && (o = s);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${a.operator}`);
      }
    }), o && (!r || Ms(r, o)) && (r = o);
  }
  return r && e.test(r) ? r : null;
};
var Ry = Oy;
const Iy = ze(), Ny = (e, t) => {
  try {
    return new Iy(e, t).range || "*";
  } catch {
    return null;
  }
};
var Py = Ny;
const Dy = De, Hu = hi(), { ANY: $y } = Hu, Fy = ze(), xy = pi, Bs = di, Hs = na, Ly = oa, Uy = ia, ky = (e, t, r, n) => {
  e = new Dy(e, n), t = new Fy(t, n);
  let i, o, a, s, l;
  switch (r) {
    case ">":
      i = Bs, o = Ly, a = Hs, s = ">", l = ">=";
      break;
    case "<":
      i = Hs, o = Uy, a = Bs, s = "<", l = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (xy(e, t, n))
    return !1;
  for (let h = 0; h < t.set.length; ++h) {
    const c = t.set[h];
    let f = null, d = null;
    if (c.forEach((m) => {
      m.semver === $y && (m = new Hu(">=0.0.0")), f = f || m, d = d || m, i(m.semver, f.semver, n) ? f = m : a(m.semver, d.semver, n) && (d = m);
    }), f.operator === s || f.operator === l || (!d.operator || d.operator === s) && o(e, d.semver))
      return !1;
    if (d.operator === l && a(e, d.semver))
      return !1;
  }
  return !0;
};
var aa = ky;
const My = aa, By = (e, t, r) => My(e, t, ">", r);
var Hy = By;
const jy = aa, qy = (e, t, r) => jy(e, t, "<", r);
var Gy = qy;
const js = ze(), Wy = (e, t, r) => (e = new js(e, r), t = new js(t, r), e.intersects(t, r));
var Vy = Wy;
const zy = pi, Yy = Ve;
var Xy = (e, t, r) => {
  const n = [];
  let i = null, o = null;
  const a = e.sort((c, f) => Yy(c, f, r));
  for (const c of a)
    zy(c, t, r) ? (o = c, i || (i = c)) : (o && n.push([i, o]), o = null, i = null);
  i && n.push([i, null]);
  const s = [];
  for (const [c, f] of n)
    c === f ? s.push(c) : !f && c === a[0] ? s.push("*") : f ? c === a[0] ? s.push(`<=${f}`) : s.push(`${c} - ${f}`) : s.push(`>=${c}`);
  const l = s.join(" || "), h = typeof t.raw == "string" ? t.raw : String(t);
  return l.length < h.length ? l : t;
};
const qs = ze(), sa = hi(), { ANY: Yi } = sa, Sr = pi, la = Ve, Ky = (e, t, r = {}) => {
  if (e === t)
    return !0;
  e = new qs(e, r), t = new qs(t, r);
  let n = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const a = Qy(i, o, r);
      if (n = n || a !== null, a)
        continue e;
    }
    if (n)
      return !1;
  }
  return !0;
}, Jy = [new sa(">=0.0.0-0")], Gs = [new sa(">=0.0.0")], Qy = (e, t, r) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Yi) {
    if (t.length === 1 && t[0].semver === Yi)
      return !0;
    r.includePrerelease ? e = Jy : e = Gs;
  }
  if (t.length === 1 && t[0].semver === Yi) {
    if (r.includePrerelease)
      return !0;
    t = Gs;
  }
  const n = /* @__PURE__ */ new Set();
  let i, o;
  for (const m of e)
    m.operator === ">" || m.operator === ">=" ? i = Ws(i, m, r) : m.operator === "<" || m.operator === "<=" ? o = Vs(o, m, r) : n.add(m.semver);
  if (n.size > 1)
    return null;
  let a;
  if (i && o) {
    if (a = la(i.semver, o.semver, r), a > 0)
      return null;
    if (a === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const m of n) {
    if (i && !Sr(m, String(i), r) || o && !Sr(m, String(o), r))
      return null;
    for (const w of t)
      if (!Sr(m, String(w), r))
        return !1;
    return !0;
  }
  let s, l, h, c, f = o && !r.includePrerelease && o.semver.prerelease.length ? o.semver : !1, d = i && !r.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const m of t) {
    if (c = c || m.operator === ">" || m.operator === ">=", h = h || m.operator === "<" || m.operator === "<=", i) {
      if (d && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === d.major && m.semver.minor === d.minor && m.semver.patch === d.patch && (d = !1), m.operator === ">" || m.operator === ">=") {
        if (s = Ws(i, m, r), s === m && s !== i)
          return !1;
      } else if (i.operator === ">=" && !Sr(i.semver, String(m), r))
        return !1;
    }
    if (o) {
      if (f && m.semver.prerelease && m.semver.prerelease.length && m.semver.major === f.major && m.semver.minor === f.minor && m.semver.patch === f.patch && (f = !1), m.operator === "<" || m.operator === "<=") {
        if (l = Vs(o, m, r), l === m && l !== o)
          return !1;
      } else if (o.operator === "<=" && !Sr(o.semver, String(m), r))
        return !1;
    }
    if (!m.operator && (o || i) && a !== 0)
      return !1;
  }
  return !(i && h && !o && a !== 0 || o && c && !i && a !== 0 || d || f);
}, Ws = (e, t, r) => {
  if (!e)
    return t;
  const n = la(e.semver, t.semver, r);
  return n > 0 ? e : n < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Vs = (e, t, r) => {
  if (!e)
    return t;
  const n = la(e.semver, t.semver, r);
  return n < 0 ? e : n > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var Zy = Ky;
const Xi = on, zs = ui, ew = De, Ys = Uu, tw = mr, rw = lE, nw = fE, iw = hE, ow = mE, aw = yE, sw = _E, lw = SE, cw = OE, uw = Ve, fw = PE, dw = FE, hw = ra, pw = kE, mw = HE, gw = di, Ew = na, yw = ku, ww = Mu, vw = ia, _w = oa, Tw = Bu, Aw = uy, Sw = hi(), Cw = ze(), bw = pi, Ow = Ey, Rw = _y, Iw = Cy, Nw = Ry, Pw = Py, Dw = aa, $w = Hy, Fw = Gy, xw = Vy, Lw = Xy, Uw = Zy;
var ju = {
  parse: tw,
  valid: rw,
  clean: nw,
  inc: iw,
  diff: ow,
  major: aw,
  minor: sw,
  patch: lw,
  prerelease: cw,
  compare: uw,
  rcompare: fw,
  compareLoose: dw,
  compareBuild: hw,
  sort: pw,
  rsort: mw,
  gt: gw,
  lt: Ew,
  eq: yw,
  neq: ww,
  gte: vw,
  lte: _w,
  cmp: Tw,
  coerce: Aw,
  Comparator: Sw,
  Range: Cw,
  satisfies: bw,
  toComparators: Ow,
  maxSatisfying: Rw,
  minSatisfying: Iw,
  minVersion: Nw,
  validRange: Pw,
  outside: Dw,
  gtr: $w,
  ltr: Fw,
  intersects: xw,
  simplifyRange: Lw,
  subset: Uw,
  SemVer: ew,
  re: Xi.re,
  src: Xi.src,
  tokens: Xi.t,
  SEMVER_SPEC_VERSION: zs.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: zs.RELEASE_TYPES,
  compareIdentifiers: Ys.compareIdentifiers,
  rcompareIdentifiers: Ys.rcompareIdentifiers
}, an = {}, Jn = { exports: {} };
Jn.exports;
(function(e, t) {
  var r = 200, n = "__lodash_hash_undefined__", i = 1, o = 2, a = 9007199254740991, s = "[object Arguments]", l = "[object Array]", h = "[object AsyncFunction]", c = "[object Boolean]", f = "[object Date]", d = "[object Error]", m = "[object Function]", w = "[object GeneratorFunction]", E = "[object Map]", T = "[object Number]", A = "[object Null]", S = "[object Object]", F = "[object Promise]", x = "[object Proxy]", J = "[object RegExp]", re = "[object Set]", V = "[object String]", me = "[object Symbol]", y = "[object Undefined]", j = "[object WeakMap]", G = "[object ArrayBuffer]", H = "[object DataView]", Q = "[object Float32Array]", O = "[object Float64Array]", b = "[object Int8Array]", P = "[object Int16Array]", C = "[object Int32Array]", $ = "[object Uint8Array]", D = "[object Uint8ClampedArray]", k = "[object Uint16Array]", B = "[object Uint32Array]", q = /[\\^$.*+?()[\]{}|]/g, X = /^\[object .+?Constructor\]$/, de = /^(?:0|[1-9]\d*)$/, M = {};
  M[Q] = M[O] = M[b] = M[P] = M[C] = M[$] = M[D] = M[k] = M[B] = !0, M[s] = M[l] = M[G] = M[c] = M[H] = M[f] = M[d] = M[m] = M[E] = M[T] = M[S] = M[J] = M[re] = M[V] = M[j] = !1;
  var Xe = typeof be == "object" && be && be.Object === Object && be, p = typeof self == "object" && self && self.Object === Object && self, u = Xe || p || Function("return this")(), R = t && !t.nodeType && t, _ = R && !0 && e && !e.nodeType && e, Y = _ && _.exports === R, ee = Y && Xe.process, ae = function() {
    try {
      return ee && ee.binding && ee.binding("util");
    } catch {
    }
  }(), ge = ae && ae.isTypedArray;
  function ve(g, v) {
    for (var I = -1, L = g == null ? 0 : g.length, te = 0, W = []; ++I < L; ) {
      var se = g[I];
      v(se, I, g) && (W[te++] = se);
    }
    return W;
  }
  function it(g, v) {
    for (var I = -1, L = v.length, te = g.length; ++I < L; )
      g[te + I] = v[I];
    return g;
  }
  function ue(g, v) {
    for (var I = -1, L = g == null ? 0 : g.length; ++I < L; )
      if (v(g[I], I, g))
        return !0;
    return !1;
  }
  function Me(g, v) {
    for (var I = -1, L = Array(g); ++I < g; )
      L[I] = v(I);
    return L;
  }
  function Si(g) {
    return function(v) {
      return g(v);
    };
  }
  function un(g, v) {
    return g.has(v);
  }
  function yr(g, v) {
    return g == null ? void 0 : g[v];
  }
  function fn(g) {
    var v = -1, I = Array(g.size);
    return g.forEach(function(L, te) {
      I[++v] = [te, L];
    }), I;
  }
  function df(g, v) {
    return function(I) {
      return g(v(I));
    };
  }
  function hf(g) {
    var v = -1, I = Array(g.size);
    return g.forEach(function(L) {
      I[++v] = L;
    }), I;
  }
  var pf = Array.prototype, mf = Function.prototype, dn = Object.prototype, Ci = u["__core-js_shared__"], Ea = mf.toString, Ke = dn.hasOwnProperty, ya = function() {
    var g = /[^.]+$/.exec(Ci && Ci.keys && Ci.keys.IE_PROTO || "");
    return g ? "Symbol(src)_1." + g : "";
  }(), wa = dn.toString, gf = RegExp(
    "^" + Ea.call(Ke).replace(q, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), va = Y ? u.Buffer : void 0, hn = u.Symbol, _a = u.Uint8Array, Ta = dn.propertyIsEnumerable, Ef = pf.splice, Ct = hn ? hn.toStringTag : void 0, Aa = Object.getOwnPropertySymbols, yf = va ? va.isBuffer : void 0, wf = df(Object.keys, Object), bi = Wt(u, "DataView"), wr = Wt(u, "Map"), Oi = Wt(u, "Promise"), Ri = Wt(u, "Set"), Ii = Wt(u, "WeakMap"), vr = Wt(Object, "create"), vf = Rt(bi), _f = Rt(wr), Tf = Rt(Oi), Af = Rt(Ri), Sf = Rt(Ii), Sa = hn ? hn.prototype : void 0, Ni = Sa ? Sa.valueOf : void 0;
  function bt(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function Cf() {
    this.__data__ = vr ? vr(null) : {}, this.size = 0;
  }
  function bf(g) {
    var v = this.has(g) && delete this.__data__[g];
    return this.size -= v ? 1 : 0, v;
  }
  function Of(g) {
    var v = this.__data__;
    if (vr) {
      var I = v[g];
      return I === n ? void 0 : I;
    }
    return Ke.call(v, g) ? v[g] : void 0;
  }
  function Rf(g) {
    var v = this.__data__;
    return vr ? v[g] !== void 0 : Ke.call(v, g);
  }
  function If(g, v) {
    var I = this.__data__;
    return this.size += this.has(g) ? 0 : 1, I[g] = vr && v === void 0 ? n : v, this;
  }
  bt.prototype.clear = Cf, bt.prototype.delete = bf, bt.prototype.get = Of, bt.prototype.has = Rf, bt.prototype.set = If;
  function et(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function Nf() {
    this.__data__ = [], this.size = 0;
  }
  function Pf(g) {
    var v = this.__data__, I = mn(v, g);
    if (I < 0)
      return !1;
    var L = v.length - 1;
    return I == L ? v.pop() : Ef.call(v, I, 1), --this.size, !0;
  }
  function Df(g) {
    var v = this.__data__, I = mn(v, g);
    return I < 0 ? void 0 : v[I][1];
  }
  function $f(g) {
    return mn(this.__data__, g) > -1;
  }
  function Ff(g, v) {
    var I = this.__data__, L = mn(I, g);
    return L < 0 ? (++this.size, I.push([g, v])) : I[L][1] = v, this;
  }
  et.prototype.clear = Nf, et.prototype.delete = Pf, et.prototype.get = Df, et.prototype.has = $f, et.prototype.set = Ff;
  function Ot(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.clear(); ++v < I; ) {
      var L = g[v];
      this.set(L[0], L[1]);
    }
  }
  function xf() {
    this.size = 0, this.__data__ = {
      hash: new bt(),
      map: new (wr || et)(),
      string: new bt()
    };
  }
  function Lf(g) {
    var v = gn(this, g).delete(g);
    return this.size -= v ? 1 : 0, v;
  }
  function Uf(g) {
    return gn(this, g).get(g);
  }
  function kf(g) {
    return gn(this, g).has(g);
  }
  function Mf(g, v) {
    var I = gn(this, g), L = I.size;
    return I.set(g, v), this.size += I.size == L ? 0 : 1, this;
  }
  Ot.prototype.clear = xf, Ot.prototype.delete = Lf, Ot.prototype.get = Uf, Ot.prototype.has = kf, Ot.prototype.set = Mf;
  function pn(g) {
    var v = -1, I = g == null ? 0 : g.length;
    for (this.__data__ = new Ot(); ++v < I; )
      this.add(g[v]);
  }
  function Bf(g) {
    return this.__data__.set(g, n), this;
  }
  function Hf(g) {
    return this.__data__.has(g);
  }
  pn.prototype.add = pn.prototype.push = Bf, pn.prototype.has = Hf;
  function ot(g) {
    var v = this.__data__ = new et(g);
    this.size = v.size;
  }
  function jf() {
    this.__data__ = new et(), this.size = 0;
  }
  function qf(g) {
    var v = this.__data__, I = v.delete(g);
    return this.size = v.size, I;
  }
  function Gf(g) {
    return this.__data__.get(g);
  }
  function Wf(g) {
    return this.__data__.has(g);
  }
  function Vf(g, v) {
    var I = this.__data__;
    if (I instanceof et) {
      var L = I.__data__;
      if (!wr || L.length < r - 1)
        return L.push([g, v]), this.size = ++I.size, this;
      I = this.__data__ = new Ot(L);
    }
    return I.set(g, v), this.size = I.size, this;
  }
  ot.prototype.clear = jf, ot.prototype.delete = qf, ot.prototype.get = Gf, ot.prototype.has = Wf, ot.prototype.set = Vf;
  function zf(g, v) {
    var I = En(g), L = !I && ld(g), te = !I && !L && Pi(g), W = !I && !L && !te && $a(g), se = I || L || te || W, he = se ? Me(g.length, String) : [], Ee = he.length;
    for (var ne in g)
      Ke.call(g, ne) && !(se && // Safari 9 has enumerable `arguments.length` in strict mode.
      (ne == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      te && (ne == "offset" || ne == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      W && (ne == "buffer" || ne == "byteLength" || ne == "byteOffset") || // Skip index properties.
      nd(ne, Ee))) && he.push(ne);
    return he;
  }
  function mn(g, v) {
    for (var I = g.length; I--; )
      if (Ia(g[I][0], v))
        return I;
    return -1;
  }
  function Yf(g, v, I) {
    var L = v(g);
    return En(g) ? L : it(L, I(g));
  }
  function _r(g) {
    return g == null ? g === void 0 ? y : A : Ct && Ct in Object(g) ? td(g) : sd(g);
  }
  function Ca(g) {
    return Tr(g) && _r(g) == s;
  }
  function ba(g, v, I, L, te) {
    return g === v ? !0 : g == null || v == null || !Tr(g) && !Tr(v) ? g !== g && v !== v : Xf(g, v, I, L, ba, te);
  }
  function Xf(g, v, I, L, te, W) {
    var se = En(g), he = En(v), Ee = se ? l : at(g), ne = he ? l : at(v);
    Ee = Ee == s ? S : Ee, ne = ne == s ? S : ne;
    var Le = Ee == S, Be = ne == S, _e = Ee == ne;
    if (_e && Pi(g)) {
      if (!Pi(v))
        return !1;
      se = !0, Le = !1;
    }
    if (_e && !Le)
      return W || (W = new ot()), se || $a(g) ? Oa(g, v, I, L, te, W) : Zf(g, v, Ee, I, L, te, W);
    if (!(I & i)) {
      var Ue = Le && Ke.call(g, "__wrapped__"), ke = Be && Ke.call(v, "__wrapped__");
      if (Ue || ke) {
        var st = Ue ? g.value() : g, tt = ke ? v.value() : v;
        return W || (W = new ot()), te(st, tt, I, L, W);
      }
    }
    return _e ? (W || (W = new ot()), ed(g, v, I, L, te, W)) : !1;
  }
  function Kf(g) {
    if (!Da(g) || od(g))
      return !1;
    var v = Na(g) ? gf : X;
    return v.test(Rt(g));
  }
  function Jf(g) {
    return Tr(g) && Pa(g.length) && !!M[_r(g)];
  }
  function Qf(g) {
    if (!ad(g))
      return wf(g);
    var v = [];
    for (var I in Object(g))
      Ke.call(g, I) && I != "constructor" && v.push(I);
    return v;
  }
  function Oa(g, v, I, L, te, W) {
    var se = I & i, he = g.length, Ee = v.length;
    if (he != Ee && !(se && Ee > he))
      return !1;
    var ne = W.get(g);
    if (ne && W.get(v))
      return ne == v;
    var Le = -1, Be = !0, _e = I & o ? new pn() : void 0;
    for (W.set(g, v), W.set(v, g); ++Le < he; ) {
      var Ue = g[Le], ke = v[Le];
      if (L)
        var st = se ? L(ke, Ue, Le, v, g, W) : L(Ue, ke, Le, g, v, W);
      if (st !== void 0) {
        if (st)
          continue;
        Be = !1;
        break;
      }
      if (_e) {
        if (!ue(v, function(tt, It) {
          if (!un(_e, It) && (Ue === tt || te(Ue, tt, I, L, W)))
            return _e.push(It);
        })) {
          Be = !1;
          break;
        }
      } else if (!(Ue === ke || te(Ue, ke, I, L, W))) {
        Be = !1;
        break;
      }
    }
    return W.delete(g), W.delete(v), Be;
  }
  function Zf(g, v, I, L, te, W, se) {
    switch (I) {
      case H:
        if (g.byteLength != v.byteLength || g.byteOffset != v.byteOffset)
          return !1;
        g = g.buffer, v = v.buffer;
      case G:
        return !(g.byteLength != v.byteLength || !W(new _a(g), new _a(v)));
      case c:
      case f:
      case T:
        return Ia(+g, +v);
      case d:
        return g.name == v.name && g.message == v.message;
      case J:
      case V:
        return g == v + "";
      case E:
        var he = fn;
      case re:
        var Ee = L & i;
        if (he || (he = hf), g.size != v.size && !Ee)
          return !1;
        var ne = se.get(g);
        if (ne)
          return ne == v;
        L |= o, se.set(g, v);
        var Le = Oa(he(g), he(v), L, te, W, se);
        return se.delete(g), Le;
      case me:
        if (Ni)
          return Ni.call(g) == Ni.call(v);
    }
    return !1;
  }
  function ed(g, v, I, L, te, W) {
    var se = I & i, he = Ra(g), Ee = he.length, ne = Ra(v), Le = ne.length;
    if (Ee != Le && !se)
      return !1;
    for (var Be = Ee; Be--; ) {
      var _e = he[Be];
      if (!(se ? _e in v : Ke.call(v, _e)))
        return !1;
    }
    var Ue = W.get(g);
    if (Ue && W.get(v))
      return Ue == v;
    var ke = !0;
    W.set(g, v), W.set(v, g);
    for (var st = se; ++Be < Ee; ) {
      _e = he[Be];
      var tt = g[_e], It = v[_e];
      if (L)
        var Fa = se ? L(It, tt, _e, v, g, W) : L(tt, It, _e, g, v, W);
      if (!(Fa === void 0 ? tt === It || te(tt, It, I, L, W) : Fa)) {
        ke = !1;
        break;
      }
      st || (st = _e == "constructor");
    }
    if (ke && !st) {
      var yn = g.constructor, wn = v.constructor;
      yn != wn && "constructor" in g && "constructor" in v && !(typeof yn == "function" && yn instanceof yn && typeof wn == "function" && wn instanceof wn) && (ke = !1);
    }
    return W.delete(g), W.delete(v), ke;
  }
  function Ra(g) {
    return Yf(g, fd, rd);
  }
  function gn(g, v) {
    var I = g.__data__;
    return id(v) ? I[typeof v == "string" ? "string" : "hash"] : I.map;
  }
  function Wt(g, v) {
    var I = yr(g, v);
    return Kf(I) ? I : void 0;
  }
  function td(g) {
    var v = Ke.call(g, Ct), I = g[Ct];
    try {
      g[Ct] = void 0;
      var L = !0;
    } catch {
    }
    var te = wa.call(g);
    return L && (v ? g[Ct] = I : delete g[Ct]), te;
  }
  var rd = Aa ? function(g) {
    return g == null ? [] : (g = Object(g), ve(Aa(g), function(v) {
      return Ta.call(g, v);
    }));
  } : dd, at = _r;
  (bi && at(new bi(new ArrayBuffer(1))) != H || wr && at(new wr()) != E || Oi && at(Oi.resolve()) != F || Ri && at(new Ri()) != re || Ii && at(new Ii()) != j) && (at = function(g) {
    var v = _r(g), I = v == S ? g.constructor : void 0, L = I ? Rt(I) : "";
    if (L)
      switch (L) {
        case vf:
          return H;
        case _f:
          return E;
        case Tf:
          return F;
        case Af:
          return re;
        case Sf:
          return j;
      }
    return v;
  });
  function nd(g, v) {
    return v = v ?? a, !!v && (typeof g == "number" || de.test(g)) && g > -1 && g % 1 == 0 && g < v;
  }
  function id(g) {
    var v = typeof g;
    return v == "string" || v == "number" || v == "symbol" || v == "boolean" ? g !== "__proto__" : g === null;
  }
  function od(g) {
    return !!ya && ya in g;
  }
  function ad(g) {
    var v = g && g.constructor, I = typeof v == "function" && v.prototype || dn;
    return g === I;
  }
  function sd(g) {
    return wa.call(g);
  }
  function Rt(g) {
    if (g != null) {
      try {
        return Ea.call(g);
      } catch {
      }
      try {
        return g + "";
      } catch {
      }
    }
    return "";
  }
  function Ia(g, v) {
    return g === v || g !== g && v !== v;
  }
  var ld = Ca(/* @__PURE__ */ function() {
    return arguments;
  }()) ? Ca : function(g) {
    return Tr(g) && Ke.call(g, "callee") && !Ta.call(g, "callee");
  }, En = Array.isArray;
  function cd(g) {
    return g != null && Pa(g.length) && !Na(g);
  }
  var Pi = yf || hd;
  function ud(g, v) {
    return ba(g, v);
  }
  function Na(g) {
    if (!Da(g))
      return !1;
    var v = _r(g);
    return v == m || v == w || v == h || v == x;
  }
  function Pa(g) {
    return typeof g == "number" && g > -1 && g % 1 == 0 && g <= a;
  }
  function Da(g) {
    var v = typeof g;
    return g != null && (v == "object" || v == "function");
  }
  function Tr(g) {
    return g != null && typeof g == "object";
  }
  var $a = ge ? Si(ge) : Jf;
  function fd(g) {
    return cd(g) ? zf(g) : Qf(g);
  }
  function dd() {
    return [];
  }
  function hd() {
    return !1;
  }
  e.exports = ud;
})(Jn, Jn.exports);
var kw = Jn.exports;
Object.defineProperty(an, "__esModule", { value: !0 });
an.DownloadedUpdateHelper = void 0;
an.createTempUpdateFile = qw;
const Mw = Jr, Bw = _t, Xs = kw, Pt = At, Dr = oe;
class Hw {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Dr.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, r, n, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Xs(this.versionInfo, r) && Xs(this.fileInfo.info, n.info) && await (0, Pt.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(n, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, r, n, i, o, a) {
    this._file = t, this._packageFile = r, this.versionInfo = n, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, a && await (0, Pt.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Pt.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, r) {
    const n = this.getUpdateInfoFile();
    if (!await (0, Pt.pathExists)(n))
      return null;
    let o;
    try {
      o = await (0, Pt.readJson)(n);
    } catch (h) {
      let c = "No cached update info available";
      return h.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), c += ` (error on read: ${h.message})`), r.info(c), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return r.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return r.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const s = Dr.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Pt.pathExists)(s))
      return r.info("Cached update file doesn't exist"), null;
    const l = await jw(s);
    return t.info.sha512 !== l ? (r.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${l}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, s);
  }
  getUpdateInfoFile() {
    return Dr.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
an.DownloadedUpdateHelper = Hw;
function jw(e, t = "sha512", r = "base64", n) {
  return new Promise((i, o) => {
    const a = (0, Mw.createHash)(t);
    a.on("error", o).setEncoding(r), (0, Bw.createReadStream)(e, {
      ...n,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      a.end(), i(a.read());
    }).pipe(a, { end: !1 });
  });
}
async function qw(e, t, r) {
  let n = 0, i = Dr.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Pt.unlink)(i), i;
    } catch (a) {
      if (a.code === "ENOENT")
        return i;
      r.warn(`Error on remove temp update file: ${a}`), i = Dr.join(t, `${n++}-${e}`);
    }
  return i;
}
var mi = {}, ca = {};
Object.defineProperty(ca, "__esModule", { value: !0 });
ca.getAppCacheDir = Ww;
const Ki = oe, Gw = ti;
function Ww() {
  const e = (0, Gw.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Ki.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Ki.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Ki.join(e, ".cache"), t;
}
Object.defineProperty(mi, "__esModule", { value: !0 });
mi.ElectronAppAdapter = void 0;
const Ks = oe, Vw = ca;
class zw {
  constructor(t = Mt.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Ks.join(process.resourcesPath, "app-update.yml") : Ks.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, Vw.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (r, n) => t(n));
  }
}
mi.ElectronAppAdapter = zw;
var qu = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = r;
  const t = fe;
  e.NET_SESSION_NAME = "electron-updater";
  function r() {
    return Mt.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class n extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, a, s) {
      return await s.cancellationToken.createPromise((l, h, c) => {
        const f = {
          headers: s.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: a,
          options: s,
          onCancel: c,
          callback: (d) => {
            d == null ? l(a) : h(d);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, a) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = r());
      const s = Mt.net.request({
        ...o,
        session: this.cachedSession
      });
      return s.on("response", a), this.proxyLoginCallback != null && s.on("login", this.proxyLoginCallback), s;
    }
    addRedirectHandlers(o, a, s, l, h) {
      o.on("redirect", (c, f, d) => {
        o.abort(), l > this.maxRedirects ? s(this.createMaxRedirectError()) : h(t.HttpExecutor.prepareRedirectUrlOptions(d, a));
      });
    }
  }
  e.ElectronHttpExecutor = n;
})(qu);
var sn = {}, Ye = {};
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.newBaseUrl = Yw;
Ye.newUrlFromBase = Xw;
Ye.getChannelFilename = Kw;
const Gu = Tt;
function Yw(e) {
  const t = new Gu.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function Xw(e, t, r = !1) {
  const n = new Gu.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? n.search = i : r && (n.search = `noCache=${Date.now().toString(32)}`), n;
}
function Kw(e) {
  return `${e}.yml`;
}
var ce = {}, Jw = "[object Symbol]", Wu = /[\\^$.*+?()[\]{}|]/g, Qw = RegExp(Wu.source), Zw = typeof be == "object" && be && be.Object === Object && be, ev = typeof self == "object" && self && self.Object === Object && self, tv = Zw || ev || Function("return this")(), rv = Object.prototype, nv = rv.toString, Js = tv.Symbol, Qs = Js ? Js.prototype : void 0, Zs = Qs ? Qs.toString : void 0;
function iv(e) {
  if (typeof e == "string")
    return e;
  if (av(e))
    return Zs ? Zs.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function ov(e) {
  return !!e && typeof e == "object";
}
function av(e) {
  return typeof e == "symbol" || ov(e) && nv.call(e) == Jw;
}
function sv(e) {
  return e == null ? "" : iv(e);
}
function lv(e) {
  return e = sv(e), e && Qw.test(e) ? e.replace(Wu, "\\$&") : e;
}
var Vu = lv;
Object.defineProperty(ce, "__esModule", { value: !0 });
ce.Provider = void 0;
ce.findFile = hv;
ce.parseUpdateInfo = pv;
ce.getFileList = zu;
ce.resolveFiles = mv;
const yt = fe, cv = we, uv = Tt, Qn = Ye, fv = Vu;
class dv {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, r, n, i = null) {
    const o = (0, Qn.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, Qn.newUrlFromBase)(`${t.pathname.replace(new RegExp(fv(n), "g"), r)}.blockmap`, i ? new uv.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, r, n) {
    return this.executor.request(this.createRequestOptions(t, r), n);
  }
  createRequestOptions(t, r) {
    const n = {};
    return this.requestHeaders == null ? r != null && (n.headers = r) : n.headers = r == null ? this.requestHeaders : { ...this.requestHeaders, ...r }, (0, yt.configureRequestUrl)(t, n), n;
  }
}
ce.Provider = dv;
function hv(e, t, r) {
  var n;
  if (e.length === 0)
    throw (0, yt.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((a) => a.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (n = i.find((a) => [a.url.pathname, a.info.url].some((s) => s.includes(process.arch)))) !== null && n !== void 0 ? n : i.shift();
  return o || (r == null ? e[0] : e.find((a) => !r.some((s) => a.url.pathname.toLowerCase().endsWith(`.${s.toLowerCase()}`))));
}
function pv(e, t, r) {
  if (e == null)
    throw (0, yt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let n;
  try {
    n = (0, cv.load)(e);
  } catch (i) {
    throw (0, yt.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${r}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return n;
}
function zu(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, yt.newError)(`No files provided: ${(0, yt.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function mv(e, t, r = (n) => n) {
  const i = zu(e).map((s) => {
    if (s.sha2 == null && s.sha512 == null)
      throw (0, yt.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, yt.safeStringifyJson)(s)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, Qn.newUrlFromBase)(r(s.url), t),
      info: s
    };
  }), o = e.packages, a = o == null ? null : o[process.arch] || o.ia32;
  return a != null && (i[0].packageInfo = {
    ...a,
    path: (0, Qn.newUrlFromBase)(r(a.path), t).href
  }), i;
}
Object.defineProperty(sn, "__esModule", { value: !0 });
sn.GenericProvider = void 0;
const el = fe, Ji = Ye, Qi = ce;
class gv extends Qi.Provider {
  constructor(t, r, n) {
    super(n), this.configuration = t, this.updater = r, this.baseUrl = (0, Ji.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Ji.getChannelFilename)(this.channel), r = (0, Ji.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let n = 0; ; n++)
      try {
        return (0, Qi.parseUpdateInfo)(await this.httpRequest(r), t, r);
      } catch (i) {
        if (i instanceof el.HttpError && i.statusCode === 404)
          throw (0, el.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && n < 3) {
          await new Promise((o, a) => {
            try {
              setTimeout(o, 1e3 * n);
            } catch (s) {
              a(s);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Qi.resolveFiles)(t, this.baseUrl);
  }
}
sn.GenericProvider = gv;
var gi = {}, Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.BitbucketProvider = void 0;
const tl = fe, Zi = Ye, eo = ce;
class Ev extends eo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Zi.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new tl.CancellationToken(), r = (0, Zi.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, Zi.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, void 0, t);
      return (0, eo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, tl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, eo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: r } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${r}, channel: ${this.channel})`;
  }
}
Ei.BitbucketProvider = Ev;
var wt = {};
Object.defineProperty(wt, "__esModule", { value: !0 });
wt.GitHubProvider = wt.BaseGitHubProvider = void 0;
wt.computeReleaseNotes = Xu;
const rt = fe, Ft = ju, yv = Tt, tr = Ye, Ro = ce, to = /\/tag\/([^/]+)$/;
class Yu extends Ro.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, tr.newBaseUrl)((0, rt.githubUrl)(t, r));
    const i = r === "github.com" ? "api.github.com" : r;
    this.baseApiUrl = (0, tr.newBaseUrl)((0, rt.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const r = this.options.host;
    return r && !["github.com", "api.github.com"].includes(r) ? `/api/v3${t}` : t;
  }
}
wt.BaseGitHubProvider = Yu;
class wv extends Yu {
  constructor(t, r, n) {
    super(t, "github.com", n), this.options = t, this.updater = r;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, r, n, i, o;
    const a = new rt.CancellationToken(), s = await this.httpRequest((0, tr.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, a), l = (0, rt.parseXml)(s);
    let h = l.element("entry", !1, "No published versions on GitHub"), c = null;
    try {
      if (this.updater.allowPrerelease) {
        const T = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((r = Ft.prerelease(this.updater.currentVersion)) === null || r === void 0 ? void 0 : r[0]) || null;
        if (T === null)
          c = to.exec(h.element("link").attribute("href"))[1];
        else
          for (const A of l.getElements("entry")) {
            const S = to.exec(A.element("link").attribute("href"));
            if (S === null)
              continue;
            const F = S[1], x = ((n = Ft.prerelease(F)) === null || n === void 0 ? void 0 : n[0]) || null, J = !T || ["alpha", "beta"].includes(T), re = x !== null && !["alpha", "beta"].includes(String(x));
            if (J && !re && !(T === "beta" && x === "alpha")) {
              c = F;
              break;
            }
            if (x && x === T) {
              c = F;
              break;
            }
          }
      } else {
        c = await this.getLatestTagName(a);
        for (const T of l.getElements("entry"))
          if (to.exec(T.element("link").attribute("href"))[1] === c) {
            h = T;
            break;
          }
      }
    } catch (T) {
      throw (0, rt.newError)(`Cannot parse releases feed: ${T.stack || T.message},
XML:
${s}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (c == null)
      throw (0, rt.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, d = "", m = "";
    const w = async (T) => {
      d = (0, tr.getChannelFilename)(T), m = (0, tr.newUrlFromBase)(this.getBaseDownloadPath(String(c), d), this.baseUrl);
      const A = this.createRequestOptions(m);
      try {
        return await this.executor.request(A, a);
      } catch (S) {
        throw S instanceof rt.HttpError && S.statusCode === 404 ? (0, rt.newError)(`Cannot find ${d} in the latest release artifacts (${m}): ${S.stack || S.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : S;
      }
    };
    try {
      let T = this.channel;
      this.updater.allowPrerelease && (!((i = Ft.prerelease(c)) === null || i === void 0) && i[0]) && (T = this.getCustomChannelName(String((o = Ft.prerelease(c)) === null || o === void 0 ? void 0 : o[0]))), f = await w(T);
    } catch (T) {
      if (this.updater.allowPrerelease)
        f = await w(this.getDefaultChannelName());
      else
        throw T;
    }
    const E = (0, Ro.parseUpdateInfo)(f, d, m);
    return E.releaseName == null && (E.releaseName = h.elementValueOrEmpty("title")), E.releaseNotes == null && (E.releaseNotes = Xu(this.updater.currentVersion, this.updater.fullChangelog, l, h)), {
      tag: c,
      ...E
    };
  }
  async getLatestTagName(t) {
    const r = this.options, n = r.host == null || r.host === "github.com" ? (0, tr.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new yv.URL(`${this.computeGithubBasePath(`/repos/${r.owner}/${r.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(n, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, rt.newError)(`Unable to find latest version on GitHub (${n}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Ro.resolveFiles)(t, this.baseUrl, (r) => this.getBaseDownloadPath(t.tag, r.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, r) {
    return `${this.basePath}/download/${t}/${r}`;
  }
}
wt.GitHubProvider = wv;
function rl(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function Xu(e, t, r, n) {
  if (!t)
    return rl(n);
  const i = [];
  for (const o of r.getElements("entry")) {
    const a = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Ft.valid(a) && Ft.lt(e, a) && i.push({
      version: a,
      note: rl(o)
    });
  }
  return i.sort((o, a) => Ft.rcompare(o.version, a.version));
}
var yi = {};
Object.defineProperty(yi, "__esModule", { value: !0 });
yi.GitLabProvider = void 0;
const Se = fe, ro = Tt, vv = Vu, Dn = Ye, no = ce;
class _v extends no.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, r, n) {
    super({
      ...n,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = r, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Dn.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new Se.CancellationToken(), r = (0, Dn.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let n;
    try {
      const d = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, m = await this.httpRequest(r, d, t);
      if (!m)
        throw (0, Se.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      n = JSON.parse(m);
    } catch (d) {
      throw (0, Se.newError)(`Unable to find latest release on GitLab (${r}): ${d.stack || d.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = n.tag_name;
    let o = null, a = "", s = null;
    const l = async (d) => {
      a = (0, Dn.getChannelFilename)(d);
      const m = n.assets.links.find((E) => E.name === a);
      if (!m)
        throw (0, Se.newError)(`Cannot find ${a} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      s = new ro.URL(m.direct_asset_url);
      const w = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const E = await this.httpRequest(s, w, t);
        if (!E)
          throw (0, Se.newError)(`Empty response from ${s}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return E;
      } catch (E) {
        throw E instanceof Se.HttpError && E.statusCode === 404 ? (0, Se.newError)(`Cannot find ${a} in the latest release artifacts (${s}): ${E.stack || E.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : E;
      }
    };
    try {
      o = await l(this.channel);
    } catch (d) {
      if (this.channel !== this.getDefaultChannelName())
        o = await l(this.getDefaultChannelName());
      else
        throw d;
    }
    if (!o)
      throw (0, Se.newError)(`Unable to parse channel data from ${a}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const h = (0, no.parseUpdateInfo)(o, a, s);
    h.releaseName == null && (h.releaseName = n.name), h.releaseNotes == null && (h.releaseNotes = n.description || null);
    const c = /* @__PURE__ */ new Map();
    for (const d of n.assets.links)
      c.set(this.normalizeFilename(d.name), d.direct_asset_url);
    const f = {
      tag: i,
      assets: c,
      ...h
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const r = /* @__PURE__ */ new Map();
    for (const n of t.links)
      r.set(this.normalizeFilename(n.name), n.direct_asset_url);
    return r;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, r) {
    const n = [`${r}.blockmap`, `${this.normalizeFilename(r)}.blockmap`];
    for (const i of n) {
      const o = t.get(i);
      if (o)
        return new ro.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const r = new Se.CancellationToken(), n = [`v${t}`, t];
    for (const i of n) {
      const o = (0, Dn.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const a = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, s = await this.httpRequest(o, a, r);
        if (s)
          return JSON.parse(s);
      } catch (a) {
        if (a instanceof Se.HttpError && a.statusCode === 404)
          continue;
        throw (0, Se.newError)(`Unable to find release ${i} on GitLab (${o}): ${a.stack || a.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, Se.newError)(`Unable to find release with version ${t} (tried: ${n.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const r = {};
    return t != null && (t.startsWith("Bearer") ? r.authorization = t : r["PRIVATE-TOKEN"] = t), r;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const r = await this.fetchReleaseInfoByVersion(t);
    return r && r.assets ? this.convertAssetsToMap(r.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, r, n) {
    let i = null, o = null;
    const a = await this.getVersionInfoForBlockMap(r);
    a && (i = this.findBlockMapInAssets(a, n));
    const s = await this.getVersionInfoForBlockMap(t);
    if (s) {
      const l = n.replace(new RegExp(vv(r), "g"), t);
      o = this.findBlockMapInAssets(s, l);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, r, n, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [a, s] = await this.findBlockMapUrlsFromAssets(r, n, o);
      if (!s)
        throw (0, Se.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!a)
        throw (0, Se.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [a, s];
    } else
      return super.getBlockMapFiles(t, r, n, i);
  }
  resolveFiles(t) {
    return (0, no.getFileList)(t).map((r) => {
      const i = [
        r.url,
        // Original filename
        this.normalizeFilename(r.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((a) => t.assets.has(a)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, Se.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ro.URL(o),
        info: r
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
yi.GitLabProvider = _v;
var wi = {};
Object.defineProperty(wi, "__esModule", { value: !0 });
wi.KeygenProvider = void 0;
const nl = fe, io = Ye, oo = ce;
class Tv extends oo.Provider {
  constructor(t, r, n) {
    super({
      ...n,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = r, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, io.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new nl.CancellationToken(), r = (0, io.getChannelFilename)(this.getCustomChannelName(this.channel)), n = (0, io.newUrlFromBase)(r, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(n, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, oo.parseUpdateInfo)(i, r, n);
    } catch (i) {
      throw (0, nl.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, oo.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: r, platform: n } = this.configuration;
    return `Keygen (account: ${t}, product: ${r}, platform: ${n}, channel: ${this.channel})`;
  }
}
wi.KeygenProvider = Tv;
var vi = {};
Object.defineProperty(vi, "__esModule", { value: !0 });
vi.PrivateGitHubProvider = void 0;
const Yt = fe, Av = we, Sv = oe, il = Tt, ol = Ye, Cv = wt, bv = ce;
class Ov extends Cv.BaseGitHubProvider {
  constructor(t, r, n, i) {
    super(t, "api.github.com", i), this.updater = r, this.token = n;
  }
  createRequestOptions(t, r) {
    const n = super.createRequestOptions(t, r);
    return n.redirect = "manual", n;
  }
  async getLatestVersion() {
    const t = new Yt.CancellationToken(), r = (0, ol.getChannelFilename)(this.getDefaultChannelName()), n = await this.getLatestVersionInfo(t), i = n.assets.find((s) => s.name === r);
    if (i == null)
      throw (0, Yt.newError)(`Cannot find ${r} in the release ${n.html_url || n.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new il.URL(i.url);
    let a;
    try {
      a = (0, Av.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (s) {
      throw s instanceof Yt.HttpError && s.statusCode === 404 ? (0, Yt.newError)(`Cannot find ${r} in the latest release artifacts (${o}): ${s.stack || s.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : s;
    }
    return a.assets = n.assets, a;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const r = this.updater.allowPrerelease;
    let n = this.basePath;
    r || (n = `${n}/latest`);
    const i = (0, ol.newUrlFromBase)(n, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return r ? o.find((a) => a.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Yt.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, bv.getFileList)(t).map((r) => {
      const n = Sv.posix.basename(r.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === n);
      if (i == null)
        throw (0, Yt.newError)(`Cannot find asset "${n}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new il.URL(i.url),
        info: r
      };
    });
  }
}
vi.PrivateGitHubProvider = Ov;
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.isUrlProbablySupportMultiRangeRequests = Ku;
gi.createClient = $v;
const $n = fe, Rv = Ei, al = sn, Iv = wt, Nv = yi, Pv = wi, Dv = vi;
function Ku(e) {
  return !e.includes("s3.amazonaws.com");
}
function $v(e, t, r) {
  if (typeof e == "string")
    throw (0, $n.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const n = e.provider;
  switch (n) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new Iv.GitHubProvider(i, t, r) : new Dv.PrivateGitHubProvider(i, t, o, r);
    }
    case "bitbucket":
      return new Rv.BitbucketProvider(e, t, r);
    case "gitlab":
      return new Nv.GitLabProvider(e, t, r);
    case "keygen":
      return new Pv.KeygenProvider(e, t, r);
    case "s3":
    case "spaces":
      return new al.GenericProvider({
        provider: "generic",
        url: (0, $n.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...r,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new al.GenericProvider(i, t, {
        ...r,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && Ku(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, $n.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, r);
    }
    default:
      throw (0, $n.newError)(`Unsupported provider: ${n}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var _i = {}, ln = {}, gr = {}, Gt = {};
Object.defineProperty(Gt, "__esModule", { value: !0 });
Gt.OperationKind = void 0;
Gt.computeOperations = Fv;
var xt;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(xt || (Gt.OperationKind = xt = {}));
function Fv(e, t, r) {
  const n = ll(e.files), i = ll(t.files);
  let o = null;
  const a = t.files[0], s = [], l = a.name, h = n.get(l);
  if (h == null)
    throw new Error(`no file ${l} in old blockmap`);
  const c = i.get(l);
  let f = 0;
  const { checksumToOffset: d, checksumToOldSize: m } = Lv(n.get(l), h.offset, r);
  let w = a.offset;
  for (let E = 0; E < c.checksums.length; w += c.sizes[E], E++) {
    const T = c.sizes[E], A = c.checksums[E];
    let S = d.get(A);
    S != null && m.get(A) !== T && (r.warn(`Checksum ("${A}") matches, but size differs (old: ${m.get(A)}, new: ${T})`), S = void 0), S === void 0 ? (f++, o != null && o.kind === xt.DOWNLOAD && o.end === w ? o.end += T : (o = {
      kind: xt.DOWNLOAD,
      start: w,
      end: w + T
      // oldBlocks: null,
    }, sl(o, s, A, E))) : o != null && o.kind === xt.COPY && o.end === S ? o.end += T : (o = {
      kind: xt.COPY,
      start: S,
      end: S + T
      // oldBlocks: [checksum]
    }, sl(o, s, A, E));
  }
  return f > 0 && r.info(`File${a.name === "file" ? "" : " " + a.name} has ${f} changed blocks`), s;
}
const xv = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function sl(e, t, r, n) {
  if (xv && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((a, s) => a < s ? a : s);
      throw new Error(`operation (block index: ${n}, checksum: ${r}, kind: ${xt[e.kind]}) overlaps previous operation (checksum: ${r}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function Lv(e, t, r) {
  const n = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let a = 0; a < e.checksums.length; a++) {
    const s = e.checksums[a], l = e.sizes[a], h = i.get(s);
    if (h === void 0)
      n.set(s, o), i.set(s, l);
    else if (r.debug != null) {
      const c = h === l ? "(same size)" : `(size: ${h}, this size: ${l})`;
      r.debug(`${s} duplicated in blockmap ${c}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += l;
  }
  return { checksumToOffset: n, checksumToOldSize: i };
}
function ll(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e)
    t.set(r.name, r);
  return t;
}
Object.defineProperty(gr, "__esModule", { value: !0 });
gr.DataSplitter = void 0;
gr.copyData = Ju;
const Fn = fe, Uv = _t, kv = Kr, Mv = Gt, cl = Buffer.from(`\r
\r
`);
var ct;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(ct || (ct = {}));
function Ju(e, t, r, n, i) {
  const o = (0, Uv.createReadStream)("", {
    fd: r,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", n), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class Bv extends kv.Writable {
  constructor(t, r, n, i, o, a, s, l) {
    super(), this.out = t, this.options = r, this.partIndexToTaskIndex = n, this.partIndexToLength = o, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = l, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = ct.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, r, n) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      n();
    }).catch(n);
  }
  async handleData(t) {
    let r = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Fn.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const n = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= n, r = n;
    } else if (this.remainingPartDataCount > 0) {
      const n = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= n, await this.processPartData(t, 0, n), r = n;
    }
    if (r !== t.length) {
      if (this.readState === ct.HEADER) {
        const n = this.searchHeaderListEnd(t, r);
        if (n === -1)
          return;
        r = n, this.readState = ct.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === ct.BODY)
          this.readState = ct.INIT;
        else {
          this.partIndex++;
          let a = this.partIndexToTaskIndex.get(this.partIndex);
          if (a == null)
            if (this.isFinished)
              a = this.options.end;
            else
              throw (0, Fn.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const s = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (s < a)
            await this.copyExistingData(s, a);
          else if (s > a)
            throw (0, Fn.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (r = this.searchHeaderListEnd(t, r), r === -1) {
            this.readState = ct.HEADER;
            return;
          }
        }
        const n = this.partIndexToLength[this.partIndex], i = r + n, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, r, o), this.remainingPartDataCount = n - (o - r), this.remainingPartDataCount > 0)
          return;
        if (r = i + this.boundaryLength, r >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, r) {
    return new Promise((n, i) => {
      const o = () => {
        if (t === r) {
          n();
          return;
        }
        const a = this.options.tasks[t];
        if (a.kind !== Mv.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Ju(a, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, r) {
    const n = t.indexOf(cl, r);
    if (n !== -1)
      return n + cl.length;
    const i = r === 0 ? t : t.slice(r);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Fn.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, r, n) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, r, n);
  }
  processPartData(t, r, n) {
    this.actualPartLength += n - r, this.transferred += n - r, this.delta += n - r;
    const i = this.out;
    return i.write(r === 0 && t.length === n ? t : t.slice(r, n)) ? Promise.resolve() : new Promise((o, a) => {
      i.on("error", a), i.once("drain", () => {
        i.removeListener("error", a), o();
      });
    });
  }
}
gr.DataSplitter = Bv;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.executeTasksUsingMultipleRangeRequests = Hv;
Ti.checkIsRangesSupported = No;
const Io = fe, ul = gr, fl = Gt;
function Hv(e, t, r, n, i) {
  const o = (a) => {
    if (a >= t.length) {
      e.fileMetadataBuffer != null && r.write(e.fileMetadataBuffer), r.end();
      return;
    }
    const s = a + 1e3;
    jv(e, {
      tasks: t,
      start: a,
      end: Math.min(t.length, s),
      oldFileFd: n
    }, r, () => o(s), i);
  };
  return o;
}
function jv(e, t, r, n, i) {
  let o = "bytes=", a = 0, s = 0;
  const l = /* @__PURE__ */ new Map(), h = [];
  for (let d = t.start; d < t.end; d++) {
    const m = t.tasks[d];
    m.kind === fl.OperationKind.DOWNLOAD && (o += `${m.start}-${m.end - 1}, `, l.set(a, d), a++, h.push(m.end - m.start), s += m.end - m.start);
  }
  if (a <= 1) {
    const d = (m) => {
      if (m >= t.end) {
        n();
        return;
      }
      const w = t.tasks[m++];
      if (w.kind === fl.OperationKind.COPY)
        (0, ul.copyData)(w, r, t.oldFileFd, i, () => d(m));
      else {
        const E = e.createRequestOptions();
        E.headers.Range = `bytes=${w.start}-${w.end - 1}`;
        const T = e.httpExecutor.createRequest(E, (A) => {
          A.on("error", i), No(A, i) && (A.pipe(r, {
            end: !1
          }), A.once("end", () => d(m)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(T, i), T.end();
      }
    };
    d(t.start);
    return;
  }
  const c = e.createRequestOptions();
  c.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(c, (d) => {
    if (!No(d, i))
      return;
    const m = (0, Io.safeGetHeader)(d, "content-type"), w = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(m);
    if (w == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${m}"`));
      return;
    }
    const E = new ul.DataSplitter(r, t, l, w[1] || w[2], h, n, s, e.options.onProgress);
    E.on("error", i), d.pipe(E), d.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function No(e, t) {
  if (e.statusCode >= 400)
    return t((0, Io.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const r = (0, Io.safeGetHeader)(e, "accept-ranges");
    if (r == null || r === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.ProgressDifferentialDownloadCallbackTransform = void 0;
const qv = Kr;
var rr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(rr || (rr = {}));
class Gv extends qv.Transform {
  constructor(t, r, n) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = r, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = rr.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, r, n) {
    if (this.cancellationToken.cancelled) {
      n(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == rr.COPY) {
      n(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), n(null, t);
  }
  beginFileCopy() {
    this.operationType = rr.COPY;
  }
  beginRangeDownload() {
    this.operationType = rr.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
Ai.ProgressDifferentialDownloadCallbackTransform = Gv;
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.DifferentialDownloader = void 0;
const Cr = fe, ao = At, Wv = _t, Vv = gr, zv = Tt, xn = Gt, dl = Ti, Yv = Ai;
class Xv {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, r, n) {
    this.blockAwareFileInfo = t, this.httpExecutor = r, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, Cr.configureRequestUrl)(this.options.newUrl, t), (0, Cr.configureRequestOptions)(t), t;
  }
  doDownload(t, r) {
    if (t.version !== r.version)
      throw new Error(`version is different (${t.version} - ${r.version}), full download is required`);
    const n = this.logger, i = (0, xn.computeOperations)(t, r, n);
    n.debug != null && n.debug(JSON.stringify(i, null, 2));
    let o = 0, a = 0;
    for (const l of i) {
      const h = l.end - l.start;
      l.kind === xn.OperationKind.DOWNLOAD ? o += h : a += h;
    }
    const s = this.blockAwareFileInfo.size;
    if (o + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${a}, newSize: ${s}`);
    return n.info(`Full: ${hl(s)}, To download: ${hl(o)} (${Math.round(o / (s / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const r = [], n = () => Promise.all(r.map((i) => (0, ao.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, r).then(n).catch((i) => n().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (a) {
        try {
          console.error(a);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, r) {
    const n = await (0, ao.open)(this.options.oldFile, "r");
    r.push({ descriptor: n, path: this.options.oldFile });
    const i = await (0, ao.open)(this.options.newFile, "w");
    r.push({ descriptor: i, path: this.options.newFile });
    const o = (0, Wv.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((a, s) => {
      const l = [];
      let h;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const A = [];
        let S = 0;
        for (const x of t)
          x.kind === xn.OperationKind.DOWNLOAD && (A.push(x.end - x.start), S += x.end - x.start);
        const F = {
          expectedByteCounts: A,
          grandTotal: S
        };
        h = new Yv.ProgressDifferentialDownloadCallbackTransform(F, this.options.cancellationToken, this.options.onProgress), l.push(h);
      }
      const c = new Cr.DigestTransform(this.blockAwareFileInfo.sha512);
      c.isValidateOnEnd = !1, l.push(c), o.on("finish", () => {
        o.close(() => {
          r.splice(1, 1);
          try {
            c.validate();
          } catch (A) {
            s(A);
            return;
          }
          a(void 0);
        });
      }), l.push(o);
      let f = null;
      for (const A of l)
        A.on("error", s), f == null ? f = A : f = f.pipe(A);
      const d = l[0];
      let m;
      if (this.options.isUseMultipleRangeRequest) {
        m = (0, dl.executeTasksUsingMultipleRangeRequests)(this, t, d, n, s), m(0);
        return;
      }
      let w = 0, E = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const T = this.createRequestOptions();
      T.redirect = "manual", m = (A) => {
        var S, F;
        if (A >= t.length) {
          this.fileMetadataBuffer != null && d.write(this.fileMetadataBuffer), d.end();
          return;
        }
        const x = t[A++];
        if (x.kind === xn.OperationKind.COPY) {
          h && h.beginFileCopy(), (0, Vv.copyData)(x, d, n, s, () => m(A));
          return;
        }
        const J = `bytes=${x.start}-${x.end - 1}`;
        T.headers.range = J, (F = (S = this.logger) === null || S === void 0 ? void 0 : S.debug) === null || F === void 0 || F.call(S, `download range: ${J}`), h && h.beginRangeDownload();
        const re = this.httpExecutor.createRequest(T, (V) => {
          V.on("error", s), V.on("aborted", () => {
            s(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && s((0, Cr.createHttpError)(V)), V.pipe(d, {
            end: !1
          }), V.once("end", () => {
            h && h.endRangeDownload(), ++w === 100 ? (w = 0, setTimeout(() => m(A), 1e3)) : m(A);
          });
        });
        re.on("redirect", (V, me, y) => {
          this.logger.info(`Redirect to ${Kv(y)}`), E = y, (0, Cr.configureRequestUrl)(new zv.URL(E), T), re.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(re, s), re.end();
      }, m(0);
    });
  }
  async readRemoteBytes(t, r) {
    const n = Buffer.allocUnsafe(r + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${r}`;
    let o = 0;
    if (await this.request(i, (a) => {
      a.copy(n, o), o += a.length;
    }), o !== n.length)
      throw new Error(`Received data length ${o} is not equal to expected ${n.length}`);
    return n;
  }
  request(t, r) {
    return new Promise((n, i) => {
      const o = this.httpExecutor.createRequest(t, (a) => {
        (0, dl.checkIsRangesSupported)(a, i) && (a.on("error", i), a.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), a.on("data", r), a.on("end", () => n()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
ln.DifferentialDownloader = Xv;
function hl(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function Kv(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.GenericDifferentialDownloader = void 0;
const Jv = ln;
class Qv extends Jv.DifferentialDownloader {
  download(t, r) {
    return this.doDownload(t, r);
  }
}
_i.GenericDifferentialDownloader = Qv;
var St = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
  const t = fe;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class r {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      n(this.emitter, "login", o);
    }
    progress(o) {
      n(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      n(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      n(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = r;
  function n(i, o, a) {
    i.on(o, a);
  }
})(St);
Object.defineProperty(mt, "__esModule", { value: !0 });
mt.NoOpLogger = mt.AppUpdater = void 0;
const Ce = fe, Zv = Jr, e_ = ti, t_ = ql, He = At, r_ = we, so = ci, je = oe, Dt = ju, pl = an, n_ = mi, ml = qu, i_ = sn, lo = gi, co = Wl, o_ = _i, Xt = St;
class ua extends t_.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, Ce.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, Ce.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, ml.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new Qu();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new so.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, r) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Xt.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new so.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new so.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), r == null ? (this.app = new n_.ElectronAppAdapter(), this.httpExecutor = new ml.ElectronHttpExecutor((o, a) => this.emit("login", o, a))) : (this.app = r, this.httpExecutor = null);
    const n = this.app.version, i = (0, Dt.parse)(n);
    if (i == null)
      throw (0, Ce.newError)(`App version is not a valid semver version: "${n}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = a_(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const r = this.createProviderRuntimeOptions();
    let n;
    typeof t == "string" ? n = new i_.GenericProvider({ provider: "generic", url: t }, this, {
      ...r,
      isUseMultipleRangeRequest: (0, lo.isUrlProbablySupportMultiRangeRequests)(t)
    }) : n = (0, lo.createClient)(t, this, r), this.clientPromise = Promise.resolve(n);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const r = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((n) => (r(), n)).catch((n) => {
      throw r(), this.emit("error", n, `Cannot check for updates: ${(n.stack || n).toString()}`), n;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((r) => r != null && r.downloadPromise ? (r.downloadPromise.then(() => {
      const n = ua.formatDownloadNotification(r.updateInfo.version, this.app.name, t);
      new Mt.Notification(n).show();
    }), r) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), r));
  }
  static formatDownloadNotification(t, r, n) {
    return n == null && (n = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), n = {
      title: n.title.replace("{appName}", r).replace("{version}", t),
      body: n.body.replace("{appName}", r).replace("{version}", t)
    }, n;
  }
  async isStagingMatch(t) {
    const r = t.stagingPercentage;
    let n = r;
    if (n == null)
      return !0;
    if (n = parseInt(n, 10), isNaN(n))
      return this._logger.warn(`Staging percentage is NaN: ${r}`), !0;
    n = n / 100;
    const i = await this.stagingUserIdPromise.value, a = Ce.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${n}, percentage: ${a}, user id: ${i}`), a < n;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const r = (0, Dt.parse)(t.version);
    if (r == null)
      throw (0, Ce.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const n = this.currentVersion;
    if ((0, Dt.eq)(r, n) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Dt.gt)(r, n), a = (0, Dt.lt)(r, n);
    return o ? !0 : this.allowDowngrade && a;
  }
  checkIfUpdateSupported(t) {
    const r = t == null ? void 0 : t.minimumSystemVersion, n = (0, e_.release)();
    if (r)
      try {
        if ((0, Dt.lt)(n, r))
          return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${r} for version ${n}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${r}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((n) => (0, lo.createClient)(n, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, r = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": r })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), r = t.info;
    if (!await this.isUpdateAvailable(r))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${r.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", r), {
        isUpdateAvailable: !1,
        versionInfo: r,
        updateInfo: r
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(r);
    const n = new Ce.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: r,
      updateInfo: r,
      cancellationToken: n,
      downloadPromise: this.autoDownload ? this.downloadUpdate(n) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, Ce.asArray)(t.files).map((r) => r.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new Ce.CancellationToken()) {
    const r = this.updateInfoAndProvider;
    if (r == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, Ce.asArray)(r.info.files).map((i) => i.url).join(", ")}`);
    const n = (i) => {
      if (!(i instanceof Ce.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: r,
      requestHeaders: this.computeRequestHeaders(r.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw n(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(Xt.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, r_.load)(await (0, He.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const r = t.fileExtraDownloadHeaders;
    if (r != null) {
      const n = this.requestHeaders;
      return n == null ? r : {
        ...r,
        ...n
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = je.join(this.app.userDataPath, ".updaterId");
    try {
      const n = await (0, He.readFile)(t, "utf-8");
      if (Ce.UUID.check(n))
        return n;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
    } catch (n) {
      n.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${n}`);
    }
    const r = Ce.UUID.v5((0, Zv.randomBytes)(4096), Ce.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${r}`);
    try {
      await (0, He.outputFile)(t, r);
    } catch (n) {
      this._logger.warn(`Couldn't write out staging user ID: ${n}`);
    }
    return r;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const r of Object.keys(t)) {
      const n = r.toLowerCase();
      if (n === "authorization" || n === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const r = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
      r == null && n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = je.join(this.app.baseCachePath, r || this.app.name);
      n.debug != null && n.debug(`updater cache dir: ${i}`), t = new pl.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const r = t.fileInfo, n = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: r.info.sha2,
      sha512: r.info.sha512
    };
    this.listenerCount(Xt.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (S) => this.emit(Xt.DOWNLOAD_PROGRESS, S));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, a = r.packageInfo;
    function s() {
      const S = decodeURIComponent(t.fileInfo.url.pathname);
      return S.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? je.basename(S) : t.fileInfo.info.url;
    }
    const l = await this.getOrCreateDownloadHelper(), h = l.cacheDirForPendingUpdate;
    await (0, He.mkdir)(h, { recursive: !0 });
    const c = s();
    let f = je.join(h, c);
    const d = a == null ? null : je.join(h, `package-${o}${je.extname(a.path) || ".7z"}`), m = async (S) => {
      await l.setDownloadedFile(f, d, i, r, c, S), await t.done({
        ...i,
        downloadedFile: f
      });
      const F = je.join(h, "current.blockmap");
      return await (0, He.pathExists)(F) && await (0, He.copyFile)(F, je.join(l.cacheDir, "current.blockmap")), d == null ? [f] : [f, d];
    }, w = this._logger, E = await l.validateDownloadedPath(f, i, r, w);
    if (E != null)
      return f = E, await m(!1);
    const T = async () => (await l.clear().catch(() => {
    }), await (0, He.unlink)(f).catch(() => {
    })), A = await (0, pl.createTempUpdateFile)(`temp-${c}`, h, w);
    try {
      await t.task(A, n, d, T), await (0, Ce.retry)(() => (0, He.rename)(A, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (S) => S instanceof Error && /^EBUSY:/.test(S.message) ? !0 : (w.warn(`Cannot rename temp file to final file: ${S.message || S.stack}`), !1)
      });
    } catch (S) {
      throw await T(), S instanceof Ce.CancellationError && (w.info("cancelled"), this.emit("update-cancelled", i)), S;
    }
    return w.info(`New version ${o} has been downloaded to ${f}`), await m(!0);
  }
  async differentialDownloadInstaller(t, r, n, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const a = r.updateInfoAndProvider.provider, s = await a.getBlockMapFiles(t.url, this.app.version, r.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${s[0]}", new: ${s[1]})`);
      const l = async (w) => {
        const E = await this.httpExecutor.downloadToBuffer(w, {
          headers: r.requestHeaders,
          cancellationToken: r.cancellationToken
        });
        if (E == null || E.length === 0)
          throw new Error(`Blockmap "${w.href}" is empty`);
        try {
          return JSON.parse((0, co.gunzipSync)(E).toString());
        } catch (T) {
          throw new Error(`Cannot parse blockmap "${w.href}", error: ${T}`);
        }
      }, h = {
        newUrl: t.url,
        oldFile: je.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: a.isUseMultipleRangeRequest,
        requestHeaders: r.requestHeaders,
        cancellationToken: r.cancellationToken
      };
      this.listenerCount(Xt.DOWNLOAD_PROGRESS) > 0 && (h.onProgress = (w) => this.emit(Xt.DOWNLOAD_PROGRESS, w));
      const c = async (w, E) => {
        const T = je.join(E, "current.blockmap");
        await (0, He.outputFile)(T, (0, co.gzipSync)(JSON.stringify(w)));
      }, f = async (w) => {
        const E = je.join(w, "current.blockmap");
        try {
          if (await (0, He.pathExists)(E))
            return JSON.parse((0, co.gunzipSync)(await (0, He.readFile)(E)).toString());
        } catch (T) {
          this._logger.warn(`Cannot parse blockmap "${E}", error: ${T}`);
        }
        return null;
      }, d = await l(s[1]);
      await c(d, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let m = await f(this.downloadedUpdateHelper.cacheDir);
      return m == null && (m = await l(s[0])), await new o_.GenericDifferentialDownloader(t.info, this.httpExecutor, h).download(m, d), !1;
    } catch (a) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), this._testOnlyOptions != null)
        throw a;
      return !0;
    }
  }
}
mt.AppUpdater = ua;
function a_(e) {
  const t = (0, Dt.prerelease)(e);
  return t != null && t.length > 0;
}
class Qu {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
mt.NoOpLogger = Qu;
Object.defineProperty(qt, "__esModule", { value: !0 });
qt.BaseUpdater = void 0;
const gl = ei, s_ = mt;
class l_ extends s_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, r = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? r : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Mt.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (r) => (this.dispatchUpdateDownloaded(r), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, r = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const n = this.downloadedUpdateHelper, i = this.installerPath, o = n == null ? null : n.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${r}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: r,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (a) {
      return this.dispatchError(a), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, r = [], n = {}) {
    this._logger.info(`Executing: ${t} with args: ${r}`);
    const i = (0, gl.spawnSync)(t, r, {
      env: { ...process.env, ...n },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: a, stdout: s, stderr: l } = i;
    if (o != null)
      throw this._logger.error(l), o;
    if (a != null && a !== 0)
      throw this._logger.error(l), new Error(`Command ${t} exited with code ${a}`);
    return s.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, r = [], n = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${r}`), new Promise((o, a) => {
      try {
        const s = { stdio: i, env: n, detached: !0 }, l = (0, gl.spawn)(t, r, s);
        l.on("error", (h) => {
          a(h);
        }), l.unref(), l.pid !== void 0 && o(!0);
      } catch (s) {
        a(s);
      }
    });
  }
}
qt.BaseUpdater = l_;
var qr = {}, cn = {};
Object.defineProperty(cn, "__esModule", { value: !0 });
cn.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Kt = At, c_ = ln, u_ = Wl;
class f_ extends c_.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, r = t.size, n = r - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(n, r - 1);
    const i = Zu(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await d_(this.options.oldFile), i);
  }
}
cn.FileWithEmbeddedBlockMapDifferentialDownloader = f_;
function Zu(e) {
  return JSON.parse((0, u_.inflateRawSync)(e).toString());
}
async function d_(e) {
  const t = await (0, Kt.open)(e, "r");
  try {
    const r = (await (0, Kt.fstat)(t)).size, n = Buffer.allocUnsafe(4);
    await (0, Kt.read)(t, n, 0, n.length, r - n.length);
    const i = Buffer.allocUnsafe(n.readUInt32BE(0));
    return await (0, Kt.read)(t, i, 0, i.length, r - n.length - i.length), await (0, Kt.close)(t), Zu(i);
  } catch (r) {
    throw await (0, Kt.close)(t), r;
  }
}
Object.defineProperty(qr, "__esModule", { value: !0 });
qr.AppImageUpdater = void 0;
const El = fe, yl = ei, h_ = At, p_ = _t, br = oe, m_ = qt, g_ = cn, E_ = ce, wl = St;
class y_ extends m_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, E_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const a = process.env.APPIMAGE;
        if (a == null)
          throw (0, El.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(n, a, i, r, t)) && await this.httpExecutor.download(n.url, i, o), await (0, h_.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, r, n, i, o) {
    try {
      const a = {
        newUrl: t.url,
        oldFile: r,
        logger: this._logger,
        newFile: n,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(wl.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (s) => this.emit(wl.DOWNLOAD_PROGRESS, s)), await new g_.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, a).download(), !1;
    } catch (a) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${a.stack || a}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const r = process.env.APPIMAGE;
    if (r == null)
      throw (0, El.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, p_.unlinkSync)(r);
    let n;
    const i = br.basename(r), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    br.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? n = r : n = br.join(br.dirname(r), br.basename(o)), (0, yl.execFileSync)("mv", ["-f", o, n]), n !== r && this.emit("appimage-filename-updated", n);
    const a = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(n, [], a) : (a.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, yl.execFileSync)(n, [], { env: a })), !0;
  }
}
qr.AppImageUpdater = y_;
var Gr = {}, Er = {};
Object.defineProperty(Er, "__esModule", { value: !0 });
Er.LinuxUpdater = void 0;
const w_ = qt;
class v_ extends w_.BaseUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, r;
    return (r = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && r !== void 0 ? r : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: r } = this.app, n = `"${r} would like to update"`, i = this.sudoWithArgs(n);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let o = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (o = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const r = this.determineSudoCommand(), n = [r];
    return /kdesudo/i.test(r) ? (n.push("--comment", t), n.push("-c")) : /gksudo/i.test(r) ? n.push("--message", t) : /pkexec/i.test(r) && n.push("--disable-internal-agent"), n;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const r of t)
      if (this.hasCommand(r))
        return r;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var r;
    const n = (r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || r === void 0 ? void 0 : r.trim();
    if (n)
      return n;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
Er.LinuxUpdater = v_;
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.DebUpdater = void 0;
const __ = ce, vl = St, T_ = Er;
class fa extends T_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, __.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(vl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(vl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const n = ["dpkg", "apt"], i = this.detectPackageManager(n);
    try {
      fa.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    var o;
    if (t === "dpkg")
      try {
        n(["dpkg", "-i", r]);
      } catch (a) {
        i.warn((o = a.message) !== null && o !== void 0 ? o : a), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        r
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Gr.DebUpdater = fa;
var Wr = {};
Object.defineProperty(Wr, "__esModule", { value: !0 });
Wr.PacmanUpdater = void 0;
const _l = St, A_ = ce, S_ = Er;
class da extends S_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, A_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(_l.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(_l.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      da.installWithCommandRunner(r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (n) {
      return this.dispatchError(n), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n) {
    var i;
    try {
      r(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      n.warn((i = o.message) !== null && i !== void 0 ? i : o), n.warn("pacman installation failed, attempting to update package database and retry");
      try {
        r(["pacman", "-Sy", "--noconfirm"]), r(["pacman", "-U", "--noconfirm", t]);
      } catch (a) {
        throw n.error("Retry after pacman -Sy failed"), a;
      }
    }
  }
}
Wr.PacmanUpdater = da;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.RpmUpdater = void 0;
const Tl = St, C_ = ce, b_ = Er;
class ha extends b_.LinuxUpdater {
  constructor(t, r) {
    super(t, r);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, C_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: n,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(Tl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Tl.DOWNLOAD_PROGRESS, a)), await this.httpExecutor.download(n.url, i, o);
      }
    });
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(n);
    try {
      ha.installWithCommandRunner(i, r, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, r, n, i) {
    if (t === "zypper")
      return n(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", r]);
    if (t === "dnf")
      return n(["dnf", "install", "--nogpgcheck", "-y", r]);
    if (t === "yum")
      return n(["yum", "install", "--nogpgcheck", "-y", r]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), n(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", r]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
Vr.RpmUpdater = ha;
var zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.MacUpdater = void 0;
const Al = fe, uo = At, O_ = _t, Sl = oe, R_ = wd, I_ = mt, N_ = ce, Cl = ei, bl = Jr;
class P_ extends I_.AppUpdater {
  constructor(t, r) {
    super(t, r), this.nativeUpdater = Mt.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (n) => {
      this._logger.warn(n), this.emit("error", n);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let r = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const n = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, Cl.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), n.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      n.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let a = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const d = (0, Cl.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      n.info(`Checked 'uname -a': arm64=${d}`), a = a || d;
    } catch (f) {
      n.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    a = a || process.arch === "arm64" || o;
    const s = (f) => {
      var d;
      return f.url.pathname.includes("arm64") || ((d = f.info.url) === null || d === void 0 ? void 0 : d.includes("arm64"));
    };
    a && r.some(s) ? r = r.filter((f) => a === s(f)) : r = r.filter((f) => !s(f));
    const l = (0, N_.findFile)(r, "zip", ["pkg", "dmg"]);
    if (l == null)
      throw (0, Al.newError)(`ZIP file not provided: ${(0, Al.safeStringifyJson)(r)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const h = t.updateInfoAndProvider.provider, c = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: l,
      downloadUpdateOptions: t,
      task: async (f, d) => {
        const m = Sl.join(this.downloadedUpdateHelper.cacheDir, c), w = () => (0, uo.pathExistsSync)(m) ? !t.disableDifferentialDownload : (n.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let E = !0;
        w() && (E = await this.differentialDownloadInstaller(l, t, f, h, c)), E && await this.httpExecutor.download(l.url, f, d);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const d = Sl.join(this.downloadedUpdateHelper.cacheDir, c);
            await (0, uo.copyFile)(f.downloadedFile, d);
          } catch (d) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${d.message}`);
          }
        return this.updateDownloaded(l, f);
      }
    });
  }
  async updateDownloaded(t, r) {
    var n;
    const i = r.downloadedFile, o = (n = t.info.size) !== null && n !== void 0 ? n : (await (0, uo.stat)(i)).size, a = this._logger, s = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${s})`), this.server = (0, R_.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${s})`), this.server.on("close", () => {
      a.info(`Proxy server for native Squirrel.Mac is closed (${s})`);
    });
    const l = (h) => {
      const c = h.address();
      return typeof c == "string" ? c : `http://127.0.0.1:${c == null ? void 0 : c.port}`;
    };
    return await new Promise((h, c) => {
      const f = (0, bl.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${f}`, "ascii"), m = `/${(0, bl.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (w, E) => {
        const T = w.url;
        if (a.info(`${T} requested`), T === "/") {
          if (!w.headers.authorization || w.headers.authorization.indexOf("Basic ") === -1) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("No authenthication info");
            return;
          }
          const F = w.headers.authorization.split(" ")[1], x = Buffer.from(F, "base64").toString("ascii"), [J, re] = x.split(":");
          if (J !== "autoupdater" || re !== f) {
            E.statusCode = 401, E.statusMessage = "Invalid Authentication Credentials", E.end(), a.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${l(this.server)}${m}" }`);
          E.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), E.end(V);
          return;
        }
        if (!T.startsWith(m)) {
          a.warn(`${T} requested, but not supported`), E.writeHead(404), E.end();
          return;
        }
        a.info(`${m} requested by Squirrel.Mac, pipe ${i}`);
        let A = !1;
        E.on("finish", () => {
          A || (this.nativeUpdater.removeListener("error", c), h([]));
        });
        const S = (0, O_.createReadStream)(i);
        S.on("error", (F) => {
          try {
            E.end();
          } catch (x) {
            a.warn(`cannot end response: ${x}`);
          }
          A = !0, this.nativeUpdater.removeListener("error", c), c(new Error(`Cannot pipe "${i}": ${F}`));
        }), E.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), S.pipe(E);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${s})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${l(this.server)}, ${s})`), this.nativeUpdater.setFeedURL({
          url: l(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${d.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(r), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", c), this.nativeUpdater.checkForUpdates()) : h([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
zr.MacUpdater = P_;
var Yr = {}, pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
pa.verifySignature = $_;
const Ol = fe, ef = ei, D_ = ti, Rl = oe;
function tf(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function $_(e, t, r) {
  return new Promise((n, i) => {
    const o = t.replace(/'/g, "''");
    r.info(`Verifying signature ${o}`), (0, ef.execFile)(...tf(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (a, s, l) => {
      var h;
      try {
        if (a != null || l) {
          fo(r, a, l, i), n(null);
          return;
        }
        const c = F_(s);
        if (c.Status === 0) {
          try {
            const w = Rl.normalize(c.Path), E = Rl.normalize(t);
            if (r.info(`LiteralPath: ${w}. Update Path: ${E}`), w !== E) {
              fo(r, new Error(`LiteralPath of ${w} is different than ${E}`), l, i), n(null);
              return;
            }
          } catch (w) {
            r.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(h = w.message) !== null && h !== void 0 ? h : w.stack}`);
          }
          const d = (0, Ol.parseDn)(c.SignerCertificate.Subject);
          let m = !1;
          for (const w of e) {
            const E = (0, Ol.parseDn)(w);
            if (E.size ? m = Array.from(E.keys()).every((A) => E.get(A) === d.get(A)) : w === d.get("CN") && (r.warn(`Signature validated using only CN ${w}. Please add your full Distinguished Name (DN) to publisherNames configuration`), m = !0), m) {
              n(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(c, (d, m) => d === "RawData" ? void 0 : m, 2);
        r.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), n(f);
      } catch (c) {
        fo(r, c, null, i), n(null);
        return;
      }
    });
  });
}
function F_(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const r = t.SignerCertificate;
  return r != null && (delete r.Archived, delete r.Extensions, delete r.Handle, delete r.HasPrivateKey, delete r.SubjectName), t;
}
function fo(e, t, r, n) {
  if (x_()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, ef.execFileSync)(...tf("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && n(t), r && n(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
}
function x_() {
  const e = D_.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Yr, "__esModule", { value: !0 });
Yr.NsisUpdater = void 0;
const Ln = fe, Il = oe, L_ = qt, U_ = cn, Nl = St, k_ = ce, M_ = At, B_ = pa, Pl = Tt;
class H_ extends L_.BaseUpdater {
  constructor(t, r) {
    super(t, r), this._verifyUpdateCodeSignature = (n, i) => (0, B_.verifySignature)(n, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const r = t.updateInfoAndProvider.provider, n = (0, k_.findFile)(r.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: n,
      task: async (i, o, a, s) => {
        const l = n.packageInfo, h = l != null && a != null;
        if (h && t.disableWebInstaller)
          throw (0, Ln.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !h && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (h || t.disableDifferentialDownload || await this.differentialDownloadInstaller(n, t, i, r, Ln.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(n.url, i, o);
        const c = await this.verifySignature(i);
        if (c != null)
          throw await s(), (0, Ln.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${c}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (h && await this.differentialDownloadWebPackage(t, l, a, r))
          try {
            await this.httpExecutor.download(new Pl.URL(l.path), a, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: l.sha512
            });
          } catch (f) {
            try {
              await (0, M_.unlink)(a);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let r;
    try {
      if (r = (await this.configOnDisk.value).publisherName, r == null)
        return null;
    } catch (n) {
      if (n.code === "ENOENT")
        return null;
      throw n;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(r) ? r : [r], t);
  }
  doInstall(t) {
    const r = this.installerPath;
    if (r == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const n = ["--updated"];
    t.isSilent && n.push("/S"), t.isForceRunAfter && n.push("--force-run"), this.installDirectory && n.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && n.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Il.join(process.resourcesPath, "elevate.exe"), [r].concat(n)).catch((a) => this.dispatchError(a));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(r, n).catch((a) => {
      const s = a.code;
      this._logger.info(`Cannot run installer: error code: ${s}, error message: "${a.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), s === "UNKNOWN" || s === "EACCES" ? o() : s === "ENOENT" ? Mt.shell.openPath(r).catch((l) => this.dispatchError(l)) : this.dispatchError(a);
    }), !0);
  }
  async differentialDownloadWebPackage(t, r, n, i) {
    if (r.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Pl.URL(r.path),
        oldFile: Il.join(this.downloadedUpdateHelper.cacheDir, Ln.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: n,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Nl.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (a) => this.emit(Nl.DOWNLOAD_PROGRESS, a)), await new U_.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Yr.NsisUpdater = H_;
(function(e) {
  var t = be && be.__createBinding || (Object.create ? function(T, A, S, F) {
    F === void 0 && (F = S);
    var x = Object.getOwnPropertyDescriptor(A, S);
    (!x || ("get" in x ? !A.__esModule : x.writable || x.configurable)) && (x = { enumerable: !0, get: function() {
      return A[S];
    } }), Object.defineProperty(T, F, x);
  } : function(T, A, S, F) {
    F === void 0 && (F = S), T[F] = A[S];
  }), r = be && be.__exportStar || function(T, A) {
    for (var S in T) S !== "default" && !Object.prototype.hasOwnProperty.call(A, S) && t(A, T, S);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const n = At, i = oe;
  var o = qt;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var a = mt;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return a.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return a.NoOpLogger;
  } });
  var s = ce;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return s.Provider;
  } });
  var l = qr;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return l.AppImageUpdater;
  } });
  var h = Gr;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return h.DebUpdater;
  } });
  var c = Wr;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return c.PacmanUpdater;
  } });
  var f = Vr;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var d = zr;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return d.MacUpdater;
  } });
  var m = Yr;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return m.NsisUpdater;
  } }), r(St, e);
  let w;
  function E() {
    if (process.platform === "win32")
      w = new Yr.NsisUpdater();
    else if (process.platform === "darwin")
      w = new zr.MacUpdater();
    else {
      w = new qr.AppImageUpdater();
      try {
        const T = i.join(process.resourcesPath, "package-type");
        if (!(0, n.existsSync)(T))
          return w;
        switch ((0, n.readFileSync)(T).toString().trim()) {
          case "deb":
            w = new Gr.DebUpdater();
            break;
          case "rpm":
            w = new Vr.RpmUpdater();
            break;
          case "pacman":
            w = new Wr.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (T) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", T.message);
      }
    }
    return w;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => w || E()
  });
})(qe);
const rf = ht.dirname(gd(import.meta.url));
process.env.APP_ROOT = ht.join(rf, "..");
const Po = process.env.VITE_DEV_SERVER_URL, _T = ht.join(process.env.APP_ROOT, "dist-electron"), nf = ht.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Po ? ht.join(process.env.APP_ROOT, "public") : nf;
function of(e) {
  const r = Buffer.alloc(4096);
  let n;
  switch (e) {
    case "connected":
      n = { r: 34, g: 197, b: 94 };
      break;
    case "disconnected":
      n = { r: 239, g: 68, b: 68 };
      break;
    case "monitoring":
      n = { r: 251, g: 146, b: 60 };
      break;
  }
  const i = 32 / 2, o = 32 / 2 + 2;
  for (let a = 0; a < 32; a++)
    for (let s = 0; s < 32; s++) {
      const l = (a * 32 + s) * 4, h = s - i, c = a - o, f = Math.sqrt(h * h + c * c);
      let d = 0;
      f >= 3 && f <= 4.5 && c <= 0 ? d = 255 : f >= 5.5 && f <= 7 && c <= 0 ? d = 220 : f >= 8.5 && f <= 10 && c <= 0 ? d = 180 : f <= 2 && (d = 255), d > 0 ? (r[l] = n.r, r[l + 1] = n.g, r[l + 2] = n.b, r[l + 3] = d) : (r[l] = 0, r[l + 1] = 0, r[l + 2] = 0, r[l + 3] = 0);
    }
  return Ml.createFromBuffer(r, { width: 32, height: 32 });
}
function Do(e) {
  const t = Date.now();
  if (t - Fl < G_)
    return;
  if (Fl = t, !xa.isSupported()) {
    console.warn("Notificações não são suportadas neste sistema");
    return;
  }
  const r = 64, n = Buffer.alloc(r * r * 4), i = r / 2, o = r / 2;
  for (let s = 0; s < r; s++)
    for (let l = 0; l < r; l++) {
      const h = (s * r + l) * 4, c = l - i, f = s - o;
      Math.sqrt(c * c + f * f) <= r / 2 - 2 ? (n[h] = 239, n[h + 1] = 68, n[h + 2] = 68, n[h + 3] = 255, (Math.abs(c) < 8 && Math.abs(f) < 2 || Math.abs(f) < 8 && Math.abs(c) < 2 || Math.abs(c - f) < 2 && Math.abs(c) < 10 || Math.abs(c + f) < 2 && Math.abs(c) < 10) && (n[h] = 255, n[h + 1] = 255, n[h + 2] = 255)) : (n[h] = 0, n[h + 1] = 0, n[h + 2] = 0, n[h + 3] = 0);
    }
  const a = new xa({
    title: "NetMonitor - Problema de Conexão",
    body: e,
    icon: Ml.createFromBuffer(n, { width: r, height: r }),
    urgency: "critical",
    timeoutType: "default"
  });
  a.on("click", () => {
    N ? (N.show(), N.focus()) : dr();
  }), a.show();
}
function Zn(e) {
  if (!kt) return;
  const t = of(e);
  kt.setImage(t);
  let r = "NetMonitor";
  switch (e) {
    case "connected":
      r = "NetMonitor - Conectado";
      break;
    case "disconnected":
      r = "NetMonitor - Desconectado";
      break;
    case "monitoring":
      r = "NetMonitor - Monitorando";
      break;
  }
  kt.setToolTip(r), lf();
}
function Dl(e) {
  const t = e.toLowerCase();
  return t.includes("esgotado") || t.includes("timed out") || t.includes("request timed out") ? { isError: !0, message: "Timeout: conexão não respondeu" } : t.includes("unreachable") || t.includes("inacess") || t.includes("destination host unreachable") ? { isError: !0, message: "Host inacessível: verifique a conexão" } : t.includes("falha") || t.includes("general failure") || t.includes("failure") ? { isError: !0, message: "Falha de conexão detectada" } : { isError: !1 };
}
function af() {
  $e || (Xr = !0, Zn("monitoring"), $e = $o("ping", ["8.8.8.8", "-t"]), N == null || N.webContents.send("ping-status-changed", { running: !0 }), $e.stdout.on("data", (e) => {
    const t = e.toString();
    N == null || N.webContents.send("ping-data", t);
    const r = t.split(/\r?\n/).map((n) => n.trim()).filter(Boolean);
    for (const n of r) {
      const i = Dl(n);
      if (i.isError && i.message) {
        Do(i.message);
        break;
      }
    }
  }), $e.stderr.on("data", (e) => {
    const t = e.toString();
    console.error(`Erro Ping: ${t}`);
    const r = Dl(t);
    r.isError && r.message && Do(r.message);
  }), $e.on("close", () => {
    $e = null, Xr = !1, Zn("disconnected"), N == null || N.webContents.send("ping-status-changed", { running: !1 });
  }));
}
function sf() {
  $e && ($e.kill(), $e = null, Xr = !1, Zn("disconnected"), N == null || N.webContents.send("ping-status-changed", { running: !1 }));
}
function lf() {
  if (!kt) return;
  const e = md.buildFromTemplate([
    {
      label: "Abrir NetMonitor",
      click: () => {
        N ? (N.show(), N.focus()) : dr();
      }
    },
    { type: "separator" },
    {
      label: Xr ? "Pausar Monitoramento" : "Iniciar Monitoramento",
      click: () => {
        Xr ? sf() : af();
      }
    },
    {
      label: "Executar Teste de Velocidade",
      click: () => {
        N ? (N.show(), N.focus()) : dr(), setTimeout(() => {
          N == null || N.webContents.send("tray-start-speed-test");
        }, 500);
      }
    },
    { type: "separator" },
    {
      label: "Sair",
      click: () => {
        ma = !0, $e && $e.kill(), sr.quit();
      }
    }
  ]);
  kt.setContextMenu(e);
}
function j_() {
  const e = of("disconnected");
  kt = new pd(e), lf(), kt.on("click", () => {
    N ? (N.show(), N.focus()) : dr();
  });
}
function q_() {
  $l || process.platform !== "win32" || !sr.isPackaged || ($l = !0, qe.autoUpdater.autoDownload = !1, qe.autoUpdater.autoInstallOnAppQuit = !1, qe.autoUpdater.allowPrerelease = !1, qe.autoUpdater.allowDowngrade = !1, qe.autoUpdater.on("error", (e) => {
    console.error("Erro ao verificar atualizações:", e);
  }), qe.autoUpdater.on("update-available", async (e) => {
    const t = e.version || "mais recente", r = {
      type: "info",
      buttons: ["Atualizar agora", "Depois"],
      defaultId: 0,
      cancelId: 1,
      title: "Atualização disponível",
      message: `Uma nova versão do NetMonitor está disponível (${t}).`,
      detail: "Deseja baixar e instalar a atualização agora? O app será reiniciado automaticamente após o download."
    };
    (N ? await La.showMessageBox(N, r) : await La.showMessageBox(r)).response === 0 && await qe.autoUpdater.downloadUpdate();
  }), qe.autoUpdater.on("update-downloaded", () => {
    cf = !0, ma = !0, $e && ($e.kill(), $e = null), qe.autoUpdater.quitAndInstall(!1, !0);
  }), setTimeout(() => {
    qe.autoUpdater.checkForUpdates().catch((e) => {
      console.error("Falha ao iniciar verificação de atualizações:", e);
    });
  }, 2500));
}
let N = null, $e = null, K = null, kt = null, Xr = !1, ma = !1, cf = !1, $l = !1, Fl = 0;
const G_ = 3e4;
function dr() {
  const e = ht.join(process.env.APP_ROOT, "src", "assets", "ico_app.ico");
  N = new kl({
    icon: e,
    width: 1200,
    height: 800,
    minWidth: 1200,
    maxWidth: 1200,
    minHeight: 800,
    maxHeight: 800,
    resizable: !1,
    maximizable: !1,
    frame: !1,
    titleBarStyle: "hidden",
    transparent: !1,
    webPreferences: {
      preload: ht.join(rf, "preload.mjs"),
      contextIsolation: !0,
      nodeIntegration: !1
    }
  }), N.setMenuBarVisibility(!1), N.on("maximize", () => {
    N == null || N.restore();
  }), N.webContents.on("did-finish-load", () => {
    N == null || N.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), Po ? N.loadURL(Po) : N.loadFile(ht.join(nf, "index.html"));
}
vt.on("start-ping", () => {
  af();
});
vt.on("stop-ping", () => {
  sf();
});
const nr = 1e3, uf = 200, W_ = 8, ho = 24, V_ = 700, xl = 2500, Ll = 12, po = [
  "https://speed.cloudflare.com/__down?bytes=1000000000",
  "https://proof.ovh.net/files/1Gb.dat",
  "https://speed.hetzner.de/1GB.bin",
  "https://cachefly.cachefly.net/100mb.test"
];
function $r(e, t) {
  return e * 8 / Math.max(1e-3, t / 1e3) / 1e6;
}
function ga() {
  const e = new Error("Teste cancelado");
  return e.name = "AbortError", e;
}
function ar(e) {
  return e instanceof Error && (e.name === "AbortError" || e.message === "Aborted");
}
function ff(e) {
  return e.startsWith("https:") ? Bl : Hl;
}
async function z_(e, t) {
  return new Promise((r, n) => {
    const i = process.platform === "win32" ? "curl.exe" : "curl", o = process.platform === "win32" ? "NUL" : "/dev/null", a = Date.now();
    let s = "", l = "", h = !1;
    const c = [
      "--location",
      "--http1.1",
      "--silent",
      "--show-error",
      "--parallel",
      "--parallel-immediate",
      "--parallel-max",
      String(e.length * Ll),
      "--connect-timeout",
      "5",
      "--max-time",
      String(Math.ceil(t / 1e3))
    ];
    for (const A of e)
      for (let S = 0; S < Ll; S += 1) {
        const F = A.includes("?") ? "&" : "?";
        c.push(
          "--output",
          o,
          "--write-out",
          `%{speed_download}
`,
          `${A}${F}nonce=${Date.now()}-${S}`
        );
      }
    const f = $o(i, c, {
      windowsHide: !0
    }), d = () => {
      clearInterval(w), clearTimeout(E), K == null || K.signal.removeEventListener("abort", T);
    }, m = (A) => {
      if (h) return;
      if (h = !0, d(), A) {
        n(A);
        return;
      }
      const S = s.split(/\r?\n/).map((x) => Number(x.trim())).filter((x) => Number.isFinite(x) && x > 0);
      if (S.length === 0) {
        n(new Error(l.trim() || "curl não retornou velocidade de download"));
        return;
      }
      const F = S.reduce((x, J) => x + J, 0) * 8 / 1e6;
      r({ speed: F, progress: 100 });
    }, w = setInterval(() => {
      const A = Date.now() - a;
      N == null || N.webContents.send("speed-test-data", {
        type: "download-progress",
        download: null,
        progress: Math.min(99, A / t * 100)
      });
    }, uf), E = setTimeout(() => {
      f.killed || f.kill();
    }, t + 4e3), T = () => {
      f.killed || f.kill(), m(ga());
    };
    K == null || K.signal.addEventListener("abort", T, { once: !0 }), f.stdout.on("data", (A) => {
      s += A.toString();
    }), f.stderr.on("data", (A) => {
      l += A.toString();
    }), f.on("error", (A) => m(A)), f.on("close", (A) => {
      if (A !== 0 && A !== 28 && s.trim().length === 0) {
        m(new Error(l.trim() || `curl finalizou com código ${A}`));
        return;
      }
      m();
    });
  });
}
async function Ul(e, t = 1e4) {
  return new Promise((r, n) => {
    const i = Array.isArray(e) ? e : [e], o = Date.now();
    let a = 0, s = null, l = !1, h = 0, c = null, f = 0, d = 0;
    const m = [], w = [], E = [], T = K == null ? void 0 : K.signal, A = i.length * ho, S = /* @__PURE__ */ new Map();
    let F, x, J;
    const re = () => {
      const O = Date.now() - o;
      if (O < nr) return 0;
      for (m.push({ elapsedMs: O, bytes: a }); m.length > 2 && O - m[0].elapsedMs > xl * 2; )
        m.shift();
      const b = [...m].reverse().find(($) => O - $.elapsedMs >= xl), C = b ? $r(a - b.bytes, O - b.elapsedMs) : $r(Math.max(0, a - (s ?? 0)), O - nr);
      return C > d && (d = C), C;
    }, V = () => {
      F && clearInterval(F), x && clearInterval(x), J && clearTimeout(J), T == null || T.removeEventListener("abort", y);
      for (const O of w) O.destroy();
      for (const O of E) O.destroy();
      for (const O of S.values()) O.destroy();
    }, me = (O) => {
      if (l) return;
      if (l = !0, V(), O) {
        n(O);
        return;
      }
      const b = $r(Math.max(0, a - (s ?? 0)), Date.now() - o - nr), P = Math.max(d, b);
      if (P <= 0 && c) {
        n(c);
        return;
      }
      r({ speed: P, progress: 100 });
    }, y = () => me(ga());
    T == null || T.addEventListener("abort", y, { once: !0 }), F = setInterval(() => {
      if (l) return;
      const O = Date.now() - o;
      O >= nr && s == null && (s = a), N == null || N.webContents.send("speed-test-data", {
        type: "download-progress",
        download: re(),
        progress: Math.min(99, O / t * 100)
      });
    }, uf), x = setInterval(() => {
      l || f >= ho || Q(4);
    }, V_), J = setTimeout(() => me(), t);
    const j = () => {
      h -= 1, h <= 0 && a === 0 && c && me(c);
    }, G = (O) => {
      const b = O.startsWith("https:") ? "https" : "http", P = S.get(b);
      if (P) return P;
      const C = b === "https" ? new Bl.Agent({ keepAlive: !1, maxSockets: A }) : new Hl.Agent({ keepAlive: !1, maxSockets: A });
      return S.set(b, C), C;
    }, H = (O, b) => {
      if (l) return;
      const P = O.includes("?") ? "&" : "?", C = `${O}${P}nonce=${Date.now()}-${b}`;
      h += 1;
      try {
        const $ = ff(C), D = {
          agent: G(C),
          signal: T,
          highWaterMark: 1024 * 1024,
          headers: {
            "Cache-Control": "no-store, no-cache",
            Pragma: "no-cache",
            Connection: "keep-alive"
          }
        }, k = $.get(C, D, (B) => {
          E.push(B);
          const q = B.statusCode ?? 0;
          if (q < 200 || q >= 300) {
            c = new Error(`HTTP ${q} no download`), B.resume(), j();
            return;
          }
          B.on("data", (X) => {
            l || (a += X.length);
          }), B.on("end", j), B.on("error", (X) => {
            c = X, j();
          });
        });
        w.push(k), k.on("error", (B) => {
          l || ar(B) || (c = B, j());
        });
      } catch ($) {
        c = $ instanceof Error ? $ : new Error("Falha ao iniciar conexão de download"), j();
      }
    };
    function Q(O) {
      const b = ho - f, P = Math.min(O, b);
      if (!(P <= 0)) {
        for (const C of i)
          for (let $ = 0; $ < P; $ += 1)
            H(C, f + $);
        f += P;
      }
    }
    Q(W_);
  });
}
function Y_(e, t) {
  return new Promise((r, n) => {
    const i = ff(e), o = K == null ? void 0 : K.signal, a = Date.now();
    let s = !1;
    const l = i.request(e, {
      method: "POST",
      signal: o,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Length": t.length,
        "Cache-Control": "no-store, no-cache",
        Pragma: "no-cache",
        Connection: "keep-alive"
      }
    }, (h) => {
      h.resume(), h.on("end", () => {
        if (s) return;
        s = !0;
        const c = h.statusCode ?? 0;
        if (c < 200 || c >= 300) {
          n(new Error(`HTTP ${c} no upload`));
          return;
        }
        r(Date.now() - a);
      }), h.on("error", (c) => {
        s || (s = !0, n(c));
      });
    });
    l.on("error", (h) => {
      s || (s = !0, n(h));
    }), l.end(t);
  });
}
async function X_(e, t = 1e4) {
  const r = [524288, 1048576, 2097152, 4194304, 8388608], n = /* @__PURE__ */ new Map(), i = Date.now();
  let o = 0, a = 0, s = 0, l = null;
  const h = (f) => {
    const d = n.get(f);
    if (d) return d;
    const m = Ed.randomBytes(f);
    return n.set(f, m), m;
  }, c = () => {
    const f = Date.now() - i;
    N == null || N.webContents.send("speed-test-data", {
      type: "upload-progress",
      upload: s,
      progress: Math.min(99, f / t * 100)
    });
  };
  for (; Date.now() - i < t; ) {
    if (K != null && K.signal.aborted) throw ga();
    const d = Date.now() - i < nr ? r[0] : r[Math.min(r.length - 1, Math.max(1, Math.floor(s / 35)))];
    try {
      const m = await Y_(e, h(d));
      Date.now() - i >= nr && (o += d, a += m, s = $r(o, a), c());
    } catch (m) {
      if (ar(m)) throw m;
      l = m;
      break;
    }
  }
  if (o === 0)
    throw l instanceof Error ? l : new Error("Falha no teste de upload");
  return { speed: $r(o, a), progress: 100 };
}
async function K_(e) {
  try {
    return await z_(po, e);
  } catch (r) {
    if (ar(r)) throw r;
    console.warn("Teste de download com curl falhou; usando fallback Node:", r);
  }
  try {
    return await Ul(po, e);
  } catch (r) {
    if (ar(r)) throw r;
  }
  let t = null;
  for (const r of po)
    try {
      return await Ul(r, e);
    } catch (n) {
      if (ar(n)) throw n;
      t = n;
    }
  throw t instanceof Error ? t : new Error("Falha no teste de download");
}
async function J_(e) {
  const t = [
    "https://speed.cloudflare.com/__up",
    "https://httpbin.org/post"
  ];
  let r = null;
  for (const n of t)
    try {
      return await X_(n, e);
    } catch (i) {
      if (ar(i)) throw i;
      r = i;
    }
  throw r instanceof Error ? r : new Error("Falha no teste de upload");
}
function Q_(e) {
  const t = e.matchAll(/(?:tempo|time)[=<]?\s*(\d+(?:[.,]\d+)?)\s*ms/gi), r = [];
  for (const n of t) {
    const i = Number(n[1].replace(",", "."));
    Number.isFinite(i) && r.push(i);
  }
  return r;
}
async function Z_(e = "1.1.1.1", t = 4) {
  return new Promise((r) => {
    const i = process.platform === "win32" ? ["-n", String(t), "-w", "1200", e] : ["-c", String(t), "-W", "1", e], o = $o("ping", i);
    let a = "", s = !1;
    const l = 8e3, h = (d) => {
      s || (s = !0, clearTimeout(c), r(d));
    }, c = setTimeout(() => {
      o.killed || o.kill(), h(999);
    }, l), f = () => {
      o.killed || o.kill(), h(999);
    };
    K == null || K.signal.addEventListener("abort", f, { once: !0 }), o.stdout.on("data", (d) => {
      a += d.toString();
    }), o.stderr.on("data", (d) => {
      a += d.toString();
    }), o.on("error", () => {
      K == null || K.signal.removeEventListener("abort", f), h(999);
    }), o.on("close", () => {
      K == null || K.signal.removeEventListener("abort", f);
      const d = Q_(a);
      if (d.length === 0) {
        h(999);
        return;
      }
      const m = d.reduce((w, E) => w + E, 0) / d.length;
      h(m);
    });
  });
}
vt.on("start-speed-test", async () => {
  K && K.abort(), K = new AbortController();
  try {
    N == null || N.webContents.send("speed-test-data", { type: "start" }), N == null || N.webContents.send("speed-test-data", { type: "ping-start" });
    const e = await Z_("1.1.1.1", 4), t = Number.isFinite(e) ? e : 999;
    N == null || N.webContents.send("speed-test-data", { type: "ping-complete", ping: t }), N == null || N.webContents.send("speed-test-data", { type: "download-start" });
    const r = await K_(1e4);
    N == null || N.webContents.send("speed-test-data", { type: "download-complete", download: r.speed }), N == null || N.webContents.send("speed-test-data", { type: "upload-start" });
    const n = await J_(1e4);
    N == null || N.webContents.send("speed-test-data", { type: "upload-complete", upload: n.speed }), N == null || N.webContents.send("speed-test-data", { type: "complete" });
  } catch (e) {
    e.name !== "AbortError" && (N == null || N.webContents.send("speed-test-data", { type: "error", error: e.message }));
  } finally {
    K = null;
  }
});
vt.on("stop-speed-test", () => {
  K && (K.abort(), K = null, N == null || N.webContents.send("speed-test-data", { type: "stopped" }));
});
vt.on("window-minimize", () => {
  N == null || N.minimize();
});
vt.on("window-close", () => {
  N && N.hide();
});
vt.on("update-connection-status", (e, t) => {
  Zn(t);
});
vt.on("show-connection-error-notification", (e, t) => {
  Do(t);
});
sr.on("window-all-closed", () => {
  process.platform !== "darwin" && N && N.hide();
});
sr.on("activate", () => {
  kl.getAllWindows().length === 0 && dr();
});
sr.whenReady().then(() => {
  dr(), j_(), q_(), sr.on("before-quit", (e) => {
    !ma && !cf && N && !N.isDestroyed() && (e.preventDefault(), N.hide());
  });
});
export {
  _T as MAIN_DIST,
  nf as RENDERER_DIST,
  Po as VITE_DEV_SERVER_URL
};
