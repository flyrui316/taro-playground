import Taro,{setNavigationBarTitle} from '@tarojs/taro';
import * as echarts from 'echarts/core';
import {
    LineChart,
} from 'echarts/charts';
import {
  GridComponent
} from 'echarts/components';
import {Echarts, EchartsRenderer} from 'taro-charts'
import { useCallback, useEffect, useMemo, useState } from 'react';

// register extensions
echarts.use([
  GridComponent,
    EchartsRenderer,
    // ...
    LineChart,
  ])

  const {windowWidth} = Taro.getSystemInfoSync()
  const E_HEIGHT = 300;
  const E_WIDTH = windowWidth;

export default function TaorEcharts() {
    useEffect(() => {
        setNavigationBarTitle({ title: '基础折线图' });
      }, []);

    const option = useMemo(()=>{
        return{
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
              },
              yAxis: {
                type: 'value'
              },
              series: [
                {
                  data: [150, 230, 224, 218, 135, 147, 260],
                  type: 'line'
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