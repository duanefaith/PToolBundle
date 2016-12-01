#!/usr/bin/python
#coding:utf-8

def work(params):
    import time
    for i in range(0, 100):
        print params['input1'] + ' ' + params['input2']
        time.sleep(1)
