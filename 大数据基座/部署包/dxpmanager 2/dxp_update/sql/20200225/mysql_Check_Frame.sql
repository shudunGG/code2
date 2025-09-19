--此脚本为样例
select case count(1) when 0 then 0 else 1 end from dxp_exchange_type where rowguid = 'da02a0b6-e5b8-49c2-a893-f92675056bed'