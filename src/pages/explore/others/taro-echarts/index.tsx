import Taro from '@tarojs/taro';
import * as echarts from 'echarts/core';
import {
  BarChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent
} from 'echarts/components';
import {Echarts, EchartsRenderer} from 'taro-charts'
import { useCallback, useEffect, useState } from 'react';

// register extensions
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    EchartsRenderer,
    // ...
    BarChart,
  ])
  
  const E_HEIGHT = 300;
  const E_WIDTH = 400;

export default function TaorEcharts({ option ={
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar',
      },
    ],
  } }) {
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