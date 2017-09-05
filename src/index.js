import config from 'config';
import {promisify} from 'bluebird';
import dynasty from 'dynasty';
import Geocoder from 'node-geocoder';
import timezoner from 'timezoner';

import getDeviceAddress from './lib/getDeviceAddress.js';

/**
 * @typedef {Object} DeviceLocationQueryOptions
 * @property {String} consentToken -- consentToken from the ASK request session
 * @property {Boolean} [skipDB] -- Whether it should skip looking for the deviceId in the database
 */

/**
 * @typedef {Object} DeviceLocation
 * @property {String} deviceId
 * @property {String} countryCode
 * @property {String} postalCode
 * @property {String} city
 * @property {String} country
 * @property {String} formattedAddress
 * @property {String} latitude
 * @property {String} longitude
 * @property {GMapsTimeZone} timezone
 */

/**
 * @typedef {Object} GMapsTimeZone
 * @property {Number} dstOffset
 * @property {Number} rawOffset
 * @property {String} status
 * @property {String} timeZoneId
 * @property {String} timeZoneName
 */

const geocoder = Geocoder({provider: 'google'});

const dynoClient = dynasty(config.get('echolocate.awsConfig'));
const devices = dynoClient.table(config.get('echolocate.dbTableName'));

/**
 * Get an Echo device's physical location and timezone using the Alexa API and Geo-location.
 *
 * @param {String} deviceId -- deviceId of the requesting device
 * @param {DeviceLocationQueryOptions} options
 * @returns {Promise<Object>}
 */
export default async function getDeviceLocation(deviceId, options) {
  return (!options.skipDB && await get(deviceId)) ||
      await set(buildDeviceLocation(deviceId, options.consentToken));
}

/**
 * Uses the device's id and a consentToken to perform geo-lookups and build up a location object
 * for where the device is located.
 *
 * @param {String} deviceId
 * @param {String} consentToken
 * @returns {DeviceLocation}
 */
async function buildDeviceLocation(deviceId, consentToken) {
  const address = await getDeviceAddress(deviceId, consentToken);
  const [geo] = await geocoder.geocode(address.postalCode);
  const timezone = await promisify(timezoner.getTimeZone)(geo.latitude, geo.longitude);

  return Object.assign({
    deviceId,
    latitude: geo.latitude,
    longitude: geo.longitude,
    formattedAddress: geo.formattedAddress,
    timezone
  }, address);
}

async function set(device) {
  if (config.has('echolcate.dbTableName')) {
    await devices.insert(device);
  }

  return device;
}

async function get(deviceId) {
  if (config.has('echolcate.dbTableName')) {
    return await devices.find(deviceId);
  }

  return null;
}
