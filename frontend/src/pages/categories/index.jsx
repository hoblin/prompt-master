// List of categoriews cards
import React, { useEffect } from 'react';
import { List, Skeleton } from 'antd';

import CategoryCard from '../../components/category';

// import zustang store
import { useCategories, useFetchCategories, useCategoriesStates } from './store';

const CategoriesPage = () => {
  const fetchCategories = useFetchCategories();
  const categories = useCategories();
  const { isLoading } = useCategoriesStates();

  const listParams = {
    grid: {
      gutter: 16,
      column: 4,
      xs: 1,
      sm: 2,
      md: 4,
      lg: 4,
      xl: 4
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (isLoading) {
    return (
      <List {...listParams}
        dataSource={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
        renderItem={(i) => (
          <List.Item key={i}>
            <Skeleton.Image active />
            <Skeleton active />
          </List.Item>
        )}
      >
      </List>
    );
  }

  return (
    <List {...listParams}
      dataSource={categories}
      renderItem={(category) => (
        <List.Item key={category.id}>
          <CategoryCard category={category} />
        </List.Item>
      )}
    />
  );
};

export default CategoriesPage;