// https://www.cnblogs.com/longmo666/p/18151925

import type { Linter } from 'eslint'

import { interopDefault } from '../util'

/**
 * 此功能帮助您避免在使用JSON,JSONC和JSON5时出现问题
 * @see https://ota-meshi.github.io/eslint-plugin-jsonc/rules/
 */
export async function jsonc(): Promise<Linter.Config[]> {
    const [pluginJsonc, parserJsonc] = await Promise.all([
        interopDefault(import('eslint-plugin-jsonc')),
        interopDefault(import('jsonc-eslint-parser'))
    ])

    return [
        {
            files: ['**/*.json', '**/*.json5', '**/*.jsonc', '**.code-workspace'],
            languageOptions: {
                parser: parserJsonc as any
            },
            plugins: {
                jsonc: pluginJsonc as any
            },
            rules: {
                // 禁止 BigInt 字面量 (例: 21n)
                'jsonc/no-bigint-literals': 'error',
                // 不允许二进制表达式 (例: 60 * 40 * 20)
                'jsonc/no-binary-expression': 'error',
                // 禁止二进制数字文字 (例: 0b1010)
                'jsonc/no-binary-numeric-literals': 'error',
                // 禁止对象字面量中出现重复的键
                'jsonc/no-dupe-keys': 'error',
                // 不允许标识符中使用转义序列 (例: \u0042\u{41}\u{44}: "BAD")
                'jsonc/no-escape-sequence-in-identifier': 'error',
                // 禁止在数字文字中使用前导或尾随小数点 (例: .0 或 1.)
                'jsonc/no-floating-decimal': 'error',
                // 禁止十六进制数字文字 (例: "BAD": 0xFFFF)
                'jsonc/no-hexadecimal-numeric-literals': 'error',
                'jsonc/no-infinity': 'error',
                // 禁止多行字符串
                'jsonc/no-multi-str': 'error',
                // 禁止 NaN
                'jsonc/no-nan': 'error',
                // 禁止数字属性键
                'jsonc/no-number-props': 'error',
                // 禁止数字分隔符 (例: "BAD": 1_234_567_890)
                'jsonc/no-numeric-separators': 'error',
                // 禁止使用传统的八进制文字
                'jsonc/no-octal': 'error',
                // 禁止在字符串文字中使用八进制转义序列
                'jsonc/no-octal-escape': 'error',
                // 不允许八进制数字文字 (例: "BAD": 0o777)
                'jsonc/no-octal-numeric-literals': 'error',
                // 禁止在表达式周围使用括号 (例: "BAD": (110))
                'jsonc/no-parenthesized': 'error',
                // 不允许加号 (例: "BAD": +42)
                'jsonc/no-plus-sign': 'error',
                // 禁止使用RegExp文字 (例: "BAD": /foo/)
                'jsonc/no-regexp-literals': 'error',
                // 禁止稀疏数组 (例: "BAD": [, 2, , 4])
                'jsonc/no-sparse-arrays': 'error',
                // 禁止模板文字 (例: "BAD": `BAD`)
                'jsonc/no-template-literals': 'error',
                // 禁止undefined
                'jsonc/no-undefined-value': 'error',
                // 不允许 Unicode 代码点转义序列 (例: "BAD": "\u{41}")
                'jsonc/no-unicode-codepoint-escapes': 'error',
                // 禁止不必要的转义使用 (例: "BAD": ""b\ad")
                'jsonc/no-useless-escape': 'error',
                // 排序
                'jsonc/sort-keys': 'off',
                // 一元运算符后不允许有空格 (例: "BAD": -  42)
                'jsonc/space-unary-ops': 'error',
                // 禁止 JSON 的无效数字 (例: "BAD": [123., .4, +42, Infinity, NaN])
                'jsonc/valid-json-number': 'error',
                // 禁止 Vue 自定义块中的解析错误
                'jsonc/vue-custom-block/no-parsing-error': 'error'
            }
        },
        sortPackageJson(),
        sortTsconfig()
    ]
}

/** 针对package.json排序 */
function sortPackageJson(): Linter.Config {
    return {
        files: ['**/package.json'],
        rules: {
            // 数组值进行排序
            'jsonc/sort-array-values': [
                'error',
                {
                    order: { type: 'asc' },
                    pathPattern: '^files$|^pnpm.neverBuiltDependencies$'
                }
            ],
            // 对象键进行排序
            'jsonc/sort-keys': [
                'error',
                {
                    order: [
                        'name',
                        'version',
                        'description',
                        'private',
                        'keywords',
                        'homepage',
                        'bugs',
                        'repository',
                        'license',
                        'author',
                        'contributors',
                        'categories',
                        'funding',
                        'type',
                        'scripts',
                        'files',
                        'sideEffects',
                        'bin',
                        'main',
                        'module',
                        'unpkg',
                        'jsdelivr',
                        'types',
                        'typesVersions',
                        'imports',
                        'exports',
                        'publishConfig',
                        'icon',
                        'activationEvents',
                        'contributes',
                        'peerDependencies',
                        'peerDependenciesMeta',
                        'dependencies',
                        'optionalDependencies',
                        'devDependencies',
                        'engines',
                        'packageManager',
                        'pnpm',
                        'overrides',
                        'resolutions',
                        'husky',
                        'simple-git-hooks',
                        'lint-staged',
                        'eslintConfig'
                    ],
                    pathPattern: '^$'
                },
                {
                    order: { type: 'asc' },
                    pathPattern: '^(?:dev|peer|optional|bundled)?[Dd]ependencies(Meta)?$'
                },
                {
                    order: { type: 'asc' },
                    pathPattern: '^(?:resolutions|overrides|pnpm.overrides)$'
                },
                {
                    order: ['types', 'import', 'require', 'default'],
                    pathPattern: '^exports.*$'
                }
            ]
        }
    }
}

/** 针对tsconfig排序 */
function sortTsconfig(): Linter.Config {
    return {
        files: ['**/tsconfig.json', '**/tsconfig.*.json', 'internal/tsconfig/*.json'],
        rules: {
            'jsonc/sort-keys': [
                'error',
                {
                    order: [
                        'extends',
                        'compilerOptions',
                        'references',
                        'files',
                        'include',
                        'exclude'
                    ],
                    pathPattern: '^$'
                },
                {
                    order: [
                        /* Projects */
                        'incremental',
                        'composite',
                        'tsBuildInfoFile',
                        'disableSourceOfProjectReferenceRedirect',
                        'disableSolutionSearching',
                        'disableReferencedProjectLoad',
                        /* Language and Environment */
                        'target',
                        'jsx',
                        'jsxFactory',
                        'jsxFragmentFactory',
                        'jsxImportSource',
                        'lib',
                        'moduleDetection',
                        'noLib',
                        'reactNamespace',
                        'useDefineForClassFields',
                        'emitDecoratorMetadata',
                        'experimentalDecorators',
                        /* Modules */
                        'baseUrl',
                        'rootDir',
                        'rootDirs',
                        'customConditions',
                        'module',
                        'moduleResolution',
                        'moduleSuffixes',
                        'noResolve',
                        'paths',
                        'resolveJsonModule',
                        'resolvePackageJsonExports',
                        'resolvePackageJsonImports',
                        'typeRoots',
                        'types',
                        'allowArbitraryExtensions',
                        'allowImportingTsExtensions',
                        'allowUmdGlobalAccess',
                        /* JavaScript Support */
                        'allowJs',
                        'checkJs',
                        'maxNodeModuleJsDepth',
                        /* Type Checking */
                        'strict',
                        'strictBindCallApply',
                        'strictFunctionTypes',
                        'strictNullChecks',
                        'strictPropertyInitialization',
                        'allowUnreachableCode',
                        'allowUnusedLabels',
                        'alwaysStrict',
                        'exactOptionalPropertyTypes',
                        'noFallthroughCasesInSwitch',
                        'noImplicitAny',
                        'noImplicitOverride',
                        'noImplicitReturns',
                        'noImplicitThis',
                        'noPropertyAccessFromIndexSignature',
                        'noUncheckedIndexedAccess',
                        'noUnusedLocals',
                        'noUnusedParameters',
                        'useUnknownInCatchVariables',
                        /* Emit */
                        'declaration',
                        'declarationDir',
                        'declarationMap',
                        'downlevelIteration',
                        'emitBOM',
                        'emitDeclarationOnly',
                        'importHelpers',
                        'importsNotUsedAsValues',
                        'inlineSourceMap',
                        'inlineSources',
                        'mapRoot',
                        'newLine',
                        'noEmit',
                        'noEmitHelpers',
                        'noEmitOnError',
                        'outDir',
                        'outFile',
                        'preserveConstEnums',
                        'preserveValueImports',
                        'removeComments',
                        'sourceMap',
                        'sourceRoot',
                        'stripInternal',
                        /* Interop Constraints */
                        'allowSyntheticDefaultImports',
                        'esModuleInterop',
                        'forceConsistentCasingInFileNames',
                        'isolatedModules',
                        'preserveSymlinks',
                        'verbatimModuleSyntax',
                        /* Completeness */
                        'skipDefaultLibCheck',
                        'skipLibCheck'
                    ],
                    pathPattern: '^compilerOptions$'
                }
            ]
        }
    }
}
