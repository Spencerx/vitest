import type { FakeTimerInstallOpts } from '@sinonjs/fake-timers'
import type { PrettyFormatOptions } from '@vitest/pretty-format'
import type { SequenceHooks, SequenceSetupFiles } from '@vitest/runner'
import type { SnapshotStateOptions } from '@vitest/snapshot'
import type { SerializedDiffOptions } from '@vitest/utils/diff'
import type { AliasOptions, ConfigEnv, DepOptimizationConfig, ServerOptions, UserConfig as ViteUserConfig } from 'vite'
import type { ChaiConfig } from '../../integrations/chai/config'
import type { SerializedConfig } from '../../runtime/config'
import type { Arrayable, LabelColor, ParsedStack, ProvidedContext, TestError } from '../../types/general'
import type { HappyDOMOptions } from '../../types/happy-dom-options'
import type { JSDOMOptions } from '../../types/jsdom-options'
import type {
  BuiltinReporterOptions,
  BuiltinReporters,
} from '../reporters'
import type { TestCase, TestModule, TestSuite } from '../reporters/reported-tasks'
import type { TestSequencerConstructor } from '../sequencers/types'
import type { WatcherTriggerPattern } from '../watcher'
import type { BenchmarkUserOptions } from './benchmark'
import type { BrowserConfigOptions, ResolvedBrowserOptions } from './browser'
import type { CoverageOptions, ResolvedCoverageOptions } from './coverage'
import type { Pool, PoolOptions, ResolvedPoolOptions } from './pool-options'
import type { Reporter } from './reporter'

export type { CoverageOptions, ResolvedCoverageOptions }
export type { BenchmarkUserOptions }
export type { RuntimeConfig, SerializedConfig } from '../../runtime/config'
export type { BrowserConfigOptions, BrowserInstanceOption, BrowserScript } from './browser'
export type { CoverageIstanbulOptions, CoverageV8Options } from './coverage'
export type { SequenceHooks, SequenceSetupFiles } from '@vitest/runner'

export type BuiltinEnvironment
  = | 'node'
    | 'jsdom'
    | 'happy-dom'
    | 'edge-runtime'
// Record is used, so user can get intellisense for builtin environments, but still allow custom environments
export type VitestEnvironment
  = | BuiltinEnvironment
    | (string & Record<never, never>)
export type { Pool, PoolOptions }
export type CSSModuleScopeStrategy = 'stable' | 'scoped' | 'non-scoped'

export type ApiConfig = Pick<
  ServerOptions,
  'port' | 'strictPort' | 'host' | 'middlewareMode'
>

export interface EnvironmentOptions {
  /**
   * jsdom options.
   */
  jsdom?: JSDOMOptions
  happyDOM?: HappyDOMOptions
  [x: string]: unknown
}

export type { HappyDOMOptions, JSDOMOptions }

export type VitestRunMode = 'test' | 'benchmark'

export interface ProjectName {
  label: string
  color?: LabelColor
}

interface SequenceOptions {
  /**
   * Class that handles sorting and sharding algorithm.
   * If you only need to change sorting, you can extend
   * your custom sequencer from `BaseSequencer` from `vitest/node`.
   * @default BaseSequencer
   */
  sequencer?: TestSequencerConstructor
  /**
   * Controls the order in which this project runs its tests when using multiple [projects](/guide/projects).
   *
   * - Projects with the same group order number will run together, and groups are run from lowest to highest.
   * - If you don’t set this option, all projects run in parallel.
   * - If several projects use the same group order, they will run at the same time.
   * @default 0
   */
  groupOrder?: number
  /**
   * Should files and tests run in random order.
   * @default false
   */
  shuffle?:
    | boolean
    | {
      /**
       * Should files run in random order. Long running tests will not start
       * earlier if you enable this option.
       * @default false
       */
      files?: boolean
      /**
       * Should tests run in random order.
       * @default false
       */
      tests?: boolean
    }
  /**
   * Should tests run in parallel.
   * @default false
   */
  concurrent?: boolean
  /**
   * Defines how setup files should be ordered
   * - 'parallel' will run all setup files in parallel
   * - 'list' will run all setup files in the order they are defined in the config file
   * @default 'parallel'
   */
  setupFiles?: SequenceSetupFiles
  /**
   * Seed for the random number generator.
   * @default Date.now()
   */
  seed?: number
  /**
   * Defines how hooks should be ordered
   * - `stack` will order "after" hooks in reverse order, "before" hooks will run sequentially
   * - `list` will order hooks in the order they are defined
   * - `parallel` will run hooks in a single group in parallel
   * @default 'stack'
   */
  hooks?: SequenceHooks
}

export type DepsOptimizationOptions = Omit<
  DepOptimizationConfig,
  'disabled' | 'noDiscovery'
> & {
  enabled?: boolean
}

interface DepsOptions {
  /**
   * Enable dependency optimization. This can improve the performance of your tests.
   */
  optimizer?: Partial<Record<'client' | 'ssr' | ({} & string), DepsOptimizationOptions>>
  web?: {
    /**
     * Should Vitest process assets (.png, .svg, .jpg, etc) files and resolve them like Vite does in the browser.
     *
     * These module will have a default export equal to the path to the asset, if no query is specified.
     *
     * **At the moment, this option only works with `{ pool: 'vmThreads' }`.**
     *
     * @default true
     */
    transformAssets?: boolean
    /**
     * Should Vitest process CSS (.css, .scss, .sass, etc) files and resolve them like Vite does in the browser.
     *
     * If CSS files are disabled with `css` options, this option will just silence UNKNOWN_EXTENSION errors.
     *
     * **At the moment, this option only works with `{ pool: 'vmThreads' }`.**
     *
     * @default true
     */
    transformCss?: boolean
    /**
     * Regexp pattern to match external files that should be transformed.
     *
     * By default, files inside `node_modules` are externalized and not transformed.
     *
     * **At the moment, this option only works with `{ pool: 'vmThreads' }`.**
     *
     * @default []
     */
    transformGlobPattern?: RegExp | RegExp[]
  }

  /**
   * Interpret CJS module's default as named exports
   *
   * @default true
   */
  interopDefault?: boolean

  /**
   * A list of directories relative to the config file that should be treated as module directories.
   *
   * @default ['node_modules']
   */
  moduleDirectories?: string[]
}

type InlineReporter = Reporter
type ReporterName = BuiltinReporters | 'html' | (string & {})
type ReporterWithOptions<Name extends ReporterName = ReporterName>
  = Name extends keyof BuiltinReporterOptions
    ? BuiltinReporterOptions[Name] extends never
      ? [Name, object]
      : [Name, Partial<BuiltinReporterOptions[Name]>]
    : [Name, Record<string, unknown>]

export interface ResolveSnapshotPathHandlerContext { config: SerializedConfig }

export type ResolveSnapshotPathHandler = (
  testPath: string,
  snapExtension: string,
  context: ResolveSnapshotPathHandlerContext
) => string

export interface InlineConfig {
  /**
   * Name of the project. Will be used to display in the reporter.
   */
  name?: string | ProjectName

  /**
   * Benchmark options.
   *
   * @default {}
   */
  benchmark?: BenchmarkUserOptions

  /**
   * Include globs for test files
   *
   * @default ['**\/*.{test,spec}.?(c|m)[jt]s?(x)']
   */
  include?: string[]

  /**
   * Exclude globs for test files
   * @default ['**\/node_modules/**', '**\/.git/**']
   */
  exclude?: string[]

  /**
   * Include globs for in-source test files
   *
   * @default []
   */
  includeSource?: string[]

  /**
   * Handling for dependencies inlining or externalizing
   *
   */
  deps?: DepsOptions

  server?: {
    deps?: ServerDepsOptions
  }

  /**
   * Base directory to scan for the test files
   *
   * @default `config.root`
   */
  dir?: string

  /**
   * Register apis globally
   *
   * @default false
   */
  globals?: boolean

  /**
   * Running environment
   *
   * Supports 'node', 'jsdom', 'happy-dom', 'edge-runtime'
   *
   * If used unsupported string, will try to load the package `vitest-environment-${env}`
   *
   * @default 'node'
   */
  environment?: VitestEnvironment

  /**
   * Environment options.
   */
  environmentOptions?: EnvironmentOptions

  /**
   * Run tests in an isolated environment. This option has no effect on vmThreads pool.
   *
   * Disabling this option might improve performance if your code doesn't rely on side effects.
   *
   * @default true
   */
  isolate?: boolean

  /**
   * Pool used to run tests in.
   *
   * Supports 'threads', 'forks', 'vmThreads'
   *
   * @default 'forks'
   */
  pool?: Exclude<Pool, 'browser'>

  /**
   * Pool options
   */
  poolOptions?: PoolOptions

  /**
   * Maximum number or percentage of workers to run tests in. `poolOptions.{threads,vmThreads}.maxThreads`/`poolOptions.forks.maxForks` has higher priority.
   */
  maxWorkers?: number | string
  /**
   * Minimum number or percentage of workers to run tests in. `poolOptions.{threads,vmThreads}.minThreads`/`poolOptions.forks.minForks` has higher priority.
   */
  minWorkers?: number | string

  /**
   * Should all test files run in parallel. Doesn't affect tests running in the same file.
   * Setting this to `false` will override `maxWorkers` and `minWorkers` options to `1`.
   *
   * @default true
   */
  fileParallelism?: boolean

  /**
   * Options for projects
   */
  projects?: TestProjectConfiguration[]

  /**
   * Update snapshot
   *
   * @default false
   */
  update?: boolean

  /**
   * Watch mode
   *
   * @default !process.env.CI
   */
  watch?: boolean

  /**
   * Project root
   *
   * @default process.cwd()
   */
  root?: string

  /**
   * Custom reporter for output. Can contain one or more built-in report names, reporter instances,
   * and/or paths to custom reporters.
   *
   * @default []
   */
  reporters?:
    | Arrayable<ReporterName | InlineReporter>
    | (
        | (ReporterName | InlineReporter)
        | [ReporterName]
        | ReporterWithOptions
    )[]

  /**
   * Write test results to a file when the --reporter=json` or `--reporter=junit` option is also specified.
   * Also definable individually per reporter by using an object instead.
   */
  outputFile?:
    | string
    | (Partial<Record<BuiltinReporters, string>> & Record<string, string>)

  /**
   * Default timeout of a test in milliseconds
   *
   * @default 5000
   */
  testTimeout?: number

  /**
   * Default timeout of a hook in milliseconds
   *
   * @default 10000
   */
  hookTimeout?: number

  /**
   * Default timeout to wait for close when Vitest shuts down, in milliseconds
   *
   * @default 10000
   */
  teardownTimeout?: number

  /**
   * Silent mode
   *
   * Use `'passed-only'` to see logs from failing tests only.
   *
   * @default false
   */
  silent?: boolean | 'passed-only'

  /**
   * Hide logs for skipped tests
   *
   * @default false
   */
  hideSkippedTests?: boolean

  /**
   * Path to setup files
   */
  setupFiles?: string | string[]

  /**
   * Path to global setup files
   */
  globalSetup?: string | string[]

  /**
   * Glob pattern of file paths that will trigger the whole suite rerun
   *
   * Useful if you are testing calling CLI commands
   *
   * @default ['**\/package.json/**', '**\/{vitest,vite}.config.*\/**']
   */
  forceRerunTriggers?: string[]

  /**
   * Pattern configuration to rerun only the tests that are affected
   * by the changes of specific files in the repository.
   */
  watchTriggerPatterns?: WatcherTriggerPattern[]

  /**
   * Coverage options
   */
  coverage?: CoverageOptions

  /**
   * run test names with the specified pattern
   */
  testNamePattern?: string | RegExp

  /**
   * Will call `.mockClear()` on all spies before each test
   * @default false
   */
  clearMocks?: boolean

  /**
   * Will call `.mockReset()` on all spies before each test
   * @default false
   */
  mockReset?: boolean

  /**
   * Will call `.mockRestore()` on all spies before each test
   * @default false
   */
  restoreMocks?: boolean

  /**
   * Will restore all global stubs to their original values before each test
   * @default false
   */
  unstubGlobals?: boolean

  /**
   * Will restore all env stubs to their original values before each test
   * @default false
   */
  unstubEnvs?: boolean

  /**
   * Serve API options.
   *
   * When set to true, the default port is 51204.
   *
   * @default false
   */
  api?: boolean | number | ApiConfig

  /**
   * Enable Vitest UI
   *
   * @default false
   */
  ui?: boolean

  /**
   * options for test in a browser environment
   * @experimental
   *
   * @default false
   */
  browser?: BrowserConfigOptions

  /**
   * Open UI automatically.
   *
   * @default !process.env.CI
   */
  open?: boolean

  /**
   * Base url for the UI
   *
   * @default '/__vitest__/'
   */
  uiBase?: string

  /**
   * Format options for snapshot testing.
   */
  snapshotFormat?: Omit<PrettyFormatOptions, 'plugins' | 'compareKeys'> & {
    compareKeys?: null | undefined
  }

  /**
   * Path to a module which has a default export of diff config.
   */
  diff?: string | SerializedDiffOptions

  /**
   * Paths to snapshot serializer modules.
   */
  snapshotSerializers?: string[]

  /**
   * Resolve custom snapshot path
   */
  resolveSnapshotPath?: ResolveSnapshotPathHandler

  /**
   * Path to a custom snapshot environment module that has a default export of `SnapshotEnvironment` object.
   */
  snapshotEnvironment?: string

  /**
   * Pass with no tests
   */
  passWithNoTests?: boolean

  /**
   * Allow tests and suites that are marked as only
   *
   * @default !process.env.CI
   */
  allowOnly?: boolean

  /**
   * Show heap usage after each test. Useful for debugging memory leaks.
   */
  logHeapUsage?: boolean

  /**
   * Custom environment variables assigned to `process.env` before running tests.
   */
  env?: Partial<NodeJS.ProcessEnv>

  /**
   * Options for @sinon/fake-timers
   */
  fakeTimers?: FakeTimerInstallOpts

  /**
   * Custom handler for console.log in tests.
   *
   * Return `false` to ignore the log.
   */
  onConsoleLog?: (log: string, type: 'stdout' | 'stderr', entity: TestModule | TestCase | TestSuite | undefined) => boolean | void

  /**
   * Enable stack trace filtering. If absent, all stack trace frames
   * will be shown.
   *
   * Return `false` to omit the frame.
   */
  onStackTrace?: (error: TestError, frame: ParsedStack) => boolean | void

  /**
   * A callback that can return `false` to ignore an unhandled error
   */
  onUnhandledError?: OnUnhandledErrorCallback

  /**
   * Indicates if CSS files should be processed.
   *
   * When excluded, the CSS files will be replaced with empty strings to bypass the subsequent processing.
   *
   * @default { include: [], modules: { classNameStrategy: false } }
   */
  css?:
    | boolean
    | {
      include?: RegExp | RegExp[]
      exclude?: RegExp | RegExp[]
      modules?: {
        classNameStrategy?: CSSModuleScopeStrategy
      }
    }
  /**
   * A number of tests that are allowed to run at the same time marked with `test.concurrent`.
   * @default 5
   */
  maxConcurrency?: number

  /**
   * Options for configuring cache policy.
   * @default { dir: 'node_modules/.vite/vitest/{project-hash}' }
   */
  cache?:
    | false
    | {
      /**
       * @deprecated Use Vite's "cacheDir" instead if you want to change the cache director. Note caches will be written to "cacheDir\/vitest".
       */
      dir: string
    }

  /**
   * Options for configuring the order of running tests.
   */
  sequence?: SequenceOptions

  /**
   * Specifies an `Object`, or an `Array` of `Object`,
   * which defines aliases used to replace values in `import` or `require` statements.
   * Will be merged with the default aliases inside `resolve.alias`.
   */
  alias?: AliasOptions

  /**
   * Ignore any unhandled errors that occur
   *
   * @default false
   */
  dangerouslyIgnoreUnhandledErrors?: boolean

  /**
   * Options for configuring typechecking test environment.
   */
  typecheck?: Partial<TypecheckConfig>

  /**
   * The number of milliseconds after which a test is considered slow and reported as such in the results.
   *
   * @default 300
   */
  slowTestThreshold?: number

  /**
   * Path to a custom test runner.
   */
  runner?: string

  /**
   * Debug tests by opening `node:inspector` in worker / child process.
   * Provides similar experience as `--inspect` Node CLI argument.
   *
   * Requires `poolOptions.threads.singleThread: true` OR `poolOptions.forks.singleFork: true`.
   */
  inspect?: boolean | string

  /**
   * Debug tests by opening `node:inspector` in worker / child process and wait for debugger to connect.
   * Provides similar experience as `--inspect-brk` Node CLI argument.
   *
   * Requires `poolOptions.threads.singleThread: true` OR `poolOptions.forks.singleFork: true`.
   */
  inspectBrk?: boolean | string

  /**
   * Inspector options. If `--inspect` or `--inspect-brk` is enabled, these options will be passed to the inspector.
   */
  inspector?: {
    /**
     * Enable inspector
     */
    enabled?: boolean
    /**
     * Port to run inspector on
     */
    port?: number
    /**
     * Host to run inspector on
     */
    host?: string
    /**
     * Wait for debugger to connect before running tests
     */
    waitForDebugger?: boolean
  }

  /**
   * Define variables that will be returned from `inject` in the test environment.
   * @example
   * ```ts
   * // vitest.config.ts
   * export default defineConfig({
   *   test: {
   *     provide: {
   *       someKey: 'someValue'
   *     }
   *   }
   * })
   * ```
   * ```ts
   * // test file
   * import { inject } from 'vitest'
   * const value = inject('someKey') // 'someValue'
   * ```
   */
  provide?: Partial<ProvidedContext>

  /**
   * Configuration options for expect() matches.
   */
  expect?: {
    /**
     * Throw an error if tests don't have any expect() assertions.
     */
    requireAssertions?: boolean
    /**
     * Default options for expect.poll()
     */
    poll?: {
      /**
       * Timeout in milliseconds
       * @default 1000
       */
      timeout?: number
      /**
       * Polling interval in milliseconds
       * @default 50
       */
      interval?: number
    }
  }

  /**
   * Modify default Chai config. Vitest uses Chai for `expect` and `assert` matches.
   * https://github.com/chaijs/chai/blob/4.x.x/lib/chai/config.js
   */
  chaiConfig?: ChaiConfig

  /**
   * Stop test execution when given number of tests have failed.
   */
  bail?: number

  /**
   * Retry the test specific number of times if it fails.
   *
   * @default 0
   */
  retry?: number

  /**
   * Show full diff when snapshot fails instead of a patch.
   */
  expandSnapshotDiff?: boolean

  /**
   * By default, Vitest automatically intercepts console logging during tests for extra formatting of test file, test title, etc...
   * This is also required for console log preview on Vitest UI.
   * However, disabling such interception might help when you want to debug a code with normal synchronous terminal console logging.
   *
   * This option has no effect on browser pool since Vitest preserves original logging on browser devtools.
   *
   * @default false
   */
  disableConsoleIntercept?: boolean

  /**
   * Always print console stack traces.
   *
   * @default false
   */
  printConsoleTrace?: boolean

  /**
   * Include "location" property inside the test definition
   *
   * @default false
   */
  includeTaskLocation?: boolean

  /**
   * Directory path for storing attachments created by `context.annotate`
   *
   * @default '.vitest-attachments'
   */
  attachmentsDir?: string
}

export interface TypecheckConfig {
  /**
   * Run typechecking tests alongside regular tests.
   */
  enabled?: boolean
  /**
   * When typechecking is enabled, only run typechecking tests.
   */
  only?: boolean
  /**
   * What tools to use for type checking.
   *
   * @default 'tsc'
   */
  checker: 'tsc' | 'vue-tsc' | (string & Record<never, never>)
  /**
   * Pattern for files that should be treated as test files
   *
   * @default ['**\/*.{test,spec}-d.?(c|m)[jt]s?(x)']
   */
  include: string[]
  /**
   * Pattern for files that should not be treated as test files
   *
   * @default ['**\/node_modules/**', '**\/dist/**', '**\/cypress/**', '**\/.{idea,git,cache,output,temp}/**', '**\/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*']
   */
  exclude: string[]
  /**
   * Check JS files that have `@ts-check` comment.
   * If you have it enabled in tsconfig, this will not overwrite it.
   */
  allowJs?: boolean
  /**
   * Do not fail, if Vitest found errors outside the test files.
   */
  ignoreSourceErrors?: boolean
  /**
   * Path to tsconfig, relative to the project root.
   */
  tsconfig?: string
  /**
   * Minimum time in milliseconds it takes to spawn the typechecker.
   * @default 10_000
   */
  spawnTimeout?: number
}

export interface UserConfig extends InlineConfig {
  /**
   * Path to the config file.
   *
   * Default resolving to `vitest.config.*`, `vite.config.*`
   *
   * Setting to `false` will disable config resolving.
   */
  config?: string | false | undefined

  /**
   * Do not run tests when Vitest starts.
   *
   * Vitest will only run tests if it's called programmatically or the test file changes.
   *
   * If CLI file filters are passed, standalone mode is ignored.
   */
  standalone?: boolean

  /**
   * Use happy-dom
   */
  dom?: boolean

  /**
   * Run tests that cover a list of source files
   */
  related?: string[] | string

  /**
   * Overrides Vite mode
   * @default 'test'
   */
  mode?: string

  /**
   * Runs tests that are affected by the changes in the repository, or between specified branch or commit hash
   * Requires initialized git repository
   * @default false
   */
  changed?: boolean | string

  /**
   * Test suite shard to execute in a format of <index>/<count>.
   * Will divide tests into a `count` numbers, and run only the `indexed` part.
   * Cannot be used with enabled watch.
   * @example --shard=2/3
   */
  shard?: string

  /**
   * Name of the project or projects to run.
   */
  project?: string | string[]

  /**
   * Additional exclude patterns
   */
  cliExclude?: string[]

  /**
   * Override vite config's clearScreen from cli
   */
  clearScreen?: boolean

  /**
   * benchmark.compare option exposed at the top level for cli
   */
  compare?: string

  /**
   * benchmark.outputJson option exposed at the top level for cli
   */
  outputJson?: string

  /**
   * Directory of blob reports to merge
   * @default '.vitest-reports'
   */
  mergeReports?: string
}

export type OnUnhandledErrorCallback = (error: (TestError | Error) & { type: string }) => boolean | void

export interface ResolvedConfig
  extends Omit<
    Required<UserConfig>,
    | 'project'
    | 'config'
    | 'filters'
    | 'browser'
    | 'coverage'
    | 'testNamePattern'
    | 'related'
    | 'api'
    | 'reporters'
    | 'resolveSnapshotPath'
    | 'benchmark'
    | 'shard'
    | 'cache'
    | 'sequence'
    | 'typecheck'
    | 'runner'
    | 'poolOptions'
    | 'pool'
    | 'cliExclude'
    | 'diff'
    | 'setupFiles'
    | 'snapshotEnvironment'
    | 'bail'
    | 'name'
  > {
  mode: VitestRunMode

  name: ProjectName['label']
  color?: ProjectName['color']
  base?: string
  diff?: string | SerializedDiffOptions
  bail?: number

  setupFiles: string[]
  snapshotEnvironment?: string

  config?: string
  filters?: string[]
  testNamePattern?: RegExp
  related?: string[]

  coverage: ResolvedCoverageOptions
  snapshotOptions: SnapshotStateOptions

  browser: ResolvedBrowserOptions
  pool: Pool
  poolOptions?: ResolvedPoolOptions

  reporters: (InlineReporter | ReporterWithOptions)[]

  defines: Record<string, any>

  api: ApiConfig & { token: string }
  cliExclude?: string[]

  project: string[]
  benchmark?: Required<
    Omit<BenchmarkUserOptions, 'outputFile' | 'compare' | 'outputJson'>
  >
  & Pick<BenchmarkUserOptions, 'outputFile' | 'compare' | 'outputJson'>
  shard?: {
    index: number
    count: number
  }

  cache:
    | {
      /**
       * @deprecated
       */
      dir: string
    }
    | false

  sequence: {
    sequencer: TestSequencerConstructor
    hooks: SequenceHooks
    setupFiles: SequenceSetupFiles
    shuffle?: boolean
    concurrent?: boolean
    seed: number
    groupOrder: number
  }

  typecheck: Omit<TypecheckConfig, 'enabled'> & {
    enabled: boolean
  }
  runner?: string

  maxWorkers: number
  minWorkers: number
}

type NonProjectOptions
  = | 'shard'
    | 'watch'
    | 'run'
    | 'cache'
    | 'update'
    | 'reporters'
    | 'outputFile'
    | 'teardownTimeout'
    | 'silent'
    | 'forceRerunTriggers'
    | 'testNamePattern'
    | 'ui'
    | 'open'
    | 'uiBase'
  // TODO: allow snapshot options
    | 'snapshotFormat'
    | 'resolveSnapshotPath'
    | 'passWithNoTests'
    | 'onConsoleLog'
    | 'onStackTrace'
    | 'dangerouslyIgnoreUnhandledErrors'
    | 'slowTestThreshold'
    | 'inspect'
    | 'inspectBrk'
    | 'coverage'
    | 'maxWorkers'
    | 'minWorkers'
    | 'fileParallelism'
    | 'watchTriggerPatterns'

export interface ServerDepsOptions {
  /**
   * Externalize means that Vite will bpass the package to native Node.
   *
   * Externalized dependencies will not be applied Vite's transformers and resolvers.
   * And does not support HMR on reload.
   *
   * Typically, packages under `node_modules` are externalized.
   */
  external?: (string | RegExp)[]
  /**
   * Vite will process inlined modules.
   *
   * This could be helpful to handle packages that ship `.js` in ESM format (that Node can't handle).
   *
   * If `true`, every dependency will be inlined
   */
  inline?: (string | RegExp)[] | true
  /**
   * Try to guess the CJS version of a package when it's invalid ESM
   * @default false
   */
  fallbackCJS?: boolean
}

export type ProjectConfig = Omit<
  InlineConfig,
  NonProjectOptions
  | 'sequencer'
  | 'deps'
  | 'poolOptions'
> & {
  mode?: string
  sequencer?: Omit<SequenceOptions, 'sequencer' | 'seed'>
  deps?: Omit<DepsOptions, 'moduleDirectories'>
  poolOptions?: {
    threads?: Pick<
      NonNullable<PoolOptions['threads']>,
      'singleThread' | 'isolate'
    >
    vmThreads?: Pick<NonNullable<PoolOptions['vmThreads']>, 'singleThread'>
    forks?: Pick<NonNullable<PoolOptions['forks']>, 'singleFork' | 'isolate'>
  }
}

export type ResolvedProjectConfig = Omit<
  ResolvedConfig,
  // some options cannot be set, but they are inherited from the workspace
  Exclude<NonProjectOptions, 'coverage' | 'watch'>
>

export interface UserWorkspaceConfig extends ViteUserConfig {
  test?: ProjectConfig
}

// TODO: remove types when "workspace" support is removed
export type UserProjectConfigFn = (
  env: ConfigEnv
) => UserWorkspaceConfig | Promise<UserWorkspaceConfig>
export type UserProjectConfigExport
  = | UserWorkspaceConfig
    | Promise<UserWorkspaceConfig>
    | UserProjectConfigFn

export type TestProjectInlineConfiguration = (UserWorkspaceConfig & {
  /**
   * Relative path to the extendable config. All other options will be merged with this config.
   * If `true`, the project will inherit all options from the root config.
   * @example '../vite.config.ts'
   */
  extends?: string | true
})

export type TestProjectConfiguration
  = string
    | TestProjectInlineConfiguration
    | Promise<UserWorkspaceConfig>
    | UserProjectConfigFn
