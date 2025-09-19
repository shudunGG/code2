Mock.mock(interface, function (options) {
    var data = Mock.mock({
        'list|12': [{
            'id': '@guid()',
            'url': '@url()',
            'src|1': ['dm.png', 'hbase.png', 'hdfs.png', 'hive.png', 'huawei.png', 'kafka.png', 'mongo.png', 'mysql.png', 'oracle.png', 'pgsql.png', 'sftp.png', 'sqlserver.png'],
            'sqlname': '@word(6,10)',
            'type': 'MYSQL',
            'user': 'admin',
            'sql': 'select * from select * fromselect * fromselect * fromselect * fromselect * from'
        }],
        'total': 100
    })

    return {
        'controls': [],
        'custom': data,
        'status': {
            'code': 200,
            'text': '',
            'url': ''
        }
    };
});