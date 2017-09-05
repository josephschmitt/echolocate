# Echolocate

Echolocate is a function to help you get an Echo device's physical location and timezone using the
Alexa and Geo-location API's. It's especially useful when building Alexa skills that return time
information. The skill request will only give you GMT times, so you can use this library to help
you figure out the timezone of your user's echo device and relay the time correctly.

## Usage

In your Alexa Skill:

```js
import echolocate from 'echolocate';

// Get the deviceId and consentToken from the Alexa Skill Request object
const deviceLocation = await echolocate(deviceId, {consentToken})
```

Or alternatively if you want to use the command-line for whatever reason:

```sh
echolocate --device-id "amzn1.ask.device..." --consent-token "Atza|..."
```

Returns:
```js
{
  deviceId:"amzn1.ask.device....",
  countryCode: "US",
  postalCode: "11215"
  city: "New York",
  country: "United States",
  formattedAddress: "Brooklyn, NY 11215, USA",
  latitude: 40.6986772,
  longitude: -73.9859414,
  timezone:{
    dstOffset: 3600,
    rawOffset: -18000,
    timeZoneId: "America/New_York",
    timeZoneName: "Eastern Daylight Time"
  },
}
```

---

Echolocate will use the Alexa API to get the Echo device's location and timezone based on the
[permissions](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/device-address-api#getAddress)
you have set for you Alexa Skill. To perform an echolocation, you must supply two pieces of
information from your Skill's request: the `deviceId` and the `consentToken`. The `consentToken`
will only be present if you request location permission in your skill. You can find more information
about this on [Amazon's Developer Portal](https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/device-address-api#getAddress)

## AWS Config
In order to keep the number of geolocation requests to a minimum, you can configure Echolocate to
store the location information it retrieves in an AWS Dynamo DB. To do so, create a config file at
`config/default.js` and fill in the required information.

For example:
```js
module.exports = {
  echolocate: {
    awsConfig: {
      accessKeyId: "<AWS ACCESS KEY>",
      secretAccessKey: "<AWS SECRET ACCESS KEY>",
      region: "<AWS REGION>",
    },
    dbTableName: "<DYNAMO DB TABLE NAME>",
  }
};
```

Echolocate will actually use the [`config`](https://npmjs.com/package/config) library under the hood
so just follow that project's guidelines if you want to customize the config file.

Once set up correctly, Echolocate will store locations for a particular `deviceId` in the database
and will retrieve that if it's available. If not, it will save the values it finds via geolocation
to the DB for the next time it's retrieved. This should make subsequent location calls much faster.
