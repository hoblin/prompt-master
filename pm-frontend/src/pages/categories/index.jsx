// List of categoriews cards
import React, { useEffect } from 'react';
import { List } from 'antd';

import CategoryCard from '../../components/category';

// import zustang store
import { useCategories, useFetchCategories } from './store';

const CategoriesPage = () => {
  const fetchCategories = useFetchCategories();
  const categories = useCategories();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <List
      grid={{
        gutter: 16,
        column: 4,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 4
      }}
      dataSource={categories}
      renderItem={(category) => (
        <List.Item>
          <CategoryCard category={category} />
        </List.Item>
      )}
    />
  );
};

export default CategoriesPage;