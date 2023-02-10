// Tag card with images carousel name and actin buttons
import React, { useMemo, useState } from 'react';
import { useResponsive } from 'ahooks';

import { Card, Image, Skeleton, Typography, Carousel, Rate, Tooltip } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

import { getImageSize, getColumns } from '../../../utils';
import { useUpdateTag, useTagImagesNames, useIndex } from '../store';

const Tag = (props) => {
  const { tag, category } = props;
  const { name, images: tagImages, rank: rating, id } = tag;
  const { image_size } = category;
  const updateTag = useUpdateTag();
  const breakpoints = useResponsive();
  const columns = useMemo(() => getColumns(breakpoints), [breakpoints]);
  const imageSize = useMemo(() => getImageSize(image_size, columns), [image_size, columns]);
  const [previewVisible, setPreviewVisible] = useState(false);
  // copy tag name to clipboard
  const [copied, setCopied] = useState(false);
  const copyHandler = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  // Images sliding
  const tagImagesNames = useTagImagesNames();
  const globalIndex = useIndex();


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

  // Rating component
  const updateRating = (rating) => {
    updateTag({ ...tag, rank: rating });
  };

  // Images components for carousel built from global images names
  const images = useMemo(() => {
    return tagImagesNames.map((name) => {
      // find image in tag images by name
      const tagImage = tagImages.find((tagImage) => tagImage.name === name);
      const key = `tag-${id}-image-${name}`;
      const src = tagImage ? `/api/${tagImage.url}` : null;
      return (
        <swiper-slide key={key}>
          <Image
            src={src}
            width={imageSize[0]}
            height={imageSize[1]}
            placeholder={true}
            preview={false}
            onClick={() => columns > 1 && setPreviewVisible(true)}
          />
        </swiper-slide>
      )
    });
  }, [tagImagesNames, tagImages, imageSize, id]);

  const previewGroup = useMemo(() => {
    // disable preview group for mobile devices
    if (columns === 1) {
      return null;
    }
    return (
      <div style={{ display: 'none' }}>
        <Image.PreviewGroup
          preview={{
            visible: previewVisible,
            onVisibleChange: (vis) => setPreviewVisible(vis),
          }}
        >
          { tagImages.map((tagImage) => {
            const key = `tag-${id}-image-${tagImage.name}`;
            const src = tagImage ? `/api/${tagImage.url}` : null;
            return (
              <Image src={src} key={key} />
            )
          })}
        </Image.PreviewGroup>
      </div>
    )
  }, [tagImages, id, previewVisible, columns]);

  const CopyButton = () => (
    <Tooltip title={copied ? 'Copied' : 'Copy'} placement="bottom">
      <div>
        <FontAwesomeIcon
          icon={faCopy}
          onClick={copyHandler}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </Tooltip>
  );

  // Actions buttons collection
  const actions = [
    <CopyButton />,
    <EllipsisOutlined />,
    <SettingOutlined />,
  ];

  if (!name) {
    return (
      <Card>
        <Carousel>
          <Skeleton.Image active style={{ width: '100%', height: imageSize[1] }} />
        </Carousel>
      </Card>
    );
  }

  return (
    <Card
    title={title}
    actions={actions}
    style={{ textAlign: 'center' }}
    >
      <swiper-container
      loop="true"
      navigation="true"
      pagination="true"
      initial-slide={globalIndex}
      >
        {images}
      </swiper-container>
      {previewGroup}
      <Rate value={rating} onChange={updateRating} style={{ marginTop: 16 }} />
    </Card>
  );
}
export default Tag;
