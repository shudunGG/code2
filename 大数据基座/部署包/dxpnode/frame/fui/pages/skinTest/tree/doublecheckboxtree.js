var tree1 = mini.get('tree1');

var textBoxList1 = mini.get('textboxlist1');
var textBoxList2 = mini.get('textboxlist2');

// 已选人员的数据缓存 每个值为人员的id-text
var textBoxList1DataCache = [];
var textBoxList2DataCache = [];

/**
 * 在 textBoxList 中新增一个节点
 *
 * @param {Object} node 目标节点的key-vale键值对 格式为{id:id,value:value}
 * @param {Number} type 类型 值为1或2 标识是第几个选择框
 */
function addNode2List(node, type) {
    var aimCtr, aimCache;
    if (type == 1) {
        aimCtr = textBoxList1;
        aimCache = textBoxList1DataCache;
    } else {
        aimCtr = textBoxList2;
        aimCache = textBoxList2DataCache;
    }
    // 检查是否存在
    var isExisted = false;
    $.each(aimCache, function(i, item) {
        if (item.id == node.id) {
            isExisted = true;
            return false;
        }
    });
    // 存在则移除
    if (!isExisted) {
        aimCache.push(node);
        aimCtr.setValue(getKVStringFromArray('id', aimCache));
        aimCtr.setText(getKVStringFromArray('text', aimCache));
    }
    // 所有id相同的节点选择状态更新
    $.each(findNodesById(node.id), function(i, item) {
        item['ck' + type] = true;
    });
}

/**
 * 在 textBoxList 中移除一个节点
 *
 * @param {Object} node 目标节点的key-vale键值对 格式为{id:id,value:value}
 * @param {Number} type 类型 值为1或2 标识是第几个选择框
 */
function removeNodeFromList(node, type) {
    var aimCtr, aimCache;
    if (type == 1) {
        aimCtr = textBoxList1;
        aimCache = textBoxList1DataCache;
    } else {
        aimCtr = textBoxList2;
        aimCache = textBoxList2DataCache;
    }
    // 查找目标元素位置
    var aimIndex = -1;
    $.each(aimCache, function(i, item) {
        if (item.id == node.id) {
            aimIndex = i;
            return false;
        }
    });

    // 删除 并更新值
    if (aimIndex != -1) {
        aimCache.splice(aimIndex, 1);
        aimCtr.setValue(getKVStringFromArray('id', aimCache));
        aimCtr.setText(getKVStringFromArray('text', aimCache));
    }
    // 所有id相同的节点选择状态更新
    $.each(findNodesById(node.id), function(i, item) {
        item['ck' + type] = false;
    });
}

/**
 * 绘制树节点
 *
 * @param {Object} e 事件对象
 */
function drawTreeNode(e) {
    // checkbox 已选人员的value
    var selectValues1 = textBoxList1.getValue();
    var selectValues2 = textBoxList2.getValue();

    var node = e.node,
        nodeId = node[e.sender.getIdField()],
        nodeText = node[e.sender.getTextField()];

    // 节点是否选中取决于人员是否已选
    // var checked1 = (node.ck1 = node.ck1 || selectValues1.indexOf(nodeId) != -1),
    //     checked2 = (node.ck2 = node.ck2 || selectValues2.indexOf(nodeId) != -1);
    // 有的id是 guid 有的id直接是 1234 字符串indexOf 会误判
    var checked1 = (node.ck1 = node.ck1 || $.inArray(nodeId, selectValues1.split(',')) != -1),
        checked2 = (node.ck2 = node.ck2 || $.inArray(nodeId, selectValues2.split(',')) != -1);
    var ck1 = checked1 ? 'checked' : '',
        ck2 = checked2 ? 'checked' : '';

    var checkboxHtml = '<input class="tree-special-checkbox checkbox-select1" type="checkbox" ' + ck1 + ' onclick="onCheckboxClick(this, ' + node.isLeaf + ',' + e.sender.id + ')" data-id="' + nodeId + '" data-text="' + nodeText + '"/>' + '<input class="tree-special-checkbox checkbox-select2" type="checkbox" ' + ck2 + ' onclick="onCheckboxClick(this, ' + node.isLeaf + ',' + e.sender.id + ')" data-id="' + nodeId + '"  data-text="' + nodeText + '"/>';

    e.nodeHtml = checkboxHtml + e.cellHtml;
}
/**
 * 移除树中某个节点的选中状态
 *
 * @param {String} id 节点id
 * @param {Number} type 选框类型
 */
function uncheckedNodeFromTree(id, type) {
    var nodes = findNodesById(id, tree1);
    $.each(nodes, function(i, item) {
        item['ck' + type] = false;
    });
    dealTreeData();
}

/**
 * textboxlist 的条目点击删除事件
 *
 * @param {miniEventObject} e 事件对象
 */
function listBoxRemoveItem(e) {
    var id = e.item[e.sender.valueField];
    var type = e.sender.id == 'textboxlist1' ? 1 : 2;
    // 移除缓存数据
    removeNodeFromList(e.item, type);
    // 对树进行节点进行更新
    uncheckedNodeFromTree(id, type);
}

/**
 * 树上的双 checkbox 点击事件
 *
 * @param {HTMLElement} el 点击的 checkbox 元素
 * @param {Boolean} isLeaf 当前节点是否为子节点
 * @param {String} treeId 对应的树的id
 */
function onCheckboxClick(el, isLeaf, treeId) {
    var tree = mini.get(treeId);
    var $el = $(el),
        checked = $el.prop('checked'),
        id = $el.data('id'),
        text = $el.data('text');
    var type = $el.hasClass('checkbox-select1') ? 1 : 2;

    // 同步同名节点
    var nodes = findNodesById(id, tree);
    $.each(nodes, function(i, node) {
        node['ck' + type] = checked;
    });

    var thisNode = {
        id: id,
        text: text
    };

    // 子节点
    if (isLeaf) {
        if (checked) {
            // 添加到已选
            addNode2List(thisNode, type);
        } else {
            removeNodeFromList(thisNode, type);
        }
    } else {
        // 发请求获取所有子节点 需要所有叶子节点！！ 参数为父节点id
        // 响应数据格式 [{id:"子节点id",text:'子节点text'},{},....]
        Util.ajax({
            url: 'frame/fui/pages/themes/grace/skins/skins.json',
            data: {
                pid: id
            }
        }).done(function(data) {
            // 使用静态数据的模拟测试
            data = subMockData[id] || [];
            console.log(data);
            // end

            $.each(data, function(i, item) {
                if (checked) {
                    // 如果是选中 则加入所有子节点的value
                    addNode2List(item, type);
                } else {
                    // 否则在已选中移除所有子节点对应的
                    removeNodeFromList(item, type);
                }
                dealTreeData();
            });
        });
    }
    dealTreeData();
}

/**
 * 从树中查找符合条件的的节点 （由于兼职存在，节点id不唯一）
 * @param {String} id 节点id
 * @param {miniTreeControl} tree 树控件
 * @returns {Array} 所有节点集合
 */
function findNodesById(id, tree) {
    tree = tree || tree1;
    var idField = tree.getIdField();
    return (
        tree.findNodes(function(node) {
            return node[idField] == id;
        }) || []
    );
}
/**
 * 从textboxlistbox的缓存中获取id或者text
 *
 * @param {String} key 提取目标 id 或 text
 * @param {Array} arr 缓存数组
 * @returns {String} textboxlistbox需要的Vlaue或者text
 */
function getKVStringFromArray(key, arr) {
    var result = [];

    $.each(arr, function(i, item) {
        result.push(item[key]);
    });
    return result.join(',');
}

/**
 * 处理树节点子节点到父节点的联动效果
 */
function dealTreeData() {
    var data = tree1.getData();
    $.each(data, function(i, node) {
        dealNodeCheckedState(node);
    });
    tree1.doUpdate();

    function dealNodeCheckedState(node) {
        var isParent = node.children && node.children.length;
        if (isParent) {
            var ck1 = true,
                ck2 = true;
            $.each(node.children, function(i, node) {
                var res = dealNodeCheckedState(node);
                if (!res[0]) ck1 = false;
                if (!res[1]) ck2 = false;
            });
            node.ck1 = ck1 ? true : false;
            node.ck2 = ck2 ? true : false;
        }
        return [node.ck1, node.ck2];
    }
}
/**
 * 清空所有已选
 * @param {Number} type 清除哪一个的全选？ 1 表示第一个 2 表示第二个 不传则清空两个
 */
function clearAllSelected(type) {
    // 清除已选框
    // 清除缓存 并重新设值
    if (!type) {
        textBoxList1DataCache = [];
        textBoxList1.setValue('');
        textBoxList1.setText('');

        textBoxList2DataCache = [];
        textBoxList2.setValue('');
        textBoxList2.setText('');
    } else if (type == 1) {
        textBoxList1DataCache = [];
        textBoxList1.setValue('');
        textBoxList1.setText('');
    } else if (type == 2) {
        textBoxList2DataCache = [];
        textBoxList2.setValue('');
        textBoxList2.setText('');
    }
    // 同步树节点
    // 获取所有节点 处理选择状态为 false 更新树
    var nodes = tree1.findNodes(function() {
        return true;
    });
    $.each(nodes, function(i, node) {
        if (type == 1) {
            node.ck1 = false;
        } else if (type == 2) {
            node.ck2 = false;
        } else {
            node.ck1 = false;
            node.ck2 = false;
        }
    });
    tree1.doUpdate();
}
