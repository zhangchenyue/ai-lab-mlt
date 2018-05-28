const mutations = {
    updateUser: (state, user) => {
        state.user = { ...user }
        return state.user;
    },
    updateUserFilesInfo: (state, filesInfo) => {
        state.filesInfo = [...filesInfo];
        return state.filesInfo;
    },

    updateFeatures: (state, features) => {
        state.features = [...features];
        return state.features;
    },

    updateUserFileContent: (state, fileContent) => {
        state.fileContent = [...fileContent];
        return state.fileContent;
    },
    updateLastError: (state, err) => {
        state.lastError = err ? { ...err } : { type: '', msg: '' };
        return state.lastError;
    },

    updateStatisticTable: (state, tableData) => {
        state.statisticTable = { ...tableData };
        return state.statisticTable;
    },

    updateCrossPlotData: (state, crossPlotData) => {
        state.crossPlotData = [...crossPlotData];
        return state.crossPlotData;
    },

    updateHistogramData: (state, histogramData) => {
        state.histogramData = [...histogramData];
        return state.histogramData;
    },

    updateLearnData: (state, learnData) => {
        state.learnData = learnData ? { ...learnData } : { ...state.learnData };
        return state.learnData;
    },

    updateClusterData: (state, clusterData) => {
        state.clusterData = clusterData ? { ...clusterData } : { ...state.clusterData };
        return state.clusterData;
    },

    updateCurrentSource: (state, currentSource) => {
        state.currentSource = { ...currentSource }
        return state.currentSource;
    }
}

export default mutations;
