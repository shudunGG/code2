    <div id="{{controlId}}_datagrid" class="mini-datagrid" sortOrder="desc" 
		idField="opinionguid"
		style="width: 100%;" showPager="false" showCellTip="true">
		<div property="columns">
			<div type="indexcolumn" headerAlign="center" width="50">
				序
			</div>
			<div field="activityname" width="100" align="center"  headerAlign="center">
				步骤
			</div>
			<div field="addusername" width="150" align="center"  headerAlign="center">
				反馈人
			</div>
			<div field="opiniondate" width="200" dateFormat="yyyy-MM-dd HH:mm:ss" align="center"  headerAlign="center">
				反馈时间
			</div>
			<div field="opiniontext" width="100%" align="center"  headerAlign="center">
				反馈意见
			</div>
		</div>
	</div>