#!/bin/sh

# 确保脚本抛出遇到的错误
set -e

currPath=`pwd`

echo $currPath

# 构建
yarn build
echo "build done";

# 更新
svn update D:/Code/EpointFrame/epoint-web-9.4/src/main/webapp/frame/pages/sformdesigner/
# 拷贝
# 先清空
rm -r -f D:/Code/EpointFrame/epoint-web-9.4/src/main/webapp/frame/pages/sformdesigner/assets/*
rm -r -f D:/Code/EpointFrame/epoint-web-9.4/src/main/webapp/frame/pages/sformdesigner/preset/*

cp -r -f dist/* D:/Code/EpointFrame/epoint-web-9.4/src/main/webapp/frame/pages/sformdesigner/

# 拷贝 readme 但是去掉 toc
echo "# 表单设计器" > t.md
grep "<\!-- \[toc end\] -->" -A 200000 README.md >> t.md # 提取标识之后的2万行 即之后的全部内容
grep -Ev "<\!-- \[toc end\] -->" t.md > D:/Code/EpointFrame/epoint-web-9.4/src/main/webapp/frame/pages/sformdesigner/joint.md # 排除标识之外的内容 另存为到svn仓库中
rm t.md
echo "copy done";

# 自动提交
# cd D:/EpointFrame/epoint-web-9.2.10-sform/pages/sformdesigner/
# svn add . 
# svn add . --no-ignore --force

# svn commit -m "[【来自自动脚本】提交更新表单设计器代码]"

# echo "commit success"