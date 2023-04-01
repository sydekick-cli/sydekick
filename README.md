# ChatGPT CLI Sidekick

A Node.js command-line application that uses OpenAI's GPT-3 API to generate shell commands based on user objectives.

## Installation

1. Clone this repository
2. install dependencies with `npm install`
3. Rename `.env.example` to `.env` and add your OpenAI API key
4. Run `npm link` to install the CLI globally. You can now run `sidekick` from anywhere in your terminal.

## Usage

```shell
Usage: sidekick [options] [command]

Assists with CLI commands using ChatGPT

Options:
  -V, --version              output the version number
  -h, --help                 display help for command

Commands:
  list-commands <objective>  Lists commands to complete the objective
  explain <command>          Explains a command in plain english
  help [command]             display help for command
```

## License

This project is licensed under the MIT License.
