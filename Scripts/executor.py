#!/usr/bin/python
#coding:utf-8

import sys
import os
import json
import imp

def main():
    args = sys.argv
    if len(args) < 3:
        return

    execPath = args[1]
    if not os.path.isfile(execPath):
        return

    execArgs = args[2]
    jsonData = json.loads(execArgs)

    worker = imp.load_source('module.name', execPath)
    worker.work(jsonData)

if __name__ == "__main__":
    main()
