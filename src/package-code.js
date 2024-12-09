// I took this code from the n8n_io/license-manager node_modules package
// and then i cracked it

"use strict";
var b = Object.create;
var u = Object.defineProperty;
var D = Object.getOwnPropertyDescriptor;
var F = Object.getOwnPropertyNames;
var A = Object.getPrototypeOf,
  R = Object.prototype.hasOwnProperty;
var x = (r, e) => {
    for (var t in e) u(r, t, { get: e[t], enumerable: !0 });
  },
  C = (r, e, t, n) => {
    if ((e && typeof e == "object") || typeof e == "function")
      for (let i of F(e))
        !R.call(r, i) &&
          i !== t &&
          u(r, i, {
            get: () => e[i],
            enumerable: !(n = D(e, i)) || n.enumerable,
          });
    return r;
  };
var w = (r, e, t) => (
    (t = r != null ? b(A(r)) : {}),
    C(
      e || !r || !r.__esModule
        ? u(t, "default", { value: r, enumerable: !0 })
        : t,
      r
    )
  ),
  L = (r) => C(u({}, "__esModule", { value: !0 }), r);
var O = {};
x(O, { LicenseManager: () => p });
module.exports = L(O);
var d = w(require("crypto-js")),
  E = require("node-machine-id"),
  T = w(require("node-rsa")),
  f = require("crypto");
var c = require("undici"),
  I = require("url");
function h(r) {
  let e = process.env[r];
  return e ? new c.ProxyAgent(e) : null;
}
var v = h("http_proxy_license_server") || h("http_proxy"),
  y = h("https_proxy_license_server") || h("https_proxy"),
  M = { ...(v ? { "http:": v } : {}), ...(y ? { "https:": y } : {}) },
  S = (process.env.no_proxy ?? "").split(",").map((r) => r.trim()),
  N = (0, c.getGlobalDispatcher)();
(0, c.setGlobalDispatcher)(
  new (class extends c.Dispatcher {
    dispatch(r, e) {
      if (r.origin) {
        let { host: t, protocol: n } =
          typeof r.origin == "string" ? new I.URL(r.origin) : r.origin;
        if (!S.some((i) => (i.startsWith(".") ? t.endsWith(i) : t === i))) {
          let i = M[n];
          i && i.dispatch(r, e);
        }
      }
      return N.dispatch(r, e);
    }
  })()
);
async function g(r, e, t = {}) {
  let n = new AbortController(),
    i = setTimeout(() => {
      n.abort();
    }, t.timeoutInMs ?? 3e4);
  try {
    let s = await (0, c.fetch)(r, {
        method: "post",
        body: JSON.stringify(e),
        headers: { "Content-Type": "application/json" },
        signal: n.signal,
      }),
      a = await s.json();
    return { status: s.status, data: a };
  } catch (s) {
    throw new Error("Connection Error", { cause: s });
  } finally {
    clearTimeout(i);
  }
}
var p = class {
  constructor(e) {
    this.isInitializationCompleted = !1;
    this.isShuttingDown = !1;
    (this.config = e),
      this.config.logger
        ? (this.logger = this.config.logger)
        : (this.logger = {
            error() {
              console.log("ERROR:", ...arguments);
            },
            warn() {
              console.log("WARN:", ...arguments);
            },
            info() {
              console.log("INFO:", ...arguments);
            },
            debug() {
              console.log("DEBUG:", ...arguments);
            },
          }),
      (this.x509IssuerCert = new f.X509Certificate(`-----BEGIN CERTIFICATE-----
MIIFDDCCAvQCCQCWGBewlWbp0DANBgkqhkiG9w0BAQsFADBIMQswCQYDVQQGEwJE
RTEPMA0GA1UECAwGQmVybGluMQ8wDQYDVQQHDAZCZXJsaW4xFzAVBgNVBAMMDmxp
Y2Vuc2UubjhuLmlvMB4XDTIyMDYyNDA0MDkzM1oXDTQ5MTEwOTA0MDkzM1owSDEL
MAkGA1UEBhMCREUxDzANBgNVBAgMBkJlcmxpbjEPMA0GA1UEBwwGQmVybGluMRcw
FQYDVQQDDA5saWNlbnNlLm44bi5pbzCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCC
AgoCggIBANK6Uj5CSyPaa2rf/bwH/AqzzINeWg4n94pECv4p8tsjy0+ZscodNn7Q
IvYW/6IUpax8fZvHCSqu0L7fsgLkw0+HDLlsln+ryI/3h1ElVZm67BfqOvhSfPj+
btxcP8EtS+6hbf74sqPEBFD0wikKhIPGdtBolp7rLXfTGs+5eMqSA5q4W1V+HUUU
zgaCdchzlHGTdIICNpbRozGeFTIIx1MPzMie+4zIs6i680efx2KJVZWsa2WuCSED
+b0gSRTgoKQ3B7JjxJKfzHdOdM6JxhkCjrJIkJCrZL7wFypn+wMHsVFrsw/80WkS
dwBj/RqCPzKcRwnxs0WNLhkyT/XCMS/1pNzPymdFADu2tEZjhFsa5ziIhdoQz8po
Efheyg3mOZDWyu6oyHCLH9lUlsNjV9zZ6RICgvHZvHPmPqOLPomy4Qymq2osuH+S
28rwEy0W3DCEfuS3dZHrSQfohGC9EAyyFAIPSGhTJSYJl0oNBZjpRM+jAm9ER7PM
K70/7g6z8uIgKa8/SD/Pezd/aWzxH/tOokAF5X5o5TzSOwVzqOJzY06EZC7CJnhs
sigAJTy1trZJBcZuWnKY5FqrK3QzjsQ9sWM0tRocfNOYmD21mubNo+RmMMo3kvYL
JoBfap/cuP6kx3OiRzBJ4luTEa6nRIYy+EjcPaN3+9L5iEZ9/NABAgMBAAEwDQYJ
KoZIhvcNAQELBQADggIBAIUpJ0Rh6C92cJqy6iehS8c77r1prj62gr6Acdy5QGh8
ax30ANDbPtkezVIIBk+0JjLkMxr3mwqCRsPgMshPcxhZwEafmZrWPPGRVsOfukB3
Gp10cIv1YmZ7AFY4i/izj5184+A+GjxrJBULQG1JfX4c7KW06Kaps85AaX/Tp0fl
/hZ6oUe48aSSTuAW38hWZ5jCpBqfFyQ15ablJZt0fB8NkXEdFUcUEt/OHJfqF5fP
Nt5PWC1AuBxzSbzjwabOy/M4r8m5CzCeXSIjqbcsAq52myMoxvNrjKRtucQ7CjqK
LR6WdhMf+NLvyTI+evXMoXpDzlevkCpz17uDiDt9XrmvLSf3Ff8mdTRwzVmOmHfc
Ruz5v7WBR4cpBR/sC+WxOw9heLMHgYhPyRUM4voo55EcJGusXr/iavblBAnI0GUw
uMNs3MjEmfbaBV1K0GKG5UToF9UmUxxVmTcRUZrAQX+yBkRezDTpOQuRnB58BDQP
A62lcgZlikzJw3lHue33qAudyUrUmjfHGll7GFQNeLO42jPMeM4NJiNIrBZ7j0uD
4slHdDi/44PHcKchvde/5k7ZJMi6OC1Vu+bOnKvzhnWQIOkHFQ55m13oslV2ozZT
/oqhn/8/LeV0ooZuYnBeRkRTveniUeho2OFe5xZvWSSfuBrbHt9+zBg+5MWPUTIJ
-----END CERTIFICATE-----`)),
      (this.config.autoRenewEnabled = this.config.autoRenewEnabled ?? !0),
      (this.config.renewOnInit = this.config.renewOnInit ?? !1),
      (this.config.offlineMode = this.config.offlineMode ?? !1),
      (this.config.autoRenewOffset =
        this.config.autoRenewOffset ?? 60 * 60 * 72),
      (this.config.server = this.config.server ?? "https://license.n8n.io/v1");
  }
  log(e, t) {
    this.logger[t](`[license] ${e}`);
  }
  isInitialized() {
    return this.isInitializationCompleted;
  }
  async initialize() {
    this.isInitialized() ||
      ((this.deviceFingerprint = await this.computeDeviceFingerprint()),
      this.log(
        `initializing for deviceFingerprint ${this.deviceFingerprint}`,
        "debug"
      ),
      await this.initCert(),
      (this.checkUpcomingEntitlementChangesCron = setInterval(
        () => this.setTimerForNextEntitlementChange(),
        1e3 * 60 * 15
      )),
      this.config.autoRenewEnabled &&
        (this.config.renewOnInit && (await this.renewalCron({ force: !0 })),
        (this.renewalIntervalPointer = setInterval(
          () => this.renewalCron({ force: !1 }),
          1e3 * 60 * 15
        ))),
      (this.isInitializationCompleted = !0));
  }
  async reload() {
    this.reset(), await this.initialize();
  }
  reset() {
    this.config.autoRenewEnabled && clearInterval(this.renewalIntervalPointer),
      this.checkUpcomingEntitlementChangesCron &&
        clearInterval(this.checkUpcomingEntitlementChangesCron),
      this.entitlementChangeTimeoutPointer &&
        clearTimeout(this.entitlementChangeTimeoutPointer),
      (this.licenseCert = void 0),
      (this.deviceFingerprint = void 0),
      (this.isInitializationCompleted = !1);
  }
  async computeDeviceFingerprint() {
    return this.config.deviceFingerprint &&
      typeof this.config.deviceFingerprint == "function"
      ? await this.config.deviceFingerprint()
      : await (0, E.machineId)();
  }
  async activate(e) {
    if (!this.isInitialized())
      throw new Error("activation failed because SDK was not yet initialized");
    if (this.isShuttingDown)
      throw new Error("activation failed because SDK is shutting down");
    if (this.config.offlineMode)
      throw new Error("activation failed because SDK is in offline mode");
    let t = {
      reservationId: e,
      tenantId: this.config.tenantId,
      productIdentifier: this.config.productIdentifier,
      deviceFingerprint: this.deviceFingerprint,
    };
    this.hasCert() &&
      ((t.consumerId = this.licenseCert.consumerId),
      (t.renewalToken = this.licenseCert.renewalToken));
    let n;
    try {
      n = await g(`${this.config.server}/activate`, t, { timeoutInMs: 1e4 });
    } catch (i) {
      throw (
        (this.log("license activation failed: " + i.message, "warn"),
        new Error(i.message))
      );
    }
    if (n.status == 200) {
      if (
        !n.data.hasOwnProperty("licenseKey") ||
        !n.data.hasOwnProperty("x509")
      )
        throw (
          (this.log("unexpected server response", "warn"),
          new Error("unexpected server response"))
        );
      let i = this.stringifyCertContainer({
        licenseKey: n.data.licenseKey,
        x509: n.data.x509,
      });
      await this.config.saveCertStr(i),
        await this.initCert(),
        this.log("license successfully activated", "info"),
        (n.data.detachedEntitlementsCount ?? !1) &&
          this.log(
            `skipped importing ${n.data.detachedEntitlementsCount} floating entitlements which are currently in use elsewhere`,
            "info"
          );
    } else {
      let i = `license activation failed: ${
          n.data.message ?? "unknown reason"
        }`,
        s = new Error(i);
      throw (
        (n.data.errorId && (s.errorId = n.data.errorId), this.log(i, "warn"), s)
      );
    }
  }
  async renew() {
    return this._renew({ cause: "request" });
  }
  async _renew({
    detachFloatingEntitlements: e = !1,
    cause: t = "unknown",
  } = {}) {
    if (!this.hasCert())
      throw new Error("renewal failed because current cert is not initialized");
    if (this.licenseCert.isEphemeral) return;
    if (this.isTerminated())
      throw new Error("renewal failed because current cert was terminated");
    if (this.config.offlineMode)
      throw new Error("renewal failed because SDK is in offline mode");
    let [n, i] = await Promise.all([
        this.config.collectUsageMetrics
          ? this.config.collectUsageMetrics()
          : [],
        this.config.collectPassthroughData
          ? this.config.collectPassthroughData()
          : {},
      ]),
      s;
    try {
      s = await g(
        `${this.config.server}/renew`,
        {
          consumerId: this.licenseCert.consumerId,
          tenantId: this.config.tenantId,
          deviceFingerprint: this.deviceFingerprint,
          productIdentifier: this.config.productIdentifier,
          renewalToken: this.licenseCert.renewalToken,
          detachFloatingEntitlements: e,
          cause: t,
          usageMetrics: n,
          passthroughData: i,
        },
        { timeoutInMs: 1e4 }
      );
    } catch (o) {
      throw (
        (this.log("license renewal failed: " + o.message, "warn"),
        new Error(o.message))
      );
    }
    let a = s.data;
    if (s.status == 200) {
      if (!a.hasOwnProperty("licenseKey") || !a.hasOwnProperty("x509"))
        throw (
          (this.log(
            "license renewal failed: unexpected server response",
            "warn"
          ),
          new Error("unexpected server response"))
        );
      let o = this.stringifyCertContainer({
        licenseKey: a.licenseKey,
        x509: a.x509,
      });
      await this.config.saveCertStr(o),
        this.log("license successfully renewed", "debug"),
        (a.detachedEntitlementsCount ?? !1) &&
          this.log(
            `skipped importing ${a.detachedEntitlementsCount} floating entitlements which are currently in use elsewhere`,
            "info"
          ),
        await this.initCert();
    } else {
      let o = `license renewal failed: ${a.message ?? "unknown reason"}`;
      this.log(o, "warn");
      let l = new Error(o);
      throw (
        (a.errorId &&
          ((l.errorId = a.errorId),
          ["NOT_FOUND", "CONSUMER_TERMINATED"].includes(a.errorId) &&
            (this.log(
              "license was terminated by the server. Deleting local cert.",
              "warn"
            ),
            await this.config.saveCertStr(""),
            await this.initCert())),
        l)
      );
    }
  }
  hasCert() {
    return !!this.licenseCert;
  }
  isTerminated() {
    if (!this.hasCert()) throw new Error("Cert is not initialized");
    let e = new Date();
    return this.licenseCert.terminatesAt < e;
  }
  getExpiryDate() {
    if (!this.hasCert()) throw new Error("Cert is not initialized");
    return this.licenseCert.expiresAt;
  }
  getTerminationDate() {
    if (!this.hasCert()) throw new Error("Cert is not initialized");
    return this.licenseCert.terminatesAt;
  }
  isValid(e = !0) {
    let t = (s) => {
      e && this.log(s, "debug");
    };
    if (!this.hasCert())
      return t("cert is invalid because it is undefined"), !1;
    let n = this.licenseCert,
      i = new Date();
    return n.expiresAt < i
      ? (t("cert is invalid because it has expired"), !1)
      : n.terminatesAt < i
      ? (t("cert is invalid because it was terminated"), !1)
      : n.createdAt.getTime() - 3e5 > i.getTime()
      ? (t("cert is invalid because system clock is out of sync"), !1)
      : n.deviceLock && this.deviceFingerprint !== n.deviceFingerprint
      ? (t("cert is invalid because device fingerprint does not match"), !1)
      : this.config.tenantId !== n.tenantId
      ? (t("cert is invalid because tenant ID does not match"), !1)
      : !0;
  }
  hasFeatureEnabled(e, t = !0) {
    return !!this.getFeatureValue(e, t);
  }
  hasFeatureDefined(e, t = !0) {
    return this.getFeatureValue(e, t) !== void 0;
  }
  hasQuotaLeft(e, t) {
    let n = this.getFeatureValue(e);
    if (n === void 0) return !1;
    if (typeof n != "number")
      throw new Error(`${e} cannot be used as quota as it is not numeric`);
    return n === -1 ? !0 : Math.ceil(t) < Math.ceil(n);
  }
  getFeatureValue(e, t = !0) {
    if (!this.hasCert() || (t && !this.isValid())) return;
    let n = this.getFeatures();
    if (n.hasOwnProperty(e)) return n[e];
  }
  updateCurrentFeatures() {
    if (!this.hasCert()) return;
    let e = new Date();
    (this.licenseCert.expiresAt < e || this.licenseCert.terminatesAt < e) &&
      (this.currentFeatures = {}),
      (this.currentFeatures = this.licenseCert.entitlements
        .filter((t) => t.validFrom <= e && t.validTo > e)
        .sort((t, n) => t.validFrom.getTime() - n.validFrom.getTime())
        .reduce(
          (t, n) => ({ ...t, ...n.features, ...n.featureOverrides }),
          {}
        ));
  }
  getFeatures() {
    return this.hasCert() ? this.currentFeatures ?? {} : {};
  }
  getCurrentEntitlements() {
    if (!this.hasCert()) return [];
    let e = new Date();
    return this.licenseCert.entitlements.filter(
      (t) => t.validFrom <= e && t.validTo > e
    );
  }
  getManagementJwt() {
    return this.licenseCert ? this.licenseCert.managementJwt : "";
  }
  async getCertStr() {
    return this.config.loadCertStr();
  }
  getConsumerId() {
    return this.licenseCert?.consumerId;
  }
  isRenewalDue() {
    if (!this.licenseCert || this.licenseCert.isEphemeral) return !1;
    let e = new Date().getTime(),
      t = 1e3 * 60 * 15,
      n = 1e3 * 60 * 20,
      i = this.licenseCert.expiresAt.getTime(),
      s = this.licenseCert.issuedAt.getTime(),
      a = this.licenseCert.terminatesAt.getTime(),
      o = e > i - this.config.autoRenewOffset * 1e3 && e < a,
      l =
        this.getCurrentEntitlements().find(
          (m) => e >= m.validTo.getTime() - t && e <= m.validTo.getTime()
        ) !== void 0 && s < e - n;
    return o || l;
  }
  formatDuration(e) {
    let t = Math.floor(e / 3600),
      n = Math.floor((e % 3600) / 60),
      i = e % 60;
    return `${t}h ${n}m ${i}s`;
  }
  toString() {
    return (
      `## CONSUMER CONFIG ##
tenantId: ${this.config.tenantId ?? "<n/a>"}
productIdentifier: ${this.config.productIdentifier ?? "<n/a>"}
deviceFingerprint: ${this.deviceFingerprint ?? "<n/a>"}
autoRenewalEnabled: ${this.config.autoRenewEnabled ? "true" : "false (!)"}
autoRenewalOffset: ${this.config.autoRenewOffset} (= ${this.formatDuration(
        this.config.autoRenewOffset ?? 0
      )})
--
## LICENSE CERT ##
version: ${this.licenseCert?.version ?? "<n/a>"}
tenantId: ${this.licenseCert?.tenantId ?? "<n/a>"} ${
        this.licenseCert?.tenantId !== this.config.tenantId ? "(!)" : ""
      }
consumerId: ${this.licenseCert?.consumerId ?? "<n/a>"}
deviceFingerprint: ${this.licenseCert?.deviceFingerprint ?? "<n/a>"} ${
        this.licenseCert?.deviceFingerprint !== this.deviceFingerprint
          ? "(!)"
          : ""
      }
createdAt: ${this.licenseCert?.createdAt ?? "<n/a>"}
issuedAt: ${this.licenseCert?.issuedAt ?? "<n/a>"}
expiresAt: ${this.licenseCert?.expiresAt ?? "<n/a>"}
terminatesAt: ${this.licenseCert?.terminatesAt ?? "<n/a>"}
isEphemeral: ${this.licenseCert?.isEphemeral ?? "<n/a>"}
isValid: ${this.isValid(!1)}
isRenewalDue: ${this.isRenewalDue()}
entitlements: ${this.licenseCert?.entitlements.length ?? 0}
` +
      this.licenseCert?.entitlements
        .map(
          (e, t) => `--
## ENTITLEMENT ${t + 1} ##
id: ${e.id}
productId: ${e.productId}
validFrom: ${e.validFrom}
validTo: ${e.validTo}
features: ${JSON.stringify(e.features)}
featureOverrides: ${JSON.stringify(e.featureOverrides)}
`
        )
        .join("")
    );
  }
  triggerOnFeatureChangeCallback() {
    this.config.onFeatureChange &&
      this.config.onFeatureChange(this.currentFeatures ?? {});
  }
  setTimerForNextEntitlementChange() {
    if (!this.hasCert()) return;
    let e = new Date().getTime(),
      t = new Set();
    t.add(this.licenseCert.expiresAt.getTime() - e),
      t.add(this.licenseCert.terminatesAt.getTime() - e);
    let n = [
      ...this.licenseCert.entitlements.reduce(
        (s, a) => (
          s.add(a.validFrom.getTime() - e), s.add(a.validTo.getTime() - e), s
        ),
        t
      ),
    ]
      .filter((s) => s >= 0 && s <= 15 * 60 * 1e3)
      .sort((s, a) => s - a);
    if (n.length === 0) return;
    let i = n[0];
    clearTimeout(this.entitlementChangeTimeoutPointer),
      (this.entitlementChangeTimeoutPointer = setTimeout(() => {
        this.updateCurrentFeatures(),
          this.triggerOnFeatureChangeCallback(),
          this.setTimerForNextEntitlementChange();
      }, i + 1e3));
  }
  async renewalCron({ force: e }) {
    if (e || this.isRenewalDue()) {
      this.log("attempting license renewal", "debug");
      try {
        await this._renew({ cause: e ? "startup" : "auto" });
      } catch {}
    }
  }
  async initCert() {
    // STEP 1
    if (!this.isShuttingDown)
      try {
        let e = await this.getCertStr();
        // console.log("cert passed from n8n postgresql: ------>", e)
        if (!e) {
          this.licenseCert = void 0;
          return;
        }
        if (e.length < 50)
          throw new Error("cert string is undefined or too short");
        // STEP 2
        let { x509: t, licenseKey: n } = this.parseLicenseCertContainerStr(e);
        // console.log("step 3 original ----->", this.getIssuerCert())
        // console.log("step 3.0 ----->", new f.X509Certificate(t))
        // console.log("step 3.1 ----->", new f.X509Certificate(t).checkIssued(this.getIssuerCert()))
        if (
          ((this.x509Cert = new f.X509Certificate(t)),
          !this.x509Cert.checkIssued(this.getIssuerCert()))
        )
          throw new Error("cert was not issued by an approved issuer");
        let s = this.x509Cert.publicKey.export({
          format: "pem",
          type: "pkcs1",
        });

        // console.log(s)
        // console.log("step 3.2 ----->", s)
        // console.log("3.3 ----->", new T.default(s))
        (this.key = new T.default(s)),
          (this.licenseCert = this.parseLicenseKeyStr(n)),
          this.updateCurrentFeatures(),
          this.triggerOnFeatureChangeCallback(),
          this.setTimerForNextEntitlementChange();
        // console.log("Bingo !!!!", this.licenseCert)
      } catch (e) {
        // console.log("hellsdnc", e)
        this.log(
          `cert could not be initialized. ${
            e instanceof Error ? e.message : ""
          }`,
          "error"
        );
      }
  }
  stringifyCertContainer(e) {
    let t = JSON.stringify(e);
    return Buffer.from(t).toString("base64");
  }
  parseLicenseCertContainerStr(e) {
    let t = Buffer.from(e, "base64").toString("ascii"),
      n = JSON.parse(t);
    // STEP 3
    // console.log("base 64 -> asciiii -> JSON", n)
    if (!n.hasOwnProperty("licenseKey") || !n.hasOwnProperty("x509"))
      throw new Error("license cert container could not be parsed");
    return n;
  }
  parseLicenseKeyStr(e) {
    let t = this.validateLicenseKey(e),
      n = { ...t };
    return (
      (n.createdAt = new Date(t.createdAt)),
      (n.issuedAt = new Date(t.issuedAt)),
      (n.expiresAt = new Date(t.expiresAt)),
      (n.terminatesAt = new Date(t.terminatesAt)),
      (n.entitlements = n.entitlements.map(
        (i) => (
          (i.validFrom = new Date(i.validFrom)),
          (i.validTo = new Date(i.validTo)),
          i
        )
      )),
      n
    );
  }
  validateLicenseKey(e) {
    // console.log(e)
    // the original key that was passed from n8n postgresql
    e = e.replace(/(\r\n|\n|\r)/gm, "");
    let t = e.match(
      /^-----BEGIN LICENSE KEY-----(?<encryptedSymmetricKey>.+\|\|)(?<encryptedData>.+)\|\|(?<signature>.+)-----END LICENSE KEY-----$/
    );
    if (!t) throw new Error("license key could not be parsed");
    let n = t.groups.encryptedSymmetricKey,
      i = t.groups.encryptedData,
      s = t.groups.signature,
      a,
      o;
    // console.log("testing the symmetry key and all", n)
    // console.log("testing the symmetry key and all", n)
    // console.log("checking i think", this.key.decryptPublic(n, "utf8"))
    try {
      a = this.key.decryptPublic(n, "utf8");
      // console.log("xxxxx ------------", a)
    } catch {
      throw new Error("Invalid data: Could not extract symmetric key");
    }
    try {
      o = d.default.AES.decrypt(i, a).toString(d.default.enc.Utf8);
      console.log("ooooooooo -----", JSON.parse(o));
    } catch {
      throw new Error("Invalid Data: Could not decrypt data with key found");
    }
    // problem area here now!
    if (this.key.verify(Buffer.from(o), s, "utf8", "base64"))
      return JSON.parse(o);
    throw new Error("License Key signature invalid");
  }
  getIssuerCert() {
    // console.log("this.x509IssuerCert", this.x509IssuerCert)
    return this.x509IssuerCert;
  }
  async shutdown() {
    if (
      ((this.isShuttingDown = !0),
      this.config.autoRenewEnabled &&
        clearInterval(this.renewalIntervalPointer),
      this.checkUpcomingEntitlementChangesCron &&
        clearInterval(this.checkUpcomingEntitlementChangesCron),
      this.entitlementChangeTimeoutPointer &&
        clearTimeout(this.entitlementChangeTimeoutPointer),
      !this.hasCert())
    )
      return;
    this.licenseCert.entitlements.some((t) => t.isFloatable ?? !1) &&
      (await this._renew({
        detachFloatingEntitlements: !0,
        cause: "shutdown",
      }));
  }
};
0 && (module.exports = { LicenseManager });

const license = new p({
  server: "https://license.n8n.io/v1",
  tenantId: 1,
  productIdentifier: "Demo Product v1.2.3", // must regex-match cert.productIdentifierPattern
  autoRenewEnabled: false,
  deviceFingerprint: () =>
    "91168cb9dab1d51aa40e4d988b6b4d0badbd085170a6bd921943881fa5250071",
  renewOnInit: false,
  autoRenewOffset: 60 * 60 * 48, // = 48 hours
  // logger: myLogger,
  loadCertStr: async () => {
    // postgresql code
    // return "eyJsaWNlbnNlS2V5IjoiLS0tLS1CRUdJTiBMSUNFTlNFIEtFWS0tLS0tXG5ubThzNzVDWUt4UlhORXpyaHd2WjdCcHNaT29DV09QNlNRU0I3MGZxS1VzcE4yZkFkalRBK1JyTGthUDZ2T1B4XG41VVlDZkxwbFVGRDBFM0YycjNTSjlGVXV4MlRuMU5SR3lPNUN4SHgrNmNsdVg5ZGxkNlIyOGZDYUdyV0tNblc0XG5MeTNQd0tjdkxFTmIyeU9jQnkxM1VFbjUrM0hPSlBaamFSTEFFZDBGcWlBSTQ0RGhKbkNKeS8yTUpza1hLL0Q3XG5Zck1wYysxMTkvSURZd0JFdWJ2am1QR0NSMGZFUHJIM1BiWjdHOFRJYzI4YUwzdGwyTXJKaG1PMUtlWEFJY1pzXG5HcUdQM2NwRGNNdGpCNFMydEs2ZmFZL0pIT0Z5djlpRkx0alRvcVQwTDhIWVVTZVg3ZG1HTU1IeWE3ek81eVJiXG5HME1xK3RKVVAwOElOR2JIdWZhc2VBPT18fFUyRnNkR1ZrWDE5UEVlRTNxb1NIK205VTlKWUFId1Y5MHdoT21EXG5iNFVaSEp6NEEzazZpYTJiWVB6YnlTbHlVV2RsU1h2Snp1QTN6UDJiNGZnWGlYTE5pZXUydlNaMExNYnF0bytxXG43M0J5RUNST1R6L2w0NFVlK21rR3pXOFFoaS9VSWlQTkVzc0pRZ0h4eTFmci9UU3FVV1ZDT1BxVU1hTmlQQzlOXG5oNkZOaGdUZkx1ZS8wSzJ5OXljNmN2N25oS1lOK3pXRjFBUnJIMUVHaDVDeEhiNDdEZ1RLdnhhcjFNY05ETVc2XG54T0VrVVQvUUt3b3QxSnZBc29WWU9UUDU5L3gzaW9YaDlYZ3g1eUkvbzc2WlZCYkdwcjRBVEFjK3FaS1M4bWZWXG5KVkQ1RmNXZ1hFY0E4clpsaURwallmSzl0YVJvV28ycUxUWE1QRXZ2MGg1Nkp6aHdzNGZZR2ZGN3Q3M0lpTW1IXG5GK3FiQmpudW5xUE9VZFZ4ZWpVRGRQc0MzR29yRlE1bmtRbDVJSEx1RmNOdTZEcnhvYllteGRIVmp0cE9rc20yXG5NSlNRT0RORGFJTUdzMnRRVHROZDdNVzNEb2VaaFNtUTBRWFc1UWVORkV2c1VwbnV4QnAvMDRxc2ROellNN0l1XG54SGMyT25laVd1ZTJST25kc3B5UWVzZ085aE8wWDZMN201YWtrYTgyenlpWXFPZytJNDF1aTRSQlMxN3phWTA1XG5nUS9xTWFMZnBtUGFKRTVpNFl4Mmh4VnYyUzhKREhTZjlLaGtuVkxEQ2ZPb21mR3NMbGV5Y1NmdE9nSHBHdkd5XG5PS3VyV20rZHBmYnFzaUxuS1liVjNSVzFtcHBzeUtybS92c3dpQTZadDQ0WUdEYXdKeUIzWGF3SDdyK2UxNkV6XG5ZKzJwWkN1eHFmR2djWitxTldmZHRSdmxQNmlOUXJoaXdueHpva0d0OEsvMUhEcldTV0ljVGNCblpST2tjR3AxXG5rbjRkeEJZeVUzVDRnM012eGhGTXQwb0RxaFppMmtYTjlTdk5pN0NsN3d5cjZpcHNFeWdxdlpEUjBnaW1KZ3lkXG50L0t0MVpJWFFrVGdBRGFkbjBLS1kwNmtFVmEwSFVRRUlIV3FuVi9rV1RiNnExMUdQZmF6dmRhemNHOEpOQmdQXG5saDZISGtBSU9sZzU1UHpUeHREUit6TFNMVUhSb0d4NkM3cDk4KzRqamNoMnpMemZqYzcwdVlHYlBzZ1pIWGFhXG5HdVV6QjIwYkU4N0tabmZ1cEsvMUViQ2ROZWtxZWxCM0wyQUc3VnhoS3NFc1VteWFzRHNQZHlzUExlaHNkdkp5XG5DVjdpWWF4ZUpBQmU5bHgyUExVMlc1SGRJTlp2UGtuWWtOUGFlQUhCTDlaamk5OU9xR0VHdnVObVprNitzMWtDXG5ZWXNzcjZQSkpxb1phNnB6ak5TR3cyODhHTHp1c3FhNTBzaGxGVW03S2JSa3dWYUNGUFhHZmtHajhrVTRYTThGXG54TDNkRnFGS3J2NzgrU3hpODZjZFVDOHhHcXRUZ2RBZzFMS2RzOGw2bmtpQWVBUE5HWHdFMkdmN0EzWTM5cm1IXG4yTUQyMlBGWkhlM2d1cEF0ejV3U1lwRDI1Y1k0b1RTUFVPK2J3SWVETmVlN2l1NzJRZXFkMUpPQm9CaGJzZzh1XG5IZHZXMXREYjRTUHg0MmdXQU42SVE5cHBWcU1PaUJHZnlPeHZ6eTNYWXp1MDZHb1ZMTW9hVEY5cHBGUDdzL3Q5XG40Vk5zNXlNVlloOTVWdzEvYktlbVdxVm5rUTFGWUlqWmZnd0hDaEJzaWlLc2psRThkNUtDQUNkdG1EbUtoblBhXG5rWGxyQklvcHZoendIc05FSVY0K3N4WTFhdWN0VkE0K00yOVFudCttUFk1UzlBbC9KR0s1UlhGR2JVMHdxcGJoXG5qUkM0Zzh5cmp0TkV4ZmFDOFN4Z1J3ZnZRYnMvT2wwL0NnQ1RIbytjS3JNNmo2SUY0VTRtZXJBZ0ZpMGphandPXG42WHo2MUlZek5TRXBmZmhJS1ZOZkJoTHNSZGlmbkNPQ0YwSUQxanQ2d2pwQXRiOE1USGVOTjk1WmpPUDhJVm5FXG5OcHYxcWgrSGZ1VUZyRlc2VzRPUU5sS0h0eFZVcE4zeWszc3VNejRJeEFsbFVIVHNZbnE0MURGVXNPMlhKR3A2XG5lZFVnRUFDZWxnbnBtZmZKMm5YR1ZIbTdjRWR2ZEJmNkJCRVJJYTIwbmhndndYNFF6NkNqekVQc1VqTjlOd0p4XG5hNGRJZ1JYdCtsY0s0NnRhQk8vQkxHa1M2TXM2ajdIemszUm1ZTzFMMVJ6OTJCNUdwQlhGZEc0a0ZJdVpLMm9QXG5EKzhqY0x0bEgwRGlGeUR0QnRVWXc4dHpweGhQV3Ixd0s3MzgwcnFIQTI2bEluUVdZekJ1ZXV2Si9HREIycGpyXG5JOVlzQ3JrQjRaWnRVcVo3WkVTOElGbWVrK0ljaXMwVzc5Unl2Q1VoenhVay82Vm9NV3R6ZzVsc1ZMVEdqQjZHXG51dklIdm9KQSt6NU12N002VmMzZWVSNk5nWkViMFRvcndYYWZRME9jaytGMGFHQkdGNm43cVZvV2g5UUE4TnJhXG5HTjZwdGZxcnVVeUN0c2xBWUxYeVFlU3czZHJlVmdoNk5zeXUyTFl6YXNKMC83NVNsZWNselU4VE91V0NOL0V5XG5JTzlvODROYWpqcC9RVThJUzcwNDlpUjAwQnVnSWFlRG1PMVVwa0ZXdFNzTnd0bGJDYTJMdEdwS2NGQ2lZeGFsXG5SSFhQUT18fE9nWkg5WGVIK3kyNTZCTjI1RG83NTVIRU1uSXU3Mm1nYVg0c3ZoUHZtdWJ0RENFT1hHL2daMUdiXG5nSnk0WWhUNzJleXRrMDBlcFlDOEgrUzR5MXIwQ21LMHI5eUNFemJObUdwemRwVmxLdERWRUlSeXFlUVBEU2lVXG5VU25yZjRKaFVkSGZicEpETmdhZnNhVVZsYlcwYW1SdUs2TUwxamdlS0Evc2NZbVhwVTFNbUorT29VZmxWbnFQXG5yb1loVFRqRm1KNnBUOTk1Ti9qSUFKRkR1d3NuRmZSeDFHU01Ga3NYaCsybEpxY1FQUnFjVkU2ZHpMaFpTYkRWXG5SZDhxUklUamxEYU5Nd1JEeWtYNkxNZlR4RWVyOHczQkJWcys3NzdwMWkrS0tXL05RRHRFcDFTS0xDeTU5YXFMXG5CcnJzem05Vm5KQXFjSlR3YTdWcmdjUjdCaDhzZkE9PVxuLS0tLS1FTkQgTElDRU5TRSBLRVktLS0tLSIsIng1MDkiOiItLS0tLUJFR0lOIENFUlRJRklDQVRFLS0tLS1cbk1JSUVERENDQWZRQ0NRQ3FnMm9EVDgweHdqQU5CZ2txaGtpRzl3MEJBUVVGQURCSU1Rc3dDUVlEVlFRR0V3SkVcblJURVBNQTBHQTFVRUNBd0dRbVZ5YkdsdU1ROHdEUVlEVlFRSERBWkNaWEpzYVc0eEZ6QVZCZ05WQkFNTURteHBcblkyVnVjMlV1YmpodUxtbHZNQjRYRFRJeU1EWXlOREEwTVRBME1Gb1hEVEl6TURZeU5EQTBNVEEwTUZvd1NERUxcbk1Ba0dBMVVFQmhNQ1JFVXhEekFOQmdOVkJBZ01Ca0psY214cGJqRVBNQTBHQTFVRUJ3d0dRbVZ5YkdsdU1SY3dcbkZRWURWUVFEREE1c2FXTmxibk5sTG00NGJpNXBiekNDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUEFEQ0NcbkFRb0NnZ0VCQU1CTTA1WEI0NGc1eGZtQ0x3ZHBVVHdBVDgrQ0JreUxLRnNlemtENUsvNldoYVgvWHJzZC9RZDBcbjIwSjd3bDVXZEhVNGNWQm1GUmpWd1Z6a2xDSzJ5WUppOG1qeDhzWHNHcTlRMWxiVWVNS2ZWOWRzZ2Z1aG5sQVNcbnRuUVpnbHVnT25GMkZnUmhYYi9qSzB0eFRvYW8rYk5FNnI0Z0lFenBrdEhMQlRZdnZpdUptcmVmN1diUFJ0NElcbm5kOUQ3bGh5YmVieWhWN2t1empRQS9wUEtIVEZzOE1USFo4aFlVeFJ5cnBtMytNWXpRRCtiakEyVTFGSWN0YVVcbndRWFlXYU43dDJ1VHdDdDl6QUtzbVkvV2VPYnZsM1RaTjVPTkxBenlXR0N1bG01Y3dLUjN4YmxCWnpYbkI2Z3Ncbk9uTjJPQWRTdGN6VFZDeWNtOHBjRlVyeXRLU0trR0VDQXdFQUFUQU5CZ2txaGtpRzl3MEJBUVVGQUFPQ0FnRUFcbmxKMDF3Y24xdmpYWENIdW9pN1IwREoxbGx4MStkYWZxeUVxUEEyN0p1K0xYbVZWR1hRb3JTMWI4eGpVcVVrY1pcblRCd2JXRk81ejVkWm1Odm5ieWphem0rNm9PZzBQTWFZeGg2VEZ3c0kyUE9iYzdiRnYyZWF5d1B0LzFDcG5jNDBcbnFVTWhmdlJ4L0dDWlBDV3ozLzJSUEpXWDlqUURTSFhDWHE4QlcrSS8zY3VMRFp5WTNmRVlCQjBwM0R2Vm1hZDZcbjZXSFFhVXJpTjAvTHF5U09wL0xaZ2xsL3QwMjlnV1Z0MDVaaWJHb0srY1ZoWkVjc0xjVUlocmoydUZHRmQzSW1cbkpMZzFKS0o3aktTQlVRT2RJTUR2c0ZVRjdZZE12TXVyQ1lBMnNPTk44Q1orSTV4UVYxS1M5ZXZHSE01Zm13Z1Ncbk9QRnZQenREQ2kwLzF1Vzl0T2dIcG9ydW9kYWN0K0VaTmtBVFhDdlppdTJ3L3F0S1JKRjRVNElURW01YVcwa3dcbjZ6dUM4eHlJa3Q3dmhkczQ4VXVSU0dIOWpKckFlbWxFaXp0R0lMaEdEcXpRR1libGhVUUZHTWJCYjdqaGVMeUNcbkxKMVdPRzYyRjFzcHhDS0J6RVc1eDZwUjF6VDFtaEVnZDRNa0xhNnpQVHBhY3JkOTVBZ3hhR0tFTGExUldTRnBcbk12ZGhHazROdjdobmI4citCdU1SQzZpZWRQTUN6WHEvTTUwY044QWc4YncrSjFhRm8rMEVLMmhXSmE3a2lFK3NcbjlHdkZqU2R6Q0ZsVVBoS2trVVprU281YU90Y1FxN0p1NmtXQmhMb0ZZS2dwcmxwMVFWQjBzR1pBNm82RHRxamFcbkc3L1JrNnZiYVk4d3NOWUsyekJYVFQ4bmVoNVpvUlovUEpMVXRFRXRjN1k9XG4tLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tXG4ifQ==";
    // wrong issuer code
    // return "eyJ4NTA5IjoiLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tXHJcbk1JSUR1RENDQXFDZ0F3SUJBZ0lVQVdab3dULzRzL2NneC9Vd3F2SC9lNXIzVFhNd0RRWUpLb1pJaHZjTkFRRUxcclxuQlFBd2daVXhKakFrQmdOVkJBTVRIVmx2ZFhKRGIyMXdZVzU1SUV4cFkyVnVjMlVnUVhWMGFHOXlhWFI1TVFzd1xyXG5DUVlEVlFRR0V3SlZVekVUTUJFR0ExVUVDQk1LUTJGc2FXWnZjbTVwWVRFV01CUUdBMVVFQnhNTlUyRnVJRVp5XHJcbllXNWphWE5qYnpFVU1CSUdBMVVFQ2hNTFdXOTFja052YlhCaGJua3hHekFaQmdOVkJBc1RFa3hwWTJWdWMyVWdcclxuUkdWd1lYSjBiV1Z1ZERBZUZ3MHlOREV5TURjeU1ERXpOVGhhRncweU5URXlNRGN5TURFek5UaGFNSUdWTVNZd1xyXG5KQVlEVlFRREV4MVpiM1Z5UTI5dGNHRnVlU0JNYVdObGJuTmxJRUYxZEdodmNtbDBlVEVMTUFrR0ExVUVCaE1DXHJcblZWTXhFekFSQmdOVkJBZ1RDa05oYkdsbWIzSnVhV0V4RmpBVUJnTlZCQWNURFZOaGJpQkdjbUZ1WTJselkyOHhcclxuRkRBU0JnTlZCQW9UQzFsdmRYSkRiMjF3WVc1NU1Sc3dHUVlEVlFRTEV4Sk1hV05sYm5ObElFUmxjR0Z5ZEcxbFxyXG5iblF3Z2dFaU1BMEdDU3FHU0liM0RRRUJBUVVBQTRJQkR3QXdnZ0VLQW9JQkFRQ3JaZGQxU2NwY29aYm1FTnNzXHJcbkQyRW1ZYXNLdEoxLzh5Ri8vNUFSaEk2TWQ3cmFBVFltbml3NnJqYThveitUdldiUFVHdnNYSjYwbjhRaVgwbExcclxuOU5DVG1Qck82TEhMdXptSDczemhXdUcrclRpYTk2VmNWcXVDSXlvNG5nR2UvdHVDWGZzV09iRWJNSUJuTEJrbVxyXG41WUU5Q25DdTRHNnA2c3RHbmVBSDBKTzRhNVI0TTZaZkg4SmRIS01HSmpOVHVQOFBUd0o3ZC8rQUxIQUEwQWdPXHJcbkFWa2s4UFpNc3NGUFFESTVzaGF5cXZ2a21ENCtqY2ZoVFB1YUx5TnNacHhXdlovSGVWL1ZjQXBEZTh6cUUxYm1cclxua0MzVnRKWG1VQjJTR2xXeHdsQWhzb0NDNzIyL3JyOUVpRE1ycldxVjcybDhrQUp1MS8yb2hMREsrTTdndHVYQlxyXG5NQXlIQWdNQkFBRXdEUVlKS29aSWh2Y05BUUVMQlFBRGdnRUJBQ3hxTHNrbFdWRW9lQWNDZGhUVGZwVDFHYXVRXHJcbnRUOGNvNU56aHU2TFNEWm4zbmNJanZSTU80OEQzVG9xNTR3eEZFajU5bmhCcjdrRlFjWUI4cmw4UUFSMWplckxcclxuWlBhU2wvS2pnR0kyeWlZbm5EQTVTZlZKTU4zd0d2TUloMW4wUWFaQk5OMVVqcXRpMy9OZWFFUHZob1FwNTRKY1xyXG5YRDFodW52bTR3c3lvaFVuUlRrdVRFY3VJMW1jMkI1Zzl3Uk9CSDVYSTZxSmpEdW9GZGRKNkFCY25wZ0tpTkh6XHJcbkgwbEhxZ3AzNXBjWnBGOTMrR05ITm5BdXJxYlNGOXI4NTljWGRzcCs3YXRsNkx3THhSZFRsME05d1FobzFXenVcclxuNWpwb0NMTEd2NTBpOC8wZklZR0d0eTFNUDF0TVVET2pGVVF2TmZSZitDckZNVDVPTno1c1dBS0QxMlk9XHJcbi0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS1cclxuIiwibGljZW5zZUtleSI6Ii0tLS0tQkVHSU4gTElDRU5TRSBLRVktLS0tLW0yUzQwSEVrUkRJV3h1VTJPcnZnTG91ZnE1bHBhRC8wbDUwRHl6MWRJK05qbkpqanhYY0RwbDNUbWo3RERaV2FaMi81c0V2djNLQXYxdTVNS1A5cUh2OWcyNE5JeUhPR3ZzK29OZERJNm1qRFBRVzY5d2JBWnQ0eTRTYVo1ZFN0aEkyZGJHWENvL29tZ0luUXRUYnk0bUpZVFhsNnFPUWpDR29XbjF3SGUrUWtaUy9FUStCOEhibm9sMDg4NXI5d3BGNTJUV1FvN0dkWHhFdUV0bTZWVGZvNWQrN3FWeFpIUElVTjFkSmR6ZkhERnY2N3lSVEVwaU1OZXlmSDdnSVlVZkw0eXlRR1krNS9XSFVpeVZPTjgzM1M2STVGdlZrR3E4Qmk3SE9rdjRNRlU1dHl0RWRVbXQyQWM4R09RVmlFTE1NcDBsTjJ2eDlhZTRYelhrR2dUUT09fHxneUFsTHRQWXl2VDdKSjd6c1Q1RzBnPT1FbG5pVWxQRUdPSWFDRndBVXpnSnNlZ21lUnNGei81WUMvNllBa0p2RmQvSWoycmthaDFVVWJveGVIMXprQkUzVEFScldJalRHNk5QWDBqYWJLY3k4Ukx6M2g1cnF4QkpldVA0MUpVUzJUN3BGcG0vb29wZVRKZ0VzSWtZblpDZUxiQzlsdkpLOE1HVjBuUG5FdlZoK2lpc0hLM3ZwdUpldFJrcmphTzNmRkRRUXJEa05wTUhHTlBpRVljN25lOWpYSHF5YzB2ODliMFAxRTlXeTVZM29Fa05YSXFiU3k0TkV6V2tmemRqOXAyc2U0dUNGQkhNMjdGRjgxb1cvTmcwNTNYdnhQR1NSOWRaSFMyMm5vL0wvOWxkbUhLMVNZbE0vOHhldENxN0g1VVlqTUovam5hcjRuRHIzUUM0SGtQUXRydG8zcmw4emlZV0xaQ0pkVWZXWExqV1dVNGlvbE1nS2pCaXFLcHpKRm81TiszSUhHUThpOEI0M0Z1d3JCZjl8fE1NS2t0UVVkZjBrSHROSXY1MU1qeHlLSkV0cWF6WmJGR2p0R0N6MTgyenJpeXFhM0NEd05KNW8vSktxZG5XTUpGSklTVDQwUE1ZM0VUWFlyeDBwSEg4Y2JyZHdDa1RHeS9HNkJ4a28yaWxBMjdESTlmcjQyOStzeW1ma3owVE9QVXl5T0tjMzlzTmdHenNrNDZUeXJSbmx2N1k0ekJGbW5ZVVJyTjdXMFFMWEZFR3Z2S1NUV2J0UDNpVXByOWpVelR5UWZiZDF5ckx0TW1tTkUrV1NqWGRTQjR0NUhrOVdpWDBmQnZUa3ZmaW1VYTJBTFEvdkhucURWMWozQnU4dHZabDRmREJNL2E1Z252N3NJUWRjdFdscUhzMGN4R1BqdEVDWjRESFJwZEhpS2JyVWlqY2MzbEsrb25nUU1TYVUvaVdpL2NRRzdvU0tscFdKVkZvY1VJUT09LS0tLS1FTkQgTElDRU5TRSBLRVktLS0tLSJ9"
    // correct issuer code i think
    return "eyJ4NTA5IjoiLS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tXHJcbk1JSURWakNDQWo2Z0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRVUZBREJJTVFzd0NRWURWUVFHRXdKRVJURVBcclxuTUEwR0ExVUVDQk1HUW1WeWJHbHVNUTh3RFFZRFZRUUhFd1pDWlhKc2FXNHhGekFWQmdOVkJBTVREbXhwWTJWdVxyXG5jMlV1YmpodUxtbHZNQ1FYRFRJME1USXdPVEE1TVRZek1sb1lFMDVoVGs1aFRrNWhUazVoVGs1aFRrNWhUbG93XHJcblNERUxNQWtHQTFVRUJoTUNSRVV4RHpBTkJnTlZCQWdUQmtKbGNteHBiakVQTUEwR0ExVUVCeE1HUW1WeWJHbHVcclxuTVJjd0ZRWURWUVFERXc1c2FXTmxibk5sTG00NGJpNXBiekNDQVNJd0RRWUpLb1pJaHZjTkFRRUJCUUFEZ2dFUFxyXG5BRENDQVFvQ2dnRUJBSzB6VUJYVUI2djBQSTZkVTdTaTYyZFQ4NW40SjRORS9GQkkzUmt3dGxjdTJ6cXg0a0RsXHJcbnpyU0NTWmV1cFJseGZCQ0cxOFpjY0ZLQ3hsZU9aTVY4Qm1ucllvQVdHSmY0NXlBZnVHY1BNKy94R0JzSU1rdHZcclxuZDU0dzJTeXBaOTFnVEdMallaeHVqRUlaVE1HejhqUkpSR2tXWkhscmNla3hUWnl0STcrVnpJMDQ0YSsxYWJRWVxyXG4vOEtPNUlwaGtieGZKRDdGWWhQK1hjTHNzOXN5UWtZZDNYYXNNd1BOeG1yNjBSK255QkZMLzNXTDRMeFhCYTZEXHJcbktGVWpYNEdzbHFFcG5WTWt5aDVzSHNKWmw3U3U0R1F2NFB1aWtFVXRtTTU5aVVqOXVJQUVRTnNzVk1rQnNST25cclxuYS9sQnQxNytCQzJaZ0w4NkxsUnNmRCtZaGVYUGVucm50NFVDQXdFQUFhTkZNRU13REFZRFZSMFRCQVV3QXdFQlxyXG4vekFMQmdOVkhROEVCQU1DQXZRd0pnWURWUjBSQkI4d0hZWWJhSFIwY0RvdkwyVjRZVzF3YkdVdWIzSm5MM2RsXHJcblltbGtJMjFsTUEwR0NTcUdTSWIzRFFFQkJRVUFBNElCQVFCRndxUFdWUnBKempOckd0bHBOZmxoVlYwZFFIV0RcclxuMUFOMHgyWGc2b1VGaDhMR092SXpab1RDdkZtUjNmR2sxZGFjL3dsMDI2Z2s3TjVhcUJVSkhaSFhocFdoNVk3eVxyXG5jejhNUUh3N1Z0cThFbXcrdXRlNkJEYjI0R2JwMHAxUlFTNzZwT1YzRDhuVS9sZ1Q3aWFDK0pDNFFiOWZnenVGXHJcbkE3N3JiOTMzMThrMlBPYXJMRUYzOXVPSGM2bWd0WnhLQWxqUEpVUkdpR0xyZHYyUndNdDNaYnZrVVpUME81dnBcclxuRWdUb1hwMWRVSFdvb01VTEh0TUREdFlWMklVVDQxWld3VGNjTXFGRUNwY014NWZ5aCt6TzdhU1BvWUplWVl1bFxyXG5FK0hmT2ptQTA2eU1iUTJhVGxXVEMvcGd5RElOL014NFdEbUplVWNoMmpMMzF6OFZ0TGZaRU13dlxyXG4tLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tXHJcbiIsImxpY2Vuc2VLZXkiOiItLS0tLUJFR0lOIExJQ0VOU0UgS0VZLS0tLS1qQythMmpuaytEdm9Xa21FMGJvczVFN3FmaE1SNFJGdDlwRDBmOGg4b0NqNytGTzdVZXNCZlpFU0REbU1MS09vTC9ZNkN2UFl5T3JaV1NwbjNKS1pDbWNsVGxaODMyMGVVb0hJRWJHQ2loWVYvMVAwQWRkRWc1L0NxU0Q1ZjRDTGFubUhzak1vU1NKcGRUQXFPaG9vU3dYVjhVdXdzSkM4ci9TTDl2NmJ4WHRBUE9xWU9jTEFJT21QSE12aWlHQXRTZ3RMVnpKU2lhSzVMOGZXTEliUXZieFY5N0U2a2F1eTVJbU4wZFBrOWFwZThIUHBIRHZJaVdUOTBvemNpMjA2RDR6Qk55aHlMUTRjK0dhQXBXWVpTL1l4aUc5VXdiQjg5bjFPRi9FZlRzRFEwUFdvRjc5dzc2VHk5RWVCQ055UlhQN3daenBhMmozQ3k2c0JUS1lpcVE9PXx8VTJGc2RHVmtYMTg4ZzdFZkpXKzZnYnk1SlZISm5oUEl2c3V1OHVnOFpLOWxEZ0RZMGRiYkpsTGxwRGMyQ3ljQVZEdlU5WDQ3RG52RkkyK2E0dW1CdTR5enJLbGx4TnRPOXJMcS9CZVJIMnZ0TkJycHJndXN6N1JSWTRUSTZVSU1EVGE2cXR5RWhwN2NWdVRVcWpia0hLaFRRM1pjWmxjbk1VZVZ5bjZFVzZ4ZWRZWnVnWWRkUDl6U0VncWVmNWp0RCtsT1lCQXBuNGVSWTl6Mys0M1FBRWxKMmVlOWRiMXlNeTBUWXNXSVVublVhYTc5SlBsN1pSNnZ2M0hDbE5WV2NVbXVXQWZtcVlYdDlmVU5CSldLbHRWOFFRWDZwUm1CRkdCR3phZTRrc0hmb01hVFdYek13L2NVcmZ6QzliMmJ5RGlsZSsvRk5EVFMwdThvYjhUcEdSQ3UxMDVsbDRHczc2ZVVueWpzRTFUUFl0VExHTHVnaWZnYWRPRG56bmxzNEJ4ZVpaby9VenQvSjNHK1RyNWEyVXB2ZW5LLzU5Yk16T2FFMkc2akd5L1IyU0xlZVVxSXVvbGlSM2V1WTFOaVd0SStDcTArNkZEaTJwL20ycWQ0VTczMk1LOGEzZGE0aCthWHA2eC8yT1hLOWEvQmhKbXZKT3JLaGJ5TTVQcllIZUtqdVRVVGlzQWVyRjArQzkrSUpDUkZLZUxPMTdRc1ZpNWFrem83MVV1VWJVRElTWEJLcUpyR0MxZ2txUU9UZmMxTFlmQU9EL2hnUmpzL1lLWWpGVk5yLzZKeldmcHBSZDN0UW1lUDdsTncrUkFQTHptcjc3eGRRcjNxZi9wWDBGV256TytwTTZkUDNaS3drQURWNVVNSWdtSlhiZzBjQWdFblZFaWhWUHFYUGZlcWNzZXNubFhlaTlYeVUxN2tFRWJBQzY5aUYrdzI3b1pma2JHZzU3YzZsY0JUYUlHS2JiWEJFWk5VYkJrcFkwdGRPL1hjWWZoaTJxTW1LbDVxWGk4U0s3SDg3cFNTYVRjZVlnNmNyTzZwL0d6ZE8vc2FMUmVMWEc4VE5GNTVOdHFBRHFaTmZyNUFEaWwxeGE0aUlKLzJEVWhiQjhQZTZaemFFSzBLbzdnZkFxY1VvVXRuN3pLSFNKdnJtN2EwdlZra3RVeVZaZDhoYWF0R2xzNXpZRGtnZEZDNUZ1MTlmazI1Ry92S1ZxaU0rSFlNYllLME1rV2JjZ1VoTGJkZnVGQThhbU1PZEN6REZXY2V0MU9DSTFxbXJtZkhVcWpWNXpJa1FXWll2S2ZqT3BUQTlTMEdoNlVZU3BpRVY4SVZJeEgyaTU1TGdOeWdxVzJ4QnJ0QlVOVzNFZXExQjFudTBMTkF3Y3I2UnE5elBnNFRNbWhacUxhWlZKNmJvNFpmTVJya3ZPbWw0OE82OHF1bHBqcFNOeGxrTzRLODBjVGEyVW1aN0pUbDcyMlNlMTljajZUMWtiR1p1bmM3ZmdSMTlHZFdSVkhNZFoySHVRK0lIZ1RFRjRyKzUzNFlEenB4dk5Wbm1MTERyQ2xLWGNZNjRXVGVxSU10eThlL2xRT1FpNE5zU3QrSXNhNzd6ZnBCdXZkcjlvU2g1M05jYURjYlF1ZWlUQjRVckxHdGx5eWtyS3E4czVXTkVtMWU5UTFOOW9sdlNoV003QTkrZjFDS1pRR3EvM0UvMEZJdjFIeWxLaWdtS1d6M0dnWnJ6THV0QkRLQmN0TkZLMjdjU3RZYW1RS0NOZHpUSkQxSFNseS85ckFPWVpxVk0vMmlLcTRFSjFNbFcrOGlhSXZEMHZ1UWMvWEdkQzZqcjJ1aW9PNkZSVkpzdEgzdmVCUElzRW9wWUlZbkRJWGNqZUExb1BUVnpobzN6YkdacnJYRE5oeURyektuWmlaVzI5QlNMRlBhNHRqWTNVWE9Td015cFhGejNVdEJOTkU2NTRtd2gzaklTcWtibFE4R0V3OGsvRWM3clJSOGVreXFjU2RoczZzNUdUcXhSek9nOGJLUWd3MWtkRXF0OTRmUnN0RjhSMmNFdTZ0WUpONVRoNkVzbUVmbG1MMHhPS1Q5bFhZYjVQQzVoTk1MdXhqNmYyYVM5WEVRem9hZzRjb3RxNktTM0RqMnhzeHVpa1EvSGxNRUJhWnc4OGgxbUpsQjhuUzRSejVYT01OZXlFd2plU1BlMWtVNExQOHpnUHZzTE0wODlRTjk2bEFFQWlENkNqTlViMExGeHhmRHdxYmZFYndIT0k3TFRwM3ZOQm1aV2FLeGVPTlhBNm5FfHxwKzNhK1FhNE9ZU01aMjE0L3RjMVpYVEdjTHBVUjByNDQ0RldoUnFSeVBlVTRSMlVrVkxLdkZoWk0wQ1U4RWo2bTE5OVNGbEVQRUplcFNlakNHQ1NqTWt6bUMyakhpdUppTEVIMW9QbzBFSi9halZzT1k4SEJDZzlsWklISDh5eUlRa3U4bUtLaXh4UXhndE9ON0VyZFlFUFRWNmJwaUtLcmNobnhydlpiS0FJOU9mQkN2WWwwaXpGWm4zL2Q4MU1qaWp1NXBrUE1GMTNYQy92WkRLWU5wN01icldEdjNNUm5XUC9Qd3FsYWhHYTB2STVrOXVhT2VrYjRYRXJZenV6UTkxcHAzQTU4M2VLZlFPdkp1bDNpVXQ1MlJYVldTczRRc2huOGRCWHNEbWJvSDRZY2Zpckc4WjBFa2RjSk53TE1oaytjcWJISENBelE4RjBvM09aTkE9PS0tLS0tRU5EIExJQ0VOU0UgS0VZLS0tLS0ifQ==";
  },
  saveCertStr: async (cert) => {},
  onFeatureChange: () =>
    console.log("availability of some features has just changed"), //optional
});

license.initialize().then(async () => {
  // license.getCertStr().then((xx) => console.log(xx));
  console.log("yyy", license.getFeatures());
  console.log("yyy", license.getFeatureValue("quota:maxTeamProjects"));
  console.log("xxxx: ", license.isValid());
  // console.log("xxxx: ", license.getExpiryDate());
  // console.log("xxxx: ",license.getIssuerCert());
});

//# sourceMappingURL=LicenseManager.js.map

// TeyneZCtzS0pmNvq1f5PUg==
