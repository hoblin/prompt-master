// search component for header
import React, { useRef, useState, useEffect } from 'react';
import { Input } from 'antd';
import { useDebounce } from 'ahooks';

// filter store
import { useFilters, useSetFilters } from '../../pages/category/store';

const Search = () => {
  const [value, setValue] = useState('');
  const [searching, setSearching] = useState(false);
  const filters = useFilters();
  const setFilters = useSetFilters();

  const debouncedValue = useDebounce(value, { wait: 800 });
  const inputRef = useRef(null);

  const onChange = (_e) => {
    const newValue = inputRef.current.input.value;
    if (value === newValue) return;
    onSearch(newValue);
  };

  const onSearch = (value) => {
    setSearching(true);
    setValue(value);
  };

  useEffect(() => {
    setSearching(false);
    setFilters({ ...filters, name: debouncedValue });
  }, [debouncedValue, filters, setFilters]);

  return (
    <Input.Search
      ref={inputRef}
      style={{ width: 300 }}
      onChange={onChange}
      enterButton={false}
      size="large"
      loading={searching}
      allowClear={true}
      onSearch={onSearch}
    />
  );
}

export default Search;
