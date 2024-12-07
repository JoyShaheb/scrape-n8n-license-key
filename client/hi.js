import selfsigned from "selfsigned";

var attrs = [{ name: "commonName", value: "contoso.com" }];
var pems = selfsigned.generate(attrs, { days: 365 });
console.log(pems);
