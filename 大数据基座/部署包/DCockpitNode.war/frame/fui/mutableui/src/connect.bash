#!/bin/sh
echo "开始合并框架样式文件"
# 覆盖文件
echo "// 此文件由合并 frame/*.less 生成" > frame.less

# 合并 框架 部分
echo "// =============================" >> frame.less
echo "// 框架样式部分" >> frame.less

cat frame/*.less >> frame.less

echo "" >> frame.less
echo "// =============================" >> frame.less
echo "框架样式文件合并完成"

# 合并 miniui 部分
echo "开始合并miniui样式文件"
echo "// 此文件由合并 miniui/*.less 生成" > miniui.less
echo "// miniui 样式部分" >> miniui.less

cat miniui/*.less >> miniui.less

echo "miniui样式文件合并完成"

# 整合
cat rules.less frame.less miniui.less > skin-clear.less;
cat delcar.less skin-clear.less > skin.less