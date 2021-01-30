const got = require(`got`)

const requestLicenses = async () =>
  (await got(`https://api.github.com/licenses`).json()).map(
    ({ name, spdx_id: identifier, url }) => ({
      name,
      identifier,
      requestContent: async name =>
        (await got(url).json()).body
          .replace(`[year]`, String(new Date().getFullYear()))
          .replace(`[fullname]`, name)
    })
  )

module.exports = requestLicenses
