import axios from 'axios';

export const PERMISSIONS = {
  FULL_ADDRESS: 'address',
  COUNTRY_POSTAL: 'countryAndPostalCode',
}

const ADDRESS_API = 'https://api.amazonalexa.com/v1/devices/{deviceId}/settings/address/{perm}';

export default async function getDeviceAddress(
  deviceId,
  consentToken,
  permissions = PERMISSIONS.COUNTRY_POSTAL
) {
  const url = ADDRESS_API
    .replace(/{deviceId}/, deviceId)
    .replace(/{perm}/, permissions === PERMISSIONS.COUNTRY_POSTAL ? PERMISSIONS.COUNTRY_POSTAL: '');

  const {data} = await axios.get(url, {headers: {Authorization: `Bearer ${consentToken}`}});
  return data;
}
