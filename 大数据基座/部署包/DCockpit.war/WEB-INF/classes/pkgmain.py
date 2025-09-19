# -*- coding: utf-8 -*-
'''
Created on 2018年9月27日

@author: zjf
'''

import logging
import os
import sys
import json
import importlib
import base64

logger = logging.getLogger("pkgmain")


def loadcfg():
    rootpath = os.path.split(os.path.realpath(__file__))[0]
    with open(rootpath + '/packageinfo.json', encoding='UTF-8') as file_object:
        txt = file_object.read()
    return txt


def main(args): 
    logger.info("启动任务进程，收到命令:" + args[1])
    if len(args) == 1:
        print('参数不正确', flush=True)
        return
    if args[1] == "getPackageInfo":
        content = loadcfg()
        content = content.replace("\r\n", "").replace("\n", "").replace("\t", "")
        print(content, flush=True)
    elif args[1] == 'startStep':
        step = args[2]
        params = args[3]
        content = loadcfg()
        packageinfo = json.loads(content)
        if step not in packageinfo["packagInfo"] :
            print("该方法不在支持类中", flush=True)
            return
        # 参数解压
        arglst = bytes.decode(base64.b64decode(params))
        logger.info("command:" + args[2] + ",params:" + arglst)
        args = json.loads(arglst)


        # 动态加载相应包
        pakpath = packageinfo["packagInfo"][step]
        obj = importlib.import_module(pakpath[:pakpath.rfind(".")])
        fun = getattr(obj, pakpath[pakpath.rfind(".") + 1:])
        ret = fun(args)  # 调用相应函数
        print('---->'+ret, flush=True)


if __name__ == '__main__':
    LOG_FORMAT = "### %(asctime)s [%(levelname)s|%(name)s:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=LOG_FORMAT)
    main(sys.argv)
