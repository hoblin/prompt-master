// Tag card with images carousel name and actin buttons
import React, { useMemo, useState } from 'react';
import { useResponsive } from 'ahooks';

import {
  Card,
  Image,
  Skeleton,
  Typography,
  Carousel,
  Rate,
  Tooltip,
  Dropdown,
  Button,
  Tag as AntTag,
  Space
} from 'antd';
// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faHeart as faHeartSolid,
  faEyeSlash as faEyeSlashSolid,
  faEllipsisH,
  faTrash,
  faCartArrowDown,
  faTags,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faEyeSlash as faEyeSlashRegular,
} from '@fortawesome/free-regular-svg-icons';

import { getImageSize, getColumns } from '../../../utils';
import { useUpdateTag, useTagImagesNames, useIndex } from '../store';

// theme
import theme from '../../../theme';
const {
    colorPrimary,
    colorTextQuaternary: colorQuaternary,
  } = theme.token;

const Tag = (props) => {
  const { tag, category } = props;
  const {
    name,
    images: tagImages,
    rank: rating,
    id,
    active,
    featured: favorite,
    matches,
  } = tag;
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

  // function to render name with fuse search matches highlighted
  const renderName = () => {
    // if no matches return name
    if (!matches) {
      return name;
    }
    // split name into array of characters
    const nameArray = name.split('');
    // loop through matches and replace characters with highlighted characters
    matches.forEach((match) => {
      const { indices } = match;
      // loop through indices and replace characters
      indices.forEach((index) => {
        var [start, end] = index;
        end += 1;
        // get characters to replace
        const characters = nameArray.slice(start, end);
        // replace characters
        nameArray.splice(start, end - start, (
          <span key={`tag-${id}-name-match-${start}-${end}`} style={{ color: colorQuaternary }}>
            {characters}
          </span>
        ));
      });
    });
    return nameArray;
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

  const title = () => (<Typography.Title level={level}>{renderName()}</Typography.Title>);

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
  }, [tagImagesNames, tagImages, imageSize, id, columns]);

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
          style={{ cursor: 'pointer', color: colorPrimary }}
        />
      </div>
    </Tooltip>
  );

  const FavoriteButton = () => {
    const icon = favorite ? faHeartSolid : faHeartRegular;
    const title = favorite ? 'Remove from favorites' : 'Add to favorites';
    const color = favorite ? colorQuaternary : colorPrimary;

    const onClick = () => {
      updateTag({ ...tag, featured: !favorite });
    };
    return (
      <Tooltip title={title} placement="bottom">
        <div>
          <FontAwesomeIcon
            icon={icon}
            onClick={onClick}
            style={{ cursor: 'pointer', color }}
          />
        </div>
      </Tooltip>
    );
  }

  const HideButton = () => {
    const icon = active ? faEyeSlashRegular : faEyeSlashSolid;
    const title = active ? 'Hide' : 'Show';
    const color = active ? colorPrimary : colorQuaternary;

    const onClick = () => {
      updateTag({ ...tag, active: !active });
    };
    return (
      <Tooltip title={title} placement="bottom">
        <div>
          <FontAwesomeIcon
            icon={icon}
            onClick={onClick}
            style={{ cursor: 'pointer', color }}
          />
        </div>
      </Tooltip>
    );
  }

  const SettingsButton = () => {
    const items = [
      {
        key: 'collect',
        label: (
          <Button type="text" block size="small" >
            Collect tag
          </Button>
        ),
        icon: <FontAwesomeIcon icon={faCartArrowDown} />,
      },
      {
        key: 'delete',
        label: (
          <Button type="text" block size="small" >
            Delete tag
          </Button>
        ),
        icon: <FontAwesomeIcon icon={faTrash} />,
        danger: true,
      },
      {
        key: 'add-tag',
        label: (
          <Button type="primary" block size="small" icon={<FontAwesomeIcon icon={faPlus} />} ghost>
            Add label
          </Button>
        ),
        icon: <FontAwesomeIcon icon={faTags} />,
      },
      {
        key: 'tags',
        label: (
          <Space wrap size={[0, 8]} style={{ maxWidth: 150 }}>
            <AntTag key="tag-1" color="red" closable>
              anime
            </AntTag>
            <AntTag key="tag-2" color="yellow" closable>
              photorealistic
            </AntTag>
            <AntTag key="tag-3" color="blue" closable>
              unstable
            </AntTag>
            <AntTag key="tag-4" color="green" closable>
              face
            </AntTag>
            <AntTag key="tag-5" color="purple" closable>
              eyes
            </AntTag>
          </Space>
        ),
      },
    ];

    return (
      <Dropdown
      menu={{items}}
      placement="right"
      >
        <div>
          <FontAwesomeIcon
            icon={faEllipsisH}
            style={{ cursor: 'pointer', color: colorPrimary }}
          />
        </div>
      </Dropdown>
    );
  }

  // Actions buttons collection
  const actions = [
    <CopyButton />,
    <FavoriteButton />,
    <HideButton />,
    // <SettingsButton />,
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
    title={title()}
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
