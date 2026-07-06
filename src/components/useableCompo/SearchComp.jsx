
/* eslint-disable react/prop-types */
import { AudioOutlined } from "@ant-design/icons";
import { Input } from "antd";

const SearchComp = ({
  setSearchTerm,
  style,
  placeholder = "Search invoice",
  ...remaining
}) => {
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#93278F",
      }}
    />
  );
  return (
    <div style={{ ...style }}>
      <Input.Search
        placeholder={placeholder}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="middle"
        allowClear
        enterButton
        className="w-64"
        suffix={suffix}
      />
    </div>
  );
};

export default SearchComp;
