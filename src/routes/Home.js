import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from 'fbase';
import Nweet from 'components/Nweet';

const Home = ({ userObj }) => {
  // input창에서 입력하는 값, form을 위한 state이다
  const [nweet, setNweet] = useState('');

  // 파이어스토어에 있는 값 가져오기 위한 props
  const [nweets, setNweets] = useState([]);
  // 사진 url을 state에 넣기
  const [attachment, setAttachment] = useState('');

  // nweets는 우리가 페이지를 불러올 때 snapshot에서 나온다.
  // snapshot에서 나온 nweets를 map으로 돌린다
  // 이렇게 하면 forEach를 한것 보다 좋다 re-render를 하지 않아서 빠르게 실행 되기 때문이다
  // snapshot을 사용하였기 때문에 실시간으로 페이지에서 업데이트가 이뤄진다
  useEffect(() => {
    // getNeewts();
    dbService.collection('nweets').onSnapshot((snapshot) => {
      const nweetArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    let attachmentUrl = '';
    if (attachment !== '') {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, 'data_url');
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    // // 파이어스토어에 nweets라는 컬렉션을 만들고 값들을 넣어줌
    await dbService.collection('nweets').add(nweetObj);
    setNweet(''); //인풋창 빈칸으로 다시 만들어줌
    setAttachment('');
  };

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setNweet(value);
  };

  // event 안에서 target 안으로 가서 파일을 받아오게함
  const onFileChange = (e) => {
    const {
      target: { files },
    } = e;
    const theFile = files[0];
    // 파일을 가지고 reader를 만든 다음, readAsDataURL을 사용해서 파일을 읽을 것이다
    const reader = new FileReader();
    //reader에 이벤트 리스너 추가해줌
    //파일 로딩이 끝나게 되면 finishedEvent를 갖게 된다
    reader.onloadend = (finishedEvent) => {
      // onloadend에 ficishedEvent의 result를 setAttachment로 설정
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //여기에서 파일을 읽기 시작하고 끝나면 데이터를 얻게 된다
  };

  const onClearAttachment = () => setAttachment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          type="text"
          onChange={onChange}
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" alt="attachImg" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
      </form>
      {/* 페이지에 출력 */}
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet} //nwettObj는 nweet의 모든 데이터 이다
            isOwner={nweet.creatorId === userObj.uid} //다이나믹한 propr 때론 true, 때론 false
            //nweet을 만든사람(nweet.creatorId)과 userObj.uid가 같으면 true
          />
        ))}
      </div>
    </div>
  );
};
export default Home;

// onsnapshot은 데이터의 변화를 실시간으로 알려주는 리스너 이다

/*  nweets받는 방식인데 옛날 방식이다
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
*/

// uuid 설치 : 기본적으로 어떤 특별한 식별자를 랜덤으로 생성해준다.
