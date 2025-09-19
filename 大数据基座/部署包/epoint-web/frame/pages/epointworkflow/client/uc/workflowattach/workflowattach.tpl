    <div id="{{controlId}}_txt" style="width:100%;">
    	<input id="{{controlId}}_attachoutput" class="mini-outputtext" value="无附件信息！"/>
    </div>
    
    <div id="{{controlId}}_attachdatagrid" class="mini-datagrid" sortOrder="desc" 
		idField="materialguid"
		style="width: 100%;" showPager="false">
		<div property="columns">
			<div type="indexcolumn" align="left" width="50">
				序
			</div>
			<div field="materialname" width="100%">
				附件名称
			</div>
			<div field="mustsubmit" width="100">
				是否必须
			</div>
			<div field="submitstatus" width="100">
				状态
			</div>
			<div renderer="onAttachEdit" width="80">
				材料管理
			</div>
		</div>
	</div>