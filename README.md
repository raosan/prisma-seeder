oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g prisma-seeder
$ prisma-seeder COMMAND
running command...
$ prisma-seeder (--version)
prisma-seeder/0.0.0 darwin-x64 node-v16.16.0
$ prisma-seeder --help [COMMAND]
USAGE
  $ prisma-seeder COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`prisma-seeder hello PERSON`](#prisma-seeder-hello-person)
* [`prisma-seeder hello world`](#prisma-seeder-hello-world)
* [`prisma-seeder help [COMMAND]`](#prisma-seeder-help-command)
* [`prisma-seeder plugins`](#prisma-seeder-plugins)
* [`prisma-seeder plugins:install PLUGIN...`](#prisma-seeder-pluginsinstall-plugin)
* [`prisma-seeder plugins:inspect PLUGIN...`](#prisma-seeder-pluginsinspect-plugin)
* [`prisma-seeder plugins:install PLUGIN...`](#prisma-seeder-pluginsinstall-plugin-1)
* [`prisma-seeder plugins:link PLUGIN`](#prisma-seeder-pluginslink-plugin)
* [`prisma-seeder plugins:uninstall PLUGIN...`](#prisma-seeder-pluginsuninstall-plugin)
* [`prisma-seeder plugins:uninstall PLUGIN...`](#prisma-seeder-pluginsuninstall-plugin-1)
* [`prisma-seeder plugins:uninstall PLUGIN...`](#prisma-seeder-pluginsuninstall-plugin-2)
* [`prisma-seeder plugins update`](#prisma-seeder-plugins-update)

## `prisma-seeder hello PERSON`

Say hello

```
USAGE
  $ prisma-seeder hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/hyperjumptech/prisma-seeder/blob/v0.0.0/dist/commands/hello/index.ts)_

## `prisma-seeder hello world`

Say hello world

```
USAGE
  $ prisma-seeder hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ prisma-seeder hello world
  hello world! (./src/commands/hello/world.ts)
```

## `prisma-seeder help [COMMAND]`

Display help for prisma-seeder.

```
USAGE
  $ prisma-seeder help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for prisma-seeder.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `prisma-seeder plugins`

List installed plugins.

```
USAGE
  $ prisma-seeder plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ prisma-seeder plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.2/src/commands/plugins/index.ts)_

## `prisma-seeder plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ prisma-seeder plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ prisma-seeder plugins add

EXAMPLES
  $ prisma-seeder plugins:install myplugin 

  $ prisma-seeder plugins:install https://github.com/someuser/someplugin

  $ prisma-seeder plugins:install someuser/someplugin
```

## `prisma-seeder plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ prisma-seeder plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ prisma-seeder plugins:inspect myplugin
```

## `prisma-seeder plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ prisma-seeder plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ prisma-seeder plugins add

EXAMPLES
  $ prisma-seeder plugins:install myplugin 

  $ prisma-seeder plugins:install https://github.com/someuser/someplugin

  $ prisma-seeder plugins:install someuser/someplugin
```

## `prisma-seeder plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ prisma-seeder plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ prisma-seeder plugins:link myplugin
```

## `prisma-seeder plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ prisma-seeder plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ prisma-seeder plugins unlink
  $ prisma-seeder plugins remove
```

## `prisma-seeder plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ prisma-seeder plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ prisma-seeder plugins unlink
  $ prisma-seeder plugins remove
```

## `prisma-seeder plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ prisma-seeder plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ prisma-seeder plugins unlink
  $ prisma-seeder plugins remove
```

## `prisma-seeder plugins update`

Update installed plugins.

```
USAGE
  $ prisma-seeder plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
