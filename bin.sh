#!/bin/sh
exec /usr/bin/env NODE_NO_WARNINGS=1 node --loader=import-jsx "$@"
