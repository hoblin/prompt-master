// Helper functions for the frontend

// calculate size of image based on image_size, screen size, and number of columns with card container margins and column gaps
export const getImageSize = (image_size, columns) => {
  // Get width of layout .ant-layout-content
  const layout = document.querySelector('.ant-layout-content');
  // return 0 if layout is not found
  if (!layout) return image_size;
  // Get width of column based on layout width and number of columns
  const columnWidth = (layout.offsetWidth - 32 - ((columns - 1) * 16)) / columns;
  // Get image width based on image container margins
  const imageWidth = columnWidth - 49;
  // Get image height based on image width and image_size[w, h] aspect ratio
  const imageHeight = imageWidth * (image_size[1] / image_size[0]);
  return [parseInt(imageWidth), parseInt(imageHeight)];
}


// Get columns amount based on responsive breakpoints
export const getColumns = ({xs, sm, md}) => {
  if (md) {
    return 4;
  } else if (sm) {
    return 2;
  } else if (xs) {
    return 1;
  } else {
    return 4;
  }
}