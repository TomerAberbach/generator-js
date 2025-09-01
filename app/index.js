import slugify from '@sindresorhus/slugify'
import camelCase from 'camelcase'
import indefinite from 'indefinite'
import isScoped from 'is-scoped'
import normalizeUrl from 'normalize-url'
import licenses from 'spdx-license-list/full.js'
import { randomSuperbWord } from 'superb'
import githubUsername from 'github-username'
import Generator from 'yeoman-generator'

class JsGenerator extends Generator {
  constructor(...args) {
    super(...args)

    this.option(`git`, {
      type: Boolean,
      description: `Whether to initialize a git repository`,
      default: true,
    })
    this.option(`jj`, {
      type: Boolean,
      description: `Whether to initialize a jj repository`,
      default: true,
    })
  }

  async initializing() {
    try {
      ;[this.gitName, this.gitEmail] = await Promise.all([
        this.git.name(),
        this.git.email(),
      ])
      this.githubUsername = await githubUsername(this.gitEmail)
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
        default: `${indefinite(randomSuperbWord(), { capitalize: true })} module.`,
      },
      {
        type: `confirm`,
        name: `supportsBrowser`,
        message: `Does your module support the browser?`,
      },
      {
        type: `list`,
        name: `typeSupport`,
        message: `Does your module use TypeScript?`,
        choices: [
          {
            name: `TypeScript only`,
            value: `ts`,
          },
          {
            name: `JavaScript with type definitions`,
            value: `js`,
          },
        ],
        default: `TypeScript only`,
      },
      {
        name: `name`,
        message: `What is your name?`,
        default: this.gitName,
        store: true,
      },
      {
        name: `email`,
        message: `What is your email address?`,
        default: this.gitEmail,
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
  }

  writing() {
    const { moduleName, supportsBrowser, typeSupport, ...otherAnswers } =
      this.answers
    const unscopedModuleName = isScoped(moduleName)
      ? moduleName.split(`/`)[1]
      : moduleName

    const options = {
      ...otherAnswers,
      moduleName,
      supportsBrowser,
      typeSupport,
      unscopedModuleName,
      camelCasedModuleName: camelCase(unscopedModuleName),
    }

    this.fs.copyTpl(
      [
        `${this.templatePath()}/github`,
        `${this.templatePath()}/src/**/${
          typeSupport === `ts` ? `!(*.d).ts` : `*.{js,d.ts,bench.ts,test.ts}`
        }`,
        `${this.templatePath()}/types`,
        `${this.templatePath()}/_package.json`,
        `${this.templatePath()}/eslint.config.js`,
        `${this.templatePath()}/gitattributes`,
        `${this.templatePath()}/gitignore`,
        `${this.templatePath()}/pnpm-workspace.yaml`,
        `${this.templatePath()}/prettierignore`,
        `${this.templatePath()}/tsdown.config.ts`,
        `${this.templatePath()}/vitest.config.ts`,
        `${this.templatePath()}/vitest.setup.ts`,
        `${this.templatePath()}/readme.md`,
        `${this.templatePath()}/tsconfig.json`,
      ].filter(Boolean),
      this.destinationPath(),
      options,
    )

    const mv = (from, to) =>
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    mv(`github/workflows/ci.yml`, `.github/workflows/ci.yml`)
    mv(`_package.json`, `package.json`)
    mv(`gitattributes`, `.gitattributes`)
    mv(`gitignore`, `.gitignore`)
    mv(`prettierignore`, `.prettierignore`)
    this.writeDestination(
      `license`,
      licenses.MIT.licenseText
        .replace(`<year>`, String(new Date().getFullYear()))
        .replace(`<copyright holders>`, this.answers.name),
    )
  }

  gitInit() {
    if (!this.options.git) {
      return
    }

    this.spawnSync(`git`, [`init`])
    if (this.options.jj) {
      this.spawnSync(`jj`, [`git`, `init`, `--colocate`])
    }
  }

  async install() {
    const packageNames = [
      `@fast-check/vitest`,
      `@tomer/eslint-config`,
      `@tomer/prettier-config`,
      `@vitest/coverage-v8`,
      `eslint`,
      `jest-extended`,
      `prettier`,
      `publint`,
      `tsdown`,
      `typescript`,
      `vitest`,
      ...(this.answers.supportsBrowser
        ? [`jsdom`, `@rollup/plugin-terser`, `rollup-plugin-tree-shakeable`]
        : []),
    ].sort()
    await this.spawn(`pnpm`, [`install`, `--save-dev`, ...packageNames])
    await this.spawn(`pnpm`, [`approve-builds`])
  }

  async end() {
    await this.spawn(`pnpm`, [`lint`])
    await this.spawn(`pnpm`, [`format`])
    await this.spawn(`pnpm`, [`typecheck`])
    await this.spawn(`pnpm`, [`build`])
    await this.spawn(`pnpm`, [`test`, `--watch=false`])
    await this.spawn(`pnpm`, [`bench`, `--watch=false`])
  }
}

export default JsGenerator
