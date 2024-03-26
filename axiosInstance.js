const axios = require('axios');
require('dotenv').config();

const url = process.env.URL;
const clientId = `${process.env.POST_DATA_SPACE}.ziqni.app`;

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

const getToken = async () => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: 'https://identity.ziqni.com/realms/ziqni/protocol/openid-connect/token',
      data: {
        client_id: clientId,
        username,
        password,
        grant_type: 'password',
      },
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
      },
    })

    const { access_token } = data

    return axios.create({
      baseURL: url,
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    console.log('GET ERROR =>', err.response);
  }
};

module.exports = { getToken };
