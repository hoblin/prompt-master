// Tag card with images carousel name and actin buttons
import React, { useMemo, useState, useEffect } from 'react';
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
  Space,
  Popconfirm
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
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faEyeSlash as faEyeSlashRegular,
  faCheckCircle as faCheckCircleRegular,
} from '@fortawesome/free-regular-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { getImageSize, getColumns } from '../../../utils';
import {
  useUpdateTag,
  useDeleteTag,
  useTagImagesNames,
  useIndex,
  useSelectedTags,
  useSelectTag
} from '../store';

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
  const deleteTag = useDeleteTag();
  const breakpoints = useResponsive();
  const columns = useMemo(() => getColumns(breakpoints), [breakpoints]);
  const imageSize = useMemo(() => getImageSize(image_size, columns), [image_size, columns]);
  const [previewVisible, setPreviewVisible] = useState(false);

  const selectTag = useSelectTag();
  const selectedTags = useSelectedTags();
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    const isSelected = selectedTags.find((selectedTag) => selectedTag.id === id);
    if (isSelected && !selected) {
      setSelected(true);
    } else if (!isSelected && selected) {
      setSelected(false);
    }
  }, [selectedTags, id]);

  // copy tag name to clipboard
  const [copied, setCopied] = useState(false);
  const copyHandler = () => {
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

  const title = () => (
    <Tooltip title={name} placement="bottom">
      <Typography.Title level={level}>{renderName()}</Typography.Title>
    </Tooltip>);

  // Rating component
  const updateRating = (rating) => {
    updateTag({ ...tag, rank: rating });
  };

  const deleteTagHandler = () => {
    deleteTag({ id });
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
    <CopyToClipboard text={name} onCopy={copyHandler}>
      <Tooltip title={copied ? 'Copied' : 'Copy'} placement="bottom">
        <div>
          <FontAwesomeIcon
            icon={faCopy}
            style={{ cursor: 'pointer', color: colorPrimary }}
          />
        </div>
      </Tooltip>
    </CopyToClipboard>
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

  const hideHandler = () => {
    updateTag({ ...tag, active: !active });
  };

  const HideButton = () => {
    const icon = active ? faEyeSlashRegular : faEyeSlashSolid;
    const title = active ? 'Hide' : 'Show';
    const color = active ? colorPrimary : colorQuaternary;

    return (
      <Tooltip title={title} placement="bottom">
        <div>
          <FontAwesomeIcon
            icon={icon}
            style={{ cursor: 'pointer', color }}
          />
        </div>
      </Tooltip>
    );
  }

  const SelectButton = () => {
    const icon = selected ? faCheckCircle : faCheckCircleRegular;
    const title = selected ? 'Deselect' : 'Select';
    const color = selected ? colorQuaternary : colorPrimary;

    const onClick = () => {
      selectTag(tag);
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
      // {
      //   key: 'collect',
      //   label: (
      //     <Button type="text" block size="small" >
      //       Collect tag
      //     </Button>
      //   ),
      //   icon: <FontAwesomeIcon icon={faCartArrowDown} />,
      // },
      {
        key: 'delete',
        label: (
          <Popconfirm
            title="Are you sure you want to delete this tag?"
            description="All tag images would be deleted. This action cannot be undone."
            onConfirm={deleteTagHandler}
            okText="Delete"
            cancelText="Cancel"
            >
            <Button
            type="text"
            block
            size="small"
            >
              Delete tag
            </Button>
          </Popconfirm>
        ),
        icon: <FontAwesomeIcon icon={faTrash} />,
        danger: true,
      },
      {
        key: 'hide',
        label: (
          <Button
          type="text"
          block
          size="small"
          >
          {active ? 'Hide' : 'Show'} tag
          </Button>
        ),
        icon: <HideButton />,
        onClick: hideHandler,
      }
      // {
      //   key: 'add-tag',
      //   label: (
      //     <Button type="primary" block size="small" icon={<FontAwesomeIcon icon={faPlus} />} ghost>
      //       Add label
      //     </Button>
      //   ),
      //   icon: <FontAwesomeIcon icon={faTags} />,
      // },
      // {
      //   key: 'tags',
      //   label: (
      //     <Space wrap size={[0, 8]} style={{ maxWidth: 150 }}>
      //       <AntTag key="tag-1" color="red" closable>
      //         anime
      //       </AntTag>
      //       <AntTag key="tag-2" color="yellow" closable>
      //         photorealistic
      //       </AntTag>
      //       <AntTag key="tag-3" color="blue" closable>
      //         unstable
      //       </AntTag>
      //       <AntTag key="tag-4" color="green" closable>
      //         face
      //       </AntTag>
      //       <AntTag key="tag-5" color="purple" closable>
      //         eyes
      //       </AntTag>
      //     </Space>
      //   ),
      // },
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
    <SelectButton />,
    <FavoriteButton />,
    // <HideButton />,
    <SettingsButton />,
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
