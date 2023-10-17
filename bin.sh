#!/bin/sh
export NODE_NO_WARNINGS=1 
ls -l
pwd
npm bin
node --loader=import-jsx ./cli.js