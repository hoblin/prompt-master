// Download button for the wildcard builder
// Collects all the visible tags names and downloads them as a text file
// with one tag name per line

import React from 'react';
import { Button, Tooltip } from 'antd';
// fontawesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

// tags store
import { useTags, useCategory } from '../../pages/category/store';

const WildCardBuilder = () => {
  const tags = useTags();
  const category = useCategory();

  const download = () => {
    const tagNames = tags
      .map((tag) => tag.name)
      .join("\n");

    const element = document.createElement("a");
    const file = new Blob([tagNames], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${category.name}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <Tooltip title="Download all visible tags as a text file">
      <Button
        type="primary"
        onClick={download}
        icon={<FontAwesomeIcon icon={faDownload} />}
      />
    </Tooltip>
  );
};

export default WildCardBuilder;