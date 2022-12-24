const axios = require('axios')
const ClientError = require('../utils/exceptions/ClientError')

class UserService {
  #axios
  #baseUrl = process.env.USER_SERVICE_URL
  #timeout = process.env.TIMEOUT || 5000 // == 5s

  constructor () {
    this.#axios = axios.create({
      baseURL: this.#baseUrl,
      timeout: this.#timeout
    })

    this.getUser = this.getUser.bind(this)
  }

  /**
   * @param userId
   * @returns data user berdasarkan user ID
   */
  async getUser (userId) {
    try {
      const { data: response } = await this.#axios.get(`/users/${userId}`)

      return response.data
    } catch (err) {
      const { response } = err
      throw new ClientError(response.data.message, response.status, response.data.status)
    }
  }
}

module.exports = UserService
