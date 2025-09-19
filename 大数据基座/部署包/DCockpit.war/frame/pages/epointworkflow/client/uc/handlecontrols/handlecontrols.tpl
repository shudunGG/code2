	<a id="handlecontrols_helper" class="mr10 fui-toolbar-helper hidden" onmouseover="ShowInfo(0)" onmouseleave="ShowInfo(1)">处理信息</a>
	
	<div id="handlecontrols_btnlock" class="btn-group hidden" style="float:left">
		<a class="mini-button" onclick="beforeUnlock();">解除锁定</a>
	</div>
	
	<div id ="handlecontrols_lockpart" style="float:left;">
		{{lockdttm}}
	</div>

	<div id="handlecontrols_btnlst" class="btn-group" style="float:left">
		
	</div>
	
	<div id ="handlecontrols_locklabel" style="float:left;">
		{{locklabel}}
	</div>
	
	<div id="handlecontrols_link" style="float:left;padding-left:30%">
			
	</div>

	<div id="handlecontrols_trackpart" class="btn-group r" style="float:right;">
		<div class="l mr10">
			当前处理步骤：<span class="text-special" style="margin-right:5px" id="handlecontrols_acthtml"></span>
		</div>
		<a class="mini-button" onclick="ShowFlowChart();">流程追踪</a>
	</div>
	
	<!-- 帮助信息区域 默认隐藏 -->
	<div class="fui-notice hidden" style="position:absolute;left:0;right:0;z-index:10;pointer-events:none;" id ="handlecontrols_helpinfo">
	 <div class="fui-notice-inner"></div>
	</div>
