import axios from 'axios'

const actions = {
    logIn(context, payload) {
        let url = '/login';
        let header = { 'Authorization': 'Basic ' + btoa(payload.username + ':' + payload.password) };
        axios.post(url, { value: payload.username }, { headers: header })
            .then(res => {
                if (res && res.data) {
                    context.commit('updateUser', res.data);
                    payload.$router.push(payload.returnUrl);
                }
            })
            .catch(
            err => {
                if (err.response.status === 401) {
                    context.commit('updateLastError', {
                        type: 'Login',
                        msg: 'Invalid username or password!'
                    });
                } else {
                    context.commit('updateLastError', {
                        type: 'Login',
                        msg: err
                    });
                }
                console.log(err);
            }
            );
    },

    logOut(context, payload) {
        let url = '/logout';
        axios.post(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateUser', {});
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'Logout',
                    msg: err
                });
                console.log(err)
            });
    },

    getUser(context, payload) {
        let url = '/user';
        axios.get(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateUser', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getUser',
                    msg: err
                });
                console.log(err)
            });
    },

    getUserFilesInfo(context, payload) {
        let url = '/api/file/list';
        axios.get(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateUserFilesInfo', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getUserFilesInfo',
                    msg: err
                });
                console.log(err)
            });
    },

    getUserFileById(context, payload) {
        let url = '/api/file/' + payload.id;
        axios.get(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateUserFileContent', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getUserFileById',
                    msg: err
                });
                console.log(err)
            });
    },

    getFeaturesByFileId(context, payload) {
        let url = '/api/features?fileId=' + payload.fileId;
        axios.get(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateFeatures', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getFeaturesByFileId',
                    msg: err
                });
                console.log(err)
            });
    },

    getStatisticTable(context, payload) {
        let url = '/api/statictable?fileId=' + payload.fileId;
        axios.get(url)
            .then(res => {
                if (res && res.data) {
                    context.commit('updateStatisticTable', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getStatisticTable',
                    msg: err
                });
                console.log(err)
            });
    },

    getCrossPlotData(context, payload) {
        let url = '/api/crossplot';
        axios.post(url, payload)
            .then(res => {
                if (res && res.data && res.data.in) {
                    context.commit('updateCrossPlotData', res.data.in);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getCrossPlotData',
                    msg: err
                });
                console.log(err)
            });
    },

    getHistogramData(context, payload) {
        let url = '/api/histogram';
        axios.post(url, payload)
            .then(res => {
                if (res && res.data && res.data.in) {
                    context.commit('updateHistogramData', res.data.in);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getHistogramData',
                    msg: err
                });
                console.log(err)
            });
    },

    getLearnData(context, payload) {
        let url = '/api/learning';
        axios.post(url, payload)
            .then(res => {
                if (res && res.data && res.data) {
                    context.commit('updateLearnData', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getLearnData',
                    msg: err
                });
                console.log(err)
            });
    },

    getClusterData(context, payload) {
        let url = '/api/cluster';
        axios.post(url, payload)
            .then(res => {
                if (res && res.data && res.data) {
                    context.commit('updateClusterData', res.data);
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'getClusterData',
                    msg: err
                });
                console.log(err)
            });
    },

    deleteUserFileById(context, payload) {
        let url = '/api/file/' + payload.id;
        axios.delete(url)
            .then(res => {
                if (res && res.data && res.data.isDeleted) {
                    context.dispatch('getUserFilesInfo');
                }
            })
            .catch(err => {
                context.commit('updateLastError', {
                    type: 'deleteUserFileById',
                    msg: err
                });
                console.log(err)
            });
    }
}

export default actions;
