const axios = require('axios').default;
const domain = "collancer-dev.us.auth0.com";

/**
 * Updates the user_metadata of a specific user
 * @param {Object} user the user object provided by Auth0 to access details of specific user in the endpoint
 * @param {Object} profileData the user_metadata to update to
 * @param {Function} retrieveToken getAccessTokenSilently function provided by Auth0
 */
const updateUserMetadata = (user, profileData, retrieveToken) => {
  
  retrieveToken({
    audience: `https://${domain}/api/v2/`,
    scope: "read:current_user create:current_user_metadata",
  })
  .then(accessToken => {
    const userDetailsByIdUrl = `https://${domain}/api/v2/users/${user.sub}`;

    const options = {
      method: 'PATCH',
      url: userDetailsByIdUrl,
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json'
      },
      data: {
        user_metadata: profileData
      }
    };
    
    axios.request(options)
      .then(console.log('Profile updated successfully'))
      .catch(err => console.error(err));
  })
  .catch(error => console.error(error));

  return new Promise(resolve => resolve(true));
}

/**
 * Retrieves the full users profile, including all metadata, from auth0
 * @param {Object} user the user object provided by Auth0
 * @param {Function} retrieveToken getAccessTokenSilently function from Auth0
 * @param {Function} callback function to call after userMetadata has been retrieved
 */
const getUserMetadata = (user, retrieveToken, callback) => {

  retrieveToken({
    audience: `https://${domain}/api/v2/`,
    scope: "read:current_user",
  })
  .then(accessToken => {
    const options = {
      method: 'GET',
      url: `https://${domain}/api/v2/users/${user.sub}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }

    axios.request(options)
      .then(res => callback(res.data))
      .catch(err => console.error(err));
  })
  .catch(err => console.error(err));
};

export {
  updateUserMetadata,
  getUserMetadata
}