function start(uri) {
  var obj = document.createElement("object");
  obj.setAttribute("type", "application/miroit-run-plugin");
  document.body.appendChild(obj);
  obj.miro(uri);
  document.body.removeChild(obj);
  return;
}
