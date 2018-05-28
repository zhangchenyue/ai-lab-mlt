const getters = {
    user: state => Object.keys(state.user).length ? state.user : null,
    lastError: state => state.lastError,
    filesInfo: state => state.filesInfo,
    features: state => state.features,
    fileContent: state => state.fileContent,
    statisticTable: state => state.statisticTable,
    crossPlotData: state => state.crossPlotData,
    histogramData: state => state.histogramData,
    learnData: state => state.learnData,
    clusterData: state => state.clusterData,
    currentSource: state => state.currentSource
}

export default getters;
