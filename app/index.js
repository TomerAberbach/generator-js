import camelCase from 'camelcase'
import Generator from 'yeoman-generator'
import isScoped from 'is-scoped'
import normalizeUrl from 'normalize-url'
import slugify from '@sindresorhus/slugify'
import superb from 'superb'
import licenses from 'spdx-license-list/full.js'
import indefinite from 'indefinite'

class JsGenerator extends Generator {
  constructor(...args) {
    super(...args)

    this.option(`git`, {
      type: Boolean,
      description: `Whether to initialize a git repository`,
      default: true,
    })
  }

  async initializing() {
    try {
      this.githubUsername = await this.user.github.username()
    } catch {}
  }

  async prompting() {
    this.answers = await this.prompt([
      {
        name: `moduleName`,
        message: `What is your module's name?`,
        default: () => slugify(this.determineAppname()),
        filter: answer => (isScoped(answer) ? answer : slugify(answer)),
      },
      {
        name: `moduleDescription`,
        message: `What is your module's description?`,
        default: `${indefinite(superb.random(), { capitalize: true })} module.`,
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
              isBrowserSupported: false,
            },
          },
          {
            name: `Browser only`,
            value: {
              isNodeSupported: false,
              isBrowserSupported: true,
            },
          },
          {
            name: `Browser and Node.js`,
            value: {
              isNodeSupported: true,
              isBrowserSupported: true,
            },
          },
        ],
      },
      {
        type: `list`,
        name: `typeSupport`,
        message: `Does your module use TypeScript?`,
        choices: [
          {
            name: `JavaScript only`,
            value: `js`,
          },
          {
            name: `JavaScript with type definitions`,
            value: `dts`,
          },
          {
            name: `TypeScript only`,
            value: `ts`,
          },
        ],
        default: `TypeScript only`,
      },
      {
        type: `list`,
        name: `license`,
        message: `What is your module's license?`,
        choices: [`MIT`, `Apache-2.0`].map(identifier => {
          const license = licenses[identifier]
          return {
            name: license.name,
            value: { ...license, identifier },
          }
        }),
        default: `MIT License`,
      },
      {
        name: `name`,
        message: `What is your name?`,
        default: this.user.git.name(),
        store: true,
      },
      {
        name: `email`,
        message: `What is your email address?`,
        default: this.user.git.email(),
        store: true,
      },
      {
        name: `website`,
        message: `What is your website's URL?`,
        filter: answer => normalizeUrl(answer),
        store: true,
      },
      {
        name: `githubUsername`,
        message: `What is your GitHub username?`,
        validate: answer =>
          answer.length > 0 || `You must provide a GitHub username`,
        default: this.githubUsername,
        store: true,
      },
    ])
    this.answers.includesTypes = this.answers.typeSupport !== `js`
  }

  writing() {
    const {
      moduleName,
      environmentSupport,
      includesTypes,
      typeSupport,
      license,
      ...otherAnswers
    } = this.answers
    const unscopedModuleName = isScoped(moduleName)
      ? moduleName.split(`/`)[1]
      : moduleName
    const isGoogle = license.identifier === `Apache-2.0`

    const options = {
      ...otherAnswers,
      moduleName,
      ...environmentSupport,
      includesTypes,
      entryName: environmentSupport.isBrowserSupported ? `index.min` : `index`,
      unscopedModuleName,
      camelCasedModuleName: camelCase(unscopedModuleName),
      licenseIdentifier: license.identifier,
      licenseName: license.name.endsWith(` License`)
        ? license.name.slice(0, license.name.length - ` License`.length)
        : license.name,
      isGoogle,
    }

    this.fs.copyTpl(
      [
        `${this.templatePath()}/src/**/${
          typeSupport === `ts` ? `!(*.d).ts` : `*.js`
        }`,
        typeSupport === `dts` && `${this.templatePath()}/src/**/*.d.ts`,
        `${this.templatePath()}/test/**/*.${
          typeSupport === `js` ? `js` : `ts`
        }`,
        `${this.templatePath()}/github`,
        `${this.templatePath()}/_package.json`,
        `${this.templatePath()}/gitattributes`,
        `${this.templatePath()}/gitignore`,
        `${this.templatePath()}/readme.md`,
        isGoogle && `${this.templatePath()}/contributing.md`,
        includesTypes && `${this.templatePath()}/tsconfig.json`,
      ].filter(Boolean),
      this.destinationPath(),
      options,
    )

    const mv = (from, to) =>
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    mv(`gitignore`, `.gitignore`)
    mv(`gitattributes`, `.gitattributes`)
    mv(`_package.json`, `package.json`)
    mv(`github/workflows/ci.yml`, `.github/workflows/ci.yml`)
    this.writeDestination(
      `license`,
      license.licenseText
        .replace(`<year>`, String(new Date().getFullYear()))
        .replace(`<copyright holders>`, this.answers.name),
    )
  }

  git() {
    if (this.options.git) {
      this.spawnCommandSync(`git`, [`init`])
    }
  }

  async install() {
    await this.spawnCommand(
      `pnpm`,
      [
        `install`,
        `--save-dev`,
        `@types/jest`,
        `eslint`,
        `jest`,
        `tomer`,
        `typescript`,
      ].filter(Boolean),
    )
  }

  async end() {
    await this.spawnCommand(`pnpm`, [`format`])
    await this.spawnCommand(`pnpm`, [`lint`])

    if (this.answers.includesTypes) {
      await this.spawnCommand(`pnpm`, [`typecheck`])
    }

    await this.spawnCommand(`pnpm`, [`test`, `--`, `--no-watch`])
  }
}

export default JsGenerator
