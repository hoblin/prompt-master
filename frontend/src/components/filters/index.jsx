// Filters and order component for header
// renders button for combined filtering and ordering UI

import React from 'react';
import {
  Button,
  Popover,
  Segmented,
  Space,
  Tooltip,
} from 'antd';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart as faHeartSolid,
  faEyeSlash as faEyeSlashSolid,
  faArrowDownAZ,
  faArrowUpZA,
  faArrowDown91,
  faArrowUp19,
  faFilter,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faEyeSlash as faEyeSlashRegular,
  faStar,
  faRectangleXmark as faXmark,
} from '@fortawesome/free-regular-svg-icons';

// store
import {
  useFilters,
  useOrder,
  useSetFilters,
  useSetOrderBy,
  useResetFilters,
} from '../../pages/category/store';

const Filters = () => {
  const filters = useFilters();
  const orderBy = useOrder();
  const setFilters = useSetFilters();
  const setOrderBy = useSetOrderBy();
  const resetFilters = useResetFilters();

  const setActiveFilter = (value) => {
    setFilters({ ...filters, active: value });
  };

  const setFavoriteFilter = (value) => {
    setFilters({ ...filters, favorite: value });
  };

  const setRatingFilter = (value) => {
    setFilters({ ...filters, rating: value });
  };

  const FiltersColumn = () => {
    return (
      <>
        <Space
        direction="vertical">
          <Space direction="horizontal">
            Filters
            <Button
              type="text"
              onClick={resetFilters}
              icon={<FontAwesomeIcon icon={faXmark} style={{ marginRight: 8 }} />}
            >
              Reset
            </Button>
          </Space>
          <Tooltip title="Filter by hidden status" mouseEnterDelay={1}>
            <Segmented
              block
              value={filters.active}
              onChange={setActiveFilter}
              options={[
                {
                  value: 'all',
                  icon:
                    <Space>
                      <FontAwesomeIcon icon={faEyeSlashRegular} />
                      <FontAwesomeIcon icon={faEyeSlashSolid} />
                    </Space>,
                },
                {
                  value: 'true',
                  icon: <FontAwesomeIcon icon={faEyeSlashRegular} />,
                },
                {
                  value: 'false',
                  icon: <FontAwesomeIcon icon={faEyeSlashSolid} />,
                },
              ]}
            />
          </Tooltip>
          <Tooltip title="Filter by favorite status" mouseEnterDelay={1}>
            <Segmented
              block
              value={filters.favorite}
              onChange={setFavoriteFilter}
              options={[
                {
                  value: 'all',
                  icon: <Space>
                  <FontAwesomeIcon icon={faHeartRegular} />
                  <FontAwesomeIcon icon={faHeartSolid} />
                  </Space>,
                },
                {
                  value: 'false',
                  icon: <FontAwesomeIcon icon={faHeartRegular} />,
                },
                {
                  value: 'true',
                  icon: <FontAwesomeIcon icon={faHeartSolid} />,
                },
              ]}
            />
          </Tooltip>
          <Tooltip title="Filter by rating" mouseEnterDelay={1}>
            <Segmented
              value={filters.rating}
              onChange={setRatingFilter}
              options={[
                {
                  label: '5',
                  icon: <FontAwesomeIcon icon={faStar} />,
                  value: '5'
                },
                {
                  label: 4,
                  icon: <FontAwesomeIcon icon={faStar} />,
                  value: '4'
                },
                {
                  label: 3,
                  icon: <FontAwesomeIcon icon={faStar} />,
                  value: '3'
                },
                {
                  label: 2,
                  icon: <FontAwesomeIcon icon={faStar} />,
                  value: '2'
                },
                {
                  label: 1,
                  icon: <FontAwesomeIcon icon={faStar} />,
                  value: '1'
                },
                { label: 'All', value: 'all' },
              ]}
              />
          </Tooltip>
        </Space>
      </>
    );
  }

  const OrderColumn = () => {
    return (
      <>
        <div>Order</div>
        <Tooltip title="Order by name or rating" mouseEnterDelay={1}>
        <Segmented
          // size="small"
          value={orderBy}
          onChange={setOrderBy}
          options={[
            {
              icon: <FontAwesomeIcon icon={faArrowDownAZ} />,
              value: 'name_asc',
            },
            {
              icon: <FontAwesomeIcon icon={faArrowUpZA} />,
              value: 'name_desc',
            },
            {
              icon: <FontAwesomeIcon icon={faArrowDown91} />,
              value: 'rating_asc',
            },
            {
              icon: <FontAwesomeIcon icon={faArrowUp19} />,
              value: 'rating_desc',
            },
          ]}
        />
        </Tooltip>
      </>
    );
  }

  const Content = () => {
    return (
      <>
        <FiltersColumn />
        <OrderColumn />
      </>
    );
  }

  return (
    <Popover
      content={<Content />}
      title="Filters & Order"
      >
      <Button
      type="text"
      icon={<FontAwesomeIcon icon={faFilter}  style={{ marginRight: 8}}/>}
      >
        Filters
      </Button>
    </Popover>
  );
}

export default Filters;