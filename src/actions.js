const FIREFOX_VERSION_URL = 'https://product-details.mozilla.org/1.0/firefox_versions.json';
const CRASH_DATA_URL = 'https://sql.telemetry.mozilla.org/api/queries/4769/results.json?api_key=0oBNalixUYqb03t1asALbHEOoZIw6lZP3bkdMENk';

export const REQUEST_VERSION_DATA = 'REQUEST_VERSION_DATA';
function requestVersionData() {
  return {
    type: REQUEST_VERSION_DATA,
  };
}

export const RECEIVE_VERSION_DATA = 'RECEIVE_VERSION_DATA';
function receiveVersionData(json) {
  return {
    type: RECEIVE_VERSION_DATA,
    versionData: json,
    receivedAt: Date.now(),
  };
}

export function fetchVersionData() {
  return (dispatch) => {
    dispatch(requestVersionData());

    return fetch(FIREFOX_VERSION_URL)
      .then(response => response.json())
      .then(json => dispatch(receiveVersionData(json)));
  };
}

export const REQUEST_CRASH_DATA = 'REQUEST_CRASH_DATA';
function requestCrashData() {
  return {
    type: REQUEST_CRASH_DATA,
  };
}

export const RECEIVE_CRASH_DATA = 'RECEIVE_CRASH_DATA';
function receiveCrashData(crashRows, versionMatrix) {
  return {
    type: RECEIVE_CRASH_DATA,
    crashRows,
    versionMatrix,
    receivedAt: Date.now(),
  };
}

export function fetchCrashData(versionMatrix) {
  return (dispatch) => {
    dispatch(requestCrashData());

    return fetch(CRASH_DATA_URL)
      .then(response => response.json())
      .then(json => dispatch(receiveCrashData(json.query_result.data.rows, versionMatrix)));
  };
}
