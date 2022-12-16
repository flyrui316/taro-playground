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
import {Echarts, EchartsRenderer} from 'taro-echarts/build/main'
import { useEffect, useRef, useState } from 'react';

// register extensions
echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    EchartsRenderer,
    // ...
    BarChart,
  ])
  
  const E_HEIGHT = 250;
  const E_WIDTH = 300;

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
    const ref = useRef<any>(null);
    const [chart, setChart] = useState<echarts.ECharts>();
    // useEffect(() => {
    //   let chart: any;
    //   if (ref.current) {
    //     // @ts-ignore
    //     chart = echarts.init(ref.current, 'light', {
    //       renderer: 'svg',
    //       width: E_WIDTH,
    //       height: E_HEIGHT,
    //     });
    //     chart.setOption(option);
    //   }
    //   return () => chart?.dispose();
    // }, [option]);
    useEffect(()=>{
      return ()=> chart?.dispose();
    },[chart])
    return <Echarts style={{flex: 1, height: 300, width: 300 }} onContextCreate={(canvas)=>{
          const charts = echarts.init(canvas, 'light', {
            renderer: 'svg',
            width: E_WIDTH,
            height: E_HEIGHT,
        });
        charts.setOption(option);
        setChart(charts)
    }}
    />;
  }