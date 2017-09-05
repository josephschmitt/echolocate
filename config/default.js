/**
 * This is the default configuration. You must supply all of the keys below if you intend on caching
 * the device location information a DynamoDB so that you don't have to perform the geolocation
 * every time.
 */
module.exports = {
  echolocate: {
    awsConfig: {
      accessKeyId: null, // AWS access key ID
      secretAccessKey: null,// AWS secret access key
      region: null, // AWS region
    },
    dbTableName: null, // Database table name
  }
};
