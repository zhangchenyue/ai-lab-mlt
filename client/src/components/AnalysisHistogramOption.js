export default {
    animation: false,
    color: ['rgb(25, 183, 207)'],
    grid: {
        top: 20,
        left: 60,
        right: 10
    },
    xAxis: [{
        type: 'value',
        axisLabel: {
            rotate: -70,
            formatter: function (value, index) {
                if (index % 2 === 0) {
                    if (value.toString().length > 8) {
                        return value.toFixed(2)
                    }
                    return value
                }
            },
            fontSize: 10
        }
    }],
    yAxis: [{
        type: 'value'
    }],
    series: [{
        name: 'height',
        type: 'custom',
        encode: {
            x: [0, 1],
            y: 2,
            tooltip: 2,
            label: 2
        }
    }]
};
