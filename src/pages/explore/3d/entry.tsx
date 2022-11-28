import { Icon, ScrollView, Text, View } from '@tarojs/components';
import { navigateTo } from '@tarojs/taro';
import { useState } from 'react';
import './entry.scss';

/**
 * option
 *   tooltip
 *     formatter不支持
 *   toolbox
 *     feature
 *       saveAsImage不支持
 */

const prefix = 'pages/explore/3d/pages';
const routes = [
  {
    title: '六面体1',
    routes: [
      {
        title: '六面体1',
        url: `${prefix}/base/hexahedron`
        // state: true // 表示是否异常 true-有问题
      },
    ]
  },
  {
    title: '六面体2',
    routes: [
      {
        title: '六面体2',
        url: `${prefix}/base/hexahedron`
        // state: true // 表示是否异常 true-有问题
      },
    ]
  },
];

export default function Entry() {
  const [active, setActive] = useState(0);
  return (
    <View className="contain">
      <ScrollView className="contain-left">
        {routes.map((item, i) => (
          <Text
            key={item.title}
            onClick={() => setActive(i)}
            className={`contain-left__text${
              active === i ? ' contain-left__active' : ''
            }`}
          >
            {item.title}
          </Text>
        ))}
      </ScrollView>
      <ScrollView className="contain-right">
        {routes[active].routes.map(item => (
          <View
            key={item.title}
            className="contain-right__text"
            onClick={() => navigateTo({ url: item.url })}
          >
            <Text>{item.title} </Text>
            {item?.state ? <Icon size="14" type="warn" /> : null}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}