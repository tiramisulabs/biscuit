# biscuit

## A brand new bleeding edge non bloated Discord library

<img align="right" src="https://raw.githubusercontent.com/oasisjs/biscuit/main/assets/icon.svg" alt="biscuit"/>

### Install (for [node18](https://nodejs.org/en/download/))

```sh-session
npm install @biscuitland/core
yarn add @biscuitland/core
```

for further reading join our [Discord](https://discord.gg/zmuvzzEFz2)

### Most importantly, biscuit is:

- A wrapper to interface the Discord API
- A bleeding edge library

Biscuit is primarily inspired by Discord.js and Discordeno but it does not include a cache layer by default, we believe
that you should not make software that does things it is not supposed to do.

### Why biscuit?:

- [Minimal](https://en.wikipedia.org/wiki/Unix_philosophy), non feature-rich!
- Scalable

### Example bot (TS/JS)

```js
import { Session, ChatInputApplicationCommandBuilder } from '@biscuitland/core';
import { GatewayIntents } from '@biscuitland/api-types';

const intents = GatewayIntents.Guilds;
const session = new Session({ token: 'your token', intents });

const commands = [ 
    new ChatInputApplicationCommandBuilder()
        .setName('ping')
        .setDescription('Replys with pong!')
        .toJSON(),
];

session.events.on('ready', async ({ user }) => {
    console.log('Logged in as:', user.username);
    await session.upsertApplicationCommands(commands);
});

session.events.on('interactionCreate', (interaction) => {
    if (interaction.isCommand()) {
        interaction.respond({
            with: { content: 'pong!'}
        });
    }
});

session.start();
```

### Known issues:
- node18 is required to run the library, however --experimental-fetch flag should work on node16+
- redis cache (wip)
- no optimal way to deliver a webspec bun version to the registry (#50)
