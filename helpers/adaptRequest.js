/**
 * It's a native standard properties of a HTTP request
 * Just capturing data in a request so that we can handle and process
 */
export default function createAdaptRequest(req = {}) {
  return Object.freeze({
    path: req.path,
    method: req.method,
    pathParams: req.params,
    queryParams: req.queryParams,
    body: req.body,
  });
}
