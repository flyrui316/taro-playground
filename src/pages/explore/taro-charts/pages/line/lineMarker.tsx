import Taro,{setNavigationBarTitle} from '@tarojs/taro';
import * as echarts from 'echarts/core';
import {
    LineChart,
} from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent
} from 'echarts/components';
import {Echarts, EchartsRenderer} from 'taro-charts'
import { useCallback, useEffect, useMemo, useState } from 'react';

// register extensions
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
    EchartsRenderer,
    // ...
    LineChart,
  ])

  const {windowWidth} = Taro.getSystemInfoSync()
  const E_HEIGHT = 300;
  const E_WIDTH = windowWidth;

export default function TaorEcharts() {
    useEffect(() => {
        setNavigationBarTitle({ title: '未来一周气温变化' });
      }, []);

    const option = useMemo(()=>{
        return{
          title: {
            text: 'Temperature Change in the Coming Week'
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {},
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: { readOnly: false },
              magicType: { type: ['line', 'bar'] },
              restore: {},
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} °C'
            }
          },
          series: [
            {
              name: 'Highest',
              type: 'line',
              data: [10, 11, 13, 11, 12, 12, 9],
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              markLine: {
                data: [{ type: 'average', name: 'Avg' }]
              }
            },
            {
              name: 'Lowest',
              type: 'line',
              data: [1, -2, 2, 5, 3, 2, 0],
              markPoint: {
                data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
              },
              markLine: {
                data: [
                  { type: 'average', name: 'Avg' },
                  [
                    {
                      symbol: 'none',
                      x: '90%',
                      yAxis: 'max'
                    },
                    {
                      symbol: 'circle',
                      label: {
                        position: 'start',
                        formatter: 'Max'
                      },
                      type: 'max',
                      name: '最高点'
                    }
                  ]
                ]
              }
            }
          ]
        }
      },[])
    const [chart, setChart] = useState<echarts.ECharts>();

    useEffect(()=>{
      clickedCharts()
      return ()=> {
        if (process.env.TARO_ENV !== 'weapp') {
          chart?.dispose()
        }
      }
    },[chart])

    const clickedCharts = useCallback(()=>{
      chart?.on('click', function(params) {
        console.log(params)
    });
    },[chart])
    return <Echarts style={{flex: 1, height: E_HEIGHT, width: E_WIDTH }} onContextCreate={(canvas)=>{
          const charts = echarts.init(canvas, 'light', {
            renderer: 'svg',
            width: E_WIDTH,
            height: E_HEIGHT,
        });
        canvas.setChart?.(charts);
        charts.setOption(option);
        setChart(charts)
    }}
    />;
  }