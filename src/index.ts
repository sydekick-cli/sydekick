#!/usr/bin/env node
import { config } from "dotenv";
config();

import { Command } from "commander";
import { env } from "process";
import * as openai from "openai";
// @ts-ignore
import { getBrief } from "os-info";
import { SYSTEM_PROGRAMMING_PROMPT, SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE } from "./constants";

const program = new Command();

const openai_api_key = env.CHATGPT_API_KEY;
if (!openai_api_key) {
  console.error(
    "Please set the environment variable CHATGPT_API_KEY to your OpenAI API key."
  );
  process.exit(1);
}

const api = new openai.OpenAIApi(
  new openai.Configuration({ apiKey: openai_api_key })
);

program
  .version("0.1.0")
  .arguments("<objective>")
  .description("Assists with CLI commands using ChatGPT")
  .action(async (objective: string) => {
    // program gpt
    const chatHistory: openai.ChatCompletionRequestMessage[] = [
      {
        role: "system",
        content: SYSTEM_PROGRAMMING_PROMPT,
      },
    ];
    let programmingResponse: Awaited<
      ReturnType<typeof api.createChatCompletion>
    >;
    try {
      programmingResponse = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        n: 1, // Number of responses generated
      });
    } catch (error) {
      console.error("Error: ", error);
      process.exit(1);
    }

    // ensure the response is "yes"
    const programmingResponseContent =
    // @ts-ignore
      programmingResponse.data.choices[0].message.content;
    if (programmingResponseContent !== SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE) {
      console.error(
        `Expected response "${SYSTEM_PROGRAMMING_PROMPT_EXPECTED_RESPONSE}" but got "${programmingResponseContent}"`
      );
      process.exit(1);
    }
    // append the response to the chat history
    chatHistory.push({
      role: "system",
      content: programmingResponseContent
    });

    let additionalInfo = "";

    additionalInfo += `Operating System: ${getBrief().Platform}\n`;
    additionalInfo += `Present Working Directory: ${process.cwd()}\n`;

    chatHistory.push({
      role: "user",
      content: `This is my objective:\n${objective}\n\n${additionalInfo}Please reply in the format previously specified.`,
    });

    console.log("ChatGPT is generating commands to complete the objective...");

    let chatgptResponse: Awaited<ReturnType<typeof api.createChatCompletion>>;
    try {
      chatgptResponse = await api.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: chatHistory,
        n: 1, // Number of responses generated
      });
    } catch (error) {
      console.error("Error: ", error);
      process.exit(1);
    }

    let commands =
    // @ts-ignore
      chatgptResponse.data.choices[0].message.content.split("\n");

    // find the index of the header
    let headerIndex = -1;
    const header = "commands:";
    headerIndex = commands.findIndex((command: string) => {
      return command.toLowerCase().trim() === header;
    });
    if (headerIndex === -1) {
      console.error(`Unable to find header "${header}"`);
      console.log("ChatGPT response: ");
      console.log(JSON.stringify(chatgptResponse.data));
      process.exit(1);
    }
    commands = commands.slice(headerIndex + 1);
    console.log("Commands to execute:");
    commands.forEach((command: string) => {
      console.log(`    ${command}`);
    });
  });

program.parse(process.argv);
