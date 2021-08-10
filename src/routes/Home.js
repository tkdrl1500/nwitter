import React, { useEffect, useState } from 'react';
import { dbService } from 'fbase';

const Home = () => {
  const [nweet, setNweet] = useState('');
  // 파이어스토어에 있는 값 가져오기 위한 props
  const [nweets, setNweets] = useState([]);
  const getNeewts = async () => {
    const dbNweets = await dbService.collection('nweets').get();
    // set이 붙는 함수를 쓸 때, 값 대신 함수를 전달할 수 있다
    // 함수를 전달하면, 리액트는 이전 값에 접근할 수 있게 해준다
    // 모든 이전 nweets(previous)에 대해, 배열을 리턴 할건데, 그 배열은 새로 작성한 트윗과, 그 이전 것들이다
    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };
  useEffect(() => {
    getNeewts();
  }, []);
  const onSubmit = async (e) => {
    e.preventDefault();
    // 파이어스토어에 nweets라는 컬렉션을 만들고 값들을 넣어줌
    await dbService.collection('nweets').add({
      nweet,
      createdAt: Date.now(),
    });
    setNweet('');
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
