// Tag card with images carousel name and actin buttons

import React, { useMemo } from 'react';
import { Card, Image, Skeleton, Typography, Carousel } from 'antd';
import { useResponsive } from 'ahooks';

import { getImageSize, getColumns } from '../../../utils';

const Tag = ({ tag, category }) => {
  const { name, images } = tag;
  const { image_size } = category;
  const breakpoints = useResponsive();
  const columns = useMemo(() => getColumns(breakpoints), [breakpoints]);
  const imageSize = useMemo(() => getImageSize(image_size, columns), [image_size, columns]);

  // Title level based on columns
  const level = useMemo(() => {
    switch (columns) {
      case 1:
        return 3;
      case 2:
        return 4;
      case 4:
        return 5;
      default:
        return 5;
    }
  }, [columns]);

  const title = <Typography.Title level={level}>{name}</Typography.Title>;

  if (!name) {
    return (
      <Card>
        <Carousel>
          <Skeleton.Image active style={{ width: '100%', height: imageSize[1] }} />
        </Carousel>
      </Card>
    );
  }

  const ImagesCarousel = () => (
    <Carousel>
      {images.map((image) => (
        <Image
          src={`/api/${image.url}`}
          key={`tag-${tag.id}-image-${image.name}`}
          width={imageSize[0]}
          height={imageSize[1]}
          placeholder={true}
          preview={false}
        />
      ))}
    </Carousel>
  )

  return (
    <Card title={title}>
      <ImagesCarousel />
    </Card>
  );
}
export default Tag;
