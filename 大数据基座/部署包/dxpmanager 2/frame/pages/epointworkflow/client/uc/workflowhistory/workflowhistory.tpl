    <div id="{{controlId}}_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="workitemguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn" headerAlign="center" width="50">
				序
			</div>
			<div field="activityname" width="100" align="center"  headerAlign="center">
				步骤
			</div>
			<div field="username" width="100" align="center"  headerAlign="center">
				处理人员
			</div>
			<div field="operationname" width="100" align="center"  headerAlign="center">
				操作
			</div>
			<div field="createdate" width="150" dateFormat="yyyy-MM-dd HH:mm:ss" align="center"  headerAlign="center">
				收到时间
			</div>
			<div field="operatedate" width="150" dateFormat="yyyy-MM-dd HH:mm:ss" align="center"  headerAlign="center">
				处理时间
			</div>
			<div field="opinion" width="100%" align="center"  headerAlign="center">
				处理意见
			</div>
			<div field="sendusername" width="100" align="center"  headerAlign="center">
				提交人员
			</div>
		</div>
	</div>