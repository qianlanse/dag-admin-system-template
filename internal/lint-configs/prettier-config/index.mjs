/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

export default {
    // 应用哪个行尾字符
    endOfLine: 'auto',
    overrides: [
        {
            files: ['*.json5'],
            options: {
                quoteProps: 'preserve',
                singleQuote: false
            }
        }
    ],
    // 插件支持
    plugins: ['prettier-plugin-tailwindcss'],
    // 指定每行输入将换行的行长度
    printWidth: 100,
    proseWrap: 'never',
    // 在语句末尾打印分号
    semi: false,
    // 使用单引号而不是双引号
    singleQuote: true,
    // 指定每个缩进级别的空格数
    tabWidth: 4,
    // 尽可能打印尾随逗号
    trailingComma: 'none',
    // 使用制表符而不是空格来缩进行
    useTabs: false,
    // 是否缩进Vue文件中<script>和<style>标记内的代码。有些人（例如Vue的创建者）不缩进以保存缩进级别，但这可能会破坏编辑器中的代码折叠
    vueIndentScriptAndStyle: true
}
