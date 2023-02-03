// Category card
import React from 'react';
import { Card, Image, Descriptions } from 'antd';

import theme from '../../theme';

const CategoryCard = ({ category }) => {
  const { name, image, tags_count, sets_count } = category;
  const url = `/api/${image}`;

  return (
    <Card cover={<Image src={url} />}>
      <Descriptions title={name} contentStyle={{ color: theme.token.colorPrimary }}>
        <Descriptions.Item label="Tags">{tags_count}</Descriptions.Item>
        <Descriptions.Item label="Sets">{sets_count}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
export default CategoryCard;
