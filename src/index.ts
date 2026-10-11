import slugify from '@sindresorhus/slugify'
import camelCase from 'camelcase'
import githubUsername from 'github-username'
import indefinite from 'indefinite'
import isScoped from 'is-scoped'
import normalizeUrl from 'normalize-url'
import mitLicense from 'spdx-license-list/licenses/MIT.json' with { type: 'json' }
import { randomSuperbWord } from 'superb'
import Generator from 'yeoman-generator'
import type { BaseOptions } from 'yeoman-generator'

type Options = BaseOptions & { git: boolean; jj: boolean }

type Answers = {
  moduleName: string
  moduleDescription: string
  packageType: `lib` | `cli` | `both`
  supportsBrowser?: boolean
  typeSupport: `ts` | `js`
  name: string
  email: string
  website: string
  githubUsername: string
}

class JsGenerator extends Generator<Record<string, unknown>, Options> {
  private gitName?: string
  private gitEmail?: string
  private githubUsername?: string
  private answers!: Answers

  public constructor(args: string[], options: Options) {
    super(args, options)

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

  public async initializing(): Promise<void> {
    try {
      ;[this.gitName, this.gitEmail] = await Promise.all([
        this.git.name(),
        this.git.email(),
      ])
      if (this.gitEmail) {
        this.githubUsername = await githubUsername(this.gitEmail)
      }
    } catch {}
  }

  public async prompting(): Promise<void> {
    this.answers = await this.prompt<Answers>([
      {
        type: `input`,
        name: `moduleName`,
        message: `What is your module's name?`,
        default: () => slugify(this.determineAppname()),
        filter: (answer: string) =>
          isScoped(answer) ? answer : slugify(answer),
      },
      {
        type: `input`,
        name: `moduleDescription`,
        message: `What is your module's description?`,
        default: `${indefinite(randomSuperbWord(), { capitalize: true })} module.`,
      },
      {
        type: `select`,
        name: `packageType`,
        message: `What does your module provide?`,
        choices: [
          { name: `A library`, value: `lib` },
          { name: `A CLI`, value: `cli` },
          { name: `A library and a CLI`, value: `both` },
        ],
        default: `lib`,
      },
      {
        type: `confirm`,
        name: `supportsBrowser`,
        message: `Does your library support the browser?`,
        when: answers => answers.packageType !== `cli`,
        default: false,
      },
      {
        type: `select`,
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
        default: `ts`,
      },
      {
        type: `input`,
        name: `name`,
        message: `What is your name?`,
        default: this.gitName,
        store: true,
      },
      {
        type: `input`,
        name: `email`,
        message: `What is your email address?`,
        default: this.gitEmail,
        store: true,
      },
      {
        type: `input`,
        name: `website`,
        message: `What is your website's URL?`,
        filter: (answer: string) => normalizeUrl(answer),
        store: true,
      },
      {
        type: `input`,
        name: `githubUsername`,
        message: `What is your GitHub username?`,
        validate: (answer: string) =>
          answer.length > 0 || `You must provide a GitHub username`,
        default: this.githubUsername,
        store: true,
      },
    ])
  }

  public writing(): void {
    const options = this._templateOptions()
    this._copyTemplates(options)
    this._renameTemplateFiles()
    this._writeLicense()
  }

  public gitInit(): void {
    if (!this.options.git) {
      return
    }

    this.spawnSync(`git`, [`init`])
    if (this.options.jj) {
      this.spawnSync(`jj`, [`git`, `init`, `--colocate`])
    }
  }

  public async install(): Promise<void> {
    await this._pnpm(
      `install`,
      `--save-dev`,
      ...devDependencies(this.answers.supportsBrowser),
    )
    if (this.answers.packageType !== `lib`) {
      await this._pnpm(
        `install`,
        `--save-prod`,
        `@optique/core@^1`,
        `@optique/run@^1`,
      )
    }
  }

  public async end(): Promise<void> {
    await this._pnpm(`lint`)
    await this._pnpm(`format`)
    await this._pnpm(`check`)
  }

  private _templateOptions() {
    const {
      moduleName,
      packageType,
      supportsBrowser = false,
      typeSupport,
      ...otherAnswers
    } = this.answers
    const unscopedModuleName = moduleName.slice(moduleName.indexOf(`/`) + 1)

    return {
      ...otherAnswers,
      moduleName,
      hasLib: packageType !== `cli`,
      hasCli: packageType !== `lib`,
      supportsBrowser,
      typeSupport,
      unscopedModuleName,
      camelCasedModuleName: camelCase(unscopedModuleName),
    }
  }

  private _copyTemplates(options: ReturnType<JsGenerator[`_templateOptions`]>) {
    this.fs.copyTpl(
      [
        `${this.templatePath()}/claude`,
        `${this.templatePath()}/github`,
        `${this.templatePath()}/src${options.hasCli ? `/{,cli/}` : `/`}${
          options.typeSupport === `ts` ? `!(*.d).ts` : `*.{js,d.ts,test.ts}`
        }`,
        `${this.templatePath()}/_CLAUDE.md`,
        `${this.templatePath()}/_package.json`,
        `${this.templatePath()}/eslint.config.js`,
        `${this.templatePath()}/gitattributes`,
        `${this.templatePath()}/gitignore`,
        `${this.templatePath()}/knip.json`,
        `${this.templatePath()}/pnpm-workspace.yaml`,
        `${this.templatePath()}/prettierignore`,
        `${this.templatePath()}/tsdown.config.ts`,
        `${this.templatePath()}/vitest.config.ts`,
        `${this.templatePath()}/readme.md`,
        `${this.templatePath()}/tsconfig.json`,
      ].filter(Boolean),
      this.destinationPath(),
      options,
    )
  }

  private _renameTemplateFiles() {
    const mv = (from: string, to: string) =>
      this.fs.move(this.destinationPath(from), this.destinationPath(to))
    mv(`claude/hooks/lint-format.sh`, `.claude/hooks/lint-format.sh`)
    mv(`claude/settings.json`, `.claude/settings.json`)
    mv(`github/workflows/ci.yml`, `.github/workflows/ci.yml`)
    mv(`github/workflows/release.yml`, `.github/workflows/release.yml`)
    mv(`_CLAUDE.md`, `CLAUDE.md`)
    mv(`_package.json`, `package.json`)
    mv(`gitattributes`, `.gitattributes`)
    mv(`gitignore`, `.gitignore`)
    mv(`prettierignore`, `.prettierignore`)
  }

  private _writeLicense() {
    this.writeDestination(
      `license`,
      mitLicense.licenseText
        .replace(`<year>`, String(new Date().getFullYear()))
        .replace(`<copyright holders>`, this.answers.name),
    )
  }

  private async _pnpm(...args: string[]) {
    await this.spawn(`pnpm`, args, { stdio: `inherit` })
  }
}

const devDependencies = (supportsBrowser = false) =>
  [
    `@fast-check/vitest@^0.5`,
    `@tomer/eslint-config@^5`,
    `@tomer/prettier-config@^4`,
    `@vitest/coverage-v8@^5`,
    `eslint@^10`,
    `knip@^6`,
    `npm-run-all2@^9`,
    `prettier@^3`,
    `publint@^0.3`,
    `tsdown@^0.23`,
    // TypeScript 7 is unsupported by typescript-eslint
    `typescript@^6`,
    `vitest@^5`,
    ...(supportsBrowser
      ? [
          `jsdom@^30`,
          `@rollup/plugin-terser@^1`,
          `rollup-plugin-tree-shakeable@^2`,
        ]
      : [`@types/node@^26`]),
  ].sort()

export default JsGenerator
