import { colors, consola } from '@dag/node-utils';

import cac from 'cac';

import { version } from '../package.json';
import { defineCheckCircularCommand } from './check-circular';
import { defineDepcheckCommand } from './check-dep';
import { defineCodeWorkspaceCommand } from './code-workspace';
import { defineLintCommand } from './lint';
import { definePubLintCommand } from './publint';

// 命令描述
const COMMAND_DESCRIPTIONS = {
    'check-circular': 'Check for circular dependencies',
    'check-dep': 'Check for unused dependencies',
    'code-workspace': 'Manager VS Code workspace settings',
    lint: 'Run linting on the project',
    publint: 'Check package.json files for publishing standards',
} as const;

/**
 * 初始化配置并运行CLI
 */
async function main(): Promise<void> {
    try {
        const vsh = cac('vsh');

        // vsh lint
        defineLintCommand(vsh);
        // vsh publint
        definePubLintCommand(vsh);
        // vsh code-workspace
        defineCodeWorkspaceCommand(vsh);
        // vsh check-circular
        defineCheckCircularCommand(vsh);
        // vsh check-dep
        defineDepcheckCommand(vsh);

        // 处理无效命令
        vsh.on('command:*', ([cmd]) => {
            consola.error(
                colors.red(`Invalid command: ${cmd}`),
                '\n',
                colors.yellow('Available commands:'),
                '\n',
                Object.entries(COMMAND_DESCRIPTIONS)
                    .map(([cmd, desc]) => `  ${colors.cyan(cmd)} - ${desc}`)
                    .join('\n')
            );
            process.exit(1);
        });

        // 设置CLI
        vsh.usage('vsh <command> [options]');
        vsh.help();
        vsh.version(version);

        // 解析
        vsh.parse();
    } catch (error) {
        consola.error(
            colors.red('An unexpected error occurred:'),
            '\n',
            error instanceof Error ? error.message : error
        );
        process.exit(1);
    }
}

// 运行CLI
main().catch((error) => {
    consola.error(
        colors.red('Failed to start CLI:'),
        '\n',
        error instanceof Error ? error.message : error
    );
    process.exit(1);
});
