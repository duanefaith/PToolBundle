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
    print execArgs
    jsonData = json.loads(execArgs)

    # worker = imp.load_source('module_name', execPath)
    # worker.work(jsonData)
    import time
    for i in range(0, 100):
        print jsonData['input1'] + ' ' + jsonData['input2']
        time.sleep(1)

if __name__ == "__main__":
    main()
