const router = require('koa-router')();
const Utils = require('../utils');
const Tips = require('../utils/tip');
const db = require('../db/index');
const fs = require('fs');
const asyncBusboy = require('async-busboy');


router.get('/api/users', async (ctx, next) => {
    let data = Utils.filter(ctx.request.query, ['pageSize', 'pageNum', 'note_id', 'type']), {uid} = ctx.state  || {};
    let res = Utils.formatData(data, [
        {key: 'note_id', type: 'number'}
    ]);
    if (! res) return ctx.body = Tips[1007];
    let filterData = {};
    for (let i in data) {
        filterData[i] = parseInt(data[i])
    }
    let {pageSize} = filterData;
    let  sql;
    sql = `select *  from  user`;
    await db.query(sql).then(async result => {
        let total = 0,content = [];
        if(result && result.length >0){
            total = result[0]['count(1)'];
            content = result;
        }
        ctx.body = {
            ...Tips[0],
            entity: {
                content,
                pageSize,
                total
            }
        };
        
    }).catch(e => {
        ctx.body = Tips[1002];
    })
});

module.exports = router
