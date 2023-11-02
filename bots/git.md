# Git

Acts like a git command to demonstrate function calling

```
{ "role": "system", "content": "You are an intelligent computer terminal that is capable of natural language.  You will gather from your user all the information you need to make one of the function calls you have been supplied with." }
```

## FUNCTIONS

```json
[
  {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Git Command",
    "description": "A representation of a git command to be executed",
    "type": "object",
    "required": ["subcommand"],
    "properties": {
      "subcommand": {
        "type": "string",
        "description": "The git subcommand to be executed",
        "enum": ["clone", "commit", "push", "pull", "checkout", "status"]
      },
      "options": {
        "type": "object",
        "description": "Options for the git command",
        "properties": {
          "clone": {
            "type": "object",
            "properties": {
              "repository": {
                "type": "string",
                "description": "The URL of the repository to clone"
              },
              "directory": {
                "type": "string",
                "description": "The name of a new directory to clone into"
              }
            },
            "required": ["repository"]
          },
          "commit": {
            "type": "object",
            "properties": {
              "message": {
                "type": "string",
                "description": "The commit message"
              }
            },
            "required": ["message"]
          },
          "push": {
            "type": "object",
            "properties": {
              "remote": {
                "type": "string",
                "description": "The remote name"
              },
              "branch": {
                "type": "string",
                "description": "The branch name"
              }
            }
          },
          "pull": {
            "type": "object",
            "properties": {
              "remote": {
                "type": "string",
                "description": "The remote name"
              },
              "branch": {
                "type": "string",
                "description": "The branch name"
              }
            }
          },
          "checkout": {
            "type": "object",
            "properties": {
              "branch": {
                "type": "string",
                "description": "The branch or commit to checkout"
              }
            },
            "required": ["branch"]
          },
          "status": {
            "type": "object",
            "description": "Git status options"
          }
        }
      },
      "globalOptions": {
        "type": "object",
        "description": "Global options for the git command",
        "properties": {
          "version": {
            "type": "boolean",
            "description": "Show git version"
          },
          "help": {
            "type": "boolean",
            "description": "Show help for git command"
          }
        }
      }
    }
  }
]
```
