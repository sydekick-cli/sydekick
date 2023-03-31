# ChatGPT CLI Sidekick

A Node.js command-line application that uses OpenAI's GPT-3 API to generate shell commands based on user objectives.

## Installation

1. Clone this repository
2. install dependencies with `npm install`
3. Rename `.env.example` to `.env` and add your OpenAI API key
4. Run `npm link` to install the CLI globally. You can now run `sidekick` from anywhere in your terminal.

## Usage

```shell
Usage: sidekick [options] <objective>

Assists with CLI commands using ChatGPT

Options:
  -V, --version  output the version number
  -h, --help     display help for command
```

`<objective>` is a string that describes the user's objective. It may contain whitespace.

The program will prompt the user to provide a description of the steps required to achieve the objective. It will then generate shell commands using OpenAI's GPT-3 API and output them to the console.

If the GPT-3 API is unable to generate commands, the program will output "Sorry, I am not sure how to help with that." to the console.

## License

This project is licensed under the MIT License.
