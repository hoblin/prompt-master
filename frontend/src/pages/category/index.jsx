// Category page with category card and tags list virtualized
import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useParams } from 'react-router-dom';
import { useResponsive, useUnmount } from 'ahooks';
import { FixedSizeList as VList } from 'react-window';
import { Row, Col, FloatButton } from 'antd';
// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';

import { getImageSize, getColumns } from '../../utils';

// import Category from './components/category';
import Tag from './components/tag';

// import Category and Tags stores
import {
  useCategory,
  useFetchCategory,
  useUnsetCategory,
  useTags,
  useFetchTags,
  useTagsStates,
  useUnsetTags,
  useSetTagImagesNames,
  useSlide,
} from './store';

const CategoryPage = (props) => {
  // VList size state
  const [vListSize, setVListSize] = useState(0);
  const tagBlockExtraHeight = 65 + 95 + 49 + 16; // header + (body - image size) + actions + margin
  const fetchCategory = useFetchCategory();
  const category = useCategory();

  const fetchTags = useFetchTags();
  const tags = useTags();
  const { tagImagesNames } = useTagsStates();
  const { slideLeft, slideRight } = useSlide();

  const vListRef = useRef(null);

  const { id } = useParams();

  useEffect(() => {
    fetchCategory(id);
  }, [fetchCategory, id]);

  useEffect(() => {
    fetchTags(category.id);
  }, [fetchTags, category.id]);

  // set tag images names for slider store when tags loaded
  const setTagImagesNames = useSetTagImagesNames();
  useEffect(() => {
    setTagImagesNames(tagImagesNames);
  }, [setTagImagesNames, tagImagesNames]);

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

  // Get screen height minus header
  const screenHeight = () => {
    const header = document.querySelector('.ant-layout-header');
    // if header is not found, set height to 0
    if (!header) return 0;
    const height = window.innerHeight - header.offsetHeight;
    return height;
  }

  // Set VList size on mount
  useEffect(() => {
    setVListSize(screenHeight());
  }, []);

  // Set VList size on resize
  useEffect(() => {
    const resizeHandler = () => {
      setVListSize(screenHeight());
    }
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    }
  }, []);

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

  const scrottTop = () => {
    vListRef.current.scrollTo(0);
  }

  return (
    <>
      {/* <Category category={category} isLoading={isCategoryLoading} key={`category-${id}`} /> */}
      <VList
        id="tags-list"
        height={screenHeight()}
        itemCount={tagsChunks.length}
        itemSize={tagHeight()}
        overscanCount={2}
        ref={vListRef}
      >
        {renderRow}
      </VList>
      <FloatButton.Group>
        <FloatButton
        type="primary"
        icon={<FontAwesomeIcon icon={faChevronUp} />}
        onClick={scrottTop}
        />
      </FloatButton.Group>
      {/* Global Slider buttons on the left */}
      <FloatButton
      type="primary"
      icon={<FontAwesomeIcon icon={faChevronLeft} />}
      onClick={slideLeft}
      style={{left: 8}}
    />
      <FloatButton
      type="primary"
      icon={<FontAwesomeIcon icon={faChevronRight} />}
      onClick={slideRight}
      style={{left: 58}}
    />
    </>
  );
}
export default CategoryPage;
