// field displaying comma separated selected tags
// with copy-to-clipboard button and clear button
import React, { useState } from 'react';
import { Button, Badge, Tooltip, Tag, Divider, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';

// tags store
import { useSelectedTags, useSelectTag } from '../../pages/category/store';

import theme from '../../theme';
const {
    colorPrimary,
    // colorTextQuaternary: colorQuaternary,
  } = theme.token;

const SelectedTags = () => {
  const selectedTags = useSelectedTags();
  const deselectTag = useSelectTag();

  const [copied, setCopied] = useState(false);

  const tagNames = selectedTags.map((tag) => tag.name).join(", ");

  const deselectTags = () => {
    selectedTags.forEach((tag) => deselectTag(tag));
  };

  const copyHandler = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const CopyButton = () => (
    <CopyToClipboard text={tagNames} onCopy={copyHandler}>
      <Tooltip title={copied ? 'Copied' : 'Copy collection'} placement="bottom">
        <Badge count={selectedTags.length}>
          <Button
            icon={<FontAwesomeIcon icon={faCopy} />}
          />
        </Badge>
      </Tooltip>
    </CopyToClipboard>
  );

  const ClearButton = () => (
    <Tooltip title="Clear collection" placement="bottom">
      <>
        <Button
          icon={<FontAwesomeIcon icon={faCircleXmark} />}
          onClick={() => deselectTags()}
        />
      </>
    </Tooltip>
  );

  if (selectedTags.length > 0) {
    return (
      <Space>
        <Divider type="vertical" />
        <CopyButton />
        <ClearButton />
      </Space>
    );
  }

  return null;
}

export default SelectedTags;
