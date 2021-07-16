import got from 'got'

const requestLicenses =
  process.env.NODE_ENV === `test`
    ? () => Promise.resolve([])
    : async () =>
        (await got(`https://api.github.com/licenses`).json()).map(
          ({ name, spdx_id: identifier, url }) => ({
            name,
            identifier,
            requestContent: async name =>
              (await got(url).json()).body
                .replace(`[year]`, String(new Date().getFullYear()))
                .replace(`[fullname]`, name),
          }),
        )

export default requestLicenses
