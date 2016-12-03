#!/usr/bin/python
#coding:utf-8

import time
import sys

def work(params):
    for i in range(0, 5):
        msg = ''
        if 'input1' in params:
            msg += params['input1']
        if 'input2' in params:
            if len(msg) > 0:
                msg += '\t'
            msg += params['input2']
        if 'label1' in params:
            if len(msg) > 0:
                msg += '\t'
            msg += params['label1']
        if 'input3' in params:
            if len(msg) > 0:
                msg += '\t'
            msg += params['input3']
        print msg
        sys.stdout.flush()
        time.sleep(1)
