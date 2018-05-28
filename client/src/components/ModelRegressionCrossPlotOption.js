export default {
    animation: false,
    grid: {
        top: 20,
        left: 100,
        bottom: 25
    },
    xAxis: {
        type: 'value',
        name: 'Real',
        nameGap: 5,
        splitLine: {
            lineStyle: {
                type: 'dashed'
            }
        }
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
    yAxis: {
        type: 'value',
        name: 'Predict',
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
        symbolSize: function () {
            return 10;
        },
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: true,
                position: 'left',
                textStyle: {
                    color: 'blue',
                    fontSize: 16
                }
            }
        }
    }]
}
