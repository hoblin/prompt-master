// Category name statistics and action buttons on top of category page

import { Card, Descriptions, Skeleton, Typography } from 'antd';

import theme from '../../../theme';

const Category = ({category, isLoading}) => {
  const { name, tags_count, sets_count } = category;

  const title = <Typography.Title level={1}>{name}</Typography.Title>;

  if (isLoading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  return (
      <Card title={title}>
      </Card>
  );
}

export default Category;
