<div id="{{controlId}}-content" class="fui-content">
    <!-- 完成上传功能的上传控件 -->
    <span class="mini-webuploader" id="{{controlId}}-uploader"
        dnd="#{{controlId}}-drop-for-uploader" auto="false" limitNum="1"
        limitType="xls,xlsx" style="position: absolute; left: -10000px; opacity: 0;"></span>
    <!-- 文件上传 -->
    <div class="transform-content " id="{{controlId}}-transform-content">
        <!-- 拖拽容器以及点击上传按钮 -->
        <div class="transform-drop-container" id="{{controlId}}-drop-for-uploader">
            <span class="drop-icon"></span> <span class="drop-text">点击或拖拽上传文件</span>
            <ul class="drop-tips">
                <li>请下载模板并按照规范填写，仅支持 <span class="uploader-ext-info"></span>格式的文件
                </li>
                <li>导入信息会覆盖原有信息，如更新已有记录，请先导出已有信息</li>
            </ul>
            </span> <span class="file-remove action-icon icon-trash"></span>
        </div>
        <!-- 已选文件 -->
        <div class="transform-file-container" style="display: none;"></div>
        <span class="mini-button" iconCls="icon-download" id="{{controlId}}-tpl-download"
            state="default">点击下载文件模板</span>
    </div>
    <!-- 进度 -->
    <div class="transform-progress-container hidden-accessible">
        <div class="transform-progress-bar">
            <input type="text" id="{{controlId}}-progress-input" value="0" />
            <div class="transform-progress-text">
                <span class="transform-progress-curr"></span>
            </div>
        </div>
        <div>
            <p class="text">正在导入</p>
            <p class="tips">正在导入记录，请耐心等候</p>
        </div>
    </div>
    <!-- 结果区域 -->
    <div class="transform-result hidden-accessible">
        <div class="result-done">
            <span class="action-icon icon-success"></span>
            <div>
                <p class="text">导入成功</p>
                <p class="tips">
                </p>
            </div>
        </div>
        <div class="result-error">
            <div class="result-summary clearfix">
                <span class="action-icon icon-error l"></span>
                <div class="l error-text">
                    <p class="text">此次导入异常结果分析</p>
                    <p class="tips error"></p>
                </div>
                <div class="l error-text">
                    <p class="text">此次导入成功数据分析</p>
                    <p class="tips success"></p>
                </div>
            </div>
            
            <div class="result-detail" style="height: 600px">
                <div id="{{controlId}}-tabs" class="mini-tabs" style="height: 100%;">
                    
                </div>
            </div>
        </div>
    </div>
</div>
<div class="fui-toolbar bottom" id="{{controlId}}-toolbar">
    <span class="mini-button start-btn" state="primary" id="{{controlId}}-start-btn"  enabled="false">导入</span>
    <span class="mini-button reimport-btn" state="primary" id="{{controlId}}-reimport-btn" onclick="location.reload();">再次导入</span>
    <span class="mini-button close-btn" id="{{controlId}}-close-btn" onclick="epoint.closeDialog()">关闭窗口</span>
    <span class="mini-button download-btn" id="{{controlId}}-download-btn">下载出错记录</span>
</div>