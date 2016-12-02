#!/usr/bin/python
#coding:utf-8

import time
import sys

def work(params):
    for i in range(0, 100):
        print params['input1'] + ' ' + params['input2']
        sys.stdout.flush()
        time.sleep(1)
