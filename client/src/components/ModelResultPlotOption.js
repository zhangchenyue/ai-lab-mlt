export default {
    animation: false,
    tooltip: {
        trigger: 'axis'
    },
    grid: {
        top: 20,
        left: 100,
        bottom: 25
    },
    toolbox: {
        show: false,
        feature: {
            dataZoom: { show: true }
        }
    },
    dataZoom: [
        {
            type: 'inside',
            show: false,
            xAxisIndex: [0],
            start: 1,
            end: 100
        }
    ],
    legend: {
        top: 0,
        data: ['Predict', '']
    },
    xAxis: {
        type: 'category',
        boundaryGap: false
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: 'Predict',
            type: 'line'
        },
        {
            name: '',
            type: 'line'
        }
    ]
}
