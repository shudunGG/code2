(function(extControls) {
    var controlMap = FORM_DESIGN_CONFIG.controls;
    for (var ctrType in extControls) {
        if (!controlMap[ctrType]) {
            controlMap[ctrType] = extControls[ctrType];
        } else {
            console.error('Duplicated control type at [' + ctrType + '], the control type must be identify');
        }
    }
})({
    contentcontrol: {
        id: '', // 自动生成
        type: 'contentcontrol',
        // 可配置的属性
        configItems: [
            {
                category: '暂无配置'
            }
        ]
    },
    fwdzcontrol: {
        id: '', // 自动生成
        type: 'fwdzcontrol',
        jpdfawendz: '',
        jpdfawenyear: '',
        txtfilenumber: '',
        // 可配置的属性
        configItems: [
            {
                category: '输入设置',
                items: [
                    {
                        category: '暂无配置'
                    }
                ]
            }
        ]
    },
    opinioncontrol: {
        id: '', // 自动生成
        type: 'opinioncontrol',
        opinionname: '',
        // 可配置的属性
        configItems: [
            {
                category: '输入设置',
                items: [
                    {
                        label: '意见区块名',
                        controls: [
                            {
                                type: 'combobox',
                                associatedProp: 'opinionname',
                                url:''
                            }
                        ]
                    }
                ]
            }
        ]
    },swxlcontrol: {
        id: '', // 自动生成
        type: 'swxlcontrol',
        // 可配置的属性
        configItems: [
            {
                category: '暂无配置'
            }
        ]
    }
});
