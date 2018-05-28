<template>
    <div ref="dbLog" class="log">
        <data-tables-server :data="logTableData" :total="total" :table-props="tableProps" :search-def="searchDef" ref="dbLogTable" :load-data="loadData" v-loading="isContentLoading" element-loading-text="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.3)">
            <el-table-column prop="level" label="Level" width="100" sortable>
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level === 'INFO'" type="success" close-transition>{{scope.row.level}}</el-tag>
                    <el-tag v-if="scope.row.level === 'WARN'" type="warning" close-transition>{{scope.row.level}}</el-tag>
                    <el-tag v-if="scope.row.level === 'ERROR'" type="danger" close-transition>{{scope.row.level}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="user" label="user" width="150" sortable></el-table-column>
            <el-table-column prop="timestamp" label="Time" width="250" sortable></el-table-column>
            <el-table-column prop="method" label="Method" width="100" sortable></el-table-column>
            <el-table-column prop="statusCode" label="Status Code" width="180" sortable></el-table-column>
            <el-table-column prop="path" label="Path" sortable></el-table-column>
            <el-table-column fixed="right" label="Details" width="100">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.level === 'INFO'" type="success" @click="handleDetailClick(scope.row)" size="small">View</el-button>
                    <el-button v-if="scope.row.level === 'WARN'" type="warning" @click="handleDetailClick(scope.row)" size="small">View</el-button>
                    <el-button v-if="scope.row.level === 'ERROR'" type="danger" @click="handleDetailClick(scope.row)" size="small">View</el-button>
                </template>
            </el-table-column>
        </data-tables-server>
    </div>
</template>

<script>

import axios from 'axios'
export default {
    name: 'Log',
    data() {
        return {
            dbLogData: [],
            tableProps: {
                border: false,
                stripe: false,
                style: 'width: 100%',
                'max-height': '100%',
                defaultSort: {
                    prop: 'timestamp',
                    order: 'ascending'
                }
            },
            searchDef: {
                inputProps: {
                    placeholder: 'please search'
                },
                debounceTime: 1000
            },
            'pagination-def': {
                show: true,
                pageSize: 20,
                pageSizes: [20, 50, 100],
                currentPage: 1
            },
            isContentLoading: false,
            total: 0
        }
    },

    computed: {
        logTableData: function () {
            return this.dbLogData.map(it => {
                return {
                    'id': it._id,
                    'level': it.level.toUpperCase(),
                    'timestamp': it.timestamp,
                    'statusCode': it.meta.res ? it.meta.res.statusCode : 500,
                    'method': it.meta.req ? it.meta.req.method : '',
                    'path': it.meta.req ? it.meta.req.url : '',
                    'user': it.meta.user ? it.meta.user.toLowerCase() : 'anonymous'
                }
            });
        }
    },

    mounted: function () {
        this.tableProps['max-height'] = this.$refs.dbLog.clientHeight - 180;

        window.addEventListener('resize', () => {
            this.tableProps['max-height'] = this.$refs.dbLog.clientHeight - 180;
        })
    },

    methods: {
        handleDetailClick: function (row) {
            window.open(window.location.origin + '/dblog/' + row.id);
        },

        loadData: function (info) {
            this.isContentLoading = true;
            return axios.post('/dblog', info)
                .then(res => {
                    if (res && res.data) {
                        this.total = res.data.total || res.data.length;
                        this.dbLogData = res.data.pageLog || res.data;
                        this.isContentLoading = false;
                    }
                })
                .catch(err => {
                    this.isContentLoading = false;
                    this.$store.commit('updateLastError', {
                        type: 'DBLog',
                        msg: err
                    });
                });
        }
    }
}
</script>

<style lang="scss" scoped>
.log {
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
</style>
