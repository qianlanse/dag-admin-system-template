import type { Linter } from 'eslint'

// 将 JavaScript 特定的功能从 ESLint 中分离出来
import js from '@eslint/js'
// https://www.npmjs.com/package/eslint-plugin-unused-imports
// 查找并删除未使用的 es6 模块导入
import pluginUnusedImports from 'eslint-plugin-unused-imports'
// 不同 JavaScript 环境的全局标识符
import globals from 'globals'

/**
 * 针对javascript的规则配置
 * @see https://eslint.org/docs/latest/rules
 */
export async function javascript(): Promise<Linter.Config[]> {
    return [
        {
            languageOptions: {
                ecmaVersion: 'latest',
                globals: {
                    ...globals.browser,
                    ...globals.es2021,
                    ...globals.node,
                    document: 'readonly',
                    navigator: 'readonly',
                    window: 'readonly'
                },
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true
                    },
                    ecmaVersion: 'latest',
                    sourceType: 'module'
                },
                sourceType: 'module'
            },
            linterOptions: {
                reportUnusedDisableDirectives: true
            },
            plugins: {
                'unused-imports': pluginUnusedImports
            },
            rules: {
                ...js.configs.recommended.rules,
                /**
                 * https://eslint.org/docs/latest/rules/
                 */
                // 在对象和类中强制执行 getter 和 setter 成对出现
                'accessor-pairs': [
                    'error',
                    {
                        enforceForClassMembers: true,
                        setWithoutGet: true
                    }
                ],
                // 在数组方法的回调中强制执行 return 语句
                'array-callback-return': 'error',
                // 在定义的范围内强制使用变量
                'block-scoped-var': 'error',
                // 需要在派生类的构造函数必须调用super()
                'constructor-super': 'error',
                // 将 switch 语句中的 default 子句强制为最后
                'default-case-last': 'error',
                // 尽可能强制使用点表示法(object)
                'dot-notation': [
                    'error',
                    {
                        allowKeywords: true
                    }
                ],
                // 需要使用 === 和 !==
                eqeqeq: ['error', 'always'],
                // 强制关键字前后的间距一致
                'keyword-spacing': 'error',
                // 要求构造函数名称以大写字母开头
                'new-cap': [
                    'error',
                    {
                        capIsNew: false, // 允许在没有新运算符的情况下调用大写开头的函数
                        newIsCap: true, // 要求使用大写开头的函数调用所有新运算符
                        properties: true // 启用对对象属性的检查
                    }
                ],
                'no-alert': 'error',
                // 禁止数组构造函数
                'no-array-constructor': 'error',
                // 不允许将 async 函数用作 Promise 执行程序
                'no-async-promise-executor': 'error',
                // 禁止使用 arguments.caller 或 arguments.callee 未来版本已弃用
                'no-caller': 'error',
                // 不允许在 case 子句中使用词法声明
                'no-case-declarations': 'error',
                // 禁止重新分配类成员
                'no-class-assign': 'error',
                // 不允许与 -0 进行比较
                'no-compare-neg-zero': 'error',
                // 禁止在条件表达式中使用赋值运算符
                'no-cond-assign': ['error', 'always'],
                'no-console': ['error', { allow: ['warn', 'error'] }],
                // 不允许重新分配 const 变量
                'no-const-assign': 'error',
                // 禁止在正则表达式中使用控制字符
                'no-control-regex': 'error',
                // 禁止使用 debugger
                'no-debugger': 'error',
                // 禁止删除变量
                'no-delete-var': 'error',
                // 不允许在函数定义中使用重复的参数
                'no-dupe-args': 'error',
                // 不允许重复的类成员
                'no-dupe-class-members': 'error',
                // 禁止在对象文字中使用重复键
                'no-dupe-keys': 'error',
                // 不允许重复的case标签
                'no-duplicate-case': 'error',
                // 不允许空块语句
                'no-empty': ['error', { allowEmptyCatch: true }],
                // 禁止在正则表达式中使用空字符类
                'no-empty-character-class': 'error',
                'no-empty-function': 'off',
                // 不允许空的解构模式
                'no-empty-pattern': 'error',
                // 不允许使用 eval()
                'no-eval': 'error',
                // 不允许在 catch 子句中重新分配异常
                'no-ex-assign': 'error',
                // 不允许扩展原生类型
                'no-extend-native': 'error',
                // 禁止对 .bind() 的不必要调用
                'no-extra-bind': 'error',
                // 不允许不必要的布尔强制转换
                'no-extra-boolean-cast': 'error',
                // 不允许 switch case 语句的故障转移
                'no-fallthrough': 'error',
                // 不允许重新分配函数声明
                'no-func-assign': 'error',
                // 不允许对原生对象或只读全局变量进行赋值
                'no-global-assign': 'error',
                // 不允许使用类似 eval() 的方法
                'no-implied-eval': 'error',
                // 禁止分配给导入的绑定
                'no-import-assign': 'error',
                // 禁止在 RegExp 构造函数中使用无效的正则表达式字符串
                'no-invalid-regexp': 'error',
                // 不允许不规则的空格
                'no-irregular-whitespace': 'error',
                // 禁止使用 __iterator__ 属性
                'no-iterator': 'error',
                // 禁止带标签的语句
                'no-labels': ['error', { allowLoop: false, allowSwitch: false }],
                // 不允许不必要的嵌套块
                'no-lone-blocks': 'error',
                // 不允许丢失精度的文本数字
                'no-loss-of-precision': 'error',
                // 不允许在字符类语法中使用多个码位创建的字符
                'no-misleading-character-class': 'error',
                // 不允许多行字符串
                'no-multi-str': 'error',
                'no-new': 'error',
                'no-new-func': 'error',
                'no-new-object': 'error',
                'no-new-symbol': 'error',
                'no-new-wrappers': 'error',
                'no-obj-calls': 'error',
                'no-octal': 'error',
                'no-octal-escape': 'error',
                'no-proto': 'error',
                'no-prototype-builtins': 'error',
                'no-redeclare': ['error', { builtinGlobals: false }],
                'no-regex-spaces': 'error',
                'no-restricted-globals': [
                    'error',
                    { message: 'Use `globalThis` instead.', name: 'global' },
                    { message: 'Use `globalThis` instead.', name: 'self' }
                ],
                'no-restricted-properties': [
                    'error',
                    {
                        message: 'Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.',
                        property: '__proto__'
                    },
                    {
                        message: 'Use `Object.defineProperty` instead.',
                        property: '__defineGetter__'
                    },
                    {
                        message: 'Use `Object.defineProperty` instead.',
                        property: '__defineSetter__'
                    },
                    {
                        message: 'Use `Object.getOwnPropertyDescriptor` instead.',
                        property: '__lookupGetter__'
                    },
                    {
                        message: 'Use `Object.getOwnPropertyDescriptor` instead.',
                        property: '__lookupSetter__'
                    }
                ],
                'no-restricted-syntax': [
                    'error',
                    'DebuggerStatement',
                    'LabeledStatement',
                    'WithStatement',
                    'TSEnumDeclaration[const=true]',
                    'TSExportAssignment'
                ],
                'no-self-assign': ['error', { props: true }],
                'no-self-compare': 'error',
                'no-sequences': 'error',
                'no-shadow-restricted-names': 'error',
                'no-sparse-arrays': 'error',
                'no-template-curly-in-string': 'error',
                'no-this-before-super': 'error',
                'no-throw-literal': 'error',
                // 此规则可以帮助您找到由于变量和参数名称拼写错误或意外隐式全局变量（例如，忘记for循环初始化程序中的var关键字）而导致的潜在 ReferenceError。
                'no-undef': 'off',
                'no-undef-init': 'error',
                'no-unexpected-multiline': 'error',
                'no-unmodified-loop-condition': 'error',
                'no-unneeded-ternary': ['error', { defaultAssignment: false }],
                'no-unreachable': 'error',
                'no-unreachable-loop': 'error',
                'no-unsafe-finally': 'error',
                'no-unsafe-negation': 'error',
                'no-unused-expressions': [
                    'error',
                    {
                        allowShortCircuit: true,
                        allowTaggedTemplates: true,
                        allowTernary: true
                    }
                ],
                'no-unused-vars': [
                    'error',
                    {
                        args: 'none',
                        caughtErrors: 'none',
                        ignoreRestSiblings: true,
                        vars: 'all'
                    }
                ],
                'no-use-before-define': [
                    'error',
                    { classes: false, functions: false, variables: false }
                ],
                'no-useless-backreference': 'error',
                'no-useless-call': 'error',
                'no-useless-catch': 'error',
                'no-useless-computed-key': 'error',
                'no-useless-constructor': 'error',
                'no-useless-rename': 'error',
                'no-useless-return': 'error',
                'no-var': 'error',
                'no-with': 'error',
                'object-shorthand': [
                    'error',
                    'always',
                    { avoidQuotes: true, ignoreConstructors: false }
                ],
                'one-var': ['error', { initialized: 'never' }],
                'prefer-arrow-callback': [
                    'error',
                    {
                        allowNamedFunctions: false,
                        allowUnboundThis: true
                    }
                ],
                'prefer-const': [
                    'error',
                    {
                        destructuring: 'all',
                        ignoreReadBeforeAssign: true
                    }
                ],
                'prefer-exponentiation-operator': 'error',

                'prefer-promise-reject-errors': 'error',
                'prefer-regex-literals': ['error', { disallowRedundantWrapping: true }],
                'prefer-rest-params': 'error',
                'prefer-spread': 'error',
                'prefer-template': 'error',
                'space-before-function-paren': 'off',
                'spaced-comment': 'error',
                'symbol-description': 'error',
                'unicode-bom': ['error', 'never'],

                'unused-imports/no-unused-imports': 'error',
                'unused-imports/no-unused-vars': [
                    'error',
                    {
                        args: 'after-used',
                        argsIgnorePattern: '^_',
                        vars: 'all',
                        varsIgnorePattern: '^_'
                    }
                ],
                'use-isnan': ['error', { enforceForIndexOf: true, enforceForSwitchCase: true }],
                'valid-typeof': ['error', { requireStringLiterals: true }],

                'vars-on-top': 'error',
                yoda: ['error', 'never']
            }
        }
    ]
}
