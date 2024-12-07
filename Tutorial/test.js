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
    if (!this.isShuttingDown)
      try {
        let e = await this.getCertStr();
        if (!e) {
          this.licenseCert = void 0;
          return;
        }
        if (e.length < 50)
          throw new Error("cert string is undefined or too short");
        let { x509: t, licenseKey: n } = this.parseLicenseCertContainerStr(e);
        if (
          ((this.x509Cert = new f.X509Certificate(t)),
          !this.x509Cert.checkIssued(this.getIssuerCert()))
        )
          throw new Error("cert was not issued by an approved issuer");
        let s = this.x509Cert.publicKey.export({
          format: "pem",
          type: "pkcs1",
        });
        (this.key = new T.default(s)),
          (this.licenseCert = this.parseLicenseKeyStr(n)),
          this.updateCurrentFeatures(),
          this.triggerOnFeatureChangeCallback(),
          this.setTimerForNextEntitlementChange();
      } catch (e) {
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
    try {
      a = this.key.decryptPublic(n, "utf8");
    } catch {
      throw new Error("Invalid data: Could not extract symmetric key");
    }
    try {
      o = d.default.AES.decrypt(i, a).toString(d.default.enc.Utf8);
    } catch {
      throw new Error("Invalid Data: Could not decrypt data with key found");
    }
    if (this.key.verify(Buffer.from(o), s, "utf8", "base64"))
      return JSON.parse(o);
    throw new Error("License Key signature invalid");
  }
  getIssuerCert() {
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
//# sourceMappingURL=LicenseManager.js.map
