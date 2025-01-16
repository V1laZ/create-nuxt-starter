#!/usr/bin/env node

const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');

const git = simpleGit();
const repoUrl = 'https://github.com/V1laZ/nuxt-project-starter.git';

const projectName = process.argv[2] || 'my-nuxt-app';
const projectPath = path.join(process.cwd(), projectName);

const execAsync = util.promisify(exec);
const rmAsync = util.promisify(fs.rm);

if (fs.existsSync(projectPath)) {
    console.error('\x1b[31m%s\x1b[0m', `Error: Directory ${projectName} already exists.`);
    process.exit(1);
}

const setup = async () => {
    try {
        console.log('\x1b[36m%s\x1b[0m', '⚡ Creating new Nuxt project...');
        await new Promise((resolve, reject) => {
            git.clone(repoUrl, projectPath, [], (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('\x1b[32m%s\x1b[0m', `✔ Successfully created ${projectName}`);

        console.log('\x1b[36m%s\x1b[0m', '⚡ Setting up Git repository...');
        process.chdir(projectPath);
        await rmAsync('.git', { recursive: true, force: true });
        
        await execAsync('git init');
        await execAsync('git add .');
        await execAsync('git commit -m "init"');
        console.log('\x1b[32m%s\x1b[0m', '✔ Initialized Git repository with initial commit');

        console.log('\x1b[36m%s\x1b[0m', '⚡ Installing dependencies...');
        await execAsync('pnpm install');
        console.log('\x1b[32m%s\x1b[0m', '✔ Dependencies installed successfully');

        console.log('\n\x1b[32m%s\x1b[0m', '🎉 Project setup complete!');
        console.log('\x1b[36m%s\x1b[0m', `\nRun your project:
   cd ${projectName}
   pnpm run dev\n`);
    } catch (error) {
        console.error('\x1b[31m%s\x1b[0m', 'Error:', error);
        process.exit(1);
    }
};

setup();