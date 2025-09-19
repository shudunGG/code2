--此脚本为样例
select case count(1) when 0 then 0 else 1 end from dxp_exchange_type where rowguid = '6fef0d90-69c2-11ea-a305-005056900951';