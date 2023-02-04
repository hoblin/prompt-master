// Category page with category card and tags list virtualized
import React, { useEffect, useRef, useMemo } from 'react';
import { Row, Col, List, Skeleton } from 'antd';
import { useParams } from 'react-router-dom';
import { useResponsive, useUnmount } from 'ahooks';
import { FixedSizeList as VList } from 'react-window';

import { getImageSize, getColumns } from '../../utils';

import Category from './components/category';
import Tag from './components/tag';

// import Category and Tags stores
import {
  useCategory,
  useFetchCategory,
  useCategoryStates,
  useUnsetCategory,
  useTags,
  useFetchTags,
  useTagsStates,
  useUnsetTags
} from './store';

const CategoryPage = () => {
  const tagBlockExtraHeight = 65 + 95 + 49 + 16; // header + (body - image size) + actions + margin
  const fetchCategory = useFetchCategory();
  const category = useCategory();
  const { isLoading: isCategoryLoading } = useCategoryStates();

  const fetchTags = useFetchTags();
  const tags = useTags();
  const { isLoading: isTagsLoading } = useTagsStates();

  const { id } = useParams();

  useEffect(() => {
    fetchCategory(id);
  }, [fetchCategory, id]);

  useEffect(() => {
    fetchTags(category.id);
  }, [fetchTags, category.id]);

  // On unmount, unset category and tags
  const unsetCategory = useUnsetCategory();
  const unsetTags = useUnsetTags();
  useUnmount(() => {
    unsetCategory();
    unsetTags();
  });

  // Set tag height based on screen size
  const breakpoints = useResponsive();

  const tagHeight = () => {
    // calculate tag card height based on image size plus title height
    const columns = getColumns(breakpoints);
    // if category is not loaded, set height to 500
    if (!category.image_size) return 500;
    const imageSize = getImageSize(category.image_size, columns);
    const height = imageSize[1] + tagBlockExtraHeight;

    return height;
  }

  // Get screen height minus header and footer
  const screenHeight = () => {
    const header = document.querySelector('.ant-layout-header');
    const footer = document.querySelector('.ant-layout-footer');
    // if header or footer is not found, set height to 0
    if (!header || !footer) return 0;
    const height = window.innerHeight - header.offsetHeight - footer.offsetHeight;
    return height;
  }

  // function to break tags into arrays
  const tagsChunks = useMemo(() => {
    const chunkSize = getColumns(breakpoints);
    const tagsChunks = [];
    for (let i = 0; i < tags.length; i += chunkSize) {
      tagsChunks.push(tags.slice(i, i + chunkSize));
    }
    return tagsChunks;
  }, [tags, breakpoints]);

  // function to render tags chunk as a row
  const renderRow = ({index, style}) => {
    const tags = tagsChunks[index];
    const span = 24 / tags.length;
    // Get window width minus scrollbar width
    return (
      <Row gutter={16} key={`tags-row-${index}`} style={{...style, marginLeft: 0}}>
        {tags.map((tag) => (
          <Col key={`row-${index}-tag-${tag.id}`} span={span}>
            <Tag tag={tag} category={category} />
          </Col>
        ))}
      </Row>
    );
  }

  return (
    <>
      {/* <Category category={category} isLoading={isCategoryLoading} key={`category-${id}`} /> */}
      <VList
        id="tags-list"
        height={screenHeight()}
        itemCount={tagsChunks.length}
        itemSize={tagHeight()}
      >
        {renderRow}
      </VList>
    </>
  );
}
export default CategoryPage;
