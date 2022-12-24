const axios = require('axios')
const ClientError = require('../utils/exceptions/ClientError')

class PostService {
  #axios
  #baseUrl = process.env.POST_SERVICE_URL
  #timeout = process.env.TIMEOUT || 5000 // == 5s

  constructor () {
    this.#axios = axios.create({
      baseURL: this.#baseUrl,
      timeout: this.#timeout
    })

    this.getModule = this.getModule.bind(this)
  }

  /**
   * @param moduleIds[]
   * @returns detail modules pada service post -> modules
   */
  async getModule (moduleIds = []) {
    try {
      const modules = moduleIds.map((module) => `modules=${module}`).join('&')
      const { data: response } = await this.#axios.get(`/modules?${modules}`)

      return response.data
    } catch (err) {
      const { response } = err
      throw new ClientError(response.data.message, response.status, response.data.status)
    }
  }
}

module.exports = PostService
