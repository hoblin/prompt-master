// Category card
import React from 'react';
import { Card, Image, Descriptions, Skeleton } from 'antd';
import { Link, useNavigate } from 'react-router-dom';

import theme from '../../theme';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const { name, image, tags_count, sets_count } = category;
  const src = `/api/${image}`;

  const path = `/categories/${category.id}`;
  const title = <Link to={path} style={{ color: theme.token.colorPrimary }}>{name}</Link>;

  if (!name) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  const onClick = () => {
    navigate(path);
  };

  return (
    <Card cover={<Image src={src} preview={false} onClick={onClick} style={{ cursor: 'pointer' }} />}>
      <Descriptions
      title={title}
      contentStyle={{ color: theme.token.colorPrimary }}
      column={1}
      >
        <Descriptions.Item label="Tags">{tags_count}</Descriptions.Item>
        <Descriptions.Item label="Sets">{sets_count}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
export default CategoryCard;
