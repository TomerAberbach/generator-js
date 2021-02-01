const camelCase = require(`camelcase`)
const Generator = require(`yeoman-generator`)
const isScoped = require(`is-scoped`)
const normalizeUrl = require(`normalize-url`)
const slugify = require(`@sindresorhus/slugify`)
const superb = require(`superb`)
const requestLicenses = require(`./helpers/licenses.js`)

class JsGenerator extends Generator {
  constructor(...args) {
    super(...args)

    this.option(`git`, {
      type: Boolean,
      description: `Whether to initialize a git repository`,
      default: true
    })
  }
}

Object.assign(JsGenerator.prototype, {
  initializing: {
    async githubUsername() {
      try {
        this.githubUsername = await this.user.github.username()
      } catch {}
    },
    async licenses() {
      this.licenses = await requestLicenses()
    }
  },

  async prompting() {
    this.answers = await this.prompt([
      {
        name: `moduleName`,
        message: `What is your module's name?`,
        default: () => slugify(this.determineAppname()),
        filter: answer => (isScoped(answer) ? answer : slugify(answer))
      },
      {
        name: `moduleDescription`,
        message: `What is your module's description?`,
        default: `A ${superb.random()} module.`
      },
      {
        type: `list`,
        name: `environmentSupport`,
        message: `Which environments does your module support?`,
        choices: [
          {
            name: `Node.js only`,
            value: {
              isNodeSupported: true,
              isBrowserSupported: false
            }
          },
          {
            name: `Browser only`,
            value: {
              isNodeSupported: false,
              isBrowserSupported: true
            }
          },
          {
            name: `Browser and Node.js`,
            value: {
              isNodeSupported: true,
              isBrowserSupported: true
            }
          }
        ]
      },
      {
        type: `list`,
        name: `license`,
        message: `What is your module's license?`,
        choices: this.licenses.map(license => ({
          name: license.name,
          value: license
        })),
        default: `MIT License`
      },
      {
        name: `name`,
        message: `What is your name?`,
        default: this.user.git.name(),
        store: true
      },
      {
        name: `email`,
        message: `What is your email address?`,
        default: this.user.git.email(),
        store: true
      },
      {
        name: `website`,
        message: `What is your website's URL?`,
        filter: answer => normalizeUrl(answer),
        store: true
      },
      {
        name: `githubUsername`,
        message: `What is your GitHub username?`,
        validate: answer =>
          answer.length > 0 || `You must provide a GitHub username`,
        default: this.githubUsername,
        store: true
      }
    ])
  },

  writing: {
    templates() {
      const {
        moduleName,
        environmentSupport,
        license,
        ...otherAnswers
      } = this.answers
      const unscopedModuleName = isScoped(moduleName)
        ? moduleName.split(`/`)[1]
        : moduleName

      const options = {
        ...otherAnswers,
        moduleName,
        ...environmentSupport,
        unscopedModuleName,
        camelCasedModuleName: camelCase(unscopedModuleName),
        licenseIdentifier: license.identifier,
        licenseName: license.name.endsWith(` License`)
          ? license.name.substring(0, license.name.length - ` License`.length)
          : license.name
      }

      this.fs.copyTpl(
        this.templatePath(),
        this.destinationRoot(),
        options,
        null,
        { globOptions: { dot: true } }
      )

      const mv = (from, to) =>
        this.fs.move(this.destinationPath(from), this.destinationPath(to))
      mv(`gitignore`, `.gitignore`)
      mv(`gitattributes`, `.gitattributes`)
      mv(`npmrc`, `.npmrc`)
      mv(`_package.json`, `package.json`)
      mv(`github/workflows/ci.yml`, `.github/workflows/ci.yml`)
    },
    async license() {
      this.writeDestination(
        `license`,
        await this.answers.license.requestContent(this.answers.name)
      )
    }
  },

  git() {
    if (this.options.git) {
      this.spawnCommandSync(`git`, [`init`])
    }
  },

  install() {
    this.scheduleInstallTask(`pnpm`, require(`./helpers/dev-dependencies.js`), {
      'save-dev': true
    })
  }
})

module.exports = JsGenerator
