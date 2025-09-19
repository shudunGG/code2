<div role="row" class="form-row">
	<label class="form-label required">标段(包)名称：</label>
	<div class="form-control span5">
	
		<input class="mini-textbox" style="width: 100%;" id="{{controlId}}_biaoduanname"
			required="true" requiredErrorText="标段(包)名称必填！" />
	
	</div>
</div>

<!-- TODO：根据singleBDBean.zhaobiaofangshi=='G' || singleBDBean.zhaobiaofangshi=='Q'控制显隐 -->
<div role="row" id="{{controlId}}_zhaobiaofangshi" style="display:none;" class="form-row">
	<label class="form-label required">标段(包)内容：</label>
	<div class="form-control span5">
	
		<input class="mini-textbox" style="width: 80%;" id="{{controlId}}_fabaocontent" required="true" />
		<a class="mini-button" iconCls="icon-addcircle" onclick="{{controlId}}_SelectBDtype()">挑选</a>
	
	</div>
</div>

<div role="row" class="form-row">
	<label class="form-label">交货：</label>
	<div class="form-control span2">
	
		<input class="mini-textbox" style="width: 80%;" id="{{controlId}}_jiaohuodate" />天
	
	</div>
	<label class="form-label"></label>
	<div class="form-control span2">
		
		<input class="mini-radiobuttonlist" textField="label" valueField="value" id="{{controlId}}_isusewebztb"
			data="[{label:'电子投标',value:'1'},{label:'传统纸质投标',value:'0'}]" />
	
	</div>
</div>
<div role="row" class="form-row">
	<label class="form-label">项目组成员：</label>
	<div class="form-control span5">
	
		<input class="mini-treeselect" style="width: 100%;" id="{{controlId}}_proteammember" multiSelect="true" />
	</div>
</div>
<div class="row" class="form-row" style="display: none">

	<input class="mini-textbox" id="{{controlId}}_bdthirdtype" />
	<input class="mini-textbox" id="{{controlId}}_newbdthirdty" />
		
</div>