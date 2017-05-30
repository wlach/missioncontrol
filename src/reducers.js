import _ from 'lodash';
import { combineReducers } from 'redux';
import { REQUEST_VERSION_DATA, RECEIVE_VERSION_DATA, REQUEST_CRASH_DATA, RECEIVE_CRASH_DATA } from './actions';

function getMajorVersion(verString) {
  return parseInt(verString.split('.')[0], 10);
}

const EXPECTED_NUM_DATAPOINTS = 100;

function processVersionMatrix(rawVersionMatrix) {
  return {
    beta: getMajorVersion(rawVersionMatrix.LATEST_FIREFOX_DEVEL_VERSION),
    esr: getMajorVersion(rawVersionMatrix.FIREFOX_ESR),
    nightly: getMajorVersion(rawVersionMatrix.FIREFOX_NIGHTLY),
    release: getMajorVersion(rawVersionMatrix.LATEST_FIREFOX_VERSION),
  };
}

function versionInfo(state = {}, action) {
  switch (action.type) {
    case REQUEST_VERSION_DATA:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_VERSION_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        matrix: processVersionMatrix(action.versionData),
      });
    default:
      return state;
  }
}

function processCrashRows(crashRows, versionMatrix) {
  const crashes = {};

  const osMapping = {
    Windows_NT: 'Windows',
    Darwin: 'MacOS X',
    Linux: 'Linux',
  };

  crashRows.forEach((row) => {
    const osname = osMapping[row.os_name];
    const channel = row.channel;
    const version = row.version;

    // ignore older versions (more than one before current)
    if (getMajorVersion(version) < (versionMatrix[channel] - 1) ||
        getMajorVersion(version) > versionMatrix[channel]) {
      return;
    }

    if (!crashes[osname]) {
      crashes[osname] = {};
    }
    if (!crashes[osname][channel]) {
      crashes[osname][channel] = {
        data: {},
      };
    }
    if (!crashes[osname][channel].data[version]) {
      crashes[osname][channel].data[version] = [];
    }
    crashes[osname][channel].data[version].push({
      main_rate: row.main_rate,
      usage_khours: row.usage_khours,
      date: new Date(row.date),
    });
  });

  // we should have at least one version with EXPECTED_NUM_DATAPOINTS --
  // if there is no data, or some missing, note that
  const expectedChannels = ['esr', 'beta', 'release', 'nightly'];
  _.forEach(crashes, (os, osname) => {
    expectedChannels.forEach((expectedChannelName) => {
      if (!os[expectedChannelName]) {
        crashes[osname][expectedChannelName] = {
          status: 'warning',
          insufficientData: [{
            measure: 'crash',
            expected: EXPECTED_NUM_DATAPOINTS,
            current: 0,
          }],
        };
      } else {
        const channel = crashes[osname][expectedChannelName];
        const numDataPoints = _.max(_.map(channel.data, data => data.length));
        if (numDataPoints < EXPECTED_NUM_DATAPOINTS) {
          crashes[osname][expectedChannelName] = {
            ...channel,
            status: 'warning',
            insufficientData: [{
              measure: 'crash',
              expected: EXPECTED_NUM_DATAPOINTS,
              current: numDataPoints,
            }],
          };
        } else {
          crashes[osname][expectedChannelName] = {
            ...channel,
            status: 'success',
            passingMeasures: 1,
          };
        }
      }
    });
  });

  return crashes;
}

function crashData(state = {}, action) {
  switch (action.type) {
    case REQUEST_CRASH_DATA:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_CRASH_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        channels: processCrashRows(action.crashRows, action.versionMatrix),
      });
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  versionInfo,
  crashData,
});

export default rootReducer;
