-- 如需手工在PL/SQL中执行，把语句拷贝到查询设计器，然后将下一行BEGIN和最后一行的END;前的注释去除即可 
-- BEGIN 

-- 2018/07/18
-- 修改索引为唯一索引--王颜
  begin
    declare
      isexist number;
    begin
      begin
        select count(1)
          into isexist
          from ((select *
                   from user_ind_columns
                  where table_name = upper('frame_user_secondou')
                    and column_name = upper('USERGUID')) union
                (select *
                   from user_ind_columns
                  where table_name = upper('frame_user_secondou')
                    and column_name = upper('OUGUID')));
        if (isexist = 0) then
          execute immediate 'create Unique index UQ_FRAME_USER_SECONDOU on frame_user_secondou(USERGUID, OUGUID)';
        else
          begin
            declare
              p_select      varchar2(1000);
              index_name    varchar2(100);
            
              Cursor v_cursor is
                select *
                  from (select distinct (index_name)
                          from ((select *
                                   from user_ind_columns
                                  where table_name =
                                        upper('frame_user_secondou')
                                    and column_name = upper('USERGUID'))
                                union
                                (select *
                                   from user_ind_columns
                                  where table_name =
                                        upper('frame_user_secondou')
                                    and column_name = upper('OUGUID'))));
            
            begin
              for index_name in v_cursor loop
              
                p_select := 'drop index ' || index_name.index_name;
                execute immediate p_select;
              
              end loop;
            end;
          end;
        
          execute immediate 'create Unique index UQ_FRAME_USER_SECONDOU on frame_user_secondou(USERGUID, OUGUID)';
        
        end if;
      end;
    end;
  end;
  /* GO */

  begin
    declare
      isexist number;
    begin
      declare
        isexist2 number;
      begin
        select count(1)
          into isexist
          from ((select *
                   from user_ind_columns
                  where table_name = upper('frame_userrolerelation')
                    and column_name = upper('roleguid')) union
                (select *
                   from user_ind_columns
                  where table_name = upper('frame_userrolerelation')
                    and column_name = upper('USERGUID')));
        if (isexist = 0) then
          execute immediate 'create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID)';
        else
          begin
            declare
              p_select      varchar2(1000);
              index_name    varchar2(100);
            
              Cursor v_cursor is
                select *
                  from (select distinct (index_name)
                          from ((select *
                                   from user_ind_columns
                                  where table_name =
                                        upper('frame_userrolerelation')
                                    and column_name = upper('roleguid'))
                                union
                                (select *
                                   from user_ind_columns
                                  where table_name =
                                        upper('frame_userrolerelation')
                                    and column_name = upper('USERGUID'))));
            
            begin
              for index_name in v_cursor loop
              
                p_select := 'drop index ' || index_name.index_name;
                execute immediate p_select;
              
              end loop;
            end;
          end;
        
          execute immediate 'create Unique index uq_frame_userrolerelation on frame_userrolerelation(USERGUID, ROLEGUID)';
        
        end if;
      end;
    end;
  end;
/* GO */

-- end;


