export default {
    animation: false,
    grid: {
        top: 60,
        left: 60,
        right: 10
    },
    gradient: {
        0: 'rgba(0, 0, 255,1)',
        1.0: 'rgba(255, 0, 0,1)'
    },
    xAxis: {
        type: 'category',
        show: true,
        splitArea: {
            show: true
        },
        axisLabel: {
            interval: 0,
            rotate: -30
        }
    },
    yAxis: {
        type: 'category',
        show: true,
        splitArea: {
            show: true
        }
    },
    visualMap: {
        type: 'continuous',
        show: true,
        min: -1,
        max: 1,
        itemWidth: 15,
        itemHeight: 150,
        calculable: false,
        orient: 'horizontal',
        text: ['positive', 'negative'],
        left: 'center',
        bottom: 0,
        inRange: {
            color: ['rgba(75, 156, 211,1)', 'rgba(255, 255, 255,1)', 'rgba(255, 0, 0, 1)']
        }
    },
    series: [{
        name: 'Punch Card',
        type: 'heatmap',
        itemStyle: {
            emphasis: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
        }
    }]
}
