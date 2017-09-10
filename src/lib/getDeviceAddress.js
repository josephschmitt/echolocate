import axios from 'axios';

export const PERMISSIONS = {
  FULL_ADDRESS: 'address',
  COUNTRY_POSTAL: 'countryAndPostalCode',
}

const ADDRESS_API = '{apiEndpoint}/v1/devices/{deviceId}/settings/address/{perm}';

export default async function getDeviceAddress(deviceId, {
  apiEndpoint = 'https://api.amazonalexa.com',
  consentToken,
  permissions = PERMISSIONS.COUNTRY_POSTAL,
}) {
  const url = ADDRESS_API
    .replace(/{apiEndpoint}/, apiEndpoint)
    .replace(/{deviceId}/, deviceId)
    .replace(/{perm}/, permissions === PERMISSIONS.COUNTRY_POSTAL ? PERMISSIONS.COUNTRY_POSTAL: '');

  const {data} = await axios.get(url, {headers: {Authorization: `Bearer ${consentToken}`}});
  return data;
}
