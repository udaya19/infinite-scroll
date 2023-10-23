import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

const InfiniteScroll = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = useCallback(async () => {
    setLoading(true);
    const data = await axios.get(
      `https://openlibrary.org/search.json?q=${query}&pageNumber=${page}`
    );
    setData((prevData) => [...prevData, ...data.data.docs]);
    setLoading(false);
  }, [query, page]);

  const handleScroll = useCallback(async () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPage(page + 1);
      await getData();
    }
  }, [page, getData]);

  useEffect(() => {
    getData();
  }, [query, getData, page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, handleScroll]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {data.map((d, index) => (
        <p key={index}>{d.title}</p>
      ))}
      {loading && "LOADING"}
    </div>
  );
};

export default InfiniteScroll;
