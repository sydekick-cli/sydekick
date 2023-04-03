# ChatGPT CLI Sidekick
## Installation

1. Clone this repository
2. install dependencies with `npm install`
3. Run `npm link` to install the CLI globally. You can now run `sidekick` from anywhere in your terminal.
4. Sign in to sidekick using one of your [OpenAI API Keys](https://platform.openai.com/account/api-keys): `sidekick sign-in`

## Usage

```shell
Usage: sidekick [options] [command]

Assists with CLI commands using ChatGPT

Options:
  -V, --version                              output the version number
  -h, --help                                 display help for command

Commands:
  chat [options] [previous-subject]          Start or continue a conversation with Sidekick
  explain <command>                          Explains a command in plain english
  gen-code [options] <objective> [destfile]  Generates code to complete the objective. If destfile is not specified, code is printed to stdout
  gen-image [options] <prompt> [destfile]    Generates an image to complete the prompt. If destfile is not specified then you will be prompted for the name.
  list-commands [options] <objective>        Lists commands to complete the objective
  sign-in                                    Sign in to OpenAI with your API key
  sign-out                                   Sign out of OpenAI and remove the API key from your keychain
  help [command]                             display help for command
```

## What can sidekick do?

It can help you determine which commands you need to run in order to achieve some result:
```shell
sidekick list-commands "copy ./results/*-result.xml to /some/dir/ on host home.lan"
Waking up sidekick...
Let me think...
Okay, here's how you could 'copy ./results/*-result.xml to /some/dir/ on host home.lan':

    # step 1
    # copy all "-result.xml" files found in ./results directory to /some/dir/
    scp ./results/*-result.xml <username>@home.lan:/some/dir/
    # replace <username> with the ssh username you have on home.lan
    
    ###############################################
    # notes:
    ###############################################
    #   It's possible to use rsync instead of scp in order to synchronize directories.
    #   Rsync is more advanced and powerful, but also more involved. Here is the command:
    #   rsync -rav ./results/*-result.xml <username>@home.lan:/some/dir/
    #   Remember to replace <username> with the ssh username you have on home.lan.
    
    ###############################################
    # sources:
    ###############################################
    #   https://linuxize.com/post/how-to-use-scp-command-to-securely-transfer-files/
    #   https://www.cyberciti.biz/faq/linux-unix-osx-bsd-rsync-copy-hard-links/
Would you like to execute the commands? (y/n) n
```

```shell
sidekick list-commands "install docker"
Waking up sidekick...
Let me think...
Okay, here's how you could 'install docker':

    # step 1
    # update apt package index
    sudo apt update
    
    # step 2
    # Install prerequisites for docker-ce
    sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
    
    # step 3
    # Add Docker's official GPG key
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    
    # step 4
    # Add Docker to apt repository
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    
    # step 5
    # update package index again
    sudo apt update
    
    # step 6
    # Install Docker CE
    sudo apt install docker-ce
    
    # step 7
    # Verify Docker is installed and running correctly
    sudo docker run hello-world
    
    ###############################################
    # notes:
    ###############################################
    # Docker is installed as rootless in this installation. If you need to run Docker as a non-root user, 
    # you'll need to follow additional instructions on Docker's documentation 
    # at https://docs.docker.com/engine/security/rootless/
    
    ###############################################
    # sources:
    ###############################################
    # https://docs.docker.com/engine/install/ubuntu/
    # https://docs.docker.com/engine/security/rootless/
Would you like to execute the commands? (y/n) n
```

You can also let sidekick execute the commands if you are feeling risky!

It can explain any shell command you provide:
```shell
08:53:41 seth@canvas gen-code ±|feat/gen-code|→ sidekick explain "find / -type f -name "*.txt" -exec grep -l "example" {} \; | xargs tar -czvf example_files.tar.gz"
Waking up sidekick...
Let me think...
This command first uses the `find` command to search the entire system (`/`) for files that end with `.txt` (`-name *.txt`) 
and outputs them to `grep`. The `grep` command searches each of those files for the string "example" (`-l example`)
and displays only the filenames that contain the string.

These filenames are then passed to `xargs`, which combines them into a single argument to be used by the `tar` command. 
The `tar` command then compresses the listed files into a single gzip archive named `example_files.tar.gz`.

Therefore, this command creates a compressed archive file containing all files in the system that end with `.txt` 
and contain the string "example". It is likely that this would take some time due to the potentially large number
of files, but it can vary based on the system being used.

Sources:
- https://linux.die.net/man/1/find
- https://linux.die.net/man/1/grep
- https://linux.die.net/man/1/xargs
- https://linux.die.net/man/1/tar
```
(Be sure to verify the sources that sidekick responds with)

It can also generate and edit code files (this is a WIP):
```shell
sidekick gen-code "Write a tic-tac-toe game for the browser" -l javascript
Waking up sidekick...
Let me think...
Understood. Here is the solution:

New files:
# index.html
\```
<!DOCTYPE html>
<html>
<head>
<title>Tic Tac Toe</title>
<style>
table, td {
  border: 1px solid black;
  border-collapse: collapse;
  width: 100px;
  height: 100px;
  text-align: center;
  vertical-align: middle;
  font-size: xx-large;
}
</style>
</head>
<body>
<table>
  <tr>
    <td id="cell00"></td>
    <td id="cell01"></td>
    <td id="cell02"></td>
  </tr>
  <tr>
    <td id="cell10"></td>
    <td id="cell11"></td>
    <td id="cell12"></td>
  </tr>
  <tr>
    <td id="cell20"></td>
    <td id="cell21"></td>
    <td id="cell22"></td>
  </tr>
</table>
<script src="ticTacToe.js"></script>
</body>
</html>
\```

# ticTacToe.js
\```
const board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let player = 'X';
let gameOver = false;

/**
 * Initializes the board and assigns click event listeners for each cell in the table.
 * Updates the text of the cell and checks for a winner when clicked.
 */
function init() {
    const cells = document.getElementsByTagName('td');
    Array.from(cells).forEach((cell) => {
        cell.style.cursor = 'pointer';
        cell.addEventListener('click', () => {
            if (!gameOver && cell.textContent === '' && player !== '') {
                const row = parseInt(cell.id[4]);
                const col = parseInt(cell.id[5]);
                board[row][col] = player;
                cell.textContent = player;
                const winner = checkWinner();
                if (winner !== '') {
                    gameOver = true;
                    alert(`${winner} wins!`);
                } else if (checkTie()) {
                    gameOver = true;
                    alert('Tie!');
                } else {
                    player = player === 'X' ? 'O' : 'X';
                }
            }
        });
    });
}

/**
 * Checks for a winner on the current board state.
 * @returns {string} Either 'X' or 'O' if a winner is found, or an empty string otherwise.
 */
function checkWinner() {
    // check rows
    for (let row = 0; row < 3; row++) {
        if (board[row][0] === board[row][1] && board[row][1] === board[row][2] && board[row][0] !== '') {
            return board[row][0];
        }
    }
    // check cols
    for (let col = 0; col < 3; col++) {
        if (board[0][col] === board[1][col] && board[1][col] === board[2][col] && board[0][col] !== '') {
            return board[0][col];
        }
    }
    // check diagonals
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
        return board[0][0];
    }
    if (board[2][0] === board[1][1] && board[1][1] === board[0][2] && board[2][0] !== '') {
        return board[2][0];
    }
    return '';
}

/**
 * Checks if the board is in a tie state.
 * @returns {boolean} true if the board is in a tie state, false otherwise.
 */
function checkTie() {
    return board.every((row) => {
        return row.every((cell) => {
            return cell !== '';
        });
    });
}

init();
\```

Commands to run:
\```
# Open index.html in a web browser to launch the game
\```

Notes:
This code creates an HTML table where each cell represents a square on the tic-tac-toe board. When the user clicks on an empty cell, it places an X or O (depending on whose turn it is) and updates the internal board array. It then checks for a winner (or tie) and updates the game state accordingly. If a winner is found, the game is over and an alert is displayed with the name of the winner. If a tie is found, the game is over and an alert is displayed with "Tie!".
```

## License

This project is licensed under the MIT License.
