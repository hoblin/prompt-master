// Category name statistics and action buttons on top of category page

import { Card, Skeleton, Typography } from 'antd';

const Category = ({category, isLoading}) => {
  const { name } = category;

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
