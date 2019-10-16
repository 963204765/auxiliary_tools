#!/bin/bash

# 获取系统位数
getSystemBit(){
    # 系统位数
    if [ $(getconf LONG_BIT) == 64 ]
    then
        bit=x64
    else
        bit=ia32
    fi

    echo $bit
}

# 下载nwjs
install(){
    # 临时目录
    tmpDir=tmp
    if [ ! -d $tmpDir ];then
        mkdir $tmpDir;
    fi

    # 系统位数
    bit=$(getSystemBit)

    # build 目录
    buildPath=build/opt/AuxiliaryTools/app
    
    # 清空打包目录
    rm -rf $buildPath/*

    # 文件名
    fileName=nwjs-sdk-v0.38.0-linux-$bit

    # 下载地址
    url=https://npm.taobao.org/mirrors/nwjs/v0.38.0/$fileName.tar.gz
    
    # 下载
    wget -c -P $tmpDir $url
    
    # 解压
    tar -zxf $tmpDir/$fileName.tar.gz -C $tmpDir
    
    # 删除并保留中文
    ls $tmpDir/$fileName/locales/ -1 |awk '{print i$0}' i=`pwd`'/'$tmpDir/$fileName'/locales/' | grep -v zh | xargs rm -f

    # 合并nwjs
    mv -f $tmpDir/$fileName/* $buildPath
    rm -rf $tmpDir
    
    # 合并压缩源码
    zip -r $buildPath/package.nw css/ images/ js/ main.html package.json

    # 合并插件
    cp -r plugins/* $buildPath

    # 打包deb后安装
    dpkg -b build auxiliary_tools.deb
    dpkg -i ./auxiliary_tools.deb
    rm -rf ./auxiliary_tools.deb
}

install
