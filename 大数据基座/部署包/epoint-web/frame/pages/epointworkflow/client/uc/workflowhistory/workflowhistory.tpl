    <div id="{{controlId}}_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="workitemguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn" width="40" align="left">
				序
			</div>
			<div field="activityname" width="100">
				步骤
			</div>
			<div field="username" width="100">
				处理人员
			</div>
			<div field="operationname" width="100">
				操作
			</div>
			<div field="createdate" width="150" dateFormat="yyyy-MM-dd HH:mm:ss">
				收到时间
			</div>
			<div field="operatedate" width="150" dateFormat="yyyy-MM-dd HH:mm:ss">
				处理时间
			</div>
			<div field="opinion" width="100%">
				处理意见
			</div>
			<div field="sendusername" width="100">
				提交人员
			</div>
		</div>
	</div>