export default {
    animation: false,
    toolbox: {
        show: false,
        feature: {
            dataZoom: { show: true }
        }
    },
    grid: {
        top: 20,
        left: 60,
        right: 10
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
    xAxis: {
        type: 'value',
        name: '',
        nameGap: 15,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    yAxis: {
        type: 'value',
        name: '',
        nameGap: 5,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
    },
    series: [{
        name: 'scatter',
        type: 'scatter',
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
        },
        large: false
    }]
}
